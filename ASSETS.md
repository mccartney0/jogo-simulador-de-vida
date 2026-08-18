# Assets

**Art direction:** cozy isometric 2.5D life simulation with crisp vector-like silhouettes, a deep navy backdrop, teal floor tiles, warm amber light accents, coral and gold props, and restrained detail that remains readable at small screen sizes. The scene should feel like a friendly starter lot rather than an empty editor.

## Reference

A visual target foi gerada durante a iteração para orientar o lote inicial: ela mostra um lote compacto, cores quentes de casa, árvore, canteiros, caminho, caixa de correio e agente centralizado. O binário não é versionado para manter o repositório leve; a cena equivalente foi implementada com desenhos vetoriais procedurais.

## Runtime asset strategy

The existing project draws objects procedurally with PixiJS `Graphics`. This iteration keeps that lightweight approach and translates the reference into a populated starter lot, richer floor treatment and clearer UI color tokens, avoiding large binary assets in the application bundle.
