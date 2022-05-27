import { Injectable } from "@angular/core"; 
import { IActivarCuentaUsuario } from "src/app/auth/interface/auth.interface";
import { LoginService } from "src/app/auth/services/login.service";
import { ConstantesGenerales } from "src/app/shared/interfaces/shared.interfaces";
import  Swal, { SweetAlertResult } from 'sweetalert2';
 
@Injectable({
    providedIn: 'root'
})
export class MensajesSwalService {
    meses : any = ConstantesGenerales.arrayMeses
    
    constructor(
        private loginService : LoginService, 
    ){

    }

    mensajePreloader(condicion : boolean){
        if(condicion){
            Swal.fire({
               // title: 'Cargando',
                html: 'Cargando <br> Espere un momento por favor', 
                timerProgressBar: true,
                didOpen: () => {
                  Swal.showLoading()  
                }, 
              }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {}
         }) 
        }else{
            Swal.close();
        }
    }
 
    mensajeCaducoSesion(): Promise<SweetAlertResult<any>> {
        const promesa = new Promise<SweetAlertResult<any>>((resolve, reject) =>
        { Swal.fire({
            title: 'Su sesión ha caducado, debe iniciar sesión nuevamente, gracias.', 
            color: '#716add', 
            showCancelButton: false, 
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Iniciar Sesión', 
          }).then(
              respuesta => {
                  resolve(respuesta);
              }
          )
        });

        return promesa;
    }
 
    mensajeExito(mensaje: string) {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Exito !',
            text: mensaje,
            showConfirmButton: false,
            timer: 3000
        });
    }
  
    mensajeInformacion(mensaje: string) {
        Swal.fire({
            position: 'center',
            icon: 'info',
            title: 'Información',
            text: mensaje,
            showConfirmButton: false,
            timer: 2000
        });
    }

    mensajeAdvertencia(mensaje: string) {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Advertencia',
            text: mensaje,
            showConfirmButton: true,
        });
    }
 
    mensajeError(mensaje: any) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Error',
            text: mensaje,
            showConfirmButton: true,
        });
    }

    // mensajePregunta(mensaje: string): Promise<SweetAlertResult<any>> {
    //     const promesa = new Promise<SweetAlertResult<any>>((resolve, reject) =>
    //     { Swal.fire({
    //         title: 'Confirmación',
    //         text: mensaje,
    //         icon: 'question',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Si',
    //         cancelButtonText: 'No'
    //       }).then(
    //           respuesta => {
    //               resolve(respuesta);
    //           }
    //       )
    //     });

    //     return promesa;
    // }


    mensajePregunta(mensaje: string): Promise<SweetAlertResult<any>> {
        const promesa = new Promise<SweetAlertResult<any>>((resolve, reject) =>
        {  Swal.fire({
            title: 'Confirmación',
            text: mensaje,
            icon: 'question',
            showCancelButton: true, 
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si',
            cancelButtonText: 'No'
        }).then(result => { 
            resolve(result);  
        })
        }); 
        console.log( 'promesa', promesa);
        return promesa; 
    }


    mensajePreguntaElegirMes(titulo : string): Promise<SweetAlertResult<any>>{
        const promesa = new Promise<SweetAlertResult<any>>((resolve, reject) =>
       { 
        Swal.fire({
            
            input: 'select',
            inputOptions: {
              '1': 'ENERO',
              '2': 'FEBRERO',
              '3': 'MARZO',
              '4': 'ABRIL',
              '5': 'MAYO',
              '6': 'JUNIO',
              '7': 'JULIO',
              '8': 'AGOSTO',
              '9': 'SETIEMBRE',
              '10': 'OCTUBRE',
              '11': 'NOVIEMBRE',
              '12': 'DICIEMBRE',
            },
            title: 'Envio Masivo',
            text: titulo,
            confirmButtonText: 'Iniciar',  
            inputPlaceholder: 'Selecciona un mes',
            showCancelButton: true,
            inputValidator: function (value) {
              return new Promise(function (resolve, reject) {
                if (value !== '') {
                  resolve(null);
                } else {
                  resolve('Elige un mes Porfavor');
                }
              });
            }
        }).then(
            respuesta => {
                resolve(respuesta);
            }
        )
        }); 
        return promesa;
    }
 
  
    mensajeRecuperarEmail(mensaje: string, correo: string): Promise<SweetAlertResult<any>>{
        const promesa = new Promise<SweetAlertResult<any>>((resolve, reject) =>
        {
            Swal.fire({
            title: mensaje, 
            html:  '<b>'+ correo + '</b>', 
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText:'<i class="pi pi-check"></i> Recuperar', 
            cancelButtonText:'Cancelar'
          }).then(
            respuesta => {
                resolve(respuesta);
            }
          )   
        }); 
        return promesa;
    }

    mensajeActivacionUsuario(email : string){
        Swal.fire({
            title: 'Ingrese el código de activación' ,
            input: 'text',
            width: 460,
            inputAttributes: {
              autocapitalize: 'off', 
            },
            position: 'center',
            showDenyButton: true, 
            denyButtonText: `Reenviar código`, 
            showCancelButton: true,
            confirmButtonText: 'Activar',
            showLoaderOnConfirm: true, 
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) { 
                const newActivacion : IActivarCuentaUsuario = {
                    email : email,
                    codigoActivacion :  result.value 
                } 
                this.loginService.activarCuentaUsuario(newActivacion).subscribe((resp) => { 
                    if(resp){
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: 'Exito !',
                            text: 'Usuario ' + email+ ' ha sido ctivado',
                            showConfirmButton: false,
                            timer: 3000
                        }); 
                    }
                },error => {
                    this.mensajeError(error.error)
                }) 
            }else if(result.isDenied){
                this.loginService.reenviarCuentaUsuario(email).subscribe((resp) => { 
                    this.mensajeExito('Se reenvio el codigo de activación al email: ' + email); 
                }) 
            }
          })
    }

    mensajeRegistrarEmpresa(){
        const promesa = new Promise<SweetAlertResult<any>>((resolve, reject) =>
        { Swal.fire({
            title: 'No hay empresas registradas' , 
            text: 'Porfavor registra una empresa para continuar.' ,  
            confirmButtonText: 'Registrar empresa',  
            showCancelButton: true,  
          }).then(
              respuesta => {
                  resolve(respuesta);
              }
          )
        }); 
        return promesa;  
    }


    mensajeElegirunPlan(): Promise<SweetAlertResult<any>> {
        const promesa = new Promise<SweetAlertResult<any>>((resolve, reject) =>
        { Swal.fire({
            title: 'No cuenta con un Plan' , 
            text: 'Debes elegir un plan de empresa para continuar.' ,  
            confirmButtonText: 'Elegir un Plan',    
          }).then(
              respuesta => {
                  resolve(respuesta);
              }
          )
        }); 
        return promesa; 
    }

}

