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
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingCompras/ObtenerReporteComprasSUNAT`, { params }); 
    }  
      
    generarReporteProveedorAnalitico(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        if(data.f1){
            params = params.append('f1', data.f1);
        }
        if(data.f2){
            params = params.append('f2', data.f2);  
        }
        if(data.proveedorid){
            params = params.append('proveedorid', data.proveedorid);
        }  
        if(data.lineaid){
            params = params.append('lineaid', data.lineaid.id);
        }   
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingCompras/ObtenerReporteComprasPorProveedorAnalitico`, { params });
    }


    generarReporteProductoResumen(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);  
        if(data.productoid){
            params = params.append('productoid', data.productoid);
        }    
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingCompras/ObtenerReporteComprasPorProductoResumen`, { params });
    }

    generarReporteProductoAnalitico(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        if(data.f1){
            params = params.append('f1', data.f1);
        }
        if(data.f2){
            params = params.append('f2', data.f2);  
        }
        if(data.proveedorid){
            params = params.append('proveedorid', data.proveedorid);
        }  
        if(data.lineaid){
            params = params.append('lineaid', data.lineaid.id);
        }    
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingCompras/ObtenerReporteComprasPorProductoAnalitico`, { params });
    } 


    generarReporteProveedorDAOTResumen(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);  
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingCompras/ObtenerComprasPorProveedorResumenDAOT`, { params });
    }
 
    generarReporteProveedorDAOTAnalitico(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);  
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingCompras/ObtenerComprasPorProveedoAnaliticoDAOT`, { params });
    } 
  
  

    generarReporteDetraccion(data: any){
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);  
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingCompras/ObtenerReporteComprasDetraccion`, { params });
    } 

    
    generarReporteProveedor(data:any){ 
        let params = new HttpParams();
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        return this.http.get<IModuloReporte>(`${this.apireporte991}/v1/ReportingCompras/ObtenerReporteProveedores`, { params });
    } 
 
}