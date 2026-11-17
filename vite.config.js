import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/color-palette-explorer/' : '/',
  plugins: [{
    name: 'manual-refresh',
    configureServer(server) {
      const send = server.ws.send.bind(server.ws);
      server.ws.send = (...args) => {
        const type = typeof args[0] === 'string' ? args[0] : args[0]?.type;
        if (type !== 'full-reload' && type !== 'update') send(...args);
      };
    },
  }],
  server: { hmr: false },
}));
