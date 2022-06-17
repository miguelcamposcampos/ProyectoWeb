import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { ICambiarRol, IDatosPlan, IRolPorEmpresa} from '../interface/empresa.interface'; 


@Injectable({
  providedIn: 'root'
})
export class RolesService {

 // private apimarketsol : string = environment.apimarketsol; 
  private apiIP: string = environment.apiUrl;
  
  constructor(
    private http : HttpClient
  ) { }
 
  //ROLES
   rolesPorEmpresa(): Observable<IRolPorEmpresa[]>{
    return this.http.get<IRolPorEmpresa[]>(`${this.apiIP}/v1/Empresa/ObtenerRolesPorEmpresa`);
  }

  menuPorIdRol(idRol : number):Observable<any>{
    return this.http.get<any>(`${this.apiIP}/v1/Planes/ObtenerMenusPorEmpresa?rolId=${idRol}`);
  }

  changeRol(data : ICambiarRol){
    return this.http.post(`${this.apiIP}/v1/Empresa/CambiarRolUsuario`, data)
  }

  createRol(nombre : string ){ 
    return this.http.post(`${this.apiIP}/v1/Empresa/InsertarRolEmpresa`, {nombre: nombre})
  }

  deleteRol(idRol : number){
    return this.http.post(`${this.apiIP}/v1/Empresa/EliminarRolEmpresa`, {idRol : idRol})
  }

  activarRolMenu(data :any):Observable<any>{
    return this.http.post(`${this.apiIP}/v1/Planes/ActivarRolMenu`, {maestromenuid: data.maestromenuid, rolid: data.rolid })
  }

  desactivarRolMenu(data :any):Observable<any>{
    return this.http.post(`${this.apiIP}/v1/Planes/DesactivarRolMenu`,{maestroMenuId: data.maestromenuid, rolId: data.rolid })
  }

}
