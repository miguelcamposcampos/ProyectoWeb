import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";  
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";   
import { IModuloReporte, IReporte, IReporteExcel } from "../../../almacen/a-mantenimientos/productos/interface/producto.interface";

@Injectable({
    providedIn: 'root'
})

export class ReportesVentasService{ 
    private apiReporte = environment.apireporte;
    private apireporte991 = environment.apireporte991;

    constructor(
        private http : HttpClient
    ){}

    generarReporteVendedor(data: any){ 
        return this.http.post<IReporte>(`${this.apiReporte}/api/VendedorReport/ObtenerReporteVendedor?hayFechaHora=${data.fechayhora}&orderBy=${data.orderBy}`, null)
    }  
    
    /* PDF Y EXCEL DE SUNAT */
    generarReporteVentaSunat(data: any): Observable<any>{
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerVentaSunat?fechainicio=${data.f1}&fechafin=${data.f2}&idMoneda=${data.moneda}&orderPor=${data.order}`, null )
    } 
 
    generarExcelVentaSunat(data : any): Observable<any>{
        let params = new HttpParams();
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);
        params = params.append('idMoneda', data.idMoneda);
        return this.http.get<IReporteExcel>(`${this.apiReporte}/v1/VentaReport/ReporteVentaSunatExcel`, null )
      }

 
    generarReporteTransportista(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/TransportistaReport/ObtenerReporteTransporte?hayFechaHora=${data.fechayhora}&hayChofer=${data.chofer}&hayUT=${data.ut}`, null )
    }
 
    generarReporteCondicionPago(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/CondicionPagoReport/ObtenerReporteCondicionPago?hayFechaHora=${data.fechayhora}`, null )
    } 

     /* PDF Y EXCEL DE CLIENTE */
    generarReporteCliente(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/ClienteReport/ObtenerReporteCliente?hayFechaHora=${data.fechayhora}&orderBy=${data.orderBy}&tipoPersona=${data.tipoPersona}`, null )
    } 

    generarReporteExcelCliente(data: any): Observable<any>{
        return this.http.get<IReporteExcel>(`${this.apiReporte}/v1/ClienteReport/ObtenerReporteCliente?hayFechaHora=${data.fechayhora}&orderBy=${data.order}&tipoPersona=${data.tipopersona}`, null )
    }

    /* PDF Y EXCEL ESTADO CUENTA CLIENTE */
    generarReporteEstadoCuentaCliente(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/CobranzaReport/EstadoCuentaClienteCobranza?idCliente=${data.cliente}&fechaInicio=${data.f1}&fechaFin=${data.f2}`, null ) 
    } 
    generarReporteExcelEstadoCuentaCliente(data: any): Observable<any>{
        return this.http.get<IReporteExcel>(`${this.apiReporte}/v1/CobranzaReport/ObtenerPlanillaCobranzaExcel?fechaInicio=${data.f1}&fechaFin=${data.f2}` )
    }  
 
     

    generarReporteVentaPorAlmacen(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerVentaAlmacen?fechainicio=${data.f1}&fechafin=${data.f2}&establecimientoid=${data.establecimiento}`, null )
    }   
 
    generarReporteVenta(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerVenta?fechainicio=${data.f1}&fechafin=${data.f2}&idMoneda=${data.moneda}&orderPor=${data.order}&establecimientoid=${data.establecimiento}&vendedorid=${data.cliente}&documentoid=${data.documento}`, null )
    }   

    /* PDF Y EXCEL PLANILLA COBRANZA */
    generarReportePlanillaCobranza(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/CobranzaReport/ObtenerPlanillaCobranza?fechainicio=${data.f1}&fechafin=${data.f2}&documentoId=${data.documento}&porOrdenado=${data.order}`, null )
    }   
    generarReporteExcelPlanillaCobranza(data: any): Observable<any>{
        return this.http.get<IReporteExcel>(`${this.apiReporte}/v1/CobranzaReport/ObtenerPlanillaCobranzaExcel?fechainicio=${data.f1}&fechafin=${data.f2}` )
    }    

 
     generarReporteVxCDAOTanalitico(data: any){
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingVentas/ObtenerVentasPorClienteAnaliticoDAOT?tipoPresentacion=${data.presentacion}&f1=${data.f1}&f2=${data.f2}` )
    }    
  
     generarReporteVxCDAOTresumen(data: any){
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingVentas/ObtenerVentasPorClienteResumenDAOT?tipoPresentacion=${data.presentacion}&f1=${data.f1}&f2=${data.f2}` )
    }    
 
    generarReportePedidosResumen(data: any){
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingVentas/ObtenerReportePedidosResumen?tipoPresentacion=${data.presentacion}&f1=${data.f1}&f2=${data.f2}` )
    }    


    generarReportePedidosAnalitico(data: any){
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingVentas/ObtenerReportePedidosAnalitico?tipoPresentacion=${data.presentacion}&f1=${data.f1}&f2=${data.f2}` )
    }    
    
    

         
    generarReporteVendedorResumen(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerReporteVentasPorVendedorResumen?fechainicio=${data.f1}&fechafin=${data.f2}&idMoneda=${data.moneda}`, null )
    } 

    generarReporteVendedorAnalitico(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerReporteVentasPorVendedorAnalitica?fechainicio=${data.f1}&fechafin=${data.f2}&idMoneda=${data.moneda}`, null )
    } 
 

    generarReporteVentaProdcutoResumen(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerReporteVentasPorProductoResumen?fechainicio=${data.f1}&fechafin=${data.f2}&idEstablecimiento=${data.establecimiento}`, null )
    } 
 
    generarReporteVentaProdcutoResumenUtilidad(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerReporteVentasPorProductoResumenUtilidad?fechainicio=${data.f1}&fechafin=${data.f2}&idEstablecimiento=${data.establecimiento}`, null )
    } 
 
    generarReporteVentaProdcutoAnalitico(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerReporteVentasPorProductoAnalitico?fechainicio=${data.f1}&fechafin=${data.f2}`, null )
    } 
 
    generarReporteVentaClienteResumen(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerReporteVentasClienteResumen?fechainicio=${data.f1}&fechafin=${data.f2}&idMoneda=${data.moneda}&idCliente=${data.cliente}`, null )
    } 
    generarReporteVentaClienteAnalitico(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerReporteVentasClienteAnalitico?fechainicio=${data.f1}&fechafin=${data.f2}&idMoneda=${data.moneda}&idCliente=${data.cliente}`, null )
    } 
  
}