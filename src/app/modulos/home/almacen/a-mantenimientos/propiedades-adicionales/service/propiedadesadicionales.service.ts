import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment"; 
import { IColeccion, IColeccionPorId, IColores, IColorPorId, ICrearColeccion, ICrearColor, ICrearMateriales, ICrearTalla, ICrearTemporada, IMateriales,ITallas,ITemporadas } from "../interface/propiedadesadicionales.interface";

@Injectable({
    providedIn: 'root'
})


export class PropiedadesAdicionalesServices {
    private api987 : string = environment.apiUrl987

    constructor(
        private http : HttpClient
    ) { }

    /* COLORES */
    listadoColores(): Observable<IColores[]>{
        // let params = new HttpParams();
        // params = params.append('paginaIndex', data.paginaIndex);
        // params = params.append('itemsPorPagina', data.itemsPorPagina);
        return this.http.get<IColores[]>(`${this.api987}/v1/Producto/ObtenerColoresConsulta`);
    } 
     
    colorPorId(id : number):Observable<IColorPorId>{
        return this.http.get<IColorPorId>(`${this.api987}/v1/Producto/ObtenerColorPorId/${id}`);
    }
    
    crearColor(data: ICrearColor): Observable<ICrearColor[]>{
        return this.http.post<ICrearColor[]>(`${this.api987}/v1/Producto/InsertarColor`, data)
    }

    updateColor(data: ICrearColor): Observable<ICrearColor[]>{
        return this.http.post<ICrearColor[]>(`${this.api987}/v1/Producto/ActualizarColor`, data)
    }

    deleteColor(id : number){
        return this.http.post(`${this.api987}/v1/Producto/EliminarColor`, { idColor : id} ) 
    }


    /* TALLAS */

    listadoTalla(): Observable<ITallas[]>{
        return this.http.get<ITallas[]>(`${this.api987}/v1/Producto/ObtenerTallaConsulta`);
    } 
     
    tallaPorId(id : number):Observable<IColorPorId>{
        return this.http.get<IColorPorId>(`${this.api987}/v1/Producto/ObtenerColorPorId/${id}`);
    }
    
    crearTalla(data: ICrearTalla): Observable<ICrearTalla[]>{
        return this.http.post<ICrearTalla[]>(`${this.api987}/v1/Producto/InsertarTalla`, data)
    }

    updateTalla(data: ICrearTalla): Observable<ICrearTalla[]>{
        return this.http.post<ICrearTalla[]>(`${this.api987}/v1/Producto/ActualizarTalla`, data)
    }

    deleteTalla(id : number){
        return this.http.post(`${this.api987}/v1/Producto/EliminarTalla`, { tallaid : id} ) 
    }


    /* Temporada */
    listadoTemporada(): Observable<ITemporadas[]>{
        return this.http.get<ITemporadas[]>(`${this.api987}/v1/Producto/ObtenerTemporadaConsulta`);
    } 
     
    temporadaPorId(id : number):Observable<ICrearTemporada>{
        return this.http.get<ICrearTemporada>(`${this.api987}/v1/Producto/ObtenerColorPorId/${id}`);
    }
    
    crearTemporada(data: ICrearTemporada): Observable<ICrearTemporada[]>{
        return this.http.post<ICrearTemporada[]>(`${this.api987}/v1/Producto/InsertarTemporada`, data)
    }

    updateTemporada(data: ICrearTemporada): Observable<ICrearTemporada[]>{
        return this.http.post<ICrearTemporada[]>(`${this.api987}/v1/Producto/ActualizarTemporada`, data)
    }

    deleteTemporada(id : number){
        return this.http.post(`${this.api987}/v1/Producto/EliminarTemporada`, { temporadaid : id} ) 
    }


    /* Material */
    listadoMaterial(): Observable<IMateriales[]>{
        return this.http.get<IMateriales[]>(`${this.api987}/v1/Producto/ObtenerMaterialConsulta`);
    } 
     
    materialesPorId(id : number):Observable<ICrearMateriales>{
        return this.http.get<ICrearMateriales>(`${this.api987}/v1/Producto/ObtenerColorPorId/${id}`);
    }
    
    crearMaterial(data: ICrearMateriales): Observable<ICrearMateriales[]>{
        return this.http.post<ICrearMateriales[]>(`${this.api987}/v1/Producto/InsertarMaterial`, data)
    }

    updateMaterial(data: ICrearMateriales): Observable<ICrearMateriales[]>{
        return this.http.post<ICrearMateriales[]>(`${this.api987}/v1/Producto/ActualizarMaterial`, data)
    }

    deleteMaterial(id : number){
        return this.http.post(`${this.api987}/v1/Producto/EliminarMaterial`, { materialid : id} ) 
    }



    /* Coleccion */
    listadoColeccion(): Observable<IColeccion[]>{
        return this.http.get<IColeccion[]>(`${this.api987}/v1/Producto/ObtenerColeccionConsulta`);
    } 
        
    coleccionPorId(id : number):Observable<IColeccionPorId>{
        return this.http.get<IColeccionPorId>(`${this.api987}/v1/Producto/ObtenerColorPorId/${id}`);
    }
    
    crearColeccion(data: ICrearColeccion): Observable<ICrearColeccion>{
        return this.http.post<ICrearColeccion>(`${this.api987}/v1/Producto/InsertarColeccion`, data)
    }

    updateColeccion(data: ICrearColeccion): Observable<ICrearColeccion>{
        return this.http.post<ICrearColeccion>(`${this.api987}/v1/Producto/ActualizarColeccion`, data)
    }

    deleteColeccion(id : number){
        return this.http.post(`${this.api987}/v1/Producto/EliminarColeccion`, { coleccionid : id} ) 
    }

      
}