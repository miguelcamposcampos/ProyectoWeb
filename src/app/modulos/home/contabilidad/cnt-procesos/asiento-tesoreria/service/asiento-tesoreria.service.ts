import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";     
import { ICrearAsientoTesoreria, IListAsientoTesoreria } from "../interface/asiento-tesoreria.interface";

@Injectable({
    providedIn: 'root'
})


export class AsientoTesoseriaService {
    private api987 : string = environment.apiUrl987

    constructor(
        private http : HttpClient
    ){}
 
    list(data: any): Observable<IListAsientoTesoreria>{ 
        let params = new HttpParams();
        params = params.append('paginaindex', data.paginaindex);
        params = params.append('itemsxpagina', data.itemsxpagina);
        params = params.append('incluyeDiarios', false);
        params = params.append('incluyeTesorerias', true);
        params = params.append('f1', data.finicio);
        params = params.append('f2', data.ffin);  
        return this.http.get<IListAsientoTesoreria>(`${this.api987}/Contabilidad/ObtenerConsultaAsientosQuery`, {params}); 
    } 

    asientosoreriaId(id: number): Observable<ICrearAsientoTesoreria>{
        return this.http.get<ICrearAsientoTesoreria>(`${this.api987}/Contabilidad/ObtenerPlanCuentaPorId?plancuentaid=${id}`);
    }
 
    save(data: any){
        return this.http.post(`${this.api987}/Contabilidad/InsertarCuenta`, data);
    }

    update(data: any){
        return this.http.post(`${this.api987}/Contabilidad/ActualizarCuenta`, data);
    }
 
    delete(planCuentaId: number){
        return this.http.post(`${this.api987}/Contabilidad/Eliminarcuenta`, {planCuentaId});
    } 
}
 