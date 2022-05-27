import { Injectable } from "@angular/core";
import * as signalR from "@aspnet/signalr";
import { BehaviorSubject } from "rxjs";   
import { AuthService } from "src/app/auth/services/auth.service";

@Injectable({
    providedIn: "root",
})
export class SignalRService {
 
    guidEmpresa : any;
    hubConnection: signalR.HubConnection;
    hubConnectionIntegracion: signalR.HubConnection; 
    InfoVentas: any;
    InfoCompras: any;
    InfoCobranzas: any;
    InfoEnvioMasivo: any;
    jobId : string = '0';

    constructor(
        private authService : AuthService
    ) { 
        this.guidEmpresa = this.authService.desCifrarData(localStorage.getItem("guidEmpresa"))
        this.InfoVentas = new BehaviorSubject<any>(null);
        this.InfoCompras = new BehaviorSubject<any>(null);
        this.InfoCobranzas = new BehaviorSubject<any>(null);   
        this.InfoEnvioMasivo = new BehaviorSubject<any>(null);        
    }

  
    public iniciarConeccionSR(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.hubConnection = new signalR.HubConnectionBuilder()
               // .configureLogging(signalR.LogLevel.Trace)
                .withUrl("http://srv2.marketsol.pe:987/notifyHub")
                .build();

            this.onEscucharEventos(); 

            this.hubConnection
                .start()
                .then(() => {
                    console.log("Conexión Exitosa con  ERP SignalR!"); 
                    resolve();
                })
                .catch((error) => {
                    console.log("Hubo un error en la conexxion" + error);
                    reject();
                });
        });
    }

    public iniciarConeccionIntegracion() :  Promise<void>{   
        return new Promise((resolve, reject) => {
             
            this.hubConnectionIntegracion = new signalR.HubConnectionBuilder() 
            .withUrl("http://srv2.marketsol.pe:992/notifyHub") 
            .configureLogging(signalR.LogLevel.Trace)
            .build();
           
                this.hubConnectionIntegracion
                .start()
                .then(() => {
                    console.log("Conexión Exitosa con Integracion SignalR!"); 
                    resolve(); 
                })
                .catch((error) => {
                    console.log("Hubo un error en la conexxion" + error); 
                    reject();
                })
        });
    }
 
    private onEscucharEventos(): void{ 
        this.hubConnection.on(this.guidEmpresa + "_Ventas", (data) => {  
            this.InfoVentas.next(data);
        }); 

        this.hubConnection.on(this.guidEmpresa + "_Compras", (data) => { 
            this.InfoCompras.next(data);
        }); 

        this.hubConnection.on(this.guidEmpresa + "_Cobranzas", (data) => { 
            this.InfoCobranzas.next(data);
        });  
    }

    onRecibirJobiId(id : string){
        this.jobId = id 
    }

    onEscucharEnviosMasivos(id:string): void{   
        this.hubConnectionIntegracion.on(id,  (resp) => {    
            this.InfoEnvioMasivo.next(resp);
        });   

    }

        
}
  