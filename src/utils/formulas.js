// // Fórmulas para salud
// exports.calcularSalud = (salario, tipo) => {
//     if (tipo === 'empleado') return salario * 0.04;
//     if (tipo === 'empleador') return salario >= 6200000 ? salario * 0.085 : 0;
//     return 0;
//   };
  
//   // Fórmulas para pensión
//   exports.calcularPension = (salario, tipo) => {
//     if (tipo === 'empleado') return salario * 0.04;
//     if (tipo === 'empleador') return salario * 0.12;
//     return 0;
//   };
  
//   // Fórmulas para prestaciones sociales
//   exports.calcularPrestaciones = (salario, tipoSalario) => {
//     if (tipoSalario !== 'ordinario') return null;
  
//     const primaServicios = salario * 0.0833;
//     const cesantias = salario * 0.0833;
//     const interesesCesantias = cesantias * 0.12;
//     const vacaciones = salario * 0.0417;
  
//     return {
//       primaServicios,
//       cesantias,
//       interesesCesantias,
//       vacaciones,
//     };
//   };

// const SALARIO_MINIMO = 1423500;
// const SMLMV_4 = 5694000;
// const SMLMV_10 = 14235000;
// const AUX_TRANSPORTE = 200000;


// // calcular auxilio de transporte 
// const calcularAuxilioTransporte = (salarioBase) => {
//   return salarioBase < 2 * SALARIO_MINIMO ? AUX_TRANSPORTE : 0;
// };

// // calcular retencion en la fuente
// const calcularRetencion = (salarioBase) => {
//   return salarioBase >= SMLMV_4 ? salarioBase * 0.10 : 0; // 10% si es >= a 4 SMLMV
// }
  
// // Calcular aportes de salud
// const calcularSalud = (salarioBase, tipo) => {
//     const porcentaje = tipo === 'empleado' ? 0.04 : 0.085; // 4% empleado, 8.5% empleador
//     return salarioBase * porcentaje;
//   };
  
//   // Calcular aportes de pensión
//   const calcularPension = (salarioBase, tipo) => {
//     const porcentaje = tipo === 'empleado' ? 0.04 : 0.12; // 4% empleado, 12% empleador
//     return salarioBase * porcentaje;
//   };
  
//   // Calcular aportes parafiscales
//   const calcularParafiscales = (salarioBase) => {
//     const sena = salarioBase * 0.02; // SENA (2%)
//     const icbf = salarioBase * 0.03; // ICBF (3%)
//     const cajaCompensacion = salarioBase * 0.04; // Caja de compensación (4%)
//     return { sena, icbf, cajaCompensacion };
//   };
  
//   // Calcular prestaciones sociales desglosadas
//   const calcularPrestaciones = (salarioBase, tipoSalario) => {
//     if (tipoSalario === 'ordinario' || tipoSalario === 'medio tiempo') {
//       const primaServicios = salarioBase * 0.0833; // 8.33%
//       const cesantias = salarioBase * 0.0833; // 8.33%
//       const interesesCesantias = cesantias * 0.01; // 1% anual (proporcional mensual)
//       const vacaciones = salarioBase * 0.0417; // 4.17%
//       return { primaServicios, cesantias, interesesCesantias, vacaciones };
//     }
//     return { primaServicios: 0, cesantias: 0, interesesCesantias: 0, vacaciones: 0 };
//   };
  
//   module.exports = { calcularSalud, calcularPension, calcularParafiscales, calcularPrestaciones, calcularAuxilioTransporte, calcularRetencion,  };
  

// Constantes
const SALARIO_MINIMO = 1423500;
const SMLMV_4 = 5694000;
const SMLMV_10 = 14235000;
const AUX_TRANSPORTE = 200000;

// Calcular auxilio de transporte
const calcularAuxilioTransporte = (salarioBase) => {
  return salarioBase < 2 * SALARIO_MINIMO ? AUX_TRANSPORTE : 0;
};

// Calcular retención en la fuente
const calcularRetencion = (salarioBase) => {
  return salarioBase >= SMLMV_10 ? salarioBase * 0.10 : 0; // 10% si es >= 4 SMLMV
};

// Calcular aportes de salud
const calcularSalud = (salarioBase, tipo) => {
  const porcentaje = tipo === 'empleado' ? 0.04 : 0.085; // 4% empleado, 8.5% empleador
  return salarioBase * porcentaje;
};

// Calcular aportes de pensión
const calcularPension = (salarioBase, tipo) => {
  const porcentaje = tipo === 'empleado' ? 0.04 : 0.12; // 4% empleado, 12% empleador
  return salarioBase * porcentaje;
};

// Calcular aportes parafiscales
const calcularParafiscales = (salarioBase) => {
  const sena = salarioBase * 0.02; // SENA (2%)
  const icbf = salarioBase * 0.03; // ICBF (3%)
  const cajaCompensacion = salarioBase * 0.04; // Caja de compensación (4%)
  return { sena, icbf, cajaCompensacion };
};

// Calcular prestaciones sociales desglosadas
const calcularPrestaciones = (salarioBase, tipoSalario) => {
  if (tipoSalario === 'ordinario' || tipoSalario === 'medio tiempo') {
    const primaServicios = salarioBase * 0.0833; // 8.33%
    const cesantias = salarioBase * 0.0833; // 8.33%
    const interesesCesantias = cesantias * 0.01; // 1% anual (proporcional mensual)
    const vacaciones = salarioBase * 0.0417; // 4.17%
    return { primaServicios, cesantias, interesesCesantias, vacaciones };
  }
  return { primaServicios: 0, cesantias: 0, interesesCesantias: 0, vacaciones: 0 };
};

module.exports = {
  calcularSalud,
  calcularPension,
  calcularParafiscales,
  calcularPrestaciones,
  calcularAuxilioTransporte,
  calcularRetencion,
};
