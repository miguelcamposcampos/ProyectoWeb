import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { forkJoin, Subject } from 'rxjs'; 
import { AuthService } from 'src/app/auth/services/auth.service';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICondicionPagoSunat, ICrearVenta, IDetalleDetraccionTransporte, IDocumentoReferenciaDTO, IVentaDetalle, IVentaPorId } from '../../ventas/interface/venta.interface';
import { VentasService } from '../../ventas/service/venta.service';

@Component({
  selector: 'app-convertir-a-venta',
  templateUrl: './convertir-a-venta.component.html',
  styleUrls: ['./convertir-a-venta.component.scss']
})
export class ConvertirAVentaComponent implements OnInit {

  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  public FlgLlenaronComboParaActualizar: Subject<boolean> = new Subject<boolean>();
  @Input() dataVenta : any;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  valorIGV : number = 0.18;
  fechaActual = new Date();
  tituloNuevaVenta: string ="NUEVA VENTA";
  opcionesNuevaVenta: MenuItem[];
  Form : FormGroup;
  FormImpresion : FormGroup;
  VentaEditar : IVentaPorId; 
  dataReporte : any;
  estadoForm : string ="";
  es = ConstantesGenerales.ES_CALENDARIO;
  arrayDetalleVentaGrabar : IVentaDetalle[] = [];
  arrayDetalleCondicionPagoGrabar : ICondicionPagoSunat[] = [];
  arrayDetalleDocumentoRefGrabar : IDocumentoReferenciaDTO[] = [];
  arrayDetalleGuiaRemisionGrabar : any[]= [];
  arrayDetalleVentaDetraccionTransportista : IDetalleDetraccionTransporte;

  arraySeriePorDocumento : ICombo[];
  arrayTipoDocumento : ICombo[];
  arrayCondicionPago : ICombo[];
  arrayMonedas : ICombo[];
  arrayEstado : any[];
  arrayTipoOperacion : ICombo[];
  arrayEstablecimiento : ICombo[];
  arrayUnidadMedida : ICombo[];
  arrayAlmacen : ICombo[];
  arrayTipoAfectacion : ICombo[];
  arrayMotivoNota : ICombo[];
  arrayCodigoDetraccion: ICombo[];
  arrayImpresoras: any[] = [];
  arrayByte: any;

  idClienteSeleccionado : number = 0;
  idEstablecimientoSeleccionado : number = 0;
  existenroRegsitro : boolean = false;
  existeDireccionCliente : boolean = false;
  existeClienteSeleccionado : boolean = false;
  existeEstablecimientoSeleccionado : boolean = false;
  existeCondicionPagoCredito : boolean = false;

  mostrarTabsDocumentReferencia : boolean = true;
  mostrarbotoneliminarDetalle : boolean = false;
  mostrarbotoneliminarDetalleFormPago : boolean = false;
  arrayDetallesEliminados: any[] =[];
  arrayDetallesCondicionPagoEliminados: any[] =[];
  arrayDetallesGuiaRemisionEliminados: any[] =[];
  arrayDetallesDocumentoRefEliminados: any[] =[];

  VistaReporte : boolean = false;
  VistaCobrar : boolean = false;
  modalImprimirTicket : boolean = false;
  mostrarOpcionesEditar: boolean = false;
  modalBuscarPersona: boolean = false;
  modalBuscarProducto: boolean = false;
  modalDetallesCondicionPago : boolean = false;

  isAfectoicbper : boolean;
  /* MOSTRAR TOTALES */ 
  TabTotalesActivo : boolean = true;

  items: MenuItem[];
  activeItem: MenuItem;
  /* TABS */

  DetalleForm : boolean = false;
  GuiaRemisionForm : boolean = false;
  DocReferenciaForm : boolean = false;
  OtrosForm : boolean = false;
  FacturaguiaForm : boolean = false;
  TotalesForm: boolean = false;
  nroCuotaPintar: string = "";
  dataCobrar : any;
  dataProductos :any;
  bloquearBotonInvluyeIgvDetalle: boolean = false;
  totalaPagar : number = 0;
  impresoraPordefecto : string = "";
  hostPordefecto : string = "";
  bloquearComboImpresoras : boolean = true;
  dataDesencryptada :any;
  dataPredeterminadosDesencryptada:any;

  constructor(
    private ventaservice : VentasService,
    private generalService : GeneralService,
    private swal : MensajesSwalService,
    private readonly formatoFecha : DatePipe,
    private config : PrimeNGConfig,
    private fb : FormBuilder,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) { 
    this.builform();
    this.arrayEstado = [
      { id: true,  nombre: 'ACTIVA'},
      { id: false, nombre: 'ANULADA'},
    ]

    this.dataDesencryptada = JSON.parse(sessionStorage.getItem('DatosImpresion')) 
    if(this.dataDesencryptada){
        this.impresoraPordefecto = this.authService.desCifrarData(this.dataDesencryptada.impresoraDefault);  
        this.hostPordefecto = this.authService.desCifrarData(this.dataDesencryptada.hostDefault); 
    }
 
   }

  public builform(){
    this.Form = new FormGroup({
      documentoid : new FormControl(null, Validators.required),
      serieventa: new FormControl(null, Validators.required),
      secuencialventa: new FormControl(0),
      establecimientoid : new FormControl(null ,Validators.required),
      nrodocumentocliente: new FormControl(null ,Validators.required),
      nombrecliente: new FormControl(null ,Validators.required),
      direccioncliente:  new FormControl(null),
      fechaemision : new FormControl(this.fechaActual ,Validators.required),
      fechavencimiento : new FormControl(this.fechaActual ,Validators.required),
      monedaid : new FormControl(null ,Validators.required),
      tipocambio : new FormControl(null ,Validators.required),
      condicionpagoid : new FormControl(null ,Validators.required),
      estadoid : new FormControl({ id: true, nombre: 'ACTIVA'}, Validators.required),
      glosa : new FormControl(null ,Validators.required),
      codtipooperacion : new FormControl(null ,Validators.required),
      motivonotaid: new FormControl(null),
      dsctoglobalrporcentaje: new FormControl(0),
      esafectodetraccion: new FormControl(false),
      codigodetraccion: new FormControl(null),
      porcentajedetraccion: new FormControl(null),
      arrayDetallesCondicionPago:  new FormArray([]),
      arrayDetalleVenta: new FormArray([], Validators.required),
      arrayDetalleGuiaRemision:  new FormArray([]),
      arrayDetalleDocumentoRef:  new FormArray([]),
      
      dsctoglobalimporte : new FormControl(0),
      importeanticipo : new FormControl(0),
      importeexonerado : new FormControl(0),
      importeinafecto : new FormControl(0),
      importedescuento : new FormControl(0),
      importeicbper : new FormControl(0),
      importeigv : new FormControl(0),
      importeotrostributos : new FormControl(0),
      importetotalventa : new FormControl(0),
      importevalorventa : new FormControl(0),
      importegratuita : new FormControl(0),
      importegravada : new FormControl(0),
      descuentoporitem: new FormControl(0),
    })

    this.FormImpresion = new FormGroup({
      hostImpresion : new FormControl('https://localhost:44363', Validators.required),
      nombreImpresora: new FormControl( this.impresoraPordefecto ?? null, Validators.required),
      anchoPapel: new FormControl(26)
    })

  }

  ngOnInit(): void {
    this.config.setTranslation(this.es)
    this.onCargarDropdown();
   
    if(this.dataVenta){
      this.tituloNuevaVenta = "EDITAR VENTA"
      this.mostrarOpcionesEditar = true; 
      this.Avisar();
    } 
    this.onOpcionesNuevaVenta(); 
  }



  onCargarTipoCambio(){
    let fecha = this.formatoFecha.transform(this.fechaActual, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA)
    this.ventaservice.obtenertipodeCambioCobrar(fecha).subscribe((resp) => {
      if(resp){
        this.Form.controls['tipocambio'].setValue(resp.valorventa)
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
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }
  
  onCargarConfiguraciones(){
    this.ventaservice.obtenerPublicoGeneral().subscribe((resp) => { 
      if(resp){ 
        this.idClienteSeleccionado = resp.idcliente
          this.Form.patchValue({
            nrodocumentocliente :  resp.personaData.nrodocumentoidentidad,
            nombrecliente :  resp.personaData.nombreCompleto,
          })
      }   
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
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
        label: 'GUIA REMISION',
        icon: 'pi pi-fw pi-file',
        command: event => {
          this.activateMenu(event.item.id);
        }
      },
      {
        id: '3',
        label: 'DOCUMENTOS REFRENCIA',
        visible : this.mostrarTabsDocumentReferencia,
        icon: 'pi pi-fw pi-file',
        command: event => {
          this.activateMenu(event.item.id);
        }
      },
      {
        id: '4',
        label: 'OTROS',
        icon: 'fas fa-square-plus',
        command: event => {
          this.activateMenu(event.item.id);
        }
      }, 
      {
        id: '5',
        label: 'FACTURA GUIA',
        icon: 'pi pi-fw pi-file',
        command: event => {
          this.activateMenu(event.item.id);
        }
      },
      {
        id: '6',
        label: 'TOTALES',
        icon: 'fas fa-list-ol',
        command: event => {
          this.activateMenu(event.item.id);
        }
      },
    ];
    this.activeItem = this.items[0];
    this.activateMenu('0');
  }

  activateMenu(event) {

    this.GuiaRemisionForm = false;
    this.DocReferenciaForm = false;
    this.OtrosForm = false;
    this.FacturaguiaForm = false;
    this.DetalleForm = false;
    this.TotalesForm = false;
    this.TabTotalesActivo = true;

    if(event ===  "2" ){
      this.GuiaRemisionForm = true;
      this.activeItem = this.items[1];
    }else if(event ===  "3" ){
      this.DocReferenciaForm = true
      this.activeItem = this.items[2];
    }else if(event ===  "4" ){
      this.OtrosForm = true;
      this.activeItem = this.items[3];
    }else if(event ===  "5" ){
      this.FacturaguiaForm = true;
      this.activeItem = this.items[4];
    }else if(event ===  "6" ){
      this.TotalesForm = true;
      this.activeItem = this.items[5];
      this.TabTotalesActivo = false;
    }else{
      this.DetalleForm = true;
      this.activeItem = this.items[0];
    }

  }
 
  onOpcionesNuevaVenta(){
    this.opcionesNuevaVenta = [
      {
        //SI ES NOTA DE CREDITO NO SE COBRA
        label:'Cobrar',
        icon:'fas fa-coins',
        command:()=>{
          this.onCobrar();
        }
      },
      {
        label:'Impr. Ticket',
        icon:'fas fa-print',
        command:()=>{
          this.onImprimirTicket();
        }
      },
      {
        label:'Reporte',
        icon:'fas fa-file', 
        command:()=>{
          this.onReporteVenta();
        }
      },
    ]
  }

  onCargarDropdown(){
    const data={
      esUsadoVentas : true
     }

    const obsDatos = forkJoin(
      this.generalService.listadoDocumentoPortipoParacombo(data),
      this.generalService.listadoCondicionPagoParaCombo(),
      this.generalService.listadoPorGrupo('Monedas'),
      this.generalService.listadoPorGrupo('TipoOperacionVenta'),
      this.generalService.listadoComboEstablecimientos(),
      this.generalService.listadoUnidadMedida(),
      this.generalService.listadoPorGrupo('AfectacionesIGV'),
      this.generalService.listadoPorGrupo('CodigoDetracciones'),
    );
    obsDatos.subscribe((response) => {
      this.arrayTipoDocumento = response[0];
      this.arrayCondicionPago = response[1];
      this.arrayMonedas = response[2];
      this.arrayTipoOperacion = response[3];
      this.arrayEstablecimiento = response[4];
      this.arrayUnidadMedida = response[5];
      this.arrayTipoAfectacion = response[6];
      this.arrayCodigoDetraccion = response[7]; 
      this.FlgLlenaronCombo.next(true); 
      if(!this.dataVenta){
        this.existeEstablecimientoSeleccionado = true; 
        this.onCargarTipoCambio();
        this.onCargarConfiguraciones();
        this.dataPredeterminadosDesencryptada = JSON.parse(localStorage.getItem('Predeterminados')); 
       
        if(this.dataPredeterminadosDesencryptada){
          this.Form.patchValue({
            establecimientoid: this.arrayEstablecimiento.find(
              (x) => x.id === +this.dataPredeterminadosDesencryptada.idEstablecimiento ?? 0
            ), 
          }) 
          this.idEstablecimientoSeleccionado = +this.dataPredeterminadosDesencryptada.idEstablecimiento 
          this.onCargarAlmacenes(+this.dataPredeterminadosDesencryptada.idEstablecimiento ?? 0)
        }
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  onObtenerEstablecimiento(event : any){ 
    if(event.value){
        this.idEstablecimientoSeleccionado = event.value.id;
        this.existeEstablecimientoSeleccionado = true;
        this.onCargarAlmacenes(this.idEstablecimientoSeleccionado) 
    }else{
      this.existeEstablecimientoSeleccionado = false;
      this.idEstablecimientoSeleccionado = null; 
      this.arraySeriePorDocumento = [];
      this.Form.controls['documentoid'].setValue(null); 
      this.Form.controls['serieventa'].setValue(null); 
    }
  }

  onCargarAlmacenes(event: number){
    this.generalService.listadoAlmacenesParams(event).subscribe((resp) =>{
      if(resp){
        this.arrayAlmacen = resp;
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }


  onObtenerTipoDocumento(event : any){ 
    if(event){
      this.onValidacionRequired(event.valor1);

      if(event.valor1 === "FAC" || event.valor1 === "BOL" ){
        this.mostrarTabsDocumentReferencia = false
        this.onTabsForm();
      }else{
        this.mostrarTabsDocumentReferencia = true
        this.onTabsForm();
      }

      this.onCargarMotivosNotas(event.valor1)
      this.onCargarDocumentoPorSerie(event.id)

    }else{ 
      this.arraySeriePorDocumento = [];
      this.Form.controls['serieventa'].setValue(null);
    }
  }

  onCargarDocumentoPorSerie(event : any){
    const data = {
      idestablecimiento : this.idEstablecimientoSeleccionado,
      tipodocumentoid : event
    }

    this.generalService.listadoSeriePorDocumentocombo(data).subscribe((resp) => {
      if(resp){
        this.arraySeriePorDocumento = resp;
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  onCargarMotivosNotas(tipoMotivo : string){
    let MotivoParams
    if(tipoMotivo === "NDR"){
      MotivoParams = 'TiposNDB'
    }else if (tipoMotivo === "NCR"){
      MotivoParams = 'TiposNCR'
    }
    if(MotivoParams){
      this.generalService.listadoPorGrupo(MotivoParams).subscribe((resp) => {
        if(resp){
          this.arrayMotivoNota = resp;
        }
      })
    }

  }

  /* CONDICIONES DE PAGO */
  onObtenerCondicionPago(event :any){ 
    if(event){
      if(event === "CRÉDITO" ){
        this.existeCondicionPagoCredito = true;
      }else{
        if(this.VentaEditar){
          this.detallesCondicionPago.forEach(x => { 
            this.arrayDetallesCondicionPagoEliminados.push(x.value.ventacuotascreditoid);
          })  
        }
        this.detallesCondicionPago.length = 0;
        this.arrayDetalleCondicionPagoGrabar.length = 0;
        this.existeCondicionPagoCredito = false;
      }
    }else{
      this.detallesCondicionPago.length = 0;
      this.arrayDetalleCondicionPagoGrabar.length = 0;
      this.existeCondicionPagoCredito = false;
    }
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

    /* AGREGAR DETALLE CONDICION DE PAGO */
    onModalDetalleCondicionPago(){
      this.modalDetallesCondicionPago = true;
    }

    get fa() { return this.Form.get('arrayDetallesCondicionPago') as FormArray; }
    get detallesCondicionPago() { return this.fa.controls as FormGroup[]; }

    onAgregarDetalleCondicionPago(){
      this.detallesCondicionPago.push(this.AddDetalleCondicionPago());
    }

    AddDetalleCondicionPago(){
      return this.fb.group({
        descripcion : new FormControl(''),
        fechapagocuota : new  FormControl(null),
        importepagocuota: new FormControl(null),
        nroCuota   : new  FormControl(null),
        ventacuotascreditoid: new FormControl(0),
        ventaid: new FormControl(0),
        escredito : new FormControl(null),
        escuota : new FormControl(null),
      })
    }

    onEliminarDetalleCondicionPago(index : any, ventacuotascreditoid : any){
      if(ventacuotascreditoid === 0){
        this.fa.removeAt(index);
        this.cdr.detectChanges();
      } else{
        this.swal.mensajePregunta("¿Seguro que desea eliminar el detalle.?").then((response) => {
          if (response.isConfirmed) {
            this.arrayDetallesCondicionPagoEliminados.push(ventacuotascreditoid);
            this.fa.removeAt(index);
            this.swal.mensajeExito('El detalle ha sido eliminado correctamente!.');
          }
        })
      }
    }



  /* AGREGAR DETALLE DE LA VENTA */
  get fadv() { return this.Form.get('arrayDetalleVenta') as FormArray; }
  get detallesVentaForm() { return this.fadv.controls as FormGroup[]; }

  onAgregarDetalleVenta(){
    //if(!this.Form.controls['establecimientoid'].value){
    //   this.swal.mensajeAdvertencia('Debes Seleccionar un Establecimiento para agregar detalles.');
    //   return;
    // }
    this.detallesVentaForm.push(this.AddDetalleVenta());
  }

  AddDetalleVenta(){
    return this.fb.group({
      ventadetalleid: new FormControl(0),
      ventadetallemigradaid: new FormControl(null),
      ventaid : new FormControl(0),
      codproductofinal : new  FormControl(null),
      productoid : new FormControl(null),
      descripcionproducto : new FormControl(''),
      unidadmedida : new  FormControl(null), // combo
      unidadmedidaid : new  FormControl(null), // combo
     // almacenid : new FormControl(null),   //combo
      almacen: this.arrayAlmacen.find(
        (x) => x.id === (this.dataPredeterminadosDesencryptada ? this.dataPredeterminadosDesencryptada.idalmacen : null)
      ),
      cantidad : new  FormControl(0),
      preciounitario : new  FormControl(0),
      precioincluyeigv : new  FormControl(false),
      baseimponible : new  FormControl(0),
      tipoafectacionid : new  FormControl(null), //combo
      porcentajedescuento : new  FormControl(0),
      importedescuento: new  FormControl(0),
      observaciones: new  FormControl(null),  //stext
      valorVenta: new  FormControl(0),
      igv : new  FormControl(0),
      importesotroscargos : new  FormControl(0),
      importeicbper : new  FormControl(0),
      precioventa : new  FormControl(0),
      nroLote : new  FormControl(null),  //stext
      nroSerie: new  FormControl(null), //stext
      fechavencimiento: new  FormControl(null), //celndar
      esanticipo: new  FormControl(false),
      esafectoicbper: new  FormControl(null),
      esGratuito: new  FormControl(null),
      esGravada: new  FormControl(null),
      ventaanticiporeferenciaid: new  FormControl(null),
      esInafecto : new  FormControl(null),
      esExonerado : new  FormControl(null),
    })
  }

  onEliminarDetalleVenta(index : any, ventadetalleid : any){
    if(ventadetalleid === 0){
      this.fadv.removeAt(index);
      this.onCalcularTotalVenta(); 
      if(this.detallesVentaForm.length === 0){
        this.totalaPagar = 0
      }
    } else{
      this.swal.mensajePregunta("¿Seguro que desea eliminar el detalle.?").then((response) => {
        if (response.isConfirmed) {
          this.arrayDetallesEliminados.push(ventadetalleid);
          this.fadv.removeAt(index);
          this.onCalcularTotalVenta();
          if(this.detallesVentaForm.length === 0){
            this.totalaPagar = 0
          }
          this.swal.mensajeExito('El detalle ha sido eliminado correctamente!.');
        }
      })
    }
  }


   /* AGREGAR DETALLE GUIA REMISION */
   get fadgr() { return this.Form.get('arrayDetalleGuiaRemision') as FormArray; }
   get detallesGuiaRemision() { return this.fadgr.controls as FormGroup[]; }

   onAgregarDetalleGuiaRemision(){
     this.detallesGuiaRemision.push(this.AddDetalleGR());
   }

   AddDetalleGR(){
     return this.fb.group({
      ventadocumentosreferenciaid: new FormControl(0),
      ventaid : new FormControl(0),
      serieguia: new FormControl(null),
      nroguia : new  FormControl(null),
      esgrm : new  FormControl(true),
     })
   }

   onEliminarDetalleGuiaRemision(index : any, ventadocumentosreferenciaid : any){  
     if(ventadocumentosreferenciaid === 0){
       this.fadgr.removeAt(index);
       this.cdr.detectChanges();
     } else{
       this.swal.mensajePregunta("¿Seguro que desea eliminar el detalle.?").then((response) => {
         if (response.isConfirmed) {
           this.arrayDetallesGuiaRemisionEliminados.push(ventadocumentosreferenciaid);
           this.fadgr.removeAt(index);
           this.swal.mensajeExito('El detalle ha sido eliminado correctamente!.');
         }
       })
     }
   }


   /* AGREGAR DETALLE DOCUMENTO REFERENCIA */
   get fadref() { return this.Form.get('arrayDetalleDocumentoRef') as FormArray; }
   get detallesDocumentoRef() { return this.fadref.controls as FormGroup[]; }

   onAgregarDetalleDocumentoRef(){
    if(!this.Form.controls['motivonotaid'].value){
      this.swal.mensajeAdvertencia('Debes Seleccionar un MotivoNota para continuar');
      return;
    }
    this.detallesDocumentoRef.push(this.AddDetalleDocRef());
   }

   AddDetalleDocRef(){
     return this.fb.group({
      ventadocumentosreferenciaid: new FormControl(0),
      ventaid: new FormControl(0),
      tipodocumento: new FormControl(null),
      serie : new  FormControl(null),
      correlativo : new  FormControl(null),
      fecReferencia : new  FormControl(null),
      esgrm : new  FormControl(false),
     })
   }

   onEliminarDetalleDocumentoRef(index : any, ventadocumentosreferenciaid : any){
     if(ventadocumentosreferenciaid === 0){
       this.fadref.removeAt(index); 
     } else{
       this.swal.mensajePregunta("¿Seguro que desea eliminar el detalle.?").then((response) => {
         if (response.isConfirmed) {
           this.arrayDetallesDocumentoRefEliminados.push(ventadocumentosreferenciaid);
           this.fadref.removeAt(index); 
           this.swal.mensajeExito('El detalle ha sido eliminado correctamente!.');
         }
       })
     }
   }

   onReferenciarDetalleDocumentoRef(index : number){
    this.swal.mensajePregunta("¿Seguro que desea referenciar el documento?.").then((response) => {
      if (response.isConfirmed) { 
        this.onPintarDetallesdelaReferencia(index);
      }
    })
   }

  onPintarDetallesdelaReferencia(index : number ){  
    const dataform  = this.detallesDocumentoRef[index].value;
    const dataParams = {
      tipodocumento : dataform.tipodocumento.id,
      serie: dataform.serie,
      correlativo:  dataform.correlativo
    } 
    this.ventaservice.referenciardocumentoRef(dataParams).subscribe((resp) => {
      if(resp){   
        this.detallesVentaForm.length = 0; 
        this.VentaEditar = resp
        for( let  i = 0; i < this.VentaEditar.detalles.length; i++){ 
          this.onAgregarDetalleVenta(); 
          this.detallesVentaForm[i].patchValue({
            almacenid: this.arrayAlmacen.find(
              (x) => x.id ===  this.VentaEditar.detalles[i].almacenid
            ),
            ventadetalleid : this.VentaEditar.detalles[i].ventadetalleid,
            ventadetallemigradaid: this.VentaEditar.detalles[i].ventadetallemigradaid,
            ventaid :this.VentaEditar.detalles[i].ventaid,
            codproductofinal : this.VentaEditar.detalles[i].codproductofinal ,
            productoid :this.VentaEditar.detalles[i].productoid,
            descripcionproducto : this.VentaEditar.detalles[i].descripcionproducto,
            unidadmedida : this.VentaEditar.detalles[i].unidadMedida,
            unidadmedidaid: this.arrayUnidadMedida.find(
              (x) => x.id ===  this.VentaEditar.detalles[i].unidadmedidaid
            ),
            cantidad : this.VentaEditar.detalles[i].cantidad,
            preciounitario : this.VentaEditar.detalles[i].preciounitario,
            precioincluyeigv :  this.VentaEditar.detalles[i].precioincluyeigv,
            baseimponible : this.VentaEditar.detalles[i].baseimponible,
            tipoafectacionid: this.arrayTipoAfectacion.find(
              (x) => x.id ===  this.VentaEditar.detalles[i].tipoafectacionid
            ),
            porcentajedescuento : this.VentaEditar.detalles[i].porcentajedescuento,
            importedescuento: this.VentaEditar.detalles[i].importedescuento,
            observaciones:  this.VentaEditar.detalles[i].observaciones,
            valorVenta: this.VentaEditar.detalles[i].valorventa,
            igv : this.VentaEditar.detalles[i].igv,
            importesotroscargos : this.VentaEditar.detalles[i].importeotroscargos,
            importeicbper : this.VentaEditar.detalles[i].importeicbper,
            precioventa : this.VentaEditar.detalles[i].precioventa,
            nroLote :  this.VentaEditar.detalles[i].nrolote,
            nroSerie:  this.VentaEditar.detalles[i].nroserie,
            fechavencimiento:  new Date(this.VentaEditar.detalles[i].fechavencimiento),
            esanticipo:  this.VentaEditar.detalles[i].esanticipo,
            esafectoicbper:  this.VentaEditar.detalles[i].esafectoicbper,
            esGratuito:  this.VentaEditar.detalles[i].esGratuito,
            esGravada:  this.VentaEditar.detalles[i].esGravada,
            ventaanticiporeferenciaid:  this.VentaEditar.detalles[i].ventaanticiporeferenciaid,
          });
        }
        this.swal.mensajeExito('El documento ha sido referenciado correctamente!.');
        this.onCalcularTotalVenta();
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  onBuscarProductoPorCodigo(posicion: any){
    let codProductoaBuscar = (this.Form.get('arrayDetalleVenta') as FormArray).at(posicion).value.codproductofinal;
    const data = {
      periodo : this.fechaActual.getFullYear(),
      criteriodescripcion : codProductoaBuscar
    }
    this.generalService.BuscarProductoPorCodigo(data).subscribe((resp) => {
      this.detallesVentaForm[posicion].patchValue({
        codproductofinal:  resp[0].codProducto,
        descripcionproducto: resp[0].nombreProducto,
        unidadmedidaid: this.arrayUnidadMedida.find(
          (x) => x.id ===   resp[0].unidadMedidaId
        ),
        tipoafectacionid: this.arrayTipoAfectacion.find(
          (x) => x.id ===   resp[0].unidadMedidaId
        ),
        precioincluyeigv :  resp[0].precioIncluyeIgv,
        productoid : resp[0].productoId,
        esafectoicbper :resp[0].esAfectoICBPER,
        nroSerie: resp[0].serie === "0" ? null : resp[0].serie, 
        nroLote: resp[0].lote === "0" ? null : resp[0].lote, 
        esGravada : resp[0].precioIncluyeIgv
      });
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }


  /* BUSCAR PRODUCTO */
  onModalBuscarProducto(posicion : number){
    let ValorAlmacen = (this.Form.get('arrayDetalleVenta') as FormArray).at(posicion).value.almacenid;
    if(!ValorAlmacen){
      this.swal.mensajeAdvertencia('Debes Seleccionar un almacen para continuar');
      return;
    }
    const data = {
      idAlmacenSelect : ValorAlmacen.id,
      idPosicionProducto : posicion
    }
    this.dataProductos = data;
    this.modalBuscarProducto = true;
  }

  onPintarProductoSeleccionado(event: any){
    this.detallesVentaForm[event.posicion].patchValue({
      codproductofinal:  event.data.codProducto,
      descripcionproducto: event.data.nombreProducto,
      unidadmedidaid: this.arrayUnidadMedida.find(
        (x) => x.id ===   event.data.unidadMedidaId
      ),
      productoid : event.data.productoId,
      esafectoicbper :event.data.esAfectoICBPER,
      nroSerie: event.data.serie === "0" ? null : event.data.serie, 
      nroLote: event.data.lote === "0" ? null : event.data.lote, 
      precioincluyeigv : event.data.precioIncluyeIgv, 
      esGravada : event.data.precioIncluyeIgv
    });


    this.modalBuscarProducto = false;
  }


  /* IMPRIMIR TICKET */
  onImprimirTicket(){ 
    this.modalImprimirTicket = true;
    this.onLoadImpresoras();
  }
 
  onLoadImpresoras(){
    let host = this.FormImpresion.controls['hostImpresion'].value ?? this.hostPordefecto;
    if(!host){ 
      this.swal.mensajeAdvertencia('Debes ingresar un HOST valido');
      return;
    }
    this.ventaservice.obtenerImpresorasLista(host).subscribe((resp) => {
      if(resp){
        resp.forEach(element => {
          this.arrayImpresoras.push({nombre : element})
        });  
        this.bloquearComboImpresoras = false;

        if(this.impresoraPordefecto){
          this.FormImpresion.patchValue({
            nombreImpresora : this.arrayImpresoras.find(x => x.nombre === this.impresoraPordefecto)
          })
        }
      }else{
        this.bloquearComboImpresoras = true;
      } 
    })
  }


  onObtenerBytes(data : any){
    const dataSearch = {
      ventaid: this.VentaEditar.ventaid,
      anchopapel : data
    }
    this.ventaservice.obtenerByteParaImprimir(dataSearch).subscribe((resp) => {
      if(resp){
        this.arrayByte = resp.fileContent;
      }
    })

    return this.arrayByte;
  }

  onSendImpresion(){ 
    const dataform = this.FormImpresion.value  
    let Bytes : any = this.onObtenerBytes(dataform.anchoPapel);

    let host = dataform.hostImpresion ?? this.hostPordefecto;
    const data = { 
      printerName:  dataform.nombreImpresora.nombre ?? this.impresoraPordefecto,
      document : Bytes
    }  

    const DatosImpresoraEncryptado : any = {
      impresoraDefault: this.authService.cifrarData(data.printerName),
      hostDefault :this.authService.cifrarData(host), 
    }
    localStorage.setItem('DatosImpresion', JSON.stringify(DatosImpresoraEncryptado));  


    this.ventaservice.imprimir(data, host).subscribe((resp) => {
      this.swal.mensajeExito('Se envió a imprimir correctamente!.')
      this.modalImprimirTicket = false;
    }, error => {
      this.swal.mensajeError(error.error)
    })
  }

  /* REPORTE */
  onReporteVenta(){
    this.dataReporte = this.VentaEditar;
    this.VistaReporte = true;
  }

  /* COBRAR */
  onCobrar(){
    this.dataCobrar = this.VentaEditar;
    this.VistaCobrar = true;
  }

  onGrabar(){
    const dataform = this.Form.value; 
    let DetallesVentaGrabar :any[] = this.onGrabarDetallesVenta();
    let DetallesCondicionPagoGrabar :any[] = this.onGrabarCondicionPago();
    let DetallesDocumentoRefGrabar :any[] = this.onGrabarDetalleDocumentoRef();
 
    const newVenta : ICrearVenta = {
      establecimientoid: dataform.establecimientoid.id,
      vendedorid : this.VentaEditar ? this.VentaEditar.vendedorid : 0,
      documentoid : dataform.documentoid.id,
      correlativomensual: this.VentaEditar ? this.VentaEditar.correlativomensual :  0,
      serieventa : dataform.serieventa.valor1,
      secuencialventa : dataform.secuencialventa,
      fechaemision: this.formatoFecha.transform( dataform.fechaemision, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),    
      condicionpagoid: dataform.condicionpagoid.id,
      idcliente : this.idClienteSeleccionado,
      nombrecliente :  dataform.nombrecliente,
      direccioncliente :  dataform.direccioncliente,
      monedaid: dataform.monedaid.id,
      tipocambio : dataform.tipocambio,
      diasvencimiento : this.VentaEditar ? this.VentaEditar.diasvencimiento : 0,
      fechavencimiento : this.formatoFecha.transform( dataform.fechavencimiento, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),      
      glosa :  dataform.glosa,
      estado :  dataform.estadoid.nombre,
      estadoid : dataform.estadoid.id,
      dsctoglobalrporcentaje: dataform.dsctoglobalrporcentaje,
      dsctoglobalimporte: -dataform.dsctoglobalimporte.toFixed(3),
      codtipooperacion: dataform.codtipooperacion.valor2,
      esdeduccionanticipo: false,
      esafectodetraccion: dataform.esafectodetraccion,
      codigodetraccion :  dataform.codigodetraccion.id,
      porcentajedetraccion : dataform.porcentajedetraccion,
      esafectoretencion : false,
      motivonotaid: dataform.motivonotaid ? dataform.motivonotaid.id : 0,
      ordenservicio : this.VentaEditar ? +this.VentaEditar.ordenservicio : 0,
      ordencompra: this.VentaEditar ? +this.VentaEditar.ordencompra : 0,
      fechaordencompra: this.formatoFecha.transform( dataform.fechaordencompra, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),  
      esrecargoconsumo :this.VentaEditar ? this.VentaEditar.esrecargoconsumo :  false,
      cantidadtotal : this.VentaEditar ? this.VentaEditar.cantidadtotal : 0,
      importeanticipo : +dataform.importeanticipo.toFixed(2),
      importedescuento : -dataform.importedescuento.toFixed(2), 
      importevalorventa : +dataform.importevalorventa.toFixed(2), 
      importeigv :  +dataform.importeigv.toFixed(2), 
      importeicbper : +dataform.importeicbper.toFixed(2), 
      importeotrostributos: +dataform.importeotrostributos.toFixed(2),  
      importetotalventa : +dataform.importetotalventa.toFixed(2),   
      condicionesPagoSunat : DetallesCondicionPagoGrabar,
      detalles : DetallesVentaGrabar,
      documentoReferenciaDtos: DetallesDocumentoRefGrabar,
      idsCondicionPagoToDelet: this.arrayDetallesCondicionPagoEliminados,
      idsToDelete: this.arrayDetallesEliminados,
      ventaid : this.VentaEditar ? this.VentaEditar.ventaid : 0, 
    } 
    if(!this.dataVenta){
      this.ventaservice.createVenta(newVenta).subscribe((resp) => {
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito('Se grabaron los datos correctamente!.');
      }, error => {
          this.swal.mensajeError(error.error.detail);
      });
    }else{
      this.ventaservice.updateVenta(newVenta).subscribe((resp) => {
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
      }, error => {
          this.swal.mensajeError(error.error.detail);
      });
    }


  }

  onVolver(){
    this.cerrar.emit('exito');
  }

  onRegresar(){
    this.cerrar.emit(false);
  }

  onRetornar(){
    this.VistaCobrar = false;
    this.VistaReporte = false;
  }

  Avisar() {
    this.FlgLlenaronCombo.subscribe((x) => {
      this.onObtenerVentaPorId(this.dataVenta.idVenta,'editar');
    });
  }

  /* EDITAR LA VENTA */
  onObtenerVentaPorId(idVentaPorid : number, estado: string){
    this.swal.mensajePreloader(true);
    this.ventaservice.ventasPorId(idVentaPorid).subscribe((resp)=>{ 
      if(resp){ 
        this.VentaEditar = resp;
        this.estadoForm = estado;
        this.idClienteSeleccionado = resp.idcliente;
        this.idEstablecimientoSeleccionado = resp.establecimientoid; 
        this.onCargarDropdownParaEditar(resp);
        this.onObtenerCondicionPago(resp.nombreCondicionPago)
        this.AvisarParaActualizar();
        
        this.totalaPagar = resp.importetotalventa
        this.existenroRegsitro = true;  
      }
      this.swal.mensajePreloader(false);
    })
  }

  onCargarDropdownParaEditar(data:any){ 
    const dataParams = {
      idestablecimiento : this.idEstablecimientoSeleccionado,
      tipodocumentoid : data.documentoid
    }

    const obsDatos = forkJoin(
      this.generalService.listadoAlmacenesParams(data.establecimientoid), 
      this.generalService.listadoSeriePorDocumentocombo(dataParams),
    );
    obsDatos.subscribe((response) => {
      this.arrayAlmacen = response[0]; 
      this.arraySeriePorDocumento = response[1]; 
      this.FlgLlenaronComboParaActualizar.next(true);
    });
  }

  AvisarParaActualizar(){
    this.FlgLlenaronComboParaActualizar.subscribe((x) => {
      this.onPintarDataFormulario();
    });
  }


  onPintarDataFormulario(){ 
   let tipoOperacionPintar = this.arrayTipoOperacion.find((x) => x.valor2 === this.VentaEditar.codtipooperacion.toString())
 
    this.Form.patchValue({
      secuencialventa :  this.VentaEditar.secuencialventa,
      establecimientoid: this.arrayEstablecimiento.find(
        (x) => x.id === this.VentaEditar.establecimientoid
      ),
      documentoid: this.arrayTipoDocumento.find(
        (x) => x.id === this.VentaEditar.documentoid
      ),
      monedaid: this.arrayMonedas.find(
        (x) => x.id === this.VentaEditar.monedaid
      ),
      nrodocumentocliente: this.VentaEditar.nroDocumentoCliente,
      nombrecliente: this.VentaEditar.nombrecliente,
      direccioncliente: this.VentaEditar.direccioncliente,
      fechaemision:  new Date(this.VentaEditar.fechaemision),
      fechavencimiento:  new Date(this.VentaEditar.fechavencimiento),
      tipocambio: this.VentaEditar.tipocambio,
      condicionpagoid: this.arrayCondicionPago.find(
        (x) => x.id === this.VentaEditar.condicionpagoid
      ),
      estadoid: this.arrayEstado.find(
        (x) => x.id === this.VentaEditar.estadoid
      ),
      glosa: this.VentaEditar.glosa,
      codtipooperacion : this.arrayTipoOperacion.find(
        (x) => x.id === tipoOperacionPintar.id
      ),
      // motivonotaid: this.arrayMotivoNota.find(
      //   (x) => x.id === this.VentaEditar.motivonotaid
      // ),
      dsctoglobalrporcentaje: this.VentaEditar.dsctoglobalrporcentaje ?? 0,
      esafectodetraccion: this.VentaEditar.esafectodetraccion,
      codigodetraccion: this.arrayCodigoDetraccion.find(
        (x) => x.id === +this.VentaEditar.codigodetraccion
      ),
      porcentajedetraccion: this.VentaEditar.porcentajedetraccion ?? 0,

      // serieventa :  this.arraySeriePorDocumento.find(
      //   (x) => x.id === serieVentaPintar.id
      // ),

      dsctoglobalimporte : this.VentaEditar.dsctoglobalimporte ?? 0,
      importeanticipo : this.VentaEditar.importeanticipo ?? 0,
      importedescuento : this.VentaEditar.importedescuento ?? 0,
      importeicbper : this.VentaEditar.importeicbper ?? 0,
      importeigv : this.VentaEditar.importeigv ?? 0,
      importeotrostributos  : this.VentaEditar.importeotrostributos ?? 0,
      importetotalventa : this.VentaEditar.importetotalventa ?? 0,
      importevalorventa : this.VentaEditar.importevalorventa ?? 0

    })

    for( let  i = 0; i < this.VentaEditar.detalles.length; i++){
      if(this.estadoForm === 'editar'){
        this.onAgregarDetalleVenta();
      }
       
      this.detallesVentaForm[i].patchValue({
        almacenid: this.arrayAlmacen.find(
          (x) => x.id ===  this.VentaEditar.detalles[i].almacenid
        ),
        ventadetalleid : this.VentaEditar.detalles[i].ventadetalleid,
        ventadetallemigradaid: this.VentaEditar.detalles[i].ventadetallemigradaid,
        ventaid :this.VentaEditar.detalles[i].ventaid,
        codproductofinal : this.VentaEditar.detalles[i].codproductofinal ,
        productoid :this.VentaEditar.detalles[i].productoid,
        descripcionproducto : this.VentaEditar.detalles[i].descripcionproducto,
        unidadmedida : this.VentaEditar.detalles[i].unidadMedida,
        unidadmedidaid: this.arrayUnidadMedida.find(
          (x) => x.id ===  this.VentaEditar.detalles[i].unidadmedidaid
        ),
        cantidad : this.VentaEditar.detalles[i].cantidad,
        preciounitario : this.VentaEditar.detalles[i].preciounitario,
        precioincluyeigv :  this.VentaEditar.detalles[i].precioincluyeigv,
        baseimponible : this.VentaEditar.detalles[i].baseimponible,
        tipoafectacionid: this.arrayTipoAfectacion.find(
          (x) => x.id ===  this.VentaEditar.detalles[i].tipoafectacionid
        ),
        porcentajedescuento : this.VentaEditar.detalles[i].porcentajedescuento,
        importedescuento: this.VentaEditar.detalles[i].importedescuento,
        observaciones:  this.VentaEditar.detalles[i].observaciones,
        valorVenta: this.VentaEditar.detalles[i].valorventa,
        igv : this.VentaEditar.detalles[i].igv,
        importesotroscargos : this.VentaEditar.detalles[i].importeotroscargos,
        importeicbper : this.VentaEditar.detalles[i].importeicbper,
        precioventa : this.VentaEditar.detalles[i].precioventa,
        nroLote :  this.VentaEditar.detalles[i].nrolote,
        nroSerie:  this.VentaEditar.detalles[i].nroserie,
        fechavencimiento:  new Date( this.VentaEditar.detalles[i].fechavencimiento),
        esanticipo:  this.VentaEditar.detalles[i].esanticipo,
        esafectoicbper:  this.VentaEditar.detalles[i].esafectoicbper,
        esGratuito:  this.VentaEditar.detalles[i].esGratuito,
        esGravada:  this.VentaEditar.detalles[i].esGravada,
        ventaanticiporeferenciaid:  this.VentaEditar.detalles[i].ventaanticiporeferenciaid,
      });
    }

     

    this.detallesCondicionPago.shift();


    let SonGuiasRemision : any [] = [];
    let SonDocumentoRef : any [] = [];
     
    if(this.VentaEditar.documentoReferenciaDtos){
      this.VentaEditar.documentoReferenciaDtos.forEach(x => {
        if(x.esgrm){
          SonGuiasRemision.push(x);
        }else{
          SonDocumentoRef.push(x);
        }
    })

    
    if(SonGuiasRemision){
      for( let  i = 0; i < SonGuiasRemision.length; i++){
        if(this.estadoForm === 'editar'){
          this.onAgregarDetalleGuiaRemision();
        }
        this.detallesGuiaRemision[i].patchValue({
          ventadocumentosreferenciaid: this.VentaEditar.documentoReferenciaDtos[i].ventadocumentosreferenciaid,
          ventaid : this.VentaEditar.documentoReferenciaDtos[i].ventaid,
          serieguia : this.VentaEditar.documentoReferenciaDtos[i].seriereferencia,
          nroguia : this.VentaEditar.documentoReferenciaDtos[i].secuencialreferencia,
        });
      }
    }

    if(SonDocumentoRef){
      for( let  i = 0; i < SonDocumentoRef.length; i++){
        if(this.estadoForm === 'editar'){
          this.onAgregarDetalleDocumentoRef();
        } 
        this.detallesDocumentoRef[i].patchValue({
          tipodocumento: this.arrayTipoDocumento.find(
            (x) => x.id ===  this.VentaEditar.documentoReferenciaDtos[i].tipodocumentoid
          ),
          serie : this.VentaEditar.documentoReferenciaDtos[i].seriereferencia,
          correlativo : this.VentaEditar.documentoReferenciaDtos[i].secuencialreferencia,
          fecReferencia : new Date(this.VentaEditar.documentoReferenciaDtos[i].fechadocref),
          ventadocumentosreferenciaid: this.VentaEditar.documentoReferenciaDtos[i].ventadocumentosreferenciaid,
          ventaid : this.VentaEditar.documentoReferenciaDtos[i].ventaid,
        });
      }
    }
    } 
    this.swal.mensajePreloader(false); 
    this.onCalcularTotalVenta();
  }

  /* LLENADO DE ARRAYS PARA ENVIAR A GRABAR */
  onGrabarDetallesVenta(){
    this.arrayDetalleVentaGrabar = [];

    let arrayVentaDetalleDetraccionTransporte :any = this.onGrabarDetalleVentaDetraccionTransporte();

    this.detallesVentaForm.forEach(element => {
      if(!element.value){
        this.swal.mensajeInformacion('Aquellos registros vacios no se insertaran en al registro.');
        return;
      }else{
  
        this.arrayDetalleVentaGrabar.push({
          ventadetalleid:  element.value.ventadetalleid,
          ventaid :  element.value.ventaid,
          productoid:  element.value.productoid,
          codproductofinal :  element.value.codproductofinal,
          descripcionproducto :  element.value.descripcionproducto,
          unidadmedidaid:  element.value.unidadmedidaid.id,
          almacenid :  element.value.almacenid.id,
          cantidad :  element.value.cantidad,
          preciounitario :  element.value.preciounitario,
          precioincluyeigv :  element.value.precioincluyeigv,
          baseimponible:  element.value.baseimponible,
          tipoafectacionid :  element.value.tipoafectacionid.id,
          porcentajedescuento:  element.value.porcentajedescuento,
          observaciones:  element.value.observaciones,
          importedescuento :  element.value.importedescuento,
          esanticipo : false,
          valorventa : element.value.valorVenta,
          igv :  element.value.igv,
          importeotroscargos:  element.value.importesotroscargos,
          importeicbper :  element.value.importeicbper,
          precioventa :  element.value.precioventa,
          nrolote :  element.value.nroLote,
          fechavencimiento : this.formatoFecha.transform( element.value.fechavencimiento, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA), 
          nroserie:  element.value.nroSerie,
          ventaanticiporeferenciaid : null, 
          esafectoicbper : this.isAfectoicbper,
          esGratuito :     element.value.esGratuito,
          esGravada :    element.value.esGravada,
          unidadMedida : element.value.unidadmedidaid.valor1,
          ventaAnticipoReferencia :  '',
          ventadetallemigradaid:  null,
          ventaDetalleDetraccionTransporteInfoDTO : arrayVentaDetalleDetraccionTransporte,
        });
      }
    })
    return this.arrayDetalleVentaGrabar;
  }

  onGrabarCondicionPago(){
    this.arrayDetalleCondicionPagoGrabar = [];

    if(this.detallesCondicionPago.length > 0){
      this.arrayDetalleCondicionPagoGrabar.push({
        descripcion : 'Credito',
        escredito:  true,
        escuota :   false,
        fechapagocuota: null,
        importe :  null,
        nrocuota:  null,
        ventacuotascreditoid:  this.VentaEditar ? this.VentaEditar.condicionesPagoSunat[0].ventacuotascreditoid :  0,
        ventaid: this.VentaEditar ? this.VentaEditar.condicionesPagoSunat[0].ventaid :  0,
      })

      this.detallesCondicionPago.forEach((element, i) => {
        if(!element.value){
          this.swal.mensajeInformacion('Aquellos registros vacios no se insertaran en al registro.');
          return;
        }else{
          
          this.arrayDetalleCondicionPagoGrabar.push({
           descripcion : 'Credito'+ponerceros(i+1, 3),
           escredito: true,
           escuota : true,
           fechapagocuota:  this.formatoFecha.transform( element.value.fecReferencia, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),  
           importe :  element.value.importepagocuota,
           nrocuota:   i+1,
           ventacuotascreditoid:  element.value.ventacuotascreditoid,
           ventaid:  element.value.ventaid
          });
        }
      })
    }else{
      this.arrayDetalleCondicionPagoGrabar.push({
        descripcion : 'Contado',
        escredito:  false,
        escuota :   false,
        fechapagocuota: null,
        importe :  null,
        nrocuota:  null,
        ventacuotascreditoid:  this.VentaEditar ? this.VentaEditar.condicionesPagoSunat[0].ventacuotascreditoid :  0,
        ventaid: this.VentaEditar ? this.VentaEditar.condicionesPagoSunat[0].ventaid :  0,
      })
    }

    return this.arrayDetalleCondicionPagoGrabar;
  }

  onGrabarDetalleDocumentoRef(){
    this.arrayDetalleDocumentoRefGrabar = [];
    this.arrayDetalleGuiaRemisionGrabar = [];

    this.detallesDocumentoRef.forEach(element => {  
      if(!element.value){
        this.swal.mensajeInformacion('Aquellos registros vacios no se insertaran en al registro.');
        return;
      }else{
        if(this.arrayDetalleDocumentoRefGrabar.length > 0){ 
          
          this.arrayDetalleDocumentoRefGrabar.push({ 
            ventadocumentosreferenciaid:  this.VentaEditar ? this.VentaEditar.documentoReferenciaDtos[0].ventadocumentosreferenciaid :  0,
            ventaid: this.VentaEditar ? this.VentaEditar.documentoReferenciaDtos[0].ventaid :  0,
            tipodocumentoid : element.value.tipodocumento.id,
            seriereferencia : element.value.serie,
            secuencialreferencia:  element.value.correlativo,
            esgrm : false,
            fechadocref : this.formatoFecha.transform( element.value.fecReferencia, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),   
          }); 
        }
      }
    })
 
    this.detallesGuiaRemision.forEach(element => {  
      if(!element.value){
        this.swal.mensajeInformacion('Aquellos registros vacios no se insertaran en al registro.');
        return;
      }else{
        if(this.arrayDetalleGuiaRemisionGrabar.length > 0){
          this.arrayDetalleGuiaRemisionGrabar.push({
            ventadocumentosreferenciaid:  this.VentaEditar ? this.VentaEditar.documentoReferenciaDtos[0].ventadocumentosreferenciaid :  0,
            ventaid: this.VentaEditar ? this.VentaEditar.documentoReferenciaDtos[0].ventaid :  0,
            serieguia: element.value.serieguia,
            nroguia : element.value.nroguia ,
            esgrm : element.value.esgrm
          }); 
        }
      }
    })

    let grabarDetalles :any = this.arrayDetalleDocumentoRefGrabar.concat(this.arrayDetalleGuiaRemisionGrabar); 
    return grabarDetalles;

 
  }
 
  onGrabarDetalleVentaDetraccionTransporte(){
    this.arrayDetalleVentaDetraccionTransportista;
    this.arrayDetalleVentaDetraccionTransportista = {
      valcargaefectiva: 0,
      valcargautil : 0,
      valreferencial : 0,
      ventadetalledetracciontransporteinfoid : 0,
      ventadetalleid: 0,
    }
    return this.arrayDetalleVentaDetraccionTransportista;

  }


  /*CALCULOS*/
  onObtenertipoAfectacionDetalle(posicion : number, event:any){
    this.onSetearFalse(posicion);
    let idAfectacion = event.id.toString().slice(0,-1)

    if(idAfectacion === '1'){
      this.bloquearBotonInvluyeIgvDetalle = true;
      this.detallesVentaForm[posicion].patchValue({
        esGravada : true
      });
    }else if(idAfectacion === '2'){
      this.bloquearBotonInvluyeIgvDetalle = false;
      this.detallesVentaForm[posicion].patchValue({
        esExonerado : true,
      });
    }else if(idAfectacion === '3' || idAfectacion === '4'){
      this.bloquearBotonInvluyeIgvDetalle = false;
      this.detallesVentaForm[posicion].patchValue({
        esInafecto : true,
      });
    }else{
      this.bloquearBotonInvluyeIgvDetalle = false;
      this.detallesVentaForm[posicion].patchValue({
        esGratuito : true,
        precioincluyeigv : false
      });
    }

  }

  onCalcularPrecioVenta(posicion : number){
    this.valorIGV = 0.18
    let Porcentajebolsaplastica = 0.3;
    let isOperacionGravada = (this.Form.get('arrayDetalleVenta') as FormArray).at(posicion).value.esGravada;
    let Preciounitario = (this.Form.get('arrayDetalleVenta') as FormArray).at(posicion).value.preciounitario;
    let Porcentajedescuento = (this.Form.get('arrayDetalleVenta') as FormArray).at(posicion).value.porcentajedescuento;
    let Cantidad : number = (this.Form.get('arrayDetalleVenta') as FormArray).at(posicion).value.cantidad;
    let isAfectoICBPER = (this.Form.get('arrayDetalleVenta') as FormArray).at(posicion).value.esafectoicbper;

    if (!isOperacionGravada){
      this.detallesVentaForm[posicion].patchValue({
        precioincluyeigv : false
      });
    }

    let Precioincluyeigv = (this.Form.get('arrayDetalleVenta') as FormArray).at(posicion).value.precioincluyeigv;

    let preciosinigv
    if(Precioincluyeigv){
      preciosinigv = +(Preciounitario / (1 +this.valorIGV))
    }else{
      preciosinigv = +Preciounitario
    }


    let biActualizar  = Cantidad * preciosinigv;
    this.detallesVentaForm[posicion].patchValue({
      baseimponible :  +parseFloat(biActualizar.toFixed(2))
    });

    let Baseimponible : number  = (this.Form.get('arrayDetalleVenta') as FormArray).at(posicion).value.baseimponible;

    if( Porcentajedescuento > 0){
      let dsctoFactor =  ( Porcentajedescuento / 100);
      let impd : number = (Baseimponible * dsctoFactor);

      this.detallesVentaForm[posicion].patchValue({
        importedescuento : +parseFloat(impd.toFixed(2))
      });
    }else{
      this.detallesVentaForm[posicion].patchValue({
        importedescuento : 0
      });
    }

    let Importedescuento : number = (this.Form.get('arrayDetalleVenta') as FormArray).at(posicion).value.importedescuento;

    let vVenta = (Baseimponible - Importedescuento);
    this.detallesVentaForm[posicion].patchValue({
      valorVenta :  +parseFloat(vVenta.toFixed(2))
    });


    let Valorventa : number  = (this.Form.get('arrayDetalleVenta') as FormArray).at(posicion).value.valorVenta;

    if(isOperacionGravada){
      let igvAct = (Valorventa * this.valorIGV);
      this.detallesVentaForm[posicion].patchValue({
        igv : +parseFloat(igvAct.toFixed(2))
      });
    }else{
      this.detallesVentaForm[posicion].patchValue({
        igv : 0
      });
    }

    let Importeotroscargos : number = (this.Form.get('arrayDetalleVenta') as FormArray).at(posicion).value.importesotroscargos;
    let Igv : number = (this.Form.get('arrayDetalleVenta') as FormArray).at(posicion).value.igv;

    let precioventaAct : number =  (Valorventa +  Igv + Importeotroscargos);
    let importeicbperAct : number = (Cantidad * (Porcentajebolsaplastica ?? 0 ));

    if(isAfectoICBPER){
      this.detallesVentaForm[posicion].patchValue({
        importeicbper : importeicbperAct,
        precioventa : +parseFloat(precioventaAct.toFixed(2))
      });
    }else{

      this.detallesVentaForm[posicion].patchValue({
        importeicbper : 0,
        precioventa :  +parseFloat(precioventaAct.toFixed(2))
      });
    }
  
    this.onCalcularTotalVenta();

  }

  onCalcularTotalVenta(){

    let Dsctoglobalporcentaje : number  = this.Form.controls['dsctoglobalrporcentaje'].value;
    //* validamos el total de porcentaje descuento
  
    let Importeicbper : number  =   this.Form.controls['importeicbper'].value;  
    let detallesNoGratuitos : any[]=[];
    let NoAnticipos : any[]=[];
    let Anticipos : any[]=[];

 
    //* RECORREMOS LOS NO GRATUITOS
    this.detallesVentaForm.forEach(det => {
      if(!det.value.esGratuito){
        detallesNoGratuitos.push(det.value);
      }
    })

    //* DE LOS NO GRATUITOS SEPARAMOS LOS ANTICIPOS Y NOANTICIPOS
    detallesNoGratuitos.forEach(nogratuitos => {
      if(!nogratuitos.esanticipo){
        NoAnticipos.push(nogratuitos);
      }else{
        Anticipos.push(nogratuitos);
      }
    });
    //* SUMAMOS LOS IMPORTES ICBPER
    let icbper = detallesNoGratuitos.reduce((sum, value)=> (sum + value.importeicbper ?? 0 ), 0);

    let importeanticipoAct = Anticipos.reduce((sum, value)=> (sum + value.precioventa), 0)
    this.Form.controls['importeanticipo'].setValue(importeanticipoAct)

    let dsctosunitarios = NoAnticipos.reduce((sum, value)=> (sum + value.importedescuento ?? 0), 0);

    let importeigvAct = NoAnticipos.reduce((sum, value)=> (sum + value.igv ?? 0), 0) -  Anticipos.reduce((sum, value)=> (sum + value.igv ?? 0 ), 0)
    this.Form.controls['importeigv'].setValue(importeigvAct)

    let ImpIGV =  this.Form.controls['importeigv'].value;
    if (Dsctoglobalporcentaje > 0){
      
        let valdetalles = this.detallesVentaForm.reduce((sum, data)=> (sum + data.value.valorVenta), 0);
        let dsctoglobalimporteActualizar = valdetalles * (Dsctoglobalporcentaje / 100);
        ImpIGV -= (ImpIGV) * ((Dsctoglobalporcentaje ?? 1) / 100);
        this.Form.controls['dsctoglobalimporte'].setValue(dsctoglobalimporteActualizar)
        this.Form.controls['importeigv'].setValue(ImpIGV)
    }else{
      this.Form.controls['dsctoglobalimporte'].setValue(0);
    }

    let Importeigvv =  this.Form.controls['importeigv'].value;
    let Dsctoglobalimporte = this.Form.controls['dsctoglobalimporte'].value;

    let importedescuentoActualizar = (Dsctoglobalimporte ?? 0 ) + dsctosunitarios;
    this.Form.controls['importedescuento'].setValue(importedescuentoActualizar);

    let Importedescuento = this.Form.controls['importedescuento'].value;

    let importevalorventaActualizar = NoAnticipos.reduce((sum, value)=> (sum + value.baseimponible), 0) - Anticipos.reduce((sum, value) => (sum + value.baseimponible), 0) - Importedescuento
    this.Form.controls['importevalorventa'].setValue(importevalorventaActualizar)
    this.Form.controls['importeicbper'].setValue(icbper);

    let importeotrostributosActualizar = (NoAnticipos.reduce((sum, value)=> (sum + value.importesotroscargos), 0) -  Anticipos.reduce((sum, value)=> (sum + value.importesotroscargos), 0))
    let importetotalventaActualizar  = importevalorventaActualizar + Importeigvv + (importeotrostributosActualizar ?? 0) + Importeicbper

    this.Form.controls['importeotrostributos'].setValue(importeotrostributosActualizar);
    this.Form.controls['importetotalventa'].setValue(importetotalventaActualizar);

    //MOSTRAR TOTAL
    this.totalaPagar = this.Form.controls['importetotalventa'].value;

    this.onSumarioDetallado();
  }

  onSumarioDetallado(){
    //* RECORREMOS LOS NO GRATUITOS
    let Gratutitos : any[]= [];
    let Gravadas : any[]= [];
    let Inafectas : any[]= [];
    let Exoneradas : any[]= [];

    this.detallesVentaForm.forEach(det => {
      if(det.value.esGratuito){
        Gratutitos.push(det.value);
      }
      if(det.value.esGravada){
        Gravadas.push(det.value);
      }
      if(det.value.esInafecto){
        Inafectas.push(det.value);
      }
      if(det.value.esExonerado){
        Exoneradas.push(det.value);
      }
    })

    let SumImporteDescuento : number = this.detallesVentaForm.reduce((sum, data)=> (sum + data.value.importedescuento ?? 0 ), 0);
    let SumarioGratuitos : number  = Gratutitos.reduce((sum, data)=> (sum + data.precioventa ?? 0 ), 0);
    let SumarioGrvados  : number = Gravadas.reduce((sum, data)=> (sum + data.precioventa ?? 0 ), 0);
    let SumarioInafectas  : number = Inafectas.reduce((sum, data)=> (sum + data.precioventa ?? 0 ), 0);
    let SumatoriaExoneradas : number  = Exoneradas.reduce((sum, data)=> (sum + data.precioventa ?? 0 ), 0);

    const dataform = this.Form.value;

    this.Form.patchValue({
      importeigv : dataform.importeigv  ?? 0,
      importeicbper : dataform.importeicbper  ?? 0,
      importeanticipo : dataform.importeanticipo  ?? 0,
      dsctoglobalimporte : (dataform.dsctoglobalimporte ?? 0) * -1  ?? 0,
      descuentoporitem : (SumImporteDescuento * -1)  ?? 0,
      importedescuento : (dataform.importedescuento * -1)  ?? 0,
      importeexonerado : SumatoriaExoneradas,
      importegratuita : SumarioGratuitos,
      importegravada : SumarioGrvados,
      importeinafecto : SumarioInafectas,
      importeotrostributos : dataform.importeotrostributos ?? 0,
      importetotalventa : dataform.importetotalventa  ?? 0
    }) 


  }



  onConvertiraPorcentaje(){
    let dsctoglobalporcentaje = this.Form.controls['dsctoglobalrporcentaje'].value;
 
    //* validamos el total de porcentaje descuento
    if(dsctoglobalporcentaje > 99){
      this.Form.controls['dsctoglobalrporcentaje'].setValue(99);
    }else if(dsctoglobalporcentaje === 0){
      this.Form.controls['dsctoglobalrporcentaje'].setValue(0.00);
    }
    let convertirNumero =  Number.parseFloat(dsctoglobalporcentaje).toFixed(2);
    this.Form.controls['dsctoglobalrporcentaje'].setValue(+convertirNumero);
    
    this.onCalcularTotalVenta();
  }

  onSetearFalse(posicion){
    this.bloquearBotonInvluyeIgvDetalle = false;
    this.detallesVentaForm[posicion].patchValue({
      esGratuito : false,
      esGravada : false,
      esExonerado : false,
      esInafecto : false
    });
  }


  /*VALODACION DE CAMPO REQUERIDO */

  onValidacionRequired(event : any){ 
    const motivonotaid = this.Form.get("motivonotaid");

    if (event === 'FAC' || event === 'BOL') {
      motivonotaid.setValidators(null);
    } else{
      motivonotaid.setValidators([Validators.required]);
    } 
    motivonotaid.updateValueAndValidity(); 
  }

}

 
 
function ponerceros(number, width) {
  var numberOutput = Math.abs(number); /* Valor absoluto del número */
  var length = number.toString().length; /* Largo del número */ 
  var zero = "0"; /* String de cero */  
  
  if (width <= length) {
      if (number < 0) {
           return ("-" + numberOutput.toString()); 
      } else {
           return numberOutput.toString(); 
      }
  } else {
      if (number < 0) {
          return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
      } else {
          return ((zero.repeat(width - length)) + numberOutput.toString()); 
      }
  }
}