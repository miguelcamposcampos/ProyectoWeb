import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IReporte } from "src/app/modulos/home/almacen/a-mantenimientos/productos/interface/producto.interface";
import { environment } from "src/environments/environment";  
import { ICobranzaPorId, IListarCobranza, IPendientes } from "../interface/cobranza.interface";

@Injectable({
    providedIn: 'root'
})

export class CobranzaService{

    private api987 = environment.apiUrl987; 
    private apiReporte = environment.apireporte; 

    constructor(
        private http : HttpClient
    ){}


    listadoCobranza(data :any): Observable<IListarCobranza>{
        let params = new HttpParams(); 
        params = params.append('f1', data.finicio);
        params = params.append('f2', data.ffin);
        params = params.append('paginaindex', data.paginaindex);
        params = params.append('itemsxpagina', data.itemporPagina);
        return this.http.get<IListarCobranza>(`${this.api987}/v1/Cobranza/ObtenerCobranzasConsultas`, { params: params });  
    }
 
    listadoPendiente(data :any): Observable<IPendientes[]>{
        let params = new HttpParams(); 
        params = params.append('f1', data.finicio);
        params = params.append('f2', data.ffin);
        if(data.documentoid){
            params = params.append('idTipoDoc', data.documentoid);
        }
        if(data.serie){
            params = params.append('serie', data.serie);
        }
        if(data.correlativo){
            params = params.append('correlativo', data.correlativo);
        } 
        if(data.idPersona){
            params = params.append('idPersona', data.idPersona);
        } 
        return this.http.get<IPendientes[]>(`${this.api987}/v1/Cobranza/ObtenerPendientesCobranza`, { params: params });  
    }


    cobranzaPorId(id :number){
        return this.http.get<ICobranzaPorId>(`${this.api987}/v1/Cobranza/ObtenerCobranzaPorId?idcobranza=${id}`)
    }

    createcobranza(data : ICobranzaPorId):Observable<any>{
        return this.http.post<ICobranzaPorId>(`${this.api987}/v1/Cobranza/InsertarCobranza`, data)
    }
 
    updateCobranza(data : ICobranzaPorId):Observable<any>{ 
        return this.http.post<ICobranzaPorId>(`${this.api987}/v1/Cobranza/ActualizarCobranza`, data)
    }
 
    deleteCobranza( data : any){
        return this.http.post(`${this.api987}/v1/Cobranza/EliminarCobranza `, { idCobranza : data})
    } 

    generarReporte(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/CobranzaReport/ObtenerCobranza?hayFechaHora=${data.fechaHora}&cobranzaID=${data.cobranzaID}&correlativo=${data.correlativo}`, null)  
    }

}