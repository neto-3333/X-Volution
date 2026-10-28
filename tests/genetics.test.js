const assert=require('node:assert/strict'),G=require('../web/genetics.js');
for(let i=1;i<=3000;i++){
 const a=G.wild(i),b=G.wild(i+9000),c=G.breed(a,b,i+20000);
 assert.deepEqual(G.wild(i),a);
 assert.deepEqual(c,G.breed(a,b,i+20000));
 for(const k of G.keys){assert(a.genes[k].includes(c.genes[k][0]));assert(b.genes[k].includes(c.genes[k][1]));assert(c.genes[k].every(v=>v>=0&&v<G.traits[k].length));}
 for(const [k,source] of Object.entries(G.anchors)){assert.equal(G.value(c,k),G.value(source===0?a:b,k));assert.equal(c.origin[k],source===0?'A':'B');}
 const grandchild=G.breed(c,a,i+30000);assert.equal(grandchild.generation,2);
 assert(G.stats(c).max>0);assert(G.damage(a,b,1,()=>.5,false)>0);
 assert(G.damage(a,b,1,()=>.5,true)<=G.damage(a,b,1,()=>.5,false));
}
assert.equal(G.keys.length,24);assert.equal(new Set(Array.from({length:1000},(_,i)=>G.value(G.wild(i),'anatomy'))).size,7);
assert.throws(()=>{const m=G.wild(1);G.breed(m,m,2);});
console.log('PASS: 3,000 cruces, determinismo, alelos de ambos padres, rasgos ancla, segunda generación y daño.');

for(let i=0;i<500;i++){const a=G.wild(i),b=G.wild(i+5000),c=G.breed(a,b,i+9000);for(const k of ['arms','neck']){assert(a.genes[k].includes(c.genes[k][0]));assert(b.genes[k].includes(c.genes[k][1]));}}
const old=G.wild(22);delete old.genes.arms;delete old.expression.arms;const upgraded=G.upgrade(old);assert(G.valid(upgraded));assert.deepEqual(upgraded,G.upgrade(old));
