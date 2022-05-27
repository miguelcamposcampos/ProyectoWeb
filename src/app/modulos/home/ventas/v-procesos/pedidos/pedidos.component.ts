import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IVentas } from '../ventas/interface/venta.interface';
import { IPedido } from './interface/pedido.interface';
import { PedidoService } from './service/pedido.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {

  cols: InterfaceColumnasGrilla[] = [];
  FormBusqueda : FormGroup;
  opcionesPedidos : MenuItem[]; 
  listadoPedidos : IPedido[];
  fechaActual = new Date(); 
  es = ConstantesGenerales.ES_CALENDARIO;
  textoPaginado : string="";
  pagina: number = 1;
  size: number = 50;
  idClienteSeleccionado : number = 0;
  existeClienteSeleccionado : boolean = false;
  VistaNuevoPedido : boolean = false;
  VistaNuevaVenta : boolean = false;
  modalBuscarPersona: boolean = false; 
  dataVenta: IVentas;
  dataPedido: IVentas;
  pedidoConvertiraVenta : any;

  constructor(
    private pedidoService : PedidoService,
    private swal : MensajesSwalService,
    private config : PrimeNGConfig,
    private formatFecha : DatePipe,
    private generalService : GeneralService
  ) {
    this.builform();
   }

  public builform(){
    this.FormBusqueda = new FormGroup({
      fechaInicio: new FormControl(this.fechaActual, Validators.required),
      fechaFin: new FormControl(this.fechaActual, Validators.required),
      serie: new FormControl(null),
      correlativo: new FormControl(null),
      cliente : new FormControl(null)

    })
  }
  

  ngOnInit(): void {
    this.onOpcionesPedido();
    this.config.setTranslation(this.es);
    this.onLoadPedidos();
    this.cols = [ 
      { field: 'nroRegistro', header: 'Nro Registro', visibility: true }, 
      { field: 'tipoDocumento', header: 'Tipo Documento', visibility: true},   
      { field: 'nroDocumento', header: 'Nro Documento', visibility: true},   
      { field: 'fechaEmision', header: 'Fec. Emision',  visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA},   
      { field: 'fechaVencimiento', header: 'Fec. Vencimiento',  visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA},   
      { field: 'clienteDocumento', header: 'Cliente Documento', visibility: true},   
      { field: 'clienteNombreRazSocial', header: 'Cliente Nombre / R.Social', visibility: true}, 
      { field: 'moneda', header: 'Moneda', visibility: true }, 
      { field: 'importe', header: 'Importe', visibility: true},  
      { field: 'estado', header: 'Estado', visibility: true},   
      { field: 'facturas', header: 'Facturas', visibility: true},  
      { field: 'vendedor', header: 'Vendedor', visibility: true},     
      { field: 'fechaRegistro', header: 'Fec. Registro',  visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA},   
      { field: 'usuarioRegistro', header: 'Usuario. Reg', visibility: true},   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];
  }

  onOpcionesPedido(){
    this.opcionesPedidos = [
      {
        label:'Agregar',
        icon:'fas fa-plus', 
        command:()=>{
          this.onNuevo();
        }
      },
      {
        label:'Convertir a Venta',
        icon:'fas fa-plus',
        command:()=>{
          this.onConvertirVenta();
        }
      }, 
    ]
  }

  onLoadPedidos(){
    const dataform = this.FormBusqueda.value
    const data = {
      fechaInicio : this.formatFecha.transform(dataform.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      fechaFin : this.formatFecha.transform(dataform.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      paginaindex : this.pagina,
      itemsxpagina: this.size,
      serie: dataform.serie,
      correlativo : dataform.correlativo,
      clienteId :  this.idClienteSeleccionado,
    } 
    this.swal.mensajePreloader(true);
    this.pedidoService.listadoPedidos(data).subscribe((resp)=> {
      if(resp){  
        this.textoPaginado = resp.label;
        this.listadoPedidos = resp.items;  
      }
      this.swal.mensajePreloader(false);
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });

  }

  onNuevo(){
    this.dataPedido = null
    this.VistaNuevoPedido = true;
  }

  onSeleccionarFilaParaConvertiraVenta(event : any){
    this.pedidoConvertiraVenta = event.data
  }
  onQuitarFilaParaConvertiraVenta(event : any){
    this.pedidoConvertiraVenta = null;
  }

  onConvertirVenta(){
    if(!this.pedidoConvertiraVenta){
      this.swal.mensajeAdvertencia('Selecciona la fila que desea convertir a VENTA!.');
      return;
    } 
    this.dataVenta = this.pedidoConvertiraVenta;
    this.VistaNuevaVenta = true;
  }

  onBuscarCliente(){
    this.modalBuscarPersona = true;
  }

  onBorrarCliente(){
    this.swal.mensajePregunta('¿Seguro de quitar al cliente actual?').then((response) => {
      if (response.isConfirmed) {
       this.FormBusqueda.controls['cliente'].setValue(null);
       this.idClienteSeleccionado = null;
       this.existeClienteSeleccionado = false;
      }
    })
  }

  onPintarPersonaSeleccionada(data: any){
    this.idClienteSeleccionado = data.idCliente;
    this.FormBusqueda.controls['cliente'].setValue(data.nombreRazSocial);
    this.existeClienteSeleccionado = true;
    this.modalBuscarPersona = false;
  }

  onEditar(data: any){ 
    this.dataPedido = data;
    this.VistaNuevoPedido = true;
  }

  onEliminar(data: any){ 
    this.swal.mensajePregunta("¿Seguro que desea eliminar la venta con nuero de registro: " + data.nroRegistro + " ?").then((response) => {
      if (response.isConfirmed) {
        this.swal.mensajeExito('El documento se ha sido eliminado correctamente!.'); 
        this.pedidoService.deletePedido(data.idVenta).subscribe((resp) => {
          if(resp){
            this.onLoadPedidos();
          }
        },error => { 
          this.generalService.onValidarOtraSesion(error);  
        });
      }
    })  
  }


  onRetornar(event : any){
    if(event === "exito"){
      this.onLoadPedidos();
    }
    this.VistaNuevaVenta = false;
    this.VistaNuevoPedido = false;
  }


}
