require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.CORS_ORIGIN || '*'
  },
  // Añade aquí otras variables de configuración según necesites
  salarioMinimo: 1423500,
  auxilioDeTransporte: 200000
};

module.exports = config;