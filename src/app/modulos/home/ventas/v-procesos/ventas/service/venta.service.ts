import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IModuloReporte } from "src/app/modulos/home/almacen/a-mantenimientos/productos/interface/producto.interface";
import { ITipoCambioPorId } from "src/app/modulos/home/almacen/a-mantenimientos/tipodecambio/interfaces/tipocambio.interface";
import { ICombo } from "src/app/shared/interfaces/generales.interfaces";
import { environment } from "src/environments/environment";   
import { ICrearCliente } from "../../../v-mantenimientos/clientes/interface/clientes.interface";
import { ICobrarSaldoPendiente, ICrearVenta, IListarVentas, IVentaPorId } from "../interface/venta.interface";

@Injectable({
    providedIn: 'root'
})

export class VentasService{

    private api987 = environment.apiUrl987; 
    private api991 = environment.apireporte991; 
    private apiReporte = environment.apireporte991;  
    constructor(
        private http : HttpClient
    ){}

 

    /* APIS PARA VENTAS */

    listadoVentas(data :any): Observable<IListarVentas>{
        let params = new HttpParams();
        params = params.append('paginaindex', data.paginaindex);
        params = params.append('itemsxpagina', data.itemsxpagina);
        params = params.append('f1', data.finicio);
        params = params.append('f2', data.ffin); 

        if(data.serie){
            params = params.append('serie', data.serie);
        } 
        if(data.tipoDocumento){
            params = params.append('tipoDocId', data.tipoDocumento);
        }
        if(data.correlativo){
            params = params.append('correlativo', data.correlativo);
        }
        if(data.clienteId){
            params = params.append('clienteId', data.clienteId);
        } 

        return this.http.get<IListarVentas>(`${this.api987}/v1/Venta/ObtenerVentaConsultas`, { params: params }); 
    }
  
    ventasPorId(id :number){
        return this.http.get<IVentaPorId>(`${this.api987}/v1/Venta/ObtenerVentaPorId?idVenta=${id}`)
    }

    createVenta(data : ICrearVenta):Observable<any>{
        return this.http.post<ICrearVenta>(`${this.api987}/v1/Venta/InsertarVenta`, data)
    }
 
    updateVenta(data : ICrearVenta):Observable<any>{ 
        return this.http.post<any>(`${this.api987}/v1/Venta/ActualizarVenta`, data)
    }
 
    deleteVenta( id : number){
        return this.http.post(`${this.api987}/v1/Venta/EliminarVenta `, { idVenta : id})
    }
  
    obtenerPublicoGeneral(){
        return this.http.get<ICrearCliente>(`${this.api987}/v1/Cliente/ObtenerClientePublicoGeneral`)
    } 

    obtenerPersonaPorNroDocumentoVenta(nroDocumetno : number){
        return this.http.get<ICrearCliente>(`${this.api987}/v1/Cliente/ObtenerRegistrarClientePorDocumento?nrodocumento=${nroDocumetno}`)
    }
  
    referenciardocumentoRef(data : any){
        return this.http.get<IVentaPorId>(`${this.api987}/v1/Venta/ObtenerVentaPorNroDocumento?tipoDocumento=${data.tipodocumento}&serie=${data.serie}&correlativo=${data.correlativo}`)
    }
  

    /* APIS PARA COBRAR */
    obtenerSaldoPendiente(id: number){
        return this.http.get<ICobrarSaldoPendiente>(`${this.api987}/v1/Venta/ObtenerSaldoPendientePorId?ventaid=${id}`)
    } 
    obtenerFormasdePagoCobrar(data: number){
        return this.http.get<ICombo[]>(`${this.api987}/v1/Cobranza/ObtenerFormaPagosParaCombo?establecimientoid=${data}`)
    } 

    obtenertipodeCambioCobrar(data: any){
        // return this.http.get<ITipoCambioPorId>(`${this.api987}/v1/TipoCambio/ObtenerTipoCambioPorFecha?fecha=${data}`)
        return this.http.get<ITipoCambioPorId>(`${this.api987}/v1/TipoCambio/ObtenerTipoCambioPorFecha?fecha=${data}`)
    }  

    crearCobranzaRapida(data : any){
        return this.http.post(`${this.api987}/v1/Cobranza/InsertarCobranzaRapida `, data)    
    }

    
    /* APIS PARA REPORTE */
    generarReporte(id: number){
        return this.http.get<IModuloReporte>(`${this.apiReporte}/v1/ReportingVentas/ObtenerVentaParaImpresion?ventaid=${id}`)
    }


    /* APIS PARA IMPRIMIR */
    obtenerByteParaImprimir(data : any){
        return this.http.get<IModuloReporte>(`${this.api991}/v1/ReportingVentas/ObtenerVentaFormatoTicket?ventaid=${data.ventaid}&anchopapel=${data.anchopapel}`)
    }

    obtenerImpresorasLista(data : string){
        return this.http.get<[]>(`${data}/api/impresoras/listar`)
    }
  
    imprimir(data : any, host : string){
        return this.http.post(`${host}/api/impresoras/imprimir `, data)    
    }

 
    /* APIS PARA REPORTE EXCEL */
    generarReporteExcel(data: any){
        return this.http.get<IModuloReporte>(`${this.apiReporte}/v1/ReportingVentas/ObtenerReporteContasol?tipoPresentacion=${data.tipoPresentacion}&f1=${data.f1}&f2=${data.f2}`)
    }

  
}