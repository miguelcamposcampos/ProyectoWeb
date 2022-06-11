import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { ReactiveFormsModule } from '@angular/forms';  
import { ModulosRoutingModule } from './modulos-routing.module';
import { ConfirmationService, MessageService } from 'primeng/api';   
import { PrimeNGModule } from '../utilities/PrimeNG/primeng.module';  
import { SharedModule } from '../shared/shared.module';
import { LandingComponent } from './landing/landing.component';
import { NgChartsModule } from 'ng2-charts';
 
@NgModule({
  declarations: [  
    LandingComponent
  ],
  imports: [
    CommonModule,
    ModulosRoutingModule,
    PrimeNGModule, 
    ReactiveFormsModule,   
    SharedModule, 
    NgChartsModule
  ],

  providers: [
    MessageService,
    ConfirmationService
  ], 
  exports : [
    LandingComponent
  ]
})
export class ModulosModule { }
