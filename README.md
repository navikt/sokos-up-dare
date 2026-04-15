# sokos-up-dare
Dette er en (mikro)frontendf i Utbetalingsportalen for å teste beregning av oppdrag i moderniseringsprosjektet.

## Kom i gang

1. Installere [Node.js](https://nodejs.dev/en/)
2. Installer [pnpm](https://pnpm.io/)
3. Installere dependencies `pnpm install && cd server && pnpm install`
4. Start appen med to følgende måter:

- Mot [Mock Service Worker](https://mswjs.io/) mock server -> `pnpm run dev`
- Mot en backend kjørende i dev -> `pnpm run dev:backend`
- Mot en backend kjørende lokalt på utviklermaskin -> `pnpm run dev:local`
  - Gå til [vite.config.ts](/vite.config.ts), endre til riktig url som skal gå mot backend.

```javascript
...(mode === "backend" && {
        "/mikrofrontend-api/api/v1": {
          target: "http://localhost:8080",
          rewrite: (path: string) => path.replace(/^\/mikrofrontend-api/, ""),
          changeOrigin: true,
          secure: false,
        },
      })
```
