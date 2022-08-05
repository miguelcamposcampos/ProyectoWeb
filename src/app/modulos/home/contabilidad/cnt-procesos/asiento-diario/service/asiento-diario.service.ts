import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";     
import { ICrearAsientoDiario, IListAsientoDiario } from "../interface/asiento-diario.interface";
 
@Injectable({
    providedIn: 'root'
})


export class AsientoDiarioService {
    private api987 : string = environment.apiUrl987

    constructor(
        private http : HttpClient
    ){}

    list(data: any): Observable<IListAsientoDiario>{ 
        let params = new HttpParams();
        params = params.append('paginaindex', data.paginaindex);
        params = params.append('itemsxpagina', data.itemsxpagina);
        params = params.append('incluyeDiarios', true);
        params = params.append('incluyeTesorerias', false);
        params = params.append('f1', data.finicio);
        params = params.append('f2', data.ffin);  
        return this.http.get<IListAsientoDiario>(`${this.api987}/Contabilidad/ObtenerConsultaAsientosQuery`, {params}); 
    } 

    asientosoreriaId(id: number): Observable<ICrearAsientoDiario>{
        return this.http.get<ICrearAsientoDiario>(`${this.api987}/Contabilidad/ObtenerAsientoPorId?asientoid==${id}`);
    }
 
    save(data: any):Observable<any>{
        return this.http.post<any>(`${this.api987}/Contabilidad/InsertarAsiento`, data);
    }

    update(data: any):Observable<any>{
        return this.http.post<any>(`${this.api987}/Contabilidad/ActualizarAsiento`, data);
    }
 
    delete(asientoId: number){
        return this.http.post(`${this.api987}/Contabilidad/EliminarAsiento`, {asientoId});
    } 
}
 