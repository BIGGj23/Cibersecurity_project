// connection.js

const ENV = "local"; // ou "render"

const urls = {
  local: "http://localhost:3000",
  render: "https://protecnet.onrender.com"
};

// Disponibiliza globalmente
window.API_BASE_URL = urls[ENV];
