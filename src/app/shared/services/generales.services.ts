import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http'; 
import { Observable } from 'rxjs';  
import { ICombo, IPorDni, IPorRuc, IUbicaciones } from '../interfaces/generales.interfaces';
import { IListadoStock } from 'src/app/modulos/home/almacen/a-procesos/consulta-stock/interface/consultastock.interface';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class GeneralService {
 
  private apiIP: string = environment.apiUrl;
  private api987: string = environment.apiUrl987;
  
  constructor(
    private http : HttpClient,
    private swal : MensajesSwalService,
    private router : Router,
  ) { }

  /* VALIDAR OTRO INICIO DE SESION */
  onValidarOtraSesion(error : any){ 
    if(error.error.status === 403){ 
      this.swal.mensajeCaducoSesion().then((response) => { 
        if (response.isConfirmed) { 
            this.router.navigate(['/auth']);
        }
      });
    }else if(error.error.status === 404){ 
      this.swal.mensajeError('No se encontraron datos...');
    }else if(error.error.status === 401){ 
      this.swal.mensajeCaducoSesion().then((response) => { 
        if (response.isConfirmed) { 
            this.router.navigate(['/auth']);
        }
      });
    }else{
      let Errores 
      console.log(' ERROR',error); 
      if(error.errors){ 
        Errores = JSON.stringify(error.errors) 
      }else if(error.error.errors){ 
        Errores = JSON.stringify(error.error.errors) 
      }else { 
        Errores = JSON.stringify(error.error) 
      }

      this.swal.mensajeError(Errores);
      return;
    }
 
  }
 
  /* GENERAL */
  listadoPorGrupo(grupo : string): Observable<ICombo[]>{
    return this.http.get<ICombo[]>(`${this.apiIP}/v1/Datahierarchy/ObtenerDatahierarchyPorGrupo?grupo=${grupo}`);
  }

 
  listaDepartamento(){
      return this.http.get<any>(`${this.api987}/Ubigeo/ListarDepartamentos`);
  }

  listaProvincias(ubicacion : IUbicaciones){
    return this.http.get<any>(`${this.api987}/Ubigeo/ListarProvincias?departamento=${ubicacion}`);
    // return this.http.get<any>(`${this.api987}/Ubigeo/ListarProvincias?departamento=${ubicacion.departamento}`);
 }

 listaDistritos(departamento,provincia){
    return this.http.get<any>(`${this.api987}/Ubigeo/ListarDistritos?departamento=${departamento}&provincia=${provincia}`);
    // return this.http.get<any>(`${this.api987}/Ubigeo/ListarDistritos?departamento=${ubicacion.departamento}&provincia=${ubicacion.provincia}`);
 }

 listaUbigeo(departamento,provincia,distrito ){
    return this.http.get<any>(`${this.api987}/Ubigeo/UbigeoPorLocacion?departamento=${departamento}&provincia=${provincia}&distrito=${distrito}`);
    // return this.http.get<any>(`${this.api987}/Ubigeo/UbigeoPorLocacion?departamento=${ubicacion.departamento}&provincia=${ubicacion.provincia}&distrito=${ubicacion.distrito}`);
 }
 

 consultaPorDni(dni : number): Observable<IPorDni>{
    return this.http.get<IPorDni>(`${this.apiIP}/v1/Consultas/ObtenerDataDNI?dni=${dni}`);
 }
  
 consultarPorRuc(ruc: number): Observable<IPorRuc>{
    return this.http.get<IPorRuc>(`${this.apiIP}/v1/Consultas/ObtenerDataRUC?ruc=${ruc}`);
 }

 listadoLineas(): Observable<ICombo[]>{
   return this.http.get<ICombo[]>(`${this.api987}/v1/Producto/ObtenerLineasParaCombo`)
 }

 listadoColores(): Observable<ICombo[]>{
   return this.http.get<ICombo[]>(`${this.api987}/v1/Producto/ObtenerColoresParaCombo`)
 }
 
 listadoUnidadMedida(): Observable<ICombo[]>{
   return this.http.get<ICombo[]>(`${this.api987}/v1/EstablecimientoAlmacen/ObtenerUnidadMedidaParaCombo`)
 }

 listadoAlmacenes(): Observable<ICombo[]>{
  return this.http.get<ICombo[]>(`${this.api987}/v1/EstablecimientoAlmacen/ObtenerAlmacenesParaCombo`)
}

listadoAlmacenesParams(id : number): Observable<ICombo[]>{
  return this.http.get<ICombo[]>(`${this.api987}/v1/EstablecimientoAlmacen/ObtenerAlmacenesParaCombo?idestablecimiento=${id}`)
}




 listadoComboSerie(): Observable<ICombo[]>{
  return this.http.get<ICombo[]>(`${this.api987}/v1/Documento/ObtenerDocumentosParaCombo`)
}


listadoDocumentoPortipoParacombo(data: any): Observable<ICombo[]>{
  let params = new HttpParams();
  if(data.esNotaCredito){
    params = params.append('esNotaCredito', data.esNotaCredito);
  }
  if(data.esUsadoCompras){
    params = params.append('esUsadoCompras', data.esUsadoCompras);
  }
  if(data.esUsadoVentas){
    params = params.append('esUsadoVentas', data.esUsadoVentas);
  }
  if(data.esPedido){
    params = params.append('esPedido', data.esPedido);
  }
  if(data.esCotizacion){
    params = params.append('esCotizacion', data.esCotizacion);
  }
  if(data.esOrdenCompra){
    params = params.append('esOrdenCompra', data.esOrdenCompra);
  }
  if(data.esGuiaRemision){
    params = params.append('esGuiaRemision', data.esGuiaRemision);
  }
  if(data.esAnticipo){
    params = params.append('esAnticipo', data.esAnticipo);
  }
  if(data.esCajaBanco){
    params = params.append('escajabanco', data.esCajaBanco);
  }
  if(data.requiereSerieNro){
    params = params.append('requiereSerieNro', data.requiereSerieNro);
  }
  if(data.esNotaIngresoAlmacen){
    params = params.append('esNotaIngresoAlmacen', data.esNotaIngresoAlmacen);
  }
  if(data.esNotaSalidaAlmacen){
    params = params.append('esNotaSalidaAlmacen', data.esNotaSalidaAlmacen); 
  }
  if(data.usadoReciboHonorario){
    params = params.append('usadoReciboHonorario', data.usadoReciboHonorario); 
  }
  return this.http.get<ICombo[]>(`${this.api987}/v1/Documento/ObtenerDocumentoPorTipoParaCombo`, {params})
}

listadoComboEstablecimientos(): Observable<ICombo[]>{
  return this.http.get<ICombo[]>(`${this.api987}/v1/EstablecimientoAlmacen/ObtenerEstablecimientosParaCombo`)
}

listadoSeriePorDocumentocombo(data :any): Observable<ICombo[]>{
  return this.http.get<ICombo[]>(`${this.api987}/v1/EstablecimientoAlmacen/ObtenerSeriesPorDocumentoParaCombo?idestablecimiento=${data.idestablecimiento}&tipodocumentoid=${data.tipodocumentoid}`)
}

listadoCondicionPagoParaCombo(): Observable<ICombo[]>{
  return this.http.get<ICombo[]>(`${this.api987}/CondicionPago/ObtenerCondicionPagoParaCombo`)
}
 


listarChoferCombo(idTransportista :any): Observable<ICombo[]>{
  return this.http.get<ICombo[]>(`${this.api987}/v1/GuiaRemision/ObtenerChoferParaCombo?transportistaid=${idTransportista}`)
}

listarUndTransporteCombo(idTransportista :any): Observable<ICombo[]>{
  return this.http.get<ICombo[]>(`${this.api987}/v1/GuiaRemision/ObtenerTransportistaUnidadParaCombo?transportistaid=${idTransportista}`)
}


listarubigeo(ubigeo : number){
  return this.http.get(`${this.api987}/Ubigeo/LocacionPorUbigeo?ubigeo=${ubigeo}`) 
}


BuscarProductoPorCodigo(data: any): Observable<IListadoStock>{  
  return this.http.post<IListadoStock>(`${this.api987}/v1/Producto/ObtenerProductoStockConsulta?periodo=${data.periodo}&criteriodescripcion=${data.criteriodescripcion}`, [-1] )
}

}
 