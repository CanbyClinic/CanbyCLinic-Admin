#!/usr/bin/env python3
import argparse, math, os, struct, json
from pathlib import Path
from collections import defaultdict
import vtk
import trimesh
from PIL import Image, ImageDraw, ImageFont
import numpy as np

TOTAL=410
SOURCE_DIR=Path(__file__).resolve().parent
MODEL=str(SOURCE_DIR/'mercedes-benz_sprinter.glb')
LOGO=str(SOURCE_DIR/'canby-logo-transparent.png')
BUILDING_SIGN=str(SOURCE_DIR/'canby-building-sign.png')
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


def data_ribbon(points,color=(.72,.84,.94),opacity=0.0,name='data ribbon'):
    pts=vtk.vtkPoints()
    for point in points: pts.InsertNextPoint(*point)
    spline=vtk.vtkParametricSpline(); spline.SetPoints(pts)
    source=vtk.vtkParametricFunctionSource(); source.SetParametricFunction(spline); source.SetUResolution(180); source.Update()
    tube=vtk.vtkTubeFilter(); tube.SetInputConnection(source.GetOutputPort()); tube.SetRadius(.045); tube.SetNumberOfSides(12); tube.CappingOn(); tube.Update()
    mapper=vtk.vtkPolyDataMapper(); mapper.SetInputConnection(tube.GetOutputPort())
    actor=vtk.vtkActor(); actor.SetMapper(mapper); actor.SetObjectName(name)
    prop=actor.GetProperty(); prop.SetColor(*color); prop.SetOpacity(opacity); prop.SetAmbient(1); prop.SetDiffuse(.08); prop.SetSpecular(.2)
    return actor

def sphere(center,radius,color,ambient=1.0):
    s=vtk.vtkSphereSource(); s.SetCenter(*center); s.SetRadius(radius); s.SetThetaResolution(96); s.SetPhiResolution(64); s.Update()
    m=vtk.vtkPolyDataMapper(); m.SetInputConnection(s.GetOutputPort())
    a=vtk.vtkActor(); a.SetMapper(m); p=set_pbr(a,color,0,.05,1,ambient); p.SetDiffuse(.15); return a


def headlight_beam(center,length=190,radius=58):
    s=vtk.vtkSphereSource(); s.SetRadius(1); s.SetThetaResolution(48); s.SetPhiResolution(24); s.Update()
    m=vtk.vtkPolyDataMapper(); m.SetInputConnection(s.GetOutputPort())
    a=vtk.vtkActor(); a.SetMapper(m); a.SetPosition(*center); a.SetScale(radius,2,length*.52); a.SetObjectName('headlight pool')
    p=a.GetProperty(); p.SetColor(1.0,.84,.55); p.SetOpacity(.025); p.LightingOff()
    return a,p


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


def make_building_sign():
    canvas=Image.new('RGBA',(1400,280),(247,250,249,255))
    logo=Image.open(LOGO).convert('RGBA'); logo.thumbnail((360,190),Image.Resampling.LANCZOS)
    canvas.alpha_composite(logo,((360-logo.width)//2,45+(190-logo.height)//2))
    draw=ImageDraw.Draw(canvas)
    bold_path='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
    regular_path='/System/Library/Fonts/Supplemental/Arial.ttf'
    try:
        bold=ImageFont.truetype(bold_path,62); regular=ImageFont.truetype(regular_path,34)
    except OSError:
        bold=ImageFont.load_default(); regular=ImageFont.load_default()
    draw.text((390,60),'CANBY COMMUNITY CLINIC',font=bold,fill=(7,54,82,255))
    draw.text((393,145),'7601 Canby Ave #6B  |  Reseda, CA 91335  |  (818) 674-4414',font=regular,fill=(25,91,111,255))
    draw.rectangle((0,268,840,280),fill=(0,121,189,255)); draw.rectangle((840,268,1400,280),fill=(114,189,66,255))
    canvas.save(BUILDING_SIGN)


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
    decals=[]; beam_props=[]
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
    for x,flip in [(-50.2,False),(50.2,True)]:
        # rear -> front, diagonal rise toward cab
        blue_pts=[(x,29,-92),(x,29,35),(x,32.5,35),(x,32.5,-92)]
        green_pts=[(x,34,-92),(x,34,35),(x,37,35),(x,37,-92)]
        b=plane_x(blue_pts,BLUE,1,0,.22,'Canby blue stripe'); g=plane_x(green_pts,GREEN,1,0,.23,'Canby green stripe')
        base.AddPart(b); base.AddPart(g); decals += [b,g]
        lg=textured_quad_x(logo,x-0.24 if x<0 else x+0.24,52,68,-108,-58,flip,'Canby side logo'); base.AddPart(lg); decals.append(lg)
    rear=textured_quad_z(logo,-121.65,-28,28,51,70); base.AddPart(rear); decals.append(rear)

    # Proper roof lightbar attached to roof, plus corner modules.
    lightbar=cube((0,108.0,37),(58,3.0,7.0),(.05,.06,.07),.40,.18,1,'roof lightbar housing'); base.AddPart(lightbar)
    for x,col in [(-22,(.95,.02,.02)),(-7.5,(.04,.30,1.0)),(7.5,(.04,.30,1.0)),(22,(.95,.02,.02))]:
        a=cube((x,109.8,37),(11,2.4,5.2),col,.02,.08,1,'emergency lens'); pp=a.GetProperty(); pp.SetAmbient(1); pp.SetDiffuse(.35); base.AddPart(a)

    # Scale whole imported vehicle and livery into meter-ish scene.
    base.SetScale(SCALE,SCALE,SCALE); wire.SetScale(SCALE,SCALE,SCALE)
    ren.AddActor(base); ren.AddActor(wire)
    return {'base':base,'wire':wire,'wire_props':wire_props,'base_props':base_props,'wheels':wheel_assemblies,'wheel_centers':wheel_centers,'decals':decals,'beam_props':beam_props}


def add_world(ren,actor,env=True,arr=None):
    ren.AddActor(actor)
    if env and arr is not None: arr.append(actor)
    return actor


def container_unit(ren,env,center,size,color,name='container'):
    x,y,z=center; sx,sy,sz=size
    body=add_world(ren,cube(center,size,color,.12,.48,1,name),True,env)
    rail=tuple(min(1,c*1.24+.025) for c in color)
    face=x-sx/2-.018
    for zz in np.linspace(z-sz/2+.42,z+sz/2-.42,10):
        add_world(ren,cube((face,y,zz),(.035,sy*.86,.055),rail,.16,.34,1,f'{name} rib'),True,env)
    for yy in (y-sy/2+.12,y+sy/2-.12):
        add_world(ren,cube((face,yy,z),(.04,.12,sz*.96),rail,.18,.32,1,f'{name} rail'),True,env)
    return body


def parked_trailer(ren,env,z,color=(.18,.17,.16)):
    container_unit(ren,env,(5.25,2.05,z),(7.1,3.7,2.7),color,'docked trailer')
    add_world(ren,cube((8.72,.42,z),(1.0,.76,2.15),(.035,.036,.040),.16,.62,1,'dock platform'),True,env)
    for zz in (z-.88,z+.88):
        add_world(ren,sphere((2.35,.55,zz),.50,(.018,.019,.021),.06),True,env)


def setup_world(ren):
    env=[]; digital=[]
    make_building_sign()
    # expansive asphalt yard
    road=add_world(ren,cube((0,-.12,8),(34,.22,100),(.024,.026,.030),.18,.24,1,'asphalt'),True,env)
    # lane / parking lines
    for z in np.arange(-40,48,7.5):
        add_world(ren,cube((-1.0,.015,float(z)),(.11,.025,3.7),(.72,.61,.39),.12,.28,1,'lane marker'),True,env)
    # long terminal warehouse, camera-facing side at x~10
    wh=add_world(ren,cube((12,3.15,7),(5.2,6.3,80),(.052,.048,.047),.10,.50,1,'terminal warehouse'),True,env)
    roof_left=cube((10.45,6.55,7),(3.4,.34,82),(.025,.024,.026),.26,.31,1,'warehouse roof'); roof_left.RotateZ(-8); add_world(ren,roof_left,True,env)
    roof_right=cube((13.55,6.55,7),(3.4,.34,82),(.025,.024,.026),.26,.31,1,'warehouse roof'); roof_right.RotateZ(8); add_world(ren,roof_right,True,env)
    add_world(ren,cube((12,6.82,7),(.20,.34,82),(.018,.018,.020),.32,.26,1,'roof ridge'),True,env)
    for z in np.arange(-31,40,8.0):
        add_world(ren,cube((9.37,3.15,float(z)-3.90),(.12,6.05,.14),(.11,.10,.095),.18,.34,1,'facade column'),True,env)
    # loading bays, canopies, lamps, parked trailers
    for i,z in enumerate(np.arange(-31,40,8.0)):
        add_world(ren,cube((9.36,1.75,float(z)),(.16,3.3,4.7),(.014,.015,.017),.08,.45,1,'dock door'),True,env)
        add_world(ren,cube((8.9,3.55,float(z)),(1.0,.18,5.0),(.11,.105,.10),.35,.25,1,'dock canopy'),True,env)
        # dock light lens
        lamp=cube((8.80,3.95,float(z)),(.25,.18,.65),(1.0,.63,.30),.0,.1,1,'dock lamp'); lamp.GetProperty().SetAmbient(1); add_world(ren,lamp,True,env)
        for lane_x in (7.8,6.25):
            add_world(ren,cube((lane_x,.018,float(z)-1.35),(.08,.026,1.7),(.62,.50,.30),.12,.32,1,'dock lane guide'),True,env)
            add_world(ren,cube((lane_x,.018,float(z)+1.35),(.08,.026,1.7),(.62,.50,.30),.12,.32,1,'dock lane guide'),True,env)
        if i in {1,4,7}:
            parked_trailer(ren,env,float(z)+.3,[((.17,.15,.14)),((.14,.15,.17)),((.20,.18,.15))][i%3])
    clinic_sign=textured_quad_x(BUILDING_SIGN,9.27,4.35,5.35,9.0,19.0,False,'Canby clinic building sign')
    add_world(ren,clinic_sign,True,env)
    # foreground parallax: concrete blocks + light poles
    for z in [-26,-9,10,27]:
        add_world(ren,cube((-6.8,.20,z),(1.0,.38,2.4),(.055,.055,.058),.15,.48,1,'foreground barrier'),True,env)
    for z in [-35,-5,25,43]:
        add_world(ren,cube((-4.5,3.2,z),(.12,6.4,.12),(.10,.10,.11),.75,.18,1,'light pole'),True,env)
        lum=cube((-4.5,6.5,z),(1.7,.12,.45),(1.0,.74,.42),.0,.08,1,'yard light'); lum.GetProperty().SetAmbient(1); add_world(ren,lum,True,env)
    # Layered container stacks frame the moving vehicle and make the crane-up
    # reveal read like Terminal's dense shipping yard instead of an empty lot.
    for x,y,z,col in [
        (6.2,1.55,-37,(.19,.10,.07)),(6.2,1.55,43,(.08,.11,.14)),
        (15.8,1.55,-25,(.14,.12,.10)),(16.0,4.70,-25,(.075,.095,.12)),
        (16.0,1.55,31,(.18,.095,.065)),(16.1,4.70,31,(.12,.12,.115)),
        (-2.8,1.55,39,(.11,.105,.10))]:
        container_unit(ren,env,(x,y,z),(3.1,3.1,7.7),col,'yard container')
    # distant stacks / containers to fill horizon
    for i,z in enumerate(range(-42,48,9)):
        col=[(.16,.095,.07),(.075,.095,.12),(.13,.12,.11)][i%3]
        container_unit(ren,env,(18.2,1.55,z),(3.6,3.1,7.7),col,'distant container')
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
    # The production sequence continues past the vehicle into a dark, flowing
    # data field. These ribbons and panels only resolve during that final beat.
    for i in range(12):
        side=-1 if i%2 else 1
        x0=side*(1.6+(i%4)*.7)
        y0=.7+(i%3)*1.15
        z0=38+i*2.6
        points=[]
        for j in range(7):
            z=z0+j*5.2
            x=x0+math.sin(i*.83+j*.92)*(1.1+j*.08)
            y=y0+math.cos(i*.61+j*.78)*.72+j*.10
            points.append((x,y,z))
        ribbon=data_ribbon(points,opacity=0,name='data ribbon')
        ren.AddActor(ribbon); digital.append(ribbon)
    for z in (52,66,80):
        panel=wire_cube((0,2.8,z),(13,5.6,.05),(.42,.56,.68),0,'data panel')
        ren.AddActor(panel); digital.append(panel)
    rng=np.random.default_rng(7)
    points=vtk.vtkPoints(); vertices=vtk.vtkCellArray()
    for _ in range(900):
        pid=points.InsertNextPoint(float(rng.uniform(-8,8)),float(rng.uniform(.1,7.2)),float(rng.uniform(36,104)))
        vertices.InsertNextCell(1); vertices.InsertCellPoint(pid)
    pdata=vtk.vtkPolyData(); pdata.SetPoints(points); pdata.SetVerts(vertices)
    pmapper=vtk.vtkPolyDataMapper(); pmapper.SetInputData(pdata)
    particles=vtk.vtkActor(); particles.SetMapper(pmapper); particles.SetObjectName('data particles')
    pprop=particles.GetProperty(); pprop.SetColor(.67,.82,.92); pprop.SetPointSize(1.7); pprop.SetOpacity(0); pprop.LightingOff()
    ren.AddActor(particles); digital.append(particles)
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
    # The ambulance drives to the clinic, stops, and stays fixed while the
    # camera performs the side-to-front orbit baked into the image sequence.
    vz=interp(f,[(0,-7.5),(40,-4.0),(80,3.5),(120,11.5),(409,11.5)])
    yaw=0
    if aspect=='desktop':
        cam=interp(f,[(0,(-14.0,1.72,-6.0)),(80,(-14.0,1.55,3.2)),(120,(-13.0,1.65,10.5)),(150,(-12.0,4.0,12.0)),(180,(-9.0,6.8,14.0)),(210,(-5.5,6.3,16.0)),(235,(-2.5,5.3,17.5)),(255,(0.0,4.2,18.2)),(280,(0.0,3.0,17.5)),(300,(0.0,2.5,13.5)),(320,(0.0,2.0,8.5)),(350,(0.0,2.2,26.0)),(409,(-.5,3.8,65.0))])
        look=interp(f,[(0,(0,1.35,-7.5)),(80,(0,1.35,3.5)),(120,(0,1.35,11.5)),(255,(0,1.35,11.5)),(280,(0,1.3,11.5)),(300,(0,1.5,7.0)),(320,(0,1.7,1.0)),(350,(0,2.1,52.0)),(409,(0,2.8,92.0))])
        angle=interp(f,[(0,27),(90,27),(120,28),(160,32),(210,32),(255,30),(280,34),(300,54),(320,62),(409,66)])
    else:
        cam=interp(f,[(0,(-13.0,2.05,-6.5)),(80,(-13.0,1.9,3.0)),(120,(-12.5,2.1,10.3)),(150,(-11.5,4.8,12.0)),(180,(-8.5,7.8,14.0)),(210,(-5.0,7.1,16.0)),(235,(-2.2,5.8,17.5)),(255,(0.0,4.5,18.4)),(280,(0.0,3.2,17.7)),(300,(0.0,2.7,13.5)),(320,(0.0,2.1,8.5)),(350,(0,2.3,26.0)),(409,(0,3.8,65.0))])
        look=interp(f,[(0,(0,1.5,-6.5)),(80,(0,1.45,4.5)),(120,(0,1.4,11.5)),(255,(0,1.4,11.5)),(280,(0,1.35,11.5)),(300,(0,1.55,7.0)),(320,(0,1.75,1.0)),(350,(0,2.1,52.0)),(409,(0,2.8,92.0))])
        angle=interp(f,[(0,43),(100,42),(140,46),(180,50),(235,48),(255,44),(280,48),(300,60),(409,68)])
    industrial=smoother(seg(f,42,92))
    wire=smoother(seg(f,225,275))
    abstract=smoother(seg(f,315,350))
    return vz,yaw,cam,look,angle,wire,abstract,industrial

def update(f,aspect,ren,veh,env,digital,road,L):
    vz,yaw,campos,look,angle,wire,abstract,industrial=state(f,aspect)
    veh['base'].SetPosition(0,0,vz); veh['wire'].SetPosition(0,0,vz)
    veh['base'].SetOrientation(0,yaw,0); veh['wire'].SetOrientation(0,yaw,0)
    # wheels spin based on actual vehicle travel; origin set at each wheel center
    spin=(vz+7.5)/0.52*180/math.pi
    for w in veh['wheels'].values(): w.SetOrientation(spin,0,0)
    # technical wireframe overlay
    vehicle_wire=wire*(1-.97*smoother(seg(f,300,355)))
    for p in veh['wire_props']: p.SetOpacity(.15*vehicle_wire)
    physical_fade=smoother(seg(f,235,280))
    for p in veh['base_props']:
        try: p.SetOpacity(1-.94*physical_fade)
        except: pass
    for a in veh['decals']:
        try: a.GetProperty().SetOpacity(1-physical_fade)
        except: pass
    for i,a in enumerate(digital):
        name=(a.GetObjectName() or '').lower()
        pulse=.45+.55*(.5+.5*math.sin((f+i)*.11))
        if name=='data ribbon':
            a.GetProperty().SetOpacity(abstract*(.006+.010*pulse))
        elif name=='data panel':
            a.GetProperty().SetOpacity(abstract*(.07+.12*pulse))
        elif name=='data particles':
            a.GetProperty().SetOpacity(abstract*(.25+.40*pulse))
        else:
            a.GetProperty().SetOpacity(wire*(1-.78*abstract)*(.06+.12*pulse))
    headlight_phase=1-smoother(seg(f,160,220))
    for p in veh['beam_props']:
        p.SetOpacity(.020*headlight_phase)
    bg1=mix3((.99,.62,.34),(.006,.011,.017),wire); bg2=mix3((.52,.32,.43),(.002,.005,.009),wire); ren.SetBackground(*bg1); ren.SetBackground2(*bg2)
    environment_hide=smoother(seg(f,320,350))
    for a in env:
        name=(a.GetObjectName() or '').lower()
        if a is road:
            a.GetProperty().SetColor(*mix3((.018,.018,.020),(.018,.022,.027),industrial)); a.GetProperty().SetOpacity(1-environment_hide)
        elif name=='sun':
            a.GetProperty().SetOpacity(0)
        else:
            op=industrial*(1-.92*wire)*(1-environment_hide)
            a.GetProperty().SetOpacity(op)
    L['sun'].SetIntensity(1.45*(1-.84*wire)); L['sun'].SetColor(1,.58,.28)
    L['fill'].SetIntensity(.52*(1-.70*wire)); L['fill'].SetColor(.30,.48,.80)
    L['rim'].SetIntensity(1.15*(1-.76*wire)); L['rim'].SetColor(1,.78,.50)
    L['top'].SetIntensity(.42*(1-.65*wire))
    # headlights track true moving front (+Z before yaw approximation)
    for l,xx in L['head']:
        l.SetPosition(xx,1.05,vz+3.8); l.SetFocalPoint(xx,.62,vz+15); l.SetIntensity((1.35+2.9*wire)*headlight_phase)
    veh['base'].SetVisibility(0 if abstract>.98 else 1)
    veh['wire'].SetVisibility(0 if abstract>.98 else 1)
    for a in env + digital:
        a.SetVisibility(0 if (a.GetObjectName() or '').lower() == 'sun' else 1)
    up=(0,1,0)
    c=ren.GetActiveCamera(); c.SetPosition(*campos); c.SetFocalPoint(*look); c.SetViewUp(*up); c.SetViewAngle(angle); c.SetClippingRange(.03,180)


def render(rw,path):
    rw.Render(); w=vtk.vtkWindowToImageFilter(); w.SetInput(rw); w.SetInputBufferTypeToRGB(); w.ReadFrontBufferOff(); w.Update()
    wr=vtk.vtkPNGWriter(); wr.SetFileName(str(path)); wr.SetInputConnection(w.GetOutputPort()); wr.Write()


def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--out',required=True); ap.add_argument('--aspect',choices=['desktop','mobile'],default='desktop'); ap.add_argument('--mode',choices=['checkpoints','full'],default='checkpoints'); ap.add_argument('--width',type=int); ap.add_argument('--height',type=int); ap.add_argument('--start',type=int,default=0); ap.add_argument('--end',type=int,default=TOTAL-1)
    a=ap.parse_args(); out=Path(a.out); out.mkdir(parents=True,exist_ok=True)
    if a.width and a.height: W,H=a.width,a.height
    else: W,H=((1600,900) if a.aspect=='desktop' else (720,1280))
    ren,rw,veh,env,digital,road,L=setup(W,H)
    frames=[0,80,120,140,180,220,260,280,300,320,360,409] if a.mode=='checkpoints' else list(range(max(0,a.start),min(TOTAL-1,a.end)+1))
    for j,f in enumerate(frames):
        update(f,a.aspect,ren,veh,env,digital,road,L); p=out/f'frame_{f+1:03d}.png'; render(rw,p); print(j+1,'/',len(frames),p,flush=True)

if __name__=='__main__': main()
