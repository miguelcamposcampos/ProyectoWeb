
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";  
import { IModuloReporte } from "../../../almacen/a-mantenimientos/productos/interface/producto.interface";
import { IConfiguracionEmpresa } from "../interface/configuracion.interface";
 
@Injectable({
    providedIn: 'root'
})

export class ConfiguracionService{

    private api987 = environment.apiUrl987;  
    private api991 = environment.apireporte991;  

    constructor(
        private http : HttpClient
    ){}


    listadoConfiguraciones(): Observable<IConfiguracionEmpresa>{ 
        return this.http.get<IConfiguracionEmpresa>(`${this.api987}/Configuracion/ObtenerConfiguracionEmpresa`); 
    }

    createConfiguracion(data : IConfiguracionEmpresa): Observable<IConfiguracionEmpresa>{ 
        return this.http.post<IConfiguracionEmpresa>(`${this.api987}/Configuracion/ActualizarConfiguracion`, data); 
    }
 
  
    generarArchivoPLE(data : any): Observable<any>{
        let params = new HttpParams();
        params = params.append('pletype', data.pletype);
        params = params.append('tipoPresentacion', data.tipoPresentacion);
        params = params.append('year', data.year);  
        params = params.append('month', data.month);  
        return this.http.get<IModuloReporte>(`${this.api991}/ReportingContabilidad/ObtenerReportePLE`, { params: params });
    }
 
 
 

}

 