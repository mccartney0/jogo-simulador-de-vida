# Inspeção inicial do Life Sim

## Estado observado

- O projeto é um protótipo em Vue 3 + PixiJS + Pinia + bitecs, dentro de `life-sim/`.
- A página inicia sem erros visíveis e mostra uma grade isométrica ampla, HUD no canto superior esquerdo, painel do agente no canto superior direito e controles de tempo no rodapé.
- A cena inicial está visualmente vazia: não há lote decorado, móveis, casa, avatar ou objetivo destacado no primeiro enquadramento.
- A HUD mostra seis necessidades, orçamento e horário, mas as barras são todas muito parecidas e não exibem valores numéricos nem estado textual.
- O botão Build/Buy abre uma paleta no canto inferior direito com busca, categorias e quatro objetos visíveis: Bed, Sofa, Table e Door.
- O modo de construção está funcional no nível básico, mas a paleta e os controles ficam comprimidos em viewport de aproximadamente 893x768.
- Os textos exibidos estão em inglês apesar de existir locale `pt.json`; a interface não oferece uma troca de idioma visível.
- A documentação lista como próximos passos: múltiplos agentes/relacionamentos, paredes/janelas/portas, presets de lote, editor de cômodos e photo mode.

## Prioridade sugerida

A maior melhoria de impacto imediato é transformar a cena vazia em um lote inicial acolhedor e legível, com identidade visual, objetivos/guias de início e feedback de necessidades mais claro, sem reescrever o motor existente. Em paralelo, vale melhorar a HUD responsiva e tornar o primeiro uso mais autoexplicativo.

## Verificação visual após a implementação

- A interface inicia em português, com HUD redesenhada exibindo hora, dia, fundos, percentuais e estado textual de cada necessidade.
- O onboarding aparece como um painel central dispensável e oferece CTA direto para Construir/Comprar, além de uma opção para explorar sozinho.
- O lote inicial agora aparece com um tapete verde destacado, caminho de terra, árvores, canteiros, vasos e caixa de correio. Ao fechar o guia, cama, sofá, mesa, eletrodomésticos, banheiro e porta aparecem no centro do lote, e o agente fica visível próximo à cama.
- Os controles de tempo exibem o estado ativo e alternam o rótulo entre Pausar e Reproduzir.
- O teste E2E passou após tornar os seletores compatíveis com o idioma padrão em português.

A paleta Build/Buy continua acessível após fechar o guia, com busca, categorias e catálogo em português. A inspeção do console não mostrou saídas ou exceções runtime.
