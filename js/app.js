// Router Simples SPA para o Web App
const contentContainer = document.getElementById('app-content');
const loader = document.getElementById('loader');

// Roteamento
const loadPage = async (route) => {
    // limpa # se houver
    let pageName = route.replace('#/', '');
    if(pageName === '' || pageName === '#') pageName = 'capa';
    
    // Game mode: remove padding for full-screen iframe experience
    const isGame = pageName === 'jogar';
    if(isGame) {
        contentContainer.classList.add('game-mode');
    } else {
        contentContainer.classList.remove('game-mode');
    }
    
    // Mostra loader
    loader.classList.add('loading');
    contentContainer.classList.add('page-transition-exit');
    
    try {
        const res = await fetch(`pages/${pageName}.html`);
        if(!res.ok) throw new Error('Página não encontrada');
        const text = await res.text();
        
        // Remove saídas
        setTimeout(() => {
            contentContainer.innerHTML = text;
            contentContainer.classList.remove('page-transition-exit');
            contentContainer.classList.add('page-transition-enter');
            
            // Reanexa scripts visuais do modal / imgs
            if(window.attachVisualHooks) window.attachVisualHooks();
            
            loader.classList.remove('loading');
            
            // Corrige links internos das páginas, eles agora devem usar Router
            document.querySelectorAll('#app-content a').forEach(aElement => {
                const href = aElement.getAttribute('href');
                if(href && href.startsWith('#')) {
                    aElement.setAttribute('href', '#/' + href.replace('#',''));
                }
            });

            // Reseta a transição de entrada
            setTimeout(() => { contentContainer.classList.remove('page-transition-enter'); }, 400);
            
            // Scroll para cima
            contentContainer.scrollTo(0,0);
        }, 300);
        
    } catch(err) {
        console.error(err);
        contentContainer.innerHTML = `<div class="page" style="text-align:center; padding:10rem 0;"><h1 style="color:var(--danger)">Erro 404</h1><p>O fragmento ${pageName}.html não foi encontrado.</p></div>`;
        contentContainer.classList.remove('game-mode');
        loader.classList.remove('loading');
    }
};

// Event Listener dos links
const navLinks = document.querySelectorAll('.route-link');
const setActiveLink = (hash) => {
    navLinks.forEach(l => {
        l.classList.remove('active');
        if(l.getAttribute('href') === hash || (hash === '' && l.getAttribute('href') === '#/capa')) {
            l.classList.add('active');
        }
    });
};

window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    setActiveLink(hash);
    loadPage(hash);
});

// Init
window.addEventListener('DOMContentLoaded', () => {
    const startHash = window.location.hash || '#/capa';
    setActiveLink(startHash);
    loadPage(startHash);
});
