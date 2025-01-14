// const { calcularSalud, calcularPension, calcularPrestaciones } = require('../utils/formulas.js');

// exports.realizarCalculo = (req, res) => {
//   try {
//     const { salario, auxTransporte, auxAlimentacion, retencion, tipoSalario } = req.body;

//     // Validar entrada
//     if (!salario || typeof salario !== 'number') {
//       return res.status(400).json({ error: 'El salario es requerido y debe ser un número.' });
//     }

//     // Cálculos
//     const saludEmpleado = calcularSalud(salario, 'empleado');
//     const saludEmpleador = calcularSalud(salario, 'empleador');
//     const pensionEmpleado = calcularPension(salario, 'empleado');
//     const pensionEmpleador = calcularPension(salario, 'empleador');
//     const prestaciones = calcularPrestaciones(salario, tipoSalario);

//     const totalDeducciones = saludEmpleado + pensionEmpleado + retencion;
//     const salarioNeto = salario - totalDeducciones;

//     const resultado = {
//       saludEmpleado,
//       saludEmpleador,
//       pensionEmpleado,
//       pensionEmpleador,
//       prestaciones,
//       totalDeducciones,
//       salarioNeto,
//     };

//     res.json(resultado);
//   } catch (error) {
//     res.status(500).json({ error: 'Ocurrió un error al realizar el cálculo.' });
//   }
// };

// ----------------------------------------------

const { calcularSalud, calcularPension, calcularParafiscales, calcularPrestaciones, calcularAuxilioTransporte, calculaRteen } = require('../utils/formulas');

exports.realizarCalculo = (req, res) => {
  try {
    const { salario, auxTransporte, auxAlimentacion, retencion, tipoSalario } = req.body;

    // Validar entrada
    if (!salario || typeof salario !== 'number') {
      return res.status(400).json({ error: 'El salario es requerido y debe ser un número.' });
    }

    // Cálculos de seguridad social
    const saludEmpleado = calcularSalud(salario, 'empleado');
    const saludEmpleador = calcularSalud(salario, 'empleador');
    const pensionEmpleado = calcularPension(salario, 'empleado');
    const pensionEmpleador = calcularPension(salario, 'empleador');

    // Cálculos de parafiscales
    const parafiscales = calcularParafiscales(salario);

    // Cálculos de prestaciones sociales
    const prestaciones = calcularPrestaciones(salario, tipoSalario);

    // Total deducciones y salario neto
    const totalDeducciones = saludEmpleado + pensionEmpleado + retencion;
    const salarioNeto = salario - totalDeducciones;

    // Resultado final
    const resultado = {
      salud: { empleado: saludEmpleado, empleador: saludEmpleador },
      pension: { empleado: pensionEmpleado, empleador: pensionEmpleador },
      parafiscales,
      prestaciones,
      totalDeducciones,
      salarioNeto,
    };

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Ocurrió un error al realizar el cálculo.' });
  }
};

// const { calcularSalud, calcularPension, calcularParafiscales, calcularPrestaciones } = require('../utils/formulas');

// const calcularTotalRemuneracion = (tipoSalario, salario, otrosPagosSal, otrosPagosNoSal, auxAlimentacion, auxTransporte) => {
//   if (tipoSalario === 'Integral') {
//     return salario + otrosPagosSal + otrosPagosNoSal + auxAlimentacion + salario * 0.7;
//   } else {
//     return salario + otrosPagosSal + otrosPagosNoSal + auxAlimentacion + auxTransporte;
//   }
// };

// const calcularCuarentaPorciento = (totalRemuneracion) => totalRemuneracion * 0.4;

// const calcularExcedente = (otrosPagosNoSal, auxTransporte, cuarentaPorciento) => {
//   const excedente = otrosPagosNoSal + auxTransporte - cuarentaPorciento;
//   return excedente > 0 ? excedente : 0;
// };

// const calcularIBC = (tipoSalario, salario, otrosPagosSal, auxAlimentacion) => {
//   if (tipoSalario === 'Ordinario') {
//     return salario + otrosPagosSal + auxAlimentacion;
//   } else if (tipoSalario === 'Integral') {
//     return (salario + otrosPagosSal) * 0.7 + auxAlimentacion;
//   } else if (tipoSalario === 'Medio tiempo') {
//     return salario; // Según la fórmula, utiliza salario mínimo o específico.
//   }
//   return 0; // Si no aplica, retorna 0.
// };

// exports.realizarCalculo = (req, res) => {
//   try {
//     const {
//       tipoSalario,
//       salario,
//       otrosPagosSal,
//       otrosPagosNoSal,
//       auxAlimentacion,
//       auxTransporte,
//       retencion,
//     } = req.body;

//     // Validar entrada
//     if (!salario || typeof salario !== 'number') {
//       return res.status(400).json({ error: 'El salario es requerido y debe ser un número.' });
//     }

//     // Calcular total remuneración
//     const totalRemuneracion = calcularTotalRemuneracion(
//       tipoSalario,
//       salario,
//       otrosPagosSal,
//       otrosPagosNoSal,
//       auxAlimentacion,
//       auxTransporte
//     );

//     // Calcular 40% de la total remuneración
//     const cuarentaPorciento = calcularCuarentaPorciento(totalRemuneracion);

//     // Calcular excedente
//     const excedente = calcularExcedente(otrosPagosNoSal, auxTransporte, cuarentaPorciento);

//     // Calcular IBC
//     const ibc = calcularIBC(tipoSalario, salario, otrosPagosSal, auxAlimentacion);

//     // Cálculos de seguridad social y prestaciones
//     const saludEmpleado = calcularSalud(ibc, 'empleado');
//     const saludEmpleador = calcularSalud(ibc, 'empleador');
//     const pensionEmpleado = calcularPension(ibc, 'empleado');
//     const pensionEmpleador = calcularPension(ibc, 'empleador');
//     const parafiscales = calcularParafiscales(ibc);
//     const prestaciones = calcularPrestaciones(ibc, tipoSalario);

//     // Total deducciones y salario neto
//     const totalDeducciones = saludEmpleado + pensionEmpleado + retencion;
//     const salarioNeto = salario - totalDeducciones;

//     // Resultado final
//     const resultado = {
//       totalRemuneracion,
//       cuarentaPorciento,
//       excedente,
//       ibc,
//       salud: { empleado: saludEmpleado, empleador: saludEmpleador },
//       pension: { empleado: pensionEmpleado, empleador: pensionEmpleador },
//       parafiscales,
//       prestaciones,
//       totalDeducciones,
//       salarioNeto,
//     };

//     res.json(resultado);
//   } catch (error) {
//     res.status(500).json({ error: 'Ocurrió un error al realizar el cálculo.' });
//   }
// };