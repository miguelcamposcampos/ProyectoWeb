import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
export class AppLoginComponent {
  
  loginForm!: FormGroup; 
  RecordarLogin: any; 
  dataDesencryptada :any;
  emailRecuperar : string = ""; 
  checkRecordarLogin :boolean;
  cambiarIconEye: string = "fa fa-eye";
  constructor(  
     private loginService : LoginService,
     private authService : AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private swal: MensajesSwalService,
    private generalService : GeneralService
  ) { 
    this.builform();
    this.RecordarLogin = localStorage.getItem('rememberMe');  
    if(this.RecordarLogin === "true"){
      this.checkRecordarLogin = true;
      this.onAutoLlenarLogin();
    }
  }


  private builform(): void {
    this.loginForm = this.formBuilder.group({
      email: new FormControl( null, [Validators.required, Validators.email]),
      password: new FormControl( null, [Validators.required, Validators.minLength(4)]), 
      rememberMe: new FormControl(null),    
    });
  }
 
  viewPassword(input) {
    input.type = input.type === 'password' ? 'text' : 'password'; 
    this.cambiarIconEye = input.type === 'password' ? 'fa fa-eye' : 'fa fa-eye-slash'; 
  }
  
  onLogin(){
    let logindata = this.loginForm.value;    

    const data: IAuth = {
      email : logindata.email,
      passwordDesencriptado :  logindata.password 
    }
    this.swal.mensajePreloader(true)
    
    this.authService.login(data).subscribe((resp) => {   
      localStorage.setItem('rememberMe', logindata.rememberMe ? logindata.rememberMe : null); 
      if(!(localStorage.getItem('estado') === 'Activo')){
        this.swal.mensajeActivacionUsuario(logindata.email);
      }else{
        this.router.navigate(['/modulos/empresas'])
      }
      this.swal.mensajePreloader(false)
    },error => {
      this.generalService.onValidarOtraSesion(error);  
    });
  }
 
  onAutoLlenarLogin(){  
    this.dataDesencryptada = JSON.parse(localStorage.getItem('loginEncryptado')) 
    if(this.dataDesencryptada){
      let emailDesencriptado = this.authService.desCifrarData(this.dataDesencryptada.email)
      this.loginForm.patchValue({
        email :  emailDesencriptado // localStorage.getItem('email'), 
      }) 
    }
   
  }
 

  onRecuperar(){   
    this.emailRecuperar = this.loginForm.controls['email'].value;

    if(!this.emailRecuperar || !this.emailRecuperar.includes('@')){
      this.swal.mensajeAdvertencia('Ingrese el correo valido!.');
      return; 
    }
 
    this.swal.mensajeRecuperarEmail('Quiere recuperar la contraseña del correo: ', this.emailRecuperar).then((response) => { 
      if (response.isConfirmed) { 
          this.loginService.recuperarCredenciales(this.emailRecuperar).subscribe((resp) => { 
          this.swal.mensajeExito('Se envió un correo a su bandeja de entrada.');
        },error =>{
          this.swal.mensajeError(error.error);
        }) 
      }
    });

  }

  
  onValidateForm(campo: string) {
    return ( this.loginForm.controls[campo].errors && this.loginForm.controls[campo].touched );
  }
  




}
