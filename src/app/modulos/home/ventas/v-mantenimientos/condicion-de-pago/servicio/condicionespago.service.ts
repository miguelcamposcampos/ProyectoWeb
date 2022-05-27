import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';    
import { IListaCondicionesPago } from '../interface/condicionespago.interface';


@Injectable({
  providedIn: 'root'
})
export class CondicionPagoService {
  
  private api987: string = environment.apiUrl987;    

  constructor(
    private http : HttpClient
  ) { }
   

  listadoCondicionPago(): Observable<IListaCondicionesPago[]>{ 
    return this.http.get<IListaCondicionesPago[]>(`${this.api987}/CondicionPago/ObtenerCondicionPagosConsulta`);
  }
 
 
  condicionPagoPorId(id : number){
    return this.http.get<IListaCondicionesPago>(`${this.api987}/CondicionPago/ObtenerCondicionPagoPorId/${id}`);
  }
 
  crearCondicionPago(data: IListaCondicionesPago): Observable<IListaCondicionesPago[]>{
    return this.http.post<IListaCondicionesPago[]>(`${this.api987}/CondicionPago/InsertarCondicionPago`, data)
  }

  updateCondicionPago(data: IListaCondicionesPago): Observable<IListaCondicionesPago[]>{
    return this.http.post<IListaCondicionesPago[]>(`${this.api987}/CondicionPago/ActualizarCondicionPago`, data)
  }

  deleteCondicionPago(id : number){
    return this.http.post(`${this.api987}/CondicionPago/EliminarCondicionPago  `, { id : id } );
  }

 
 
 
}
