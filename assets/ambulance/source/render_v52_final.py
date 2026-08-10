#!/usr/bin/env python3
import argparse, math, os, struct, json
from pathlib import Path
from collections import defaultdict
import vtk
import trimesh
from PIL import Image, ImageDraw
import numpy as np

TOTAL=180
MODEL='/mnt/data/mercedes-benz_sprinter.glb'
LOGO='/mnt/data/v52_work/canby-logo-transparent.png'
SCALE=0.03
BLUE=(0.025,0.31,0.69)
GREEN=(0.02,0.60,0.22)
CYAN=(0.08,0.72,1.0)


def clamp(v,a=0,b=1): return max(a,min(b,v))
def smooth(t):
    t=clamp(t); return t*t*(3-2*t)
def smoother(t):
    t=clamp(t); return t*t*t*(t*(t*6-15)+10)
def lerp(a,b,t): return a+(b-a)*t
def mix3(a,b,t): return tuple(lerp(a[i],b[i],t) for i in range(3))
def seg(f,a,b): return clamp((f-a)/(b-a))
def interp(f,keys):
    if f<=keys[0][0]: return keys[0][1]
    if f>=keys[-1][0]: return keys[-1][1]
    for (f0,v0),(f1,v1) in zip(keys,keys[1:]):
        if f0<=f<=f1:
            t=smoother((f-f0)/(f1-f0))
            if isinstance(v0,(tuple,list)):
                return tuple(lerp(v0[i],v1[i],t) for i in range(len(v0)))
            return lerp(v0,v1,t)
    return keys[-1][1]


def set_pbr(actor,color=(.9,.9,.9),metal=.05,rough=.28,opacity=1.0,ambient=.10):
    p=actor.GetProperty(); p.SetColor(*color); p.SetOpacity(opacity)
    try:
        p.SetInterpolationToPBR(); p.SetMetallic(metal); p.SetRoughness(rough)
    except Exception:
        p.SetInterpolationToPhong(); p.SetSpecular(.6); p.SetSpecularPower(70)
    p.SetAmbient(ambient); p.SetDiffuse(.92)
    return p


def cube(center,size,color,metal=0,rough=.4,opacity=1.0,name=''):
    s=vtk.vtkCubeSource(); s.SetCenter(*center); s.SetXLength(size[0]); s.SetYLength(size[1]); s.SetZLength(size[2]); s.Update()
    m=vtk.vtkPolyDataMapper(); m.SetInputConnection(s.GetOutputPort())
    a=vtk.vtkActor(); a.SetMapper(m); a.SetObjectName(name); set_pbr(a,color,metal,rough,opacity)
    return a


def wire_cube(center,size,color=CYAN,opacity=0.0,name='digital outline'):
    s=vtk.vtkCubeSource(); s.SetCenter(*center); s.SetXLength(size[0]); s.SetYLength(size[1]); s.SetZLength(size[2]); s.Update()
    m=vtk.vtkPolyDataMapper(); m.SetInputConnection(s.GetOutputPort())
    a=vtk.vtkActor(); a.SetMapper(m); a.SetObjectName(name); p=a.GetProperty(); p.SetRepresentationToWireframe(); p.SetColor(*color); p.SetOpacity(opacity); p.SetLineWidth(1.1); p.LightingOff(); return a

def sphere(center,radius,color,ambient=1.0):
    s=vtk.vtkSphereSource(); s.SetCenter(*center); s.SetRadius(radius); s.SetThetaResolution(96); s.SetPhiResolution(64); s.Update()
    m=vtk.vtkPolyDataMapper(); m.SetInputConnection(s.GetOutputPort())
    a=vtk.vtkActor(); a.SetMapper(m); p=set_pbr(a,color,0,.05,1,ambient); p.SetDiffuse(.15); return a


def plane_x(points,color,opacity=1,metal=0,rough=.28,name=''):
    # points tuples (y,z) at constant x stored separately via first item if 3d
    pts=vtk.vtkPoints()
    for p in points: pts.InsertNextPoint(*p)
    poly=vtk.vtkPolygon(); poly.GetPointIds().SetNumberOfIds(len(points))
    for i in range(len(points)): poly.GetPointIds().SetId(i,i)
    ca=vtk.vtkCellArray(); ca.InsertNextCell(poly)
    pd=vtk.vtkPolyData(); pd.SetPoints(pts); pd.SetPolys(ca)
    mapper=vtk.vtkPolyDataMapper(); mapper.SetInputData(pd)
    a=vtk.vtkActor(); a.SetMapper(mapper); a.SetObjectName(name); set_pbr(a,color,metal,rough,opacity)
    return a


def textured_quad_x(image_path,x,y0,y1,z0,z1,flip=False,name='decal'):
    pts=vtk.vtkPoints(); pts.InsertNextPoint(x,y0,z0); pts.InsertNextPoint(x,y0,z1); pts.InsertNextPoint(x,y1,z1); pts.InsertNextPoint(x,y1,z0)
    q=vtk.vtkPolygon(); q.GetPointIds().SetNumberOfIds(4)
    for i in range(4): q.GetPointIds().SetId(i,i)
    ca=vtk.vtkCellArray(); ca.InsertNextCell(q)
    pd=vtk.vtkPolyData(); pd.SetPoints(pts); pd.SetPolys(ca)
    tc=vtk.vtkFloatArray(); tc.SetNumberOfComponents(2); tc.SetName('TextureCoordinates')
    uvs=[(1,0),(0,0),(0,1),(1,1)] if flip else [(0,0),(1,0),(1,1),(0,1)]
    for uv in uvs: tc.InsertNextTuple2(*uv)
    pd.GetPointData().SetTCoords(tc)
    m=vtk.vtkPolyDataMapper(); m.SetInputData(pd)
    a=vtk.vtkActor(); a.SetMapper(m); a.SetObjectName(name)
    r=vtk.vtkPNGReader(); r.SetFileName(str(image_path)); r.Update()
    tex=vtk.vtkTexture(); tex.SetInputConnection(r.GetOutputPort()); tex.InterpolateOn(); tex.MipmapOn(); tex.SetBlendingMode(vtk.vtkTexture.VTK_TEXTURE_BLENDING_MODE_REPLACE); a.SetTexture(tex)
    a.ForceTranslucentOn(); p=a.GetProperty(); p.LightingOff(); p.SetOpacity(1.0)
    return a


def textured_quad_z(image_path,z,x0,x1,y0,y1,name='rear decal'):
    pts=vtk.vtkPoints(); pts.InsertNextPoint(x0,y0,z); pts.InsertNextPoint(x1,y0,z); pts.InsertNextPoint(x1,y1,z); pts.InsertNextPoint(x0,y1,z)
    q=vtk.vtkPolygon(); q.GetPointIds().SetNumberOfIds(4)
    for i in range(4): q.GetPointIds().SetId(i,i)
    ca=vtk.vtkCellArray(); ca.InsertNextCell(q)
    pd=vtk.vtkPolyData(); pd.SetPoints(pts); pd.SetPolys(ca)
    tc=vtk.vtkFloatArray(); tc.SetNumberOfComponents(2); tc.SetName('TextureCoordinates')
    for uv in [(1,0),(0,0),(0,1),(1,1)]: tc.InsertNextTuple2(*uv)
    pd.GetPointData().SetTCoords(tc)
    m=vtk.vtkPolyDataMapper(); m.SetInputData(pd)
    a=vtk.vtkActor(); a.SetMapper(m); a.SetObjectName(name)
    r=vtk.vtkPNGReader(); r.SetFileName(str(image_path)); r.Update(); tex=vtk.vtkTexture(); tex.SetInputConnection(r.GetOutputPort()); tex.InterpolateOn(); tex.MipmapOn(); tex.SetBlendingMode(vtk.vtkTexture.VTK_TEXTURE_BLENDING_MODE_REPLACE); a.SetTexture(tex)
    a.ForceTranslucentOn(); p=a.GetProperty(); p.LightingOff(); return a


def parse_desc_map():
    data=Path(MODEL).read_bytes(); off=12; js=None
    while off<len(data):
        ln, typ=struct.unpack_from('<II',data,off); off+=8; chunk=data[off:off+ln]; off+=ln
        if typ==0x4E4F534A: js=json.loads(chunk.rstrip(b'\x00 ').decode('utf8')); break
    parent={}
    for i,n in enumerate(js['nodes']):
        for c in n.get('children',[]) or []: parent[c]=i
    sc=trimesh.load(MODEL,force='scene')
    geom_desc={}
    geom_group={}
    for node in sc.graph.nodes_geometry:
        try: idx=int(node.split('_')[1])
        except: continue
        p=parent.get(idx); desc=js['nodes'][p].get('name','') if p is not None else ''
        tf,geom_name=sc.graph.get(node)
        geom_desc[geom_name]=desc
        for gr in ['Group1','Group7','Group8','Group9']:
            if gr in desc: geom_group[geom_name]=gr
    return sc,geom_desc,geom_group


def style_for(desc,mat_name=''):
    d=desc.lower(); m=mat_name.lower()
    if 'carpaint' in d:
        return ((.965,.975,.985),.10,.20,1.0,.14)
    if 'tire' in d:
        return ((.018,.019,.021),.0,.78,1.0,.05)
    if 'rim' in d or 'chrome' in d:
        return ((.58,.62,.66),.93,.10,1.0,.10)
    if 'glass_black' in d or 'windows' in d or 'side_window' in d:
        return ((.018,.032,.052),.14,.08,.92,.06)
    if 'black_plastic' in d:
        return ((.025,.028,.032),.0,.63,1.0,.06)
    if 'interior' in d:
        return ((.07,.075,.08),.05,.54,1.0,.06)
    if 'headlights' in d:
        return ((.92,.95,1.0),.18,.08,.88,.55)
    if 'taillight' in d or 'light_red' in d:
        return ((.78,.015,.01),.08,.12,.95,.72)
    if 'mirror' in d:
        return ((.12,.13,.14),.72,.11,1.0,.08)
    if 'color_b' in m or 'frontcolor' in m:
        return ((.48,.51,.55),.84,.14,1.0,.08)
    return ((.16,.17,.18),.24,.34,1.0,.07)


def import_vehicle(ren,rw,logo):
    sc,geom_desc,geom_group=parse_desc_map()
    imp=vtk.vtkGLTFImporter(); imp.SetFileName(MODEL); imp.SetRenderWindow(rw); imp.Update()
    ac=ren.GetActors(); ac.InitTraversal(); imported=[]
    for _ in range(ac.GetNumberOfItems()): imported.append(ac.GetNextActor())
    geom_keys=list(sc.geometry.keys())
    base=vtk.vtkAssembly(); wire=vtk.vtkAssembly(); wire_props=[]; base_props=[]
    wheel_assemblies={g:vtk.vtkAssembly() for g in ['Group1','Group7','Group8','Group9']}
    wheel_bounds={g:[] for g in wheel_assemblies}
    decals=[]
    for i,a in enumerate(imported):
        ren.RemoveActor(a)
        gi=len(geom_keys)-1-i
        geom_name=geom_keys[gi]
        desc=geom_desc.get(geom_name,'')
        geom=sc.geometry[geom_name]
        mat=getattr(getattr(geom,'visual',None),'material',None); mn=(getattr(mat,'name','') or '')
        color,metal,rough,opacity,ambient=style_for(desc,mn)
        p=set_pbr(a,color,metal,rough,opacity,ambient); base_props.append(p); a.SetObjectName(desc)
        gr=geom_group.get(geom_name)
        if gr and ('tire' in desc.lower() or 'rim' in desc.lower()):
            wheel_assemblies[gr].AddPart(a); wheel_bounds[gr].append(a.GetBounds())
        else:
            base.AddPart(a)
        wa=vtk.vtkActor(); wa.SetMapper(a.GetMapper()); _mx=vtk.vtkMatrix4x4(); _mx.DeepCopy(a.GetMatrix()); wa.SetUserMatrix(_mx); wp=wa.GetProperty(); wp.SetRepresentationToWireframe(); wp.SetColor(*CYAN); wp.SetOpacity(0); wp.SetLineWidth(1.3); wp.LightingOff(); wire.AddPart(wa); wire_props.append(wp)

    # Add each complete wheel set back to base with correct rotation center
    wheel_centers={}
    for gr,w in wheel_assemblies.items():
        bs=wheel_bounds[gr]
        if bs:
            xmin=min(b[0] for b in bs); xmax=max(b[1] for b in bs); ymin=min(b[2] for b in bs); ymax=max(b[3] for b in bs); zmin=min(b[4] for b in bs); zmax=max(b[5] for b in bs)
            c=((xmin+xmax)/2,(ymin+ymax)/2,(zmin+zmax)/2); w.SetOrigin(*c); wheel_centers[gr]=c
        base.AddPart(w)

    # Physical livery planes follow the side body. Slightly offset to avoid z-fighting.
    for x,flip in [(-50.95,False),(50.95,True)]:
        # rear -> front, diagonal rise toward cab
        blue_pts=[(x,28,-108),(x,28,72),(x,35,84),(x,35,-108)]
        green_pts=[(x,36.5,-108),(x,36.5,70),(x,41,80),(x,41,-108)]
        b=plane_x(blue_pts,BLUE,1,0,.22,'Canby blue stripe'); g=plane_x(green_pts,GREEN,1,0,.23,'Canby green stripe')
        base.AddPart(b); base.AddPart(g); decals += [b,g]
        lg=textured_quad_x(logo,x-0.32 if x<0 else x+0.32,51,72,-58,18,flip,'Canby side logo'); base.AddPart(lg); decals.append(lg)
    # rear wrap bands
    b=plane_x([(-50.2,28,-121.25),(50.2,28,-121.25),(50.2,35,-121.25),(-50.2,35,-121.25)],BLUE,1,0,.22,'rear blue')
    g=plane_x([(-50.2,36.5,-121.35),(50.2,36.5,-121.35),(50.2,41,-121.35),(-50.2,41,-121.35)],GREEN,1,0,.22,'rear green')
    base.AddPart(b); base.AddPart(g); decals += [b,g]
    rear=textured_quad_z(logo,-121.65,-28,28,51,70); base.AddPart(rear); decals.append(rear)

    # Proper roof lightbar attached to roof, plus corner modules.
    lightbar=cube((0,108.0,37),(72,4.2,9.0),(.05,.06,.07),.40,.18,1,'roof lightbar housing'); base.AddPart(lightbar)
    for x,col in [(-28,(.95,.02,.02)),(-10,(.04,.30,1.0)),(10,(.04,.30,1.0)),(28,(.95,.02,.02))]:
        a=cube((x,110.3,37),(13,3.5,6.8),col,.02,.08,1,'emergency lens'); pp=a.GetProperty(); pp.SetAmbient(1); pp.SetDiffuse(.35); base.AddPart(a)

    # Scale whole imported vehicle and livery into meter-ish scene.
    base.SetScale(SCALE,SCALE,SCALE); wire.SetScale(SCALE,SCALE,SCALE)
    ren.AddActor(base); ren.AddActor(wire)
    return {'base':base,'wire':wire,'wire_props':wire_props,'base_props':base_props,'wheels':wheel_assemblies,'wheel_centers':wheel_centers,'decals':decals}


def add_world(ren,actor,env=True,arr=None):
    ren.AddActor(actor)
    if env and arr is not None: arr.append(actor)
    return actor


def setup_world(ren):
    env=[]; digital=[]
    # expansive asphalt yard
    road=add_world(ren,cube((0,-.12,8),(34,.22,100),(.024,.026,.030),.18,.24,1,'asphalt'),True,env)
    # lane / parking lines
    for z in np.arange(-40,48,7.5):
        add_world(ren,cube((-1.0,.015,float(z)),(.11,.025,3.7),(.72,.61,.39),.12,.28,1,'lane marker'),True,env)
    # long terminal warehouse, camera-facing side at x~10
    wh=add_world(ren,cube((12,3.15,7),(5.2,6.3,80),(.065,.061,.060),.10,.50,1,'terminal warehouse'),True,env)
    add_world(ren,cube((12,6.55,7),(5.6,.45,82),(.03,.03,.032),.22,.34,1,'roof cap'),True,env)
    # loading bays, canopies, lamps, parked trailers
    for i,z in enumerate(np.arange(-31,40,8.0)):
        add_world(ren,cube((9.36,1.75,float(z)),(.16,3.3,4.7),(.014,.015,.017),.08,.45,1,'dock door'),True,env)
        add_world(ren,cube((8.9,3.55,float(z)),(1.0,.18,5.0),(.11,.105,.10),.35,.25,1,'dock canopy'),True,env)
        # dock light lens
        lamp=cube((8.80,3.95,float(z)),(.25,.18,.65),(1.0,.63,.30),.0,.1,1,'dock lamp'); lamp.GetProperty().SetAmbient(1); add_world(ren,lamp,True,env)
        if i in {1,4,7}:
            # trailer perpendicular to warehouse, doors near wall
            add_world(ren,cube((5.4,1.65,float(z)+.3),(6.5,3.3,2.55),(.16,.15,.15),.12,.36,1,'parked trailer'),True,env)
            add_world(ren,cube((2.15,1.7,float(z)+.3),(.18,3.25,2.5),(.045,.045,.048),.12,.35,1,'trailer rear'),True,env)
    # foreground parallax: concrete blocks + light poles
    for z in [-26,-9,10,27]:
        add_world(ren,cube((-6.8,.20,z),(1.0,.38,2.4),(.055,.055,.058),.15,.48,1,'foreground barrier'),True,env)
    for z in [-35,-5,25,43]:
        add_world(ren,cube((-4.5,3.2,z),(.12,6.4,.12),(.10,.10,.11),.75,.18,1,'light pole'),True,env)
        lum=cube((-4.5,6.5,z),(1.7,.12,.45),(1.0,.74,.42),.0,.08,1,'yard light'); lum.GetProperty().SetAmbient(1); add_world(ren,lum,True,env)
    # distant stacks / containers to fill horizon
    for i,z in enumerate(range(-42,48,9)):
        col=[(.16,.095,.07),(.075,.095,.12),(.13,.12,.11)][i%3]
        add_world(ren,cube((17,1.55,z),(4.5,3.1,7.7),col,.08,.5,1,'container'),True,env)
    # sunset sun disk beyond terminal gap
    # Reference opening is a clean dusk gradient; omit a literal sun disk to avoid a graphic artifact.
    sun=sphere((24,6.7,-24),3.0,(1.0,.52,.16),1.0); sun.SetObjectName('sun'); sun.SetVisibility(0); add_world(ren,sun,True,env)
    # digital ground grid lines, invisible except tech phase
    for x in np.arange(-6,7,1.5):
        a=cube((x,.035,9),(.025,.02,70),CYAN,0,.15,0,'digital grid'); a.GetProperty().LightingOff(); ren.AddActor(a); digital.append(a)
    for z in np.arange(-28,42,4):
        a=cube((0,.036,z),(14,.02,.025),CYAN,0,.15,0,'digital grid'); a.GetProperty().LightingOff(); ren.AddActor(a); digital.append(a)
    # digital yard / dock outlines like Terminal's technical visualization
    dw=wire_cube((12,3.15,7),(5.2,6.3,80),CYAN,0,'digital warehouse'); ren.AddActor(dw); digital.append(dw)
    for z in np.arange(-31,40,8.0):
        d=wire_cube((9.25,1.75,float(z)),(.25,3.3,4.7),CYAN,0,'digital dock'); ren.AddActor(d); digital.append(d)
    for z in [-20,4,28]:
        t=wire_cube((5.2,1.65,z),(6.4,3.3,2.55),CYAN,0,'digital trailer'); ren.AddActor(t); digital.append(t)
    # scan gates
    for z in [-4,7,18]:
        a=cube((0,1.6,z),(8,.03,.03),CYAN,0,.1,0,'scan bar'); a.GetProperty().LightingOff(); ren.AddActor(a); digital.append(a)
    return env,digital,road


def setup(W,H):
    ren=vtk.vtkRenderer(); ren.GradientBackgroundOn(); ren.SetBackground(.99,.62,.34); ren.SetBackground2(.52,.32,.43)
    pass
    rw=vtk.vtkRenderWindow(); rw.SetOffScreenRendering(1); rw.SetSize(W,H); rw.SetMultiSamples(0); rw.AddRenderer(ren)
    vehicle=import_vehicle(ren,rw,LOGO)
    env,digital,road=setup_world(ren)
    # cinematic light rig
    sun=vtk.vtkLight(); sun.SetLightTypeToSceneLight(); sun.SetPosition(-12,16,-20); sun.SetFocalPoint(0,1,8); sun.SetColor(1.0,.58,.28); sun.SetIntensity(1.45); ren.AddLight(sun)
    fill=vtk.vtkLight(); fill.SetLightTypeToSceneLight(); fill.SetPosition(-8,5,18); fill.SetFocalPoint(0,1,5); fill.SetColor(.30,.48,.80); fill.SetIntensity(.52); ren.AddLight(fill)
    rim=vtk.vtkLight(); rim.SetLightTypeToSceneLight(); rim.SetPosition(13,10,4); rim.SetFocalPoint(0,1,8); rim.SetColor(1.0,.78,.50); rim.SetIntensity(1.15); ren.AddLight(rim)
    top=vtk.vtkLight(); top.SetLightTypeToSceneLight(); top.SetPosition(1,14,15); top.SetFocalPoint(0,0,15); top.SetColor(.70,.78,1.0); top.SetIntensity(.42); ren.AddLight(top)
    head=[]
    for xx in (-.55,.55):
        l=vtk.vtkLight(); l.SetLightTypeToSceneLight(); l.SetPositional(True); l.SetConeAngle(22); l.SetColor(1.0,.88,.67); l.SetIntensity(.85); ren.AddLight(l); head.append((l,xx))
    return ren,rw,vehicle,env,digital,road,{'sun':sun,'fill':fill,'rim':rim,'top':top,'head':head}


def state(f,aspect='desktop'):
    # Shot map follows Rejouice/Terminal structure: clean side hero -> close terminal pass -> digital/wireframe -> aerial yard -> white handoff.
    vz=interp(f,[(0,-7.5),(24,-2.5),(50,4.5),(76,10.5),(100,15.5),(122,20.0),(145,24.0),(162,27.0),(179,30.0)])
    yaw=interp(f,[(0,0),(120,0),(142,-3),(158,-10),(179,-19)])
    if aspect=='desktop':
        cam=interp(f,[(0,(-12.6,1.72,-5.8)),(28,(-11.2,1.60,-4.6)),(55,(-9.5,1.48,-1.8)),(82,(-8.3,1.42,2.8)),(105,(-7.8,1.52,6.2)),(122,(-8.5,2.4,9.0)),(138,(-6.2,6.6,12.3)),(150,(-2.5,12.8,16.0)),(160,(-4.8,8.0,16.8)),(179,(-9.5,3.0,18.0))])
        look=interp(f,[(0,(0,1.35,-6.3)),(28,(0,1.35,-.8)),(55,(0,1.35,5.3)),(82,(0,1.32,11.5)),(105,(0,1.28,16.2)),(122,(0,1.20,19.5)),(138,(2.0,1.0,22.0)),(150,(6.0,.45,24.0)),(160,(3.2,.9,25.0)),(179,(0,1.3,28.0))])
        angle=interp(f,[(0,28),(45,24),(78,23),(104,25),(122,29),(138,39),(150,46),(160,39),(179,29)])
    else:
        cam=interp(f,[(0,(-6.8,2.0,-6.4)),(28,(-6.5,1.9,-4.8)),(55,(-5.8,1.75,-1.7)),(82,(-5.3,1.75,2.8)),(105,(-5.1,2.0,6.2)),(122,(-5.8,3.2,9.0)),(138,(-4.5,6.8,12.2)),(150,(-2.2,10.8,15.4)),(160,(-4.2,7.1,16.2)),(179,(-6.3,3.5,18.2))])
        look=interp(f,[(0,(0,1.5,-6.5)),(28,(0,1.45,-.8)),(55,(0,1.42,5.3)),(82,(0,1.38,11.5)),(105,(0,1.30,16.2)),(122,(0,1.2,19.5)),(138,(1.5,1.0,22)),(150,(5.0,.6,24.0)),(160,(2.5,1.0,25)),(179,(0,1.4,28))])
        angle=interp(f,[(0,43),(45,42),(80,42),(108,46),(125,50),(150,57),(179,46)])
    # industrial world fades in after the minimal side-profile hero.
    industrial=smoother(seg(f,48,78))
    # technical mode mirrors Terminal's photographed-to-wireframe treatment.
    wire_in=smoother(seg(f,96,108)); wire_out=1-smoother(seg(f,136,148)); wire=wire_in*wire_out
    white=smoother(seg(f,154,179))
    return vz,yaw,cam,look,angle,wire,white,industrial

def update(f,aspect,ren,veh,env,digital,road,L):
    vz,yaw,campos,look,angle,wire,white,industrial=state(f,aspect)
    veh['base'].SetPosition(0,0,vz); veh['wire'].SetPosition(0,0,vz)
    veh['base'].SetOrientation(0,yaw,0); veh['wire'].SetOrientation(0,yaw,0)
    # wheels spin based on actual vehicle travel; origin set at each wheel center
    spin=-(vz+17)/0.52*180/math.pi
    for w in veh['wheels'].values(): w.SetOrientation(spin,0,0)
    # technical wireframe overlay
    for p in veh['wire_props']: p.SetOpacity(.92*wire)
    for p in veh['base_props']:
        # keep real vehicle visible but ghost it during peak wireframe
        try: p.SetOpacity(1-.82*wire)
        except: pass
    for a in veh['decals']:
        try: a.GetProperty().SetOpacity(1-.70*wire)
        except: pass
    for i,a in enumerate(digital):
        pulse=.16+.30*(.5+.5*math.sin((f+i)*.23))
        a.GetProperty().SetOpacity(wire*(.20+.28*pulse))
    # sunset -> clinical white rendered transition
    bg1=mix3((.99,.62,.34),(.008,.014,.020),wire); bg2=mix3((.52,.32,.43),(.003,.007,.012),wire); ren.SetBackground(*mix3(bg1,(1,1,1),white)); ren.SetBackground2(*mix3(bg2,(1,1,1),white))
    for a in env:
        name=(a.GetObjectName() or '').lower()
        if a is road:
            a.GetProperty().SetColor(*mix3(mix3((.018,.018,.020),(.018,.022,.027),industrial),(.935,.945,.955),white)); a.GetProperty().SetOpacity(1)
        elif name=='sun':
            a.GetProperty().SetOpacity((1-.92*wire)*(1-white))
        else:
            # clean horizon for the opening; terminal yard resolves as the camera approaches it
            op=industrial*(1-.90*wire)*(1-.96*white)
            a.GetProperty().SetOpacity(op)
    L['sun'].SetIntensity((1.45*(1-.78*wire))+1.3*white); L['sun'].SetColor(*mix3((1,.58,.28),(1,1,1),white))
    L['fill'].SetIntensity((.52*(1-.65*wire))+1.0*white); L['fill'].SetColor(*mix3((.30,.48,.80),(1,1,1),white))
    L['rim'].SetIntensity((1.15*(1-.70*wire))+1.2*white); L['rim'].SetColor(*mix3((1,.78,.50),(1,1,1),white))
    L['top'].SetIntensity((.42*(1-.65*wire))+1.0*white)
    # headlights track true moving front (+Z before yaw approximation)
    for l,xx in L['head']:
        l.SetPosition(xx,1.05,vz+3.8); l.SetFocalPoint(xx,.7,vz+13); l.SetIntensity(.85*(1-white))
    if white > .995:
        # Absolute white handoff: nothing from the 3D scene survives into the homepage transition frame.
        veh['base'].SetVisibility(0); veh['wire'].SetVisibility(0)
        for a in env + digital:
            a.SetVisibility(0)
    else:
        veh['base'].SetVisibility(1); veh['wire'].SetVisibility(1)
        for a in env + digital:
            if (a.GetObjectName() or '').lower() == 'sun':
                a.SetVisibility(0)
            else:
                a.SetVisibility(1)
    c=ren.GetActiveCamera(); c.SetPosition(*campos); c.SetFocalPoint(*look); c.SetViewUp(0,1,0); c.SetViewAngle(angle); c.SetClippingRange(.05,140)


def render(rw,path):
    rw.Render(); w=vtk.vtkWindowToImageFilter(); w.SetInput(rw); w.SetInputBufferTypeToRGB(); w.ReadFrontBufferOff(); w.Update()
    wr=vtk.vtkPNGWriter(); wr.SetFileName(str(path)); wr.SetInputConnection(w.GetOutputPort()); wr.Write()


def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--out',required=True); ap.add_argument('--aspect',choices=['desktop','mobile'],default='desktop'); ap.add_argument('--mode',choices=['checkpoints','full'],default='checkpoints'); ap.add_argument('--width',type=int); ap.add_argument('--height',type=int); ap.add_argument('--start',type=int,default=0); ap.add_argument('--end',type=int,default=179)
    a=ap.parse_args(); out=Path(a.out); out.mkdir(parents=True,exist_ok=True)
    if a.width and a.height: W,H=a.width,a.height
    else: W,H=((1600,900) if a.aspect=='desktop' else (720,1280))
    ren,rw,veh,env,digital,road,L=setup(W,H)
    frames=[0,18,42,70,102,118,138,150,162,179] if a.mode=='checkpoints' else list(range(max(0,a.start),min(179,a.end)+1))
    for j,f in enumerate(frames):
        update(f,a.aspect,ren,veh,env,digital,road,L); p=out/f'frame_{f+1:03d}.png'; render(rw,p); print(j+1,'/',len(frames),p,flush=True)

if __name__=='__main__': main()
