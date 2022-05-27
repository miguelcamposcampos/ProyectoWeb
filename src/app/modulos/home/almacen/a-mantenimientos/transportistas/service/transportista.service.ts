import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs'; 
import { ICrearChofer, ICrearTransportista, ICrearUnidadTransporte, IListaTransportista } from '../interface/transportista.interface';


@Injectable({
  providedIn: 'root'
})
export class TransportistaService {
  
  private api987: string = environment.apiUrl987;  
  constructor(
    private http : HttpClient
  ) { }
 
  
  /*************
    TRANSPORTISTAS  
  ************/

  listadoTransportistas(criterio : string ): Observable<any[]>{
    return this.http.get<any[]>(`${this.api987}/v1/GuiaRemision/ObtenerTransportistaConsulta/${criterio}`, );
  }

  transportistaporId(id : number){
    return this.http.get<ICrearTransportista>(`${this.api987}/v1/GuiaRemision/ObtenerTransportistaPorId/${id}`);
  }

  grabarTransportista( data: ICrearTransportista): Observable<IListaTransportista[]>{ 
    return this.http.post<IListaTransportista[]>(`${this.api987}/v1/GuiaRemision/InsertarTransportista`, data)
  }

  updateTransportista(data: ICrearTransportista): Observable<IListaTransportista[]>{
    return this.http.post<IListaTransportista[]>(`${this.api987}/v1/GuiaRemision/ActualizarTransportista`, data)
  }

  deleteTransportista(id : number){
    return this.http.post(`${this.api987}/v1/GuiaRemision/EliminarTransportista`, { transportistaId : id } );
  }



 
  /*************
    CHOFERES  
  ************/
  choferporId(id : number){
    return this.http.get<ICrearChofer>(`${this.api987}/v1/GuiaRemision/ObtenerChoferPorId/${id}`);
  }

  grabarChofer( data: ICrearChofer): Observable<ICrearChofer[]>{ 
    return this.http.post<ICrearChofer[]>(`${this.api987}/v1/GuiaRemision/InsertarChofer`, data)
  }

  updateChofer(data: ICrearChofer): Observable<ICrearChofer[]>{
    return this.http.post<ICrearChofer[]>(`${this.api987}/v1/GuiaRemision/ActualizarChofer`, data)
  }

  deleteChofer(id : number){
    return this.http.post(`${this.api987}/v1/GuiaRemision/EliminarChofer `, { id : id } );
  }



 /*************
   UNIDAD DE TRANSPORTE 
  ************/
 
  unidadTransporteporId(id : number){
    return this.http.get<ICrearUnidadTransporte>(`${this.api987}/v1/GuiaRemision/ObtenerTransportistaUnidadPorId/${id}`);
  }

  grabarUnidadTransporte( data: ICrearUnidadTransporte): Observable<ICrearUnidadTransporte>{ 
    return this.http.post<ICrearUnidadTransporte>(`${this.api987}/v1/GuiaRemision/InsertarTransportistaUnidad`, data)
  }

  updateUnidadTransporte(data: ICrearUnidadTransporte): Observable<ICrearUnidadTransporte>{
    return this.http.post<ICrearUnidadTransporte>(`${this.api987}/v1/GuiaRemision/ActualizarTransportistaUnidad`, data)
  }

  deleteUnidadTransporte(id : number){
    return this.http.post(`${this.api987}/v1/GuiaRemision/EliminarTransportistaUnidad   `, { id : id } );
  }
 

}
