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
const FLOOR_COUNT = 15;
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
 const placed = Array(FLOOR_COUNT).fill(null);
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
let selectedFurnishing = '';

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
 const available = id => id === 'trophy' ? Number(house.clears > 0 && !house.placed.includes(id)) : house.stock[id];
 if (selectedFurnishing && !available(selectedFurnishing)) selectedFurnishing = '';
 main.innerHTML = `<section class="estate"><div class="row"><h1>Tu casa</h1><button id="to-shop">Ir a la tienda</button></div>
   <div class="cabin"><div class="cabin-wall" aria-hidden="true"><span>🪟</span><span>🪟</span></div>
   <div class="cabin-floor">${house.placed.map((id,i)=>`<button data-place="${i}" aria-label="${id ? FURNISHINGS[id].name + ', tocar para guardar' : 'Espacio libre ' + (i + 1)}">${id ? FURNISHINGS[id].icon : '·'}</button>`).join('')}</div></div>
   <h2>Decoraciones</h2><p>${selectedFurnishing ? 'Toca un espacio libre para colocar ' + FURNISHINGS[selectedFurnishing].name + '.' : 'Elige una decoración para colocarla. Toca un objeto colocado para guardarlo.'}</p>
   <div class="actions">${Object.entries(FURNISHINGS).filter(([id])=>available(id)>0).map(([id,item])=>`<button data-furnish="${id}" aria-pressed="${selectedFurnishing===id}">${item.icon} ${item.name} ×${available(id)}</button>`).join('') || '<p>Tu inventario de decoraciones está vacío.</p>'}</div></section>`;
 $('#to-shop').onclick = () => go('shop');
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
}

function renderShop(main) {
 const house = state.homestead, vialPrice = 95;
 main.innerHTML = `<section class="estate"><h1>Tienda de la expedición</h1>${wallet()}
   <div class="panel"><h2>Frasco de experiencia</h2><p>Sube 10 niveles a la criatura que elijas, hasta el nivel 50. Tienes ${house.vials}.</p>
   <div class="actions"><button id="buy-vial" ${house.credits < vialPrice ? 'disabled' : ''}>Comprar · ${vialPrice} créditos</button>
   <button id="use-vial" ${house.vials && state.monsters.some(m=>m.level<50) ? '' : 'disabled'}>Usar un frasco</button></div></div>
   <h2>Decoraciones para tu casa</h2><div class="shop-grid">${Object.entries(FURNISHINGS).filter(([,item])=>item.price).map(([id,item])=>`<div class="panel shop-item"><span aria-hidden="true">${item.icon}</span><b>${item.name}</b><button data-buy="${id}" ${house.credits < item.price ? 'disabled' : ''}>Comprar · ${item.price}</button></div>`).join('')}</div></section>`;
 $('#buy-vial').onclick = () => { if (spendCredits(vialPrice)) { house.vials++; render(); } };
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
   if (spendCredits(FURNISHINGS[id].price)) { house.stock[id]++; render(); }
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
