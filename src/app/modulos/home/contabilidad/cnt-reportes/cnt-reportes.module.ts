import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CntReportesRoutingModule } from './cnt-reportes-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { AnalisisCuentaAnaliticoComponent } from './analisis-cuenta-analitico/analisis-cuenta-analitico.component';
import { AnalisisCuentaComponent } from './analisis-cuenta/analisis-cuenta.component';
import { SharedModulosModule } from 'src/app/modulos/shared_modulos/shared_modulos.module';


@NgModule({
  declarations: [
    AnalisisCuentaAnaliticoComponent,
    AnalisisCuentaComponent
  ],
  imports: [
    CommonModule,
    CntReportesRoutingModule,
    ReactiveFormsModule,
    PrimeNGModule,
    SharedModulosModule
  ]
})
export class CntReportesModule { }
