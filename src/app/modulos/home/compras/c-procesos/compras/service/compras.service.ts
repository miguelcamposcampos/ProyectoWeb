import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs"; 
import { environment } from "src/environments/environment";     
import { IProveedorPorId } from "../../../c-mantenimientos/proveedores/interface/proveedor.interface";
import { ICompra, ICompraPorId, ICrearCompra, IListarCompra } from "../interface/compras.interface";

@Injectable({
    providedIn: 'root'
})

export class ComprasService{

    private api987 = environment.apiUrl987;  
    constructor(
        private http : HttpClient
    ){}



    /* APIS PARA rComrpas */

    listadoCompras(data :any): Observable<IListarCompra>{
        let params = new HttpParams();
        params = params.append('paginaindex', data.paginaindex);
        params = params.append('itemsxpagina', data.itemsxpagina);
        params = params.append('f1', data.finicio);
        params = params.append('f2', data.ffin);  
        if(data.proveedorid){
            params = params.append('proveedorid', data.proveedorid);
        } 

        return this.http.get<IListarCompra>(`${this.api987}/v1/Compra/ObtenerCompraConsultas`, { params }); 
    } 
 
    ComrpasPorId(id :number){
        return this.http.get<ICompraPorId>(`${this.api987}/v1/Compra/ObtenerCompraPorId?idCompra=${id}`)
    }

    createCompra(data : ICrearCompra):Observable<any>{
        return this.http.post<ICrearCompra>(`${this.api987}/v1/Compra/InsertarCompra`, data)
    }
 
    updateCompra(data : ICrearCompra):Observable<any>{ 
        return this.http.post<any>(`${this.api987}/v1/Compra/ActualizarCompra`, data)
    }
 
    deleteCompra( id : number){
        return this.http.post(`${this.api987}/v1/Compra/EliminarCompra `, { idCompra : id})
    }
   
 
    referenciardocumentoRef(data : any){
        return this.http.get<ICompraPorId>(`${this.api987}/v1/Compra/ObtenerCompraPorNroDocumento?tipoDocumento=${data.tipodocumento}&serie=${data.serie}&correlativo=${data.correlativo}`)
    }
 
    


    obtenerPersonaPorNroDocumentoCompra(nroDocumetno : number){
        return this.http.get<IProveedorPorId>(`${this.api987}/v1/Proveedor/ObtenerRegistrarProveedorPorDocumento?nrodocumento=${nroDocumetno}`)
    }
 
    buscarAnticipos(data : any){
        let params = new HttpParams();
        params = params.append('idproveedor', data.idproveedor);
        params = params.append('idcompra', data.idcompra);
        params = params.append('fecha', data.fecha); 
        if(data.proveedorid){
            params = params.append('proveedorid', data.proveedorid);
        }  
        return this.http.get<any>(`${this.api987}/v1/Compra/ConsultaComprasPorProveedor`, { params }); 
    }

    buscarCentroCosto(){
        return this.http.get<any>(`${this.api987}/ReciboHonorarios/ObtenerConsultaCentroCosto`)
    }

}