import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";  
import { ICrearCentroCosto, IListarCentroCosto } from "../interface/centrocosto.interface";
@Injectable({
    providedIn: 'root'
})


export class CentroCostoService {
    private api987 : string = environment.apiUrl987

    constructor(
        private http : HttpClient
    ){}

    listadoCentroCosto(criterio : string): Observable<IListarCentroCosto[]>{
        return this.http.get<IListarCentroCosto[]>(`${this.api987}/ReciboHonorarios/ObtenerConsultaCentroCosto?criterio=${criterio}`)
    }
 
    centroCostoPorId(id :number){
        return this.http.get<ICrearCentroCosto>(`${this.api987}/ReciboHonorarios/ObtenerCentroCostoPorId?centrocostoid=${id}`)
    }
 
    crearCentroCosto(data : ICrearCentroCosto){
        return this.http.post<ICrearCentroCosto>(`${this.api987}/ReciboHonorarios/ActualizarCentroCosto`, data)
    } 
 
    deletCentroCosto( id : number){
        return this.http.post(`${this.api987}/ReciboHonorarios/EliminarCentroCosto`, { id : id})
    }
}