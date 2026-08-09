import os, math, sys
from PIL import Image, ImageDraw, ImageFont
import vtk

OUT=sys.argv[1] if len(sys.argv)>1 else '/mnt/data/ambulance_frames'
N=int(sys.argv[2]) if len(sys.argv)>2 else 120
W=int(sys.argv[3]) if len(sys.argv)>3 else 1280
H=int(sys.argv[4]) if len(sys.argv)>4 else 720
os.makedirs(OUT, exist_ok=True)

# ---------- helpers ----------
def mat(actor, color, metallic=0.0, rough=.35, opacity=1.0, emissive=None):
    p=actor.GetProperty(); p.SetColor(*color); p.SetOpacity(opacity)
    try:
        p.SetInterpolationToPBR(); p.SetMetallic(metallic); p.SetRoughness(rough)
    except Exception: pass
    if emissive:
        p.SetAmbientColor(*emissive); p.SetAmbient(0.85); p.SetDiffuse(0.35)
    return actor

def rounded_box(name, size, pos, color, radius=.18, metallic=0.0, rough=.3, opacity=1.0):
    # Superquadric with high n gives rounded rectangular solid
    s=vtk.vtkSuperquadricSource(); s.SetToroidal(0); s.SetThetaResolution(64); s.SetPhiResolution(32)
    s.SetPhiRoundness(0.16); s.SetThetaRoundness(0.16); s.SetScale(size[0]/2,size[1]/2,size[2]/2); s.Update()
    m=vtk.vtkPolyDataMapper(); m.SetInputConnection(s.GetOutputPort())
    a=vtk.vtkActor(); a.SetMapper(m); a.SetPosition(*pos); a.SetObjectName(name); mat(a,color,metallic,rough,opacity)
    ren.AddActor(a); actors[name]=a; return a

def box(name, size, pos, color, metallic=0.0, rough=.3, opacity=1.0):
    c=vtk.vtkCubeSource(); c.SetXLength(size[0]); c.SetYLength(size[1]); c.SetZLength(size[2]); c.Update()
    m=vtk.vtkPolyDataMapper(); m.SetInputConnection(c.GetOutputPort()); a=vtk.vtkActor(); a.SetMapper(m); a.SetPosition(*pos); a.SetObjectName(name); mat(a,color,metallic,rough,opacity)
    ren.AddActor(a); actors[name]=a; return a

def cyl(name, radius, width, pos, color, metallic=0.0, rough=.5, axis='y'):
    c=vtk.vtkCylinderSource(); c.SetRadius(radius); c.SetHeight(width); c.SetResolution(64); c.CappingOn(); c.Update()
    m=vtk.vtkPolyDataMapper(); m.SetInputConnection(c.GetOutputPort()); a=vtk.vtkActor(); a.SetMapper(m); a.SetPosition(*pos); a.SetObjectName(name)
    # vtk cylinder axis is Y already
    mat(a,color,metallic,rough); ren.AddActor(a); actors[name]=a; return a

def plane_texture(name, w,h,pos,img_path, rot=(0,0,0), normal_sign=-1):
    # exact vertical X/Z quad so branding is physically placed on the 3D side
    pts=vtk.vtkPoints();
    y=pos[1]; x=pos[0]; z=pos[2]
    pts.InsertNextPoint(x-w/2,y,z-h/2); pts.InsertNextPoint(x+w/2,y,z-h/2); pts.InsertNextPoint(x+w/2,y,z+h/2); pts.InsertNextPoint(x-w/2,y,z+h/2)
    poly=vtk.vtkPolygon(); poly.GetPointIds().SetNumberOfIds(4)
    order=[0,1,2,3] if normal_sign<0 else [3,2,1,0]
    for i,v in enumerate(order): poly.GetPointIds().SetId(i,v)
    cells=vtk.vtkCellArray(); cells.InsertNextCell(poly)
    pd=vtk.vtkPolyData(); pd.SetPoints(pts); pd.SetPolys(cells)
    tc=vtk.vtkFloatArray(); tc.SetNumberOfComponents(2); tc.SetName('TextureCoordinates')
    for uv in [(0,0),(1,0),(1,1),(0,1)]: tc.InsertNextTuple2(*uv)
    pd.GetPointData().SetTCoords(tc)
    mapper=vtk.vtkPolyDataMapper(); mapper.SetInputData(pd); a=vtk.vtkActor(); a.SetMapper(mapper)
    reader=vtk.vtkPNGReader(); reader.SetFileName(img_path); tex=vtk.vtkTexture(); tex.SetInputConnection(reader.GetOutputPort()); tex.InterpolateOn(); a.SetTexture(tex); a.GetProperty().LightingOff()
    ren.AddActor(a); actors[name]=a; return a

def make_decal(path, side='left'):
    img=Image.new('RGBA',(1600,520),(255,255,255,255)); d=ImageDraw.Draw(img)
    # brand stripes
    d.rounded_rectangle((0,360,1600,430),35,fill=(16,151,49,255)); d.rounded_rectangle((0,440,1600,500),28,fill=(8,78,170,255))
    try:
        logo=Image.open('/mnt/data/canby_src/CanbyCLinic-main/images/canby-community-clinic-logo.png').convert('RGBA')
        # crop whitespace
        bbox=logo.getbbox(); logo=logo.crop(bbox)
        logo.thumbnail((1200,300), Image.Resampling.LANCZOS)
        x=(1600-logo.width)//2; y=25
        img.alpha_composite(logo,(x,y))
    except Exception as e:
        print('logo fail',e)
    img.save(path)

# ---------- scene ----------
actors={}
ren=vtk.vtkRenderer(); ren.SetUseDepthPeeling(1); ren.SetMaximumNumberOfPeels(50); ren.SetOcclusionRatio(0.1)
win=vtk.vtkRenderWindow(); win.SetOffScreenRendering(1); win.SetMultiSamples(8); win.AddRenderer(ren); win.SetSize(W,H)
try: win.SetUseSRGBColorSpace(True)
except: pass

# World
ren.SetBackground(0.006,0.008,0.013); ren.SetBackground2(0.03,0.045,0.065); ren.GradientBackgroundOn()
# floor / road
box('road',(70,14,.08),(0,0,-.42),(0.018,0.022,0.028),0.0,.62)
# curbs / reflective lanes
for i in range(-7,8):
    box(f'lane{i}',(2.7,.12,.018),(i*5.2,-2.55,-.365),(0.55,0.60,0.63),.15,.25)
# distant light wall strips
for i in range(-10,11):
    a=box(f'wall{i}',(.09,13,6.0),(i*3.3,5.8,2.5),(0.03,0.045,0.06),.3,.28)

# ambulance shell dimensions: x length ~7.3m, y width 2.4, z height 3.05
white=(0.94,0.955,0.965); dark=(0.025,0.03,0.036); chrome=(0.58,0.62,0.66); glass=(0.035,0.10,0.15)
# box module
rounded_box('module',(4.35,2.42,2.65),(0.90,0,1.02),white,rough=.22)
# roof cap and lower skirt
rounded_box('roofcap',(4.28,2.34,.18),(.90,0,2.38),white,rough=.18)
box('lower_skirt',(4.38,2.44,.28),(.90,0,-.16),(0.75,0.78,0.80),.65,.28)
# cab hood + cab
rounded_box('cab',(2.72,2.22,1.72),(-2.15,0,.52),white,rough=.22)
rounded_box('hood',(1.45,2.16,.72),(-3.48,0,.18),white,rough=.22)
# sloped windshield approximated with dark pane
wind=box('windshield',(0.06,1.83,.78),(-2.65,-0.02,1.16),glass,.05,.08,.72); wind.SetOrientation(0,-18,0)
# side windows
for side in [-1,1]:
    y=side*1.115
    a=box(f'sidewin{side}',(.88,.035,.62),(-2.15,y,1.18),glass,.05,.08,.78)
    # door seam / handle
    box(f'doorline{side}',(.035,.04,1.45),(-1.58,y*1.01,.52),(0.22,0.24,0.26),.4,.35)
    box(f'handle{side}',(.32,.06,.07),(-1.82,y*1.02,.55),chrome,.9,.15)
# grille bumper headlights
box('grille',(.08,1.25,.38),(-4.18,0,.08),(0.12,.14,.16),.85,.18)
for y in [-.71,.71]:
    box(f'head{y}',(.10,.42,.20),(-4.20,y,.30),(0.95,.98,1.0),.25,.08)
    box(f'fog{y}',(.10,.24,.12),(-4.20,y,-.03),(.80,.90,1.0),.25,.08)
box('bumper',(.22,2.20,.22),(-4.24,0,-.25),chrome,.75,.20)
# mirrors
for side in [-1,1]:
    box(f'mirrorarm{side}',(.34,.05,.05),(-2.52,side*1.31,1.18),dark,.1,.35)
    rounded_box(f'mirror{side}',(.22,.12,.32),(-2.65,side*1.48,1.20),dark,rough=.25)
# compartments / side access doors / handles both sides
for side in [-1,1]:
    y=side*1.225
    for j,x in enumerate([-.30,.58,1.47,2.35]):
        box(f'comp{side}_{j}',(.72,.018,.66),(x,y,.52),(0.80,.82,.84),.25,.42)
        box(f'hand{side}_{j}',(.24,.035,.035),(x,y*1.005,.58),chrome,.9,.12)
    # medical access door toward front
    box(f'access{side}',(.92,.018,1.60),(-.55,y,1.18),(0.82,.84,.86),.20,.38)
    box(f'accessh{side}',(.28,.04,.05),(-.38,y*1.005,1.22),chrome,.85,.15)
# rear doors
box('rearL',(.035,1.08,2.16),(3.09,-.57,1.15),(0.91,.925,.935),.1,.28)
box('rearR',(.035,1.08,2.16),(3.09,.57,1.15),(0.91,.925,.935),.1,.28)
for y in [-.57,.57]:
    box(f'rearhandle{y}',(.05,.22,.08),(3.115,y,1.12),chrome,.85,.15)
# emergency LEDs + marker lights
led_actors=[]
for x in [-.8,.1,.95,1.8,2.65]:
    for side in [-1,1]:
        a=box(f'ledtop{x}{side}',(.26,.035,.12),(x,side*1.235,2.19),(0.9,.03,.035),.1,.08); led_actors.append(a)
for side in [-1,1]:
    a=box(f'cablight{side}',(.48,.08,.13),(-2.10,side*.46,1.98),(0.9,.03,.035),.1,.08); led_actors.append(a)
# rear LED blocks
for y in [-.78,0,.78]:
    a=box(f'rearled{y}',(.06,.28,.13),(3.12,y,2.18),(0.9,.03,.035),.1,.08); led_actors.append(a)
# wheels
wheels=[]
for x in [-2.65,1.86]:
    for y in [-1.19,1.19]:
        tire=cyl(f'tire{x}{y}',.48,.28,(x,y,-.05),(0.018,.018,.019),0.0,.80); wheels.append(tire)
        rim=cyl(f'rim{x}{y}',.27,.30,(x,y,-.05),(0.52,.56,.60),.85,.18)
# front wheel arches subtle fender caps
for side in [-1,1]:
    rounded_box(f'fender{side}',(1.12,.10,.30),(-2.65,side*1.13,.13),white,rough=.24)
# underbody rails
box('frame',(5.8,1.35,.16),(-.15,0,-.42),(0.055,.06,.065),.7,.45)
# license/rear bumper
box('rearbumper',(.22,2.34,.20),(3.22,0,-.22),chrome,.75,.2)

# Brand decals on both sides
left='/mnt/data/canby_decal.png'; make_decal(left)
# planes face ±Y: plane source xy then rotate 90 about X means normal roughly -Y; duplicate reversed orientation
plane_texture('decalNear',3.62,1.18,(.92,-1.242,1.35),left,normal_sign=-1)
plane_texture('decalFar',3.62,1.18,(.92,1.242,1.35),left,normal_sign=1)

# Lights
ren.RemoveAllLights()
def add_light(pos,color,intensity=1.0, focal=(0,0,.5), cone=180):
    l=vtk.vtkLight(); l.SetPosition(*pos); l.SetFocalPoint(*focal); l.SetColor(*color); l.SetIntensity(intensity); l.SetConeAngle(cone); l.SetPositional(True); ren.AddLight(l); return l
add_light((-4,-7,6),(0.75,0.88,1.0),3.2,(0,0,.7),70)
add_light((3,-4,4),(1.0,.35,.12),2.3,(1,0,.8),80)
add_light((0,5,7),(.20,.42,1.0),2.0,(0,0,.8),100)
add_light((-5,0,2.2),(1.0,.95,.88),1.4,(-2,0,.5),70)
# headlight practical lights
hl1=add_light((-4.25,-.68,.28),(0.76,.88,1.0),1.3,(-9,-.68,.1),38)
hl2=add_light((-4.25,.68,.28),(0.76,.88,1.0),1.3,(-9,.68,.1),38)

cam=vtk.vtkCamera(); ren.SetActiveCamera(cam); cam.SetViewUp(0,0,1); cam.SetClippingRange(.1,200)
try: cam.SetUseHorizontalViewAngle(True)
except: pass
cam.SetViewAngle(44)

# render setup
w2i=vtk.vtkWindowToImageFilter(); w2i.SetInput(win); w2i.SetInputBufferTypeToRGB(); w2i.ReadFrontBufferOff()
writer=vtk.vtkPNGWriter()

def smoothstep(a,b,x):
    if x<=a:return 0.0
    if x>=b:return 1.0
    t=(x-a)/(b-a); return t*t*(3-2*t)

def lerp(a,b,t): return a+(b-a)*t

def camera_pose(p):
    # five-shot spline approximation inspired by automotive tracking: front 3/4 -> low wheel -> side -> rear 3/4 -> bright exit
    keys=[
      (0.00, (-8.8,-7.0,1.25), (-.95,0,.70), 44),
      (0.18, (-6.7,-5.3,.78), (-1.05,0,.55), 42),
      (0.36, (-2.9,-6.0,.80), (-.15,0,.70), 43),
      (0.58, ( 0.5,-6.4,1.12), ( .55,0,.85), 44),
      (0.78, ( 4.8,-5.5,1.18), ( .90,0,.82), 43),
      (0.92, ( 7.2,-4.3,1.55), (1.25,0,.90), 42),
      (1.00, ( 8.7,-3.4,2.05), (1.55,0,1.00), 41),
    ]
    for i in range(len(keys)-1):
        if p<=keys[i+1][0]:
            p0,pos0,f0,v0=keys[i]; p1,pos1,f1,v1=keys[i+1]
            t=smoothstep(p0,p1,p)
            pos=tuple(lerp(pos0[j],pos1[j],t) for j in range(3)); foc=tuple(lerp(f0[j],f1[j],t) for j in range(3)); va=lerp(v0,v1,t)
            return pos,foc,va
    return keys[-1][1],keys[-1][2],keys[-1][3]

for i in range(N):
    p=i/(N-1)
    # wheel rotation consistent with virtual forward motion
    ang=-p*1440
    for wh in wheels: wh.SetOrientation(0,0,ang)
    # road lane movement creates speed parallax
    shift=(p*18)%5.2
    for idx in range(-7,8): actors[f'lane{idx}'].SetPosition(idx*5.2-shift,-2.55,-.365)
    # LEDs subtle, not flashing aggressively
    glow=0.48+0.42*(0.5+0.5*math.sin(p*math.pi*10))
    for a in led_actors:
        a.GetProperty().SetColor(1.0*glow,.035,.04)
        a.GetProperty().SetAmbient(glow)
    pos,foc,va=camera_pose(p); cam.SetPosition(*pos); cam.SetFocalPoint(*foc); cam.SetViewAngle(va)
    # dark-to-light progression after 80%
    q=smoothstep(.78,1.0,p)
    ren.SetBackground(lerp(.006,.88,q),lerp(.008,.93,q),lerp(.013,.97,q)); ren.SetBackground2(lerp(.03,.99,q),lerp(.045,.995,q),lerp(.065,1.0,q))
    # increase ambient/reflection feel toward end
    win.Render()
    w2i.Modified(); w2i.Update(); writer.SetFileName(os.path.join(OUT,f'frame_{i+1:04d}.png')); writer.SetInputConnection(w2i.GetOutputPort()); writer.Write()
    if i in {0,N//4,N//2,3*N//4,N-1}: print('rendered',i+1,'/',N)
print('DONE',OUT)
