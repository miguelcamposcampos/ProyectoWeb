import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';   
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IUsuario } from '../../interface/auth.interface';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'], 
})
export class RegistroComponent implements OnInit {

  itemsTopBar! : MenuItem[]; 
  Form: FormGroup; 
  value: boolean = false;
  usuario! : IUsuario
  cambiarIconEye: string = "fa fa-eye";
  cambiarIconEye2: string = "fa fa-eye";
   

  constructor(   
      private formBuilder: FormBuilder,
      private router: Router, 
      private swal : MensajesSwalService,
      private loginService: LoginService,
      private generalService: GeneralService,
      private spinner : NgxSpinnerService
  ) {
    this.generalService._hideSpinner$.subscribe(x => {
      this.spinner.hide();
    })
  }

  ngOnInit(): void { 
    this.Form = this.formBuilder.group({
        nombreusuario: new FormControl(null, [Validators.required]),  
        contrasena: new FormControl(null, [Validators.required]),
        email: new FormControl(null),
        nombreapellidos: new FormControl(null, [Validators.required]),
        nombreorganizacion: new FormControl(null),
        RepetirPassword: new FormControl(null, [Validators.required]), 
    });
    this.onItemsEmpresas();  
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
    ];
  }
 
  onRegistrar(){
      const dato = this.Form.value;
      if(!(dato.contrasena === dato.RepetirPassword)){
        this.swal.mensajeAdvertencia('Las contraseñas deben coincidir, asegurese de que las contraseñas sean iguales.')
        return;
      }
  
      const newUsuario: IUsuario = this.Form.getRawValue();
      this.spinner.show();

      this.loginService.nuevoUsuarioCreate(newUsuario).subscribe((resp) => { 
        this.swal.mensajeExito('Se registro al usuario con conrrectamente!.');
        this.router.navigate(['/auth/login']); 
      }); 
  }
  
  onRegresar(){ 
      this.router.navigate(['/auth/login']);
  }

  viewPassword(input) {
    input.type = input.type === 'password' ? 'text' : 'password'; 
    this.cambiarIconEye = input.type === 'password' ? 'fa fa-eye' : 'fa fa-eye-slash'; 
  }


  viewPassword2(input) {
    input.type = input.type === 'password' ? 'text' : 'password'; 
    this.cambiarIconEye2 = input.type === 'password' ? 'fa fa-eye' : 'fa fa-eye-slash'; 
  }
 
}
