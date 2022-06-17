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
  registroForm!: FormGroup; 
  value: boolean = false;
  usuario! : IUsuario

  
  constructor(   
      private formBuilder: FormBuilder,
      private router: Router, 
      private swal : MensajesSwalService,
      private loginService: LoginService,
      private generalService: GeneralService,
      private spinner : NgxSpinnerService
  ) {
  }

  ngOnInit(): void { 
    this.registroForm = this.formBuilder.group({
        NombreUsuario: new FormControl(null, [Validators.required]),  
        Password: new FormControl(null, [Validators.required]),
        Email: new FormControl(null, [Validators.required]),
        NombreApellidos: new FormControl(null, [Validators.required]),
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
      const dato = this.registroForm.value;
      if(!(dato.Password === dato.RepetirPassword)){
        this.swal.mensajeAdvertencia('Las contraseñas deben coincidir, asegurese de que las contraseñas sean iguales.')
        return;
      }
  
      const newUsuario: IUsuario = {
        nombreusuario: dato.NombreUsuario,
        contrasena: dato.Password ,
        email: dato.Email ,
        nombreapellidos: dato.NombreApellidos,
        nombreorganizacion: ''
      }
      this.spinner.show();
      this.loginService.nuevoUsuarioCreate(newUsuario).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Se registro al usuario con conrrectamente!.');
          this.router.navigate(['/auth/login']);
        }
      },error => { 
        this.spinner.hide();
        this.generalService.onValidarOtraSesion(error);
      });
 
  }
  
  onRegresar(){ 
      this.router.navigate(['/auth/login']);
  }

  onValidateForm(campo: string) {
    return ( this.registroForm.controls[campo].errors && this.registroForm.controls[campo].touched );
  }

 
}
