import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";   
import { IListarResumenBoleta, IListarVentasElectronicas } from "../interface/ventaelectronica.interface";

@Injectable({
    providedIn: 'root'
})

export class VentaElectronciaService{

    private api987 = environment.apiUrl987; 
    private api992 = environment.apiUrl992; 

    constructor(
        private http : HttpClient
    ){}

    
    /* POR DEFINIR */
    listarJobs(estado :any){
        return this.http.get<any>(`${this.api987}/Configuracion/ObtenerConsultaJobs?estado=${estado}`)
    }

    listadoVentasElectronicas(data :any): Observable<IListarVentasElectronicas[]>{
        let params = new HttpParams(); 
        params = params.append('fechaInicio', data.fechaInicio);
        params = params.append('fechaFin', data.fechaFin);
        return this.http.get<IListarVentasElectronicas[]>(`${this.api987}/v1/Venta/ObtenerVentasElectronicasConsulta`, { params }); 
    }
  
     
    listarResumen(data :any): Observable<IListarResumenBoleta[]>{
        let params = new HttpParams(); 
        params = params.append('fechaInicio', data.fechaInicio);
        params = params.append('fechaFin', data.fechaFin);
        return this.http.get<IListarResumenBoleta[]>(`${this.api987}/v1/Venta/ObtenerResumenesIntegracion`, { params }); 
    }

    crearResumenAltayBaja(data:any){
        return this.http.post(`${this.api992}/v1/Integracion/SendSummary?action=${data.action}&fecha=${data.fecha}`,null)
    }

    crearEnvioMasivo(data : any){
        return this.http.post<any>(`${this.api992}/v1/Integracion/EnviarTodosLosPendientes?periodo=${data.periodo}&mes=${data.mes}`,null)
    }
 

    consultarAltaBaja(data:any){
        return this.http.post(`${this.api992}/v1/Integracion/GetInvoiceStatus?invoideId=${data.invoiceId}&isVoidRequest=${data.isVoidRequest}`, null)
    } 
 

    enviarAlta(data:any){
        return this.http.post(`${this.api992}/v1/Integracion/SendInvoice?isVoidRequest=${data.isVoidRequest}`, {autoEnvio: data.autoEnvio, invoiceId : data.invoiceId })
    } 



}