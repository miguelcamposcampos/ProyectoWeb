import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http'; 
import { Observable } from 'rxjs';   
import { ICrearVendedor, IListarVendedores } from '../interface/vendedores.interface';


@Injectable({
  providedIn: 'root'
})
export class VendedoresService {
  
  private api987: string = environment.apiUrl987;    

  constructor(
    private http : HttpClient
  ) { }
   

  listadoVendedores(data : any ): Observable<IListarVendedores>{
    let params = new HttpParams();
    params = params.append('paginaIndex', data.paginaIndex);
    params = params.append('itemsxpagina', data.itemsporpagina); 
    params = params.append('descripcion', data.descripcion); 
    return this.http.get<IListarVendedores>(`${this.api987}/v1/Vendedor/ObtenerVendedoresConsulta`, { params });
  }
 
 
  VendedorPorId(id : number){
    return this.http.get<ICrearVendedor>(`${this.api987}/v1/Vendedor/ObtenerVendedorPorId/${id}`);
  }
 
  crearVendedor(data: ICrearVendedor): Observable<ICrearVendedor[]>{
    return this.http.post<ICrearVendedor[]>(`${this.api987}/v1/Vendedor/InsertarVendedor`, data)
  }

  updateVendedor(data: ICrearVendedor): Observable<ICrearVendedor[]>{
    return this.http.post<ICrearVendedor[]>(`${this.api987}/v1/Vendedor/ActualizarVendedor`, data)
  }

  deleteVendedor(id : number){
    return this.http.post(`${this.api987}/v1/Vendedor/EliminarVendedor`, { idVendedor : id } );
  }

 
 
 
}
