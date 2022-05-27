import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs"; 
import { environment } from "src/environments/environment";    
import { ICrearRxh, IListarRxh, IRxhPorId } from "../interface/reciboporhonorario.interface";

@Injectable({
    providedIn: 'root'
})

export class ReciboPorHonorarioService{

    private api987 = environment.apiUrl987;  
    constructor(
        private http : HttpClient
    ){}



    /* APIS PARA reciboPorHonorario */

    listadoReciboPorHonorario(data :any): Observable<IListarRxh>{
        let params = new HttpParams();
        params = params.append('paginaindex', data.paginaindex);
        params = params.append('itemsxpagina', data.itemsxpagina);
        params = params.append('f1', data.finicio);
        params = params.append('f2', data.ffin);  
        if(data.proveedorid){
            params = params.append('proveedorid', data.proveedorid);
        } 

        return this.http.get<IListarRxh>(`${this.api987}/ReciboHonorarios/ObtenerConsultaReciboHonorario`, { params: params }); 
    } 

    reciboPorHonorarioPorId(id :number){
        return this.http.get<IRxhPorId>(`${this.api987}/v1/Rxh/ObtenerRxhPorId?idRxh=${id}`)
    }

    createRxh(data : ICrearRxh):Observable<any>{
        return this.http.post<ICrearRxh>(`${this.api987}/v1/Rxh/InsertarRxh`, data)
    }
 
    updateRxh(data : ICrearRxh):Observable<any>{ 
        return this.http.post<ICrearRxh>(`${this.api987}/v1/Rxh/ActualizarRxh`, data)
    }
 
    deleteRxh( id : number){
        return this.http.post(`${this.api987}/v1/Rxh/EliminarRxh `, { idRxh : id})
    }
   
 
 

    
}