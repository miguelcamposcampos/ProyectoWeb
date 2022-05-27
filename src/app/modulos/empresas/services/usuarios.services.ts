import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { IUsuarioInvitado, IUsuarios } from '../interface/empresa.interface';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiIP: string = environment.apiUrl;
  
  constructor(
    private http : HttpClient
  ) { }

 
  /* USUARIOS */
  usuariosPorEmpresa(): Observable<IUsuarios[]>{
    return this.http.get<IUsuarios[]>(`${this.apiIP}/v1/Empresa/ConsultaUsuariosPorEmpresa`);
  }
  
  registrarUsuarioInvitado(data :IUsuarioInvitado){
    return this.http.post<IUsuarioInvitado[]>(`${this.apiIP}/v1/Empresa/RegistrarUsuarioEmpresa`, data);
  }

  eliminarUsuarioEmpresa(id : number){
    return this.http.post(`${this.apiIP}/v1/Empresa/EliminarUsuarioEmpresa`, {usuarioEmpresaId : id});
  }
  
  suspenderActivarUsuarioEmpresa(id : number){
    return this.http.post(`${this.apiIP}/v1/Empresa/SuspenderActivarUsuarioEmpresa`, {usuarioEmpresaId : id} );
  }

  

}
