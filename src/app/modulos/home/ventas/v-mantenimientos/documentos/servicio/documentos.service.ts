import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';       
import { IListarDocumentos } from '../interface/documentos.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {
  
  private api987: string = environment.apiUrl987;    

  constructor(
    private http : HttpClient
  ) { }
   

  listadoDocumentos(data : any): Observable<IListarDocumentos[]>{ 
    return this.http.get<IListarDocumentos[]>(`${this.api987}/v1/Documento/ObtenerConsultaDocumentos?nombre=${data.nombre}&siglas=${data.siglas}`);
  }
 
 
  DocumentoPorId(id : number){
    return this.http.get<IListarDocumentos>(`${this.api987}/v1/Documento/ObtenerDocumentoPorId/${id}`);
  }
 
  crearDocumento(data: IListarDocumentos): Observable<IListarDocumentos[]>{
    return this.http.post<IListarDocumentos[]>(`${this.api987}/v1/Documento/InsertarDocumento`, data)
  }

  updateDocumento(data: IListarDocumentos): Observable<IListarDocumentos[]>{
    return this.http.post<IListarDocumentos[]>(`${this.api987}/v1/Documento/ActualizarDocumento`, data)
  }

  deleteDocumento(id : number){
    return this.http.post(`${this.api987}/v1/Documento/EliminarDocumento `, { id : id } );
  }

 
 
 
}
