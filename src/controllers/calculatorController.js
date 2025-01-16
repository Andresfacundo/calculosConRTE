// controllers/calculatorController.js
const calculatorService = require('../services/calculatorService');

const calculateSalary = (req, res) => {
  const {
    tipoSalario,
    salario,
    otrosPagosSalariales,
    otrosPagosNoSalariales,
    auxilioTransporte,
    auxilioAlimentacion,
    pensionado
  } = req.body;

  const result = calculatorService.calculateSalaryDetails({
    tipoSalario,
    salario,
    otrosPagosSalariales,
    otrosPagosNoSalariales,
    auxilioTransporte,
    auxilioAlimentacion,
    pensionado
  });

  res.json(result);
};

module.exports = {
  calculateSalary
};