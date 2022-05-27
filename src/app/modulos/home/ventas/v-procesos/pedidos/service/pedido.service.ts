import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IModuloReporte } from "src/app/modulos/home/almacen/a-mantenimientos/productos/interface/producto.interface";
import { environment } from "src/environments/environment";   
import { IListaPedido } from "../interface/pedido.interface";

@Injectable({
    providedIn: 'root'
})

export class PedidoService{

    private api987 = environment.apiUrl987;  
    private apiReporte = environment.apireporte991


    constructor(
        private http : HttpClient
    ){}

    
  
    listadoPedidos(data :any): Observable<IListaPedido>{
        let params = new HttpParams(); 
        params = params.append('f1', data.fechaInicio);
        params = params.append('f2', data.fechaFin);
        params = params.append('paginaindex', data.paginaindex);
        params = params.append('itemsxpagina', data.itemsxpagina); 
        if(data.serie){
            params = params.append('serie', data.serie)
        }

        if(data.correlativo){
            params = params.append('correlativo', data.correlativo)
        }
        if(data.clienteId){
            params = params.append('clienteId', data.clienteId)
        }
 
        return this.http.get<IListaPedido>(`${this.api987}/v1/Venta/ObtenerPedidosConsultas`, { params: params }); 
    } 
 
    createPedido(){

    }
 
    updatePedido(){
        
    }

     
    deletePedido( id : number){
        return this.http.post(`${this.api987}/v1/Venta/EliminarVenta `, { idVenta : id})
    }
  
 
    convertiraVenta(){
        
    }

    generarReporte(id: number){
        return this.http.get<IModuloReporte>(`${this.apiReporte}/v1/ReportingVentas/ObtenerPedidoParaImpresion?pedidoid=${id}`) 
    }

  

}