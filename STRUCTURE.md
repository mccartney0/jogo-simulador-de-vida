# Estrutura do projeto

O jogo usa Vue 3 como moldura de interface, Pinia como estado reativo de UI, PixiJS como renderer isométrico e bitecs como ECS da simulação. O componente `src/app.vue` instancia `Game` dentro de um host de canvas e monta os painéis de HUD, construção, agente, tempo e notificações.

A simulação fica em `src/game/`. `Game.ts` coordena o mundo, o loop, os sistemas, entrada do canvas, pathfinding, salvamento e sincronização de necessidades. Os sistemas ECS cuidam de movimento, IA, interações, necessidades, animação, salas e renderização. `IsoRenderer.ts` desenha o piso e os sprites; `ObjectFactory.ts` coloca e remove objetos respeitando a ocupação do mapa; `ObjectSprites.ts` produz os visuais vetoriais dos objetos.

A rodada de melhoria preserva essa separação. O lote inicial será criado por `Game` através de `ObjectFactory`, a HUD e o onboarding serão componentes Vue, e os textos novos ficarão nos três catálogos de `src/game/data/locales/`. Não será introduzido um novo renderer nem uma camada de persistência incompatível com o protótipo.
