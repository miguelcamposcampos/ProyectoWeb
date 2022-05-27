import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http'; 
import { Observable } from 'rxjs';  
import { ICreateProducto, IListaProductos, IPlantillaExcel, IReporte, IUpdateProducto } from '../interface/producto.interface';
import { IUnesco } from 'src/app/shared/interfaces/generales.interfaces';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  
  private api987: string = environment.apiUrl987;   
  private apiUnesco : string = environment.apiunesco;
  private apiReporte : string = environment.apireporte;

  constructor(
    private http : HttpClient
  ) { }
   

  listadoProductos(data : any ): Observable<IListaProductos>{
    let params = new HttpParams();
    params = params.append('pagIndex', data.pagIndex);
    params = params.append('itemsporpagina', data.itemsporpagina);
    params = params.append('descripcion', data.descripcion);
    params = params.append('idLinea', data.idLinea);
    params = params.append('idColor', data.idColor);
    params = params.append('tipoProductoId',data.tipoProductoId);
    params = params.append('soloActivos', data.soloActivos);
    params = params.append('soloArticulos', data.soloArticulos);
    params = params.append('soloServicios', data.soloServicios);
    params = params.append('usadoCompras', data.usadoCompras);
    params = params.append('usadoVentas', data.usadoVentas);
    return this.http.get<IListaProductos>(`${this.api987}/v1/Producto/ObtenerProductoPorCriterios`, { params: params });
  }

  listadoUnesco(data : string): Observable<IUnesco>{
    return this.http.get<IUnesco>(`${this.apiUnesco}/CodigosUnesco/ObtenerCodigosUnesco/${data}`)
  }
 
  productoPorId(id : number){
    return this.http.get<IUpdateProducto>(`${this.api987}/v1/Producto/ObtenerProductoPorId/${id}`);
  }
 
  crearProducto(data: ICreateProducto): Observable<ICreateProducto[]>{
    return this.http.post<ICreateProducto[]>(`${this.api987}/v1/Producto/InsertarProducto`, data)
  }

  updateProducto(data: ICreateProducto): Observable<ICreateProducto[]>{
    return this.http.post<ICreateProducto[]>(`${this.api987}/v1/Producto/ActualizarProducto`, data)
  }

  deleteProducto(id : number){
    return this.http.post(`${this.api987}/v1/Producto/EliminarProducto`, { productoId : id } );
  }

  /* eliminar precios del productos */
  deletePrecio(id : number){
    return this.http.post(`${this.api987}/v1/Producto/EliminarPrecioProducto`, { idPrecio : id} )
  }



  /* REPORTE */

  generarReporte(){
    return this.http.post<IReporte>(`${this.apiReporte}/v1/ProductoReport/ObtenerReporteProducto`, null )
  }
 
  /* PLANTILLA EXCEL */
  descargarPlantillaExcel(tipo : string){
    return this.http.get<IPlantillaExcel>(`${this.api987}/Descargas/ObtenerPlantillaExcel?tipo=${tipo}`)
  }

  /* SUBIR EXCEL DE PRODUCTOS */
  createSubirProductos(data : any): Observable<any>{
    return this.http.post<ICreateProducto[]>(`${this.api987}/v1/Producto/SubirProductos`, {data : data})
  }
 
}
