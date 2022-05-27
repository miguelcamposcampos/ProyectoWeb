import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs"; 
import { environment } from "src/environments/environment";
import { IListadoStock, IStcokPivoteado } from "../interface/consultastock.interface";

@Injectable({
    providedIn: 'root'
})

export class ConsultaStockService {

    private api987 = environment.apiUrl987;

    constructor(
        private http : HttpClient
    ){}


    listadoStock(data : any): Observable<IListadoStock[]>{  
        return this.http.post<IListadoStock[]>(`${this.api987}/v1/Producto/ObtenerProductoStockConsulta?periodo=${data.periodo}&criteriodescripcion=${data.criteriodescripcion}&soloservicios=${data.soloservicios}`, data.arrayAlmacenes)
    }

    listadoStockPivoteado(data : any): Observable<IStcokPivoteado[]>{  
        return this.http.get<IStcokPivoteado[]>(`${this.api987}/v1/Producto/ObtenerProductoStockConsultaPivoteado?periodo=${data}`)
    }
}

 