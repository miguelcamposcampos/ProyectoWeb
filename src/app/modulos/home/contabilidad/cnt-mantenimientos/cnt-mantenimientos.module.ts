import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CntMantenimientosRoutingModule } from './cnt-mantenimientos-routing.module';
import { CuentasMayoresComponent } from './cuentas-mayores/cuentas-mayores.component';
import { PlanDeCuentasComponent } from './plan-de-cuentas/plan-de-cuentas.component';
import { AdministracionConceptosComponent } from './administracion-conceptos/administracion-conceptos.component';
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModulosModule } from 'src/app/modulos/shared_modulos/shared_modulos.module'; 
import { NuevaPlanCuentaComponent } from './plan-de-cuentas/nueva-plan-cuenta/nueva-plan-cuenta.component';
import { SubirPlanCuentaComponent } from './plan-de-cuentas/subir-plan-cuenta/subir-plan-cuenta.component';
import { NuevaCuentaComponent } from './cuentas-mayores/nueva-cuenta/nueva-cuenta.component';


@NgModule({
  declarations: [
    CuentasMayoresComponent,
      NuevaCuentaComponent,
    PlanDeCuentasComponent,
      NuevaPlanCuentaComponent,
      SubirPlanCuentaComponent,
    AdministracionConceptosComponent
  ],
  imports: [
    CommonModule,
    CntMantenimientosRoutingModule,
    PrimeNGModule,
    ReactiveFormsModule,
    SharedModulosModule
  ]
})
export class CntMantenimientosModule { }
