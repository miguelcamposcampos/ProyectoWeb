import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api';
import { forkJoin, Subject } from 'rxjs';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { VentasService } from '../../ventas/service/venta.service';
import { ICajaChicaPorID, ICrearCajaChica, IDetalleCajaChica } from '../interface/cajachica.interface';
import { CajaChicasService } from '../service/cajachica.service';

@Component({
  selector: 'app-nueva-caja-chica',
  templateUrl: './nueva-caja-chica.component.html',
  styleUrls: ['./nueva-caja-chica.component.scss']
})
export class NuevaCajaChicaComponent implements OnInit {

  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  @Input() dataCajaChica : any;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  tituloCajaChica : string ="NUEVA CAJA CHICA";
  existenroRegsitro: boolean = false;
  fechaActual = new Date(); 
  fechaActualDetalle : Date = new Date('es-PE');

  CajaChicaEditar: ICajaChicaPorID;
  Form : FormGroup;
  es = ConstantesGenerales.ES_CALENDARIO;
  arrayEstablecimiento : ICombo[];
  arrayDocumentoTC : ICombo[];
  arrayDocumento : ICombo[];
  arrayMonedas : ICombo[];
  arrayAlmacen: ICombo[];
  arrayEstado : any[];
  arrayMotivo: any[];
  idEstablecimientoSeleccionado : number = 0;
  arrayDetalleGrabar : IDetalleCajaChica[] = [];
  arrayDetalleEliminados: any[] = [];
  Tingresos : number = 0;
  TSalidas : number = 0;
  TCajaSaldo :number = 0;

  estadoForm: string ="";
  dataPredeterminadosDesencryptada :any;

  constructor(
    private generalService : GeneralService,
    private cajachicaService : CajaChicasService,
    private swal : MensajesSwalService,
    private ventaService : VentasService,
    private formatoFecha : DatePipe,
    private config : PrimeNGConfig,
    private fb : FormBuilder, 
    private spinner : NgxSpinnerService
  ) { 
   
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
    
    this.builform();
    this.arrayEstado = [
      { id: 0,  nombre: 'ABIERTO'},
      { id: 1, nombre: 'CERRADO'},
    ]

    this.arrayMotivo = [
      { id: 1,  nombre: 'INGRESO'},
      { id: 2, nombre: 'SALIDA'},
    ]
  }

  public builform(){
    this.Form = new FormGroup({
      establecimientoid : new FormControl(null, Validators.required),
      documentoTcid: new FormControl(null, Validators.required),
      fechaemision: new FormControl(this.fechaActual, Validators.required),
      fechacierre : new FormControl(null),
      monedaid : new FormControl(null, Validators.required),
      tipocambio : new FormControl(null, Validators.required),
      estadoid : new FormControl(null, Validators.required),
      arrayDetalleCajaChica:  new FormArray([]),
    })
  }

  ngOnInit(): void {
    this.config.setTranslation(this.es)
    this.onCargarDropdown();

    if(this.dataCajaChica){ 
      this.spinner.show();
      this.tituloCajaChica = "EDITAR CAJA CHICA"  
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

  onObtenerEstablecimiento(event : any){ 
    if(event.value){
        this.idEstablecimientoSeleccionado = event.value.id; 
        this.onCargarAlmacenes(this.idEstablecimientoSeleccionado) 
    }else{ 
      this.idEstablecimientoSeleccionado = null;   
    }
  }

  onCargarAlmacenes(event: number){
    this.generalService.listadoAlmacenesParams(event).subscribe((resp) =>{
      if(resp){
        this.arrayAlmacen = resp;
      }
    });
  }


  onCargarDropdown(){ 
    const data={ 
      esUsadoVentas : true, 
     } 
     const data2={ 
      esCajaBanco : true, 
     }

    const obsDatos = forkJoin<any>(
      this.generalService.listadoComboEstablecimientos(), 
      this.generalService.listadoDocumentoPortipoParacombo(data),
      this.generalService.listadoDocumentoPortipoParacombo(data2), 
      this.generalService.listadoPorGrupo('Monedas'), 
    );
    obsDatos.subscribe((response) => {
      this.arrayEstablecimiento = response[0];
      this.arrayDocumentoTC = response[1];
      this.arrayDocumento = response[2];
      this.arrayMonedas = response[3];  
      this.FlgLlenaronCombo.next(true);  
      if(!this.dataCajaChica){
        this.onCargarTipoCambio(); 
        this.dataPredeterminadosDesencryptada = JSON.parse(localStorage.getItem('Predeterminados')); 
        if(this.dataPredeterminadosDesencryptada){
          this.Form.patchValue({
            establecimientoid: this.arrayEstablecimiento.find(
              (x) => x.id === +this.dataPredeterminadosDesencryptada.idEstablecimiento ?? 0
            ), 
          })
        }
      }
    });
  }

  Avisar() {
    this.FlgLlenaronCombo.subscribe((x) => { 
      this.onObtenerCajaChicaPorId(this.dataCajaChica,'editar');
    });
  }

   /* AGREGAR DETALLE DE LA VENTA */
   get fa() { return this.Form.get('arrayDetalleCajaChica') as FormArray; }
   get detalleCajaChica() { return this.fa.controls as FormGroup[]; }
 
   onAgregarDetalleVenta(){ 
     this.detalleCajaChica.push(this.AddDetalle());
   }

   AddDetalle(){ 
    let salida 
    if(!this.detalleCajaChica.length){
      salida = {
        id: 1, 
        nombre: 'INGRESO'
      }
    }else{
      salida = {
        id: 2, 
        nombre: 'SALIDA'
      }
    }

    return this.fb.group({
      motivoid: new FormControl(salida),
      importe: new FormControl(null),
      descripcion : new FormControl(null),
      usuarionombre : new  FormControl(null),
      observacion : new FormControl(null),
      documentoid : new FormControl(null), 
      nrodocumento : new  FormControl(null),
      fechaHora : new  FormControl(this.fechaActual),
      cajachicadetalleid : new  FormControl(0),
      cajachicaid : new  FormControl(0),
      personaid : new  FormControl(0),
    })
  }

  onEliminarDetalle(index: number){
    this.fa.removeAt(index);
    
    if(this.detalleCajaChica.length === 0){ 
      this.Tingresos = 0
      this.TSalidas = 0
      this.TCajaSaldo = 0
    }

    this.onCalcularTotales();
  }
 
  onObtenerCajaChicaPorId(idCajachica: number, estado: string){  
    this.cajachicaService.cajaChicaPorId(idCajachica).subscribe((resp)=>{ 
      if(resp){  
        this.CajaChicaEditar = resp;
        this.estadoForm = estado; 
        this.existenroRegsitro = true;   
        this.onPintarDatosParaEditar(resp);
        this.spinner.hide();
      } 
    });
  }

  onPintarDatosParaEditar(data:any){

    this.Form.patchValue({
      establecimientoid: this.arrayEstablecimiento.find(
        (x) => x.id === data.establecimientoid
      ), 
      documentoTcid: this.arrayDocumento.find(
        (x) => x.id === data.documentoid
      ), 
      fechaemision: new Date(data.fechaemision),
      fechacierre : new Date(data.fechacierre),
      monedaid: this.arrayMonedas.find(
        (x) => x.id === data.monedaid
      ),  
      tipocambio : data.tipocambio,
      estadoid: this.arrayEstado.find(
        (x) => x.id === data.estadoid
      ),   
    })

    for( let  i = 0; i < this.CajaChicaEditar.detalle.length; i++){
      if(this.estadoForm === 'editar'){
        this.onAgregarDetalleVenta();
      } 
     
      this.detalleCajaChica[i].patchValue({
        motivoid: this.arrayMotivo.find(
          (x) => x.id === this.CajaChicaEditar.detalle[i].motivoid
        ),   
        importe: this.CajaChicaEditar.detalle[i].importe,
        descripcion : this.CajaChicaEditar.detalle[i].descripcionmotivo,
        usuarionombre : this.CajaChicaEditar.detalle[i].usuarionombre,
        observacion : this.CajaChicaEditar.detalle[i].observacion,
        documentoid: this.arrayDocumentoTC.find(
          (x) => x.id === this.CajaChicaEditar.detalle[i].documentoid
        ),   
        nrodocumento : this.CajaChicaEditar.detalle[i].nrodocumento,
        fechaHora : new Date(this.CajaChicaEditar.detalle[i].fechahoraemision),
        cajachicadetalleid : this.CajaChicaEditar.detalle[i].cajachicadetalleid,
        cajachicaid : this.CajaChicaEditar.detalle[i].cajachicaid,
        personaid : this.CajaChicaEditar.detalle[i].personaid
      })
    }
    this.spinner.hide();
    this.onCalcularTotales();
  }


  onCalcularImportes(valor: string,  index : number){  
    if(+valor){ 
      this.detalleCajaChica[index].patchValue({
        importe : parseInt(valor).toFixed(2)
      }) 
      this.onCalcularTotales();
    }
  }

  onCalcularTotales(){
    let totalIngresos : any[]=[];
    let totalSalidas : any[]=[];
    this.detalleCajaChica.forEach(det => {
      if(det.value.motivoid.nombre === 'INGRESO'){
        totalIngresos.push(det.value);
      }
      if(det.value.motivoid.nombre === 'SALIDA'){
        totalSalidas.push(det.value);
      }
    }) 
    this.Tingresos = totalIngresos.reduce((sum, value)=> (sum + (+value.importe) ?? 0 ), 0);
    this.TSalidas = totalSalidas.reduce((sum, value)=> (sum + (+value.importe) ?? 0 ), 0);
    this.TCajaSaldo = this.Tingresos - this.TSalidas
  } 

  onGrabar(){
    if(this.TCajaSaldo < 0){
      this.swal.mensajeAdvertencia('El Saldo no puede ser menor que 0, Revisar los importes!.');
      return
    }
    const dataform = this.Form.value; 
    let DetallesGrabar :any[] = this.onObtenerDetalles(); 
 
    const newCajaChica : ICrearCajaChica = { 
      cajachicaid: this.CajaChicaEditar ? this.CajaChicaEditar.cajachicaid : 0, 
      documentoid: dataform.documentoTcid.id, 
      fechaemision: this.formatoFecha.transform( dataform.fechaemision, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),  
      monedaid: dataform.monedaid.id,
      estadoid:  dataform.estadoid.id,
      fechacierre: this.formatoFecha.transform( dataform.fechacierre, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),  
      establecimientoid: dataform.establecimientoid.id, 
      tipocambio: dataform.tipocambio,
      totalingresos: +this.Tingresos, 
      totalsalidas: +this.TSalidas,
      saldocaja: +this.TCajaSaldo, 
      detalle: DetallesGrabar,
      idsToDelete : this.arrayDetalleEliminados
    }

    console.log(newCajaChica);

    if(!this.CajaChicaEditar){
      this.cajachicaService.createCajaChica(newCajaChica).subscribe((resp)=>{
        if(resp){
          this.swal.mensajePregunta("¿Quiere continuar con el registro?").then((response) => {
            if (response.isConfirmed) {
              this.onObtenerCajaChicaPorId(resp, 'nuevo');
            }else{
              this.onVolver();
              this.swal.mensajeExito('Los cambios se grabaron correctamente!.')    
            }
          })   
        }    
      });
    }else{
      this.cajachicaService.updateCajaChica(newCajaChica).subscribe((resp)=>{ 
        this.swal.mensajePregunta("¿Quiere seguir editando el registro?").then((response) => {
          if (response.isConfirmed) {
            this.onObtenerCajaChicaPorId(newCajaChica.cajachicaid, 'nuevo')
          }else{
            this.onVolver();
            this.swal.mensajeExito('Los cambios se actualizaron correctamente!.')    
          }
        })   
      });
    }
  }
  
  onObtenerDetalles(){
    this.arrayDetalleGrabar = [];  
    this.detalleCajaChica.forEach((element,i) => {   
  
      this.arrayDetalleGrabar.push({
        cajachicadetalleid: element.value.cajachicadetalleid,
        cajachicaid: element.value.cajachicaid,
        personaid: element.value.personaid,
        motivoid: element.value.motivoid.id,
        importe: +element.value.importe,
        descripcionmotivo: element.value.descripcion,
        usuarionombre: element.value.usuarionombre,
        observacion: element.value.observacion ?? null,
        documentoid: element.value.documentoid ? element.value.documentoid.id : 0,
        nrodocumento: element.value.nrodocumento ?? null,
        fechahoraemision: element.value.fechaHora
      })
    }); 
    return this.arrayDetalleGrabar
  }
 
  onVolver(){
    this.cerrar.emit('exito');
  }

  onRegresar(){
    this.cerrar.emit(false);
  }

 
     

}


