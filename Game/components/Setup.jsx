// ============================================================
// LEGACY ELEMENTAL — Setup Screen & Shared UI Components
// ============================================================

const { useState, useEffect, useRef } = React;

// ── StatBar ─────────────────────────────────────────────────
function StatBar({ label, value, max, color }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9aa5b1', marginBottom: 2, fontFamily: 'Inter,sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        <span>{label}</span><span style={{ color: '#e1e4db' }}>{value}/{max}</span>
      </div>
      <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

// ── DiceDisplay ─────────────────────────────────────────────
function DiceDisplay({ value, rolling, size = 56 }) {
  const faces = ['⚀','⚁','⚂','⚃','⚄','⚅'];
  const displayValue = value ? (value <= 6 ? faces[value - 1] : value) : '?';
  return (
    <div style={{
      width: size, height: size, borderRadius: 10,
      background: rolling ? 'linear-gradient(135deg,#2a1a0e,#1a0a0e)' : 'linear-gradient(135deg,#1a0e04,#0e0a04)',
      border: `2px solid ${rolling ? '#e27a5f' : '#d4b77a'}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.6, color: rolling ? '#e27a5f' : '#d4b77a',
      fontFamily: 'Oswald,sans-serif',
      boxShadow: rolling ? '0 0 20px rgba(226,122,95,0.5)' : '0 0 10px rgba(212,183,122,0.2)',
      transition: 'all 0.2s',
      animation: rolling ? 'diceSpin 0.15s infinite' : 'none',
    }}>
      {rolling ? faces[Math.floor(Math.random() * 6)] : (value || '?')}
    </div>
  );
}

// ── PhaseBar ─────────────────────────────────────────────────
function PhaseBar({ phase, round, era, players, activePlayerIdx, onAdvance, onNextRound }) {
  const phases = [
    { id: 'evento',      label: 'Evento',      icon: '🃏' },
    { id: 'acoes',       label: 'Ações',        icon: '⚡' },
    { id: 'criaturas',   label: 'Criaturas',    icon: '👾' },
    { id: 'manutencao',  label: 'Manutenção',   icon: '🕯️' },
    { id: 'final',       label: 'Final',        icon: '🌙' },
  ];
  const phaseIdx = phases.findIndex(p => p.id === phase);
  const nextPhase = phases[phaseIdx + 1];
  const activePlayer = players[activePlayerIdx];

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 0,
      background: 'rgba(9,12,16,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '6px 16px', flexShrink: 0,
    }}>
      {/* Era/Round */}
      <div style={{ marginRight: 20, minWidth: 90 }}>
        <div style={{ fontSize: 9, color: '#627d98', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'Inter,sans-serif' }}>Era {era} · Rodada</div>
        <div style={{ fontSize: 18, fontFamily: 'Oswald,sans-serif', color: '#d4b77a', lineHeight: 1.1 }}>{round}<span style={{ fontSize: 11, color: '#627d98' }}>/16</span></div>
      </div>
      {/* Phases */}
      <div style={{ display: 'flex', gap: 2, flex: 1 }}>
        {phases.map((p, i) => {
          const isActive = p.id === phase;
          const isPast = i < phaseIdx;
          return (
            <div key={p.id} style={{
              flex: 1, padding: '4px 6px', borderRadius: 6, textAlign: 'center',
              background: isActive ? 'rgba(212,183,122,0.18)' : 'transparent',
              border: `1px solid ${isActive ? '#d4b77a' : isPast ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)'}`,
              opacity: isPast ? 0.35 : 1,
              transition: 'all 0.3s',
            }}>
              <div style={{ fontSize: 14 }}>{p.icon}</div>
              <div style={{ fontSize: 9, color: isActive ? '#d4b77a' : '#627d98', fontFamily: 'Inter,sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.label}</div>
            </div>
          );
        })}
      </div>
      {/* Active player */}
      {phase === 'acoes' && activePlayer && (
        <div style={{ marginLeft: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={activePlayer.portrait} alt={activePlayer.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${activePlayer.color}` }} />
          <div>
            <div style={{ fontSize: 10, color: '#9aa5b1', fontFamily: 'Inter,sans-serif' }}>Jogador ativo</div>
            <div style={{ fontSize: 12, color: '#e1e4db', fontFamily: 'Oswald,sans-serif' }}>{activePlayer.name.split(' ')[0]}</div>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {Array(3).fill(0).map((_, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i < activePlayer.actionsLeft ? activePlayer.color : 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }} />
            ))}
          </div>
        </div>
      )}
      {/* Advance button */}
      <button
        onClick={phase === 'final' ? onNextRound : () => onAdvance(nextPhase?.id)}
        style={{
          marginLeft: 12, padding: '5px 14px', borderRadius: 6,
          background: 'rgba(212,183,122,0.15)', border: '1px solid #d4b77a',
          color: '#d4b77a', fontSize: 11, fontFamily: 'Oswald,sans-serif',
          letterSpacing: '0.05em', cursor: 'pointer', whiteSpace: 'nowrap',
          textTransform: 'uppercase',
        }}
      >
        {phase === 'final' ? 'Nova Rodada →' : `Avançar →`}
      </button>
    </div>
  );
}

// ── RoundTracker ─────────────────────────────────────────────
function RoundTracker({ round, darknessRounds }) {
  return (
    <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ fontSize: 9, color: '#627d98', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'Inter,sans-serif', marginBottom: 5 }}>Marcador de Estações</div>
      <div style={{ display: 'flex', gap: 2 }}>
        {Array(16).fill(0).map((_, i) => {
          const rnd = i + 1;
          const isDark = darknessRounds.includes(rnd);
          const isPast = rnd < round;
          const isCurrent = rnd === round;
          return (
            <div key={i} style={{
              flex: 1, height: 20, borderRadius: 3,
              background: isCurrent ? '#d4b77a' : isPast ? 'rgba(212,183,122,0.2)' : isDark ? 'rgba(126,198,232,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isCurrent ? '#d4b77a' : isDark ? 'rgba(126,198,232,0.4)' : 'rgba(255,255,255,0.08)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8, color: isCurrent ? '#090c10' : isDark ? '#7ec6e8' : '#627d98',
              fontFamily: 'Inter,sans-serif', fontWeight: 700,
              transition: 'all 0.3s',
            }}>{rnd}</div>
          );
        })}
      </div>
    </div>
  );
}

// ── GameLog ──────────────────────────────────────────────────
function GameLog({ log }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = 0; }, [log]);
  return (
    <div style={{ padding: '8px 10px', background: 'rgba(0,0,0,0.6)', borderTop: '1px solid rgba(255,255,255,0.06)', height: 110, overflowY: 'auto', flexShrink: 0 }} ref={ref}>
      <div style={{ fontSize: 9, color: '#627d98', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'Inter,sans-serif', marginBottom: 5 }}>Log do Jogo</div>
      {log.map((entry, i) => (
        <div key={i} style={{ fontSize: 11, color: i === 0 ? '#e1e4db' : '#627d98', fontFamily: 'Inter,sans-serif', padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', lineHeight: 1.4 }}>
          {entry}
        </div>
      ))}
    </div>
  );
}

// ── Setup Screen ─────────────────────────────────────────────
function SetupScreen({ onStart }) {
  const [selected, setSelected] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [phase, setPhase] = useState('title'); // title | select

  const toggle = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(s => s !== id));
    } else if (selected.length < 4) {
      setSelected([...selected, id]);
    }
  };

  if (phase === 'title') {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 60%, rgba(30,15,5,1) 0%, #090c10 70%)',
        overflow: 'hidden',
      }}>
        {/* Background map mosaic */}
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', opacity: 0.08 }}>
          {['assets/maps/floresta-negra.webp','assets/maps/umbrafort.webp','assets/maps/vale-sereno.webp','assets/maps/abismo-crescente.webp'].map((m,i) => (
            <div key={i} style={{ backgroundImage: `url(${m})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          ))}
        </div>
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 600 }}>
          <div style={{ fontSize: 11, color: '#627d98', letterSpacing: '0.5em', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif', marginBottom: 12 }}>
            ◆ Um jogo de sobrevivência e exploração ◆
          </div>
          <h1 style={{ fontFamily: 'Oswald,sans-serif', fontSize: 'clamp(52px,8vw,96px)', color: '#d4b77a', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 0.9, marginBottom: 8, textShadow: '0 0 40px rgba(212,183,122,0.3)' }}>
            Legacy
          </h1>
          <h1 style={{ fontFamily: 'Oswald,sans-serif', fontSize: 'clamp(52px,8vw,96px)', color: '#e1e4db', letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 0.9, marginBottom: 32, textShadow: '0 0 40px rgba(226,122,95,0.2)' }}>
            Elemental
          </h1>
          <p style={{ fontFamily: 'Lora,serif', color: '#9aa5b1', fontSize: 15, lineHeight: 1.7, marginBottom: 40 }}>
            Quatro eras. Quatro territórios corrompidos. Um grupo de sobreviventes tentando restaurar o Elemental Realm antes que o tempo acabe.
          </p>
          <button onClick={() => setPhase('select')} style={{
            padding: '14px 48px', background: 'transparent', border: '2px solid #d4b77a',
            color: '#d4b77a', fontSize: 16, fontFamily: 'Oswald,sans-serif', letterSpacing: '0.15em',
            textTransform: 'uppercase', cursor: 'pointer', borderRadius: 4,
            boxShadow: '0 0 20px rgba(212,183,122,0.15)',
            transition: 'all 0.3s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,183,122,0.15)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(212,183,122,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = '0 0 20px rgba(212,183,122,0.15)'; }}
          >
            Iniciar Aventura
          </button>
          <div style={{ marginTop: 20, fontSize: 11, color: '#627d98', fontFamily: 'Inter,sans-serif', opacity: 0.6 }}>
            2–4 jogadores · 16 rodadas por Era · 4 Eras
          </div>
        </div>
      </div>
    );
  }

  // Character selection
  const hoveredChar = CHARACTERS.find(c => c.id === hovered);
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#090c10',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: '#627d98', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Inter,sans-serif' }}>Legacy Elemental</div>
        <h2 style={{ fontFamily: 'Oswald,sans-serif', fontSize: 24, color: '#d4b77a', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 4 }}>
          Selecione os Personagens ({selected.length}/4)
        </h2>
        <p style={{ fontFamily: 'Lora,serif', color: '#627d98', fontSize: 13 }}>Escolha de 2 a 4 heróis para a sua jornada.</p>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Character grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            {CHARACTERS.map(char => {
              const isSelected = selected.includes(char.id);
              const selIdx = selected.indexOf(char.id);
              return (
                <div key={char.id}
                  onClick={() => toggle(char.id)}
                  onMouseEnter={() => setHovered(char.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    border: `2px solid ${isSelected ? char.color : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                    background: isSelected ? `${char.color}18` : 'rgba(14,32,36,0.6)',
                    transition: 'all 0.2s', position: 'relative',
                    boxShadow: isSelected ? `0 0 20px ${char.color}44` : 'none',
                    transform: hovered === char.id ? 'translateY(-3px)' : 'none',
                  }}>
                  {isSelected && (
                    <div style={{ position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: '50%', background: char.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontFamily: 'Oswald,sans-serif', color: '#090c10', fontWeight: 700, zIndex: 2 }}>
                      {selIdx + 1}
                    </div>
                  )}
                  <img src={char.portrait} alt={char.name} style={{ width: '100%', height: 180, objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
                  <div style={{ padding: '10px 10px 12px' }}>
                    <div style={{ fontFamily: 'Oswald,sans-serif', fontSize: 13, color: '#e1e4db', letterSpacing: '0.05em', lineHeight: 1.2 }}>{char.name.split(' ').slice(0, -1).join(' ')}</div>
                    <div style={{ fontSize: 10, color: char.color, fontFamily: 'Inter,sans-serif', marginTop: 2 }}>{char.role}</div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                      <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, background: 'rgba(196,53,53,0.2)', color: '#e27a5f', fontFamily: 'Inter,sans-serif' }}>PV {char.maxHp}</span>
                      <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, background: 'rgba(126,198,232,0.15)', color: '#7ec6e8', fontFamily: 'Inter,sans-serif' }}>SAN {char.maxSanity}</span>
                      <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, background: 'rgba(212,183,122,0.15)', color: '#d4b77a', fontFamily: 'Inter,sans-serif' }}>POD {char.power}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hover detail panel */}
        <div style={{ width: 280, borderLeft: '1px solid rgba(255,255,255,0.06)', padding: 20, display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0, overflowY: 'auto' }}>
          {hoveredChar ? (
            <>
              <img src={hoveredChar.portrait} alt={hoveredChar.name} style={{ width: '100%', height: 200, objectFit: 'cover', objectPosition: 'top', borderRadius: 8, border: `1px solid ${hoveredChar.color}44` }} />
              <div>
                <div style={{ fontFamily: 'Oswald,sans-serif', fontSize: 18, color: '#e1e4db', letterSpacing: '0.05em' }}>{hoveredChar.name}</div>
                <div style={{ fontSize: 11, color: hoveredChar.color, fontFamily: 'Inter,sans-serif', marginTop: 2 }}>{hoveredChar.role} · {hoveredChar.roleDesc}</div>
              </div>
              <div>
                <StatBar label="PV" value={hoveredChar.maxHp} max={12} color="#e27a5f" />
                <StatBar label="Sanidade" value={hoveredChar.maxSanity} max={12} color="#7ec6e8" />
                <StatBar label="Poder" value={hoveredChar.power} max={6} color="#d4b77a" />
                <StatBar label="Resistência" value={hoveredChar.resist} max={6} color="#9a7ed8" />
                <StatBar label="Movimento" value={hoveredChar.movement} max={5} color="#6fb871" />
              </div>
              <div style={{ background: `${hoveredChar.color}12`, border: `1px solid ${hoveredChar.color}44`, borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ fontSize: 9, color: hoveredChar.color, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'Inter,sans-serif', marginBottom: 4 }}>Habilidade Especial</div>
                <div style={{ fontFamily: 'Oswald,sans-serif', fontSize: 13, color: '#e1e4db', marginBottom: 4 }}>{hoveredChar.ability.name}</div>
                <div style={{ fontFamily: 'Lora,serif', fontSize: 12, color: '#9aa5b1', lineHeight: 1.5 }}>{hoveredChar.ability.desc}</div>
              </div>
            </>
          ) : (
            <div style={{ color: '#627d98', fontFamily: 'Lora,serif', fontSize: 13, lineHeight: 1.6 }}>
              Passe o cursor sobre um personagem para ver seus atributos e habilidade especial.
              <br /><br />
              Selecione de 2 a 4 heróis para começar.
            </div>
          )}
          {/* Start button */}
          {selected.length >= 2 && (
            <button onClick={() => onStart(selected)} style={{
              padding: '12px 20px', background: 'rgba(212,183,122,0.15)',
              border: '1px solid #d4b77a', color: '#d4b77a',
              fontSize: 14, fontFamily: 'Oswald,sans-serif', letterSpacing: '0.1em',
              textTransform: 'uppercase', cursor: 'pointer', borderRadius: 6,
              transition: 'all 0.2s', marginTop: 'auto',
            }}>
              ⚔️ Começar Jogo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Export
Object.assign(window, { SetupScreen, StatBar, DiceDisplay, PhaseBar, RoundTracker, GameLog });
