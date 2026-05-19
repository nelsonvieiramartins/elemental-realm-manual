// ============================================================
// LEGACY ELEMENTAL — Combat Modal
// ============================================================

const { useState: useCombatState, useEffect: useCombatEffect, useRef: useCombatRef } = React;

function CombatModal({ combat, player, onRoll, onEscape, onResolve }) {
  const [rolling, setRolling] = useCombatState(false);
  const [rollAnim, setRollAnim] = useCombatState(null);
  const rollIntervalRef = useCombatRef(null);

  useCombatEffect(() => () => clearInterval(rollIntervalRef.current), []);

  const handleRoll = () => {
    setRolling(true);
    let count = 0;
    rollIntervalRef.current = setInterval(() => {
      setRollAnim(Math.floor(Math.random() * 10) + 1);
      count++;
      if (count > 14) {
        clearInterval(rollIntervalRef.current);
        setRolling(false);
        setRollAnim(null);
        onRoll();
      }
    }, 80);
  };

  const handleEscape = () => {
    setRolling(true);
    let count = 0;
    rollIntervalRef.current = setInterval(() => {
      setRollAnim(Math.floor(Math.random() * 10) + 1);
      count++;
      if (count > 12) {
        clearInterval(rollIntervalRef.current);
        setRolling(false);
        setRollAnim(null);
        onEscape();
      }
    }, 90);
  };

  if (!combat) return null;
  const { creature, phase, playerRoll, creatureRoll, damageToCrtr, damageToPlayer,
    newCreatureHp, newPlayerHp, isCritical, creatureDefeated, playerDowned, log: combatLog } = combat;
  const [d, s, b] = creature.atk;

  const hpPct = Math.max(0, (creature.currentHp / creature.hp) * 100);
  const newHpPct = phase === 'result' ? Math.max(0, (newCreatureHp / creature.hp) * 100) : hpPct;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(9,12,16,0.92)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: 'min(640px, 96vw)', background: 'rgba(14,20,28,0.98)',
        border: `1px solid ${creature.color}`,
        borderRadius: 14, overflow: 'hidden',
        boxShadow: `0 0 60px ${creature.color}33, 0 0 120px rgba(0,0,0,0.8)`,
      }}>
        {/* Header */}
        <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
          <img src={creature.img} alt={creature.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 30%, rgba(14,20,28,0.98) 100%)` }} />
          <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
            <div style={{ fontFamily: 'Oswald,sans-serif', fontSize: 26, color: '#e1e4db', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{creature.name}</div>
            <div style={{ fontSize: 11, color: creature.color, fontFamily: 'Inter,sans-serif' }}>Nível {creature.tier} · ATQ {d}d{s}+{b} · RES {creature.res} · Fuga ≥{creature.escape}</div>
          </div>
        </div>

        {/* Creature HP bar */}
        <div style={{ padding: '10px 16px 4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9aa5b1', fontFamily: 'Inter,sans-serif', marginBottom: 4 }}>
            <span>PV da Criatura</span>
            <span>{phase === 'result' ? newCreatureHp : creature.currentHp}/{creature.hp}</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${hpPct}%`, background: '#e27a5f', borderRadius: 4, transition: 'width 0.6s ease' }} />
            {phase === 'result' && damageToCrtr > 0 && (
              <div style={{ height: '100%', width: `${hpPct - newHpPct}%`, marginLeft: `${newHpPct}%`, background: 'rgba(255,255,255,0.3)', position: 'absolute' }} />
            )}
          </div>
        </div>

        {/* Combat arena */}
        <div style={{ padding: '16px', display: 'flex', gap: 16, alignItems: 'center' }}>
          {/* Player side */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <img src={player.portrait} alt={player.name} style={{
              width: 72, height: 72, borderRadius: '50%', objectFit: 'cover',
              border: `3px solid ${player.color}`, boxShadow: `0 0 20px ${player.color}44`,
              marginBottom: 6,
            }} />
            <div style={{ fontFamily: 'Oswald,sans-serif', fontSize: 14, color: '#e1e4db' }}>{player.name.split(' ')[0]}</div>
            <div style={{ fontSize: 11, color: '#9aa5b1', fontFamily: 'Inter,sans-serif', marginTop: 2 }}>
              POD {player.power} · RES {player.resist}
            </div>
            <div style={{ marginTop: 6 }}>
              <StatBar label="PV" value={phase === 'result' ? newPlayerHp : player.hp} max={player.maxHp} color="#e27a5f" />
            </div>
          </div>

          {/* VS / Dice area */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 120 }}>
            {phase === 'intro' && (
              <>
                <div style={{ fontSize: 24, color: '#d4b77a', fontFamily: 'Oswald,sans-serif', letterSpacing: '0.2em' }}>VS</div>
                <div style={{ fontSize: 10, color: '#627d98', fontFamily: 'Inter,sans-serif', textAlign: 'center', lineHeight: 1.5 }}>
                  {creature.note}
                </div>
              </>
            )}

            {(phase === 'intro' || rolling) && (
              <DiceDisplay value={rollAnim} rolling={rolling} size={64} />
            )}

            {phase === 'result' && !rolling && (
              <div style={{ textAlign: 'center' }}>
                {isCritical && (
                  <div style={{ fontSize: 18, color: '#d4b77a', fontFamily: 'Oswald,sans-serif', letterSpacing: '0.1em', marginBottom: 6, animation: 'pulse 0.5s 3' }}>
                    💥 CRÍTICO!
                  </div>
                )}
                <div style={{ fontSize: 28, color: '#d4b77a', fontFamily: 'Oswald,sans-serif' }}>{playerRoll}</div>
                <div style={{ fontSize: 10, color: '#627d98', fontFamily: 'Inter,sans-serif' }}>seu dado (1d10)</div>
                <div style={{ margin: '8px 0', width: 1, height: 20, background: 'rgba(255,255,255,0.15)', marginLeft: 'auto', marginRight: 'auto' }} />
                {creatureDefeated ? (
                  <div style={{ fontSize: 16, color: '#6fb871', fontFamily: 'Oswald,sans-serif' }}>🏆 DERROTADO!</div>
                ) : playerDowned ? (
                  <div style={{ fontSize: 16, color: '#c94a3a', fontFamily: 'Oswald,sans-serif' }}>💀 DESMAIOU!</div>
                ) : (
                  <div style={{ fontSize: 12, color: '#e27a5f', fontFamily: 'Inter,sans-serif' }}>
                    −{damageToCrtr} PV criatura<br />−{damageToPlayer} PV você
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Creature side */}
          <div style={{ flex: 1, textAlign: 'center' }}>
            <img src={creature.img} alt={creature.name} style={{
              width: 72, height: 72, borderRadius: '50%', objectFit: 'cover',
              border: `3px solid ${creature.color}`, boxShadow: `0 0 20px ${creature.color}44`,
              marginBottom: 6,
            }} />
            <div style={{ fontFamily: 'Oswald,sans-serif', fontSize: 14, color: '#e1e4db' }}>{creature.name.split(' ')[0]}</div>
            <div style={{ fontSize: 11, color: '#9aa5b1', fontFamily: 'Inter,sans-serif', marginTop: 2 }}>
              ATQ {d}d{s}+{b} · RES {creature.res}
            </div>
          </div>
        </div>

        {/* Combat log */}
        {combatLog?.length > 0 && (
          <div style={{ margin: '0 16px', background: 'rgba(0,0,0,0.4)', borderRadius: 6, padding: '8px 10px', maxHeight: 100, overflowY: 'auto' }}>
            {combatLog.map((l, i) => (
              <div key={i} style={{ fontSize: 11, color: i === 0 ? '#e1e4db' : '#627d98', fontFamily: 'Inter,sans-serif', padding: '1px 0', lineHeight: 1.5 }}>{l}</div>
            ))}
          </div>
        )}

        {/* Buttons */}
        <div style={{ padding: '14px 16px 16px', display: 'flex', gap: 8 }}>
          {phase === 'intro' && (
            <>
              <button onClick={handleRoll} disabled={rolling} style={{
                flex: 2, padding: '11px', background: 'rgba(212,183,122,0.15)',
                border: '1px solid #d4b77a', color: '#d4b77a', borderRadius: 7,
                fontFamily: 'Oswald,sans-serif', fontSize: 14, letterSpacing: '0.1em',
                textTransform: 'uppercase', cursor: rolling ? 'wait' : 'pointer',
                opacity: rolling ? 0.7 : 1,
              }}>
                {rolling ? '🎲 Rolando...' : '⚔️ Atacar! (1d10 + Poder)'}
              </button>
              <button onClick={handleEscape} disabled={rolling} style={{
                flex: 1, padding: '11px', background: 'rgba(154,126,216,0.12)',
                border: '1px solid #9a7ed8', color: '#9a7ed8', borderRadius: 7,
                fontFamily: 'Oswald,sans-serif', fontSize: 14, letterSpacing: '0.1em',
                textTransform: 'uppercase', cursor: rolling ? 'wait' : 'pointer',
                opacity: rolling ? 0.7 : 1,
              }}>
                🏃 Fugir
              </button>
            </>
          )}
          {phase === 'result' && (
            <button onClick={onResolve} style={{
              flex: 1, padding: '11px', background: creatureDefeated ? 'rgba(111,184,113,0.2)' : 'rgba(212,183,122,0.15)',
              border: `1px solid ${creatureDefeated ? '#6fb871' : '#d4b77a'}`,
              color: creatureDefeated ? '#6fb871' : '#d4b77a', borderRadius: 7,
              fontFamily: 'Oswald,sans-serif', fontSize: 14, letterSpacing: '0.1em',
              textTransform: 'uppercase', cursor: 'pointer',
            }}>
              {creatureDefeated ? '🏆 Continuar' : playerDowned ? '💀 Continuar' : '⚔️ Continuar Combate'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Game Over Screen ──────────────────────────────────────────
function GameOverScreen({ result, players, round, era, onRestart }) {
  const won = result === 'win';
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(9,12,16,0.97)', backdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 500 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>{won ? '🏆' : '💀'}</div>
        <h1 style={{ fontFamily: 'Oswald,sans-serif', fontSize: 52, color: won ? '#d4b77a' : '#c94a3a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          {won ? 'Vitória!' : 'Derrota'}
        </h1>
        <p style={{ fontFamily: 'Lora,serif', color: '#9aa5b1', fontSize: 16, marginBottom: 8, lineHeight: 1.6 }}>
          {won
            ? 'O grupo restaurou o Elemental Realm e derrotou as quatro Guardiãs!'
            : result === 'timeout'
              ? `As 4 Eras passaram sem que o grupo conseguisse restaurar o Realm.`
              : 'Todos os heróis caíram em batalha. O Elemental Realm permanece corrompido.'}
        </p>
        <div style={{ fontSize: 13, color: '#627d98', fontFamily: 'Inter,sans-serif', marginBottom: 32 }}>
          Era {era} · Rodada {round}
        </div>
        <button onClick={onRestart} style={{
          padding: '14px 40px', background: 'rgba(212,183,122,0.15)',
          border: '1px solid #d4b77a', color: '#d4b77a',
          borderRadius: 6, fontFamily: 'Oswald,sans-serif', fontSize: 16,
          letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
        }}>
          Jogar Novamente
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { CombatModal, GameOverScreen });
