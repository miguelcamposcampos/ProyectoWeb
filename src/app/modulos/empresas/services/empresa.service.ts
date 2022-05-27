import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { IEmpresa, IEmpresaporRuc} from '../interface/empresa.interface';


@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private apimarketsol : string = environment.apiUrl;
  private apiIP: string = environment.apiUrl;
  
  constructor(
    private http : HttpClient
  ) { }
 
  /* GENERAL */
  datosporRucGet(ruc: string): Observable<IEmpresaporRuc>{
    return this.http.get<IEmpresaporRuc>(`${this.apiIP}/v1/Consultas/ObtenerDataRUC?ruc=${ruc}`);
  }

 
  //GET
  empresasGet(): Observable<IEmpresa[]>{
    return this.http.get<IEmpresa[]>(`${this.apimarketsol}/v1/Empresa/ObtenerEmpresasPorUsuario`)
  }
 
  empresaPorGuid(): Observable<IEmpresa>{
    return this.http.get<IEmpresa>(`${this.apiIP}/v1/Empresa/ObtenerEmpresa`);
  }

  //POST
  empresaCreate( data: IEmpresa): Observable<IEmpresa>{ 
    return this.http.post<IEmpresa>(`${this.apiIP}/v1/Empresa/RegistrarNuevaEmpresa`, data)
  }

  empresaUpdate( data: IEmpresa): Observable<IEmpresa>{ 
    return this.http.post<IEmpresa>(`${this.apiIP}/v1/Empresa/ActualizarEmpresa`, data)
  }
  
}
