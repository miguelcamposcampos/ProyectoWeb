import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IReporte } from "../../../a-mantenimientos/productos/interface/producto.interface";
import { ICrearMovimientoAlmacen, IListarAnexosMA, IListarMovimientosAlmacen, IMovimientosAlmacenPorId } from "../interface/movimientosalmacen.interface";

@Injectable({
    providedIn: 'root'
})

export class MovimientosAlmacenService{

    private api987 = environment.apiUrl987;
    private apiReporte = environment.apireporte;

    constructor(
        private http : HttpClient
    ){}


    listadodeMovimientosAlmacen(data :any): Observable<IListarMovimientosAlmacen>{
        let params = new HttpParams();
        params = params.append('paginaIndex', data.paginaIndex);
        params = params.append('itemsPorPagina', data.itemsPorPagina);
        params = params.append('finicio', data.finicio);
        params = params.append('ffin', data.ffin);
        return this.http.get<IListarMovimientosAlmacen>(`${this.api987}/v1/Movimiento/ObtenerMovimientosConsulta`, { params: params }); 
    }
  
    movimientoAlmacenPorId(id :number){
        return this.http.get<IMovimientosAlmacenPorId>(`${this.api987}/v1/Movimiento/ObtenerMovimientoPorId/${id}`)
    }

    createmovimientoAlmacen(data : ICrearMovimientoAlmacen):Observable<any>{
        return this.http.post<ICrearMovimientoAlmacen>(`${this.api987}/v1/Movimiento/InsertarMovimiento`, data)
    }
 
    updatemovimientoAlmacen(data : ICrearMovimientoAlmacen):Observable<any>{ 
        return this.http.post<ICrearMovimientoAlmacen>(`${this.api987}/v1/Movimiento/ActualizarMovimiento`, data)
    }
 
    deletemovimientoAlmacen( data : any){
        return this.http.post(`${this.api987}/v1/Movimiento/EliminarMovimiento `, { idMovimiento : data.idMovimiento, esRegeneracion : data.esRegeneracion})
    }
 

    generarReporte(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/api/MovimientoReport/ObtenerReporteMovimiento?hayFechaHora=${data.fechaHora}&idMovimiento=${data.idMovimiento}&nroRegistro=${data.nroRegistro}`, null)
    }
    // deletedetalle( data : any){
    //     return this.http.post(`${this.api987}/v1/Movimiento/EliminarMovimiento `, { idMovimiento : data.idMovimiento, esRegeneracion : data.esRegeneracion})
    // }

    
    listadoAnexosMA(data :any): Observable<IListarAnexosMA>{
        let params = new HttpParams();
        params = params.append('paginaIndex', data.paginaIndex);
        params = params.append('itemsPorPagina', data.itemsPorPagina);
        params = params.append('categoria', data.categoria);
        params = params.append('criterio', data.criterio);
        return this.http.get<IListarAnexosMA>(`${this.api987}/Anexo/ObtenerPersonaConsulta`, { params: params }); 
    }
  


}