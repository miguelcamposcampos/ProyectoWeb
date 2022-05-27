import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';      
import { ICrearFormasPago, IListaFormasPago } from '../interface/formaspago.interface';

@Injectable({
  providedIn: 'root'
})
export class FomrasDePagoService {
  
  private api987: string = environment.apiUrl987;    

  constructor(
    private http : HttpClient
  ) { }
   

  listadoFormaPago(criterio : string): Observable<IListaFormasPago[]>{ 
    return this.http.get<IListaFormasPago[]>(`${this.api987}/v1/Cobranza/ObtenerConsultaFormaPago?criterio=${criterio}`);
  }
 
 
  formaPagoPorId(id : number){
    return this.http.get<ICrearFormasPago>(`${this.api987}/v1/Cobranza/ObtenerFormaPagoPorId?idformapago=/${id}`);
  }
 
  crearFormaPago(data: ICrearFormasPago): Observable<ICrearFormasPago[]>{
    return this.http.post<ICrearFormasPago[]>(`${this.api987}/v1/Cobranza/ActualizarFormaPago`, data)
  }

  updateFormaPago(data: ICrearFormasPago): Observable<ICrearFormasPago[]>{
    return this.http.post<ICrearFormasPago[]>(`${this.api987}/v1/Cobranza/ActualizarFormaPago`, data)
  }

  deleteFormaPago(id : number){
    return this.http.post(`${this.api987}/v1/Cobranza/EliminarFormaPago`, { idFormaPago : id } );
  }

 
 
 
}
