import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { AsientoDiarioComponent } from './asiento-diario/asiento-diario.component';
import { AsientoTesoreriaComponent } from './asiento-tesoreria/asiento-tesoreria.component';

const routes: Routes = [
  { 
    path: 'asientos-diario',
    component: AsientoDiarioComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'asientos-tesoreria',
    component: AsientoTesoreriaComponent,
    canActivate : [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CntProcesosRoutingModule { }
