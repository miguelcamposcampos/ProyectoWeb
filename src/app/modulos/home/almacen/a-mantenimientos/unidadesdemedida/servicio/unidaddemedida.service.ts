import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IListaUnidadMedida } from "../interfaces/unidaddemedida.interface";

@Injectable({
    providedIn : 'root'
})

export class UnidaddeMedidaService {
    private api987 : string = environment.apiUrl987

    constructor(
        private http : HttpClient
    ){}

    listadoUnidadMedida(): Observable<IListaUnidadMedida[]>{
        return this.http.get<IListaUnidadMedida[]>(`${this.api987}/v1/EstablecimientoAlmacen/ObtenerUnidadesMedida`)
    }

    unidadMedidaPorId(id :number){
        return this.http.get<IListaUnidadMedida>(`${this.api987}/v1/EstablecimientoAlmacen/ObtenerUnidadMedidaPorId/${id}`)
    }

    createUnidadMedida(data : IListaUnidadMedida){
        return this.http.post<IListaUnidadMedida>(`${this.api987}/v1/EstablecimientoAlmacen/InsertarUnidadMedida`, data)
    }
 
    updateUnidadMedida(data : IListaUnidadMedida){
        return this.http.post<IListaUnidadMedida>(`${this.api987}/v1/EstablecimientoAlmacen/ActualizarUnidadMedida`, data)
    }
 
    deleteUnidadMedida( id : number){
        return this.http.post(`${this.api987}/v1/EstablecimientoAlmacen/EliminarUnidadMedida`, {idUnidadMedida : id})
    }

}