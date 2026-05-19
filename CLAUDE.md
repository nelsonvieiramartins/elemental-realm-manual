# Legacy of the Elemental Realms — Instruções para Claude

## Visão Geral do Projeto

Dois projetos paralelos que coexistem nesta pasta e devem estar sempre sincronizados:

| Projeto | Pasta | Tecnologia |
|---|---|---|
| Manual Interativo | `/` (raiz) | Vanilla JS, hash routing, SPA |
| Versão Digital do Jogo | `Game/` | React 18, Babel standalone, sem bundler |

---

## Regra de Sincronização — OBRIGATÓRIA

> **Toda alteração de regra, mecânica ou dado do jogo deve ser refletida nos dois projetos.**

### Se a mudança partir do Jogo (`Game/`):
1. Alterar `game-data.js` ou `game-engine.js` ou os componentes em `components/`
2. Identificar qual página do Manual é afetada:
   - Mecânicas gerais → `pages/mecanicas.html`
   - Personagens → `pages/personagens.html`
   - Criaturas / Guardiões → `pages/criaturas.html`
   - Recursos / Itens → `pages/recursos.html`
   - Territórios / Eras → `pages/eras.html`
   - Pedras elementais → `pages/pedras.html`
3. Atualizar o conteúdo textual da página correspondente no Manual

### Se a mudança partir do Manual (`pages/`):
1. Identificar o dado ou mecânica alterada
2. Atualizar o dado correspondente no `game-data.js` ou a lógica no `game-engine.js`
3. Atualizar os componentes React se a mudança impactar UI ou fluxo de jogo

### Nunca deixar os dois projetos divergentes.
Se não for possível sincronizar na mesma sessão, registrar explicitamente o que ficou pendente.

---

## Estrutura do Jogo (`Game/`)

```
Game/
├── Legacy Elemental.html   ← entrada principal (React root)
├── game-data.js            ← todos os dados: personagens, criaturas, guardiões, eventos, mapas
├── game-engine.js          ← reducer, lógica de estado, createInitialState
└── components/
    ├── Setup.jsx           ← tela de setup e seleção de personagens
    ├── Board.jsx           ← tabuleiro hex, mapa, barra de ações, painel de jogadores
    ├── Combat.jsx          ← modal de combate, tela de game over
    └── Camp.jsx            ← tela de acampamento
```

**Importante:** o projeto usa React 18 + Babel standalone (sem Webpack/Vite). Componentes se comunicam via `window` scope com `Object.assign(window, {...})`. Manter essa arquitetura.

### Assets (`Game/assets/`)
- `chars/` — retratos dos 8 personagens
- `creatures/{venaris,glacis,terragorn,tenebris}/` — criaturas por território
- `guardians/` — 4 guardiões (chefes)
- `events/{venaris,glacis,terragorn,tenebris}/` — cartas de evento
- `maps/` — imagens dos 4 mapas hex
- `passives/` — criaturas passivas (vaca, porco, peru)
- `tokens/` — ícones de recursos
- `ui/` — elementos de interface
- `camp/` — imagem do tabuleiro de acampamento

**Pendência:** `assets/creatures/tenebris/necromancer.webp` está faltando (criatura Tier 3).

---

## Estrutura do Manual (raiz)

```
pages/
├── capa.html
├── introducao.html
├── historia.html
├── eras.html           ← Os 4 territórios
├── pedras.html         ← Gemas elementais
├── personagens.html    ← 8 personagens jogáveis
├── mecanicas.html      ← Regras e sistema de ações
├── criaturas.html      ← Bestiário e guardiões
├── recursos.html       ← Recursos e itens
└── apendice.html
```

---

## Os 4 Territórios

| ID | Nome | Cor | Guardião |
|---|---|---|---|
| `venaris` | Venaris | `#6fb871` | Viper |
| `glacis` | Glacis | `#7ec6e8` | Ice Witch |
| `terragorn` | Terragorn | `#e27a5f` | Hellish Titan |
| `tenebris` | Tenebris | `#9a7ed8` | Shadow |

## Os 8 Personagens

| ID | Nome | Papel |
|---|---|---|
| `arthur` | Arthur Blackwood | O Pintor (Eco/Movimento) |
| `elizabeth` | Dra. Elizabeth Bancroft | A Médica (Suporte) |
| `morgan` | Morgan Huxley | O Alquimista (Utilitário) |
| `thomas` | Conde T. Wellington | O Burocrata (Econômico) |
| `jack` | Jack Timber | O Lenhador (Combate/Tanque) |
| `cassandra` | Cassandra Vane | A Investigadora (Scout) |
| `ivy` | Ivy Hawthorne | A Botânica (Recursos) |
| `helena` | Helena Gearwright | A Engenheira (Construção) |
