import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs"; 
import { IModuloReporte } from "src/app/modulos/home/almacen/a-mantenimientos/productos/interface/producto.interface";
import { environment } from "src/environments/environment";     
import { ICreateOrdenCompra, IListaOrdenCompra, IOrdenCompraPorId } from "../interface/ordenCompra.interface";

@Injectable({
    providedIn: 'root'
})

export class OrdenCompraService{

    private api987 = environment.apiUrl987;  
    private apiReporte = environment.apireporte991;  

    constructor(
        private http : HttpClient
    ){}

 
    listadoOrdenCompra(data :any): Observable<IListaOrdenCompra>{
        let params = new HttpParams(); 
        params = params.append('paginaindex', data.paginaIndex);  
        params = params.append('itemsxpagina', data.itemsxpagina);  
        params = params.append('f1', data.finicio);
        params = params.append('f2', data.ffin);  
        params = params.append('serie', data.serie);  
        if(data.tipoDocumento){
            params = params.append('tipoDocumento', data.tipoDocId);  
        } 
        if(data.correlativo){
            params = params.append('correlativo', data.correlativo);  
        }
        if(data.proveedorid){
            params = params.append('proveedorid', data.proveedorid);  
        }
        return this.http.get<IListaOrdenCompra>(`${this.api987}/v1/Compra/ObtenerOrdenCompraConsultas`, { params }); 
    } 
   
   ordenCompraPorId(id :number){
        return this.http.get<IOrdenCompraPorId>(`${this.api987}/v1/Compra/ObtenerCompraPorId?idcompra=${id}`)
    }
  
    createOrdenCompra(data : ICreateOrdenCompra):Observable<any>{
        return this.http.post<ICreateOrdenCompra>(`${this.api987}/v1/Compra/InsertarCompra`, data)
    }
 
    updateOrdenCompra(data : ICreateOrdenCompra):Observable<any>{ 
        return this.http.post<ICreateOrdenCompra>(`${this.api987}/v1/Compra/ActualizarCompra`, data)
    }
 
    deleteOrdenCompra( id : number){
        return this.http.post(`${this.api987}/v1/Compra/EliminarCompra `, { idVenta : id})
    } 
   
    generarReporte(data: any){
        return this.http.get<IModuloReporte>(`${this.apiReporte}/v1/ReportingCompras/ObtenerReporteOrdenCompra?tipoPresentacion=${data.tipo}&idordencompra=${data.idOrdenCompra}`)
    }
}

 