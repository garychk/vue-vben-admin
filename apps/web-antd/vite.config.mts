import { defineConfig } from '@vben/vite-config';

const config = defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          // API代理（用于远程API和mock）
          '/api': {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // 后端服务器地址
            target: 'http://m.oplug.cn:44316',
            ws: true,
          },
        },
      },
    },
  };
});
export default config;
