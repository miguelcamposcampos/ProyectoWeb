import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { IAlmacenPorId, ICreateEstablecimiento, IEstablecimientoCrearSerie, IEstablecimientoPorId, IEstablecimientoSeries, IListaEstablecimientos } from "../interface/establecimiento.interface";

@Injectable({
    providedIn: 'root'
})


export class EstablecimientoService {
    private api987 : string = environment.apiUrl987

    constructor(
        private http : HttpClient
    ) { }
   

    listadoEstablecimientos(data: any ): Observable<any>{
        let params = new HttpParams();
        params = params.append('pagIndex', data.pagIndex);
        params = params.append('itemsporpagina', data.itemsporpagina);
        return this.http.get<any>(`${this.api987}/v1/EstablecimientoAlmacen/ObtenerEstablecimientosConsulta`, { params: params });
    }

     
    establecimeintoPorId(id : number):Observable<IEstablecimientoPorId>{
        return this.http.get<IEstablecimientoPorId>(`${this.api987}/v1/EstablecimientoAlmacen/ObtenerEstablecimientoPorId/${id}`);
    }
    
    crearEstablecimiento(data: ICreateEstablecimiento): Observable<ICreateEstablecimiento[]>{
        return this.http.post<ICreateEstablecimiento[]>(`${this.api987}/v1/EstablecimientoAlmacen/InsertarEstablecimiento`, data)
    }

    updateEstablecimiento(data: ICreateEstablecimiento): Observable<ICreateEstablecimiento[]>{
        return this.http.post<ICreateEstablecimiento[]>(`${this.api987}/v1/EstablecimientoAlmacen/ActualizarEstablecimiento`, data)
    }



    /* SERIES */
    listarSeries(id : number):Observable<IEstablecimientoSeries[]>{
        return this.http.get<IEstablecimientoSeries[]>(`${this.api987}/v1/EstablecimientoAlmacen/ObtenerEstablecimientoSeries/${id}`);
    }
     
    seriesPorid(id : number):Observable<IEstablecimientoCrearSerie>{
        return this.http.get<IEstablecimientoCrearSerie>(`${this.api987}/v1/EstablecimientoAlmacen/ObtenerEstablecimientoSeriesPorId/${id}`);
    }
    
    crearSerie(data: IEstablecimientoCrearSerie): Observable<IEstablecimientoCrearSerie[]>{
        return this.http.post<IEstablecimientoCrearSerie[]>(`${this.api987}/v1/EstablecimientoAlmacen/InsertarEstablecimientoSerie`, data)
    }

    updateSerie(data: IEstablecimientoCrearSerie): Observable<IEstablecimientoCrearSerie[]>{
        return this.http.post<IEstablecimientoCrearSerie[]>(`${this.api987}/v1/EstablecimientoAlmacen/ActualizarEstablecimientoSerie`, data)
    }

    deleteSerie(id : number){
        return this.http.post(`${this.api987}/v1/EstablecimientoAlmacen/EliminarEstablecimientoSerie `, { id : id} ) 
    }
      


    /* ALMACENES */  
    almacenPorid(id : number):Observable<IAlmacenPorId>{
        return this.http.get<IAlmacenPorId>(`${this.api987}/v1/EstablecimientoAlmacen/ObtenerAlmacenPorId/${id}`);
    }
    
    crearAlmacen(data: IAlmacenPorId): Observable<IAlmacenPorId[]>{
        return this.http.post<IAlmacenPorId[]>(`${this.api987}/v1/EstablecimientoAlmacen/InsertarAlmacen`, data)
    }

    updateAlmacen(data: IAlmacenPorId): Observable<IAlmacenPorId[]>{
        return this.http.post<IAlmacenPorId[]>(`${this.api987}/v1/EstablecimientoAlmacen/ActualizarAlmacen`, data)
    }

    deleteAlmacen(id : number){
        return this.http.post(`${this.api987}/v1/EstablecimientoAlmacen/EliminarAlmacen`, { almacenid : id} ) 
    }
}