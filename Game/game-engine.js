// ============================================================
// LEGACY ELEMENTAL — Game Engine v2 (Event Deck System)
// ============================================================

function createInitialState(selectedCharIds) {
  const players = selectedCharIds.map((charId, idx) => {
    const char = CHARACTERS.find(c => c.id === charId);
    return {
      id: char.id, name: char.name, role: char.role,
      portrait: char.portrait, color: PLAYER_COLORS[idx], charColor: char.color,
      maxHp: char.maxHp, hp: char.maxHp,
      maxSanity: char.maxSanity, sanity: char.maxSanity,
      movement: char.movement, survival: char.survival,
      power: char.power, resist: char.resist, ability: char.ability,
      actionsLeft: 3, movesLeft: char.movement,
      territory: 0, cell: 0,  // all start at Floresta Negra cell 1 (idx 0)
      inventory: [], resources: { madeira:0,pedra:0,minerio:0,mel:0,ervas:0,abobora:0,carne:0,ouro:0,medicinal:0,cristal:0,eter:0,sombra:0,obsidiana:0 },
      conditions: [], status: 'active', abilityUsed: false,
    };
  });

  // Build territories with hex cell data
  const territories = TERRITORY_META.map((meta, ti) => ({
    ...meta,
    idx: ti,
    cells: buildTerritoryCells(ti),
  }));

  // Build Era 1 event deck
  const eventDeck = buildEventDeck(1);

  return {
    screen: 'map',
    round: 1, era: 1,
    turnPhase: 'evento',
    activePlayerIdx: 0,
    players, territories,
    campStructures: [],
    eventDeck,
    eventDeckIdx: 0,
    currentEventCard: null,   // card being displayed this phase
    eraFirstRound: true,      // skip event on 1st round of new era
    pendingAction: null,
    selectedCell: null,
    viewTerritoryIdx: 0,
    combat: null,
    gameOver: null,
    log: ['🌿 A aventura começa na Floresta Negra. Boa sorte, sobreviventes.'],
    darknessRounds: [3,4,8,9,13,14],
  };
}

// ── Reducer ───────────────────────────────────────────────────
function gameReducer(state, action) {
  switch (action.type) {

    case 'SET_SCREEN':
      return { ...state, screen: action.screen, selectedCell: null, pendingAction: null };

    case 'SET_VIEW_TERRITORY':
      return { ...state, viewTerritoryIdx: action.idx, selectedCell: null, pendingAction: null };

    case 'DISMISS_EVENT': {
      // Apply event effect then continue
      const card = state.currentEventCard;
      let newState = { ...state, currentEventCard: null };
      if (card) newState = applyEventEffect(newState, card);
      return newState;
    }

    // ── Phase advancement ─────────────────────────────────────
    case 'ADVANCE_PHASE': {
      const { nextPhase } = action;
      let s = { ...state, turnPhase: nextPhase, pendingAction: null, selectedCell: null };

      if (nextPhase === 'evento') {
        // Draw event card (skip on first round of era)
        if (s.eraFirstRound) {
          s = addLog(s, `🌅 Primeiro turno da Era ${s.era} — sem evento.`);
          s = { ...s, eraFirstRound: false };
        } else {
          s = drawEventCard(s);
        }
      } else if (nextPhase === 'acoes') {
        s = addLog(s, `⚡ Fase de Ações — ${s.players[s.activePlayerIdx].name} age (${s.players[s.activePlayerIdx].actionsLeft} ações).`);
      } else if (nextPhase === 'criaturas') {
        s = addLog(s, `👾 Fase das Criaturas.`);
        s = moveCreatures(s);
      } else if (nextPhase === 'manutencao') {
        s = addLog(s, `🕯️ Fase de Manutenção.`);
        s = applyMaintenance(s);
      } else if (nextPhase === 'final') {
        s = tickConditions(s);
        s = addLog(s, `🌙 Fim do turno — condições decaem.`);
      }
      return s;
    }

    case 'NEXT_ROUND': {
      let s = { ...state };
      const newRound = s.round + 1;

      if (newRound > 16) {
        // New Era
        const newEra = s.era + 1;
        if (newEra > 4) return { ...s, gameOver: 'timeout' };
        const newDeck = buildEventDeck(newEra);
        s = { ...s, era: newEra, round: 1, eventDeck: newDeck, eventDeckIdx: 0, eraFirstRound: true };
        s = addLog(s, `⚡ Era ${newEra} começa! Novos inimigos surgem.`);
        s = spawnEraCreatures(s, newEra);
      } else {
        s = { ...s, round: newRound };
      }

      // Reset all players
      s = {
        ...s,
        turnPhase: 'evento',
        activePlayerIdx: 0,
        players: s.players.map(p => ({
          ...p,
          actionsLeft: 3,
          movesLeft: p.movement,
          abilityUsed: false,
        })),
      };
      s = addLog(s, `📅 Rodada ${s.round} · Era ${s.era}`);

      // Auto draw event (unless first round of era)
      if (!s.eraFirstRound) {
        s = drawEventCard(s);
      } else {
        s = { ...s, eraFirstRound: false };
      }

      return s;
    }

    case 'END_ACTIONS': {
      const nextIdx = (state.activePlayerIdx + 1) % state.players.length;
      const allActed = nextIdx === 0;
      if (allActed) {
        return { ...gameReducer(state, { type: 'ADVANCE_PHASE', nextPhase: 'criaturas' }), activePlayerIdx: 0 };
      }
      return {
        ...state,
        activePlayerIdx: nextIdx,
        players: state.players.map((p, i) =>
          i === nextIdx ? { ...p, actionsLeft: 3, movesLeft: p.movement, abilityUsed: false } : p
        ),
      };
    }

    // ── Actions ───────────────────────────────────────────────
    case 'USE_ACTION': {
      if (state.turnPhase !== 'acoes') return addLog(state, '⚠️ Não é a fase de ações!');
      const player = state.players[state.activePlayerIdx];
      if (player.actionsLeft <= 0) return addLog(state, '⚠️ Sem ações restantes!');
      if (player.status !== 'active') return addLog(state, `⚠️ ${player.name} está inconsciente!`);

      switch (action.actionId) {
        case 'explorar':  return { ...state, pendingAction: { type: 'move' }, selectedCell: null };
        case 'coletar':   return executeCollect(state, player);
        case 'atacar':    return { ...state, pendingAction: { type: 'attack' }, selectedCell: null };
        case 'curar':     return executeHeal(state, player);
        case 'construir': return { ...state, pendingAction: { type: 'build' } };
        default:          return addLog(state, `🔧 Ação "${action.actionId}" em desenvolvimento.`);
      }
    }

    case 'CANCEL_ACTION':
      return { ...state, pendingAction: null, selectedCell: null };

    case 'SELECT_CELL': {
      const { cellIdx } = action;
      const player = state.players[state.activePlayerIdx];
      if (state.pendingAction?.type === 'move') {
        const reachable = getCellsInRange(player.cell, player.movesLeft);
        if (reachable.includes(cellIdx)) return executeMove(state, player, cellIdx);
        return { ...state, selectedCell: cellIdx };
      }
      return { ...state, selectedCell: state.selectedCell === cellIdx ? null : cellIdx };
    }

    // ── Combat ────────────────────────────────────────────────
    case 'ATTACK_CREATURE': {
      const { creatureData, cellIdx } = action;
      const player = state.players[state.activePlayerIdx];
      return {
        ...state,
        combat: {
          player: { ...player },
          creature: { ...creatureData },
          cellIdx,
          territoryIdx: state.viewTerritoryIdx,
          phase: 'intro', playerRoll: null, creatureRoll: null,
          damageToCrtr: 0, damageToPlayer: 0,
          newCreatureHp: creatureData.currentHp,
          newPlayerHp: player.hp,
          isCritical: false, creatureDefeated: false, playerDowned: false,
          log: [],
        },
        pendingAction: null, selectedCell: null,
      };
    }

    case 'COMBAT_ROLL': {
      if (!state.combat) return state;
      const { combat } = state;
      const player = state.players[state.activePlayerIdx];
      const raw = rollDice(1, 10, 0).total;
      const isCrit = raw === 10;
      const attackTotal = isCrit ? raw * 2 + player.power : raw + player.power;
      const dmgToCrtr = Math.max(0, attackTotal - combat.creature.res);
      const [cd, cs, cb] = combat.creature.atk;
      const cRoll = cs > 0 ? rollDice(cd, cs, cb).total : 0;
      const dmgToPlayer = Math.max(0, cRoll - player.resist);
      const newCrHp = Math.max(0, combat.creature.currentHp - dmgToCrtr);
      const newPlHp = Math.max(0, player.hp - dmgToPlayer);
      const log = [
        isCrit ? `💥 CRÍTICO! ${raw}×2 + Poder ${player.power} = ${attackTotal}` : `🎲 Rolou ${raw} + Poder ${player.power} = ${attackTotal}`,
        `⚔️ Dano criatura: ${attackTotal} − ${combat.creature.res} RES = ${dmgToCrtr} → ${newCrHp} PV`,
        cs > 0 ? `🩸 Resposta: ${cRoll} ATQ − ${player.resist} RES = ${dmgToPlayer} → ${newPlHp} PV` : '🛡️ Criatura passiva não retalha.',
      ];
      return {
        ...state,
        combat: { ...combat, phase: 'result', playerRoll: raw, creatureRoll: cRoll, damageToCrtr: dmgToCrtr, damageToPlayer: dmgToPlayer, newCreatureHp: newCrHp, newPlayerHp: newPlHp, isCritical: isCrit, creatureDefeated: newCrHp <= 0, playerDowned: newPlHp <= 0, log },
      };
    }

    case 'COMBAT_ESCAPE': {
      if (!state.combat) return state;
      const player = state.players[state.activePlayerIdx];
      const roll = rollDice(1, 10, 0).total;
      const ok = roll >= state.combat.creature.escape;
      let s = state;
      if (ok) {
        const adj = getHexAdjacent(player.cell);
        const dest = adj.find(a => !s.territories[player.territory].cells[a].creature) ?? adj[0] ?? player.cell;
        s = { ...s, players: s.players.map((p,i) => i === s.activePlayerIdx ? { ...p, cell: dest, actionsLeft: Math.max(0, p.actionsLeft-1) } : p), combat: null, pendingAction: null };
        s = addLog(s, `🏃 ${player.name} escapou! (${roll} ≥ ${state.combat.creature.escape})`);
      } else {
        const [cd, cs, cb] = state.combat.creature.atk;
        const dmg = cs > 0 ? Math.max(0, rollDice(cd, cs, cb).total - player.resist) : 0;
        const newHp = Math.max(0, player.hp - dmg);
        s = { ...s, combat: { ...state.combat, phase: 'result', playerRoll: roll, creatureDefeated: false, playerDowned: newHp <= 0, damageToPlayer: dmg, newCreatureHp: state.combat.creature.currentHp, newPlayerHp: newHp, log: [`❌ Fuga falhou! (${roll} < ${state.combat.creature.escape})`, dmg > 0 ? `Criatura atacou: ${dmg} dano.` : 'Sem dano.'] } };
        s = updatePlayerHp(s, s.activePlayerIdx, newHp);
      }
      return s;
    }

    case 'COMBAT_RESOLVE': {
      if (!state.combat) return state;
      const { combat } = state;
      let s = { ...state, combat: null, pendingAction: null };
      s = updatePlayerHp(s, s.activePlayerIdx, combat.newPlayerHp);
      // Sanity drain from special creatures
      if (['nightwing-fiend','frostbite-serpent','necromancer'].includes(combat.creature.id) && combat.damageToPlayer > 0)
        s = updatePlayerSanity(s, s.activePlayerIdx, -1);
      if (combat.creatureDefeated) {
        s = removeCreature(s, combat.territoryIdx, combat.cellIdx);
        const loot = ['madeira','pedra','mel','carne','ouro'][Math.floor(Math.random() * 5)];
        s = addPlayerResource(s, s.activePlayerIdx, loot, 1);
        s = addLog(s, `🏆 ${combat.creature.name} derrotado! +1 ${RESOURCES_DATA[loot]?.name || loot}`);
      }
      s = consumeAction(s, s.activePlayerIdx, 1);
      if (combat.playerDowned) {
        s = addLog(s, `💀 ${state.players[state.activePlayerIdx].name} desmaiou!`);
        s = checkGameOver(s);
      }
      return s;
    }

    case 'BUILD_STRUCTURE': {
      const struct = CAMP_STRUCTURES.find(x => x.id === action.structureId);
      if (!struct) return state;
      if (state.campStructures.includes(action.structureId)) return addLog(state, `⚠️ ${struct.name} já construída!`);
      const player = state.players[state.activePlayerIdx];
      const discount = player.id === 'helena' ? 1 : 0;
      for (const [res, amt] of Object.entries(struct.cost)) {
        if ((player.resources[res] || 0) < Math.max(1, amt - discount))
          return addLog(state, `❌ Recursos insuficientes para ${struct.name}.`);
      }
      let s = state;
      for (const [res, amt] of Object.entries(struct.cost))
        s = addPlayerResource(s, s.activePlayerIdx, res, -Math.max(1, amt - discount));
      s = consumeAction(s, s.activePlayerIdx, 1);
      return addLog({ ...s, campStructures: [...s.campStructures, action.structureId], pendingAction: null }, `🔨 ${struct.name} construída!`);
    }

    default: return state;
  }
}

// ── Event Deck ────────────────────────────────────────────────
function drawEventCard(state) {
  const { eventDeck, eventDeckIdx } = state;
  if (!eventDeck.length || eventDeckIdx >= eventDeck.length) {
    return addLog({ ...state, currentEventCard: null }, '📭 Deck de eventos esgotado.');
  }
  const card = eventDeck[eventDeckIdx];
  let s = { ...state, eventDeckIdx: eventDeckIdx + 1, currentEventCard: card };

  if (card.type === 'creature' || card.type === 'passive') {
    // Spawn creature on random empty cell in random territory
    s = spawnCreatureFromDeck(s, card.data);
    const where = TERRITORY_META[card.spawnedTerritory ?? 0]?.name || '?';
    s = addLog(s, `🃏 EVENTO: ${card.data.name} surgiu em ${where}!`);
  } else if (card.type === 'event') {
    s = addLog(s, `🃏 EVENTO: ${card.data.name} — ${card.data.effect}`);
  }
  return s;
}

function spawnCreatureFromDeck(state, creatureData) {
  // Pick a random territory, find an empty non-special cell
  const terrIdxList = [0, 1, 2, 3];
  // Shuffle territory order
  for (let i = 3; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [terrIdxList[i], terrIdxList[j]] = [terrIdxList[j], terrIdxList[i]];
  }

  for (const ti of terrIdxList) {
    const terr = state.territories[ti];
    const emptyCells = terr.cells.filter(c => !c.creature && c.type === 'normal' && !c.depleted);
    if (emptyCells.length > 0) {
      const target = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newState = updateCell(state, ti, target.id, { ...target, creature: { ...creatureData, currentHp: creatureData.hp } });
      // Tag where it spawned
      if (newState.currentEventCard) {
        newState.currentEventCard = { ...newState.currentEventCard, spawnedTerritory: ti, spawnedCell: target.cellNum };
      }
      return newState;
    }
  }
  return state; // no empty cell found
}

function spawnEraCreatures(state, era) {
  const maxTier = Math.min(era, 3);
  const terrId = ERA_TERRITORY[era - 1] || 'venaris';
  const pool = (CREATURES[terrId] || []).filter(c => c.tier <= maxTier);
  let s = state;
  // Spawn 2 creatures at era start
  for (let n = 0; n < 2; n++) {
    if (!pool.length) continue;
    const c = pool[Math.floor(Math.random() * pool.length)];
    s = spawnCreatureFromDeck(s, c);
  }
  return s;
}

function applyEventEffect(state, card) {
  if (!card || card.type !== 'event') return state;
  const fn = card.data?.applyFn;
  let s = state;
  switch (fn) {
    case 'healAll1':    s = s.players.reduce((acc, _, i) => updatePlayerHp(acc, i, Math.min(acc.players[i].maxHp, acc.players[i].hp + 1)), s); break;
    case 'sanityAll1':  s = s.players.reduce((acc, _, i) => updatePlayerSanity(acc, i, 1), s); break;
    case 'movDebuff':   s = addConditionAll(s, { name: 'Lentidão', turns: 2, movMod: -1 }); break;
    case 'coldSanity':
      if (!s.campStructures.includes('fogueira'))
        s = s.players.reduce((acc, _, i) => updatePlayerSanity(acc, i, -1), s);
      break;
    case 'blizzard':
      s = addConditionAll(s, { name: 'Nevasca', turns: 2, movMod: -1 });
      s = s.players.reduce((acc, _, i) => updatePlayerSanity(acc, i, -1), s);
      break;
    case 'lightningHit':
      s.players.forEach((p, i) => { if (rollDice(1,10,0).total <= 4) s = updatePlayerHp(s, i, Math.max(0, p.hp - 1)); });
      break;
    case 'heatDmg':
      s.players.filter(p => p.territory === 2).forEach((p) => { s = updatePlayerHp(s, s.players.indexOf(p), Math.max(0, p.hp - 1)); });
      break;
    case 'eclipse':
      s = s.players.reduce((acc, _, i) => updatePlayerSanity(acc, i, -1), s);
      break;
    case 'darkStorm':
      s = s.players.reduce((acc, _, i) => { let x = updatePlayerSanity(acc, i, -1); return updatePlayerHp(x, i, Math.max(0, x.players[i].hp - 1)); }, s);
      break;
    case 'bonanza': {
      const options = ['madeira','pedra','ervas','mel','carne'];
      s = s.players.reduce((acc, _, i) => addPlayerResource(acc, i, options[Math.floor(Math.random()*options.length)], 1), s);
      break;
    }
    case 'rain': s = addConditionAll(s, { name: 'Chuva', turns: 1, movMod: -1 }); break;
    default: break; // no mechanical effect or complex effects handled elsewhere
  }
  return s;
}

// ── Helpers ───────────────────────────────────────────────────
function addLog(state, msg) {
  return { ...state, log: [msg, ...state.log].slice(0, 60) };
}

function updateCell(state, terrIdx, cellIdx, newCell) {
  return {
    ...state,
    territories: state.territories.map((t, ti) =>
      ti !== terrIdx ? t : { ...t, cells: t.cells.map((c, ci) => ci === cellIdx ? { ...c, ...newCell } : c) }
    )
  };
}

function removeCreature(state, terrIdx, cellIdx) {
  return updateCell(state, terrIdx, cellIdx, { creature: null });
}

function updatePlayerHp(state, idx, newHp) {
  const hp = Math.max(0, Math.min(state.players[idx].maxHp, newHp));
  return { ...state, players: state.players.map((p, i) => i === idx ? { ...p, hp, status: hp <= 0 ? 'unconscious' : 'active' } : p) };
}

function updatePlayerSanity(state, idx, delta) {
  const p = state.players[idx];
  const sanity = Math.max(0, Math.min(p.maxSanity, p.sanity + delta));
  return { ...state, players: state.players.map((pl, i) => i === idx ? { ...pl, sanity } : pl) };
}

function addPlayerResource(state, idx, key, amt) {
  return { ...state, players: state.players.map((p, i) => i === idx ? { ...p, resources: { ...p.resources, [key]: Math.max(0, (p.resources[key] || 0) + amt) } } : p) };
}

function consumeAction(state, idx, n = 1) {
  return { ...state, players: state.players.map((p, i) => i === idx ? { ...p, actionsLeft: Math.max(0, p.actionsLeft - n) } : p) };
}

function addConditionAll(state, cond) {
  return { ...state, players: state.players.map(p => ({ ...p, conditions: [...p.conditions, { ...cond }] })) };
}

function tickConditions(state) {
  return { ...state, players: state.players.map(p => ({ ...p, conditions: p.conditions.map(c => ({ ...c, turns: c.turns - 1 })).filter(c => c.turns > 0) })) };
}

function checkGameOver(state) {
  const allDown = state.players.every(p => p.status !== 'active');
  return allDown ? { ...state, gameOver: 'lose' } : state;
}

function executeMove(state, player, cellIdx) {
  const terr = state.territories[state.viewTerritoryIdx];
  const targetCell = terr.cells[cellIdx];

  if (targetCell.type === 'vortex' && targetCell.to !== null) {
    const destTerrIdx = targetCell.to;
    const destCellNum = targetCell.toCell ?? 1;
    const destCellIdx = destCellNum - 1;
    const s = { ...state, players: state.players.map((p, i) => i === state.activePlayerIdx ? { ...p, territory: destTerrIdx, cell: destCellIdx, movesLeft: 0, actionsLeft: Math.max(0, p.actionsLeft - 1) } : p), viewTerritoryIdx: destTerrIdx, pendingAction: null, selectedCell: null };
    return addLog(s, `🌀 ${player.name} usou Vórtex → ${TERRITORY_META[destTerrIdx].name}!`);
  }

  let s = { ...state, players: state.players.map((p, i) => i === state.activePlayerIdx ? { ...p, cell: cellIdx, movesLeft: Math.max(0, p.movesLeft - 1), actionsLeft: Math.max(0, p.actionsLeft - 1), territory: state.viewTerritoryIdx } : p), pendingAction: null, selectedCell: null };

  if (targetCell.creature) s = addLog(s, `⚠️ ${player.name} chegou onde está ${targetCell.creature.name}!`);
  else if (targetCell.type === 'resource' && !targetCell.depleted) s = addLog(s, `🌿 Recurso disponível: ${RESOURCES_DATA[targetCell.res]?.name}. Use Coletar.`);
  else if (targetCell.type === 'merchant') s = addLog(s, `💰 ${player.name} chegou ao Posto de Comércio.`);
  else s = addLog(s, `👣 ${player.name} → célula ${targetCell.cellNum}.`);

  return s;
}

function executeCollect(state, player) {
  const terr = state.territories[player.territory];
  const cell = terr.cells[player.cell];
  if (cell.type !== 'resource' || !cell.res || cell.depleted) return addLog(state, `⚠️ Nenhum recurso aqui.`);
  let qty = cell.qty;
  if (player.id === 'ivy' && ['cenoura','abobora','morango','ervas'].includes(cell.res)) qty *= 2;
  let s = addPlayerResource(state, state.activePlayerIdx, cell.res, qty);
  s = consumeAction(s, state.activePlayerIdx, 1);
  s = updateCell(s, player.territory, player.cell, { ...cell, depleted: true, qty: 0 });
  return addLog(s, `🌿 ${player.name} coletou ${qty}× ${RESOURCES_DATA[cell.res]?.name || cell.res}.`);
}

function executeHeal(state, player) {
  if (player.id === 'elizabeth') {
    let s = updatePlayerHp(state, state.activePlayerIdx, Math.min(player.maxHp, player.hp + 3));
    s = consumeAction(s, state.activePlayerIdx, 1);
    return addLog(s, `💊 ${player.name} usou Cura Rápida → +3 PV.`);
  }
  if ((player.resources.medicinal || 0) > 0) {
    let s = addPlayerResource(state, state.activePlayerIdx, 'medicinal', -1);
    s = updatePlayerHp(s, state.activePlayerIdx, Math.min(player.maxHp, player.hp + 2));
    s = consumeAction(s, state.activePlayerIdx, 1);
    return addLog(s, `💊 ${player.name} usou medicinal → +2 PV.`);
  }
  return addLog(state, `⚠️ Sem itens de cura.`);
}

function applyMaintenance(state) {
  let s = state;
  const hasFogueira = s.campStructures.includes('fogueira');
  const isDark = [3,4,8,9,13,14].includes(s.round);
  s.players.forEach((p, i) => {
    if (p.status !== 'active') return;
    const hasFood = Object.entries(p.resources).filter(([k]) => ['carne','mel','cenoura','abobora'].includes(k)).some(([,v]) => v > 0);
    if (!hasFood) { s = updatePlayerHp(s, i, Math.max(0, p.hp - 1)); s = addLog(s, `🍖 ${p.name} passou fome → −1 PV.`); }
    if (isDark && !hasFogueira) { s = updatePlayerSanity(s, i, -1); s = addLog(s, `🌑 ${p.name} perdeu 1 San na escuridão.`); }
  });
  return s;
}

function moveCreatures(state) {
  let s = state;
  state.territories.forEach((terr, ti) => {
    terr.cells.forEach((cell, ci) => {
      if (!cell.creature) return;
      const playersHere = state.players.filter(p => p.territory === ti);
      if (!playersHere.length) return;
      const target = playersHere[0];
      const adj = getHexAdjacent(ci);
      const closer = adj.find(a => {
        const d1 = Math.hypot(HEX_POSITIONS[a].cx - HEX_POSITIONS[target.cell].cx, HEX_POSITIONS[a].cy - HEX_POSITIONS[target.cell].cy);
        const d0 = Math.hypot(HEX_POSITIONS[ci].cx - HEX_POSITIONS[target.cell].cx, HEX_POSITIONS[ci].cy - HEX_POSITIONS[target.cell].cy);
        return d1 < d0 && !s.territories[ti].cells[a].creature;
      });
      if (closer !== undefined) {
        const creature = cell.creature;
        s = updateCell(s, ti, ci, { ...s.territories[ti].cells[ci], creature: null });
        s = updateCell(s, ti, closer, { ...s.territories[ti].cells[closer], creature });
        if (adj.includes(target.cell)) {
          const [d, c, b] = creature.atk;
          const dmg = c > 0 ? Math.max(0, rollDice(d,c,b).total - target.resist) : 0;
          if (dmg > 0) {
            s = updatePlayerHp(s, s.players.indexOf(target), Math.max(0, target.hp - dmg));
            s = addLog(s, `👾 ${creature.name} atacou ${target.name}: ${dmg} dano.`);
          }
        }
      }
    });
  });
  return s;
}

Object.assign(window, { createInitialState, gameReducer });
