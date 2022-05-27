import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";   
import { ICrearProveedor, IListaProveedores, IProveedorPorId } from "../interface/proveedor.interface";
@Injectable({
    providedIn: 'root'
})


export class ProveedorService {
    private api987 : string = environment.apiUrl987

    constructor(
        private http : HttpClient
    ){}

    listadoProveedor(data : any): Observable<IListaProveedores>{
        let params = new HttpParams();
        params = params.append('pagIndex', data.pagIndex);
        params = params.append('itemsporpagina', data.itemsporpagina);
        params = params.append('razonsocial', data.razonsocial);
        params = params.append('nrodoc', data.nrodocumento);
        return this.http.get<IListaProveedores>(`${this.api987}/v1/Proveedor/ObtenerProveedoresConsulta`, {params : params})
    }
 
    proveedorPorId(id :number){
        return this.http.get<IProveedorPorId>(`${this.api987}/v1/Proveedor/ObtenerProveedorPorId/${id}`)
    }
 
    crearProveedor(data : ICrearProveedor){
        return this.http.post<ICrearProveedor>(`${this.api987}/v1/Proveedor/InsertarProveedor`, data)
    } 
    
    updateProveedor(data : ICrearProveedor){
        return this.http.post<ICrearProveedor>(`${this.api987}/v1/Proveedor/ActualizarProveedor`, data)
    } 
 
    deletProveedor( id : number){
        return this.http.post(`${this.api987}/api/v1/Proveedor/EliminarProveedor`, { id : id})
    }
}