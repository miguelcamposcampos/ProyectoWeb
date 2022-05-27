import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { ProgramaLibroElectronicoComponent } from './configuraciones/programa-libro-electronico/programa-libro-electronico.component';
import { EmpresaComponent } from './configuraciones/empresa/empresa.component';
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProgramaLibroElectronicoComponent,
    EmpresaComponent
  ],
  imports: [
    CommonModule,
    PrimeNGModule,
    ReactiveFormsModule,
    ConfiguracionRoutingModule
  ]
})
export class ConfiguracionModule { }
