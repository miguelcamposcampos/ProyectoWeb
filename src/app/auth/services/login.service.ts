import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';  
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment'; 
import { IActivarCuentaUsuario, IUsuario } from '../interface/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private baseUrl : string = environment.apiUrl; 
  
  constructor(
    private http : HttpClient,
    private router : Router,
  ) { }
 
  recuperarCredenciales(email: string){    
    return this.http.post(`${this.baseUrl}/v1/Seguridad/RecuperarCredenciales?email=${email}`, null ); 
  }
  
  nuevoUsuarioCreate(usuario : IUsuario){
    return this.http.post(`${this.baseUrl}/v1/Seguridad/RegistrarNuevoUsuario`, usuario);
  }
  
  activarCuentaUsuario( data : IActivarCuentaUsuario ){
    return this.http.post(`${this.baseUrl}/v1/Seguridad/ActivarCuentaUsuario`,data);
  }

    
  reenviarCuentaUsuario( email : string ){
    return this.http.post(`${this.baseUrl}/v1/Seguridad/ReenviarActivacionCuenta?email=${email}`, null);
  }


  
  logout(){   
    localStorage.clear();  
    this.router.navigate(['/auth/login']);
  }

}
