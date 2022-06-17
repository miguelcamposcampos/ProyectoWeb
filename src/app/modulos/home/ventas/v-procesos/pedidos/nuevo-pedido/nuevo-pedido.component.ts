import { DatePipe } from '@angular/common';
import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { forkJoin, Subject } from 'rxjs';
import { IConfiguracionEmpresa } from 'src/app/modulos/home/configuracion/configuraciones/interface/configuracion.interface';
import { ConfiguracionService } from 'src/app/modulos/home/configuracion/configuraciones/service/configuracion.service';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICondicionPagoSunat, ICrearVenta, IDetalleDetraccionTransporte, IPedidoData, IVentaDetalle, IVentaPorId } from '../../ventas/interface/venta.interface';
import { VentasService } from '../../ventas/service/venta.service'; 

@Component({
  selector: 'app-nuevo-pedido',
  templateUrl: './nuevo-pedido.component.html',
  styleUrls: ['./nuevo-pedido.component.scss']
})
export class NuevoPedidoComponent implements OnInit {

  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  public FlgLlenaronComboParaActualizar: Subject<boolean> = new Subject<boolean>();
  @Input() dataPedido : any;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  valorIGV : number = 0.18;
  fechaActual = new Date();
  tituloNuevoPedido: string ="NUEVA PEDIDO";
  opcionesNuevoPedido: MenuItem[];
  Form : FormGroup;
  PedidoEditar : IVentaPorId; 
  dataReporte : any;
  es = ConstantesGenerales.ES_CALENDARIO;
  estadoForm : string ="";
  arrayDetalleVentaGrabar : IVentaDetalle[] = [];
  arrayPedidoDataGrabar : IPedidoData;
  arrayDetalleCondicionPagoGrabar : ICondicionPagoSunat[] = []; 
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
  arrayCodigoDetraccion: ICombo[];

  idClienteSeleccionado : number = 0;
  idEstablecimientoSeleccionado : number = 0;
  existenroRegsitro : boolean = false;
  existeDireccionCliente : boolean = false;
  existeClienteSeleccionado : boolean = false;
  existeEstablecimientoSeleccionado : boolean = false;
  existeCondicionPagoCredito : boolean = false;
 
  mostrarbotoneliminarDetalle : boolean = false;
  mostrarbotoneliminarDetalleFormPago : boolean = false;
  arrayDetallesEliminados: any[] =[];
  arrayDetallesCondicionPagoEliminados: any[] =[];
  arrayDetallesGuiaRemisionEliminados: any[] =[];
  arrayDetallesDocumentoRefEliminados: any[] =[];

  VistaReporte : boolean = false; 
  mostrarOpcionesEditar: boolean = false;
  modalBuscarPersona: boolean = false;
  modalBuscarProducto: boolean = false;
  modalDetallesCondicionPago : boolean = false;

  isAfectoicbper : boolean;
  /* MOSTRAR TOTALES */ 
  TabTotalesActivo : boolean = true;
  items: MenuItem[];
  activeItem: MenuItem;

  DetalleForm : boolean = false;
  GuiaRemisionForm : boolean = false; 
  OtrosForm : boolean = false;
  FacturaguiaForm : boolean = false;
  TotalesForm: boolean = false;
  nroCuotaPintar: string = ""; 
  dataProductos :any;
  bloquearBotonInvluyeIgvDetalle: boolean = false;
  totalaPagar : number = 0; 

  dataPredeterminadosDesencryptada : any;
  dataConfiguracion : IConfiguracionEmpresa;

  constructor(
    private ventaservice : VentasService,
    private generalService : GeneralService,
    private swal : MensajesSwalService,
    private readonly formatoFecha : DatePipe,
    private config : PrimeNGConfig,
    private fb : FormBuilder,
    private cdr: ChangeDetectorRef,
    private configService: ConfiguracionService,
    private spinner : NgxSpinnerService
  ) { 
    this.builform(); 
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
      fechadespacho : new FormControl(this.fechaActual ,Validators.required),
      diasvencimiento : new FormControl(null ,Validators.required),
      monedaid : new FormControl(null ,Validators.required),
      tipocambio : new FormControl(null ,Validators.required),
      condicionpagoid : new FormControl(null ,Validators.required),
      estadoid : new FormControl(null, Validators.required),
      glosa : new FormControl(null ,Validators.required),
      codtipooperacion : new FormControl(null ,Validators.required), 
      motivonotaid: new FormControl(null),
      dsctoglobalrporcentaje: new FormControl(0),
      esafectodetraccion: new FormControl(false),
      codigodetraccion: new FormControl(null),
      porcentajedetraccion: new FormControl(null),
      arrayDetallesCondicionPago:  new FormArray([]),
      arrayDetalleVenta: new FormArray([]),
      arrayDetalleGuiaRemision:  new FormArray([]), 
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
  }


  ngOnInit(): void { 
    this.onCargarDropdown();  
    this.config.setTranslation(this.es) 
    if(this.dataPedido){
      this.spinner.show();
      this.tituloNuevoPedido = "EDITAR PEDIDO"
      this.mostrarOpcionesEditar = true; 
      this.Avisar();
    } 
    this.onTabsForm();
  }

  onCargarTipoCambio(){
    let fecha = this.formatoFecha.transform(this.fechaActual, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA)
    this.ventaservice.obtenertipodeCambioCobrar(fecha).subscribe((resp) => {
      if(resp){
        this.Form.controls['tipocambio'].setValue(resp.valorventa)
      }
    })
  }

  onReporte(){
    this.dataReporte = this.PedidoEditar;
    this.VistaReporte = true;
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
        label: 'OTROS',
        icon: 'fas fa-square-plus',
        command: event => {
          this.activateMenu(event.item.id);
        }
      },
      {
        id: '4',
        label: 'FACTURA GUIA',
        icon: 'pi pi-fw pi-file',
        command: event => {
          this.activateMenu(event.item.id);
        }
      },
      {
        id: '5',
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
    this.OtrosForm = false;
    this.FacturaguiaForm = false;
    this.DetalleForm = false;
    this.TotalesForm = false;
    this.TabTotalesActivo = true;

    if(event ===  "2" ){
      this.GuiaRemisionForm = true;
      this.activeItem = this.items[1];
    }else if(event ===  "3" ){
      this.OtrosForm = true;
      this.activeItem = this.items[2];
    }else if(event ===  "4" ){
      this.FacturaguiaForm = true;
      this.activeItem = this.items[3];
    }else if(event ===  "5" ){
      this.TotalesForm = true;
      this.activeItem = this.items[4];
      this.TabTotalesActivo = false;
    }else{
      this.DetalleForm = true;
      this.activeItem = this.items[0];
    }

  }
   
  onCargarDropdown(){ 
    const data={
      esPedido : true
     }

    const obsDatos = forkJoin<any>(
      this.generalService.listadoDocumentoPortipoParacombo(data),
      this.generalService.listadoCondicionPagoParaCombo(),
      this.generalService.listadoPorGrupo('Monedas'),
      this.generalService.listadoPorGrupo('TipoOperacionVenta'),
      this.generalService.listadoComboEstablecimientos(),
      this.generalService.listadoUnidadMedida(),
      this.generalService.listadoPorGrupo('AfectacionesIGV'),
      this.generalService.listadoPorGrupo('CodigoDetracciones'),
      this.generalService.listadoPorGrupo('EstadoPedido'),
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
      this.arrayEstado = response[8]; 
      this.FlgLlenaronCombo.next(true);  
      if(!this.dataPedido){
        this.existeEstablecimientoSeleccionado = true; 
        this.onCargarDatosdeConfiguracion();
        this.onCargarPublicoGeneral();
        this.onCargarTipoCambio();
        this.dataPredeterminadosDesencryptada = JSON.parse(localStorage.getItem('Predeterminados')); 
    
        if(this.dataPredeterminadosDesencryptada){
          this.Form.patchValue({
            establecimientoid: this.arrayEstablecimiento.find(
              (x) => x.id === +this.dataPredeterminadosDesencryptada.idEstablecimiento
            ), 
          }) 
          this.idEstablecimientoSeleccionado = +this.dataPredeterminadosDesencryptada.idEstablecimiento
          this.onCargarAlmacenes(+this.dataPredeterminadosDesencryptada.idEstablecimiento) 
        }
      }
    });
  }

  onCargarPublicoGeneral(){
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


  onCargarDatosdeConfiguracion(){
    this.configService.listadoConfiguraciones().subscribe((resp) => {
      if(resp){
        this.dataConfiguracion = resp  
        let TipoOperacionEditar  = this.arrayTipoOperacion.filter((x) => x.valor2 === this.dataConfiguracion.ventatipooperaciondefault)
         
        this.Form.patchValue({  
          monedaid: this.arrayMonedas.find(
            (x) => x.id === this.dataConfiguracion.ventamonedadefaultid
          ),   
          condicionpagoid: this.arrayCondicionPago.find(
            (x) => x.id === this.dataConfiguracion.ventacondicionpagodefaultid
          ), 
          codtipooperacion: this.arrayTipoOperacion.find(
            (x) => x.id === TipoOperacionEditar[0].id
          ), 
          glosa :this.dataConfiguracion.ventaglosadefault,
          importeicbper :this.dataConfiguracion.porcentajebolsaplastica, 
        })
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
        if(this.dataPredeterminadosDesencryptada){
          this.Form.patchValue({ 
            almacenid: this.arrayAlmacen.find(
              (x) => x.id === +this.dataPredeterminadosDesencryptada.idalmacen,
            )
          })
        }
  
      }
    })
  }


  onObtenerTipoDocumento(event : any){ 
    if(event){  
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


  /* AGREGAR DETALLE DE LA VENTA */
  get fadv() { return this.Form.get('arrayDetalleVenta') as FormArray; }
  get detallesVentaForm() { return this.fadv.controls as FormGroup[]; }

  onAgregarDetalleVenta(){
    // if(!this.Form.controls['establecimientoid'].value){
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
  //   almacenid : new FormControl(null),   //combo 
      almacenid: this.arrayAlmacen.find(
        (x) => x.id === (this.dataPredeterminadosDesencryptada ? this.dataPredeterminadosDesencryptada.idalmacen : null)
      ),
      cantidad : new  FormControl(0),
      preciounitario : new  FormControl(0),
      precioincluyeigv : new  FormControl(false),
      baseimponible : new  FormControl(0),
      tipoafectacionid : new  FormControl(null), //combo
      porcentajedescuento : new  FormControl(0),
      importedescuento: new  FormControl(0),
      observaciones: new  FormControl(""),  //stext
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
      this.onCalcularTotalVenta();
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

   onBuscarProductoPorCodigo(posicion: any){
    let codProductoaBuscar = (this.Form.get('arrayDetalleVenta') as FormArray).at(posicion).value.codproductofinal;
    const data = {
      periodo : this.fechaActual.getFullYear(),
      criteriodescripcion : codProductoaBuscar
    }
    this.generalService.BuscarProductoPorCodigo(data).subscribe((resp) => {
      if(resp){
        this.detallesVentaForm[posicion].patchValue({
          codproductofinal:  resp[0].codProducto,
          descripcionproducto: resp[0].nombreProducto,
          unidadmedidaid: this.arrayUnidadMedida.find(
            (x) => x.id ===   resp[0].unidadMedidaId
          ),
          tipoafectacionid : this.arrayTipoAfectacion.find(
            (x) => x.id ===   resp[0].tipoAfectacionId
          ),
          preciounitario : resp[0].precioDefault,
          precioincluyeigv : resp[0].precioIncluyeIgv,
          productoid : resp[0].productoId,
          esafectoicbper :resp[0].esAfectoICBPER,
          nroSerie: resp[0].serie === "0" ? null : resp[0].serie, 
          nroLote: resp[0].lote === "0" ? null : resp[0].lote, 
          esGravada : resp[0].precioIncluyeIgv
        });
        this.onCalcularPrecioVenta(posicion);
      }else{
        this.swal.mensajeAdvertencia('no se encontraron datos');
      }
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
      tipoafectacionid: this.arrayTipoAfectacion.find(
        (x) => x.id ===   event.data.tipoAfectacionId
      ),
      preciounitario : event.data.precioDefault,
      productoid : event.data.productoId,
      esafectoicbper :event.data.esAfectoICBPER,
      nroSerie: event.data.serie === "0" ? null : event.data.serie, 
      nroLote: event.data.lote === "0" ? null : event.data.lote, 
      precioincluyeigv : event.data.precioIncluyeIgv, 
      esGravada : event.data.precioIncluyeIgv
    }); 
    this.onCalcularPrecioVenta(event.posicion);
    this.modalBuscarProducto = false;
  }


  onGrabar(){
    const dataform = this.Form.value; 
    let DetallesVentaGrabar :any[] = this.onGrabarDetallesVenta(); 
    let DetallesDocumentoRefGrabar :any[] = this.onGrabarDetalleDocumentoRef();
    let DetallePedidoGrabar : any = this.onPedidoData(); 
     
    
    const newVenta : ICrearVenta = {
      establecimientoid: dataform.establecimientoid.id,
      vendedorid : this.PedidoEditar ? this.PedidoEditar.vendedorid : 0,
      documentoid : dataform.documentoid.id,
      correlativomensual: this.PedidoEditar ? this.PedidoEditar.correlativomensual :  0,
      serieventa : dataform.serieventa.valor1,
      secuencialventa : dataform.secuencialventa,
      fechaemision: this.formatoFecha.transform(dataform.fechaemision, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      condicionpagoid: dataform.condicionpagoid.id,
      idcliente : this.idClienteSeleccionado,
      nombrecliente :  dataform.nombrecliente,
      direccioncliente :  dataform.direccioncliente,
      monedaid: dataform.monedaid.id,
      tipocambio : dataform.tipocambio,
      diasvencimiento : this.PedidoEditar ? this.PedidoEditar.diasvencimiento : 0,
      fechavencimiento :  this.formatoFecha.transform(dataform.fechavencimiento, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA), 
      glosa :  dataform.glosa,
      estado :  dataform.estadoid.nombre,
      estadoid : dataform.estadoid.id,
      dsctoglobalrporcentaje: dataform.dsctoglobalrporcentaje,
      dsctoglobalimporte: -dataform.dsctoglobalimporte.toFixed(3),
      codtipooperacion: dataform.codtipooperacion.valor2,
      esdeduccionanticipo: false,
      esafectodetraccion: dataform.esafectodetraccion,
      codigodetraccion :  dataform.codigodetraccion ? dataform.codigodetraccion.id : null,
      porcentajedetraccion : dataform.porcentajedetraccion,
      esafectoretencion : false,
      motivonotaid: 1,
      ordenservicio : this.PedidoEditar ? +this.PedidoEditar.ordenservicio : 0,
      ordencompra: this.PedidoEditar ? +this.PedidoEditar.ordencompra : 0,
      fechaordencompra:  this.formatoFecha.transform(dataform.fechaordencompra, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),  
      esrecargoconsumo :this.PedidoEditar ? this.PedidoEditar.esrecargoconsumo :  false,
      cantidadtotal : this.PedidoEditar ? this.PedidoEditar.cantidadtotal : 0,
      importeanticipo : +dataform.importeanticipo.toFixed(2),
      importedescuento : -dataform.importedescuento.toFixed(2), 
      importevalorventa : +dataform.importevalorventa.toFixed(2), 
      importeigv :  +dataform.importeigv.toFixed(2), 
      importeicbper : +dataform.importeicbper.toFixed(2), 
      importeotrostributos: +dataform.importeotrostributos.toFixed(2),  
      importetotalventa : +dataform.importetotalventa.toFixed(2),   
      condicionesPagoSunat : [],
      detalles : DetallesVentaGrabar,
      documentoReferenciaDtos: DetallesDocumentoRefGrabar,
      idsCondicionPagoToDelet: this.arrayDetallesCondicionPagoEliminados,
      idsToDelete: this.arrayDetallesEliminados,
      ventaid : this.PedidoEditar ? this.PedidoEditar.ventaid : 0,
      pedidoData : DetallePedidoGrabar, 
    }
  
    if(!this.dataPedido){
      this.ventaservice.createVenta(newVenta).subscribe((resp) => {
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito('Se grabaron los datos correctamente!.');
      }, error => { 
        this.generalService.onValidarOtraSesion(error);  
      });
    }else{
      this.ventaservice.updateVenta(newVenta).subscribe((resp) => {
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
      }, error => { 
        this.generalService.onValidarOtraSesion(error);  
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
    this.VistaReporte = false;
  }

  Avisar() {
    this.FlgLlenaronCombo.subscribe((x) => {
      this.onObtenerVentaPorId(this.dataPedido.idVenta,'editar');
    });
  }

  /* EDITAR LA VENTA */
  onObtenerVentaPorId(idVentaPorid : number, estado: string){ 
    this.ventaservice.ventasPorId(idVentaPorid).subscribe((resp)=>{  
      if(resp){ 
        this.idClienteSeleccionado = resp.idcliente;
        if(resp.direccioncliente){
          this.existeDireccionCliente  = true;
        }
        this.PedidoEditar = resp;
        this.estadoForm = estado;
        this.idEstablecimientoSeleccionado = resp.establecimientoid 
        let tipoDocumento = this.arrayTipoDocumento.find((x) => x.id === this.PedidoEditar.documentoid) 
        
        this.onObtenerTipoDocumento(tipoDocumento);
        this.onCargarDropdownParaEditar(resp); 
        this.AvisarParaActualizar();
        
        this.totalaPagar = resp.importetotalventa
        this.existenroRegsitro = true;  
        this.spinner.hide();
      } 
    },error => { 
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);  
    });
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
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  AvisarParaActualizar(){
    this.FlgLlenaronComboParaActualizar.subscribe((x) => {
      this.onPintarDataFormulario();
    });
  }


  onPintarDataFormulario(){ 
   let tipoOperacionPintar : any = this.arrayTipoOperacion.find((x) => x.valor2 === this.PedidoEditar.codtipooperacion.toString())
   let serieVentaPintar = this.arraySeriePorDocumento.find((x) => x.valor1 === this.PedidoEditar.serieventa.toString())
   let estadosincorchete = this.PedidoEditar.estado.slice(1, -1)
   let estadoPintar = this.arrayEstado.find((x) => x.valor1 === estadosincorchete)
 
    this.Form.patchValue({
      secuencialventa :  this.PedidoEditar.secuencialventa,
      establecimientoid: this.arrayEstablecimiento.find(
        (x) => x.id === this.PedidoEditar.establecimientoid
      ),
      documentoid: this.arrayTipoDocumento.find(
        (x) => x.id === this.PedidoEditar.documentoid
      ),
      monedaid: this.arrayMonedas.find(
        (x) => x.id === this.PedidoEditar.monedaid
      ),
      nrodocumentocliente: this.PedidoEditar.nroDocumentoCliente,
      nombrecliente: this.PedidoEditar.nombrecliente,
      direccioncliente: this.PedidoEditar.direccioncliente,
      fechaemision:  new Date(this.PedidoEditar.fechaemision),
      fechavencimiento:  new Date(this.PedidoEditar.fechavencimiento),
      fechadespacho:  new Date(this.PedidoEditar.pedidoData.fechadespacho),
      tipocambio: this.PedidoEditar.tipocambio,
      condicionpagoid: this.arrayCondicionPago.find(
        (x) => x.id === this.PedidoEditar.condicionpagoid
      ),
      estadoid: this.arrayEstado.find(
        (x) => x.id === estadoPintar.id
      ),
      diasvencimiento : this.PedidoEditar.diasvencimiento,
      glosa: this.PedidoEditar.glosa,
      codtipooperacion : this.arrayTipoOperacion.find(
        (x) => x.id === tipoOperacionPintar.id
      ), 
      dsctoglobalrporcentaje: this.PedidoEditar.dsctoglobalrporcentaje ?? 0,
      esafectodetraccion: this.PedidoEditar.esafectodetraccion,
      codigodetraccion: this.arrayCodigoDetraccion.find(
        (x) => x.id === +this.PedidoEditar.codigodetraccion
      ),
      porcentajedetraccion: this.PedidoEditar.porcentajedetraccion ?? 0,

      serieventa :  this.arraySeriePorDocumento.find(
        (x) => x.id === serieVentaPintar.id
      ),

      dsctoglobalimporte : this.PedidoEditar.dsctoglobalimporte ?? 0,
      importeanticipo : this.PedidoEditar.importeanticipo ?? 0,
      importedescuento : this.PedidoEditar.importedescuento ?? 0,
      importeicbper : this.PedidoEditar.importeicbper ?? 0,
      importeigv : this.PedidoEditar.importeigv ?? 0,
      importeotrostributos  : this.PedidoEditar.importeotrostributos ?? 0,
      importetotalventa : this.PedidoEditar.importetotalventa ?? 0,
      importevalorventa : this.PedidoEditar.importevalorventa ?? 0

    })

    for( let  i = 0; i < this.PedidoEditar.detalles.length; i++){
      if(this.estadoForm === 'editar'){
        this.onAgregarDetalleVenta();
      }
       
      this.detallesVentaForm[i].patchValue({
        almacenid: this.arrayAlmacen.find(
          (x) => x.id ===  this.PedidoEditar.detalles[i].almacenid
        ),
        ventadetalleid : this.PedidoEditar.detalles[i].ventadetalleid,
        ventadetallemigradaid: this.PedidoEditar.detalles[i].ventadetallemigradaid,
        ventaid :this.PedidoEditar.detalles[i].ventaid,
        codproductofinal : this.PedidoEditar.detalles[i].codproductofinal ,
        productoid :this.PedidoEditar.detalles[i].productoid,
        descripcionproducto : this.PedidoEditar.detalles[i].descripcionproducto,
        unidadmedida : this.PedidoEditar.detalles[i].unidadMedida,
        unidadmedidaid: this.arrayUnidadMedida.find(
          (x) => x.id ===  this.PedidoEditar.detalles[i].unidadmedidaid
        ),
        cantidad : this.PedidoEditar.detalles[i].cantidad,
        preciounitario : this.PedidoEditar.detalles[i].preciounitario,
        precioincluyeigv :  this.PedidoEditar.detalles[i].precioincluyeigv,
        baseimponible : this.PedidoEditar.detalles[i].baseimponible,
        tipoafectacionid: this.arrayTipoAfectacion.find(
          (x) => x.id ===  this.PedidoEditar.detalles[i].tipoafectacionid
        ),
        porcentajedescuento : this.PedidoEditar.detalles[i].porcentajedescuento,
        importedescuento: this.PedidoEditar.detalles[i].importedescuento,
        observaciones:  this.PedidoEditar.detalles[i].observaciones,
        valorVenta: this.PedidoEditar.detalles[i].valorventa,
        igv : this.PedidoEditar.detalles[i].igv,
        importesotroscargos : this.PedidoEditar.detalles[i].importeotroscargos,
        importeicbper : this.PedidoEditar.detalles[i].importeicbper,
        precioventa : this.PedidoEditar.detalles[i].precioventa,
        nroLote :  this.PedidoEditar.detalles[i].nrolote,
        nroSerie:  this.PedidoEditar.detalles[i].nroserie,
        fechavencimiento:  new Date( this.PedidoEditar.detalles[i].fechavencimiento),
        esanticipo:  this.PedidoEditar.detalles[i].esanticipo,
        esafectoicbper:  this.PedidoEditar.detalles[i].esafectoicbper,
        esGratuito:  this.PedidoEditar.detalles[i].esGratuito,
        esGravada:  this.PedidoEditar.detalles[i].esGravada,
        ventaanticiporeferenciaid:  this.PedidoEditar.detalles[i].ventaanticiporeferenciaid,
      });
    }
  
     
    let SonGuiasRemision : any [] = []; 
     
    if(this.PedidoEditar.documentoReferenciaDtos){
      this.PedidoEditar.documentoReferenciaDtos.forEach(x => {
        if(x.esgrm){
          SonGuiasRemision.push(x);
        } 
    })

    
    if(SonGuiasRemision){
      for( let  i = 0; i < SonGuiasRemision.length; i++){
        if(this.estadoForm === 'editar'){
          this.onAgregarDetalleGuiaRemision();
        }
        this.detallesGuiaRemision[i].patchValue({
          ventadocumentosreferenciaid: this.PedidoEditar.documentoReferenciaDtos[i].ventadocumentosreferenciaid,
          ventaid : this.PedidoEditar.documentoReferenciaDtos[i].ventaid,
          serieguia : this.PedidoEditar.documentoReferenciaDtos[i].seriereferencia,
          nroguia : this.PedidoEditar.documentoReferenciaDtos[i].secuencialreferencia,
        });
      }
    }
 
    } 
    this.spinner.hide();
    this.onCalcularTotalVenta();
  }

  /* LLENADO DE ARRAYS PARA ENVIAR A GRABAR */
  onPedidoData(){
    this.arrayPedidoDataGrabar = null;
    const dataform = this.Form.value;
 
    const newPedidoData = {
      ventapedidoid: this.PedidoEditar ? this.PedidoEditar.pedidoData.ventapedidoid : 0,
      ventaid: this.PedidoEditar ? this.PedidoEditar.pedidoData.ventaid : 0,
      espedido : true,
      fechadespacho :  this.formatoFecha.transform(dataform.fechadespacho , ConstantesGenerales._FORMATO_FECHA_BUSQUEDA) ,
      estadodespachoid :  dataform.estadoid.id,
    }
    return newPedidoData;

  }

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
          esanticipo : element.value.esanticipo,
          valorventa : element.value.valorVenta,
          igv :  element.value.igv,
          importeotroscargos:  element.value.importesotroscargos,
          importeicbper :  element.value.importeicbper,
          precioventa :  element.value.precioventa,
          nrolote :  element.value.nroLote,
          fechavencimiento : this.formatoFecha.transform(element.value.fechavencimiento,ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),   
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

 
  onGrabarDetalleDocumentoRef(){ 
    this.arrayDetalleGuiaRemisionGrabar = [];
 
    this.detallesGuiaRemision.forEach(element => {  
      if(!element.value){
        this.swal.mensajeInformacion('Aquellos registros vacios no se insertaran en al registro.');
        return;
      }else{ 
        this.arrayDetalleGuiaRemisionGrabar.push({
          ventadocumentosreferenciaid:  this.PedidoEditar ? this.PedidoEditar.documentoReferenciaDtos[0].ventadocumentosreferenciaid :  0,
          ventaid: this.PedidoEditar ? this.PedidoEditar.documentoReferenciaDtos[0].ventaid :  0,
          serieguia: element.value.serieguia,
          nroguia : element.value.nroguia ,
          esgrm : element.value.esgrm
        });  
      }
    })  
    return this.arrayDetalleGuiaRemisionGrabar; 
  }
 
  onGrabarDetalleVentaDetraccionTransporte(){
    this.arrayDetalleVentaDetraccionTransportista = null;
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
    let Porcentajebolsaplastica = 0;
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
        igv : Math.round((igvAct + Number.EPSILON) * 100) / 100  //+parseFloat(igvAct.toFixed(2))
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
 
}
 
