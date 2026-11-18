const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');

(async()=>{
 const server=http.createServer((req,res)=>{
   const file=path.join(__dirname,'../web',req.url==='/'?'index.html':req.url);
   try { res.end(fs.readFileSync(file)); } catch { res.writeHead(404).end(); }
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;
 try {
   browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
   const page=await browser.newPage({viewport:{width:360,height:640}});
   const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await require('./legacy-save')(page);
   await page.goto('http://127.0.0.1:'+server.address().port);
   const click=id=>page.locator(id).click();
   async function nav(tab){
     await click('#menu-toggle');
     await click(`nav [data-tab="${tab}"]`);
   }
   await nav('house');
   assert(await page.locator('#buy-house').isDisabled());
   await page.evaluate(()=>{go('explore'); encounter(); battle.eh=1;});
   await click('#attack');
   await page.waitForSelector('#finish');
   await click('#finish');
   assert(await page.evaluate(()=>state.homestead.credits>0));
   await page.evaluate(()=>{state.homestead.credits=400;save();});
   await nav('house');
   await click('#buy-house');
   await click('#to-shop');
   await page.locator('[data-buy=plant]').dblclick();
   assert.equal(await page.evaluate(()=>state.homestead.stock.plant),0);
   await click('#shop-cancel');
   assert.equal(await page.evaluate(()=>state.homestead.credits),250);
   await click('[data-buy=plant]');
   await click('#shop-confirm');
   assert.match(await page.locator('#shop-receipt').innerText(),/Recibiste 1 × Helecho/);
   assert.equal(await page.evaluate(()=>state.homestead.stock.plant),1);
   await click('#buy-vial');
   await click('#shop-confirm');
   await click('#use-vial');
   const before=await page.evaluate(()=>current().level);
   await click('#vial-confirm');
   assert.equal(await page.evaluate(()=>current().level),before+10);
   await nav('house');
   await click('#house-mode');
   await click('[data-furnish=plant]');
   await click('[data-place="0"]');
   await page.reload();
   await nav('house');
   await click('#house-mode');
   assert.match(await page.locator('[data-place="0"]').getAttribute('aria-label'),/Helecho/);
   await click('#house-mode');
   for(let i=0;i<8;i++) await page.keyboard.press('ArrowUp');
   assert.deepEqual(await page.evaluate(()=>[housePosition.x,housePosition.y]),[2,0]);
   await click('[data-move=left]');
   await click('[data-move=left]');
   assert.deepEqual(await page.evaluate(()=>[housePosition.x,housePosition.y]),[1,0]);
   await click('#house-mode');
   await click('[data-place="0"]');
   assert(await page.locator('[data-furnish=plant]').isVisible());
   await click('#house-mode');
   await page.keyboard.press('ArrowDown');
   await page.keyboard.press('ArrowDown');
   for(let i=0;i<9;i++)await page.keyboard.press('ArrowRight');
   for(let i=0;i<6;i++)await page.keyboard.press('ArrowDown');
   assert.deepEqual(await page.evaluate(()=>[housePosition.x,housePosition.y]),[10,8]);
   assert(await page.evaluate(()=>{
     const old={owned:true,clears:1,placed:Array(15).fill(null)};
     old.placed[0]='plant';
     old.placed[14]='trophy';
     const migrated=validHomestead(old);
     return migrated.placed.length>15 && migrated.placed[0]==='plant' && migrated.placed[14]==='trophy';
   }));
   await page.evaluate(()=>{state.position={x:15,y:10,facing:'right'};go('explore');});
   await click('#interact');
   assert(await page.locator('#tower-enter').isEnabled());
   const startCredits=await page.evaluate(()=>state.homestead.credits);
   for(let floor=1;floor<=5;floor++){
     await click('#tower-enter');
     assert(await page.locator('#capture').isDisabled());
     assert.equal(await page.evaluate(()=>battle.towerFloor),floor);
     if(floor===1)assert.equal(await page.evaluate(()=>state.homestead.credits),startCredits-80);
     await page.evaluate(()=>{battle.eh=1;});
     await click('#attack');
     await page.waitForSelector('#finish');
     await click('#finish');
     if(floor===2){await page.reload();await nav('tower');}
   }
   assert.equal(await page.evaluate(()=>state.homestead.credits),startCredits-80+45+65+90+130+200);
   assert(await page.evaluate(()=>current().level>15));
   await nav('house');
   await click('#house-mode');
   await click('[data-furnish=trophy]');
   await click('[data-place="7"]');
   await page.reload();
   await nav('house');
   await click('#house-mode');
   assert.match(await page.locator('[data-place="7"]').getAttribute('aria-label'),/Trofeo/);
   assert.equal(await page.locator('[data-furnish=trophy]').count(),0);
   await nav('tower');
   await click('#tower-enter');
   await click('#flee');
   await click('#finish');
   assert.equal(await page.evaluate(()=>state.homestead.floor),0);
   assert.deepEqual(errors,[]);
   console.log('PASS: crédito de combate, compra confirmada sin doble cobro, +10 niveles, movimiento por la casa, colisiones y decoración guardada, cinco pisos con un pase, reanudación, trofeo y retirada.');
 } finally {
   await browser?.close();
   server.close();
 }
})().catch(error=>{console.error(error);process.exitCode=1;});
