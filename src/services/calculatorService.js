// services/calculatorService.js
const constants = {
    salarioMinimo: 1423500,
    auxilioDeTransporte: 200000
  };
  
  const calculateSalaryDetails = ({
    tipoSalario,
    salario,
    otrosPagosSalariales,
    otrosPagosNoSalariales,
    auxilioTransporte,
    auxilioAlimentacion,
    pensionado
  }) => {
  
  
    const totalRemuneracion = calculateTotalRemuneracion(tipoSalario, salario, otrosPagosSalariales, otrosPagosNoSalariales, auxilioAlimentacion);
    const cuarentaPorciento = totalRemuneracion * 0.4;
    const excedente = calculateExcedente(otrosPagosNoSalariales, auxilioAlimentacion, cuarentaPorciento);
    const ibc = calculateIBC(tipoSalario, salario, otrosPagosSalariales, excedente);
    
    const seguridadSocial = calculateSeguridadSocial(ibc, salario, otrosPagosSalariales, pensionado);
    const prestacionesSociales = calculatePrestacionesSociales(tipoSalario, salario, otrosPagosSalariales, auxilioTransporte);
    const proyecciones = calculateProyecciones(seguridadSocial, prestacionesSociales, salario, otrosPagosSalariales, otrosPagosNoSalariales, auxilioTransporte, auxilioAlimentacion);
  
    return {
      totalRemuneracion,
      cuarentaPorciento,
      excedente,
      ibc,
      seguridadSocial,
      prestacionesSociales,
      proyecciones,
    };
  };
  
  function calculateTotalRemuneracion(tipoSalario, salario, otrosPagosSalariales, otrosPagosNoSalariales, auxilioAlimentacion) {
    return tipoSalario === 'integral'
      ? otrosPagosSalariales + otrosPagosNoSalariales + auxilioAlimentacion + (salario * 0.7)
      : salario + otrosPagosNoSalariales + otrosPagosSalariales + auxilioAlimentacion;
  }
  
  function calculateExcedente(otrosPagosNoSalariales, auxilioAlimentacion, cuarentaPorciento) {
    return otrosPagosNoSalariales + auxilioAlimentacion - cuarentaPorciento > 0
      ? otrosPagosNoSalariales + auxilioAlimentacion - cuarentaPorciento
      : 0;
  }
  
  function calculateIBC(tipoSalario, salario, otrosPagosSalariales, excedente) {
    if (tipoSalario === 'ordinario') {
      return otrosPagosSalariales + salario + excedente;
    } else if (tipoSalario === 'integral') {
      return ((salario + otrosPagosSalariales) * 0.7) + excedente;
    } else if (tipoSalario === 'medio tiempo') {
      return constants.salarioMinimo;
    }
    return 0;
  }
  
  function calculateFSPPercentage(ibc) {
    const ratio = ibc / constants.salarioMinimo;
    if (ratio >= 4 && ratio < 16) return 0.01;
    if (ratio >= 16 && ratio <= 17) return 0.012;
    if (ratio > 17 && ratio <= 18) return 0.014;
    if (ratio > 18 && ratio <= 19) return 0.016;
    if (ratio > 19 && ratio <= 20) return 0.018;
    if (ratio > 20) return 0.02;
    return 0;
  }
  
  function calculateSeguridadSocial(ibc, salario, otrosPagosSalariales, pensionado) {
    const diezSMLMV = constants.salarioMinimo * 10;
    const porcentajeFSP = calculateFSPPercentage(ibc);
  
    return {
      saludTrabajador: ibc * 0.04,
      saludEmpleador: Math.round(salario + otrosPagosSalariales >= diezSMLMV ? 0.085 * ibc : 0),
      pensionTrabajador: pensionado === 'No' ? ibc * 0.04 : 0,
      pensionEmpleador: pensionado === 'No' ? ibc * 0.12 : 0,
      FSP: pensionado === 'No' ? ibc * porcentajeFSP : 0,
      riesgosLaborales: Math.ceil(ibc * 0.00522),
      sena: (salario + otrosPagosSalariales) >= diezSMLMV ? (salario + otrosPagosSalariales) * 0.02 : 0,
      icbf: (salario + otrosPagosSalariales) >= diezSMLMV ? (salario + otrosPagosSalariales) * 0.03 : 0,
      cajaCompensacion: (salario + otrosPagosSalariales) * 0.04
    };
  }
  
  function calculatePrestacionesSociales(tipoSalario, salario, otrosPagosSalariales, auxilioTransporte) {
    if (tipoSalario === 'integral') {
      return {
        primaServicios: 0,
        cesantias: 0,
        interesesCesantias: 0,
        vacaciones: (salario + otrosPagosSalariales) * 0.0417
      };
    }
  
    const basePrestacional = salario + otrosPagosSalariales + auxilioTransporte;
    const cesantias = basePrestacional * 0.0833;
  
    return {
      primaServicios: basePrestacional * 0.0833,
      cesantias,
      interesesCesantias: Math.round(cesantias * 0.12),
      vacaciones: (salario + otrosPagosSalariales) * 0.0417
    };
  }
  
  function calculateProyecciones(seguridadSocial, prestacionesSociales, salario, otrosPagosSalariales, otrosPagosNoSalariales, auxilioTransporte, auxilioAlimentacion) {
    const provisionesPrestacionesSociales = Math.round(
      prestacionesSociales.primaServicios +
      prestacionesSociales.cesantias +
      prestacionesSociales.interesesCesantias +
      prestacionesSociales.vacaciones
    );
  
    const aportesEmpleador = Math.round(
      seguridadSocial.saludEmpleador +
      seguridadSocial.pensionEmpleador +
      seguridadSocial.riesgosLaborales +
      seguridadSocial.sena +
      seguridadSocial.icbf +
      seguridadSocial.cajaCompensacion
    );
  
    const aportesTrabajador = 
      seguridadSocial.saludTrabajador +
      seguridadSocial.pensionTrabajador +
      seguridadSocial.FSP;
  
    const retencionFuente = 0
  
    const pagoNetoTrabajador = 
      salario +
      otrosPagosSalariales +
      otrosPagosNoSalariales +
      auxilioAlimentacion +
      auxilioTransporte -
      aportesTrabajador -
      retencionFuente;
  
    const costoTotalEmpleador =
      salario +
      otrosPagosSalariales +
      otrosPagosNoSalariales +
      auxilioTransporte +
      provisionesPrestacionesSociales +
      aportesEmpleador +
      auxilioAlimentacion;
  
    const totalPagar = pagoNetoTrabajador + aportesTrabajador + aportesEmpleador;
  
    return {
      provisionesPrestacionesSociales,
      aportesEmpleador,
      aportesTrabajador,
      retencionFuente,
      pagoNetoTrabajador,
      costoTotalEmpleador,
      totalPagar,
    };
  }
  
  module.exports = {
    calculateSalaryDetails
  };