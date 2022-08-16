import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";  
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";   
import { IModuloReporteContabilidad } from "../../../almacen/a-mantenimientos/productos/interface/producto.interface";

@Injectable({
    providedIn: 'root'
})

export class ReportesContabilidadService{  
    private apireporte991 = environment.apireporte991;

    constructor(
        private http : HttpClient
    ){}

    generarReporteAnalisisCuenta(data: any){   
        let OjbParams = {
            fechaHasta:  data.fechaHasta,
            nrodocanexo: data.nrodocanexo,
            solocondetalle: data.solocondetalle
        }

        return this.http.post<IModuloReporteContabilidad>(`${this.apireporte991}/ReportingContabilidad/ObtenerReporteAnalisisCuentas?tipoPresentacion=${data.tipoPresentacion}`, OjbParams);
    }  
 
    /* PDF Y EXCEL DE SUNAT */
    generarReporteAnalisisCuentaAnalitico(data: any): Observable<any>{ 
        let OjbParams = {
            fechaHasta:  data.fechaHasta,
            nrodocanexo: data.nrodocanexo,
            solocondetalle: data.solocondetalle
        }
        return this.http.post<IModuloReporteContabilidad>(`${this.apireporte991}/ReportingContabilidad/ObtenerReporteAnalisisCuentasAnalitico?tipoPresentacion=${data.tipoPresentacion}&agrupamiento=${data.agrupamiento}`, OjbParams );
    }   
}''