import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';   
import { PrimeNGModule } from 'src/app/utilities/PrimeNG/primeng.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';
import { SignalRService } from '../shared_modulos/signalR/signalr.service';
import { ReactiveFormsModule } from '@angular/forms'; 

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

})
export class HomeModule { }
