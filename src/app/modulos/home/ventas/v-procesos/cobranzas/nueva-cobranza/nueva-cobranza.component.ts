import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { forkJoin, Subject } from 'rxjs';
import { IConfiguracionEmpresa } from 'src/app/modulos/home/configuracion/configuraciones/interface/configuracion.interface';
import { ConfiguracionService } from 'src/app/modulos/home/configuracion/configuraciones/service/configuracion.service';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { VentasService } from '../../ventas/service/venta.service';
import { ICobranzaPorId, IDetallaCobranza } from '../interface/cobranza.interface';
import { CobranzaService } from '../service/cobranza.service';

@Component({
  selector: 'app-nueva-cobranza',
  templateUrl: './nueva-cobranza.component.html',
  styleUrls: ['./nueva-cobranza.component.scss']
})
export class NuevaCobranzaComponent implements OnInit {

  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  @Input() dataCobranza : any;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();

  fechaActual = new Date();
  tituloNuevocobranza: string ="NUEVA COBRANZA";
  opcionesNuevoCobranza: MenuItem[]; 
  Form : FormGroup;
  arrayMonedas : ICombo[];
  arrayMedioPago : ICombo[];
  arrayFormaPago : ICombo[];
  arrayTipoRegistro : ICombo[];
  arrayEstado : any[];
  dataReporte : any;
  dataPendiente :any;
  arrayPendiente : any [] = [];
  detallesEliminar: any [] = [];
  arrayDetallesGrabar : IDetallaCobranza[] = [];

  bloquearCampos : boolean = false;
  existenroRegsitro : boolean = false;
  VistaReporte : boolean = false;
  VistaBuscarPendiente: boolean = false;
  mostrarOpcionReporte: boolean = false;
  CobranzaEditar : ICobranzaPorId;

  es = ConstantesGenerales.ES_CALENDARIO;
  dataConfiguracion : IConfiguracionEmpresa;
  dataPredeterminadosDesencryptada:any;

  constructor(
    private cobranzaService : CobranzaService,
    private generalService : GeneralService,
    private ventaService : VentasService,
    private swal : MensajesSwalService,
    private readonly formatoFecha : DatePipe,
    private config : PrimeNGConfig,
    private fb : FormBuilder, 
    private configService: ConfiguracionService,
  ) {
    this.builform(); 
    this.arrayEstado = [
      { id: true,  nombre: 'ACTIVA'},
      { id: false, nombre: 'ANULADA'},
    ]

   }

  public builform(){
    this.Form = new FormGroup({
      fecha : new FormControl(this.fechaActual, Validators.required),
      moneda : new FormControl(null, Validators.required),
      tipoCambio : new FormControl(null, Validators.required),
      estado : new FormControl({ id: true,  nombre: 'ACTIVA'}, Validators.required),
      medioPago : new FormControl(null, Validators.required),
      glosa : new FormControl(null), 
      documentoid : new FormControl(null, Validators.required), 
      arrayDetalle: this.fb.array([])
    })
  }
  ngOnInit(): void {
  
    this.dataPredeterminadosDesencryptada = JSON.parse(localStorage.getItem('Predeterminados')); 
    this.config.setTranslation(this.es);
    this.onCargarDropdown();

    if(this.dataCobranza){
      this.tituloNuevocobranza ="EDITAR COBRANZA";
      this.mostrarOpcionReporte = true;
      this.Avisar();
    } 
    this.onOpcionesNuevoCobranza();
  }

  onCargarTipoCambio(){
    let fecha = this.formatoFecha.transform(this.fechaActual, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA)
    this.ventaService.obtenertipodeCambioCobrar(fecha).subscribe((resp) => {
      if(resp){ 
        this.Form.controls['tipoCambio'].setValue(resp.valorventa)
      }
    })
  }

  onCargarDropdown(){
    
    const data = { 
        esCajaBanco : true
    }
    const obsDatos = forkJoin(
      this.generalService.listadoPorGrupo('Monedas'),
      this.generalService.listadoPorGrupo('MediosPago'), 
      this.generalService.listadoDocumentoPortipoParacombo(data), 
      this.ventaService.obtenerFormasdePagoCobrar(this.dataPredeterminadosDesencryptada ? +this.dataPredeterminadosDesencryptada.idEstablecimiento : 1), 
    );
    obsDatos.subscribe((response) => {
      this.arrayMonedas = response[0];  
      this.arrayMedioPago = response[1]; 
      this.arrayTipoRegistro = response[2]; 
      this.arrayFormaPago = response[3]; 
      this.FlgLlenaronCombo.next(true);
      if(!this.dataCobranza){
        this.onCargarTipoCambio();
        this.onCargarDatosdeConfiguracion(); 
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }

   
  onCargarDatosdeConfiguracion(){
    this.configService.listadoConfiguraciones().subscribe((resp) => {
      if(resp){
        this.dataConfiguracion = resp  
         
        this.Form.patchValue({  
          monedaid: this.arrayMonedas.find(
            (x) => x.id === this.dataConfiguracion.ventamonedadefaultid
          ),   
          condicionpagoid: this.arrayMedioPago.find(
            (x) => x.id === this.dataConfiguracion.ventacondicionpagodefaultid
          ),  
          glosa :this.dataConfiguracion.ventaglosadefault, 
        })
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  Avisar(){
    this.FlgLlenaronCombo.subscribe((x) => {
      this.onPintarCobranzaPorId();
    });
  }

  onPintarCobranzaPorId(){
    this.cobranzaService.cobranzaPorId(this.dataCobranza.idCobranza).subscribe((resp)=>{
      if(resp){
        this.existenroRegsitro = true
        this.CobranzaEditar = resp;
        
        this.Form.patchValue({
          fecha : new Date(this.CobranzaEditar.fecharegistro),
          moneda : this.arrayMonedas.find(
            (x) => x.id === this.CobranzaEditar.monedaid
          ),
          tipoCambio : this.CobranzaEditar.tipocambio,
          estado : this.arrayEstado.find(
            (x) => x.id === this.CobranzaEditar.estadoid
          ), 
          medioPago : this.arrayMedioPago.find(
            (x) => x.id === this.CobranzaEditar.mediopagoid
          ),
          glosa : this.CobranzaEditar.glosa,
          documentoid : this.arrayTipoRegistro.find(
            (x) => x.id === this.CobranzaEditar.documentoid
          ), 
        })

        for( let  i = 0; i < this.CobranzaEditar.detalle.length; i++){ 
          this.onAgregarPendientes(); 
          this.detallesForm[i].patchValue({     
            aplicaretencion: this.CobranzaEditar.detalle[i].aplicaretencion,
            cobranzadetalleid : this.CobranzaEditar.detalle[i].cobranzadetalleid,
            cobranzaid : this.CobranzaEditar.detalle[i].cobranzaid,
            documentopagorefid  : this.CobranzaEditar.detalle[i].documentopagorefid,  
            formapagoid : this.arrayFormaPago.find(
              (x) => x.id === this.CobranzaEditar.detalle[i].formapagoid
            ), 
            importecobrado: this.CobranzaEditar.detalle[i].importecobrado,
            importeporcobrar: this.CobranzaEditar.detalle[i].importeporcobrar,
            importeredondeo:  this.CobranzaEditar.detalle[i].importeredondeo,
            importeretencion:  this.CobranzaEditar.detalle[i].importeretencion,
            importesaldo: this.CobranzaEditar.detalle[i].importesaldo,
            nombreRazSocial :  this.CobranzaEditar.detalle[i].nombreRazSocial,
            nrodocpagoref:  this.CobranzaEditar.detalle[i].nrodocpagoref, 
            nrodocretencion:  this.CobranzaEditar.detalle[i].nrodocretencion,
            nroDocumento:  this.CobranzaEditar.detalle[i].nroDocumento,
            observaciones:  this.CobranzaEditar.detalle[i].observaciones,
            razonsocialcliente:  this.CobranzaEditar.detalle[i].razonsocialcliente, 
            tipDoc: this.CobranzaEditar.detalle[i].tipoDoc,  
            ventaid:  this.CobranzaEditar.detalle[i].ventaid,

          });
            
        }

      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  } 


  onOpcionesNuevoCobranza(){
    this.opcionesNuevoCobranza = [
      {
        label:'Buscar Pendiente',
        icon:'fas fa-clock', 
        command:()=>{
          this.onBuscarPendiente();
        }
      },
      {
        label:'Reporte',
        icon:'fas fa-file',
        visible : this.mostrarOpcionReporte,
        command:()=>{
          this.onReporteCobranza();
        }
      }, 
    ] 
  }

  onBuscarPendiente(){
    if(this.Form.controls['tipoCambio'].value > 0){
      this.dataPendiente = null
      this.VistaBuscarPendiente = true;
    }else{
      this.swal.mensajeAdvertencia('Elegir un tipo de campbio');
    }

  }
  

  get fa() { return this.Form.get('arrayDetalle') as FormArray; } 
  get detallesForm() { return this.fa.controls as FormGroup[]; }

  onAgregarPendientes(){
    this.detallesForm.push(this.AddDetalle());  
  }

  AddDetalle(){
    return this.fb.group({ 
      aplicaretencion: new FormControl(false),
      cobranzadetalleid : new FormControl(0), 
      cobranzaid : new FormControl(0), 
      codcliente : new FormControl(null),
      documentopagorefid  : new FormControl(null),
      formapagoid: new FormControl(null),  
      importecobrado: new FormControl(null),  
      importeporcobrar: new FormControl(null),   
      importeredondeo: new FormControl(0),
      importeretencion: new FormControl(0),
      importesaldo: new FormControl(0),  
      nombreRazSocial : new FormControl(null), 
      nrodocpagoref: new FormControl(null),   
      nrodocretencion: new FormControl(null),   
      nroDocumento: new FormControl(null), 
      observaciones: new FormControl(null), 
      razonsocialcliente: new FormControl(null),  
      tipDoc: new FormControl(null),  
      ventaid: new FormControl(null),  
      
    });
  }

  onEliminarDetalle(index : number){
    this.fa.removeAt(index);  
    if(!this.fa.value.length){
      this.bloquearCampos = false;
    }
  }

  onPintarPendientesSeleccionados(event : any){ 
    if(event.pendientes){ 
      this.bloquearCampos = true;
      for( let  i = 0; i < event.pendientes.length; i++){   
        let ExistePendiente = this.detallesForm.find(
          x => x.value.ventaid === event.pendientes[i].ventaId
        )
        if(!ExistePendiente){
          this.onAgregarPendientes();  
        }else{
          this.swal.mensajeInformacion('El pendiente ya existe en la grilla');
          return;
        }
        this.detallesForm[i].patchValue({   
          tipDoc:  event.pendientes[i].documento,  
          nroDocumento : event.pendientes[i].nroDocumento,
          ventaid : event.pendientes[i].ventaId,
          nombreRazSocial : event.pendientes[i].nombreRazSocial,  
          importeporcobrar: event.pendientes[i].saldo.toFixed(2), 
          importecobrado: event.pendientes[i].saldo.toFixed(2),   
        });
          
      }
    }
 
    this.VistaBuscarPendiente = false;
  }
 
  onReporteCobranza(){
    this.dataReporte = this.CobranzaEditar;
    this.VistaReporte = true;
  }
  
  onCalcularSaldo(posicion : number){
    let v_PorCobar = +this.detallesForm[posicion].controls['importeporcobrar'].value,
    v_Cobrado = +this.detallesForm[posicion].controls['importecobrado'].value,
    v_Redondeo = +this.detallesForm[posicion].controls['importeredondeo'].value,
    v_Retencion = +this.detallesForm[posicion].controls['importeretencion'].value

    let SaldoActualizado = (v_PorCobar - (v_Cobrado + v_Redondeo + v_Retencion));

    if(SaldoActualizado < 0){
      this.swal.mensajeAdvertencia('El saldo no puede ser menor a 0, verificar el monto ingresado');
      return;
    }

    this.detallesForm[posicion].patchValue({
       importesaldo: SaldoActualizado.toFixed(2), 
    });
  }
 
  onGrabar(){
    this.arrayDetallesGrabar = [];
    const dataform = this.Form.value;
 
    if(!this.detallesForm.length){
      this.swal.mensajeInformacion('Debe ingresar almenos 1 detalle.');
      return;
    }


    this.detallesForm.forEach((element) => {
      if(!element.value){
        this.swal.mensajeInformacion('Aquellos registros vacios no se insertaran en al registro.');
        return;
      }else{ 
        this.arrayDetallesGrabar.push({ 
          aplicaretencion : element.value.aplicaretencion,
          cobranzadetalleid :  element.value.cobranzadetalleid,
          cobranzaid :  element.value.cobranzaid,
          codcliente : element.value.codcliente,
          documentopagorefid: 0, // element.value.documentopagorefid.id,
          formapagoid :  element.value.formapagoid.id,
          importecobrado :  +element.value.importecobrado,
          importeporcobrar :  element.value.importeporcobrar,
          importeredondeo :  +element.value.importeredondeo,
          importeretencion :  element.value.importeretencion,
          importesaldo :  element.value.importesaldo,
          nombreRazSocial : element.value.nombreRazSocial, 
          nrodocretencion :  element.value.nrodocretencion,
          nroDocumento : element.value.nroDocumento,
          observaciones : element.value.observaciones,
          razonsocialcliente : element.value.razonsocialcliente,
          tipoDoc : element.value.tipoDoc,
          ventaid:  element.value.ventaid 
        });
      }
    })
    
    //sumar todo el importe cobrado 
    let totalCobranza = this.arrayDetallesGrabar.reduce((sum, value)=> (sum + value.importecobrado ?? 0 ), 0);
    let totalRedondeo = this.arrayDetallesGrabar.reduce((sum, value)=> (sum + value.importeredondeo ?? 0 ), 0);

    const newCobranza : ICobranzaPorId  ={
      cobranzaid : this.CobranzaEditar ? this.CobranzaEditar.cobranzaid : 0,
      correlativomensual : this.CobranzaEditar ? this.CobranzaEditar.correlativomensual : 0,
      detalle : this.arrayDetallesGrabar,
      documentoid : dataform.documentoid.id,
      estadoid : dataform.estado.id,
      fecharegistro:  this.formatoFecha.transform( dataform.fecha, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),  
      glosa: dataform.glosa,
      mediopagoid: dataform.medioPago.id,
      monedaid : dataform.moneda.id,
      tipocambio : +dataform.tipoCambio,
      totalcobranza : +totalCobranza,
      idauditoria :  this.CobranzaEditar ? this.CobranzaEditar.idauditoria : 0,
      nroRegistro:  this.CobranzaEditar ? this.CobranzaEditar.nroRegistro : '',
      totalredondeo : +totalRedondeo,
      idsToDelete : this.detallesEliminar
    }

    if(!this.CobranzaEditar){
      this.cobranzaService.createcobranza(newCobranza).subscribe((resp)=> {
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito('Se grabaron los datos correctamente!.');
      }, error => { 
        this.swal.mensajeError(error.error.errors);
      })
    }else{
      this.cobranzaService.updateCobranza(newCobranza).subscribe((resp)=> {
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
      }, error => { 
        this.swal.mensajeError(error.error.errors);
      })
    } 
  }

  onVolver(){
    this.cerrar.emit('exito');
  }

  onRegresar(){
    this.cerrar.emit(false);
  }

  onRetornar(){
   this.VistaReporte = false;
  }


}
