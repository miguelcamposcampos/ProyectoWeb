import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IAuth } from '../../interface/auth.interface';
import { AuthService } from '../../services/auth.service';
import { InterceptorService } from '../../services/interceptor.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
  styleUrls : ['./app.login.component.scss']
})
export class AppLoginComponent implements OnInit  {
  
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
      password: new FormControl( null, [Validators.required, Validators.minLength(4)]), 
      rememberMe: new FormControl(null),    
    });
  }
 
  viewPassword(input) {
    input.type = input.type === 'password' ? 'text' : 'password'; 
    this.cambiarIconEye = input.type === 'password' ? 'fa fa-eye' : 'fa fa-eye-slash'; 
  }
  
  onLogin(){
    localStorage.clear();  
    let logindata = this.loginForm.value;    

    const data: IAuth = {
      email : logindata.email,
      passwordDesencriptado :  logindata.password 
    }
    this.spinner.show();
    this.authService.login(data).subscribe((resp) => {  
      if(resp){ 
        localStorage.setItem('rememberMe', logindata.rememberMe ? logindata.rememberMe : null); 
        if(!(localStorage.getItem('estado') === 'Activo')){ 
          this.swal.mensajeActivacionUsuario(logindata.email);
        }else{ 
          this.router.navigate(['/modulos/empresas']);
        }  
      }  
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
      if(response.isConfirmed) { 
          this.loginService.recuperarCredenciales(this.emailRecuperar).subscribe((resp) => { 
          this.swal.mensajeExito('Se envió un correo a su bandeja de entrada.');
        }) 
      }
    });

  }

  
  onValidateForm(campo: string) {
    return ( this.loginForm.controls[campo].errors && this.loginForm.controls[campo].touched );
  }
  


  onLimpiarLS(){
  //  localStorage.removeItem("loginEncryptado")
    localStorage.removeItem("token")
    localStorage.removeItem("estado")
    localStorage.removeItem("DatosUsuario")
    localStorage.removeItem("guidEmpresa")
  }

}
