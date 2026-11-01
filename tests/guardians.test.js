const {chromium}=require('playwright');
const assert=require('node:assert/strict'),http=require('http'),fs=require('fs'),path=require('path');
(async()=>{
 const root=path.join(__dirname,'../web');
 const server=http.createServer((req,res)=>{try{const f=path.join(root,req.url==='/'?'index.html':req.url);res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.statusCode=404;res.end();}});
 await new Promise(r=>server.listen(8880,'127.0.0.1',r));
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
 const page=await browser.newPage({viewport:{width:412,height:915},deviceScaleFactor:3});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8880');
 assert.equal(await page.evaluate(()=>ADVENTURE_DUNGEONS.length),3);
 for(let i=0;i<3;i++){
  assert(await page.evaluate(index=>{const boss=bossMonster(index),other=state.monsters[0];if(!G.valid(boss))return false;for(const pair of [[boss,other],[other,boss]]){const child=G.breed(...pair,777);if(G.value(child,'crest')!==4+index)return false;const grandchild=G.breed(child,other,778);if(G.value(grandchild,'crest')!==4+index)return false;}return G.value(G.upgrade({...boss,genes:{...boss.genes,crest:[4,4]}}),'crest')===index+4;},i));
  await page.evaluate(index=>startDungeon(index),i);await page.waitForFunction(()=>document.querySelector('#dungeon-status').textContent.includes('Oleada'));
  assert(await page.evaluate(()=>{const c=document.querySelector('#arena'),r=c.getBoundingClientRect();return c.width===Math.round(r.width*devicePixelRatio)&&c.height===Math.round(r.height*devicePixelRatio)&&Math.abs(c.getContext('2d').getTransform().a-c.width/420)<.001&&document.querySelector('#modal').childElementCount===0}));
  await page.screenshot({path:path.join(__dirname,`../dist/mazmorra-${i+1}-hd.png`)});
  await page.setViewportSize({width:915,height:412});await page.waitForTimeout(150);
  assert(await page.evaluate(()=>{const c=document.querySelector('#arena');return c.width===Math.round(c.clientWidth*devicePixelRatio)&&c.height===Math.round(c.clientHeight*devicePixelRatio)}));
  await page.click('#leave-dungeon');await page.click('#dungeon-return');await page.setViewportSize({width:412,height:915});
 }
 await page.evaluate(()=>{document.querySelector('#main').innerHTML='<h1>Tres guardianes originales</h1>';for(let i=0;i<3;i++){const c=document.createElement('canvas');GuardianArt.draw(c,i);c.style.width='31%';document.querySelector('#main').append(c);}document.body.classList.remove('exploring');});await page.setViewportSize({width:1200,height:520});await page.screenshot({path:path.join(__dirname,'../dist/guardianes-hd.png')});
 assert.deepEqual(errors,[]);console.log('PASS: tres diseños fijos, herencia en ambos órdenes y dos generaciones, migración, lienzo a DPR 3 y cambio de orientación.');
 }finally{await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exit(1);});
