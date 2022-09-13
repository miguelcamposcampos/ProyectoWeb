import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";  
import { ICrearTomaInventario, ITomaInventario } from "../interface/tomainventario.interface";

@Injectable({
    providedIn: 'root'
})

export class TomaInventarioService{

    private api987 = environment.apiUrl987; 

    constructor(
        private http : HttpClient
    ){}


    listadoTomaInventario(data :any): Observable<ITomaInventario>{
        let params = new HttpParams(); 
        params = params.append('f1', data.finicio);
        params = params.append('f2', data.ffin);
        if(data.idAlmacen){
            params = params.append('idAlmacen', data.idAlmacen.id);
        } 
        return this.http.get<ITomaInventario>(`${this.api987}/v1/Producto/ObtenerProductoInventarioConsulta`, { params }); 
    }
  

    createTomaInventario(data : ICrearTomaInventario):Observable<any>{ 
        return this.http.post<ICrearTomaInventario>(`${this.api987}/v1/Producto/RegistrarInventario`, data)
    }
  

}