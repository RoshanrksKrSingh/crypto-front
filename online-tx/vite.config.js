export default {
  server: {
    proxy: {
      '/api': {
        target: 'https://onlinetxmanag.onrender.com',
        changeOrigin: true,
        secure: false,
      },
       build: {
    outDir: "dist", 
  },
    },
  },
};
