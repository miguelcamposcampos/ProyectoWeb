import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { AnalisisCuentaAnaliticoComponent } from './analisis-cuenta-analitico/analisis-cuenta-analitico.component';
import { AnalisisCuentaComponent } from './analisis-cuenta/analisis-cuenta.component';

const routes: Routes = [
  { 
    path: 'rep-analisis-cuenta-analitico',
    component: AnalisisCuentaAnaliticoComponent,
    canActivate : [AuthGuard],
  },
  { 
    path: 'rep-analisis-cuenta',
    component: AnalisisCuentaComponent,
    canActivate : [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CntReportesRoutingModule { }
