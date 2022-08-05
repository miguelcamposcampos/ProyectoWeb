import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';
import { AnalisisCuentaAnaliticoComponent } from './analisis-cuenta-analitico/analisis-cuenta-analitico.component';

const routes: Routes = [
  { 
    path: 'rep-analisis-cuenta-analitico',
    component: AnalisisCuentaAnaliticoComponent,
    canActivate : [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CntReportesRoutingModule { }
