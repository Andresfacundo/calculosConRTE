// server.js
const express = require("express");
const cors = require("cors");
const calculatorRoutes = require("./src/routes/calculatorRoutes");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors({
    origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/api', (req, res) =>{
    res.json({message: 'Server is running'})
});

app.use("/api", calculatorRoutes);

app.listen(PORT, '0.0.0.0',() => {
    console.log(`Servidor corriendo en port: ${PORT}`);
    
});

module.exports =  app ;
