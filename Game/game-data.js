// ============================================================
// LEGACY ELEMENTAL — Game Data v2 (Hex Maps + Event Decks)
// ============================================================

// ── Characters ───────────────────────────────────────────────
const CHARACTERS = [
  { id:'arthur',    name:'Arthur Blackwood',       role:'O Pintor',       roleDesc:'Eco / Movimento',  portrait:'assets/chars/arthur.webp',    color:'#d4b77a', maxHp:10, maxSanity:8,  movement:4, survival:6, power:3, resist:3, ability:{ name:'Ilusão Visual',       desc:'1×/turno: cria ilusão em espaço adjacente; criaturas atacam a ilusão.' } },
  { id:'elizabeth', name:'Dra. Elizabeth Bancroft', role:'A Médica',       roleDesc:'Suporte',          portrait:'assets/chars/lenora.webp',    color:'#7ec6e8', maxHp:9,  maxSanity:10, movement:3, survival:8, power:2, resist:4, ability:{ name:'Cura Rápida',         desc:'Gasta 1 ação → +3 PV + remove 1 condição. 2×/turno, sem custo.' } },
  { id:'morgan',    name:'Morgan Huxley',           role:'O Alquimista',   roleDesc:'Utilitário',       portrait:'assets/chars/silas.webp',     color:'#9a7ed8', maxHp:8,  maxSanity:11, movement:3, survival:7, power:3, resist:3, ability:{ name:'Transmutação',        desc:'1×/turno: converte 2 de um material em 1 de outro.' } },
  { id:'thomas',    name:'Conde T. Wellington',     role:'O Burocrata',    roleDesc:'Econômico',        portrait:'assets/chars/reginaldo.webp', color:'#e27a5f', maxHp:8,  maxSanity:9,  movement:3, survival:6, power:3, resist:3, ability:{ name:'Negociação Mestre',   desc:'Compras custam −1 recurso (mín 1) no mercado.' } },
  { id:'jack',      name:'Jack Timber',             role:'O Lenhador',     roleDesc:'Combate / Tanque', portrait:'assets/chars/jack.webp',      color:'#6fb871', maxHp:10, maxSanity:6,  movement:3, survival:8, power:5, resist:5, ability:{ name:'Machado de Dois Gumes', desc:'Ataca com 1d10. Crítico natural (10) → perde 1 Sanidade.' } },
  { id:'cassandra', name:'Cassandra Vane',          role:'A Investigadora',roleDesc:'Versátil / Scout', portrait:'assets/chars/cassandra.webp', color:'#e8c87e', maxHp:10, maxSanity:8,  movement:3, survival:6, power:4, resist:3, ability:{ name:'Astúcia Nata',         desc:'1×/turno: +1 Movimento OU re-rola 1d10.' } },
  { id:'ivy',       name:'Ivy Hawthorne',           role:'A Botânica',     roleDesc:'Recursos',         portrait:'assets/chars/ivy.webp',       color:'#5aaa5c', maxHp:9,  maxSanity:9,  movement:3, survival:8, power:3, resist:3, ability:{ name:'Duplicação Vegetal',   desc:'Ao Coletar vegetal, recebe o dobro.' } },
  { id:'helena',    name:'Helena Gearwright',       role:'A Engenheira',   roleDesc:'Construção',       portrait:'assets/chars/helena.webp',    color:'#f0a060', maxHp:8,  maxSanity:9,  movement:3, survival:7, power:3, resist:4, ability:{ name:'Construção Avançada',  desc:'Estruturas de Acampamento custam −1 material (mín 1).' } },
];

// ── Creatures by territory ────────────────────────────────────
const CREATURES = {
  venaris: [
    { id:'ferocious-rat',     name:'Ferocious Rat',         tier:1, img:'assets/creatures/venaris/ferocious-rat.webp',     hp:5,  atk:[1,6,1],  res:1, escape:5, color:'#6fb871', note:'Matilhas de 1d4. Move 4 casas.' },
    { id:'nightmarish-spider',name:'Nightmarish Spider',    tier:1, img:'assets/creatures/venaris/nightmarish-spider.webp',hp:6,  atk:[1,6,1],  res:1, escape:5, color:'#6fb871', note:'Teia: acerto → −1 Mov próximo turno.' },
    { id:'spiked-toad',       name:'Spiked Toad',           tier:2, img:'assets/creatures/venaris/spiked-toad.webp',       hp:9,  atk:[1,8,2],  res:2, escape:6, color:'#6fb871', note:'Espinhos: atacante corpo a corpo sofre 1 dano.' },
    { id:'crimson-toad',      name:'Crimson-Spiked Toad',   tier:2, img:'assets/creatures/venaris/crimson-toad.webp',      hp:10, atk:[1,8,2],  res:2, escape:6, color:'#6fb871', note:'Crítico aplica Envenenado (1/turno, 2 rodadas).' },
    { id:'lunar-beast',       name:'Lunar Beast',           tier:2, img:'assets/creatures/venaris/lunar-beast.webp',       hp:10, atk:[1,8,2],  res:2, escape:6, color:'#6fb871', note:'Noite (turnos 4-6): +2 PV e +1 ATQ.' },
  ],
  glacis: [
    { id:'white-wolf',          name:'White Wolf',          tier:1, img:'assets/creatures/glacis/white-wolf.webp',          hp:7,  atk:[1,6,2],  res:1, escape:5, color:'#7ec6e8', note:'Par: 2+ adjacentes → +1 ATQ.' },
    { id:'froststing-scorpion', name:'Froststing Scorpion', tier:1, img:'assets/creatures/glacis/froststing-scorpion.webp', hp:6,  atk:[1,6,2],  res:1, escape:5, color:'#7ec6e8', note:'Ferrão: aplica Lentidão (−1 Mov, 1 turno).' },
    { id:'frostbite-serpent',   name:'Frostbite Serpent',   tier:2, img:'assets/creatures/glacis/frostbite-serpent.webp',   hp:9,  atk:[1,8,2],  res:2, escape:6, color:'#7ec6e8', note:'Congelamento: acerto drena 1 Sanidade.' },
    { id:'glacial-sentinel',    name:'Glacial Sentinel',    tier:3, img:'assets/creatures/glacis/glacial-sentinel.webp',    hp:13, atk:[1,10,2], res:3, escape:7, color:'#7ec6e8', note:'Imaterial: dano total só de armas encantadas.' },
    { id:'ice-guardian',        name:'Ice Guardian',        tier:3, img:'assets/creatures/glacis/ice-guardian.webp',        hp:15, atk:[1,10,2], res:4, escape:7, color:'#7ec6e8', note:'Frágil ao fogo: +2 dano, ignora 2 RES.' },
  ],
  terragorn: [
    { id:'fanged-blossom',    name:'Fanged Blossom',    tier:1, img:'assets/creatures/terragorn/fanged-blossom.webp',    hp:5,  atk:[1,6,1],  res:1, escape:4, color:'#e27a5f', note:'Imóvel, alcance 2 casas.' },
    { id:'lavabound-serpent', name:'Lavabound Serpent', tier:2, img:'assets/creatures/terragorn/lavabound-serpent.webp', hp:9,  atk:[1,8,2],  res:2, escape:6, color:'#e27a5f', note:'Move em lava sem penalidade.' },
    { id:'demonic-boar',      name:'Demonic Boar',      tier:2, img:'assets/creatures/terragorn/demonic-boar.webp',      hp:11, atk:[1,8,3],  res:2, escape:6, color:'#e27a5f', note:'Investida: 3+ casas livres → +1d4.' },
    { id:'beastly-claws',     name:'Beastly Claws',     tier:3, img:'assets/creatures/terragorn/beastly-claws.webp',     hp:14, atk:[1,10,3], res:3, escape:7, color:'#e27a5f', note:'Emboscada: age primeiro no turno 1.' },
    { id:'spiked-guardian',   name:'Spiked Guardian',   tier:3, img:'assets/creatures/terragorn/spiked-guardian.webp',   hp:16, atk:[1,10,2], res:4, escape:7, color:'#e27a5f', note:'+1 RES contra ataques não-contundentes.' },
  ],
  tenebris: [
    { id:'bat-demon',       name:'Bat Demon',              tier:1, img:'assets/creatures/tenebris/bat-demon.webp',       hp:5,  atk:[1,6,2],  res:1, escape:6, color:'#9a7ed8', note:'Voador. Fuga +1 dificuldade.' },
    { id:'dark-rat',        name:'Dark Ferocious Rat',     tier:1, img:'assets/creatures/tenebris/dark-rat.webp',        hp:6,  atk:[1,6,1],  res:1, escape:5, color:'#9a7ed8', note:'Matilhas 1d4+1 em Tenebris.' },
    { id:'nightwing-fiend', name:'Nightwing Fiend',        tier:2, img:'assets/creatures/tenebris/nightwing-fiend.webp', hp:8,  atk:[1,8,2],  res:1, escape:7, color:'#9a7ed8', note:'Voador. Acerto drena 1 Sanidade.' },
    { id:'skeleton-fiend',  name:'Skeleton Fiend',         tier:2, img:'assets/creatures/tenebris/skeleton-fiend.webp',  hp:9,  atk:[1,8,2],  res:2, escape:6, color:'#9a7ed8', note:'Reanima: derrota → rola 1d10, 8+ volta ½ PV.' },
    { id:'necromancer',     name:"Necromancer's Dominion", tier:3, img:'assets/creatures/tenebris/necromancer.webp',     hp:20, atk:[1,10,3], res:3, escape:9, color:'#9a7ed8', note:'Dreno: cada acerto rouba 1 Sanidade.' },
  ],
};

const GUARDIANS = [
  { id:'viper',        name:'Viper',        territory:'venaris',  img:'assets/guardians/viper.webp',        hp:40, atk:[1,10,4], res:5, escape:10, color:'#6fb871', mechanic:'Esporos: turnos em Venaris → 4- sofre Envenenado. Frágil ao fogo: +3.' },
  { id:'ice-witch',    name:'Ice Witch',    territory:'glacis',   img:'assets/guardians/ice-witch.webp',    hp:42, atk:[1,10,4], res:5, escape:10, color:'#7ec6e8', mechanic:'Congelar tempo: rola 7+ → todos −1 ação. Imune ao gelo.' },
  { id:'hellish-titan',name:'Hellish Titan',territory:'terragorn',img:'assets/guardians/hellish-titan.webp',hp:45, atk:[1,10,4], res:6, escape:10, color:'#e27a5f', mechanic:'Erupção cada 3 turnos: 1d10+6 em ≤3 casas. Frágil ao gelo.' },
  { id:'shadow',       name:'Shadow',       territory:'tenebris', img:'assets/guardians/shadow.webp',       hp:38, atk:[1,10,5], res:5, escape:10, color:'#9a7ed8', mechanic:'Pesadelo: acerto −1 Sanidade (sem RES). Reflexo: crítico dano ao atacante.' },
];

const PASSIVE_CREATURES = [
  { id:'vaca',     name:'Vaca',     img:'assets/passives/vaca.webp',  hp:18, atk:[0,0,0], res:0, escape:3, color:'#e1e4db', note:'Não ataca.', loot:'Carne Vermelha' },
  { id:'porco',    name:'Porco',    img:'assets/passives/porco.webp', hp:14, atk:[0,0,0], res:0, escape:3, color:'#e1e4db', note:'Não ataca.', loot:'Pernil' },
  { id:'peru',     name:'Peru',     img:'assets/passives/peru.webp',  hp:10, atk:[0,0,0], res:0, escape:3, color:'#e1e4db', note:'Não ataca.', loot:'Coxa de Ave' },
  { id:'abelhas',  name:'Abelhas',  img:'assets/passives/vaca.webp',  hp:8,  atk:[1,4,0], res:0, escape:4, color:'#f5c842', note:'Enxame.',   loot:'Mel + Abelha' },
  { id:'vagalume', name:'Vagalume', img:'assets/passives/vaca.webp',  hp:6,  atk:[0,0,0], res:0, escape:2, color:'#f5f0a0', note:'Não ataca.', loot:'Vagalume (luz noturna)' },
];

// ── Hex grid positions (0-indexed, cellNum = idx+1) ──────────
// Positions as % of 100×100 map image coordinate space
const HEX_POSITIONS = [
  { cx: 17, cy: 35 },  // cell 1  (camp)
  { cx: 17, cy: 47 },  // cell 2
  { cx: 20, cy: 23 },  // cell 3  (vortex → Umbrafort)
  { cx: 22, cy: 14 },  // cell 4
  { cx: 33, cy: 20 },  // cell 5
  { cx: 22, cy: 42 },  // cell 6
  { cx: 13, cy: 56 },  // cell 7
  { cx: 28, cy: 52 },  // cell 8  (resource)
  { cx: 35, cy: 64 },  // cell 9
  { cx: 44, cy: 57 },  // cell 10
  { cx: 48, cy: 80 },  // cell 11 (vortex → Terragorn)
  { cx: 53, cy: 69 },  // cell 12
  { cx: 60, cy: 61 },  // cell 13 (resource)
  { cx: 45, cy: 44 },  // cell 14
  { cx: 32, cy: 28 },  // cell 15 (merchant)
  { cx: 55, cy: 50 },  // cell 16
  { cx: 56, cy: 35 },  // cell 17
  { cx: 64, cy: 24 },  // cell 18
  { cx: 68, cy: 46 },  // cell 19
  { cx: 87, cy: 43 },  // cell 20 (vortex → Abismo)
  { cx: 78, cy: 46 },  // cell 21 (resource)
  { cx: 57, cy: 13 },  // cell 22 (resource)
  { cx: 82, cy: 22 },  // cell 23
  { cx: 67, cy: 68 },  // cell 24
];

const HEX_RADIUS = 7.2; // in 0-100 coordinate space

// Returns SVG polygon points for a flat-top hex
function hexPoints(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return pts.join(' ');
}

// ── Map-specific cell configs (1-indexed keys) ───────────────
// type: 'normal'|'resource'|'vortex'|'camp'|'merchant'
// vortex: to=territory index (0-3), toCell=destination cell number
const MAP_CELLS = [
  { // 0: Floresta Negra (Venaris)
    1:  { type:'camp' },
    3:  { type:'vortex', to:1, toCell:1 },       // → Umbrafort
    8:  { type:'resource', res:'madeira', qty:1 },
    11: { type:'vortex', to:2, toCell:5 },        // → Terragorn
    13: { type:'resource', res:'ervas', qty:2 },
    15: { type:'merchant' },
    20: { type:'vortex', to:3, toCell:20 },       // → Abismo
    21: { type:'resource', res:'pedra', qty:1 },
    22: { type:'resource', res:'abobora', qty:1 },
  },
  { // 1: Umbrafort (Glacis)
    1:  { type:'vortex', to:0, toCell:3 },        // → Floresta
    2:  { type:'resource', res:'madeira', qty:1 },
    11: { type:'vortex', to:2, toCell:11 },       // → Terragorn
    12: { type:'resource', res:'abobora', qty:1 },
    14: { type:'merchant' },
    15: { type:'camp' },
    18: { type:'resource', res:'pedra', qty:2 },
    23: { type:'vortex', to:3, toCell:23 },       // → Abismo
  },
  { // 2: Vale Sereno (Terragorn)
    1:  { type:'vortex', to:3, toCell:1 },        // → Abismo
    3:  { type:'resource', res:'ervas', qty:1 },
    5:  { type:'vortex', to:0, toCell:11 },       // → Floresta
    11: { type:'vortex', to:1, toCell:11 },       // → Umbrafort
    14: { type:'resource', res:'abobora', qty:2 },
    15: { type:'merchant' },
    16: { type:'resource', res:'madeira', qty:1 },
    23: { type:'resource', res:'pedra', qty:1 },
    24: { type:'vortex', to:3, toCell:11 },       // → Abismo
  },
  { // 3: Abismo Crescente (Tenebris)
    1:  { type:'vortex', to:2, toCell:1 },        // → Terragorn
    2:  { type:'resource', res:'madeira', qty:1 },
    5:  { type:'vortex', to:0, toCell:20 },       // → Floresta
    11: { type:'vortex', to:2, toCell:24 },       // → Terragorn
    12: { type:'resource', res:'abobora', qty:2 },
    14: { type:'merchant' },
    20: { type:'vortex', to:0, toCell:20 },       // → Floresta (alt)
    23: { type:'vortex', to:1, toCell:23 },       // → Umbrafort
    24: { type:'resource', res:'ouro', qty:1 },
  },
];

const TERRITORY_META = [
  { id:'venaris',  name:'Floresta Negra',   color:'#6fb871', bgAlpha:'rgba(111,184,113,0.08)', img:'assets/maps/floresta-negra.webp' },
  { id:'glacis',   name:'Umbrafort',        color:'#7ec6e8', bgAlpha:'rgba(126,198,232,0.08)', img:'assets/maps/umbrafort.webp' },
  { id:'terragorn',name:'Vale Sereno',      color:'#e27a5f', bgAlpha:'rgba(226,122,95,0.08)',  img:'assets/maps/vale-sereno.webp' },
  { id:'tenebris', name:'Abismo Crescente', color:'#9a7ed8', bgAlpha:'rgba(154,126,216,0.08)', img:'assets/maps/abismo-crescente.webp' },
];

// Build cells for a territory (24 cells, 0-indexed)
function buildTerritoryCells(terrIdx) {
  const overrides = MAP_CELLS[terrIdx];
  return Array.from({ length: 24 }, (_, i) => {
    const cellNum = i + 1;
    const ov = overrides[cellNum] || {};
    return {
      id: i, cellNum,
      type: ov.type || 'normal',
      res: ov.res || null,
      qty: ov.qty || 0,
      to: ov.to ?? null,
      toCell: ov.toCell ?? null,
      creature: null,
      depleted: false,
    };
  });
}

// ── Event Cards ───────────────────────────────────────────────
const EVENT_CARDS = {
  venaris: [
    { id:'nevoa-densa',        name:'Névoa Densa',        type:'CLIMA',        img:'assets/events/venaris/nevoa-densa.webp',        color:'#6fb871', effect:'Todos os personagens têm −1 Movimento por 2 turnos.', applyFn: 'movDebuff' },
    { id:'tempestade-eletrica',name:'Tempestade Elétrica',type:'CLIMA',        img:'assets/events/venaris/tempestade-eletrica.webp',color:'#6fb871', effect:'Cada jogador rola 1d10 → em 4 ou menos perde 1 PV.', applyFn: 'lightningHit' },
    { id:'tranquilidade',      name:'Tranquilidade',      type:'FENÔMENO',     img:'assets/events/venaris/tranquilidade.webp',      color:'#6fb871', effect:'Todos os personagens recuperam 1 PV.', applyFn: 'healAll1' },
    { id:'bonanza',            name:'Bonanza',            type:'FENÔMENO',     img:'assets/events/venaris/bonanza.webp',            color:'#6fb871', effect:'Cada jogador ganha 1 recurso aleatório de Venaris.', applyFn: 'bonanza' },
    { id:'nevoa-mistica',      name:'Névoa Mística',      type:'SOBRENATURAL', img:'assets/events/venaris/nevoa-mistica.webp',      color:'#6fb871', effect:'Uma criatura aleatória em Venaris desaparece.', applyFn: 'despawnOne' },
  ],
  glacis: [
    { id:'frio-intenso',    name:'Frio Intenso',      type:'CLIMA',        img:'assets/events/glacis/frio-intenso.webp',    color:'#7ec6e8', effect:'Personagens sem Fogueira perdem 1 Sanidade.', applyFn: 'coldSanity' },
    { id:'nevasca',         name:'Nevasca',           type:'CLIMA',        img:'assets/events/glacis/nevasca.webp',         color:'#7ec6e8', effect:'Todos −1 Movimento e −1 Sanidade por 2 turnos.', applyFn: 'blizzard' },
    { id:'aurora-boreal',   name:'Aurora Boreal',     type:'FENÔMENO',     img:'assets/events/glacis/aurora-boreal.webp',   color:'#7ec6e8', effect:'Todos recuperam 1 Sanidade.', applyFn: 'sanityAll1' },
    { id:'meteoro',         name:'Meteoro',           type:'FENÔMENO',     img:'assets/events/glacis/meteoro.webp',         color:'#7ec6e8', effect:'Cai em célula aleatória: 1d6+2 dano a quem estiver lá.', applyFn: 'meteor' },
    { id:'tempestade-eter', name:'Tempestade de Éter',type:'SOBRENATURAL', img:'assets/events/glacis/tempestade-eter.webp', color:'#7ec6e8', effect:'Criaturas em Glacis movem-se 2 espaços aleatórios.', applyFn: 'etherStorm' },
  ],
  terragorn: [
    { id:'calor-intenso', name:'Calor Intenso',      type:'CLIMA',        img:'assets/events/terragorn/calor-intenso.webp', color:'#e27a5f', effect:'Todos os jogadores em Terragorn perdem 1 PV.', applyFn: 'heatDmg' },
    { id:'incendios',     name:'Incêndios',           type:'CLIMA',        img:'assets/events/terragorn/incendios.webp',     color:'#e27a5f', effect:'Uma célula de recurso aleatória em Terragorn é destruída.', applyFn: 'burnResource' },
    { id:'erupcao',       name:'Erupção Vulcânica',   type:'FENÔMENO',     img:'assets/events/terragorn/erupcao.webp',       color:'#e27a5f', effect:'1d6 dano a todos em Terragorn. Sobrevivência ≥7 reduz à metade.', applyFn: 'eruption' },
    { id:'terremoto',     name:'Terremoto',           type:'FENÔMENO',     img:'assets/events/terragorn/terremoto.webp',     color:'#e27a5f', effect:'Cada jogador em Terragorn move para célula adjacente aleatória.', applyFn: 'quake' },
    { id:'poco',          name:'Poço',                type:'SOBRENATURAL', img:'assets/events/terragorn/poco.webp',          color:'#e27a5f', effect:'Um jogador aleatório ganha 2 recursos de Terragorn.', applyFn: 'well' },
  ],
  tenebris: [
    { id:'alagamento',          name:'Alagamento',          type:'CLIMA',        img:'assets/events/tenebris/alagamento.webp',          color:'#9a7ed8', effect:'Células de recurso perdem 1 unidade.', applyFn: 'flood' },
    { id:'chuva-torrencial',    name:'Chuva Torrencial',    type:'CLIMA',        img:'assets/events/tenebris/chuva-torrencial.webp',    color:'#9a7ed8', effect:'Todos −1 Movimento por 1 turno.', applyFn: 'rain' },
    { id:'eclipse',             name:'Eclipse Solar',       type:'FENÔMENO',     img:'assets/events/tenebris/eclipse.webp',             color:'#9a7ed8', effect:'Todos perdem 1 Sanidade. Criaturas de Tenebris ganham +1 ATQ por 1 turno.', applyFn: 'eclipse' },
    { id:'lua-solar',           name:'Lua Solar',           type:'FENÔMENO',     img:'assets/events/tenebris/lua-solar.webp',           color:'#9a7ed8', effect:'Um jogador aleatório recupera 2 PV e 2 Sanidade.', applyFn: 'solarMoon' },
    { id:'tempestade-das-trevas',name:'Tempestade das Trevas',type:'SOBRENATURAL',img:'assets/events/tenebris/tempestade-trevas.webp',  color:'#9a7ed8', effect:'Todos perdem 1 Sanidade e 1 PV.', applyFn: 'darkStorm' },
  ],
};

const ERA_TERRITORY = ['venaris', 'glacis', 'terragorn', 'tenebris'];

// Build shuffled event deck for an era (1-indexed: era 1-4)
function buildEventDeck(era) {
  const eraIdx = era - 1;
  const terrId = ERA_TERRITORY[eraIdx];
  const creatures = CREATURES[terrId] || [];
  const deck = [];

  // 2× each creature card for this era
  for (const c of creatures) {
    deck.push({ type: 'creature', data: { ...c, currentHp: c.hp }, territory: eraIdx });
    deck.push({ type: 'creature', data: { ...c, currentHp: c.hp }, territory: eraIdx });
  }
  // All unique event cards for this era
  for (const ev of (EVENT_CARDS[terrId] || [])) {
    deck.push({ type: 'event', data: ev });
  }
  // 1× each passive creature per era
  for (const p of PASSIVE_CREATURES) {
    deck.push({ type: 'passive', data: { ...p, currentHp: p.hp } });
  }

  // Shuffle (Fisher-Yates)
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// ── Resources & Items ─────────────────────────────────────────
const RESOURCES_DATA = {
  madeira:   { name:'Madeira',   img:'assets/tokens/madeira.webp',   color:'#8B6914' },
  pedra:     { name:'Pedra',     img:'assets/tokens/pedra.webp',     color:'#9aa5b1' },
  minerio:   { name:'Minério',   img:'assets/tokens/minerio.webp',   color:'#c0c0c0' },
  mel:       { name:'Mel',       img:'assets/tokens/mel.webp',       color:'#f5c842' },
  cenoura:   { name:'Cenoura',   img:'assets/tokens/cenoura.webp',   color:'#f07840' },
  abobora:   { name:'Abóbora',   img:'assets/tokens/cenoura.webp',   color:'#f07840' },
  carne:     { name:'Carne',     img:'assets/tokens/carne.webp',     color:'#c94a3a' },
  ouro:      { name:'Ouro',      img:'assets/tokens/ouro.webp',      color:'#f5c842' },
  medicinal: { name:'Medicinal', img:'assets/tokens/medicinal.webp', color:'#6fb871' },
  ervas:     { name:'Ervas',     img:'assets/tokens/medicinal.webp', color:'#6fb871' },
  cristal:   { name:'Cristal',   img:'assets/tokens/pedra.webp',     color:'#7ec6e8' },
  eter:      { name:'Éter',      img:'assets/tokens/medicinal.webp', color:'#9a7ed8' },
  sombra:    { name:'Sombra',    img:'assets/tokens/pedra.webp',     color:'#5a4a7a' },
  obsidiana: { name:'Obsidiana', img:'assets/tokens/minerio.webp',   color:'#404060' },
};

const CAMP_STRUCTURES = [
  { id:'fogueira',  name:'Fogueira',       cost:{ madeira:2 },             effect:'Previne dreno de Sanidade noturno.' },
  { id:'bau-peq',   name:'Baú Pequeno',    cost:{ madeira:3 },             effect:'+3 slots de armazenamento.' },
  { id:'bau-gra',   name:'Baú Grande',     cost:{ madeira:4, minerio:1 },  effect:'+6 slots de armazenamento.' },
  { id:'geladeira', name:'Geladeira',      cost:{ minerio:3, madeira:2 },  effect:'Comida não estraga.' },
  { id:'panela',    name:'Panela de Ferro',cost:{ minerio:2 },             effect:'Permite receitas. +2 PV por refeição.' },
  { id:'canteiro',  name:'Canteiro',       cost:{ madeira:2 },             effect:'Produz 1 vegetal por turno.' },
  { id:'tenda',     name:'Tenda Grande',   cost:{ madeira:4 },             effect:'+1 PV no descanso.' },
  { id:'fonte-luz', name:'Fonte de Luz',   cost:{ cristal:2, minerio:1 },  effect:'Iluminação noturna permanente.' },
];

const ACTIONS = [
  { id:'explorar',  name:'Explorar',  icon:'🗺️', desc:'Mover para espaço adjacente.' },
  { id:'coletar',   name:'Coletar',   icon:'🌿', desc:'Recolhe 1 recurso no espaço atual.' },
  { id:'atacar',    name:'Atacar',    icon:'⚔️', desc:'Combate contra criatura adjacente.' },
  { id:'curar',     name:'Curar',     icon:'💊', desc:'Restaura PV ou Sanidade.' },
  { id:'construir', name:'Construir', icon:'🔨', desc:'Ergue estrutura no Acampamento.' },
  { id:'comprar',   name:'Comprar',   icon:'💰', desc:'Adquire item no mercado.' },
  { id:'reanimar',  name:'Reanimar',  icon:'✨', desc:'Traz aliado de volta com ½ PV e ½ San.' },
  { id:'reciclar',  name:'Reciclar',  icon:'♻️', desc:'Quebra item → ½ dos materiais.' },
];

const PLAYER_COLORS = ['#d4b77a', '#7ec6e8', '#6fb871', '#e27a5f'];

// ── Hex adjacency (by proximity) ─────────────────────────────
function getHexAdjacent(cellIdx) {
  const pos = HEX_POSITIONS[cellIdx];
  return HEX_POSITIONS
    .map((p, i) => ({ i, d: Math.sqrt((p.cx - pos.cx) ** 2 + (p.cy - pos.cy) ** 2) }))
    .filter(({ i, d }) => i !== cellIdx && d < HEX_RADIUS * 2.8)
    .sort((a, b) => a.d - b.d)
    .map(({ i }) => i);
}

function getCellsInRange(startIdx, range) {
  const visited = new Set([startIdx]);
  let frontier = [startIdx];
  for (let step = 0; step < range; step++) {
    const next = [];
    for (const cell of frontier) {
      for (const adj of getHexAdjacent(cell)) {
        if (!visited.has(adj)) { visited.add(adj); next.push(adj); }
      }
    }
    frontier = next;
  }
  visited.delete(startIdx);
  return [...visited];
}

function rollDice(count, sides, bonus) {
  let total = 0;
  const rolls = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * sides) + 1;
    rolls.push(r); total += r;
  }
  return { rolls, total: total + bonus, raw: total };
}

// Export all
Object.assign(window, {
  CHARACTERS, CREATURES, GUARDIANS, PASSIVE_CREATURES,
  TERRITORY_META, MAP_CELLS, HEX_POSITIONS, HEX_RADIUS,
  EVENT_CARDS, ERA_TERRITORY,
  RESOURCES_DATA, CAMP_STRUCTURES, ACTIONS, PLAYER_COLORS,
  hexPoints, buildTerritoryCells, buildEventDeck,
  getHexAdjacent, getCellsInRange, rollDice,
});
