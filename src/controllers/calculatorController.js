// controllers/calculatorController.js
const calculatorService = require('../services/calculatorService');

const calculateSalary = (req, res) => {
  const {
    tipoSalario,
    salario,
    otrosPagosSalariales,
    otrosPagosNoSalariales,
    pensionado,
    deducciones,
    retencionFuente,
    exonerado,
    claseRiesgo
  } = req.body;

  const result = calculatorService.calculateSalaryDetails({
    tipoSalario,
    salario,
    otrosPagosSalariales,
    otrosPagosNoSalariales,
    pensionado,
    deducciones,
    retencionFuente,
    exonerado,
    claseRiesgo
  });

  res.json(result);
};

module.exports = {
  calculateSalary
};