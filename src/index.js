const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para manejar JSON
app.use(express.json());


// Endpoint para calcular datos salariales
app.post('/calculate', (req, res) => {
  const {
    tipoSalario,
    salario,
    otrosPagosSalariales,
    otrosPagosNoSalariales,
    auxilioTransporte,
    auxilioAlimentacion,
    pensionado,
  } = req.body;
  
  const salarioMinimo = 1423500;
  const cuatroSMLMV = 5694000;
  const diezSMLMV = 14235000;
  const auxilioDeTransporte = 200000;

  // Cálculos básicos
  const totalRemuneracion = tipoSalario === 'Integral'
    ? otrosPagosSalariales + otrosPagosNoSalariales + auxilioAlimentacion + (salario * 0.7)
    : salario + otrosPagosSalariales + otrosPagosNoSalariales + auxilioAlimentacion; 

  const cuarentaPorciento = totalRemuneracion * 0.4;
  const excedente = Math.max(0, otrosPagosSalariales + otrosPagosNoSalariales - cuarentaPorciento);

  const ibc = tipoSalario === 'Ordinario'
    ? salario + otrosPagosSalariales
    : tipoSalario === 'Integral'
      ? salario * 0.7 + otrosPagosSalariales
      : salario;


  // Seguridad social y parafiscales
  const saludEmpleador = (salario + otrosPagosSalariales >= diezSMLMV)
    ? ibc * 0.085 : 0;

  const saludTrabajador = ibc * 0.04;

  const pensionTrabajador = pensionado === 'No' ? ibc * 0.04 : 0;
  const pensionEmpleador = pensionado === 'No' ? ibc * 0.12 : 0;
  const riesgosLaborales = ibc * 0.00522;
  const sena = ibc >= diezSMLMV ? ibc * 0.02 : 0;
  const icbf = ibc >= diezSMLMV ? ibc * 0.03 : 0;
  const cajaCompensacion = ibc * 0.04;


  // Prestaciones sociales
  const primaServicios = tipoSalario !== 'Integral' ? (salario + auxilioTransporte) * 0.0833 : 0;
  const cesantias = tipoSalario !== 'Integral' ? (salario + auxilioTransporte) * 0.0833 : 0;
  const interesesCesantias = cesantias * 0.12;
  const vacaciones = tipoSalario !== 'Integral' ? salario * 0.0417 : 0;

  // Proyecciones mensuales y diarias
  const provisionesPrestacionesSociales = primaServicios + cesantias + interesesCesantias + vacaciones;
  const aportesEmpleador = saludEmpleador + pensionEmpleador + riesgosLaborales + sena + icbf + cajaCompensacion;
  const aportesTrabajador = saludTrabajador + pensionTrabajador;
  const retencionFuente = 2000000; // Valor fijo según la información

  const pagoNetoTrabajador =
    salario + otrosPagosSalariales + otrosPagosNoSalariales + auxilioDeTransporte + auxilioAlimentacion
    - aportesTrabajador - retencionFuente;

 
  const costoTotalEmpleador = salario + otrosPagosSalariales + otrosPagosNoSalariales +
    auxilioDeTransporte + provisionesPrestacionesSociales + aportesEmpleador + auxilioAlimentacion ;

  const totalPagar = pagoNetoTrabajador + aportesTrabajador + aportesEmpleador;

  // Respuesta
  res.json({
    totalRemuneracion,
    cuarentaPorciento,
    excedente,
    ibc,
    seguridadSocial: {
      saludTrabajador,
      saludEmpleador,
      pensionTrabajador,
      pensionEmpleador,
      riesgosLaborales,
      sena,
      icbf,
      cajaCompensacion,
    },
    prestacionesSociales: {
      primaServicios,
      cesantias,
      interesesCesantias,
      vacaciones,
    },
    proyecciones: {
      provisionesPrestacionesSociales,
      aportesEmpleador,
      aportesTrabajador,
      retencionFuente,
      pagoNetoTrabajador,
      costoTotalEmpleador,
      totalPagar,
    },
  });
});

// Servidor escuchando
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});




