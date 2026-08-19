(() => {
  'use strict';

  const hero = document.querySelector('[data-cell-hero]');
  const canvas = hero?.querySelector('[data-cell-canvas]');
  if (!hero || !canvas) return;

  const beats = [...hero.querySelectorAll('[data-cell-beat]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance'
  });

  let width = 1;
  let height = 1;
  let progress = reduced ? .16 : 0;
  let targetProgress = progress;
  let visible = true;
  let frame = 0;

  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const smooth = (a, b, value) => {
    const x = clamp((value - a) / Math.max(.0001, b - a));
    return x * x * (3 - 2 * x);
  };

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) || 'Hero shader failed to compile.');
    }
    return shader;
  }

  function createRenderer() {
    if (!gl) return null;
    const vertex = compile(gl.VERTEX_SHADER, `
      attribute vec2 a_position;
      void main(){ gl_Position=vec4(a_position,0.0,1.0); }
    `);
    const fragment = compile(gl.FRAGMENT_SHADER, `
      precision highp float;
      uniform vec2 u_resolution;
      uniform float u_progress;
      uniform float u_time;
      uniform float u_portrait;

      float smin(float a,float b,float k){
        float safe=max(k,.0001);
        float h=max(safe-abs(a-b),0.0)/safe;
        return min(a,b)-h*h*safe*.25;
      }
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
      float noise(vec2 p){
        vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);
      }
      float cell(vec2 p,vec2 c,float r,float seed){
        vec2 q=p-c;
        float a=atan(q.y,q.x);
        float living=sin(a*5.0+u_time*.32+seed)*.010+sin(a*8.0-u_time*.23+seed*1.7)*.005;
        return length(q)-r*(1.0+living);
      }
      vec2 portrait(vec2 p){return vec2(p.x*mix(1.0,.73,u_portrait),p.y*mix(1.0,1.18,u_portrait));}
      float scene(vec2 raw){
        vec2 p=raw;
        float first=smoothstep(.035,.29,u_progress);
        float second=smoothstep(.30,.58,u_progress);
        float third=smoothstep(.59,.86,u_progress);
        float rise=mix(.075,.13,u_portrait);
        float spread=mix(1.0,.76,u_portrait);
        float d=mix(0.0,.285,first)*spread;
        vec2 left=vec2(-d,rise);
        vec2 right=vec2(d,rise);
        float r1=mix(.31,.225,first);
        float field=smin(cell(p,left,r1,1.0),cell(p,right,r1,2.0),mix(.16,.018,first));
        if(second>.001){
          vec2 a1=mix(left,portrait(vec2(-.31,.18))+vec2(0.,rise*.18),second);
          vec2 a2=mix(left,portrait(vec2(-.29,-.13))+vec2(0.,rise*.18),second);
          vec2 b1=mix(right,portrait(vec2(.31,.18))+vec2(0.,rise*.18),second);
          vec2 b2=mix(right,portrait(vec2(.29,-.13))+vec2(0.,rise*.18),second);
          float r2=mix(r1,.168,second);
          float f4=smin(smin(cell(p,a1,r2,1.0),cell(p,a2,r2,2.2),mix(.10,.016,second)),smin(cell(p,b1,r2,3.1),cell(p,b2,r2,4.2),mix(.10,.016,second)),.012);
          field=mix(field,f4,smoothstep(.0,.34,second));
          if(third>.001){
            vec2 c1=mix(a1,portrait(vec2(-.43,.245)),third);
            vec2 c2=mix(a1,portrait(vec2(-.16,.27)),third);
            vec2 c3=mix(b1,portrait(vec2(.16,.27)),third);
            vec2 c4=mix(b1,portrait(vec2(.43,.245)),third);
            vec2 c5=mix(a2,portrait(vec2(-.235,-.19)),third);
            vec2 c6=mix(b2,portrait(vec2(.235,-.19)),third);
            float r3=mix(r2,.137,third);
            float k=mix(.085,.012,third);
            float f6=smin(cell(p,c1,r3,1.0),cell(p,c2,r3,2.0),k);
            f6=smin(f6,cell(p,c3,r3,3.0),.012);
            f6=smin(f6,cell(p,c4,r3,4.0),k);
            f6=smin(f6,cell(p,c5,r3,5.0),.012);
            f6=smin(f6,cell(p,c6,r3,6.0),.012);
            field=mix(field,f6,smoothstep(.0,.34,third));
          }
        }
        return field;
      }
      void main(){
        vec2 p=(gl_FragCoord.xy-.5*u_resolution.xy)/min(u_resolution.x,u_resolution.y);
        float d=scene(p);
        float e=1.6/min(u_resolution.x,u_resolution.y);
        vec2 grad=vec2(scene(p+vec2(e,0.))-scene(p-vec2(e,0.)),scene(p+vec2(0.,e))-scene(p-vec2(0.,e)));
        vec2 normal=normalize(grad+vec2(.00001));
        float inside=smoothstep(.012,-.012,d);
        float shell=exp(-abs(d)*58.0);
        float depth=smoothstep(.0,-.20,d);
        float directional=.5+.5*dot(normal,normalize(vec2(-.62,.78)));
        float slowNoise=noise(p*5.2+vec2(u_time*.022,-u_time*.016));
        float fineNoise=noise(p*15.0-vec2(u_time*.035,u_time*.018));

        float handoff=smoothstep(.925,1.0,u_progress);
        float vignette=1.0-smoothstep(.28,1.02,length(p*vec2(.78,1.0)));
        vec3 dark=vec3(.012,.052,.042);
        vec3 bg=dark+vec3(.012,.043,.031)*vignette;
        bg+=vec3(.018,.028,.022)*(noise(p*2.1+8.0)-.5)*.18;
        bg=mix(bg,vec3(.956,.941,.902),handoff*.88);

        vec3 deep=vec3(.035,.165,.118);
        vec3 jade=vec3(.18,.48,.34);
        vec3 ivory=vec3(.91,.80,.63);
        float surfaceDirection=mix(.56,directional,smoothstep(-.13,-.008,d));
        vec3 body=mix(deep,jade,.30+surfaceDirection*.48);
        body=mix(body,ivory,pow(surfaceDirection,5.0)*.32);
        body+=vec3(.04,.12,.085)*(slowNoise-.5)+vec3(.018,.055,.037)*(fineNoise-.5);
        body*=.72+depth*.34;
        body+=vec3(.30,.87,.60)*shell*(.16+.24*surfaceDirection);
        body+=ivory*pow(surfaceDirection,11.0)*shell*.56;
        float translucency=smoothstep(-.18,-.015,d)*(1.0-depth)*.12;
        body+=vec3(.28,.64,.45)*translucency;
        float fade=1.0-handoff;
        vec3 color=mix(bg,body,inside*fade);
        color+=vec3(.19,.62,.42)*shell*.13*fade;
        color*=.985+.015*noise(gl_FragCoord.xy*.37+u_time*.1);
        gl_FragColor=vec4(pow(max(color,0.0),vec3(.94)),1.0);
      }
    `);
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    return {
      resolution: gl.getUniformLocation(program, 'u_resolution'),
      progress: gl.getUniformLocation(program, 'u_progress'),
      time: gl.getUniformLocation(program, 'u_time'),
      portrait: gl.getUniformLocation(program, 'u_portrait')
    };
  }

  function prepareType() {
    beats.forEach(beat => {
      beat._characters = [...beat.querySelectorAll('h1,h2,p')].flatMap(line => {
        const text = line.textContent.trim();
        line.setAttribute('aria-label', text);
        line.textContent = '';
        const characters=[];
        text.split(/\s+/).forEach((word,index,words) => {
          const wordSpan=document.createElement('span');
          wordSpan.className='cell-type-word';
          [...word].forEach(character => {
            const span=document.createElement('span');
            span.className='cell-type-char';
            span.setAttribute('aria-hidden','true');
            span.textContent=character;
            wordSpan.append(span);
            characters.push(span);
          });
          line.append(wordSpan);
          if(index<words.length-1)line.append(document.createTextNode(' '));
        });
        return characters;
      });
    });
  }

  function reveal(beat, index, amount, active) {
    const chars = beat._characters || [];
    const count = Math.min(chars.length, Math.max(active ? 1 : 0, Math.floor(clamp(amount) * (chars.length + 1))));
    let current = active && count > 0 && count < chars.length ? count - 1 : -1;
    while (current > 0 && !chars[current].textContent.trim()) current--;
    chars.forEach((character, characterIndex) => {
      character.classList.toggle('is-spelled', characterIndex < count);
      character.classList.toggle('is-current', characterIndex === current);
    });
  }

  function updateCopy() {
    const timings = innerWidth<760 ? [
      { enter:0, typeEnd:.18, hold:.235, exit:.33 },
      { enter:.27, typeEnd:.47, hold:.52, exit:.62 },
      { enter:.56, typeEnd:.78, hold:1, exit:1.01 }
    ] : [
      { enter:0, typeEnd:.19, hold:.235, exit:.295 },
      { enter:.30, typeEnd:.49, hold:.525, exit:.585 },
      { enter:.59, typeEnd:.80, hold:1, exit:1.01 }
    ];
    beats.forEach((beat, index) => {
      const t = timings[index];
      const fadeIn = index === 0 ? 1 : smooth(t.enter, t.enter + .045, progress);
      const fadeOut = index === timings.length - 1 ? 1 : 1 - smooth(t.hold, t.exit, progress);
      const opacity = fadeIn * fadeOut;
      beat.style.opacity = opacity.toFixed(3);
      beat.style.transform = `translate3d(0,${((1 - fadeIn) * 12 - (1 - fadeOut) * 8).toFixed(2)}px,0)`;
      beat.classList.toggle('is-active', opacity > .45);
      reveal(beat, index, smooth(t.enter, t.typeEnd, progress), opacity > .45);
    });
  }

  function heroProgress() {
    const rect = hero.getBoundingClientRect();
    return clamp(-rect.top / Math.max(1, hero.offsetHeight - innerHeight));
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(innerWidth < 760 ? 1.25 : 2, Math.max(1, devicePixelRatio || 1));
    width = Math.min(3840, Math.max(1, Math.round(rect.width * dpr)));
    height = Math.min(2160, Math.max(1, Math.round(rect.height * dpr)));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl?.viewport(0, 0, width, height);
    }
  }

  let uniforms = null;
  try { uniforms = createRenderer(); }
  catch (error) { hero.classList.add('is-render-fallback'); console.warn(error); }

  function fallbackPaint() {
    const context = canvas.getContext('2d');
    if (!context) return;
    const gradient = context.createRadialGradient(width*.5,height*.42,0,width*.5,height*.42,Math.max(width,height)*.7);
    gradient.addColorStop(0,'#143d2e');
    gradient.addColorStop(1,'#06120f');
    context.fillStyle=gradient;
    context.fillRect(0,0,width,height);
  }

  function render(time = 0) {
    hero.style.setProperty('--cell-progress', progress.toFixed(5));
    document.body.classList.toggle('terminal-past', hero.getBoundingClientRect().bottom <= Math.max(84, innerHeight * .12));
    updateCopy();
    if (!gl || !uniforms) { fallbackPaint(); return; }
    gl.uniform2f(uniforms.resolution, width, height);
    gl.uniform1f(uniforms.progress, progress);
    gl.uniform1f(uniforms.time, reduced ? 0 : time * .001);
    gl.uniform1f(uniforms.portrait, innerWidth / Math.max(1, innerHeight) < .82 ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function tick(time) {
    frame = 0;
    if (!reduced) {
      const distance = targetProgress - progress;
      // Snap the final handoff so the sticky scene never keeps easing after it releases.
      // Elsewhere, render only while scroll progress is converging instead of burning a
      // permanent 60fps WebGL loop after the hero is finished.
      const easing=innerWidth<760?.30:.18;
      progress = targetProgress > .985 ? targetProgress : (Math.abs(distance) < .00018 ? targetProgress : progress + distance * easing);
    }
    render(time);
    if (visible && !reduced && Math.abs(targetProgress - progress) > .00018) frame = requestAnimationFrame(tick);
  }

  function queue() {
    targetProgress = reduced ? .16 : heroProgress();
    if (reduced) progress = targetProgress;
    if (!frame) frame = requestAnimationFrame(tick);
  }

  prepareType();
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) queue();
    else if (frame) { cancelAnimationFrame(frame); frame = 0; }
  }, { rootMargin:'5%' }).observe(hero);
  addEventListener('scroll', queue, { passive:true });
  addEventListener('resize', () => { resize(); queue(); }, { passive:true });
  addEventListener('pageshow', queue);
  resize();
  render();
})();
