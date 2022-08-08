import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner'; 
import { forkJoin, Subject } from 'rxjs';
import { VentasService } from 'src/app/modulos/home/ventas/v-procesos/ventas/service/venta.service';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICrearAsientoTesoreria, IDtealleAsientoTesoreria } from '../interface/asiento-tesoreria.interface';
import { AsientoTesoseriaService } from '../service/asiento-tesoreria.service';

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
  arrayTipoDocumento : ICombo[];
  arrayTipoDocumentoReferencia : ICombo[];
  arrayDetallesEliminados : any[]=[];
  arrayMonedas = ConstantesGenerales.arrayMonedas;
  arrayTipoComprobante = ConstantesGenerales.arrayTipoComprobante;

  es = ConstantesGenerales.ES_CALENDARIO;
  vNuevo: boolean = false;
  modalCuentas: boolean = false;
  modalAnexos: boolean = false;
  dataTesoreriaEdit: ICrearAsientoTesoreria;
  existeRegistro: boolean = false;
  Form: FormGroup;
  fechaActual = new Date();
  tipoCuenta :any;
  posicionPersona : number = 0;
  arrayDetalleGrabar : IDtealleAsientoTesoreria[]= [];

  constructor(
    private generalService : GeneralService,
    private swal : MensajesSwalService,
    private ventaService : VentasService,
    private readonly formatoFecha : DatePipe, 
    private fb : FormBuilder,  
    private spinner : NgxSpinnerService,
    private cdr: ChangeDetectorRef,
    private apiService : AsientoTesoseriaService
  ) { 
    this.builform(); 
  }

  
  public builform(){
    this.Form = new FormGroup({
      esdiario : new FormControl(false),  
      estesoreria : new FormControl(true),  
      fecharegistro : new FormControl(this.fechaActual, Validators.required),
      documentoid : new FormControl(null, Validators.required),
      secuencial : new FormControl(0),
      tipocambio : new FormControl(null, Validators.required),
      tipocomprobanteid : new FormControl( {nombre : 'NORMAL', id: 1}, Validators.required),
      monedaid : new FormControl(  {nombre : 'SOLES', id: 1}, Validators.required),
      nombrediario : new FormControl(null), 
      glosadiario : new FormControl(null),  
      arrayDetalle: this.fb.array([]),
      /* CAMPOS PARA VALIDACION */
      totalDebeImporte : new FormControl(null),
      totalDebeCambio : new FormControl(null),
      totalHaberImporte : new FormControl(null),
      totalHaberCambio : new FormControl(null),
      totalDiferenciaImporte : new FormControl(null),
      totalDiferenciaCambio : new FormControl(null),
    })
  }


  ngOnInit(): void {
    this.onCargarDropdown();
    if(this.data){
      this.tituloVista = "Editar Asiento Tesorería",
      this.spinner.show();
      this.Avisar(); 
    }
  }

  Avisar() {
    this.FlgLlenaronCombo.subscribe((x) => { 
      this.onObtenerAsientoTesoreriaPorId(this.data.asientoId,'editar');
    });
  }

  onObtenerAsientoTesoreriaPorId(asientoid : number, estado: string){  
    this.apiService.asientosoreriaId(asientoid).subscribe((resp)=>{  
      if(resp){   
        this.dataTesoreriaEdit = resp; 
        this.existeRegistro = true; 
        this.onPintarDataFormulario(estado);  
      } 
    });
  }

  onPintarDataFormulario(estado){ 
    this.Form.patchValue({ 
      esdiario : this.dataTesoreriaEdit.esdiario,  
      estesoreria :  this.dataTesoreriaEdit.estesoreria,   
      fecharegistro : new Date(this.dataTesoreriaEdit.fecharegistro),   
      documentoid : this.arrayTipoDoc.find(
        (x) => x.id === this.dataTesoreriaEdit.documentoid
      ),  
      secuencial : this.dataTesoreriaEdit.secuencial,  
      tipocambio :  this.dataTesoreriaEdit.tipocambio,   
      tipocomprobanteid : this.arrayTipoComprobante.find(
        (x) => x.id === this.dataTesoreriaEdit.tipocomprobanteid
      ), 
      monedaid : this.arrayMonedas.find(
        (x) => x.id === this.dataTesoreriaEdit.monedaid
      ), 
      nombrediario : this.dataTesoreriaEdit.nombrediario,  
      glosadiario : this.dataTesoreriaEdit.glosadiario 
     })

      for( let  i = 0; i < this.dataTesoreriaEdit.detalle.length; i++){
        if(estado === 'editar'){
          this.onAgregarDetalles(); 
          this.onCalcularDetalle(i);
        }

        this.detallesForm[i].patchValue({ 
          asientodetalleid : this.dataTesoreriaEdit.detalle[i].asientodetalleid,
          asientoid: this.dataTesoreriaEdit.detalle[i].asientoid,
          rucPersona: this.dataTesoreriaEdit.detalle[i].anexo,
          personaid :this.dataTesoreriaEdit.detalle[i].personaid,
          nrocuenta :this.dataTesoreriaEdit.detalle[i].nrocuenta,
          naturaleza :this.dataTesoreriaEdit.detalle[i].naturaleza,
          importe :this.dataTesoreriaEdit.detalle[i].importe,
          cambio :this.dataTesoreriaEdit.detalle[i].cambio,
          centrocosto :this.dataTesoreriaEdit.detalle[i].centrocosto,
          documentoid: this.arrayTipoDocumento.find(
            (x) => x.id ===  this.dataTesoreriaEdit.detalle[i].documentoid
          ),
          nrodocumento :this.dataTesoreriaEdit.detalle[i].nrodocumento,
          documentorefid: this.arrayTipoDocumentoReferencia.find(
            (x) => x.id ===  this.dataTesoreriaEdit.detalle[i].documentorefid
          ),
          nrodocumentoref :this.dataTesoreriaEdit.detalle[i].nrodocumentoref,
          analisis :this.dataTesoreriaEdit.detalle[i].analisis,
          fechadetalle :this.dataTesoreriaEdit.detalle[i].fechadetalle ? new Date(this.dataTesoreriaEdit.detalle[i].fechadetalle) : null, 
          fechavencimiento :this.dataTesoreriaEdit.detalle[i].fechavencimiento ? new Date(this.dataTesoreriaEdit.detalle[i].fechavencimiento) : null,  
        });
        this.spinner.hide(); 
      }
   

   
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
        this.Form.controls['tipocambio'].setValue(resp.valorventa)
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
      nrodocumento: new FormControl(null),
      documentorefid: new FormControl(0),  
      nrodocumentoref : new FormControl(null), 
      analisis: new FormControl(null),     
      fechadetalle: new FormControl(null), 
      fechavencimiento: new FormControl(null),  
    });
  }

  onCalcularDetalle(posicion : number){  
    const dataForm = this.Form.value;
    const dataFormDetail = (this.Form.get('arrayDetalle') as FormArray).at(posicion).value;
 
    let AsignarCambio

    if(dataForm.monedaid.id === 1){
      AsignarCambio  = dataFormDetail.importe / dataForm.tipocambio;
    }else  if(dataForm.monedaid.id === 2){
      AsignarCambio  =  dataFormDetail.importe  * dataForm.tipocambio;
    }else{
      AsignarCambio  = dataFormDetail.importe  * dataForm.tipocambio;
    }
 
    this.detallesForm[posicion].patchValue({
      cambio : AsignarCambio, 
    });

    setTimeout(() => {
      this.onCalcularDiferencia();
    }, 500);
  }


  onRefrescarCalculosPorTipoCambio(){ 
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

  onCondicionarNaturaleza(event, posicion){ 
    
    if(event === "D" || event === "H") {
      this.onCalcularDiferencia();
    } else{
      this.swal.mensajeAdvertencia('No se puede ingresar otra naturaleza, solo se permite "D" ó "H"');
      this.detallesForm[posicion].patchValue({
        naturaleza : null, 
      });
      return;
    }
    
  }

   onCalcularDiferencia(){
    let ArrayDebe : any[]= [];
    let ArrayHaber : any[]= [];

    this.detallesForm.forEach(det => {
      if(det.value.naturaleza === "D"){
        ArrayDebe.push(det.value);
      }
      if(det.value.naturaleza === "H"){
        ArrayHaber.push(det.value);
      }
    })

    /*SUMA */
    let SumDebeImporte = ArrayDebe.reduce((sum, data)=> (sum + +data.importe ?? 0 ), 0);
    let SumHaberImporte = ArrayHaber.reduce((sum, data)=> (sum + +data.importe ?? 0 ), 0);
    
    /*TIPO CAMBIO */
    let SumDebeCambio  = ArrayDebe.reduce((sum, data)=> (sum + +data.cambio ?? 0 ), 0);
    let SumHaberCambio  = ArrayHaber.reduce((sum, data)=> (sum + +data.cambio ?? 0 ), 0);

    let SumDiferenciaImporte =  SumDebeImporte - SumHaberImporte
    let SumDiferenciaCambio =  SumDebeCambio - SumHaberCambio

    /* REEMPLAZAMOS VALORES */
      this.Form.patchValue({
        totalDebeImporte : SumDebeImporte,
        totalHaberImporte : SumHaberImporte,

        totalDebeCambio : SumDebeCambio,
        totalHaberCambio : SumHaberCambio,

        totalDiferenciaImporte : SumDiferenciaImporte,
        totalDiferenciaCambio : SumDiferenciaCambio,
      })
 
   }
  
  onEliminarDetalle(index : any, asientodetalleid : any){ 
    if(!asientodetalleid){
      this.fa.removeAt(index);
      this.cdr.detectChanges(); 
      this.onCalcularDiferencia();
    } else{
      this.swal.mensajePregunta("¿Seguro que desea eliminar el detalle.?").then((response) => {
        if (response.isConfirmed) {
          this.arrayDetallesEliminados.push(asientodetalleid);
          this.fa.removeAt(index); 
          this.swal.mensajeExito('El detalle ha sido eliminado correctamente!.');
          this.onCalcularDiferencia();
        }
      })
    }

  }

 
  // onBuscarAnexo(data :any){

  // }

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
    const dataForm = this.Form.value;

    // if(dataForm.totalDiferenciaImporte != dataForm.totalDiferenciaCambio ){
    //   this.swal.mensajeAdvertencia("Revisar los montos de diferencia. Deben quedar en '0'");
    //   return;
    // }
 
    let detalle = this.onGrabarDetalleAsiento();
    const newAsientoTesoseria : ICrearAsientoTesoreria = {
      asientoid : this.dataTesoreriaEdit ? this.dataTesoreriaEdit.asientoid : 0,
      esdiario : dataForm.esdiario,
      estesoreria : dataForm.estesoreria,
      fecharegistro :this.formatoFecha.transform(dataForm.fecharegistro, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      documentoid : dataForm.documentoid.id,
      secuencial : dataForm.secuencial,
      tipocambio : dataForm.tipocambio,
      tipocomprobanteid : dataForm.tipocomprobanteid.id,
      monedaid :  dataForm.monedaid.id,
      nombrediario : dataForm.nombrediario,
      glosadiario : dataForm.glosadiario,
      detalle : detalle,
      idauditoria : this.dataTesoreriaEdit ? this.dataTesoreriaEdit.idauditoria : 0,
      idsToDelete : this.arrayDetallesEliminados
    }

    if(!this.dataTesoreriaEdit){
      this.apiService.save(newAsientoTesoseria).subscribe((resp) => {
        if(resp){
          this.swal.mensajePregunta("¿Quiere editar el Asiento Diario ?").then((response) => {
            if (response.isConfirmed) { 
              this.onObtenerAsientoTesoreriaPorId(resp, 'nuevo');
            }else{
              this.swal.mensajeExito('Los cambios se grabaron correctamente!.')    
              this.cerrar.emit(true);
            }
          })   
        }    
      });
    }else{ 
      this.apiService.update(newAsientoTesoseria).subscribe((resp)=>{ 
        this.swal.mensajePregunta("¿Quiere seguir editando la venta?").then((response) => {
          if (response.isConfirmed) { 
            this.onObtenerAsientoTesoreriaPorId(newAsientoTesoseria.asientoid, 'nuevo')
          }else{
            this.cerrar.emit(true);
            this.swal.mensajeExito('Los cambios se actualizaron correctamente!.')    
          }
        })   
      });
    }

    console.log('newAsientoTesoseria', newAsientoTesoseria);
  }


  onGrabarDetalleAsiento(){
    this.arrayDetalleGrabar = [];
    this.detallesForm.forEach(element => { 
        this.arrayDetalleGrabar.push({
          asientodetalleid : element.value.asientodetalleid,
          asientoid : element.value.asientoid,
          personaid : element.value.personaid,
          nrocuenta : element.value.nrocuenta,
          naturaleza : element.value.naturaleza,
          importe : +element.value.importe,
          cambio : element.value.cambio,
          centrocosto: element.value.centrocosto,
          documentoid : element.value.documentoid.id,
          nrodocumento : element.value.nrodocumento,
          documentorefid : element.value.documentorefid.id,
          nrodocumentoref : element.value.nrodocumentoref,
          analisis : element.value.analisis,
          fechadetalle : this.formatoFecha.transform(element.value.fechadetalle, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA), 
          fechavencimiento : this.formatoFecha.transform(element.value.fechavencimiento, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA), 
        }); 
    })
    return this.arrayDetalleGrabar;
  }

  onRegresar(){
    this.cerrar.emit(false);
  }

}
