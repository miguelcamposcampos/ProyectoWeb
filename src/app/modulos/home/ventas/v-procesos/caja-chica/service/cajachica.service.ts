import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs"; 
import { environment } from "src/environments/environment";    
import { ICajaChicaPorID, ICrearCajaChica, IListaCajaChica } from "../interface/cajachica.interface";

@Injectable({
    providedIn: 'root'
})

export class CajaChicasService{

    private api987 = environment.apiUrl987;  
    constructor(
        private http : HttpClient
    ){}

 
    listadoCajaChica(data :any): Observable<IListaCajaChica>{
        let params = new HttpParams(); 
        params = params.append('f1', data.finicio);
        params = params.append('f2', data.ffin);  
        params = params.append('paginaIndex', data.paginaIndex);  
        params = params.append('itemsxpagina', data.itemsxpagina);  
        return this.http.get<IListaCajaChica>(`${this.api987}/v1/CajaChica/ObtenerConsultaCajaChica`, { params }); 
    }
  
    cajaChicaPorId(id :number){
        return this.http.get<ICajaChicaPorID>(`${this.api987}/v1/CajaChica/ObtenerCajaChicaPorId/${id}`)
    }

    createCajaChica(data : ICrearCajaChica):Observable<any>{
        return this.http.post<ICrearCajaChica>(`${this.api987}/v1/CajaChica/InsertarCajaChica`, data)
    }
 
    updateCajaChica(data : ICrearCajaChica):Observable<any>{ 
        return this.http.post<ICrearCajaChica>(`${this.api987}/v1/CajaChica/ActualizarCajaChica`, data)
    }
 
    deleteCajaChica( id : number){
        return this.http.post(`${this.api987}/v1/CajaChica/EliminarCajaChica `, { cajaChicaId : id})
    } 
   
}