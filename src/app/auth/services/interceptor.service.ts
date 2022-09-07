import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { tap } from 'rxjs/operators';
import { HttpResponse } from '@aspnet/signalr';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { Router } from '@angular/router';   
import { GeneralService } from 'src/app/shared/services/generales.services';

@Injectable({
    providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {


    constructor( 
        private swal : MensajesSwalService,
        private router : Router, 
        private generalService: GeneralService
    ) { }

 
 

    intercept(request: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>> { 
        request = request.clone({
          setHeaders: {          
         //   'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
         //   Authorization: 
          },
         
        }); 

        return next.handle(request)
        .pipe(
            tap(event => {
              if (event instanceof HttpResponse) {  
                console.log('status',event);
              }
            }, error => {  
                console.log('error',error);  
                let urlTC  = error.url.includes('TipoCambio')
                let urlJobs  = error.url.includes('ObtenerConsultaJobs'); 
                if(error.status === 404 && (urlTC || urlJobs)){ 
                  return;
                }else{ 
                  this.onValidarOtraSesion(error);
                }
            })
          )

    };


    onValidarOtraSesion(error : any){ 
      console.log('que erroe se validara',error);
      this.generalService.ApagarSpiiner(false);  

        if(error.status === 404){ 
          this.swal.mensajeError('No se encontraron datos.');
        }else if(error.error.status === 403){ 
          this.swal.mensajeCaducoSesion().then((response) => { 
            if (response.isConfirmed) { 
                this.router.navigate(['/auth']);
            }
          });
        }else if(error.error.status === 404){ 
          this.swal.mensajeError('No se encontraron datos.');
        }else if(error.error.status === 401){ 
          this.swal.mensajeCaducoSesion().then((response) => { 
            if (response.isConfirmed) { 
                this.router.navigate(['/auth']);
            }
          });
        }else{
          let MsgError 
          if(error.error){ 
            MsgError = JSON.stringify(error.error)  
          }else if(error.errors){ 
            MsgError = JSON.stringify(error.errors) 
          }else if(error.error.errors){ 
            MsgError = JSON.stringify(error.error.errors) 
          }else if (error === null){
            MsgError = JSON.stringify(error.message) 
          }
    
      
          this.swal.mensajeError(MsgError); 
          return;
        } 
    }
 
    

}