import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IPendientes } from '../../home/ventas/v-procesos/cobranzas/interface/cobranza.interface';
import { CobranzaService } from '../../home/ventas/v-procesos/cobranzas/service/cobranza.service'; 

@Component({
  selector: 'app-buscar-pendiente',
  templateUrl: './buscar-pendiente.component.html',
  styleUrls: ['./buscar-pendiente.component.scss']
})
export class BuscarPendienteComponent implements OnInit {
 
  @Input() dataPendiente : any;
  @Output() pendienteSelect : EventEmitter<any> = new EventEmitter<any>();
  FormBusqueda : FormGroup;

  es = ConstantesGenerales.ES_CALENDARIO;
  fechaActual = new Date();
  fechaInicio = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), 1);

  modalBuscarPersona : boolean = false;
  existeClienteSeleccionado : boolean = false;
  
  idClienteSeleccionado : number = 0;
  listaPendientes : IPendientes[]=[]
  arrayTipoDocumento: ICombo[];
  cols: InterfaceColumnasGrilla[] = []; 
  PendientesSeleccionados :any[] = [];

  constructor( 
    private cobranzaService : CobranzaService,
    private generalService : GeneralService,
    private swal : MensajesSwalService,
    private readonly dataFormat : DatePipe,
    private config : PrimeNGConfig,
    private spinner : NgxSpinnerService

  ) { 
    this.builform();
  }

  public builform(){
    this.FormBusqueda = new FormGroup({
      fechaInicio : new FormControl(this.fechaInicio, Validators.required),
      fechaFin: new FormControl(this.fechaActual, Validators.required),
      nombrecliente: new FormControl(null),
      documentoid: new FormControl(null),
      serie: new FormControl(null),
      correlativo: new FormControl(null),
    })
  }

  ngOnInit(): void {
    this.config.setTranslation(this.es),
    this.onCargarDropdown();
    this.onLoadPendientes();

    this.cols = [ 
      { field: 'nombreRazSocial', header: 'RazonSocial', visibility: true  }, 
      { field: 'documento', header: 'Documento', visibility: true}, 
      { field: 'nroDocumento', header: 'Nro Documento', visibility: true},  
      { field: 'fProvicion', header: 'Fec.Provision', visibility: true, formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA},   
      { field: 'fVencimiento', header: 'Fec.Vencimiento', visibility: true, formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA},   
      { field: 'moneda', header: 'Moneda', visibility: true},   
      { field: 'saldo', header: 'Saldo', visibility: true},   
      { field: 'acuenta', header: 'A Cuenta', visibility: true},   
      { field: 'saldoCambio', header: 'Saldo Cambio', visibility: true},     
    ]; 
  }

  onCargarDropdown(){
    const data = { 
      esUsadoVentas : true
  }
    this.generalService.listadoDocumentoPortipoParacombo(data).subscribe((resp)=>{
      if(resp){
        this.arrayTipoDocumento = resp;
      }
    })

  }
 
  onLoadPendientes(){ 
    const dataform = this.FormBusqueda.value;
    const data = {
      finicio : this.dataFormat.transform(dataform.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      ffin : this.dataFormat.transform(dataform.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      serie : dataform.serie,
      documentoid  : dataform.documentoid ? dataform.documentoid.id : null,
      correlativo : dataform.correlativo,
      idPersona : this.idClienteSeleccionado
    } 
    
    this.spinner.show(); 
    this.cobranzaService.listadoPendiente(data).subscribe((resp) => {
      if(resp){
        this.listaPendientes = resp;
        this.spinner.hide();
      } 
    })
  }
  

  onSeleccionarTodosLosPendiente(event : any){ 
    if(event.checked){
      this.listaPendientes.forEach(x => {
        this.PendientesSeleccionados.push(x)
      }) 
    }else{
      this.PendientesSeleccionados = []; 
    }
  }

 
  onSeleccionarPendiente(event : any){   
    if(event){ 
      if(!this.PendientesSeleccionados.includes(event.data.ventaId)){ 
        this.PendientesSeleccionados.push(event.data)
      }   
    }
  }

  onQuitarSeleccionPendiente(event : any){   
    const ventaId = this.PendientesSeleccionados.findIndex(x => x.ventaId === event.data.ventaId); 
    this.PendientesSeleccionados.splice(ventaId, 1 );  
  }



  onBuscarCliente(){
    this.modalBuscarPersona = true;
  }

  onPintarPersonaSeleccionada(data: any){  
    this.idClienteSeleccionado = data.idPersona; 
    this.FormBusqueda.controls['nombrecliente'].setValue(data.nombreCompleto ?? data.nombreRazSocial);
    this.existeClienteSeleccionado = true;
    this.modalBuscarPersona = false;
  }
 
  onBorrarCliente(){
    this.swal.mensajePregunta('¿Seguro de quitar al cliente actual?').then((response) => {
      if (response.isConfirmed) { 
        this.FormBusqueda.controls['nombrecliente'].setValue(null); 
        this.existeClienteSeleccionado = false;
        this.idClienteSeleccionado = null
      }
    })
  }


  onGrabar(){  
    console.log(this.PendientesSeleccionados);
    this.swal.mensajePregunta("¿Seguro que desea enviar los pendientes seleccionados?").then((response) => {
      if (response.isConfirmed) {
        this.pendienteSelect.emit({ pendientes : this.PendientesSeleccionados}); 
      }
    })   
  }

  onRegresar(){
    this.pendienteSelect.emit(false);
  }

}
