import os
import glob

def generate_css_section(title, files, path_prefix, width="100px", bradius="8px"):
    html = f"<h3 style='margin-top:2rem; color:var(--accent); font-family:Oswald;'>{title}</h3>"
    html += "<div style='display:flex; flex-wrap:wrap; gap:1rem; margin-top:1rem;'>"
    for f in files:
        bname = os.path.basename(f)
        nname = os.path.splitext(bname)[0].replace('RECEITA_ ', '')
        src = f"ELEMENTOS/{path_prefix}/{bname}"
        html += f"""
        <div class="glass-card element-grid-item" style="padding:10px; text-align:center; cursor:pointer;" onclick="window.openLightBoxImage('{src}')">
           <img src="{src}" style="width:{width}; height:auto; object-fit:contain; filter:drop-shadow(0px 5px 5px rgba(0,0,0,0.5)); border-radius:{bradius};">
           <span style="display:block; font-size:0.8rem; margin-top:10px; color:var(--fg);">{nname}</span>
        </div>"""
    html += "</div>"
    return html

# ----------------- RECURSOS.HTML -----------------
html_recursos = """<section id="recursos" class="page">
  <div class="page-header">
    <div class="page-kicker">Catálogo Oficial</div>
    <h1 class="page-title">Recursos &amp; Itens</h1>
    <p class="page-lead">Tudo que o grupo precisa para sobreviver nos quatro reinos.</p>
  </div>
"""

# Materiais
recursos_files = glob.glob(r"ELEMENTOS\TOKENS DO JOGO\TOKENS DE RECURSOS\*.png")
materiais = [f for f in recursos_files if "RECEITA" not in f and "CRISTAL" not in f and "DIAMANTE" not in f and "RUBI" not in f and "SAFIRA" not in f]
receitas = [f for f in recursos_files if "RECEITA" in f]

html_recursos += generate_css_section("Materiais de Coleta", materiais, "TOKENS DO JOGO/TOKENS DE RECURSOS", "60px")
html_recursos += generate_css_section("Culinária e Receitas", receitas, "TOKENS DO JOGO/TOKENS DE RECURSOS", "120px")

armas_files = glob.glob(r"ELEMENTOS\CARTAS DE ITENS\CARTAS_ARMAS_ARMADURAS\*.png")
html_recursos += generate_css_section("O Forjador (Armas e Armaduras)", armas_files, "CARTAS DE ITENS/CARTAS_ARMAS_ARMADURAS", "140px", "4px")

acampamento_files = glob.glob(r"ELEMENTOS\CARTAS DE ITENS\CARTAS_ACAMPAMENTO\*.png")
html_recursos += generate_css_section("Acampamento e Construções", acampamento_files, "CARTAS DE ITENS/CARTAS_ACAMPAMENTO", "140px", "4px")
html_recursos += "</section>"

with open("pages/recursos.html", "w", encoding="utf-8") as f: f.write(html_recursos)


# ----------------- PEDRAS.HTML -----------------
pedras_html = """<section id="pedras" class="page">
  <div class="page-header">
    <div class="page-kicker">Relíquias</div>
    <h1 class="page-title">Gemas Elementais</h1>
    <p class="page-lead">As pedras especiais da forja e amplificação.</p>
  </div>
"""
pedras_files = [f for f in recursos_files if ("CRISTAL" in f or "DIAMANTE" in f or "RUBI" in f or "SAFIRA" in f)]
pedras_html += generate_css_section("Pedras Preciosas", pedras_files, "TOKENS DO JOGO/TOKENS DE RECURSOS", "80px")
pedras_html += "</section>"

with open("pages/pedras.html", "w", encoding="utf-8") as f: f.write(pedras_html)


# ----------------- MECANICAS.HTML -----------------
mec_html = """<section id="mecanicas" class="page">
  <div class="page-header">
    <div class="page-kicker">O Sistema</div>
    <h1 class="page-title">Mecânicas</h1>
    <p class="page-lead">Clique nas cartas oficiais para ler as regras fundamentais do sistema de Ações.</p>
  </div>
"""
mec_files = glob.glob(r"ELEMENTOS\AÇÕES DOS JOGADORES\*.png")
mec_html += generate_css_section("Decks de Regras", mec_files, "AÇÕES DOS JOGADORES", "200px", "10px")
mec_html += "</section>"

with open("pages/mecanicas.html", "w", encoding="utf-8") as f: f.write(mec_html)

print("HTMLs Gerados!")

# ----------------- PERSONAGENS.HTML -----------------
with open("pages/personagens.html", "r", encoding="utf-8") as f:
    pers_html = f.read()

import re

# Map tabuleiros base
tabuleiros = {
  "Arthur Blackwood": "ELEMENTOS/PERSONAGENS/TABULEIRO DOS PERSONAGENS (FASE 1)/O_ESPADACHIM.png",
  "Dra. Elizabeth Bancroft": "ELEMENTOS/PERSONAGENS/TABULEIRO DOS PERSONAGENS (FASE 1)/A_MEDICA.png",
  "Morgan Huxley": "ELEMENTOS/PERSONAGENS/TABULEIRO DOS PERSONAGENS (FASE 1)/O_ESTUDIOSO.png",
  "Conde T. Wellington": "ELEMENTOS/PERSONAGENS/TABULEIRO DOS PERSONAGENS (FASE 1)/O_ARISTOCRATA.png",
  "Jack Timber": "ELEMENTOS/PERSONAGENS/TABULEIRO DOS PERSONAGENS (FASE 1)/O_LENHADOR.png",
  "Cassandra Vane": "ELEMENTOS/PERSONAGENS/TABULEIRO DOS PERSONAGENS (FASE 1)/A_MERCENARIA.png",
  "Ivy Hawthorne": "ELEMENTOS/PERSONAGENS/TABULEIRO DOS PERSONAGENS (FASE 1)/A_BOTANICA.png",
  "Helena Gearwright": "ELEMENTOS/PERSONAGENS/TABULEIRO DOS PERSONAGENS (FASE 1)/A_ENGENHEIRA.png"
}

def inject_board(match):
    full_card = match.group(0)
    name = match.group(2)
    board_src = tabuleiros.get(name, "")
    if board_src:
        btn = f'''<div style="margin-top:1rem; text-align:center;"><button onclick="window.openLightBoxImage('{board_src}')" style="background:var(--accent); color:var(--bg-dark); border:none; padding:10px 20px; font-family:Oswald; cursor:pointer; font-size:1.1rem; border-radius:4px; transition:0.3s;" onmouseover="this.style.boxShadow=\\'0 0 15px var(--accent)\\'" onmouseout="this.style.boxShadow=\\'none\\'">Ver Tabuleiro da Classe</button></div>'''
        return full_card.replace('</article>', btn + '\n</article>')
    return full_card
    
new_pers = re.sub(r'(<article class="char[^>]*>.*?<h3 class="char-name">([^<]+)</h3>.*?</article>)', inject_board, pers_html, flags=re.DOTALL)

with open("pages/personagens.html", "w", encoding="utf-8") as f:
    f.write(new_pers)
    
print("Personagens modificados!")
