import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';
import { chromium } from '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import sharp from '/tmp/canby-gltf/node_modules/sharp/lib/index.js';

const [,,requestedBase,outDir,mode='desktop',startRaw='0',endRaw='129'] = process.argv;
const selected=startRaw.includes(',')?startRaw.split(',').map(Number):null;
const start=selected?Math.min(...selected):Number(startRaw),end=selected?Math.max(...selected):Number(endRaw);
const size=mode==='mobile'?{width:720,height:1280}:{width:1600,height:900};
fs.mkdirSync(outDir,{recursive:true});
let server;
let baseUrl=requestedBase;
if(requestedBase==='auto'){
  const root=path.dirname(fileURLToPath(import.meta.url));
  server=http.createServer((request,response)=>{
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const file=path.normalize(path.join(root,pathname));
    if(!file.startsWith(root)){response.writeHead(403).end();return}
    fs.readFile(file,(error,data)=>{
      if(error){response.writeHead(404).end();return}
      const ext=path.extname(file);const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.glb':'model/gltf-binary'}[ext]||'application/octet-stream';
      response.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-store'});response.end(data);
    });
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  baseUrl=`http://127.0.0.1:${server.address().port}`;
}
const browser=await chromium.launch({headless:true,executablePath:'/tmp/chromium',args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--enable-webgl','--ignore-gpu-blocklist','--disable-dev-shm-usage','--allow-file-access-from-files','--disable-web-security']});
const page=await browser.newPage({viewport:size,deviceScaleFactor:1});
page.on('console',message=>console.log(`browser: ${message.type()} ${message.text()}`));
page.on('pageerror',error=>console.error(`browser error: ${error.message}`));
await page.goto(`${baseUrl}/render_scene.html?w=${size.width}&h=${size.height}&mode=${mode}`,{waitUntil:'load'});
await page.waitForFunction(()=>window.__READY||window.__ERROR,null,{timeout:120000});
const error=await page.evaluate(()=>window.__ERROR||null);if(error)throw new Error(error);
const frames=selected||Array.from({length:end-start+1},(_,i)=>start+i);
for(const frame of frames){
  await page.evaluate(f=>window.setAnimationFrame(f),frame);
  const base=`frame_${String(frame+1).padStart(3,'0')}`,temporary=path.join(outDir,`${base}.png`),file=path.join(outDir,`${base}.webp`);
  await page.screenshot({path:temporary,type:'png'});
  await sharp(temporary).webp({quality:88,effort:4,smartSubsample:true}).toFile(file);
  fs.unlinkSync(temporary);
  if(frame===start||frame===end||frame%15===0)console.log(`${mode} ${frame+1}/${end+1}`);
}
await browser.close();
if(server)await new Promise(resolve=>server.close(resolve));
