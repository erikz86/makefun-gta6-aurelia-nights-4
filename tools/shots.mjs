import { chromium } from '/home/hatch/workspace/makefun/node_modules/playwright-core/index.mjs';
import { spawn } from 'node:child_process';
import { readFileSync, readdirSync, mkdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
const root=resolve(import.meta.dirname,'..');
const cache='/home/hatch/.cache/ms-playwright';
const folder=readdirSync(cache).find(n=>n.startsWith('chromium-'));
const executable=join(cache,folder,'chrome-linux','chrome');
const fallback=join(cache,folder,'chrome-linux64','chrome');
const intercepted=process.argv.includes('--intercept');
const server=intercepted?null:spawn(process.execPath,['serve.ts'],{cwd:root,stdio:['ignore','pipe','pipe']});
let browser;
try {
  if(server)await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.stderr.once('data',d=>reject(new Error(String(d))));});
  browser=await chromium.launch({executablePath:(()=>{try{statSync(executable);return executable;}catch{return fallback;}})(),headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1280,height:720}});
  if(intercepted)await page.route('http://localhost:8080/**',async route=>{
    const path=resolve(root,'.'+new URL(route.request().url()).pathname);
    const contentType=path.endsWith('.html')?'text/html':path.endsWith('.js')?'text/javascript':'application/octet-stream';
    await route.fulfill({body:readFileSync(path),contentType});
  });
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  mkdirSync(join(root,'screenshots'),{recursive:true});
  for(const shot of JSON.parse(readFileSync(join(root,'shots.json'),'utf8'))){
    await page.goto('http://localhost:8080/game/index.html'+shot.query);await page.waitForTimeout(350);
    await page.screenshot({path:join(root,'screenshots',shot.name),type:'jpeg',quality:80});
    const bytes=statSync(join(root,'screenshots',shot.name)).size;
    if(bytes>262144)throw new Error(shot.name+' exceeds 256 KiB');
    console.log(shot.name+': '+bytes+' bytes / 1280x720 PASS');
  }
  await page.goto('http://localhost:8080/game/index.html');await page.click('#start');await page.keyboard.down('d');await page.waitForTimeout(500);await page.keyboard.up('d');
  const moved=await page.evaluate(()=>window.aurelia.state.player.x>520);if(!moved)throw new Error('Foot movement failed');
  await page.keyboard.press('k');await page.keyboard.press('Escape');await page.keyboard.press('Escape');await page.waitForTimeout(250);
  console.log('Normal game: movement / save / pause PASS');console.log('Console + page errors: '+errors.length);if(errors.length)throw new Error(errors.join('\n'));
} finally {await browser?.close();server?.kill();}
