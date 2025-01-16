const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


app.post('/calcular', (req, res) => {
  const {
    tipoSalario,
    salario,
    otrosPagosSalariales,
    otrosPagosNoSalariales,
    auxilioTransporte,
    auxilioAlimentacion,
    pensionado
  } = req.body;

  const salarioMinimo = 1423500;
  const cuatroSMLMV = salarioMinimo * 4;
  const diezSMLMV = salarioMinimo * 10;
  const auxilioDeTransporte = 200000;
 

  const totalRemuneracion = (tipoSalario === 'integral'
    ? otrosPagosSalariales + otrosPagosNoSalariales + auxilioAlimentacion + (salario * 0.7)
    : salario + otrosPagosNoSalariales + otrosPagosSalariales + auxilioAlimentacion);


  const cuarentaPorciento = totalRemuneracion * 0.4;
  const excedente = otrosPagosNoSalariales + auxilioAlimentacion - cuarentaPorciento > 0
    ? otrosPagosNoSalariales + auxilioAlimentacion - cuarentaPorciento  : 0;

  const ibc = tipoSalario === 'ordinario'
    ? otrosPagosSalariales + salario + excedente
    : tipoSalario === 'integral'
    ? ((salario + otrosPagosSalariales) * 0.7) + excedente
    : tipoSalario === 'medio tiempo' ? salarioMinimo : 0;

  const ratio = ibc / salarioMinimo;
  const porcentajeFSP = ((ratio >= 4 && ratio < 16) 
  ? 1 : (ratio >= 16 && ratio <= 17) ? 1.2 : (ratio > 17 && ratio <= 18) 
  ? 1.4 : (ratio > 18 && ratio <= 19) ? 1.6 : (ratio > 19 && ratio <= 20) 
  ? 1.8 : (ratio > 20) ? 2 : 0) / 100;

  const saludEmpleador = Math.round(salario + otrosPagosSalariales >= diezSMLMV ? 0.085 * ibc : 0);
  const saludTrabajador = ibc * 0.04;
  const pensionTrabajador = pensionado === 'No' ? ibc * 0.04 : 0;
  const pensionEmpleador = pensionado === 'No' ? ibc * 0.12 : 0;
  const FSP = pensionado === 'No' ? ibc * porcentajeFSP : 0;
  const riesgosLaborales = Math.ceil(ibc * 0.00522);
  const sena = (salario + otrosPagosSalariales) >= diezSMLMV ? (salario + otrosPagosSalariales) * 0.02 : 0;
  const icbf = (salario + otrosPagosSalariales) >= diezSMLMV ? (salario + otrosPagosSalariales) * 0.03 : 0;
  const cajaCompensacion = (salario + otrosPagosSalariales) * 0.04;


  // Prestaciones sociales y vacaciones' 
  const primaServicios = tipoSalario !== 'integral' ? (salario + otrosPagosSalariales + auxilioTransporte) * 0.0833 : 0;

  const cesantias = tipoSalario !== 'integral'
    ? (salario + otrosPagosSalariales + auxilioTransporte) * 0.0833 : 0;

  const interesesCesantias = Math.round(tipoSalario !== 'integral' ? cesantias * 0.12 : 0);
  const vacaciones = (salario + otrosPagosSalariales) * 0.0417;


  // Proyectado

  const provisionesPrestacionesSociales = Math.round(primaServicios + cesantias + interesesCesantias + vacaciones);
  const aportesEmpleador = Math.round(saludEmpleador + pensionEmpleador + riesgosLaborales + sena + icbf + cajaCompensacion);
  const aportesTrabajador = saludTrabajador + pensionTrabajador + FSP;
  const retencionFuente = 2000000;

  const pagoNetoTrabajador = salario + otrosPagosSalariales + otrosPagosNoSalariales + auxilioAlimentacion + auxilioTransporte - aportesTrabajador - retencionFuente;

  const costoTotalEmpleador = salario + otrosPagosSalariales + otrosPagosNoSalariales + auxilioTransporte
    + provisionesPrestacionesSociales + aportesEmpleador + auxilioAlimentacion;

  const totalPagar = pagoNetoTrabajador + aportesTrabajador + aportesEmpleador;

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
      FSP,
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
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
})


