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
    pensionado,
    deducciones = 0,
    retencionFuente = 0
  }) => {
    
    const auxilioTransporte = tipoSalario !== 'integral' && salario >= (constants.salarioMinimo * 2) 
    ? constants.auxilioDeTransporte 
    : 0;

    const totalRemuneracion = calculateTotalRemuneracion(tipoSalario, salario, otrosPagosSalariales, otrosPagosNoSalariales, );
    const cuarentaPorciento = totalRemuneracion * 0.4;
    const excedente = calculateExcedente(otrosPagosNoSalariales, cuarentaPorciento);
    const ibc = calculateIBC(tipoSalario, salario, otrosPagosSalariales, excedente);
    
    const seguridadSocial = calculateSeguridadSocial(ibc, salario, otrosPagosSalariales, pensionado,excedente);
    const prestacionesSociales = calculatePrestacionesSociales(tipoSalario, salario, otrosPagosSalariales, auxilioTransporte);
    const proyecciones = calculateProyecciones(seguridadSocial, prestacionesSociales, salario, otrosPagosSalariales, otrosPagosNoSalariales, auxilioTransporte,deducciones,retencionFuente);
  
    return {
      totalRemuneracion,
      cuarentaPorciento,
      seguridadSocial,
      prestacionesSociales,
      proyecciones,
    };
  };
  
  function calculateTotalRemuneracion(tipoSalario, salario, otrosPagosSalariales, otrosPagosNoSalariales) {
    return tipoSalario === 'integral'
      ? otrosPagosSalariales + otrosPagosNoSalariales + (salario * 0.7)
      : salario + otrosPagosNoSalariales + otrosPagosSalariales;
  }
  
  function calculateExcedente(otrosPagosNoSalariales, cuarentaPorciento) {
    return otrosPagosNoSalariales - cuarentaPorciento > 0
      ? otrosPagosNoSalariales - cuarentaPorciento
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
  
  function calculateSeguridadSocial(ibc, salario, otrosPagosSalariales, pensionado,excedente) {
    const diezSMLMV = constants.salarioMinimo * 10;
    const porcentajeFSP = calculateFSPPercentage(ibc);
  
    return {
      saludTrabajador: ibc * 0.04,
      excedente,
      ibc,
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
  
  function calculateProyecciones(seguridadSocial, prestacionesSociales, salario, otrosPagosSalariales, otrosPagosNoSalariales, auxilioTransporte,deducciones, retencionFuente) {
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
  
   
  
    const pagoNetoTrabajador = 
      salario +
      otrosPagosSalariales +
      otrosPagosNoSalariales +
      auxilioTransporte -
      aportesTrabajador -
      retencionFuente -
      deducciones;
  
    const costoTotalEmpleador =
      salario +
      otrosPagosSalariales +
      otrosPagosNoSalariales +
      auxilioTransporte +
      provisionesPrestacionesSociales +
      aportesEmpleador;
  
    const totalPagar = pagoNetoTrabajador + aportesTrabajador + aportesEmpleador;
  
    return {
      provisionesPrestacionesSociales,
      aportesEmpleador,
      aportesTrabajador,
      retencionFuente,
      pagoNetoTrabajador,
      costoTotalEmpleador,
      totalPagar,
      deducciones,
      retencionFuente,
      auxilioTransporte
    };
  }
  
  module.exports = {
    calculateSalaryDetails
  };