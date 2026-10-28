(function(root){
'use strict';
const traits={
 body:['Robusto','Esbelto','Redondo'],color:['Menta','Ámbar','Lavanda','Coral','Cielo'],
 ears:['Puntas','Aletas','Redondas'],horns:['Sin cuernos','Un cuerno','Dos cuernos'],
 tail:['Hoja','Llama','Maza'],pattern:['Liso','Motas','Rayas'],eyes:['Serenos','Feroces','Curiosos'],
 element:['Flora','Fuego','Agua'],size:['Pequeño','Mediano','Grande'],
 anatomy:['Bípedo','Cuadrúpedo','Serpentino','Alado','Gelatinoso','Artrópodo','Acuático'],
 head:['Felina','Reptiliana','Aviar','Anfibia','Insectoide'],
 headSize:['Cabeza pequeña','Cabeza mediana','Cabeza grande'],
 neck:['Cuello corto','Cuello largo','Cuello arqueado','Sin cuello'],
 bodyLength:['Compacto','Alargado','Muy alargado'],
 legs:['Garras','Pezuñas','Palmeadas','Segmentadas'],
 limbLength:['Extremidades cortas','Extremidades medias','Extremidades largas'],
 wings:['Sin alas','Membranas','Plumas','Élitros'],
 antennae:['Sin antenas','Antenas rectas','Antenas curvas'],
 surface:['Piel lisa','Pelaje','Escamas','Placas'],
 shell:['Sin caparazón','Caparazón redondo','Coraza espinosa'],
 muzzle:['Hocico corto','Hocico largo','Pico'],
 accent:['Marfil','Turquesa','Magenta','Ocre','Índigo'],
 crest:['Sin cresta','Cresta dorsal','Melena','Aleta dorsal'],
 arms:['Sin brazos','Brazos cortos','Brazos largos','Brazos con aletas']
};
const labels={body:'CUERPO',color:'COLOR',ears:'OREJAS',horns:'CUERNOS',tail:'COLA',pattern:'PATRÓN',eyes:'OJOS',element:'ELEMENTO',size:'TAMAÑO',anatomy:'ANATOMÍA',head:'CABEZA',headSize:'PROPORCIÓN CEFÁLICA',neck:'CUELLO',bodyLength:'LONGITUD CORPORAL',legs:'EXTREMIDADES',limbLength:'LONGITUD DE PATAS',wings:'ALAS',antennae:'ANTENAS',surface:'SUPERFICIE',shell:'CAPARAZÓN',muzzle:'HOCICO',accent:'COLOR SECUNDARIO',crest:'CRESTA',arms:'BRAZOS'};
const anchors={anatomy:0,body:0,head:1,color:1,surface:1};
const keys=Object.keys(traits),colors=['#74dfa4','#f4bb63','#bca1ee','#ef8e96','#78c8ed'];
const accents=['#f5e8bc','#56d8c9','#e782c7','#d9a34e','#6975c2'];
function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=Math.imul(a^a>>>15,1|a);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;};}
function pick(r,n){return Math.floor(r()*n);}
function value(m,k){return m.genes[k][m.expression[k]];}
function name(m){return ['Mus','Bra','Nim','Cor','Azu'][value(m,'color')]+['tar','dón','sier','vix','goma','krix','naut'][value(m,'anatomy')]+['ín','o','a'][value(m,'body')];}
function stats(m){return {max:42+value(m,'size')*9+m.level*6,atk:10+value(m,'horns')*2+m.level*2,def:5+value(m,'body')*2+m.level};}
function wild(seed){const r=rng(seed),m={id:'m'+seed+'_'+Math.floor(r()*1e8),seed,genes:{},expression:{},level:1,xp:0,generation:0,parents:[],origin:{}};for(const k of keys){m.genes[k]=[pick(r,traits[k].length),pick(r,traits[k].length)];m.expression[k]=pick(r,2);}m.name=name(m);return m;}
function valid(m,legacy=false){return !!m&&!!m.genes&&!!m.expression&&keys.every(k=>legacy&&!(k in m.genes)?true:Array.isArray(m.genes[k])&&m.genes[k].length===2&&m.genes[k].every(a=>Number.isInteger(a)&&a>=0&&a<traits[k].length)&&[0,1].includes(m.expression[k]));}
// Complete old DNA deterministically; never overwrite its existing alleles.
function upgrade(m){if(!valid(m,true))throw Error('ADN inválido');const fallback=wild(m.seed||0);const result={...m,genes:{...m.genes},expression:{...m.expression},origin:{...m.origin}};for(const k of keys){if(!(k in m.genes)){result.genes[k]=fallback.genes[k].slice();result.expression[k]=fallback.expression[k];delete result.origin[k];}}return result;}
function breed(a,b,seed){if(a.id===b.id)throw Error('Selecciona dos monstruos distintos.');if(!valid(a)||!valid(b))throw Error('ADN incompleto');const r=rng(seed),m={id:'h'+seed,seed,genes:{},expression:{},level:1,xp:0,generation:Math.max(a.generation,b.generation)+1,parents:[a.id,b.id],parentNames:[a.name,b.name],origin:{}};for(const k of keys){const source=anchors[k],ia=source===0?a.expression[k]:pick(r,2),ib=source===1?b.expression[k]:pick(r,2);m.genes[k]=[a.genes[k][ia],b.genes[k][ib]];m.expression[k]=source===undefined?pick(r,2):source;m.origin[k]=m.expression[k]===0?'A':'B';}m.name=name(m);return m;}
function damage(a,b,power,r,guard){const ae=value(a,'element'),be=value(b,'element');const mult=(ae+2)%3===be?1.4:(be+2)%3===ae?.75:1;return Math.max(2,Math.round((stats(a).atk*power-stats(b).def*.45)*mult*(.9+r()*.2)*(guard?.45:1)));}
root.Genetics={traits,labels,anchors,keys,colors,accents,rng,value,stats,wild,breed,damage,valid,upgrade};if(typeof module!=='undefined')module.exports=root.Genetics;
})(typeof window==='undefined'?globalThis:window);
