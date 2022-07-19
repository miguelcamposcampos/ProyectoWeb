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
        let params = new HttpParams();
        params = params.append('hayFechaHora', data.fechayhora);
        params = params.append('orderBy', data.orderBy); 
        return this.http.post<IReporte>(`${this.apiReporte}/api/VendedorReport/ObtenerReporteVendedor`, params);
    }  
    
    /* PDF Y EXCEL DE SUNAT */
    generarReporteVentaSunat(data: any): Observable<any>{
        let params = new HttpParams();
        params = params.append('fechainicio', data.f1);
        params = params.append('fechafin', data.f2);
        params = params.append('idMoneda', data.moneda);
        params = params.append('orderPor', data.order);
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerVentaSunat`, params);
    } 
 
    generarExcelVentaSunat(data : any): Observable<any>{
        let params = new HttpParams();
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);
        params = params.append('idMoneda', data.idMoneda);
        return this.http.get<IReporteExcel>(`${this.apiReporte}/v1/VentaReport/ReporteVentaSunatExcel`, {params});
      }

 
    generarReporteTransportista(data: any){
        let params = new HttpParams();
        params = params.append('hayFechaHora', data.fechayhora);
        params = params.append('hayChofer', data.chofer);
        params = params.append('hayUT', data.ut);
        return this.http.post<IReporte>(`${this.apiReporte}/v1/TransportistaReport/ObtenerReporteTransporte`, params); 
    }
 
    generarReporteCondicionPago(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/CondicionPagoReport/ObtenerReporteCondicionPago?hayFechaHora=${data.fechayhora}`, null )
    } 

     /* PDF Y EXCEL DE CLIENTE */
    generarReporteCliente(data: any){
        let params = new HttpParams();
        params = params.append('hayFechaHora', data.fechayhora);
        params = params.append('orderBy', data.orderBy);
        params = params.append('tipoPersona', data.tipoPersona);
        return this.http.post<IReporte>(`${this.apiReporte}/v1/ClienteReport/ObtenerReporteCliente`, params); 
    } 

    generarReporteExcelCliente(data: any): Observable<any>{
        let params = new HttpParams();
        params = params.append('hayFechaHora', data.fechayhora);
        params = params.append('orderBy', data.orderBy);
        params = params.append('tipoPersona', data.tipoPersona);
        return this.http.get<IReporteExcel>(`${this.apiReporte}/v1/ClienteReport/ObtenerReporteCliente`, {params});   
    }

    /* PDF Y EXCEL ESTADO CUENTA CLIENTE */
    generarReporteEstadoCuentaCliente(data: any){
        let params = new HttpParams();
        params = params.append('idCliente', data.cliente);
        params = params.append('fechaInicio', data.f1);
        params = params.append('fechaFin', data.f2);
        return this.http.post<IReporte>(`${this.apiReporte}/v1/CobranzaReport/EstadoCuentaClienteCobranza?idCliente=${data.cliente}&fechaInicio=${data.f1}&fechaFin=${data.f2}`, null )
    } 

    generarReporteExcelEstadoCuentaCliente(data: any): Observable<any>{
        let params = new HttpParams(); 
        params = params.append('fechaInicio', data.f1);
        params = params.append('fechaFin', data.f2);
        return this.http.get<IReporteExcel>(`${this.apiReporte}/v1/CobranzaReport/ObtenerPlanillaCobranzaExcel`, {params});   
    }  
  

    generarReporteVentaPorAlmacen(data: any){ 
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerVentaAlmacen?fechainicio=${data.f1}&fechafin=${data.f2}&establecimientoid=${data.establecimiento}`, null )
    }   
 
    generarReporteVenta(data: any){
        let params = new HttpParams(); 
        params = params.append('fechainicio', data.f1);
        params = params.append('fechafin', data.f2);
        params = params.append('idMoneda', data.moneda);
        params = params.append('orderPor', data.order);
        params = params.append('establecimientoid', data.establecimiento);
        params = params.append('vendedorid', data.cliente);
        params = params.append('documentoid', data.documento);
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerVenta`, params);   
        //?fechainicio=${data.f1}&fechafin=${data.f2}&idMoneda=${data.moneda}&orderPor=${data.order}&establecimientoid=${data.establecimiento}&vendedorid=${data.cliente}&documentoid=${data.documento}`, null )
    }   

    /* PDF Y EXCEL PLANILLA COBRANZA */
    generarReportePlanillaCobranza(data: any){
        let params = new HttpParams(); 
        params = params.append('fechainicio', data.f1);
        params = params.append('fechafin', data.f2);
        params = params.append('documentoId', data.documento);
        params = params.append('porOrdenado', data.order);
        return this.http.post<IReporte>(`${this.apiReporte}/v1/CobranzaReport/ObtenerPlanillaCobranza`, params);   
        //  ?fechainicio=${data.f1}&fechafin=${data.f2}&documentoId=${data.documento}&porOrdenado=${data.order}`, null )
    }   
    generarReporteExcelPlanillaCobranza(data: any): Observable<any>{
        let params = new HttpParams(); 
        params = params.append('fechainicio', data.f1);
        params = params.append('fechafin', data.f2);
        return this.http.get<IReporteExcel>(`${this.apiReporte}/v1/CobranzaReport/ObtenerPlanillaCobranzaExcel`, {params}); 
        // ?fechainicio=${data.f1}&fechafin=${data.f2}` )
    }    

 
     generarReporteVxCDAOTanalitico(data: any){
        let params = new HttpParams(); 
        params = params.append('tipoPresentacion', data.presentacion);
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingVentas/ObtenerVentasPorClienteAnaliticoDAOT`, {params}); 
        //  ?tipoPresentacion=${data.presentacion}&f1=${data.f1}&f2=${data.f2}` )
    }    
  
     generarReporteVxCDAOTresumen(data: any){
        let params = new HttpParams(); 
        params = params.append('tipoPresentacion', data.presentacion);
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingVentas/ObtenerVentasPorClienteResumenDAOT`, {params}); 
        // ?tipoPresentacion=${data.presentacion}&f1=${data.f1}&f2=${data.f2}` )
    }    
 
    generarReportePedidosResumen(data: any){
        let params = new HttpParams(); 
        params = params.append('tipoPresentacion', data.presentacion);
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingVentas/ObtenerReportePedidosResumen`, {params}); 
        // ?tipoPresentacion=${data.presentacion}&f1=${data.f1}&f2=${data.f2}` )
    }    


    generarReportePedidosAnalitico(data: any){
        let params = new HttpParams(); 
        params = params.append('tipoPresentacion', data.presentacion);
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingVentas/ObtenerReportePedidosAnalitico`, {params}); 
        // ?tipoPresentacion=${data.presentacion}&f1=${data.f1}&f2=${data.f2}` )
    }    
    
    

         
    generarReporteVendedorResumen(data: any){
        let params = new HttpParams(); 
        params = params.append('fechainicio', data.f1);
        params = params.append('fechafin', data.f2);
        params = params.append('idMoneda', data.moneda);
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerReporteVentasPorVendedorResumen`, params); 
        // ?fechainicio=${data.f1}&fechafin=${data.f2}&idMoneda=${data.moneda}`, null )
    } 

    generarReporteVendedorAnalitico(data: any){
        let params = new HttpParams(); 
        params = params.append('fechainicio', data.f1);
        params = params.append('fechafin', data.f2);
        params = params.append('idMoneda', data.moneda);
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerReporteVentasPorVendedorAnalitica`, params); 
        // ?fechainicio=${data.f1}&fechafin=${data.f2}&idMoneda=${data.moneda}`, null )
    } 
 

    generarReporteVentaProdcutoResumen(data: any){
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerReporteVentasPorProductoResumen?fechainicio=${data.f1}&fechafin=${data.f2}&idEstablecimiento=${data.establecimiento}`, null )
    } 
 
    generarReporteVentaProdcutoResumenUtilidad(data: any){
        // let params = new HttpParams(); 
        // params = params.append('fechainicio', data.f1);
        // params = params.append('fechafin', data.f2);
        // if(data.establecimiento){
        //     params = params.append('idEstablecimiento', data.establecimiento);
        // }
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerReporteVentasPorProductoResumenUtilidad?fechainicio=${data.f1}&fechafin=${data.f2}&idEstablecimiento=${data.establecimiento}`, null )
    } 
 
    generarReporteVentaProdcutoAnalitico(data: any){
        let params = new HttpParams(); 
        params = params.append('fechainicio', data.f1);
        params = params.append('fechafin', data.f2);
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerReporteVentasPorProductoAnalitico`, params);
        //  ?fechainicio=${data.f1}&fechafin=${data.f2}`, null )
    } 
 
    generarReporteVentaClienteResumen(data: any){
        let params = new HttpParams(); 
        params = params.append('fechainicio', data.f1);
        params = params.append('fechafin', data.f2);
        if(data.moneda){
            params = params.append('idMoneda', data.moneda.id);
        }
        if(data.cliente){
            params = params.append('idCliente', data.cliente);
        }
        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerReporteVentasClienteResumen`, params);
        //  ?fechainicio=${data.f1}&fechafin=${data.f2}&idMoneda=${data.moneda}&idCliente=${data.cliente}`, null )
    } 
    generarReporteVentaClienteAnalitico(data: any){
        let params = new HttpParams(); 
        params = params.append('fechainicio', data.f1);
        params = params.append('fechafin', data.f2);
        if(data.moneda){
            params = params.append('idMoneda', data.moneda.id);
        }
        if(data.cliente){
            params = params.append('idCliente', data.cliente);
        }

        return this.http.post<IReporte>(`${this.apiReporte}/v1/VentaReport/ObtenerReporteVentasClienteAnalitico`, params);
        //  ?fechainicio=${data.f1}&fechafin=${data.f2}&idMoneda=${data.moneda}&idCliente=${data.cliente}`, null )
    }  
}