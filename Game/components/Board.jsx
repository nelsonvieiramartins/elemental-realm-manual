// ============================================================
// LEGACY ELEMENTAL — Board v2 (SVG Hex Map Overlay)
// ============================================================

const { useState: useBSt, useEffect: useBEff, useRef: useBRef, useMemo } = React;

// ── Hex cell fill colors ──────────────────────────────────────
function cellFillColor(cell, isReachable, isAttackable, isSelected, terrColor) {
  if (isSelected)   return 'rgba(212,183,122,0.35)';
  if (isReachable)  return 'rgba(111,184,113,0.25)';
  if (isAttackable) return 'rgba(226,122,95,0.35)';
  switch (cell.type) {
    case 'vortex':   return 'rgba(78,159,216,0.2)';
    case 'merchant': return 'rgba(212,183,122,0.18)';
    case 'camp':     return 'rgba(212,183,122,0.22)';
    case 'resource': return cell.depleted ? 'rgba(255,255,255,0.03)' : 'rgba(111,184,113,0.15)';
    default:         return 'rgba(0,0,0,0.12)';
  }
}
function cellStrokeColor(cell, isReachable, isAttackable, isSelected, terrColor) {
  if (isSelected)   return '#d4b77a';
  if (isReachable)  return '#6fb871';
  if (isAttackable) return '#e27a5f';
  switch (cell.type) {
    case 'vortex':   return 'rgba(78,159,216,0.7)';
    case 'merchant': return 'rgba(212,183,122,0.6)';
    case 'camp':     return 'rgba(212,183,122,0.7)';
    case 'resource': return cell.depleted ? 'rgba(255,255,255,0.08)' : 'rgba(111,184,113,0.5)';
    default:         return 'rgba(255,255,255,0.12)';
  }
}

// ── SVG Hex Map ───────────────────────────────────────────────
function HexMap({ territory, terrIdx, players, activePlayerIdx, pendingAction, selectedCell, viewTerritoryIdx, onSelectCell, onAttackCreature, zoom = 1 }) {
  const activePlayer = players[activePlayerIdx];
  const playersHere = players.filter(p => p.territory === viewTerritoryIdx);
  const tc = territory.color;

  const reachable = useMemo(() => {
    if (pendingAction?.type !== 'move' || activePlayer?.territory !== viewTerritoryIdx) return [];
    return getCellsInRange(activePlayer.cell, activePlayer.movesLeft);
  }, [pendingAction, activePlayer?.cell, activePlayer?.movesLeft, viewTerritoryIdx]);

  const attackable = useMemo(() => {
    if (pendingAction?.type !== 'attack' || activePlayer?.territory !== viewTerritoryIdx) return [];
    return getHexAdjacent(activePlayer.cell);
  }, [pendingAction, activePlayer?.cell, viewTerritoryIdx]);

  // ── Zoom — controlled from outside ───────────────────────────
  const outerRef = useBRef(null);
  const innerRef = useBRef(null);

  useBEff(() => {
    if (innerRef.current) innerRef.current.style.transform = `scale(${zoom})`;
  }, [zoom]);

  // ── Calibration Mode ─────────────────────────────────────────
  const [calibMode, setCalibMode] = useBSt(false);
  const [positions, setPositions] = useBSt(() => HEX_POSITIONS.map(p => ({ ...p })));
  const calibIdx = useBRef(null);

  const screenToSvg = (clientX, clientY) => {
    const rect = outerRef.current?.getBoundingClientRect();
    if (!rect) return { cx: 0, cy: 0 };
    const z = zoom;
    const svgX = ((clientX - rect.left  - rect.width  * 0.5) / z + rect.width  * 0.5) / rect.width  * 100;
    const svgY = ((clientY - rect.top   - rect.height * 0.5) / z + rect.height * 0.5) / rect.height * 100;
    return { cx: +svgX.toFixed(1), cy: +svgY.toFixed(1) };
  };

  const onOuterMove = (e) => {
    if (calibIdx.current === null) return;
    const coords = screenToSvg(e.clientX, e.clientY);
    const i = calibIdx.current;
    setPositions(prev => { const n = [...prev]; n[i] = coords; return n; });
  };
  const onOuterUp = () => { calibIdx.current = null; };
  const onCalibDown = (e, idx) => { e.stopPropagation(); calibIdx.current = idx; };

  const handleHexClick = (idx, cell) => {
    if (pendingAction?.type === 'attack') {
      if (cell.creature && attackable.includes(idx)) onAttackCreature(cell.creature, idx);
      return;
    }
    onSelectCell(idx);
  };

  const copyPositions = () => {
    const lines = positions.map((p, i) => `  { cx: ${p.cx}, cy: ${p.cy} },  // cell ${i+1}`).join('\n');
    navigator.clipboard?.writeText(`const HEX_POSITIONS = [\n${lines}\n];\n`).catch(() => {});
  };

  const r = HEX_RADIUS;

  const corner = (pos) => ({
    position:'absolute', width:16, height:16, zIndex:25, pointerEvents:'none',
    borderColor:`${tc}bb`, borderStyle:'solid',
    ...(pos[0]==='t' ? {top:0}:{bottom:0}),
    ...(pos[1]==='l' ? {left:0}:{right:0}),
    borderWidth: pos==='tl'?'2px 0 0 2px': pos==='tr'?'2px 2px 0 0': pos==='bl'?'0 0 2px 2px':'0 2px 2px 0',
    borderRadius: pos==='tl'?'3px 0 0 0': pos==='tr'?'0 3px 0 0': pos==='bl'?'0 0 0 3px':'0 0 3px 0',
  });

  const btn = {
    width:24, height:24, borderRadius:4, border:'1px solid rgba(255,255,255,0.1)',
    background:'rgba(9,12,16,0.82)', color:'#7a8a9a', fontSize:13, lineHeight:1,
    cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
    backdropFilter:'blur(4px)', padding:0,
  };

  return (
    <div ref={outerRef}
      style={{
        position:'relative', width:'100%', height:'100%', overflow:'hidden', userSelect:'none',
        borderRadius:4,
        border:`1px solid ${tc}44`,
        boxShadow:`0 0 0 1px rgba(0,0,0,0.95), 0 0 32px ${tc}22, 0 10px 48px rgba(0,0,0,0.92)`,
      }}
      onMouseMove={onOuterMove}
      onMouseUp={onOuterUp}
      onMouseLeave={onOuterUp}
    >
      {/* Corner ornaments */}
      {['tl','tr','bl','br'].map(p => <div key={p} style={corner(p)} />)}

      {/* Zoomable layer — centered transform, no pan */}
      <div ref={innerRef} style={{
        position:'absolute', inset:0,
        transformOrigin:'center center',
        transition:'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
      }}>
        <img src={territory.img} alt={territory.name}
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'fill', display:'block', pointerEvents:'none' }} />

        {/* Vignette — darkens edges for board depth */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:2,
          background:'radial-gradient(ellipse at 50% 50%, transparent 52%, rgba(0,0,0,0.62) 100%)' }} />

        {/* Territory color edge tint */}
        <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:2,
          background:`radial-gradient(ellipse at 50% 50%, transparent 68%, ${tc}20 100%)` }} />

        <svg viewBox="0 0 100 100" preserveAspectRatio="none"
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', overflow:'visible', zIndex:3, pointerEvents:'all' }}
        >
          {territory.cells.map((cell, idx) => {
            const pos = positions[idx];
            if (!pos) return null;
            const isReachable  = reachable.includes(idx);
            const isAttackable = attackable.includes(idx) && !!cell.creature;
            const isSelected   = selectedCell === idx;
            const pts   = hexPoints(pos.cx, pos.cy, r);
            const fill  = cellFillColor(cell, isReachable, isAttackable, isSelected, tc);
            const stroke= cellStrokeColor(cell, isReachable, isAttackable, isSelected, tc);
            const sw    = isSelected || isReachable || isAttackable ? 0.5 : 0.25;
            const here  = playersHere.filter(p => p.cell === idx);

            return (
              <g key={idx} onClick={() => handleHexClick(idx, cell)}
                style={{ cursor:(isReachable||isAttackable||pendingAction)?'pointer':'default' }}>
                <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} />
                {isAttackable && (
                  <polygon points={hexPoints(pos.cx, pos.cy, r*0.95)} fill="none" stroke="#e27a5f" strokeWidth="0.4" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1s" repeatCount="indefinite" />
                  </polygon>
                )}
                <text x={pos.cx} y={pos.cy - r*0.52} textAnchor="middle"
                  fontSize="1.8" fill="rgba(255,255,255,0.35)" fontFamily="Inter,sans-serif" fontWeight="600">
                  {cell.cellNum}
                </text>
                {cell.type==='vortex'   && <text x={pos.cx} y={pos.cy+1.2} textAnchor="middle" fontSize="5" style={{userSelect:'none'}}>🌀</text>}
                {cell.type==='camp'     && <text x={pos.cx} y={pos.cy+1.2} textAnchor="middle" fontSize="5" style={{userSelect:'none'}}>⛺</text>}
                {cell.type==='merchant' && <text x={pos.cx} y={pos.cy+1.2} textAnchor="middle" fontSize="5" style={{userSelect:'none'}}>⚖️</text>}
                {cell.type==='resource' && !cell.depleted && !cell.creature && (
                  <>
                    <text x={pos.cx} y={pos.cy+0.5} textAnchor="middle" fontSize="4" style={{userSelect:'none'}}>🌿</text>
                    <text x={pos.cx} y={pos.cy+r*0.55} textAnchor="middle" fontSize="1.8"
                      fill={RESOURCES_DATA[cell.res]?.color||'#6fb871'} fontFamily="Inter,sans-serif">
                      {RESOURCES_DATA[cell.res]?.name||cell.res}{cell.qty>1?` ×${cell.qty}`:''}
                    </text>
                  </>
                )}
                {cell.type==='resource' && cell.depleted && (
                  <text x={pos.cx} y={pos.cy+1.2} textAnchor="middle" fontSize="3.5" opacity="0.3" style={{userSelect:'none'}}>✗</text>
                )}
                {cell.creature && (() => {
                  const hp=cell.creature.currentHp, maxHp=cell.creature.hp, pct=hp/maxHp, imgSize=r*1.05;
                  return (
                    <g>
                      <defs><clipPath id={`cc-${idx}`}><circle cx={pos.cx} cy={pos.cy-0.5} r={imgSize*0.48}/></clipPath></defs>
                      <circle cx={pos.cx} cy={pos.cy-0.5} r={imgSize*0.52} fill="rgba(0,0,0,0.5)" stroke={cell.creature.color} strokeWidth="0.4"/>
                      <image href={cell.creature.img} clipPath={`url(#cc-${idx})`}
                        x={pos.cx-imgSize*0.48} y={pos.cy-0.5-imgSize*0.48}
                        width={imgSize*0.96} height={imgSize*0.96} preserveAspectRatio="xMidYMid slice"/>
                      <rect x={pos.cx-r*0.6} y={pos.cy+r*0.58} width={r*1.2}     height={1.2} fill="rgba(0,0,0,0.6)" rx="0.4"/>
                      <rect x={pos.cx-r*0.6} y={pos.cy+r*0.58} width={r*1.2*pct} height={1.2} fill="#e27a5f" rx="0.4"/>
                    </g>
                  );
                })()}
                {here.length>0 && (
                  <g>
                    {here.map((p,pi) => {
                      const off=here.length>1?(pi-(here.length-1)/2)*r*0.55:0;
                      const tokenR=r*0.38, tx=pos.cx+off, ty=pos.cy+(cell.creature?r*0.15:0);
                      return (
                        <g key={p.id}>
                          <defs><clipPath id={`pc-${idx}-${pi}`}><circle cx={tx} cy={ty} r={tokenR*0.9}/></clipPath></defs>
                          <circle cx={tx} cy={ty} r={tokenR+0.4} fill="rgba(0,0,0,0.8)" stroke={p.color} strokeWidth="0.55"/>
                          <image href={p.portrait} clipPath={`url(#pc-${idx}-${pi})`}
                            x={tx-tokenR*0.9} y={ty-tokenR*0.9}
                            width={tokenR*1.8} height={tokenR*1.8} preserveAspectRatio="xMidYMid slice"/>
                          {p.id===activePlayer?.id && (
                            <circle cx={tx+tokenR*0.7} cy={ty-tokenR*0.7} r={0.6} fill={p.color}>
                              <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/>
                            </circle>
                          )}
                        </g>
                      );
                    })}
                  </g>
                )}
              </g>
            );
          })}

          {/* Calibration dots */}
          {calibMode && positions.map((pos, idx) => (
            <g key={`cal-${idx}`}>
              <circle cx={pos.cx} cy={pos.cy} r={r*0.3}
                fill="rgba(255,60,60,0.6)" stroke="#ff5050" strokeWidth="0.35"
                style={{cursor:'crosshair', pointerEvents:'all'}}
                onMouseDown={(e) => onCalibDown(e, idx)} />
              <text x={pos.cx} y={pos.cy+0.8} textAnchor="middle"
                fontSize="2.2" fill="#ffbbbb" fontFamily="Inter,sans-serif" fontWeight="700"
                style={{pointerEvents:'none'}}>{idx+1}</text>
            </g>
          ))}
        </svg>
      </div>

      {/* Territory name badge */}
      <div style={{ position:'absolute', top:7, left:8, zIndex:20, pointerEvents:'none',
        background:`${tc}18`, border:`1px solid ${tc}40`, borderRadius:3, padding:'2px 7px',
        fontSize:8, color:tc, fontFamily:'Oswald,sans-serif', letterSpacing:'0.12em', textTransform:'uppercase',
        backdropFilter:'blur(6px)' }}>
        {territory.name}
      </div>

      {/* Calibration controls — bottom left */}
      <div style={{ position:'absolute', bottom:7, left:8, zIndex:20, display:'flex', gap:4, alignItems:'center', pointerEvents:'all' }}>
        <button style={{ ...btn, width:20, height:20, fontSize:9,
          background: calibMode?'rgba(220,60,60,0.22)':'rgba(9,12,16,0.82)',
          color: calibMode?'#ff9090':'#2a3a4a',
          borderColor: calibMode?'rgba(255,100,100,0.45)':'rgba(255,255,255,0.06)',
        }} onClick={() => setCalibMode(c => !c)} title="Calibrar hexágonos">🎯</button>
        {calibMode && (
          <button onClick={copyPositions}
            style={{ padding:'2px 6px', background:'rgba(255,80,80,0.15)', border:'1px solid rgba(255,100,100,0.4)', color:'#ff9090', borderRadius:3, cursor:'pointer', fontSize:8, fontFamily:'Inter,sans-serif' }}>
            📋 Copiar JSON
          </button>
        )}
      </div>
    </div>
  );
}

// ── Territory selector strip ──────────────────────────────────
function TerritoryStrip({ territories, viewIdx, players, onSwitch }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '5px 8px', background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
      {territories.map((t, i) => {
        const here = players.filter(p => p.territory === i).length;
        const active = i === viewIdx;
        return (
          <button key={t.id} onClick={() => onSwitch(i)} style={{
            flex: 1, padding: '5px 4px', borderRadius: 5, border: `1px solid ${active ? t.color : 'rgba(255,255,255,0.07)'}`,
            background: active ? `${t.color}1a` : 'transparent',
            color: active ? t.color : '#4a6070', fontSize: 10, fontFamily: 'Oswald,sans-serif',
            letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.18s',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
          }}>
            <span>{t.name}</span>
            {here > 0 && <span style={{ fontSize: 8, background: t.color, color: '#090c10', borderRadius: 8, padding: '0 4px', fontFamily: 'Inter,sans-serif', fontWeight: 700 }}>{here}👤</span>}
          </button>
        );
      })}
    </div>
  );
}

// ── Action Bar ────────────────────────────────────────────────
function ActionBar({ player, pendingAction, turnPhase, onAction, onCancel, onEndActions }) {
  if (!player) return null;
  const canAct = turnPhase === 'acoes' && player.status === 'active' && player.actionsLeft > 0;
  const isMyTurn = turnPhase === 'acoes' && player.status === 'active';

  return (
    <div style={{ padding: '6px 8px', background: 'rgba(0,0,0,0.75)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 4, alignItems: 'center', flexShrink: 0, flexWrap: 'wrap' }}>
      {pendingAction ? (
        <>
          <div style={{ fontSize: 11, color: '#d4b77a', fontFamily: 'Inter,sans-serif', flex: 1, padding: '4px 6px', background: 'rgba(212,183,122,0.08)', borderRadius: 5 }}>
            {pendingAction.type === 'move'  && '👣 Clique numa célula alcançável (verde) para mover'}
            {pendingAction.type === 'attack' && '⚔️ Clique numa criatura adjacente (laranja) para atacar'}
            {pendingAction.type === 'build'  && '🔨 Vá ao Acampamento para construir'}
          </div>
          <button onClick={onCancel} style={{ padding:'5px 10px', background:'rgba(201,74,58,0.15)', border:'1px solid #c94a3a', color:'#c94a3a', borderRadius:5, fontSize:11, fontFamily:'Oswald,sans-serif', cursor:'pointer' }}>Cancelar</button>
        </>
      ) : (
        <>
          {ACTIONS.map(a => (
            <button key={a.id} onClick={() => canAct && onAction(a.id)} title={a.desc} style={{
              padding:'5px 8px', borderRadius:5, minWidth:46, display:'flex', flexDirection:'column', alignItems:'center', gap:1,
              background: canAct ? 'rgba(212,183,122,0.08)' : 'rgba(255,255,255,0.02)',
              border:`1px solid ${canAct ? 'rgba(212,183,122,0.25)' : 'rgba(255,255,255,0.05)'}`,
              color: canAct ? '#d4b77a' : '#2a3a4a', fontSize:9, fontFamily:'Inter,sans-serif',
              cursor: canAct ? 'pointer' : 'not-allowed', textTransform:'uppercase', letterSpacing:'0.04em', transition:'all 0.12s',
            }}>
              <span style={{ fontSize:15 }}>{a.icon}</span>
              <span>{a.name}</span>
            </button>
          ))}
          <div style={{ flex:1 }} />
          {/* Action pips */}
          <div style={{ display:'flex', gap:3, alignItems:'center', marginRight:6 }}>
            {Array(3).fill(0).map((_,i) => (
              <div key={i} style={{ width:9, height:9, borderRadius:'50%', background: i < (player.actionsLeft||0) ? player.color : 'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.12)', transition:'all 0.2s' }} />
            ))}
          </div>
          {isMyTurn && (
            <button onClick={onEndActions} style={{ padding:'5px 12px', background:'rgba(154,126,216,0.12)', border:'1px solid #9a7ed8', color:'#9a7ed8', borderRadius:5, fontSize:11, fontFamily:'Oswald,sans-serif', cursor:'pointer', letterSpacing:'0.05em', textTransform:'uppercase' }}>
              Passar →
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ── Phase Bar ─────────────────────────────────────────────────
function PhaseBar({ phase, round, era, players, activePlayerIdx, onAdvance, onNextRound, darknessRounds }) {
  const phases = [
    { id:'evento','label':'Evento','icon':'🃏' },
    { id:'acoes', 'label':'Ações', 'icon':'⚡' },
    { id:'criaturas','label':'Criaturas','icon':'👾' },
    { id:'manutencao','label':'Manutenção','icon':'🕯️' },
    { id:'final','label':'Final','icon':'🌙' },
  ];
  const phaseIdx = phases.findIndex(p => p.id === phase);
  const nextPhase = phases[phaseIdx + 1];
  const ap = players[activePlayerIdx];
  const isDark = darknessRounds?.includes(round);

  return (
    <div style={{ display:'flex', alignItems:'center', gap:0, background:'rgba(9,12,16,0.97)', borderBottom:'1px solid rgba(255,255,255,0.07)', padding:'5px 12px', flexShrink:0, height:44 }}>
      <div style={{ marginRight:14, minWidth:80 }}>
        <div style={{ fontSize:8, color:'#627d98', textTransform:'uppercase', letterSpacing:'0.15em', fontFamily:'Inter,sans-serif' }}>Era {era} · Rod</div>
        <div style={{ fontSize:17, fontFamily:'Oswald,sans-serif', color:isDark?'#7ec6e8':'#d4b77a', lineHeight:1 }}>
          {round}<span style={{ fontSize:10, color:'#627d98' }}>/16</span>
          {isDark && <span style={{ fontSize:9, color:'#7ec6e8', marginLeft:3 }}>🌑</span>}
        </div>
      </div>

      {/* Round dots */}
      <div style={{ display:'flex', gap:1.5, marginRight:12 }}>
        {Array(16).fill(0).map((_,i) => {
          const rn = i+1;
          const cur = rn === round, past = rn < round, dark = darknessRounds?.includes(rn);
          return <div key={i} style={{ width:6, height:6, borderRadius:'50%', background: cur?'#d4b77a': past?'rgba(212,183,122,0.25)': dark?'rgba(126,198,232,0.25)':'rgba(255,255,255,0.06)', border:`1px solid ${cur?'#d4b77a':dark?'rgba(126,198,232,0.4)':'rgba(255,255,255,0.1)'}`, transition:'all 0.3s' }} />;
        })}
      </div>

      {/* Phase pills */}
      <div style={{ display:'flex', gap:2, flex:1 }}>
        {phases.map((p, i) => {
          const active = p.id === phase, past = i < phaseIdx;
          return (
            <div key={p.id} style={{ flex:1, padding:'3px 4px', borderRadius:5, textAlign:'center', background: active?'rgba(212,183,122,0.15)':'transparent', border:`1px solid ${active?'#d4b77a':past?'rgba(255,255,255,0.03)':'rgba(255,255,255,0.07)'}`, opacity:past?0.3:1, transition:'all 0.25s' }}>
              <div style={{ fontSize:11 }}>{p.icon}</div>
              <div style={{ fontSize:7.5, color:active?'#d4b77a':'#627d98', fontFamily:'Inter,sans-serif', textTransform:'uppercase', letterSpacing:'0.08em', lineHeight:1 }}>{p.label}</div>
            </div>
          );
        })}
      </div>

      {/* Active player */}
      {phase === 'acoes' && ap && (
        <div style={{ display:'flex', alignItems:'center', gap:6, marginLeft:10 }}>
          <img src={ap.portrait} alt="" style={{ width:26, height:26, borderRadius:'50%', objectFit:'cover', border:`2px solid ${ap.color}` }} />
          <div>
            <div style={{ fontSize:9, color:'#9aa5b1', fontFamily:'Inter,sans-serif' }}>Age agora</div>
            <div style={{ fontSize:11, color:'#e1e4db', fontFamily:'Oswald,sans-serif', lineHeight:1.1 }}>{ap.name.split(' ')[0]}</div>
          </div>
        </div>
      )}

      <button onClick={phase === 'final' ? onNextRound : () => onAdvance(nextPhase?.id)}
        style={{ marginLeft:10, padding:'4px 12px', borderRadius:5, background:'rgba(212,183,122,0.12)', border:'1px solid rgba(212,183,122,0.4)', color:'#d4b77a', fontSize:11, fontFamily:'Oswald,sans-serif', letterSpacing:'0.05em', cursor:'pointer', whiteSpace:'nowrap', textTransform:'uppercase' }}>
        {phase === 'final' ? 'Nova Rodada →' : 'Avançar →'}
      </button>
    </div>
  );
}

// ── Player Panel (right sidebar) ──────────────────────────────
function PlayerPanel({ players, activePlayerIdx, territories }) {
  const [expanded, setExpanded] = useBSt(null);
  return (
    <div style={{ width:175, borderLeft:'1px solid rgba(255,255,255,0.06)', display:'flex', flexDirection:'column', background:'rgba(9,12,16,0.92)', overflowY:'auto', flexShrink:0 }}>
      <div style={{ padding:'8px 10px 5px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize:8, color:'#627d98', textTransform:'uppercase', letterSpacing:'0.15em', fontFamily:'Inter,sans-serif' }}>Sobreviventes</div>
      </div>
      {players.map((p, i) => {
        const isActive = i === activePlayerIdx;
        const isExp = expanded === i;
        const terrName = territories[p.territory]?.name || '?';
        return (
          <div key={p.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', background: isActive?`${p.color}0a`:'transparent' }}>
            <div onClick={() => setExpanded(isExp ? null : i)} style={{ padding:'8px 10px', cursor:'pointer', display:'flex', gap:7, alignItems:'center' }}>
              <div style={{ position:'relative', flexShrink:0 }}>
                <img src={p.portrait} alt="" style={{ width:32, height:32, borderRadius:'50%', objectFit:'cover', border:`2px solid ${isActive?p.color:'rgba(255,255,255,0.1)'}`, opacity:p.status==='unconscious'?0.4:1 }} />
                {isActive && <div style={{ position:'absolute', bottom:-1, right:-1, width:8, height:8, borderRadius:'50%', background:p.color, border:'1px solid #090c10' }} />}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:'Oswald,sans-serif', fontSize:11, color:isActive?'#e1e4db':'#7a8a9a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {p.name.split(' ')[0]}{p.status==='unconscious'&&<span style={{ color:'#c94a3a', marginLeft:3 }}>💀</span>}
                </div>
                <div style={{ fontSize:8, color:'#3a5060', fontFamily:'Inter,sans-serif' }}>{terrName} · ⬡{p.cell+1}</div>
                <div style={{ display:'flex', gap:2, marginTop:3 }}>
                  <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.06)', borderRadius:2 }}><div style={{ height:'100%', width:`${(p.hp/p.maxHp)*100}%`, background:'#e27a5f', borderRadius:2 }} /></div>
                  <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.06)', borderRadius:2 }}><div style={{ height:'100%', width:`${(p.sanity/p.maxSanity)*100}%`, background:'#7ec6e8', borderRadius:2 }} /></div>
                </div>
              </div>
              <div style={{ fontSize:8, color:'#3a5060' }}>{isExp?'▲':'▼'}</div>
            </div>

            {isExp && (
              <div style={{ padding:'0 10px 10px' }}>
                {[['PV', p.hp, p.maxHp, '#e27a5f'], ['Sanidade', p.sanity, p.maxSanity, '#7ec6e8'], ['Poder', p.power, 6, '#d4b77a'], ['Resist.', p.resist, 6, '#9a7ed8']].map(([l,v,m,c]) => (
                  <div key={l} style={{ marginBottom:4 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:8, color:'#627d98', fontFamily:'Inter,sans-serif', marginBottom:1 }}>
                      <span>{l}</span><span style={{ color:'#e1e4db' }}>{v}/{m}</span>
                    </div>
                    <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:2 }}><div style={{ height:'100%', width:`${(v/m)*100}%`, background:c, borderRadius:2, transition:'width 0.4s' }} /></div>
                  </div>
                ))}
                <div style={{ marginTop:6 }}>
                  <div style={{ fontSize:8, color:'#627d98', textTransform:'uppercase', letterSpacing:'0.15em', fontFamily:'Inter,sans-serif', marginBottom:4 }}>Recursos</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:3 }}>
                    {Object.entries(p.resources).filter(([,v])=>v>0).map(([k,v])=>(
                      <span key={k} style={{ fontSize:9, padding:'1px 5px', borderRadius:3, background:'rgba(255,255,255,0.05)', color:RESOURCES_DATA[k]?.color||'#e1e4db', fontFamily:'Inter,sans-serif', border:'1px solid rgba(255,255,255,0.07)' }}>{v}×{RESOURCES_DATA[k]?.name||k}</span>
                    ))}
                    {!Object.values(p.resources).some(v=>v>0) && <span style={{ fontSize:9, color:'#2a3a4a', fontFamily:'Inter,sans-serif' }}>Nenhum</span>}
                  </div>
                </div>
                <div style={{ marginTop:6, background:`${p.charColor||p.color}10`, border:`1px solid ${p.charColor||p.color}25`, borderRadius:5, padding:'5px 7px' }}>
                  <div style={{ fontSize:8, color:p.charColor||p.color, textTransform:'uppercase', letterSpacing:'0.12em', fontFamily:'Inter,sans-serif' }}>Hab.</div>
                  <div style={{ fontSize:10, color:'#e1e4db', fontFamily:'Oswald,sans-serif' }}>{p.ability.name}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Event Card Modal ──────────────────────────────────────────
function EventCardModal({ card, onDismiss }) {
  if (!card) return null;
  const isCreature = card.type === 'creature' || card.type === 'passive';
  const data = card.data;
  const color = data.color || '#d4b77a';

  return (
    <div style={{ position:'fixed', inset:0, zIndex:150, background:'rgba(9,12,16,0.88)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center' }} onClick={onDismiss}>
      <div onClick={e=>e.stopPropagation()} style={{ width:'min(340px,92vw)', background:'rgba(14,20,28,0.98)', border:`1px solid ${color}`, borderRadius:12, overflow:'hidden', boxShadow:`0 0 40px ${color}33` }}>
        {/* Card image — full art */}
        <div style={{ position:'relative' }}>
          <img src={data.img} alt={data.name} style={{ width:'100%', height:'auto', display:'block' }} />
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(to bottom, transparent 65%, rgba(14,20,28,0.85) 100%)`, pointerEvents:'none' }} />
          {/* Type badge */}
          <div style={{ position:'absolute', top:10, left:10, fontSize:8, padding:'3px 8px', borderRadius:4, background:`${color}33`, border:`1px solid ${color}66`, color, fontFamily:'Oswald,sans-serif', letterSpacing:'0.15em', textTransform:'uppercase' }}>
            {isCreature ? (card.type === 'passive' ? 'Passiva' : 'Criatura') : data.type}
          </div>
        </div>

        <div style={{ padding:'14px 16px 16px' }}>
          <div style={{ fontFamily:'Oswald,sans-serif', fontSize:20, color:'#e1e4db', letterSpacing:'0.06em', marginBottom:4 }}>{data.name}</div>

          {isCreature ? (
            <>
              <div style={{ fontSize:10, color, fontFamily:'Inter,sans-serif', marginBottom:10 }}>Nível {data.tier} · {card.type === 'passive' ? 'Criatura Passiva' : 'Ameaça'}</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginBottom:10 }}>
                {[['PV',data.hp,'#e27a5f'],['ATQ',`${data.atk[0]}d${data.atk[1]}+${data.atk[2]}`,'#d4b77a'],['RES',data.res,'#9a7ed8'],['FUGA',data.escape,'#7ec6e8']].map(([l,v,c])=>(
                  <div key={l} style={{ textAlign:'center', background:'rgba(255,255,255,0.04)', borderRadius:5, padding:'5px 3px' }}>
                    <div style={{ fontSize:13, color:c, fontFamily:'Oswald,sans-serif' }}>{v}</div>
                    <div style={{ fontSize:8, color:'#627d98', fontFamily:'Inter,sans-serif' }}>{l}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:11, color:'#9aa5b1', fontFamily:'Lora,serif', lineHeight:1.5, marginBottom:10 }}>{data.note}</div>
              {card.spawnedTerritory !== undefined && (
                <div style={{ fontSize:10, color, fontFamily:'Inter,sans-serif', background:`${color}12`, border:`1px solid ${color}30`, borderRadius:5, padding:'5px 8px', marginBottom:10 }}>
                  📍 Surgiu em: <strong>{TERRITORY_META[card.spawnedTerritory]?.name}</strong> · Célula {card.spawnedCell}
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ fontSize:10, color, fontFamily:'Inter,sans-serif', marginBottom:10 }}>{data.type}</div>
              <div style={{ fontSize:12, color:'#e1e4db', fontFamily:'Lora,serif', lineHeight:1.6, marginBottom:10 }}>{data.effect}</div>
            </>
          )}

          <button onClick={onDismiss} style={{ width:'100%', padding:'9px', background:`${color}18`, border:`1px solid ${color}55`, color, borderRadius:6, fontFamily:'Oswald,sans-serif', fontSize:13, letterSpacing:'0.1em', cursor:'pointer', textTransform:'uppercase' }}>
            Continuar →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Game Log ──────────────────────────────────────────────────
function GameLog({ log }) {
  return (
    <div style={{ height:56, overflowY:'auto', padding:'4px 10px', background:'rgba(0,0,0,0.6)', borderTop:'1px solid rgba(255,255,255,0.05)', flexShrink:0 }}>
      <div style={{ fontSize:8, color:'#627d98', textTransform:'uppercase', letterSpacing:'0.15em', fontFamily:'Inter,sans-serif', marginBottom:4 }}>Log</div>
      {log.map((e,i) => (
        <div key={i} style={{ fontSize:10, color:i===0?'#e1e4db':'#3a5060', fontFamily:'Inter,sans-serif', padding:'1px 0', borderBottom:'1px solid rgba(255,255,255,0.03)', lineHeight:1.4 }}>{e}</div>
      ))}
    </div>
  );
}

Object.assign(window, { HexMap, TerritoryStrip, ActionBar, PhaseBar, PlayerPanel, EventCardModal, GameLog });
