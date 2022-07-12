import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';   
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';
import { SignalRService } from '../shared_modulos/signalR/signalr.service';
import { ReactiveFormsModule } from '@angular/forms'; 
import { NgChartsModule } from 'ng2-charts';  

@NgModule({
  declarations: [ 
    HomeComponent
  ],
  imports: [
    CommonModule, 
    HomeRoutingModule,   
    PrimeNGModule, 
    ReactiveFormsModule,
    SharedModule, 
    NgChartsModule, 
  ], 
  providers: [
    SignalRService,
    {
      provide: APP_INITIALIZER,
      useFactory: (signalrService: SignalRService) => {
        signalrService.iniciarConeccionSR(),  
        signalrService.iniciarConeccionIntegracion() 
      },
      deps: [SignalRService],
      multi: true,
    }
  ], 
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class HomeModule { }
