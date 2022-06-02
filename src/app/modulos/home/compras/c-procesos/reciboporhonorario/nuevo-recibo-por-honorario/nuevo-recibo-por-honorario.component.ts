import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { forkJoin, Subject } from 'rxjs';
import { IConfiguracionEmpresa } from 'src/app/modulos/home/configuracion/configuraciones/interface/configuracion.interface';
import { ConfiguracionService } from 'src/app/modulos/home/configuracion/configuraciones/service/configuracion.service';
import { VentasService } from 'src/app/modulos/home/ventas/v-procesos/ventas/service/venta.service';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICrearRxh, IDetalleReferenciaRxH, IDetalleRxH } from '../interface/reciboporhonorario.interface';
import { ReciboPorHonorarioService } from '../service/reciboporhonorario.service';

@Component({
  selector: 'app-nuevo-recibo-por-honorario',
  templateUrl: './nuevo-recibo-por-honorario.component.html',
  styleUrls: ['./nuevo-recibo-por-honorario.component.scss']
})
export class NuevoReciboPorHonorarioComponent implements OnInit {

  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  @Input() dataRxH : any;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  fechaActual = new Date();
  tituloReciboPorHonorario: string ="NUEVO RECIBO POR HONORARIO";
  es = ConstantesGenerales.ES_CALENDARIO;
  existenroRegsitro : boolean = false;
  Form : FormGroup;
  RxhEditar :any;
  DetalleForm : boolean = false; 
  DocReferenciaForm : boolean = false;
  TotalesForm : boolean = false;
  mostrarTextoSwicth : boolean = false;
  modalBuscarPersona: boolean = false;
  modalBuscarCentroCosto: boolean = false;
  existeClienteSeleccionado : boolean = false;
  existeDireccionCliente : boolean = false;
  idClienteSeleccionado : number = 0;
  items: MenuItem[];
  activeItem: MenuItem;
  estadoForm : string = "";
  arrayTipoDocumento : ICombo[];
  arrayMonedas : ICombo[];
  arrayEstado : any[];
  arraySeriePorDocumento: ICombo[];
  arrayDetalleGrabar :  IDetalleRxH[] = [];
  arrayDetalleDocReferenciaGrabar : IDetalleReferenciaRxH[] = [];
  arrayDetallesEliminados: any[] =[];
  arrayDetallesDocRefEliminados: any[] =[];
  arrayPorcentajeRenta : any[] = [
    {id: 1 , nombre : 8},
    {id: 2 , nombre : 10},
  ] 
  dataConfiguracion : IConfiguracionEmpresa;
  dataCentroCosto :any;

  constructor(
    private rxhService : ReciboPorHonorarioService, 
    private ventaservice : VentasService,
    private generalService : GeneralService,
    private swal : MensajesSwalService,
    private readonly formatoFecha : DatePipe,
    private config : PrimeNGConfig,
    private fb : FormBuilder,
    private cdr: ChangeDetectorRef,
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
      documentoid : new FormControl(null, Validators.required),
      serieventa: new FormControl(null, Validators.required),
      secuencialventa: new FormControl(0), 
      nrodocumentocliente: new FormControl(null ,Validators.required),
      nombrecliente: new FormControl(null ,Validators.required),
      direccioncliente:  new FormControl(null),
      fechaemision : new FormControl(this.fechaActual ,Validators.required), 
      monedaid : new FormControl(null ,Validators.required),
      tipocambio : new FormControl(null ,Validators.required), 
      estadoid : new FormControl({ id: true, nombre: 'ACTIVA'}, Validators.required),
      glosa : new FormControl(null),
      afectorenta4ctg : new FormControl(false,Validators.required),
      procentajeRenta : new FormControl(null ,Validators.required),
      importeTotal : new FormControl(null ,Validators.required),
      renta4ctg : new FormControl(null ,Validators.required),
      porpagar : new FormControl(null ,Validators.required),
      totaldebeSoles : new FormControl(null ,Validators.required),
      totaldebeDolares : new FormControl(null ,Validators.required),
      totalhaberSoles : new FormControl(null ,Validators.required),
      totalhaberDolares : new FormControl(null ,Validators.required),
      totalDiferenciaSoles : new FormControl(null ,Validators.required),
      totalDiferenciaDolares : new FormControl(null ,Validators.required),

      arrayDetalle: new FormArray([], Validators.required), 
      arrayDetalleDocumentoRef:  new FormArray([]), 
    }) 
  }


  ngOnInit(): void {
    this.onTabsForm();
    this.onCargarDropdown();
    this.config.setTranslation(this.es)
    if(this.dataRxH){
      this.tituloReciboPorHonorario = "EDITAR RECIBO POR HONORARIO"  
      this.Avisar();
    } 
  
  }

  onCargarDatosdeConfiguracion(){
    this.configService.listadoConfiguraciones().subscribe((resp) => {
      if(resp){
        this.dataConfiguracion = resp  
        this.Form.patchValue({   
          monedaid: this.arrayMonedas.find(
            (x) => x.id === this.dataConfiguracion.compramonedadefault
          ),    
          glosa :this.dataConfiguracion.compraglosadefault,  
        })
      }
    })
  }
  

  onCargarTipoCambio(){
    let fecha = this.formatoFecha.transform(this.fechaActual, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA)
    this.ventaservice.obtenertipodeCambioCobrar(fecha).subscribe((resp) => {
      if(resp){
        this.Form.controls['tipocambio'].setValue(resp.valorventa)
      }
    })
  }



  onCargarDropdown(){ 
    const data={
      usadoReciboHonorario : true
     }

    const obsDatos = forkJoin(  
      this.generalService.listadoPorGrupo('Monedas'),    
      this.generalService.listadoDocumentoPortipoParacombo(data),
    );
    obsDatos.subscribe((response) => { 
      this.arrayMonedas = response[0]; 
      this.arrayTipoDocumento = response[1];
      this.FlgLlenaronCombo.next(true); 
      if(!this.dataRxH){
        this.onCargarTipoCambio();
        this.onCargarDatosdeConfiguracion();
      }
    });
  
  }

 

  onMostrarTextoSwitch(){
    this.mostrarTextoSwicth = !this.mostrarTextoSwicth; 
    this.onCalcularTotales(); 
  }



  Avisar() {
    this.FlgLlenaronCombo.subscribe((x) => {
      this.onObtenerRxHPorId(this.dataRxH.idVenta,'editar');
    });
  }

  onObtenerRxHPorId(idVentaPorid : number, estado: string){
    this.swal.mensajePreloader(true);
    this.ventaservice.ventasPorId(idVentaPorid).subscribe((resp)=>{ 
      if(resp){ 
        this.RxhEditar = resp;
        this.estadoForm = estado;
        this.idClienteSeleccionado = resp.idcliente;    
        this.existenroRegsitro = true;  
      }
      this.swal.mensajePreloader(false);
    })
  }


  onObtenerTipoDocumento(event : any){ 
    // if(event){    

    // }else{  
    //   this.Form.controls['serieventa'].setValue(null);
    // }
  }

  onTabsForm(){
    this.items = [
      {
        id: '1',
        label: 'DETALLES',
        icon: 'pi pi-fw pi-info-circle',
        command: event => {
          this.activateMenu(event.item.id);
        }
      }, 
      {
        id: '2',
        label: 'DOCUMENTOS REFRENCIA', 
        icon: 'pi pi-fw pi-file',
        command: event => {
          this.activateMenu(event.item.id);
        }
      } 
    ]; 
    this.activateMenu('0');
  }

  activateMenu(event) { 
    this.DocReferenciaForm = false;  
    this.DetalleForm = false;  
    this.TotalesForm = false;  

    if(event ===  "2" ){
      this.DocReferenciaForm = true
      this.activeItem = this.items[1];
    }else{
      this.DetalleForm = true;
      this.activeItem = this.items[0];
    }

  }

  /* BUSCAR CENTRO COSTO */
  onModalBuscarCentroCosto(event : any, posicion : number){
    const data = {
      data : event.value,
      posicion : posicion
    }
    this.dataCentroCosto = data;
    this.modalBuscarCentroCosto = true;
  }

  onPintarCentroCosto(data: any){ 
    console.log(data);
    this.modalBuscarCentroCosto = false;
  }
  
 


  /* BUSCAR CLIENTE */
  onBuscarCliente(){
    this.modalBuscarPersona = true;
  }

  onPintarPersonaSeleccionada(data: any){
    if(data.direccionPrincipal){
      this.existeDireccionCliente = true;
      this.Form.controls['direccioncliente'].setValue(data.direccionPrincipal);
    }

    this.idClienteSeleccionado = data.idCliente;
    this.Form.controls['nrodocumentocliente'].setValue(data.nroDocumento);
    this.Form.controls['nombrecliente'].setValue(data.nombreRazSocial);
    this.existeClienteSeleccionado = true;
    this.modalBuscarPersona = false;
  }

  onBorrarCliente(){
    this.swal.mensajePregunta('¿Seguro de quitar al cliente actual?').then((response) => {
      if (response.isConfirmed) {
      this.Form.controls['nombrecliente'].setValue(null);
      this.Form.controls['nrodocumentocliente'].setValue(null);
      if(this.Form.controls['direccioncliente'].value){
        this.Form.controls['direccioncliente'].setValue(null);
      }  
      this.existeDireccionCliente = false;
      this.existeClienteSeleccionado = false;
      }
    })
  }

  onObtenerPersonaPorNroDocumentoVenta(event : any){
    let numdocumento = event.target.value; 
      this.ventaservice.obtenerPersonaPorNroDocumentoVenta(numdocumento).subscribe((resp) => {
        if(resp.personaData.nombreCompleto != "NO ENCONTRADO"){ 
          this.idClienteSeleccionado = resp.idcliente
          if(resp.personaData.direccionprincipal){
            this.existeDireccionCliente = true;
            this.Form.controls['direccioncliente'].setValue(resp.personaData.direccionprincipal);
          } 
          this.Form.patchValue({
            nrodocumentocliente : resp.personaData.nrodocumentoidentidad,
            nombrecliente : resp.personaData.nombreCompleto ? resp.personaData.nombreCompleto : resp.personaData.razonsocial, 
          })
        }else{
          this.swal.mensajeAdvertencia('NUMERO DE DOCUMENTO NO ENCONTRADO!.');
          return;
        }
    })
  }


   /* AGREGAR DETALLE */
   get fa() { return this.Form.get('arrayDetalle') as FormArray; }
   get detalles() { return this.fa.controls as FormGroup[]; }

   onAgregarDetalle(){ 
    this.detalles.push(this.AddDetalle());
   }

   AddDetalle(){
     return this.fb.group({
      centrocosto: new FormControl(0),
      importesoles: new FormControl(0),
      importedolares: new FormControl(null), 
     })
   }

   onEliminarDetalle(index : any){
    // if(ventadocumentosreferenciaid === 0){
       this.fa.removeAt(index);
       this.cdr.detectChanges();
   //  } else{
    //    this.swal.mensajePregunta("¿Seguro que desea eliminar el detalle.?").then((response) => {
    //      if (response.isConfirmed) {
    //        this.arrayDetallesEliminados.push(ventadocumentosreferenciaid);
    //        this.fadref.removeAt(index);
    //        this.swal.mensajeExito('El detalle ha sido eliminado correctamente!.');
    //      }
    //    })
    //  }
   }

   /* AGREGAR DETALLE DOCUMENTO REFERENCIA */
   get fadref() { return this.Form.get('arrayDetalleDocumentoRef') as FormArray; }
   get detallesDocumentoRef() { return this.fadref.controls as FormGroup[]; }

   onAgregarDetalleDocumentoRef(){ 
    this.detallesDocumentoRef.push(this.AddDetalleDocRef());
   }

   AddDetalleDocRef(){
     return this.fb.group({ 
      tipodocumento: new FormControl(null),
      serie : new  FormControl(null), 
      correlativo: new FormControl(0),
     })
   }

   onEliminarDetalleDocumentoRef(index : any, ventadocumentosreferenciaid : any){
     if(ventadocumentosreferenciaid === 0){
       this.fadref.removeAt(index);
       this.cdr.detectChanges();
     } else{
       this.swal.mensajePregunta("¿Seguro que desea eliminar el detalle.?").then((response) => {
         if (response.isConfirmed) {
           this.arrayDetallesDocRefEliminados.push(ventadocumentosreferenciaid);
           this.fadref.removeAt(index);
           this.swal.mensajeExito('El detalle ha sido eliminado correctamente!.');
         }
       })
     }
   }

  onCalcularImporteDetalle(posicion : number){
    let ImporteSoles = (this.Form.get('arrayDetalle') as FormArray).at(posicion).value.importesoles;
    let TC = this.Form.controls['tipocambio'].value
    let Moneda = this.Form.controls['monedaid'].value
    /* DECLARAMOS VARIABLES */
    let ValorImporteDolares, ValorImporteSoles 

    if(Moneda.id === 1) ValorImporteDolares = (ImporteSoles / TC)
    if(Moneda.id === 2) ValorImporteSoles = (ImporteSoles * TC)
  
    this.detalles[posicion].patchValue({
      importedolares : ValorImporteDolares.toFixed(2)
    });

    this.onCalcularTotales()
  }

  onCalcularTotales(){
    let detallesForm : any[]= []; 
    let Porcent = this.Form.controls['afectorenta4ctg'].value
    let Porcentaje = Porcent ? 8 : 0; 
    let TC = this.Form.controls['tipocambio'].value
    let Moneda = this.Form.controls['monedaid'].value

    this.detalles.forEach(element => {
        detallesForm.push(element.value);
    })

    let ImporteTotal

    if(Moneda.id === 1){
      ImporteTotal = detallesForm.reduce((sum, data)=> (sum + (+data.importesoles) ?? 0 ), 0);
    } 

    if(Moneda.id === 2){
      ImporteTotal = detallesForm.reduce((sum, data)=> (sum + (+data.importedolares) ?? 0 ), 0);
    }

    this.Form.controls['importeTotal'].setValue(ImporteTotal)
    let ImporteTotalAct = this.Form.controls['importeTotal'].value

    let ImporteTotalRenta4Cat = (ImporteTotalAct * Porcentaje / 100)
    this.Form.controls['renta4ctg'].setValue(ImporteTotalRenta4Cat)
    let ImporteTotalRenta4CatAct = this.Form.controls['renta4ctg'].value

    let ImportePorPagar =  ( ImporteTotalAct - ImporteTotalRenta4CatAct)
    this.Form.controls['porpagar'].setValue(ImportePorPagar) 
    let ImportePorPagarAct = this.Form.controls['porpagar'].value


    if(Moneda.id === 1){
      this.Form.controls['totaldebeSoles'].setValue(ImporteTotalAct)
      let TotalHaberAct = (ImporteTotalRenta4Cat + ImportePorPagarAct )
      this.Form.controls['totalhaberSoles'].setValue(TotalHaberAct)

      let TotalDebeAct = this.Form.controls['totaldebeSoles'].value
      let totalHaberAct = this.Form.controls['totalhaberSoles'].value
      let DiferenciaAct = (TotalDebeAct - totalHaberAct )
      this.Form.controls['totalDiferenciaSoles'].setValue(DiferenciaAct)

      let totaldebeDolares, totalhaberDolares, totalDiferenciaDolares
    
      totaldebeDolares = (TC === 0 ? 0 : (TotalDebeAct / TC));
      totalhaberDolares = (TC === 0 ? 0 : (totalHaberAct / TC));
      totalDiferenciaDolares = (totaldebeDolares - totalhaberDolares) 
     
      this.Form.controls['totaldebeDolares'].setValue(totaldebeDolares.toFixed(2))
      this.Form.controls['totalhaberDolares'].setValue(totalhaberDolares.toFixed(2))
      this.Form.controls['totalDiferenciaDolares'].setValue(totalDiferenciaDolares)

    }else{

      this.Form.controls['totaldebeDolares'].setValue(ImporteTotalAct)
      let TotalHaberDolaresAct = (ImporteTotalRenta4Cat + ImportePorPagarAct )
      this.Form.controls['totalhaberDolares'].setValue(TotalHaberDolaresAct)

      let TotalDebeDolarAct = this.Form.controls['totaldebeDolares'].value
      let totalHaberDolarAct = this.Form.controls['totalhaberDolares'].value

      let DiferenciaAct = (TotalDebeDolarAct - totalHaberDolarAct )
      this.Form.controls['totalDiferenciaDolares'].setValue(DiferenciaAct)
 
      let totaldebeSoles, totalhaberSoles, totalDiferenciaSoles
     
      totaldebeSoles = (TC === 0 ? 0 :  (TotalDebeDolarAct * TC));
      totalhaberSoles = (TC === 0 ? 0 :  (totalHaberDolarAct * TC));
      totalDiferenciaSoles =  (totaldebeSoles - totalhaberSoles) 
       
      this.Form.controls['totaldebeSoles'].setValue(totaldebeSoles.toFixed(2))
      this.Form.controls['totalhaberSoles'].setValue(totalhaberSoles.toFixed(2))
      this.Form.controls['totalDiferenciaSoles'].setValue(totalDiferenciaSoles)


    }



 
 
  } 


  onGrabar(){
    const dataform = this.Form.value; 
    let DetallesGrabar :any[] = this.onGrabarDetallesVenta(); 
    let DetallesDocumentoRefGrabar :any[] = this.onGrabarDetalleDocumentoRef();
 

    const newVenta : ICrearRxh = {
      idproveedor: this.RxhEditar ? +this.RxhEditar.ordencompra : 0,
      correlativomensual:this.RxhEditar ? +this.RxhEditar.ordencompra : 0,
      nombreproveedor:this.RxhEditar ? this.RxhEditar.ordencompra : '',
      serierecibohonorario: '',
      documentoid: this.RxhEditar ? +this.RxhEditar.ordencompra : 0,
      correlativorecibohonorario: this.RxhEditar ? +this.RxhEditar.ordencompra : 0,
      fecharegistro:  '',
      fechaemision:  '',
      monedaid: this.RxhEditar ? +this.RxhEditar.ordencompra : 0,
      tipocambio: this.RxhEditar ? +this.RxhEditar.ordencompra : 0,
      estadoid: this.RxhEditar ? +this.RxhEditar.ordencompra : 0,
      glosa:  this.RxhEditar ? this.RxhEditar.ordencompra: '',
      esafectorentacuartacategoria: this.RxhEditar ? this.RxhEditar.ordencompra : 0,
      porcentajerentacuartacategoria: this.RxhEditar ? this.RxhEditar.ordencompra : 0,
      importetotal: this.RxhEditar ? +this.RxhEditar.ordencompra : 0,
      importerentacuartacategoria: this.RxhEditar ? +this.RxhEditar.ordencompra : 0,
      importeporpagar: this.RxhEditar ? +this.RxhEditar.ordencompra : 0,
      totaldebesoles: this.RxhEditar ? +this.RxhEditar.ordencompra : 0,
      totaldebedolares: this.RxhEditar ? +this.RxhEditar.ordencompra : 0,
      totalhabersoles: this.RxhEditar ? +this.RxhEditar.ordencompra : 0,
      totalhaberdolares: this.RxhEditar ? +this.RxhEditar.ordencompra : 0,
      totaldiferenciadolares:this.RxhEditar ? +this.RxhEditar.ordencompra : 0,
      totaldiferenciasoles: this.RxhEditar ? +this.RxhEditar.ordencompra : 0, 
      detalles : DetallesGrabar,
      detallesReferencia: DetallesDocumentoRefGrabar, 
     // idsToDelete: this.arrayDetallesEliminados, 
    
    } 

    if(!this.dataRxH){
      this.rxhService.createRxh(newVenta).subscribe((resp) => {
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito('Se grabaron los datos correctamente!.');
      }, error => {
        this.generalService.onValidarOtraSesion(error);  
      });
    }else{
      this.rxhService.updateRxh(newVenta).subscribe((resp) => {
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
      }, error => {
        this.generalService.onValidarOtraSesion(error);  
      });
    } 
  }
   
  /* LLENADO DE ARRAYS PARA ENVIAR A GRABAR */
  onGrabarDetallesVenta(){
    this.arrayDetalleGrabar = []; 

    this.detalles.forEach(element => {
      if(!element.value){
        this.swal.mensajeInformacion('Aquellos registros vacios no se insertaran en al registro.');
        return;
      }else{ 
        this.arrayDetalleGrabar.push({
          recibohonorariodetalleid: element.value.recibohonorariodetalleid,
          recibohonorarioid: element.value.recibohonorarioid,
          importesoles: element.value.importesoles,
          importedolares: element.value.importedolares,
        });
      }
    })
    return this.arrayDetalleGrabar;
  } 

  onGrabarDetalleDocumentoRef(){
    this.arrayDetalleDocReferenciaGrabar = []; 

    this.detallesDocumentoRef.forEach(element => {  
      if(!element.value){
        this.swal.mensajeInformacion('Aquellos registros vacios no se insertaran en al registro.');
        return;
      }else{ 
        this.arrayDetalleDocReferenciaGrabar.push({   
          recibohonorarioreferenciaid: 0,
          recibohonorarioid: 0,
          documentoid: 0,
          seriereferencia: 0,
          correlativoreferencia: 0, 
        });  
      }
    })
 
    return this.arrayDetalleDocReferenciaGrabar; 
  }

  onVolver(){
    this.cerrar.emit('exito');
  }

  onRegresar(){
    this.cerrar.emit(false);
  }

}
