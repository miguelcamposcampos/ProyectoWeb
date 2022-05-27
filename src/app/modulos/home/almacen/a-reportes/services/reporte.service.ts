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
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingAlmacen/ObtenerReporteKardexFisico?tipoPresentacion=${data.tipoPresentacion}&modalidad=${data.modalidad}&f1=${data.f1}&f2=${data.f2}&monedareporte=${data.monedareporte}`)
    } 

    generarReporteStock(data: any){
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingAlmacen/ObtenerReporteStockFisico?tipoPresentacion=${data.tipoPresentacion}&modalidad=${data.modalidad}&periodo=${data.periodo}&monedareporte=${data.monedareporte}`)
    } 

    generarReporteIngresosySalidasAlmacen(data: any){
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingAlmacen/ObtenerReporteMovimientos?tipoPresentacion=${data.tipoPresentacion}&f1=${data.f1}&f2=${data.f2}&tipoMovimiento=${data.tipoMovimiento}&agrupamiento=${data.agrupador}`)
    } 

    // generarReporteSalidasAlmacen(data: any){
    //     return this.http.post<IReporte>(`${this.apireporte991}/v1/ProductoReport/ObtenerReporteProducto?idlinea=${data.guiaremisionid}&orderBy=${data.guiaremisionid}&estado=${data.guiaremisionid}&tipoProducto=${data.guiaremisionid}&hayFechaHora=${data.guiaremisionid}&byLine=${data.guiaremisionid}&productoCodigo=${data.guiaremisionid}`, null)
    // } 

    generarReporteReposicionMercaderia(data: any){
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingAlmacen/ObtenerReporteReposicionMercaderia?tipoPresentacion=${data.tipoPresentacion}&f1=${data.f1}&f2=${data.f2}&almacenId=${data.almacen}`)
    } 
  
    generarReporteCruceInventario(data: any){
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingAlmacen/ObtenerReporteCruceInventario?tipoPresentacion=${data.tipoPresentacion}&f1=${data.f1}&f2=${data.f2}&almacenId=${data.almacen}`)
    } 
  
}