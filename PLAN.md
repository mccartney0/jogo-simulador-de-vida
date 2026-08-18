# Plano de evolução do Life Sim

## Objetivo

Transformar o protótipo em uma primeira experiência jogável mais acolhedora: o jogador deve iniciar em um lote legível, entender suas necessidades e receber orientação clara para construir e controlar o tempo, sem abandonar o motor PixiJS/ECS existente.

## Escopo desta rodada

A implementação prioriza quatro melhorias de alto impacto e baixo risco. A primeira é um lote inicial decorado com um pequeno conjunto de objetos essenciais, organizados ao redor do agente para que a cena deixe de parecer vazia. A segunda é uma HUD mais informativa, com valores numéricos, estados de necessidade e hierarquia visual consistente. A terceira é um painel de onboarding que explica os três primeiros passos do jogo e pode ser dispensado. A quarta é ativar português do Brasil por padrão, mantendo inglês e espanhol disponíveis como fallback.

## Riscos e fatias de trabalho

| Fatia | Risco | Critério de sucesso |
| --- | --- | --- |
| Lote inicial | Ocupar tiles importantes e bloquear o agente | O agente inicia em área livre, consegue receber comandos e o pathfinding continua respondendo |
| HUD de necessidades | Barra ou texto ficar ilegível em telas menores | Valores e estado ficam claros em viewport desktop e estreito, sem cobrir o canvas inteiro |
| Onboarding | Painel competir com controles de jogo | O painel é dispensável, não bloqueia o canvas e explica Build/Buy, clique no mapa e velocidade |
| Localização | Chaves novas ausentes em algum idioma | PT-BR, inglês e espanhol carregam sem warnings e a interface inicia em português |

## Verificação

Executar `npm run typecheck`, `npm run lint`, `npm run build` e os testes existentes. Abrir a aplicação em viewport desktop e verificar o lote inicial, o painel, a HUD, a construção, a pausa e o zoom. Confirmar que o modo Build/Buy continua permitindo colocar e remover objetos e que a cena continua funcionando após recarregar.
