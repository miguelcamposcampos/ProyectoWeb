import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IAuth } from '../../interface/auth.interface';
import { AuthService } from '../../services/auth.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
  styleUrls : ['./app.login.component.scss']
})
export class AppLoginComponent implements OnInit  {
  
  loginForm!: FormGroup; 
  RecordarLogin: any; 
  dataDesencryptada = JSON.parse(localStorage.getItem('loginEncryptado'));
  emailRecuperar : string = ""; 
  checkRecordarLogin :boolean;
  cambiarIconEye: string = "fa fa-eye";
  fecha = new Date();
  AnioActual = this.fecha.getFullYear();
  
  constructor(  
    private loginService : LoginService,
    private authService : AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private swal: MensajesSwalService, 
    private spinner : NgxSpinnerService, 
    private generalService : GeneralService
  ) { 
    this.builform();
    this.RecordarLogin = localStorage.getItem('rememberMe');  
    if(this.RecordarLogin === "true"){
      this.checkRecordarLogin = true;
      this.onAutoLlenarLogin();
    }

    this.generalService._hideSpinner$.subscribe(val => { 
      this.spinner.hide();
    });

  }
  ngOnInit(): void {
    this.onLimpiarLS();
  }
  

  private builform(): void {
    this.loginForm = this.formBuilder.group({
      email: new FormControl( null, [Validators.required, Validators.email]),
      passwordDesencriptado: new FormControl( null, [Validators.required, Validators.minLength(4)]), 
      rememberMe: new FormControl(false),    
    });
  }
 
  viewPassword(input) {
    input.type = input.type === 'password' ? 'text' : 'password'; 
    this.cambiarIconEye = input.type === 'password' ? 'fa fa-eye' : 'fa fa-eye-slash'; 
  }
  
  onLogin(){
    this.loginService.logout();
    
    const data: IAuth = this.loginForm.getRawValue();  
    let Remem :any = data.rememberMe;
    this.spinner.show();

    this.authService.login(data).subscribe((resp) => {  
      if(resp){ 
        localStorage.setItem('rememberMe', Remem); 
        if(!(localStorage.getItem('estado') === 'Activo')){ 
          this.spinner.hide();
          this.swal.mensajeActivacionUsuario(data.email);
        }else{ 
          this.router.navigate(['/modulos/empresas']);
        }  
      }  
    });
  }
 
  onAutoLlenarLogin(){  
    if(this.dataDesencryptada){
      this.loginForm.controls['email'].setValue(this.authService.desCifrarData(this.dataDesencryptada.email));
    }
  }
 

  onRecuperar(){   
    this.emailRecuperar = this.loginForm.controls['email'].value;

    if(!this.emailRecuperar || !this.emailRecuperar.includes('@')){
      this.swal.mensajeAdvertencia('Ingrese el correo valido!.');
      return; 
    }
 
    this.swal.mensajeRecuperarEmail('Quiere recuperar la contraseña del correo: ', this.emailRecuperar).then((response) => { 
      if(response.isConfirmed) { 
          this.loginService.recuperarCredenciales(this.emailRecuperar).subscribe((resp) => { 
          this.swal.mensajeExito('Se envió un correo a su bandeja de entrada.');
        }) 
      }
    }); 
  }
 
  onLimpiarLS(){
  //  localStorage.removeItem("loginEncryptado")
    localStorage.removeItem("token")
    localStorage.removeItem("estado")
    localStorage.removeItem("DatosUsuario")
    localStorage.removeItem("guidEmpresa")
  }

}
