import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";   
import { ICreateCuentasMayores, ICuentasMayores } from "../interface/cuentas-mayores.interface";
@Injectable({
    providedIn: 'root'
})


export class CuentasMayoresService {
    private api987 : string = environment.apiUrl987

    constructor(
        private http : HttpClient
    ){}

    list(): Observable<ICuentasMayores[]>{
        return this.http.get<ICuentasMayores[]>(`${this.api987}/Contabilidad/ObtenerPlanCuentasConsulta?soloCuentasMayores=true`);
    }

    listId(id : number): Observable<ICreateCuentasMayores>{
        return this.http.get<ICreateCuentasMayores>(`${this.api987}/Contabilidad/ObtenerPlanCuentaPorId?plancuentaid=${id}`);
    }

    save(data : ICreateCuentasMayores): Observable<any>{
        return this.http.post<ICreateCuentasMayores>(`${this.api987}/Contabilidad/InsertarCuenta`, data);
    }

    update(data : ICreateCuentasMayores): Observable<any>{
        return this.http.post<ICreateCuentasMayores>(`${this.api987}/Contabilidad/ActualizarCuenta`, data);
    }
 
    delete(planCuentaId): Observable<ICuentasMayores[]>{
        return this.http.post<ICuentasMayores[]>(`${this.api987}/Contabilidad/EliminarCuenta`, {planCuentaId});
    }
}
 