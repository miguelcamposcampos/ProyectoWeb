import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api';
import { forkJoin, Subject } from 'rxjs';
import { VentasService } from 'src/app/modulos/home/ventas/v-procesos/ventas/service/venta.service';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IAsientoTesoreria } from '../interface/asiento-tesoreria.interface';

@Component({
  selector: 'app-nuevo-asiento-tesoreria',
  templateUrl: './nuevo-asiento-tesoreria.component.html',
  styleUrls: ['./nuevo-asiento-tesoreria.component.scss']
})
export class NuevoAsientoTesoreriaComponent implements OnInit {

  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  @Input() data : any;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  tituloVista = "Nuevo Asiento Tesorería"
  arrayTipoDoc : ICombo[];
  arrayTipoComprobante : any[];
  arrayTipoDocumento : ICombo[];
  arrayTipoDocumentoReferencia : ICombo[];
  arrayMonedas: any[];
  arrayDetallesEliminados : any[]=[];

  es = ConstantesGenerales.ES_CALENDARIO;
  vNuevo: boolean = false;
  modalCuentas: boolean = false;
  modalAnexos: boolean = false;
  dataTesoreriaEdit: IAsientoTesoreria;
  existeRegistro: boolean = false;
  Form: FormGroup;
  fechaActual = new Date();
  tipoCuenta :any;
  posicionPersona : number = 0;


  constructor(
    private generalService : GeneralService,
    private swal : MensajesSwalService,
    private ventaService : VentasService,
    private readonly formatoFecha : DatePipe,
    private config : PrimeNGConfig,
    private fb : FormBuilder,  
    private spinner : NgxSpinnerService,
    private cdr: ChangeDetectorRef,
  ) { 
    this.builform(); 
    this.arrayMonedas = [
      {nombre : 'SOLES', codigo: 1},
      {nombre : 'DOLARES', codigo: 2}, 
      {nombre : 'EUROS', codigo: 3}, 
    ] 
 
    this.arrayTipoComprobante = [
      {nombre : 'APERTURA', codigo: 0},
      {nombre : 'NORMAL', codigo: 1}, 
      {nombre : 'AJUSTE', codigo: 2}, 
      {nombre : 'CIERRE', codigo: 3}, 
      {nombre : 'DIFERENCIA/CAMBIO', codigo: 4}, 
      {nombre : 'AJUSTE-LIQUIDACION', codigo: 5}, 
    ] 

  }

  
  public builform(){
    this.Form = new FormGroup({
      esdiario : new FormControl(false),  
      estesoreria : new FormControl(true),  
      fecharegistro : new FormControl(this.fechaActual, Validators.required),
      documentoid : new FormControl(null, Validators.required),
      secuencial : new FormControl(0),
      tipocambio : new FormControl(null, Validators.required),
      tipocomprobanteid : new FormControl( {nombre : 'NORMAL', codigo: 1}, Validators.required),
      monedaid : new FormControl(  {nombre : 'SOLES', codigo: 1}, Validators.required),
      nombrediario : new FormControl(null), 
      glosadiario : new FormControl(null),  
      arrayDetalle: this.fb.array([])
    })
  }


  ngOnInit(): void {
    if(this.data){
      this.tituloVista = "Editar Asiento Tesorería",
      this.spinner.show();
    }
    this.onCargarDropdown();
  }

  onCargarDropdown(){ 
    const datTC = {
    esUsadoCompras : true,
    esUsadoVentas : true,
    esNotaIngresoAlmacen : true,
    esNotaSalidaAlmacen : true,
    esasientocontable : true
    
    }
    const data = { 
        esCajaBanco : true
    }
    const obsDatos = forkJoin(
      this.generalService.listadoDocumentoPortipoParacombo(data),  
      this.generalService.listadoDocumentoPortipoParacombo(datTC),
      this.generalService.listadoDocumentoPortipoParacombo(datTC), 
    );
    obsDatos.subscribe((response) => {
      this.arrayTipoDoc = response[0]; 
      this.arrayTipoDocumento = response[1];  
      this.arrayTipoDocumentoReferencia = response[2];  
      this.FlgLlenaronCombo.next(true); 
      if(!this.data){
        this.onCargarTipoCambio(); 
      }
    });
  }

  onCargarTipoCambio(){
    let fecha = this.formatoFecha.transform(this.fechaActual, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA)
    this.ventaService.obtenertipodeCambioCobrar(fecha).subscribe((resp) => {
      if(resp){ 
        this.Form.controls['tipoCambio'].setValue(resp.valorventa)
      }
    })
  }

  get fa() { return this.Form.get('arrayDetalle') as FormArray; } 
  get detallesForm() { return this.fa.controls as FormGroup[]; }

  onAgregarDetalles(){
    const dataForm = this.Form.value;
    if(!dataForm.tipocambio){
      this.swal.mensajeAdvertencia("Ingresa un tipo de cambio");
      return;
    }
    this.detallesForm.push(this.AddDetalle());  
  }

  AddDetalle(){
    return this.fb.group({ 
      asientodetalleid: new FormControl(0),
      asientoid : new FormControl(0), 
      personaid : new FormControl(null), 
      rucPersona : new FormControl(null), 
      nrocuenta : new FormControl(null),
      naturaleza  : new FormControl('D'),
      importe: new FormControl(null),  
      cambio: new FormControl(null),  
      centrocosto: new FormControl(null),   
      documentoid: new FormControl(0),
      nrodocumento: new FormControl(0),
      documentorefid: new FormControl(0),  
      nrodocumentoref : new FormControl(null), 
      analisis: new FormControl(null),     
      fechadetalle: new FormControl(null), 
      fechavencimiento: new FormControl(null),  
    });
  }

  onCalcularDetalle(posicion : number){ 
    console.log('posicion', posicion);
    const dataForm = this.Form.value;
    const dataFormDetail = (this.Form.get('arrayDetalle') as FormArray).at(posicion).value;
 
    let CambioSoles = dataFormDetail.importe / dataForm.tipocambio;
    let CambioDolares = dataFormDetail.importe  * dataForm.tipocambio;
    let CambioEuros = dataFormDetail.importe  * dataForm.tipocambio;

    let AsignarCambio

    if(dataForm.monedaid.codigo === 1){
      AsignarCambio  = CambioSoles
    }else  if(dataForm.monedaid.codigo === 2){
      AsignarCambio  = CambioDolares
    }else{
      AsignarCambio  = CambioEuros
    }
 
      this.detallesForm[posicion].patchValue({
        cambio : AsignarCambio, 
      });
   
    }


  onRefrescarCalculos(event:any){
    console.log('event', event);
    this.detallesForm.forEach((x,i )=> {
      this.onCalcularDetalle(i)
    })
  }
 
  onDuplicarFila(data:any){
    this.detallesForm.push(this.DuplicateDetalle(data));  
  }

  DuplicateDetalle(data:any){ 
    return this.fb.group({ 
      asientodetalleid: new FormControl(0),
      asientoid : new FormControl(0), 
      personaid : new FormControl(data.personaid), 
      nrocuenta : new FormControl(data.nrocuenta),
      naturaleza  : new FormControl(data.naturaleza),
      importe: new FormControl(data.importe),  
      cambio: new FormControl(data.cambio),  
      centrocosto: new FormControl(data.centrocosto),   
      documentoid: new FormControl(data.documentoid),
      nrodocumento: new FormControl(data.nrodocumento),
      documentorefid: new FormControl(data.documentorefid),  
      nrodocumentoref : new FormControl(data.nrodocumentoref), 
      analisis: new FormControl(data.analisis),     
      fechadetalle: new FormControl(data.fechadetalle), 
      fechavencimiento: new FormControl(data.fechavencimiento),  
    });
  }


   onCalcularDiferencia(){

   }
  
  onEliminarDetalle(index : any, asientodetalleid : any){ 
    if(!asientodetalleid){
      this.fa.removeAt(index);
      this.cdr.detectChanges(); 
    } else{
      this.swal.mensajePregunta("¿Seguro que desea eliminar el detalle.?").then((response) => {
        if (response.isConfirmed) {
          this.arrayDetallesEliminados.push(asientodetalleid);
          this.fa.removeAt(index); 
          this.swal.mensajeExito('El detalle ha sido eliminado correctamente!.');
        }
      })
    }
  }

 
  onBuscarAnexo(data :any){

  }

  onModalBuscarAnexo(data :any){
    this.posicionPersona = data;
    this.modalAnexos = true;
  }

  
  onPintarAnexo(data:any){
    console.log('data anexo',data);
    this.detallesForm[this.posicionPersona].patchValue({
      rucPersona: data.nroDocumento,
      personaid: data.idPersona
    }); 
    this.modalAnexos = false;
  }
   

  onModalBuscarCuenta(data :any){ 
    this.tipoCuenta = data
    this.modalCuentas = true;
  }

  onPintarcuenta(data:any){ 
    this.detallesForm[data.posicion].patchValue({
      nrocuenta: data.data.nroCuenta
    }); 
    this.modalCuentas = false;
  }


  onGrabar(){

  }


  onRegresar(){
    this.cerrar.emit(false);
  }

}
