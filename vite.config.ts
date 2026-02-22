import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'terser',
    rollupOptions: {
      // Configurações padrão otimizadas
      // Removemos 'external' para permitir que o Vite gerencie o bundle corretamente
    }
  },
  resolve: {
    // A ordem importa: .tsx primeiro resolve problemas de conflitos entre arquivos JS e TSX
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json']
  }
});