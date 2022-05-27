import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment"; 
import { ICrearMarca, IListarMarcas } from "../interface/marca.interface";

@Injectable({
    providedIn: 'root'
})


export class MarcaService {
    private api987 : string = environment.apiUrl987

    constructor(
        private http : HttpClient
    ){}

     listadodeMarcas(): Observable<IListarMarcas[]>{
        return this.http.get<IListarMarcas[]>(`${this.api987}/v1/Producto/ObtenerMarcaConsulta`)
    }
  
    marcaPorId(id :number){
        return this.http.get<ICrearMarca>(`${this.api987}/v1/Producto/ObtenerMarcaPorId/${id}`)
    }

    createMarca(data : ICrearMarca){
        return this.http.post<ICrearMarca>(`${this.api987}/v1/Producto/InsertarMarca`, data)
    }
 
    updateMarca(data : ICrearMarca){ 
        return this.http.post<ICrearMarca>(`${this.api987}/v1/Producto/ActualizarMarca`, data)
    }
 
    deleteMarca( id : number){
        return this.http.post(`${this.api987}/v1/Producto/EliminarMarca`, { marcaid : id})
    }
}