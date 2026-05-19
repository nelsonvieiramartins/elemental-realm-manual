// ============================================================
// LEGACY ELEMENTAL — Camp Board View
// ============================================================

function CampScreen({ players, campStructures, activePlayerIdx, territories, dispatch }) {
  const [buildMode, setBuildMode] = React.useState(false);
  const player = players[activePlayerIdx];

  const canAfford = (cost) => {
    const resources = player?.resources || {};
    return Object.entries(cost).every(([res, amt]) => (resources[res] || 0) >= amt);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {/* Camp board image behind */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(assets/camp/tabuleiro.webp)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.12 }} />

      <div style={{ position: 'relative', flex: 1, overflowY: 'auto', padding: 16 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <h2 style={{ fontFamily: 'Oswald,sans-serif', fontSize: 20, color: '#d4b77a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>⛺ Acampamento Base</h2>
            <p style={{ fontFamily: 'Lora,serif', fontSize: 12, color: '#627d98' }}>Estruturas construídas pelo grupo. Helena constrói com −1 material.</p>
          </div>
          <button onClick={() => setBuildMode(!buildMode)} style={{
            padding: '7px 16px', background: buildMode ? 'rgba(212,183,122,0.2)' : 'rgba(212,183,122,0.08)',
            border: `1px solid ${buildMode ? '#d4b77a' : 'rgba(212,183,122,0.3)'}`,
            color: '#d4b77a', borderRadius: 6, fontFamily: 'Oswald,sans-serif',
            fontSize: 12, letterSpacing: '0.08em', cursor: 'pointer', textTransform: 'uppercase',
          }}>
            {buildMode ? '✕ Cancelar' : '🔨 Construir'}
          </button>
        </div>

        {/* Build mode: structure picker */}
        {buildMode && (
          <div style={{ marginBottom: 20, background: 'rgba(212,183,122,0.06)', border: '1px solid rgba(212,183,122,0.2)', borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 11, color: '#d4b77a', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'Inter,sans-serif', marginBottom: 12 }}>Estruturas disponíveis</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
              {CAMP_STRUCTURES.filter(s => !campStructures.includes(s.id)).map(struct => {
                const affordable = canAfford(struct.cost);
                const isHelena = player?.id === 'helena';
                return (
                  <div key={struct.id} style={{
                    background: affordable ? 'rgba(111,184,113,0.08)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${affordable ? 'rgba(111,184,113,0.35)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 8, padding: 10, cursor: affordable ? 'pointer' : 'not-allowed',
                    opacity: affordable ? 1 : 0.5, transition: 'all 0.2s',
                  }}
                    onClick={() => affordable && dispatch({ type: 'BUILD_STRUCTURE', structureId: struct.id })}>
                    <div style={{ fontFamily: 'Oswald,sans-serif', fontSize: 13, color: '#e1e4db', letterSpacing: '0.04em' }}>{struct.name}</div>
                    <div style={{ fontSize: 10, color: '#9aa5b1', fontFamily: 'Lora,serif', marginTop: 3, marginBottom: 8, lineHeight: 1.4 }}>{struct.effect}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {Object.entries(struct.cost).map(([res, amt]) => {
                        const has = player?.resources[res] || 0;
                        const need = isHelena ? Math.max(1, amt - 1) : amt;
                        const ok = has >= need;
                        return (
                          <span key={res} style={{
                            fontSize: 10, padding: '2px 6px', borderRadius: 4,
                            background: ok ? 'rgba(111,184,113,0.15)' : 'rgba(201,74,58,0.15)',
                            color: ok ? '#6fb871' : '#e27a5f', fontFamily: 'Inter,sans-serif',
                          }}>
                            {need}× {RESOURCES_DATA[res]?.name || res}{isHelena && amt > 1 ? ' ✦' : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Built structures */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#627d98', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'Inter,sans-serif', marginBottom: 10 }}>
            Construído ({campStructures.length})
          </div>
          {campStructures.length === 0 ? (
            <div style={{ color: '#3a4a5a', fontFamily: 'Lora,serif', fontSize: 13, padding: '20px 0', textAlign: 'center' }}>
              Nenhuma estrutura construída ainda. Clique em Construir para começar.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
              {campStructures.map(sid => {
                const s = CAMP_STRUCTURES.find(x => x.id === sid);
                if (!s) return null;
                return (
                  <div key={sid} style={{
                    background: 'rgba(212,183,122,0.08)', border: '1px solid rgba(212,183,122,0.25)',
                    borderRadius: 8, padding: '10px 12px',
                  }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>
                      {sid === 'fogueira' ? '🔥' : sid.includes('bau') ? '📦' : sid === 'geladeira' ? '❄️' :
                       sid === 'panela' ? '🍳' : sid === 'canteiro' ? '🌱' : sid === 'tenda' ? '⛺' :
                       sid === 'fonte-luz' ? '💡' : sid === 'vortex-ac' ? '🌀' : '🏗️'}
                    </div>
                    <div style={{ fontFamily: 'Oswald,sans-serif', fontSize: 13, color: '#d4b77a', letterSpacing: '0.04em' }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: '#9aa5b1', fontFamily: 'Lora,serif', marginTop: 4, lineHeight: 1.4 }}>{s.effect}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Guardian progress */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#627d98', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'Inter,sans-serif', marginBottom: 10 }}>
            Guardiãs — Ameaça por Era
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
            {GUARDIANS.map((g, i) => {
              const terr = TERRITORY_META.find(t => t.id === g.territory);
              const isCurrentEra = i === 0; // simplified
              return (
                <div key={g.id} style={{
                  background: isCurrentEra ? `${g.color}15` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isCurrentEra ? g.color : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 8, padding: 10, textAlign: 'center',
                  opacity: isCurrentEra ? 1 : 0.5,
                }}>
                  <img src={g.img} alt={g.name} style={{
                    width: '100%', height: 80, objectFit: 'cover', borderRadius: 6,
                    border: `1px solid ${g.color}44`, marginBottom: 6,
                  }} />
                  <div style={{ fontFamily: 'Oswald,sans-serif', fontSize: 12, color: '#e1e4db' }}>{g.name}</div>
                  <div style={{ fontSize: 9, color: g.color, fontFamily: 'Inter,sans-serif', marginTop: 2 }}>Era {i + 1} · {terr?.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 6 }}>
                    <span style={{ fontSize: 9, background: 'rgba(226,122,95,0.15)', color: '#e27a5f', padding: '1px 5px', borderRadius: 3, fontFamily: 'Inter,sans-serif' }}>PV {g.hp}</span>
                    <span style={{ fontSize: 9, background: 'rgba(154,126,216,0.15)', color: '#9a7ed8', padding: '1px 5px', borderRadius: 3, fontFamily: 'Inter,sans-serif' }}>RES {g.res}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* All players resources summary */}
        <div>
          <div style={{ fontSize: 11, color: '#627d98', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'Inter,sans-serif', marginBottom: 10 }}>
            Recursos dos Heróis
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {players.map((p, i) => {
              const totalRes = Object.values(p.resources).reduce((a, b) => a + b, 0);
              return (
                <div key={p.id} style={{
                  background: `${p.color}08`, border: `1px solid ${p.color}30`,
                  borderRadius: 8, padding: '10px 12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <img src={p.portrait} alt={p.name} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: `1px solid ${p.color}` }} />
                    <div>
                      <div style={{ fontFamily: 'Oswald,sans-serif', fontSize: 12, color: '#e1e4db' }}>{p.name.split(' ')[0]}</div>
                      <div style={{ fontSize: 9, color: '#627d98', fontFamily: 'Inter,sans-serif' }}>{totalRes} recursos</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {Object.entries(p.resources).filter(([, v]) => v > 0).map(([key, val]) => (
                      <span key={key} style={{
                        fontSize: 10, padding: '2px 6px', borderRadius: 4,
                        background: 'rgba(255,255,255,0.06)', color: RESOURCES_DATA[key]?.color || '#e1e4db',
                        fontFamily: 'Inter,sans-serif', border: `1px solid rgba(255,255,255,0.08)`,
                      }}>
                        {val}× {RESOURCES_DATA[key]?.name || key}
                      </span>
                    ))}
                    {totalRes === 0 && <span style={{ fontSize: 10, color: '#3a4a5a', fontFamily: 'Inter,sans-serif' }}>Nenhum</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CampScreen });
