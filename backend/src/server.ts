import app from './app.js';

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

const start = async () => {
  try {
    await app.listen({ port: Number(PORT), host: HOST });
    console.log(`Server is running on http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start(); 