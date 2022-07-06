import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ICreateTipoCambio, IListaTipoCambio, ITipoCambioPorId } from "../interfaces/tipocambio.interface";

@Injectable({
    providedIn: 'root'
})


export class TipoCambioService {
    private api987 : string = environment.apiUrl987

    constructor(
        private http : HttpClient
    ){}

    listadoTipoCambio(data : any): Observable<IListaTipoCambio[]>{
        let params = new HttpParams();
        params = params.append('f1', data.f1);
        params = params.append('f2', data.f2);
        return this.http.get<IListaTipoCambio[]>(`${this.api987}/v1/TipoCambio/ObtenerTipoCambioPorRangoFechas`, {params})
    }

    listadoTipoCambioPorMes(data : any): Observable<boolean>{
        return this.http.post<boolean>(`${this.api987}/v1/TipoCambio/ObtenerTipoCambioPorMes`, { periodo : data.periodo, mes : data.mes})
    }


    TipoCambioPorId(id :number){
        return this.http.get<ITipoCambioPorId>(`${this.api987}/v1/TipoCambio/ObtenerTipoCambioPorId/${id}`)
    }

    createTipoCambio(data : ICreateTipoCambio){
        return this.http.post<ICreateTipoCambio>(`${this.api987}/v1/TipoCambio/InsertarTipoCambio`, {tiposCambio : [data] })
    }
 
    updateTipoCambio(data : ICreateTipoCambio){ 
        return this.http.post<ICreateTipoCambio>(`${this.api987}/v1/TipoCambio/ActualizarTipoCambio`, data)
    }
 
    deleteTipoCambio( id : number){
        return this.http.post(`${this.api987}/v1/TipoCambio/EliminarTipoCambio`, {id : id})
    }
}