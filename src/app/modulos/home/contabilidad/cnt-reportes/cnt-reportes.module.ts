import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CntReportesRoutingModule } from './cnt-reportes-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { AnalisisCuentaAnaliticoComponent } from './analisis-cuenta-analitico/analisis-cuenta-analitico.component';


@NgModule({
  declarations: [
    AnalisisCuentaAnaliticoComponent
  ],
  imports: [
    CommonModule,
    CntReportesRoutingModule,
    ReactiveFormsModule,
    PrimeNGModule,
  ]
})
export class CntReportesModule { }
