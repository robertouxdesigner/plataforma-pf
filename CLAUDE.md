# Plataforma PF

## Padrão estético: Design System Frontline (Polícia Federal)
Toda UI (HTML/CSS/React/Angular) deve seguir o Frontline. Referência completa: `designsystem.md`.
Para criar/alterar telas e componentes, use a skill `frontend-design` — **sempre aplicando os tokens abaixo**, sem inventar paleta, fonte ou espaçamento próprios.

### Cores (usar como CSS variables / tokens)
- Preto: `#111213` (PF-Black), `#2A2A2A`, `#373C42`
- Dourado (marca): 700 `#856404`, 600 `#C19515`, 500 `#E1AD62`, 400 `#F2B64E`, 300 `#F7CE68`, 200 `#FFEBB9`, 100 `#FFF8E3`
- Azul (ação/links): 700 `#0F4B8B`, 600 `#1F628D`, 500 `#3363CC`, 400 `#367ECC`, 300 `#78ABE0`, 200 `#A1C6ED`, 100 `#CFDBE8`
- Cinza: 700 `#41434E`, 600 `#555868`, 500 `#6A6D7C`, 400 `#8E919F`, 300 `#BDBEC3`, 200 `#DADADD`, 100 `#ECEDEE`
- Verde (sucesso): 700 `#3C6841`, 600 `#287831`, 500 `#33A841`, 400 `#2DC73F`, 300 `#8CC89D`, 200 `#BAE2B8`, 100 `#DDECDC`
- Vermelho (erro): 700 `#6E363B`, 600 `#921F2A`, 500 `#BF0C1D`, 400 `#D85965`, 300 `#DD959C`, 200 `#E5C0C3`, 100 `#F8E8EA`
- Componentes consomem tokens semânticos (`--color-action-primary`, `--color-error`…), nunca hex direto.
- Não depender só de cor para comunicar estado; manter contraste suficiente.

### Tipografia
- Fonte: **Roboto**.
- H1 36px · H2 30px · H3 24px · H4 20px · H5 16px · H6 12px. Um único H1 por página.
- Corpo 14/16px; Small 12/16px; cabeçalho de tabela e labels de menu em Roboto Medium 14px; versão no rodapé 10/12px.
- Evitar texto em caixa alta em headers, menus e botões.

### Espaçamento e grid
- Grid base de **8px**: usar múltiplos de 8 (8, 16, 24, 32, 40, 48, 56, 64…).
- Formulários: Label→Input 8px · Campo→Campo 16px · Linha→Linha 32px · Checkbox/Radio horizontal 24px, vertical 16px.
- Até 12 colunas, gutter 8px. Container de formulário máx. 1200px; abaixo de 768px, sem borda/sombra e 100% de largura.
- Breakpoints: 576 / 768 / 992 / 1200px. Mínimo garantido: 360px.

### Componentes e ícones
- Ícones: FontAwesome / PrimeIcons, uma ação por ícone, consistente entre telas.
- Button: estados Default, Hover, Focus, Active, Disabled, Loading; uma única ação → botão primário.
- Inputs ≥ 120px; Label obrigatório (placeholder só complementa); Badge ≤ 6 cores; Tooltip só para texto curto.
- Estados globais: Default, Hover, Focus, Active, Selected, Disabled, Loading, Error, Success, Warning, Empty, Read Only.

### Regras de ouro
1. Tokens > valores soltos. 2. Consistência > criatividade. 3. Acessibilidade (contraste, foco, labels) sempre. 4. Responsivo de 360px a 1200px.

## Convenções
- Idioma: português (código e nomes técnicos em inglês).
- Faça apenas o que foi pedido; respostas curtas e diretas.
