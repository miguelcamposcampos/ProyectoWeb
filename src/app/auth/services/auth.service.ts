import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAuth } from '../interface/auth.interface'; 
import * as CryptoJS from 'crypto-js'; 
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl : string = environment.apiUrl; 

  set accessToken(data: any) { 
    localStorage.setItem('token', data.token);
    localStorage.setItem('estado', data.estado); 
  }

  get accessToken(): string {
    return localStorage.getItem('token') ?? '';
  }
 
  private claveCifrar = ''; 
  
  constructor(
    private http : HttpClient, 
    private router : Router
  ) { }
 
  cifrarData(data: any): any {
    try {
      if (!data) {
        return '';
      }
      if (data.toString() === '') {
        return '';
      } 
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.claveCifrar).toString();
    } catch (e) {
      console.error(e);
    }
  }

  desCifrarData(data: string): any {
    let dataDesencriptada: any;
    try {
      if (!data) {
        return '';
      }
      if (data.toString() === '') {
        return '';
      }

      const bytes = CryptoJS.AES.decrypt(data, this.claveCifrar);
      if (bytes.toString()) {
        dataDesencriptada = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return dataDesencriptada;
      }
      return data;

    } catch (e) {
      console.error(e);
    }
  }
 

  verificarAutenticacion(): Observable<boolean>{
    if(!localStorage.getItem('token')){  
      return of(false);
    }else{
      return of(true);
    }
  }
 
  login(data : IAuth): Observable<IAuth>{    
    //grabamos los datos del login para luego consumirlos y generar un token con el guid de la empresa
    const LoginEncryptado : any = {
      email: this.cifrarData(data.email),
      password : this.cifrarData(data.passwordDesencriptado)
    }
    localStorage.setItem('loginEncryptado', JSON.stringify(LoginEncryptado));   
    return this.http.post<IAuth>(`${this.baseUrl}/v1/Seguridad/AutenticarUsuario`, data).pipe( 
      switchMap((response: any) => {  
        this.accessToken = response;
        return of(response);
      })
    );
  }

 

}
