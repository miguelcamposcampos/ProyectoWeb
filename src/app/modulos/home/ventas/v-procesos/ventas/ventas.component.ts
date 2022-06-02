import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IVentas } from './interface/venta.interface';
import { VentasService } from './service/venta.service';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';   
import { SignalRService } from 'src/app/modulos/shared_modulos/signalR/signalr.service';
import { IModuloReporte } from '../../../almacen/a-mantenimientos/productos/interface/producto.interface';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  cols: InterfaceColumnasGrilla[] = [];
  FormBusqueda : FormGroup; 
  FormExportar : FormGroup; 
  opcioneVentas : MenuItem[];
  arrayDocumentos : ICombo[];
  listadoVentas : IVentas[];
  dataVenta: IVentas;
  fechaActual = new Date(); 
  es = ConstantesGenerales.ES_CALENDARIO;
  VistaNuevaVenta : boolean = false;
  VistaNuevaVentaPOS : boolean = false;
  modalBuscarPersona: boolean = false; 
  existeClienteSeleccionado : boolean = false;
  modalExportarVenta : boolean = false;
  textoPaginado : string="";
  pagina: number = 1;
  size: number = 50;
  idClienteSeleccionado : number = 0;
  dataExcelReporte : IModuloReporte

  constructor(
    private swal : MensajesSwalService,
    private config : PrimeNGConfig,
    private ventasService: VentasService,
    private generalService : GeneralService,
    private formatFecha : DatePipe,
    public signalService : SignalRService 
  ) {
    this.builform();
   }

  public builform(){
    this.FormBusqueda = new FormGroup({
      fechaInicio: new FormControl(this.fechaActual, Validators.required),
      fechaFin: new FormControl(this.fechaActual, Validators.required),
      documento: new FormControl(null),
      serie: new FormControl(null),
      correlativo: new FormControl(null),
      cliente : new FormControl(null)
    })

    this.FormExportar = new FormGroup({
      fechaInicioReporteExcel: new FormControl(this.fechaActual, Validators.required),
      fechaFinReporteExcel: new FormControl(this.fechaActual, Validators.required),
      tipoReporte: new FormControl('normal', Validators.required),  
    })
  }



  ngOnInit(): void {
    this.onSignalERP();
    this.config.setTranslation(this.es);
    this.onOpcionesVentas();
    this.onCargarTipoDocumento();
    this.onLoadVentas(null);
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
      { field: 'saldo', header: 'Saldo', visibility: true},  
      { field: 'estadoSUNAT', header: 'Sunat', visibility: true},   
      { field: 'vendedor', header: 'Vendedor', visibility: true},   
      { field: 'fechaRegistro', header: 'Fec. Registro',  visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA},   
      { field: 'usuarioRegistro', header: 'Usuario. Reg', visibility: true},   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];
  }

  onSignalERP(){ 
    this.signalService.iniciarConeccionSR(); 
    this.signalService.InfoVentas.subscribe((resp) => { 
      if(resp){
        this.onLoadVentas(null);
      } 
    });
  }


  onOpcionesVentas(){
    this.opcioneVentas = [ 
      {
        label:'Venta POS',
        icon:'fas fa-plus',
        command:()=>{
          this.onVentaPOS();
        }
      }, 
      {
        label:'Exportar',
        icon:'fas fa-file-excel',
        command:()=>{
          this.onExportarExcel();
        }
      }, 
    ] 
  }


  onLoadVentas(event : any){ 
    const dataform = this.FormBusqueda.value;
    let finicio =  this.formatFecha.transform(dataform.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA);
    let fehfin   =  this.formatFecha.transform(dataform.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA);
    const data = {
      paginaindex  : event ? event.first : this.pagina,
      itemsxpagina : event ? event.rows : this.size,
      finicio : finicio,
      ffin : fehfin,
      tipoDocumento : dataform.documento ? dataform.documento.id : null,
      serie : dataform.serie,
      correlativo : dataform.correlativo,
      clienteId : this.idClienteSeleccionado,
    }
  //  this.swal.mensajePreloader(true);
    this.ventasService.listadoVentas(data).subscribe((resp)=> {
      if(resp){  
        this.textoPaginado = resp.label;
        this.listadoVentas = resp.items;  
      }
    //  this.swal.mensajePreloader(false);
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });

  }

  /* BUSCAR CLIENTE */
  onBuscarCliente(){
    this.modalBuscarPersona = true;
  }

  onPintarPersonaSeleccionada(data: any){
    this.idClienteSeleccionado = data.idCliente;
    this.FormBusqueda.controls['cliente'].setValue(data.nombreRazSocial);
    this.existeClienteSeleccionado = true;
    this.modalBuscarPersona = false;
  }

  onBorrarCliente(){
    this.swal.mensajePregunta('¿Seguro de quitar al cliente actual?').then((response) => {
      if (response.isConfirmed) {
        this.idClienteSeleccionado = null;
        this.FormBusqueda.controls['cliente'].setValue(null);
        this.existeClienteSeleccionado = false;
      }
    })
  }

 
  onNuevaVenta(){
    this.dataVenta = null
    this.VistaNuevaVenta = true;
  }

  onVentaPOS(){ 
    this.VistaNuevaVentaPOS = true;
  }

  onEditar(ventas : any){
    this.dataVenta = ventas
    this.VistaNuevaVenta = true;
  }

  onEliminar(ventas: any){ 
    this.swal.mensajePregunta("¿Seguro que desea eliminar la venta con nuero de registro: " + ventas.nroRegistro + " ?").then((response) => {
      if (response.isConfirmed) {
        this.ventasService.deleteVenta(ventas.idVenta).subscribe((resp) => {
          if(resp){
            this.swal.mensajeExito('El documento se ha sido eliminado correctamente!.'); 
            this.onLoadVentas(null);
          }
        },error => { 
          this.generalService.onValidarOtraSesion(error);  
        });
      }
    })  
  }


  onCargarTipoDocumento(){
    const data ={
      esUsadoVentas : true
     }
    this.generalService.listadoDocumentoPortipoParacombo(data).subscribe((resp)=> {
      if(resp){
        this.arrayDocumentos = resp;
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }
   

  onRetornar(event : any){
    this.VistaNuevaVentaPOS = false;
    this.VistaNuevaVenta = false; 
    if(event === "exito"){
      this.onLoadVentas(null);
    }
  }
 
  onExportarExcel(){
    this.modalExportarVenta = true;
  }

  onGenerarExcel(){
    const dataFormExportar = this.FormExportar.value;
    const newExportar = {
      tipoReporte : dataFormExportar.tipoReporte,
      tipoPresentacion : 'Excel',
      f1 : this.formatFecha.transform(dataFormExportar.fechaInicioReporteExcel, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      f2 : this.formatFecha.transform(dataFormExportar.fechaFinReporteExcel, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
    }
  
    this.ventasService.generarReporteExcel(newExportar).subscribe((resp) => {
        if(resp){
          this.dataExcelReporte = resp;
          var blob = new Blob([this.onBase64ToArrayBuffer(this.dataExcelReporte.fileContent)], {type: "application/xlsx"}); 
          saveAs(blob, "Plantilla Subir Productos.xlsx");
        }
    }, error => { 
      this.generalService.onValidarOtraSesion(error);  
    })


  }
 
  onBase64ToArrayBuffer(base64) {
    const binary_string = window.atob(this.dataExcelReporte.fileContent);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    } 
    return bytes.buffer;
  }

 


}
