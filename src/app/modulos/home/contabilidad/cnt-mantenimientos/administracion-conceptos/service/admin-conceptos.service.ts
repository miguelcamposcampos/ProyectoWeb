import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";    
import { IAdminConceptoPorId, IListAdminConcepto} from "../interface/admin-conceptos.interface"; 

@Injectable({
    providedIn: 'root'
})


export class AdministracionConceptosService {
    private api987 : string = environment.apiUrl987
    fechaActual = new Date();
    periodo = this.fechaActual.getFullYear();

    constructor(
        private http : HttpClient
    ){}

    list(): Observable<IListAdminConcepto[]>{
        return this.http.get<IListAdminConcepto[]>(`${this.api987}/Contabilidad/ObtenerConsultaConceptoContable?periodo=${this.periodo}}`);
    }

    listId(id: number): Observable<IAdminConceptoPorId>{
        return this.http.get<IAdminConceptoPorId>(`${this.api987}/Contabilidad/ObtenerConceptoContablePorId?conceptocontableid=${id}`);
    }
 
    save(data: IAdminConceptoPorId){
        return this.http.post<IAdminConceptoPorId>(`${this.api987}/Contabilidad/InsertarConcepto`, data);
    }

    update(data: IAdminConceptoPorId){
        return this.http.post<IAdminConceptoPorId>(`${this.api987}/Contabilidad/EditarConcepto`, data);
    }
 
    delete(conceptoContableId: number){
        return this.http.post(`${this.api987}/Contabilidad/EliminarConcepto`, {conceptoContableId});
    }
 
}
 