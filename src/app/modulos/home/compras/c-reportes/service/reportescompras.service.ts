import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";  
import { environment } from "src/environments/environment";   
import { IModuloReporte, IReporte, IReporteExcel } from "../../../almacen/a-mantenimientos/productos/interface/producto.interface";

@Injectable({
    providedIn: 'root'
})

export class ReportesComprasService{ 
    private apiReporte = environment.apireporte;
    private apireporte991 = environment.apireporte991;

    constructor(
        private http : HttpClient
    ){}

    generarReporteFormatoSunar(data: any){ 
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);  
        params = params.append('monedareporte', data.moneda);
        if(data.agrupador){
            params = params.append('agrupamiento', data.agrupador);
        }  
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingCompras/ObtenerReporteComprasSUNAT`, { params: params }); 
    }  
      
    generarReporteProveedorAnalitico(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);  
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingCompras/ObtenerReporteComprasPorProveedorAnalitico`, { params: params });
    }


    generarReporteProductoResumen(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);  
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingCompras/ObtenerReporteComprasPorProductoResumen`, { params: params });
    }

    generarReporteProductoAnalitico(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);  
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingCompras/ObtenerReporteComprasPorProductoAnalitico`, { params: params });
    } 


    generarReporteProveedorDAOTResumen(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);  
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingCompras/ObtenerComprasPorProveedorResumenDAOT`, { params: params });
    }
 
    generarReporteProveedorDAOTAnalitico(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);  
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingCompras/ObtenerComprasPorProveedoAnaliticoDAOT`, { params: params });
    } 
  
  

    generarReporteDetraccion(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);  
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingCompras/ObtenerReporteComprasDetraccion`, { params: params });
    } 

    
    generarReporteProveedor(data:any){ 
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingCompras/ObtenerReporteProveedores`, { params: params });
    } 
 
}