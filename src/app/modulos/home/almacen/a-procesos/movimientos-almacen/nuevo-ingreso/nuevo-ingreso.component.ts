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
import { ICrearMovimientoAlmacen, IMovimientosAlmacenDetalle, IMovimientosAlmacenPorId } from '../interface/movimientosalmacen.interface';
import { MovimientosAlmacenService } from '../service/movimientosalmacen.service';
  
@Component({
  selector: 'app-nuevo-ingreso',
  templateUrl: './nuevo-ingreso.component.html',
  styleUrls: ['./nuevo-ingreso.component.scss']
})
export class NuevoIngresoComponent implements OnInit {

  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  @Input() dataMovimientoEdit : any;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  es : any = ConstantesGenerales.ES_CALENDARIO;
  Form! : FormGroup; 
  fechaActual = new Date(); 
  tituloNuevoMovimiento : string = "";

  arrayUnidadesMedida : ICombo[];
  arrayAlmacen : ICombo[];
  arrayMonedas :  ICombo[];
  arrayMotivoIngreso: ICombo[];
  arrayDocumentos : ICombo[];
  arrayDetalleGrabar : IMovimientosAlmacenDetalle[] = [];
  arrayDetallesEliminados: any[] =[];
  MovimientoEditar : IMovimientosAlmacenPorId;
  dataReporte : any;
  dataProductos :any;

  VistaReporte : boolean = false;
  modalBuscarPersona : boolean = false;
  modalBuscarProducto : boolean = false;
  mostrarBotonReportes : boolean = false;
  mostrarDropdownAlmacenDestino :boolean =false; 
  existenroRegsitro : boolean = false;

  idPersonaSeleccionada : number = 0;  

  dataPredeterminadosDesencryptada :any;
  
  constructor(
    private moviAlmacenService : MovimientosAlmacenService,
    private generalService : GeneralService,
    private swal : MensajesSwalService, 
    private ventaService : VentasService,
    private fb : FormBuilder,
    private cdr: ChangeDetectorRef,
    private primengConfig : PrimeNGConfig, 
    private formatoFecha : DatePipe,
    private spinner : NgxSpinnerService
  ) { 
    this.builform();
   }

   public builform():void{
    this.Form = this.fb.group({
      fecha: new FormControl(this.fechaActual, Validators.required),
      almacenOrigen: new FormControl(null, Validators.required), 
      almacenDestino: new FormControl(null), 
      motivo: new FormControl(null, Validators.required), 
      glosa: new FormControl(""), 
      anexo: new FormControl("", Validators.required),
      moneda: new FormControl(null, Validators.required), 
      tipocambio: new FormControl(null, Validators.required), 
      arrayDetalles: this.fb.array([]),  
    }); 
   }


  ngOnInit(): void {   
    this.primengConfig.setTranslation(this.es);
    this.EvaluarTitulo();
    this.onCargarDropdown();
    this.onValidarRequeridos(); 

    if(this.dataMovimientoEdit.idMovimiento){   
      this.spinner.show();
      this.Avisar();
    }
  }


  onCargarTipoCambio(){
    let fecha = this.formatoFecha.transform(this.fechaActual, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA)
    this.ventaService.obtenertipodeCambioCobrar(fecha).subscribe((resp) => {
      if(resp){
        this.Form.controls['tipocambio'].setValue(resp.valorventa)
      }
    })
  }

  onCargarDropdown(){
    let tipoMovimientoCombo
    if(this.dataMovimientoEdit.idTipoMovimiento === 1){
      tipoMovimientoCombo = 'MotivosIngresos'
    }else if(this.dataMovimientoEdit.idTipoMovimiento === 2){
      tipoMovimientoCombo = 'MotivosSalidas'
    }else{
      tipoMovimientoCombo = 'MotivoTransferencias'
    } 

    const obsDatos = forkJoin(  
      this.generalService.listadoUnidadMedida(),
      this.generalService.listadoAlmacenes(),
      this.generalService.listadoPorGrupo('Monedas'),
      this.generalService.listadoPorGrupo(tipoMovimientoCombo), 
      this.generalService.listadoComboSerie()
    );
    obsDatos.subscribe((response) => {
      this.arrayUnidadesMedida = response[0];
      this.arrayAlmacen = response[1];  
      this.arrayMonedas = response[2];
      this.arrayMotivoIngreso = response[3];  
      this.arrayDocumentos = response[4];    
      this.FlgLlenaronCombo.next(true); 
      if(!this.dataMovimientoEdit.idMovimiento){   
        this.onCargarTipoCambio();
        this.dataPredeterminadosDesencryptada = JSON.parse(localStorage.getItem('Predeterminados')); 
        if( this.dataPredeterminadosDesencryptada){
          this.Form.patchValue({
            almacenOrigen: this.arrayAlmacen.find(
              (x) => x.id === +this.dataPredeterminadosDesencryptada.idalmacen
            ), 
          })
        }
      } 
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  Avisar(){
    this.FlgLlenaronCombo.subscribe((x) => {
      this.onObtenerMovimientoPorId(this.dataMovimientoEdit.idMovimiento, 'editar'); 
    });
  }
 
  get fa() { return this.Form.get('arrayDetalles') as FormArray; } 
  get detallesForm() { return this.fa.controls as FormGroup[]; }

  onAgregarDetalle(){    
    this.detallesForm.push(this.AddDetalle());    
  }

  AddDetalle(){ 
    return this.fb.group({ 
      idProducto: new FormControl(null),   
      codigoProducto : new  FormControl(null),   
      descripcion : new FormControl(null),   
      cantidad: new FormControl(0),  
      unidadMedida: new FormControl(null),
      valorUnitario: new FormControl(null),   
      valorTotal: new FormControl(null),   
      nroGuiaRemision: new FormControl(null),  
      tipodocumentoRef: new FormControl(null), 
      nrodocumentoref: new FormControl(null), 
      nroSerie: new FormControl(null),
      nroLote: new FormControl(null),
      fecVencimiento: new FormControl(null), 
      movimientodetalleid: new FormControl(0),
    }) 
  }
  
  onEliminarDetalle(index : any, detalleid : any){  
    if(detalleid === 0){
      this.fa.removeAt(index);  
      this.cdr.detectChanges();   
    } else{
      this.swal.mensajePregunta("¿Seguro que desea eliminar el detalle.?").then((response) => {
        if (response.isConfirmed) {
          this.arrayDetallesEliminados.push(detalleid);
          this.fa.removeAt(index);  
          this.swal.mensajeExito('El detalle ha sido eliminado correctamente!.'); 
        }
      })  
    }
  
  }
 
  onObtenerMovimientoPorId(idMovimiento: number, estado : string){    
    this.moviAlmacenService.movimientoAlmacenPorId(idMovimiento).subscribe((resp) => {
      if(resp){ 
        this.existenroRegsitro = true;
        this.mostrarBotonReportes = true;
        this.MovimientoEditar = resp; 
        this.idPersonaSeleccionada  = this.MovimientoEditar.personaid
        this.Form.patchValue({
          fecha: new Date(this.MovimientoEditar.fechamovimiento),
          almacenOrigen: this.arrayAlmacen.find(
            (x) => x.id === this.MovimientoEditar.almacenorigenid
          ),
          almacenDestino: this.arrayAlmacen.find(
            (x) => x.id === this.MovimientoEditar.almacendestinoid
          ),
          motivo: this.arrayMotivoIngreso.find(
            (x) => x.id === this.MovimientoEditar.motivoid
          ),
          glosa: this.MovimientoEditar.glosa,
          anexo: this.MovimientoEditar.nombrePersona,
          moneda: this.arrayMonedas.find(
            (x) => x.id === this.MovimientoEditar.monedaid
          ),
          tipocambio: this.MovimientoEditar.tipocambio 
        }) 
        
        for( let  i = 0; i < this.MovimientoEditar.detalles.length; i++){ 
           if(estado === 'editar'){
             this.onAgregarDetalle(); 
           }
           this.detallesForm[i].patchValue({
            codigoProducto : this.MovimientoEditar.detalles[i].codproductofinal,
            descripcion : this.MovimientoEditar.detalles[i].descripcionproductofinal, 
            cantidad: this.MovimientoEditar.detalles[i].cantidad, 
            unidadMedida: this.arrayUnidadesMedida.find(
              (x) => x.id ===  this.MovimientoEditar.detalles[i].unidadmedidaid
            ),  
            valorUnitario: this.MovimientoEditar.detalles[i].preciosinigv,
            valorTotal: this.MovimientoEditar.detalles[i].subtotal, 
            nroGuiaRemision: this.MovimientoEditar.detalles[i].guiaremisionref, 
            
            tipodocumentoRef: this.arrayDocumentos.find(
              (x) => x.id ===  +this.MovimientoEditar.detalles[i].tipodocumentoidref
            ),  
            nrodocumentoref: this.MovimientoEditar.detalles[i].nrodocumentoref,
            nroSerie:  this.MovimientoEditar.detalles[i].nroserie,
            nroLote:  this.MovimientoEditar.detalles[i].nrolote,
            fecVencimiento: new Date(this.MovimientoEditar.detalles[i].fechavencimiento),  
            movimientodetalleid: this.MovimientoEditar.detalles[i].movimientodetalleid,
            idProducto :  this.MovimientoEditar.detalles[i].productoid,
           });
           
         }

         this.spinner.hide();
      }
      
    },error => { 
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);  
    });
  } 
  
  onModalBuscarPersona(){
    this.modalBuscarPersona = true;
  }
   

  onBuscarProductoPorCodigo(posicion: any){
    let codProductoaBuscar = (this.Form.get('arrayDetalles') as FormArray).at(posicion).value.codigoProducto;
    const data = {
      periodo : this.fechaActual.getFullYear(),
      criteriodescripcion : codProductoaBuscar
    }
    this.generalService.BuscarProductoPorCodigo(data).subscribe((resp) => {
      if(resp[0]){
      this.detallesForm[posicion].patchValue({
        codigoProducto:  resp[0].codProducto,
        descripcion: resp[0].nombreProducto,
        unidadMedida: this.arrayUnidadesMedida.find(
          (x) => x.id ===   resp[0].unidadMedidaId
        ),
        valorUnitario : resp[0].precioDefault.toFixed(2),
        idProducto : resp[0].productoId, 
        nroSerie: resp[0].serie === "0" ? null : resp[0].serie, 
        nroLote: resp[0].lote === "0" ? null : resp[0].lote,  
      }); 
    }else{
      this.swal.mensajeAdvertencia('no se encontraron datos con el codigo ingresado.');
    }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }


  onModalBuscarProducto(index : number){
    const data = this.Form.value;  
    if(!data.almacenOrigen){
      this.swal.mensajeAdvertencia('Debes Seleccionar un Almacen para continuar');
      return;
    }
    const dataProducto = {
      idAlmacenSelect : data.almacenOrigen.id,
      idPosicionProducto : index
    }
    this.dataProductos = dataProducto
    this.modalBuscarProducto = true;
  }

   
  onPintarPersonaSeleccionada(event : any){
    this.modalBuscarPersona= false;
    this.idPersonaSeleccionada = event.idPersona,
    this.Form.controls['anexo'].setValue(event.nombreRazSocial); 
  }

  onPintarProductoSeleccionado(event : any){  
    this.modalBuscarProducto= false;  
    this.detallesForm[event.posicion].patchValue({
      codigoProducto:  event.data.codProducto,
      descripcion: event.data.nombreProducto, 
      nroSerie: event.data.serie === "0" ? null : event.data.serie , 
      nroLote: event.data.lote === "0" ? null : event.data.lote, 
      unidadMedida: this.arrayUnidadesMedida.find(
        (x) => x.id ===   event.data.unidadMedidaId
      ),  
      valorUnitario : event.data.precioDefault.toFixed(2),
      idProducto : event.data.productoId, 
    });
  }

  onCalcularValorTotal(posicion : number, data:any){
    this.detallesForm[posicion].patchValue({
      valorTotal: data.cantidad * data.valorUnitario
    });
  }

  onReporte(){
    this.dataReporte = this.MovimientoEditar
    this.VistaReporte = true;
  }

  onGrabar(){
    this.arrayDetalleGrabar = []
    const dataform = this.Form.value;  
    if(!(this.detallesForm.length > 0)){
      this.swal.mensajeAdvertencia('Debes ingresar almenos un detalle');
      return;
    }

    this.detallesForm.forEach(element => { 
      if(!element.value){
        this.swal.mensajeInformacion('Aquellos registros vacios no se insertaran en al registro.');
        return;
      }else{ 
  
        this.arrayDetalleGrabar.push({
          codproductofinal : element.value.codigoProducto,
          descripcionproductofinal: element.value.descripcion,
          cantidad : element.value.cantidad, 
          fechavencimiento : this.formatoFecha.transform(element.value.fecVencimiento,ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
          guiaremisionref : element.value.nroGuiaRemision,  
          nrodocumentoref : element.value.nrodocumentoref,
          nrolote : element.value.nroLote,
          nroserie : element.value.nroSerie, 
          preciosinigv : element.value.valorUnitario,
          productoid : element.value.idProducto,
          movimientodetalleid:  element.value.movimientodetalleid ? element.value.movimientodetalleid : 0, 
          movimientoid : element.value.movimientoid ? element.value.movimientoid : 0,
          subtotal : element.value.valorTotal,
          tipodocumentoidref : element.value.tipodocumentoRef ?  +element.value.tipodocumentoRef.id : -1,
          unidadmedidaid: element.value.unidadMedida.id   
        });  
      }
    })    

   
    const newMovimiento : ICrearMovimientoAlmacen = {
      detailIdsToDelete : this.arrayDetallesEliminados,
      almacendestinoid : dataform.almacenDestino ? dataform.almacenDestino.id : dataform.almacenOrigen.id,
      almacenorigenid : dataform.almacenOrigen.id,
      cantidadtotal : this.MovimientoEditar ? this.MovimientoEditar.cantidadtotal : 0,
      detalles: this.arrayDetalleGrabar,  
      fechamovimiento : this.formatoFecha.transform(dataform.fechamovimiento,ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      glosa: dataform.glosa,
      monedaid : dataform.moneda.id,
      motivoid : dataform.motivo.id,
      personaid : this.idPersonaSeleccionada,
      tipocambio : dataform.tipocambio,
      tipomovimiento : this.dataMovimientoEdit.idTipoMovimiento,
      valortotal : this.MovimientoEditar ?  this.MovimientoEditar.valortotal : 0,
      correlativomensual :this.MovimientoEditar ?  this.MovimientoEditar.correlativomensual : 0,
      idauditoria :this.MovimientoEditar ?  this.MovimientoEditar.idauditoria : 0,
      movimientoid : this.MovimientoEditar ? this.MovimientoEditar.movimientoid : 0,
    }
      
    if(!this.MovimientoEditar){
      this.moviAlmacenService.createmovimientoAlmacen(newMovimiento).subscribe((resp)=>{
        if(resp){
          this.swal.mensajePregunta("¿Desea editar el Movimiento?.").then((response) => {
            if (response.isConfirmed) { 
              this.onObtenerMovimientoPorId(+resp, 'nuevo')
            }else{
              this.swal.mensajeExito('los datos de grabaron correctamente!.');
              this.onVolver();
            }
          })
        }  
      },error => { 
        this.generalService.onValidarOtraSesion(error);  
      });
    }else{
      this.moviAlmacenService.updatemovimientoAlmacen(newMovimiento).subscribe((resp)=>{ 
          this.swal.mensajePregunta("¿Desea seguir editando el Movimiento?.").then((response) => {
            if (response.isConfirmed) { 
              this.onObtenerMovimientoPorId(newMovimiento.movimientoid, 'nuevo')
            }else{
              this.swal.mensajeExito('los datos de actualizaron correctamente!.');
              this.onVolver();
            }
          }) 
        },error => { 
          this.generalService.onValidarOtraSesion(error);  
        });
    }

  }

  onRetornar(){
    this.VistaReporte = false;
  }

  onVolver(){ 
    this.cerrar.emit('exito') 
  }

  onRegresar(){ 
    this.cerrar.emit(false) 
  }

  onValidarRequeridos(){
    const almacenDestino = this.Form.get("almacenDestino");

    if (this.dataMovimientoEdit.idTipoMovimiento === 3) {  
      this.mostrarDropdownAlmacenDestino = true; 
      almacenDestino.setValidators([Validators.required]); 
    } else{ 
      this.mostrarDropdownAlmacenDestino = false;
      almacenDestino.setValidators(null); 
    }
    almacenDestino.updateValueAndValidity();
  }
 
  EvaluarTitulo(){
    if (this.dataMovimientoEdit.idMovimiento) {  
      if (this.dataMovimientoEdit.idTipoMovimiento === 1) {  
        this.tituloNuevoMovimiento = "EDITAR INGRESO"
      }else if (this.dataMovimientoEdit.idTipoMovimiento === 2) {  
        this.tituloNuevoMovimiento = "EDITAR SALIDA"
      }else{
        this.tituloNuevoMovimiento = "EDITAR TRANSFERENCIA"
      }
    }else{
      if (this.dataMovimientoEdit.idTipoMovimiento === 1) {  
        this.tituloNuevoMovimiento = "NUEVO INGRESO"
      }else if (this.dataMovimientoEdit.idTipoMovimiento === 2) {  
        this.tituloNuevoMovimiento = "NUEVO SALIDA"
      }else{
        this.tituloNuevoMovimiento = "NUEVO TRANSFERENCIA"
      }
    }
  }
}


