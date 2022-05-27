import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment"; 
import { IReporte } from "../../../a-mantenimientos/productos/interface/producto.interface";
import { ICrearGuiasRemision, IGuiaRemisionPorId, IListarGuiasRemision } from "../interface/guiasremision.interface";
 
@Injectable({
    providedIn: 'root'
})

export class GuiaRemisionService{

    private api987 = environment.apiUrl987; 
    private apiReporte = environment.apireporte;

    constructor(
        private http : HttpClient
    ){}


    listadodeGuiasRemision(data :any): Observable<IListarGuiasRemision>{
        let params = new HttpParams();
        params = params.append('paginaindex', data.paginaindex);
        params = params.append('itemsxpagina', data.itemsxpagina);
        params = params.append('f1', data.finicio);
        params = params.append('f2', data.ffin);
        return this.http.get<IListarGuiasRemision>(`${this.api987}/v1/GuiaRemision/ObtenerGuiaRemisionConsulta`, { params: params }); 
    }
  
    guiaRemisionPorId(id :number){
        return this.http.get<IGuiaRemisionPorId>(`${this.api987}/v1/GuiaRemision/ObtenerGuiaRemisionPorId?idguiaremision=${id}`)
    }

    createguiaRemision(data : ICrearGuiasRemision):Observable<any>{
        return this.http.post<ICrearGuiasRemision>(`${this.api987}/v1/GuiaRemision/InsertarGuiaRemision`, data)
    }
 
    updateguiaRemision(data : ICrearGuiasRemision):Observable<any>{ 
        return this.http.post<any>(`${this.api987}/v1/GuiaRemision/ActualizarGuiaRemision`, data)
    }
 
    deleteguiaRemision( id  : number){
        return this.http.post(`${this.api987}/v1/GuiaRemision/EliminarGuiaRemision `, { guiaRemisionId : id})
    }
 

    generarReporte(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/GuiaRemisionReport/ObtenerGuiaRemision?guiaremisionid=${data.guiaremisionid}&nroregistro=${data.nroregistro}`, null)
    } 
    
}