import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";  
import { ICrearLinea, IListarLineas } from "../interface/linea.interface";

@Injectable({
    providedIn: 'root'
})


export class LineaService {
    private api987 : string = environment.apiUrl987

    constructor(
        private http : HttpClient
    ){}

     listadodeLineas(data :any): Observable<IListarLineas>{
        let params = new HttpParams();
        params = params.append('paginaIndex', data.paginaIndex);
        params = params.append('itemsPorPagina', data.itemsPorPagina);
        return this.http.get<IListarLineas>(`${this.api987}/v1/Producto/ObtenerLineasConsulta`, { params: params }); 
    }
  
    lineaPorId(id :number){
        return this.http.get<ICrearLinea>(`${this.api987}/v1/Producto/ObtenerLineaPorId/${id}`)
    }

    createLinea(data : ICrearLinea){
        return this.http.post<ICrearLinea>(`${this.api987}/v1/Producto/InsertarLinea`, data)
    }
 
    updateLinea(data : ICrearLinea){ 
        return this.http.post<ICrearLinea>(`${this.api987}/v1/Producto/ActualizarLinea`, data)
    }
 
    deleteLinea( id : number){
        return this.http.post(`${this.api987}/v1/Producto/EliminarLinea`, { idLinea : id})
    }



    //SUBLINEA

    sublineaPorId(id :number){
        return this.http.get<ICrearLinea>(`${this.api987}/v1/Producto/ObtenerLineaPorId/${id}`)
    }

    createSubLinea(data : ICrearLinea){
        return this.http.post<ICrearLinea>(`${this.api987}/v1/Producto/InsertarLinea`, data)
    }
 
    updateSubLinea(data : ICrearLinea){ 
        return this.http.post<ICrearLinea>(`${this.api987}/v1/Producto/ActualizarLinea`, data)
    }
 
    deleteSubLinea( id : number){
        return this.http.post(`${this.api987}/v1/Producto/EliminarLinea`, { idLinea : id})
    }
}