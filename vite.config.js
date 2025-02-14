/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    pool: 'vmThreads',
    coverage: {
      provider: 'v8', // Провайдер покрытия (по умолчанию v8)
      reporter: ['text', 'lcov'], // Форматы отчётов
      reportsDirectory: './coverage', // Папка для хранения отчётов
    },
  },
});
