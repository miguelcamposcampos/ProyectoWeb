import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs';
import { IDatosPlan, IEnviarNotificarPago, IPedidoPorEmpresa, IPedioCrate, IPlanEmpresa, IPlanes } from '../interface/empresa.interface';

@Injectable({
  providedIn: 'root'
})

export class PlanesService {
 
  private apiIP: string = environment.apiUrl;
  
  constructor(
    private http : HttpClient
  ) { }
 

  //PLANES
  //GET
  planesGet(): Observable<IPlanes[]>{
    return this.http.get<IPlanes[]>(`${this.apiIP}/v1/Planes/ObtenerPlanes`);
  }

  planesPorEmpresaGet(guid : string): Observable<IPlanEmpresa>{
    return this.http.get<IPlanEmpresa>(`${this.apiIP}/v1/Pedidos/ObtenerPlanActualPorEmpresa?empresaguid=${guid}`);
  }

  datosPlanPorId(planid : number ): Observable<IDatosPlan[]>{
    return this.http.get<IDatosPlan[]>(`${this.apiIP}/v1/Planes/ObtenerArticulosPorPlan?planid=${planid}`);
  }

 

  //PEDIDO
  registrarPedido(data: IPedioCrate): Observable<IPedioCrate>{ 
    return this.http.post<IPedioCrate>(`${this.apiIP}/v1/Pedidos/RegistrarNuevoPedido`, [data])
  }

  pedidosporEmpresa(guidempresa: string): Observable<IPedidoPorEmpresa[]>{ 
    return this.http.get<IPedidoPorEmpresa[]>(`${this.apiIP}/v1/Pedidos/ObtenerPedidosPorEmpresa?empresaguid=${guidempresa}`)
  }

  notificarPagoConVaucher(data: IEnviarNotificarPago){ 
    return this.http.post(`${this.apiIP}/v1/Pedidos/RegistrarNuevoPagoConVoucher`, data)
  }

  
  //MENUS 
  obtenerMenusPorUsuarioEmpresa(): Observable<any>{ 
    return this.http.get<any>(`${this.apiIP}/v1/Planes/ObtenerMenusPorUsuarioEmpresaNoIcon`)
  }


}
