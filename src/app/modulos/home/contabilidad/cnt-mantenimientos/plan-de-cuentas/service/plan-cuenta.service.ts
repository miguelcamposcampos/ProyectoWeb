import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";    
import { ICreatePlanCuenta, IListPlanCuenta, IPlantillaEXcelPlancuenta } from "../interface/plan-cuentas.interface";
@Injectable({
    providedIn: 'root'
})


export class PlanCuentaService {
    private api987 : string = environment.apiUrl987

    constructor(
        private http : HttpClient
    ){}

    list(nrocuenta: string): Observable<IListPlanCuenta[]>{
        return this.http.get<IListPlanCuenta[]>(`${this.api987}/Contabilidad/ObtenerPlanCuentasConsulta?ctamayor=${nrocuenta}`);
    }

    plancuentaId(id: number): Observable<ICreatePlanCuenta>{
        return this.http.get<ICreatePlanCuenta>(`${this.api987}/Contabilidad/ObtenerPlanCuentaPorId?plancuentaid=${id}`);
    }

    obtenernombrePlanCuenta(nrocuenta: string): Observable<ICreatePlanCuenta>{
        return this.http.get<ICreatePlanCuenta>(`${this.api987}/Contabilidad/ObtenerPlanCuentaPorNroCuenta?nrocuenta=${nrocuenta}`);
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

    
    savePlantilla(data: any){
        return this.http.post(`${this.api987}/Contabilidad/SubirPlanContable`, {data});
    }


    plantillaexcel(): Observable<IPlantillaEXcelPlancuenta>{
        return this.http.get<IPlantillaEXcelPlancuenta>(`${this.api987}/Descargas/ObtenerPlantillaExcel?tipo=PlanContable`);
     }
}
 