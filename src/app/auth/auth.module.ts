import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { RegistroComponent } from './pages/registro/registro.component';
import { AuthRoutingModule } from './auth-routing.module';  
import { ReactiveFormsModule } from '@angular/forms'; 
import { PrimeNGModule } from '../utilities/PrimeNG/primeng.module';
import { AppLoginComponent } from './pages/login/app.login.component';
import { AppAccessdeniedComponent } from './pages/acceso-denegado/app.accessdenied.component';
import { AppErrorComponent } from './pages/error/app.error.component';
import { AppNotfoundComponent } from './pages/not-found/app.notfound.component'; 
import { SharedModulosModule } from '../modulos/shared_modulos/shared_modulos.module'; 


@NgModule({
  declarations: [
    AppLoginComponent,
    RegistroComponent,
    AppAccessdeniedComponent,
    AppErrorComponent,
    AppNotfoundComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    AuthRoutingModule, 
    PrimeNGModule,
    SharedModulosModule
  ]
})
export class AuthModule { }
