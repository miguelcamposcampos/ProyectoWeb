import {Component, EventEmitter, Output} from '@angular/core';  
import { MegaMenuItem } from 'primeng/api';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LoginService } from 'src/app/auth/services/login.service';
import { HomeComponent } from 'src/app/modulos/home/home.component'; 

@Component({
    selector: 'app-topbar',
    templateUrl: './app-topbar.component.html',
    styleUrls: ['./app.topbar.component.scss'],
  
})
export class AppTopBarComponent {
 
  @Output() mPredeterminado: EventEmitter<any> = new EventEmitter<any>(); 
  items: MegaMenuItem[];
  usuariologeado: string ="";
  rolUsuario : string= "";
  dataDesencryptada : any;

  constructor(
      public appMain: HomeComponent,  
      private loginService : LoginService,
      private authService : AuthService, 
  ) {
    this.onPintarDatos();

  
  } 

  onPintarDatos(){ 
    this.dataDesencryptada = JSON.parse(localStorage.getItem('DatosUsuario')) 
    this.usuariologeado = this.authService.desCifrarData(this.dataDesencryptada.usuariologin) 
    if(this.usuariologeado.length > 20){
        this.usuariologeado = this.usuariologeado.slice(0,-10) + '...';
    } 
    this.rolUsuario = this.authService.desCifrarData(this.dataDesencryptada.rolUsuario);
  }
 
  onLogout(){
      this.loginService.logout();
  }

  onTiketera(event : string){
    this.mPredeterminado.emit(event); 
    return;  
  }

 
  


}
