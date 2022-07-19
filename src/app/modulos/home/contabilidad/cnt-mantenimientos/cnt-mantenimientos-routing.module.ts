import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { AdministracionConceptosComponent } from './administracion-conceptos/administracion-conceptos.component';
import { CuentasMayoresComponent } from './cuentas-mayores/cuentas-mayores.component';
import { PlanDeCuentasComponent } from './plan-de-cuentas/plan-de-cuentas.component';

const routes: Routes = [
  { 
    path: 'cuentas-mayores',
    component: CuentasMayoresComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'plan-de-cuentas',
    component: PlanDeCuentasComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'administracion-conceptos',
    component: AdministracionConceptosComponent,
    canActivate : [AuthGuard],
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CntMantenimientosRoutingModule { }
