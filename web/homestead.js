const HOUSE_PRICE = 150;
const PASS_PRICE = 80;
const FURNISHINGS = {
 sofa:{name:'Sofá de musgo',icon:'🛋️',price:55},
 table:{name:'Silla de roble',icon:'🪑',price:32},
 plant:{name:'Helecho espora',icon:'🪴',price:25},
 plush:{name:'Peluche de Brotín',icon:'🦊',price:38},
 lamp:{name:'Lámpara de cristal',icon:'🏮',price:45},
 rug:{name:'Tapete de la laguna',icon:'🟩',price:30},
 books:{name:'Biblioteca de campo',icon:'📚',price:48},
 trophy:{name:'Trofeo de la Torre',icon:'🏆'}
};
const HOUSE_COLS = 13, HOUSE_ROWS = 9, HOUSE_TILE = 24;
const HOUSE_ENTRY = {x:2,y:8,facing:'up'};
const HOUSE_SLOTS = [];
for (const y of [0,1,3,5,7,8]) {
 for (let x = 0; x < HOUSE_COLS; x++) {
   if (x !== 2 && x !== 6 && x !== 10) HOUSE_SLOTS.push({x,y});
 }
}
const HOUSE_SLOT_AT = new Map(HOUSE_SLOTS.map(({x,y},i)=>[y*HOUSE_COLS+x,i]));

function houseWall(x,y) {
 return x === 6 && y !== 2 && y !== 6 || y === 4 && x !== 2 && x !== 10;
}
function houseFurniture(x,y) {
 return state.homestead.placed[HOUSE_SLOT_AT.get(y*HOUSE_COLS+x)];
}
const TOWER = {zone:0,x:15,y:10,name:'Torre de Batalla',symbol:'▣'};
const TOWER_FLOORS = [
 {name:'Centinela Espora',level:6,coins:45,xp:180,element:0},
 {name:'Vigía Nácar',level:13,coins:65,xp:340,element:2},
 {name:'Custodio de Ceniza',level:22,coins:90,xp:570,element:1},
 {name:'Guardia del Prisma',level:34,coins:130,xp:850,element:2},
 {name:'Soberano de la Cumbre',level:46,coins:200,xp:1300,element:1}
];

function validHomestead(raw) {
 const count = value => Number.isSafeInteger(value) && value >= 0 ? value : 0;
 const owned = raw?.owned === true;
 const clears = count(raw?.clears);
 const floor = count(raw?.floor);
 const placed = Array(HOUSE_SLOTS.length).fill(null);
 const stock = {};
 for (const id of Object.keys(FURNISHINGS)) {
   if (id !== 'trophy') stock[id] = count(raw?.stock?.[id]);
 }
 if (owned && Array.isArray(raw.placed)) {
   let trophyPlaced = false;
   for (let i = 0; i < placed.length; i++) {
     const id = raw.placed[i];
     if (typeof id !== 'string' || !Object.hasOwn(FURNISHINGS,id)) continue;
     if (id === 'trophy' && (!clears || trophyPlaced)) continue;
     placed[i] = id;
     trophyPlaced ||= id === 'trophy';
   }
 }
 return {credits:count(raw?.credits),vials:count(raw?.vials),owned,placed,stock,
   floor:floor <= TOWER_FLOORS.length ? floor : 0,clears};
}

function earnCredits(amount) {
 state.homestead.credits = Math.min(Number.MAX_SAFE_INTEGER,state.homestead.credits + amount);
}
function spendCredits(amount) {
 if (state.homestead.credits < amount) return false;
 state.homestead.credits -= amount;
 return true;
}
function grantXP(monster, amount) {
 monster.xp += amount;
 while (monster.level < 50 && monster.xp >= monster.level * 25) {
   monster.xp -= monster.level * 25;
   monster.level++;
 }
 if (monster.level === 50) monster.xp = 0;
}

const wallet = () => `<p class="credit-balance"><b>${state.homestead.credits}</b> créditos</p>`;
let selectedFurnishing = '', editingHouse = false;
let housePosition = {...HOUSE_ENTRY}, houseVisual = null, houseFrame = 0;

function drawHouse() {
 const canvas = $('#house-map');
 if (!canvas) return;
 const width = HOUSE_COLS*HOUSE_TILE, height = HOUSE_ROWS*HOUSE_TILE;
 const pixels = Math.round(canvas.clientWidth*(window.devicePixelRatio||1));
 if (pixels < 1) return;
 if (canvas.width !== pixels) {
   canvas.width = pixels;
   canvas.height = Math.round(pixels*height/width);
 }
 const c = canvas.getContext('2d');
 c.setTransform(canvas.width/width,0,0,canvas.height/height,0,0);
 for (let y=0;y<HOUSE_ROWS;y++) {
   for (let x=0;x<HOUSE_COLS;x++) {
     const left=x*HOUSE_TILE, top=y*HOUSE_TILE;
     const palette = y<4 ? (x<6 ? ['#b88b65','#ab805a'] : ['#859680','#788b74']) :
       (x<6 ? ['#c5a37a','#b9946b'] : ['#a891a7','#9a839a']);
     c.fillStyle = palette[(x+y)%2];
     c.fillRect(left,top,HOUSE_TILE,HOUSE_TILE);
     c.fillStyle = '#4e322827';
     c.fillRect(left,top+11,HOUSE_TILE,1);
     if (houseWall(x,y)) {
       c.fillStyle = '#594439';
       c.fillRect(left,top,HOUSE_TILE,HOUSE_TILE);
       c.fillStyle = '#9c7a60';
       c.fillRect(left+2,top+2,HOUSE_TILE-4,5);
     }
     const furniture=houseFurniture(x,y);
     if (furniture) {
       c.fillStyle='#fff9df';
       c.font='17px system-ui';
       c.textAlign='center';
       c.textBaseline='middle';
       c.fillText(FURNISHINGS[furniture].icon,left+12,top+13);
     }
   }
 }
 const p=houseVisual||housePosition;
 HeroArt.draw(c,(p.x+.5)*HOUSE_TILE,(p.y+.87)*HOUSE_TILE,p.facing,
   houseVisual?performance.now()/55:0,state.player);
}
window.addEventListener('resize',drawHouse);

function stepHouse(direction,delta) {
 if (editingHouse) return false;
 const x=housePosition.x+delta[0],y=housePosition.y+delta[1];
 housePosition.facing=direction;
 if (x<0 || x>=HOUSE_COLS || y<0 || y>=HOUSE_ROWS || houseWall(x,y) || houseFurniture(x,y)) {
   drawHouse();
   return false;
 }
 const from=houseVisual||housePosition, next={x,y,facing:direction};
 housePosition=next;
 cancelAnimationFrame(houseFrame);
 const start=performance.now();
 function walk(now) {
   if (tab!=='house' || editingHouse || !$('#house-map')) {houseVisual=null;return;}
   const progress=Math.min(1,(now-start)/135);
   houseVisual=progress===1?null:{
     x:from.x+(next.x-from.x)*progress,y:from.y+(next.y-from.y)*progress,facing:direction
   };
   drawHouse();
   if (progress<1) houseFrame=requestAnimationFrame(walk);
 }
 houseFrame=requestAnimationFrame(walk);
 return true;
}

function renderHouse(main) {
 const house = state.homestead;
 if (!house.owned) {
   main.innerHTML = `<section class="estate"><h1>Tu casa</h1>${wallet()}
     <p>Consigue una cabaña en Bosque Espora y decórala con los objetos que compres o ganes.</p>
     <button id="buy-house" class="primary" ${house.credits < HOUSE_PRICE ? 'disabled' : ''}>Comprar casa · ${HOUSE_PRICE} créditos</button></section>`;
   $('#buy-house').onclick = () => {
     if (!house.owned && spendCredits(HOUSE_PRICE)) { house.owned = true; render(); }
   };
   return;
 }
 if (houseFurniture(housePosition.x,housePosition.y)) housePosition={...HOUSE_ENTRY};
 const available = id => id === 'trophy' ? Number(house.clears > 0 && !house.placed.includes(id)) : house.stock[id];
 if (selectedFurnishing && !available(selectedFurnishing)) selectedFurnishing = '';
 const slots = editingHouse ? HOUSE_SLOTS.map(({x,y},i)=>{
   const id=house.placed[i];
   const occupied=housePosition.x===x && housePosition.y===y;
   return `<button data-place="${i}" style="grid-column:${x+1};grid-row:${y+1}" ${occupied?'disabled':''}
     aria-label="${id ? FURNISHINGS[id].name + ', tocar para guardar' : 'Espacio libre ' + (i + 1)}">${id ? '' : '+'}</button>`;
 }).join('') : '';
 main.innerHTML = `<section class="estate house"><div class="row"><h1>Tu casa</h1><button id="to-shop">Ir a la tienda</button></div>
   <div class="house-plan"><canvas id="house-map" aria-label="Plano de tu casa con cuatro habitaciones"></canvas>
   ${editingHouse?`<div class="house-slots">${slots}</div>`:''}</div>
   <div class="house-controls"><button id="house-mode" class="primary" aria-pressed="${editingHouse}">${editingHouse?'Terminar de decorar':'Decorar'}</button>
   ${editingHouse?'':movementPad()}</div>
   ${editingHouse?`<h2>Decoraciones</h2><p>${selectedFurnishing ? 'Toca un espacio libre para colocar ' + FURNISHINGS[selectedFurnishing].name + '.' : 'Elige una decoración para colocarla. Toca un objeto colocado para guardarlo.'}</p>
   <div class="actions">${Object.entries(FURNISHINGS).filter(([id])=>available(id)>0).map(([id,item])=>`<button data-furnish="${id}" aria-pressed="${selectedFurnishing===id}">${item.icon} ${item.name} ×${available(id)}</button>`).join('') || '<p>Tu inventario de decoraciones está vacío.</p>'}</div>`:''}</section>`;
 $('#to-shop').onclick = () => go('shop');
 $('#house-mode').onclick = () => {
   stopMove();
   cancelAnimationFrame(houseFrame);
   houseVisual=null;
   editingHouse=!editingHouse;
   renderHouse(main);
   $('#house-mode').focus();
 };
 main.querySelectorAll('[data-furnish]').forEach(button => button.onclick = () => {
   selectedFurnishing = button.dataset.furnish;
   renderHouse(main);
 });
 main.querySelectorAll('[data-place]').forEach(button => button.onclick = () => {
   const slot = Number(button.dataset.place), previous = house.placed[slot];
   if (previous) {
     if (previous !== 'trophy') house.stock[previous]++;
     house.placed[slot] = null;
   } else if (selectedFurnishing && available(selectedFurnishing)) {
     house.placed[slot] = selectedFurnishing;
     if (selectedFurnishing !== 'trophy') house.stock[selectedFurnishing]--;
   }
   save();
   renderHouse(main);
 });
 drawHouse();
 setupControls();
}

function confirmShopPurchase(name, price, addItem) {
 if ($('#modal').childElementCount) return;
 modal(`<h2>Confirmar compra</h2><p>¿Comprar 1 × ${name} por ${price} créditos?</p>
   <div class="actions"><button id="shop-cancel">Cancelar</button><button id="shop-confirm" class="primary" disabled>Confirmar compra</button></div>`);
 const opener = document.activeElement;
 const cancel = $('#shop-cancel'), confirm = $('#shop-confirm');
 cancel.onclick = () => {close();opener?.focus();};
 cancel.focus();
 // A quick second tap on the card must never confirm the purchase.
 setTimeout(() => {confirm.disabled=false;},350);
 confirm.addEventListener('click',()=>{
   if (tab!=='shop' || !confirm.isConnected) return;
   if (!spendCredits(price)) {close();toast('No tienes suficientes créditos.');return;}
   addItem();
   close();
   render();
   $('#shop-receipt').textContent=`Compra realizada. Recibiste 1 × ${name}.`;
   $('#shop-receipt').focus();
 },{once:true});
}

function renderShop(main) {
 const house = state.homestead, vialPrice = 95;
 main.innerHTML = `<section class="estate"><h1>Tienda de la expedición</h1>${wallet()}<p id="shop-receipt" role="status" tabindex="-1"></p>
   <div class="panel"><h2>Frasco de experiencia</h2><p>Sube 10 niveles a la criatura que elijas, hasta el nivel 50. Tienes ${house.vials}.</p>
   <div class="actions"><button id="buy-vial" ${house.credits < vialPrice ? 'disabled' : ''}>Comprar · ${vialPrice} créditos</button>
   <button id="use-vial" ${house.vials && state.monsters.some(m=>m.level<50) ? '' : 'disabled'}>Usar un frasco</button></div></div>
   <h2>Decoraciones para tu casa</h2><div class="shop-grid">${Object.entries(FURNISHINGS).filter(([,item])=>item.price).map(([id,item])=>`<div class="panel shop-item"><span aria-hidden="true">${item.icon}</span><b>${item.name}</b><button data-buy="${id}" ${house.credits < item.price ? 'disabled' : ''}>Comprar · ${item.price}</button></div>`).join('')}</div></section>`;
 $('#buy-vial').onclick = () => confirmShopPurchase('Frasco de experiencia',vialPrice,()=>{house.vials++;});
 $('#use-vial').onclick = () => {
   modal(`<h2>Elige una criatura</h2><label>Recibirá hasta 10 niveles <select id="vial-target">${state.monsters.filter(m=>m.level<50).map(m=>`<option value="${m.id}">${m.name} · Nv ${m.level}</option>`).join('')}</select></label>
     <div class="actions"><button id="vial-confirm" class="primary">Usar frasco</button><button id="vial-cancel">Volver</button></div>`);
   $('#vial-cancel').onclick = close;
   $('#vial-confirm').onclick = () => {
     const monster = state.monsters.find(m=>m.id===$('#vial-target').value);
     if (!house.vials || !monster || monster.level >= 50) return;
     monster.level = Math.min(50,monster.level + 10);
     if (monster.level === 50) monster.xp = 0;
     house.vials--;
     close();
     render();
     toast(`${monster.name} alcanzó el nivel ${monster.level}.`);
   };
 };
 main.querySelectorAll('[data-buy]').forEach(button => button.onclick = () => {
   const id = button.dataset.buy;
   const item = FURNISHINGS[id];
   confirmShopPurchase(item.name,item.price,()=>{house.stock[id]++;});
 });
}

function renderTower(main) {
 const tower = state.homestead;
 main.innerHTML = `<section class="estate tower"><h1>Torre de Batalla</h1>${wallet()}
   <p>Cinco pisos. Recuperas la vitalidad entre combates. Si pierdes o te retiras, necesitarás otro pase.</p>
   ${tower.clears ? '<p>🏆 Trofeo disponible en tu casa.</p>' : '<p>🏆 Supera los cinco pisos para ganar el trofeo.</p>'}
   <ol class="tower-floors">${TOWER_FLOORS.map((floor,i)=>`<li ${tower.floor===i+1 ? 'aria-current="step"' : ''}><b>${i+1}. ${floor.name}</b><small>Nv ${floor.level} · ${floor.coins} créditos · ${floor.xp} EXP</small></li>`).join('')}</ol>
   <button id="tower-enter" class="primary" ${!tower.floor && tower.credits < PASS_PRICE ? 'disabled' : ''}>${tower.floor ? 'Combatir en el piso ' + tower.floor : 'Comprar pase y entrar · ' + PASS_PRICE + ' créditos'}</button></section>`;
 $('#tower-enter').onclick = () => {
   if (battle) return;
   if (!tower.floor) {
     if (!spendCredits(PASS_PRICE)) return;
     tower.floor = 1;
   }
   const floor = TOWER_FLOORS[tower.floor-1];
   const enemy = G.wild(9101 + tower.floor);
   enemy.name = floor.name;
   enemy.level = floor.level;
   enemy.genes.element = [floor.element,floor.element];
   beginBattle(enemy,`El ${floor.name} te espera en el piso ${tower.floor}.`,{towerFloor:tower.floor});
 };
}

function rewardTower(b) {
 const tower = state.homestead, floor = TOWER_FLOORS[b.towerFloor-1];
 earnCredits(floor.coins);
 grantXP(b.ally,floor.xp);
 b.log.push(`Piso ${b.towerFloor} superado. +${floor.coins} créditos · +${floor.xp} EXP.`);
 if (b.towerFloor < TOWER_FLOORS.length) {
   tower.floor++;
 } else {
   tower.floor = 0;
   if (!tower.clears) b.log.push('¡Ganaste el trofeo! Puedes colocarlo en tu casa.');
   tower.clears++;
 }
}
