import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';  
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LoginService } from 'src/app/auth/services/login.service';
import { MensajesSwalService } from '../../../utilities/swal-Service/swal.service'

@Component({
  selector: 'app-titulos',
  templateUrl: './titulos.component.html',
  styleUrls: ['./titulos.component.scss']
})
export class TitulosComponent implements OnInit {

  @Output() cerrar  : any  = new EventEmitter<string>();
  @Input() titulo! : string; 
  itemsTopBar! : MenuItem[]; 

  usuariologeado: string ="";
  rolUsuario : string= "";
  dataDesencryptada :any;
  constructor(   
    private loginService : LoginService,
    private swal : MensajesSwalService,
    private router : Router,
    private authService : AuthService
  ) { 
    this.onPintarDatos();
  }

  


  ngOnInit(): void {
    this.onItemsEmpresas();  
  }

  onPintarDatos(){ 
    this.dataDesencryptada = JSON.parse(sessionStorage.getItem('DatosUsuario')) 
 
    this.usuariologeado = this.authService.desCifrarData(this.dataDesencryptada.usuariologin),
    this.rolUsuario =  this.authService.desCifrarData(this.dataDesencryptada.rolUsuario) 
      
    // this.usuariologeado = sessionStorage.getItem('usuariologin');
    // this.rolUsuario = sessionStorage.getItem('rolUsuario');
  }

  onItemsEmpresas(){
    this.itemsTopBar = [ 
      {
        label:'Regresar',
        icon:'pi pi-fw pi-arrow-left', 
        command:()=>{
          this.onRegresar();
        }
      },
      {
        label:'Cerrar sesión',
        icon:'pi pi-fw pi-power-off',
        command:()=>{
          this.onLogout();
        }
       
      },
    
    ];
  }
 
  onRegresar() { 
    this.cerrar.emit(false); 
  }

  onLogout(){
    this.swal.mensajePregunta("¿Seguro que desea cerrar la sesión?").then((response) => {
      if (response.isConfirmed) {
        this.loginService.logout();
        this.router.navigate(['auth/login'])
      }
    })

  }

 

}
