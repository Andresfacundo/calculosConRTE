// server.js
const express = require("express");
const cors = require("cors");
const calculatorRoutes = require("./routes/calculatorRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api", calculatorRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    
});

module.exports = { app, PORT };