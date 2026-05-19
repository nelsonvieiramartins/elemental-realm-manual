const initLightboxApp = () => {
  // Config Lightbox Element
  let lbHTML = document.querySelector('.lightbox-wrap');
  if(!lbHTML) {
      document.body.insertAdjacentHTML('beforeend', \`
          <div class="lightbox-wrap">
              <div class="lightbox-close">&times;</div>
              <img class="lightbox-img" src="" alt="View">
          </div>
      \`);
      lbHTML = document.querySelector('.lightbox-wrap');
  }
  const lbImg = document.querySelector('.lightbox-img');
  
  window.openLightBoxImage = (src) => {
      lbImg.src = src;
      lbHTML.classList.add('open');
  };
  
  lbHTML.addEventListener('click', e => {
      if(e.target !== lbImg) lbHTML.classList.remove('open');
  });

  // Re-mapear cliques após renderização das páginas
  window.attachVisualHooks = () => {
    // Personagens
    const charImages = {
      'Arthur Blackwood': 'ELEMENTOS/PERSONAGENS/ILUSTRAÇÕES/Arthur.png',
      'Dra. Elizabeth Bancroft': 'ELEMENTOS/PERSONAGENS/ILUSTRAÇÕES/LENORA.png', 
      'Morgan Huxley': 'ELEMENTOS/PERSONAGENS/ILUSTRAÇÕES/SILAS.png', 
      'Conde T. Wellington': 'ELEMENTOS/PERSONAGENS/ILUSTRAÇÕES/REGINALDO.png', 
      'Jack Timber': 'ELEMENTOS/PERSONAGENS/ILUSTRAÇÕES/JACK (2).png',
      'Cassandra Vane': 'ELEMENTOS/PERSONAGENS/ILUSTRAÇÕES/CASSANDRA.png',
      'Ivy Hawthorne': 'ELEMENTOS/PERSONAGENS/ILUSTRAÇÕES/IVY.png',
      'Helena Gearwright': 'ELEMENTOS/PERSONAGENS/ILUSTRAÇÕES/HELENA.png'
    };

    document.querySelectorAll('.char').forEach(char => {
      const nomeEl = char.querySelector('.char-name');
      if(nomeEl && charImages[nomeEl.innerText]) {
        const portrait = char.querySelector('.char-portrait');
        if(portrait) {
           portrait.innerHTML = \`<img class="portrait-img" src="\${charImages[nomeEl.innerText]}">\`;
           char.onclick = () => window.openLightBoxImage(charImages[nomeEl.innerText]);
           char.style.cursor = 'pointer';
        }
      }
    });

    // Mapas nas Eras
    const eraMaps = {
      'era-venaris': 'ELEMENTOS/MAPAS/VALE SERENO.png',
      'era-glacis': 'ELEMENTOS/MAPAS/FLORESTA NEGRA.png',
      'era-terragorn': 'ELEMENTOS/MAPAS/ABISMO CRESCENTE.png',
      'era-tenebris': 'ELEMENTOS/MAPAS/UMBRAFORT.png'
    };

    document.querySelectorAll('.era').forEach(era => {
      const bgImg = eraMaps[era.id];
      if (bgImg) {
        if(!era.querySelector('.era-bg')) {
            const bgElt = document.createElement('div');
            bgElt.className = 'era-bg';
            bgElt.style.backgroundImage = \`url('\${bgImg}')\`;
            era.insertBefore(bgElt, era.firstChild);
            
            const hint = document.createElement('span');
            hint.className = 'era-map-hint';
            hint.innerText = '[ Clique para Mapa ]';
            hint.style.cssText = "font-size:0.7rem; color:var(--era-color); display:block; opacity:0.8; letter-spacing:0.1em; margin-top:1rem;";
            era.appendChild(hint);
        }
        era.onclick = () => window.openLightBoxImage(bgImg);
      }
    });

    // Monstros e Passivas
    const creatureAssets = {
        'Ferocious Rat': 'ELEMENTOS/CRIATURAS/VENARIS/Ferocious Rat.jpg',
        'White Wolf': 'ELEMENTOS/CRIATURAS/GLACIS/White Wolf.jpg',
        'Nightmarish Spider': 'ELEMENTOS/CRIATURAS/VENARIS/Nightmarish Spider.jpg',
        'Bat Demon': 'ELEMENTOS/CRIATURAS/TENEBRIS/Bat Demon.jpg',
        'Spiked Toad Beast': 'ELEMENTOS/CRIATURAS/VENARIS/Spiked Toad.jpg',
        'Crimson-Spiked Toad': 'ELEMENTOS/CRIATURAS/VENARIS/Crimson-Spiked Toad.jpg',
        'Lunar Beast': 'ELEMENTOS/CRIATURAS/VENARIS/Lunar Beast.jpg',
        'Nightwing Fiend': 'ELEMENTOS/CRIATURAS/TENEBRIS/Nightwing Fiend.jpg',
        'Skeleton Fiend': 'ELEMENTOS/CRIATURAS/TENEBRIS/Skeleton Fiend.jpg',
        'Demonic Boar': 'ELEMENTOS/CRIATURAS/TERRAGORN/Demonic Boar.jpg',
        'Ice Golem': 'ELEMENTOS/CRIATURAS/GLACIS/Ice Guardian.jpg', 
        'Arachnid Overlord': 'ELEMENTOS/CRIATURAS/VENARIS/Nightmarish Spider.jpg',
        'Battle Toad': 'ELEMENTOS/CRIATURAS/VENARIS/Spiked Toad.jpg'
    };
    
    document.querySelectorAll('.creature-card').forEach(cc => {
      const nomeEl = cc.querySelector('.creature-name');
      if(!nomeEl) return;
      let src = creatureAssets[nomeEl.innerText];
      
      if(src && !cc.querySelector('.creature-bg')) {
        const bg = document.createElement('div');
        bg.className = 'creature-bg';
        bg.style.backgroundImage = \`url('\${src}')\`;
        cc.appendChild(bg);
        cc.onclick = () => window.openLightBoxImage(src);
      }
    });

    // Guardioes links
    document.querySelectorAll('dd').forEach(dd => {
        if(dd.innerText.includes('Viper') || dd.innerText.includes('Titan Inferno') || dd.innerText.includes('Ice Monarch') || dd.innerText.includes('Shadow Sovereign')) {
            dd.style.cursor='pointer'; dd.style.color='var(--accent)'; dd.style.textDecoration='underline';
            let bossImg = '';
            if(dd.innerText.includes('Viper')) bossImg = 'ELEMENTOS/CRIATURAS GUARDIÃS/VIPER.png';
            if(dd.innerText.includes('Titan')) bossImg = 'ELEMENTOS/CRIATURAS GUARDIÃS/Hellish Titan.png';
            if(dd.innerText.includes('Ice')) bossImg = 'ELEMENTOS/CRIATURAS GUARDIÃS/ICE WITCH.png';
            if(dd.innerText.includes('Shadow')) bossImg = 'ELEMENTOS/CRIATURAS GUARDIÃS/SHADOW.png';
            
            dd.onclick = (e) => { e.stopPropagation(); window.openLightBoxImage(bossImg); };
        }
    });
  }
};
document.addEventListener('DOMContentLoaded', initLightboxApp);
