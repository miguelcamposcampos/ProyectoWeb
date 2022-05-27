import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment"; 
import { ICrearCliente, IListaCliente } from "../interface/clientes.interface";

@Injectable({
    providedIn: 'root'
})


export class ClienteService {
    private api987 : string = environment.apiUrl987

    constructor(
        private http : HttpClient
    ) { }

    
    listadoClientes(data: any): Observable<IListaCliente>{
        let params = new HttpParams();
        params = params.append('pagIndex', data.pagIndex);
        params = params.append('itemsporpagina', data.itemsporpagina);
        params = params.append('razonsocial', data.razonsocial);
        params = params.append('nrodoc', data.nrodoc);
        return this.http.get<IListaCliente>(`${this.api987}/v1/Cliente/ObtenerClientesConsulta`, { params: params });
    }

     
    clientePorId(id : number):Observable<ICrearCliente>{
        return this.http.get<ICrearCliente>(`${this.api987}/v1/Cliente/ObtenerClientePorId/${id}`);
    }
    
    crearCliente(data: ICrearCliente): Observable<ICrearCliente[]>{
        return this.http.post<ICrearCliente[]>(`${this.api987}/v1/Cliente/InsertarCliente`, data)
    }

    updateCliente(data: ICrearCliente): Observable<ICrearCliente[]>{
        return this.http.post<ICrearCliente[]>(`${this.api987}/v1/Cliente/ActualizarCliente`, data)
    }

    deleteCliente(id : number){
        return this.http.post(`${this.api987}/v1/Cliente/EliminarCliente`, { id : id} ) 
    }
      
}