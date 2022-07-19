import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api';
import { SignalRService } from 'src/app/modulos/shared_modulos/signalR/signalr.service';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service'; 
import { ComprasService } from './service/compras.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html'
})
export class ComprasComponent implements OnInit , OnDestroy{
 
  cols: InterfaceColumnasGrilla[] = [];
  FormBusqueda : FormGroup;  
  arrayDocumentos : ICombo[];
  listadoCompras : any[];
  dataCompra: any;
  fechaActual = new Date(); 
  es = ConstantesGenerales.ES_CALENDARIO;
  VistaNuevaCompra : boolean = false; 
  modalBuscarPersona: boolean = false; 
  existeClienteSeleccionado : boolean = false;
  idClienteSeleccionado : number = 0;
  textoPaginado : string="";
  pagina: number = 1;
  size: number = 50; 

  constructor(
    private swal : MensajesSwalService,
    private config : PrimeNGConfig, 
    private comprasService : ComprasService,
    private generalService : GeneralService,
    private formatFecha : DatePipe,
    public signalService : SignalRService, 
    private spinner : NgxSpinnerService
  ) { 
    this.builform();
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
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
  }

  ngOnInit(): void {
    this.onSignalERP();
    this.config.setTranslation(this.es); 
    this.onCargarTipoDocumento();
    this.onLoadCompras(null);
    this.cols = [  
      { field: 'tipoDocumento', header: 'Tipo Documento', visibility: true},   
      { field: 'nroDocumento', header: 'Nro Documento', visibility: true},   
      { field: 'fechaEmision', header: 'Fec. Emision',  visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA},   
      { field: 'fechaVencimiento', header: 'Fec. Vencimiento',  visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA},   
      { field: 'proveedorDocumento', header: 'Proveedor Documento', visibility: true},   
      { field: 'proveedorNombreRazSocial', header: 'Proveedor Nombre / R.Social', visibility: true}, 
      { field: 'moneda', header: 'Moneda', visibility: true }, 
      { field: 'importe', header: 'Importe', visibility: true},   
      { field: 'saldo', header: 'Saldo', visibility: true},   
      { field: 'vendedor', header: 'Vendedor', visibility: true},   
      { field: 'fechaRegistro', header: 'Fec. Registro',  visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA},   
      { field: 'usuarioRegistro', header: 'Usuario. Reg', visibility: true},   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];
  }

  onSignalERP(){
    this.signalService.iniciarConeccionSR(); 
    this.signalService.InfoCompras.subscribe((resp) => { 
      if(resp){
        this.onLoadCompras(null);
      } 
    });
  }


  onLoadCompras(event : any){
  
    const dataform = this.FormBusqueda.value;
    const data = { 
      paginaindex  : event ? event.first : this.pagina,
      itemsxpagina : event ? event.rows : this.size, 
      finicio : this.formatFecha.transform(dataform.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      ffin : this.formatFecha.transform(dataform.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      tipoDocumento : dataform.documento ? dataform.documento.id : null,
      serie : dataform.serie,
      correlativo : dataform.correlativo,
      clienteId : this.idClienteSeleccionado,
    }
    this.spinner.show();
    this.comprasService.listadoCompras(data).subscribe((resp)=> {
      if(resp){  
        this.textoPaginado = resp.label;
        this.listadoCompras = resp.items;  
        this.spinner.hide();
      } 
    });

  }

  onNuevo(){
    this.dataCompra = null
    this.VistaNuevaCompra = true;
  }

  onEditar(compra : any){
    this.dataCompra = compra
    this.VistaNuevaCompra = true;
  }

  onEliminar(compra : any){
    this.swal.mensajePregunta("¿Seguro que desea eliminar la compra con fecha: " + compra.fechaRegistro + " ?").then((response) => {
      if (response.isConfirmed) {
        this.swal.mensajeExito('El documento se ha sido eliminado correctamente!.'); 
        this.comprasService.deleteCompra(compra.compraid).subscribe((resp) => {
          if(resp){
            this.onLoadCompras(null);
          }
        });
      }
    })

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


  onCargarTipoDocumento(){
    const data ={
      esUsadoCompras : true
     }
    this.generalService.listadoDocumentoPortipoParacombo(data).subscribe((resp)=> {
      if(resp){
        this.arrayDocumentos = resp;
      }
    });
  }
   
  onRetornar(event : any){
    if(event === 'exito'){
      this.onLoadCompras(null);
    }
    this.VistaNuevaCompra = false;
  }



  ngOnDestroy(): void {
    this.signalService.hubConnection.off('onEscucharCompras');
  }
  

  

}
