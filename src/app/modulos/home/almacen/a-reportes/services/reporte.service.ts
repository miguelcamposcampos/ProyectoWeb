import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";  
import { environment } from "src/environments/environment";  
import { IModuloReporte, IReporte } from "../../a-mantenimientos/productos/interface/producto.interface";

@Injectable({
    providedIn: 'root'
})

export class ReportesAlmacenService{ 
    private apiReporte = environment.apireporte;
    private apireporte991 = environment.apireporte991;

    constructor(
        private http : HttpClient
    ){}

 
    generarReporteProductos(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/ProductoReport/ObtenerReporteProducto?idlinea=${data.idlinea}&orderBy=${data.orderBy}&estado=${data.estado}&tipoProducto=${data.tipoProducto}&hayFechaHora=${data.hayFechaHora}&byLine=${data.byLine}&productoCodigo=${data.productoCodigo}`, null)
    } 

    generarReporteLineas(fechahora: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/LineaReport/ObtenerReporteLinea?hayFechaHora=${fechahora}`, null)
    } 

    generarReporteUnidadMedida(fechahora: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/UMReport/ObtenerReporteUM?hayFechaHora=${fechahora}`, null)
    } 

    generarReporteKardex(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        params = params.append('modalidad', data.modalidad.codigo);
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);

        if(data.establecimientoId){
          params = params.append('establecimientoId', data.establecimientoId.id);
        }
        if(data.productoid){
            params = params.append('productoid', data.productoid.id);
        }
        if(data.lineaid){
        params = params.append('lineaid', data.lineaid.id);
        }
        if(data.monedareporte){
        params = params.append('monedareporte', data.monedareporte.codigo);
        } 
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingAlmacen/ObtenerReporteKardexFisico`, {params})
    } 

    generarReporteStock(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        params = params.append('modalidad', data.modalidad.codigo);
        
        if(data.periodo){
          params = params.append('periodo', data.periodo);
        }
        if(data.establecimientoId){
            params = params.append('establecimientoId', data.establecimientoId.id);
          }
        if(data.lineaid){
            params = params.append('lineaid', data.lineaid.id);
        }
        if(data.monedareporte){
            params = params.append('monedareporte', data.monedareporte.codigo);
        }  
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingAlmacen/ObtenerReporteStockFisico`, {params})
      
    } 

    generarReporteIngresosySalidasAlmacen(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion); 
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);
        params = params.append('tipoMovimiento', data.tipoMovimiento);

        if(data.agrupador){
            params = params.append('agrupamiento', data.agrupador.codigo);
        }
        if(data.establecimientoId){
            params = params.append('establecimientoId', data.establecimientoId.id);
        }
        if(data.productoid){
            params = params.append('productoid', data.productoid.id);
        }
        if(data.lineaid){
            params = params.append('lineaid', data.lineaid.id);
        }

        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingAlmacen/ObtenerReporteMovimientos`, {params}) 
    } 
 
    generarReporteReposicionMercaderia(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion); 
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);
        params = params.append('almacenId', data.almacen);
 
        if(data.lineaid){
            params = params.append('lineaid', data.lineaid.id);
        }
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingAlmacen/ObtenerReporteReposicionMercaderia`, {params}) 
        
      //  tipoPresentacion=${data.tipoPresentacion}&f1=${data.f1}&f2=${data.f2}&almacenId=${data.almacen}`)
    } 
  
    generarReporteCruceInventario(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion); 
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);
        params = params.append('almacenId ', data.almacen);
        
        if(data.lineaid){
            params = params.append('lineaid', data.lineaid.id);
        } 
        if(data.codigoProducto){
            params = params.append('productoid', data.codigoProducto);
        }
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingAlmacen/ObtenerReporteCruceInventario`, {params}) 
         //  ?tipoPresentacion=${data.tipoPresentacion}&f1=${data.f1}&f2=${data.f2}&almacenId=${data.almacen}`)
    } 
  
}