import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { forkJoin, Subject } from 'rxjs'; 
import { IConfiguracionEmpresa } from 'src/app/modulos/home/configuracion/configuraciones/interface/configuracion.interface';
import { ConfiguracionService } from 'src/app/modulos/home/configuracion/configuraciones/service/configuracion.service';
import { VentasService } from 'src/app/modulos/home/ventas/v-procesos/ventas/service/venta.service';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service'; 
import { ComprasService } from '../../compras/service/compras.service';
import { ICreateOrdenCompra, IOrdenCompraCMD, IOrdenCompraPorId } from '../interface/ordenCompra.interface';
import { OrdenCompraService } from '../service/ordencompraService';
 

@Component({
  selector: 'app-nueva-orden-compra',
  templateUrl: './nueva-orden-compra.component.html',
  styleUrls: ['./nueva-orden-compra.component.scss']
})
export class NuevaOrdenCompraComponent implements OnInit {
 
  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>(); 
  public FlgLlenaronComboParaActualizar: Subject<boolean> = new Subject<boolean>(); 
  @Input() dataOrdenCompra : any;
  @Output() cerrar : EventEmitter<boolean> = new EventEmitter<boolean>();
  valorIGV : number = 0.18;
  fechaActual = new Date();
  tituloNuevaOrdenCompra: string ="NUEVA ORDEN COMPRA";
  opcionesNuevaCompra: MenuItem[];
  Form : FormGroup; 
  OrdenCompraEditar : IOrdenCompraPorId; 
  dataReporte : any;
  estadoForm : string ="";
  es = ConstantesGenerales.ES_CALENDARIO;
  arrayDetalleCompraGrabar : any[] = []; 
  arrayDetalleComraCMDGrabar : IOrdenCompraCMD;  
  arrayTipoDocumento : ICombo[]; 
  arrayFormasPago : any[];
  arrayMonedas : ICombo[];
  arrayEstado : any[];
  arrayAreaSolicitante : any[];
  arrayTipoOrden : any[]; 
  arrayEstablecimiento : ICombo[];
  arrayUnidadMedida : ICombo[];
  arrayAlmacen : ICombo[];
  arrayDestino : ICombo[];
  
  idProveedorSeleccionado : number = 0;
  idEstablecimientoSeleccionado : number = 0;
  existenroRegsitro : boolean = false;
  existeDireccionCliente : boolean = false;
  existeProveedorSeleccionado : boolean = false;
  existeEstablecimientoSeleccionado : boolean = false; 
  mostrarbotoneliminarDetalle : boolean = false;  
  arrayDetallesEliminados: any[] =[]; 
  
  modalBuscarPersona: boolean = false;
  modalBuscarProducto: boolean = false; 
  modalBuscarAnticipo: boolean = false; 
  mostrarBotonReportes: boolean = false; 
  VistaReporte: boolean = false; 
  dataProductos :any; 
  dataAnticipo: any;
  isAfectoicbper : boolean;
  /* MOSTRAR TOTALES */ 
  TabTotalesActivo : boolean = true;
  dataConfiguracion : IConfiguracionEmpresa;
  items: MenuItem[];
  activeItem: MenuItem;
  /* TABS */ 
  DetalleForm : boolean = false; 
  NotasForm : boolean = false; 
  TotalesForm: boolean = false;  
  totalaPagar : number = 0;  

  dataPredeterminadosDesencryptada:any;

  constructor(
    private ocService : OrdenCompraService,
    private comprasService : ComprasService,
    private ventaService : VentasService,
    private configService: ConfiguracionService,
    private generalService : GeneralService,
    private swal : MensajesSwalService,
    private readonly formatoFecha : DatePipe, 
    private fb : FormBuilder,
    private cdr: ChangeDetectorRef,
    private spinner : NgxSpinnerService
  ) { 

    this.builform();
    
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })

    this.arrayEstado = [
      { id: 1, nombre: 'PENDIENTE'},
      { id: 2, nombre: 'APROBADA'},
      { id: 3, nombre: 'RECHAZADA'},
    ]

    this.arrayAreaSolicitante = [
      { id: 1, nombre: 'VENTA'},
      { id: 2, nombre: 'ALMACEN'},
      { id: 3, nombre: 'COMPRA'},
    ]

    this.arrayTipoOrden = [
      { id: 1, nombre: 'NACIONAL'},
      { id: 2, nombre: 'IMPORTACION'}, 
    ]

    this.arrayFormasPago = [
      { id: 1, nombre: 'CHEQUE'},
      { id: 2, nombre: 'CRÉDITO'},
      { id: 3, nombre: 'TRANSFERENCIA'},
    ]

   }

   
  public builform(){
    this.Form = new FormGroup({
      documentoid : new FormControl(null, Validators.required),
      serieventa: new FormControl('', Validators.required),
      secuencialventa: new FormControl(0),
      establecimientoid : new FormControl(null ,Validators.required),
      nrodocumentocliente: new FormControl(null),
      nombrecliente: new FormControl(null ,Validators.required),
      direccioncliente:  new FormControl(null),
      diasvencimiento:  new FormControl(null,Validators.required),
      fechaemision : new FormControl(this.fechaActual ,Validators.required),
      fechavencimiento : new FormControl(this.fechaActual),
      monedaid : new FormControl(null ,Validators.required),
      tipocambio : new FormControl(null,Validators.required),
      formapagoid : new FormControl({ id: 1, nombre: 'CHEQUE'},Validators.required),
      areasolicitanteid: new FormControl({ id: 1, nombre: 'VENTA'}, Validators.required),
      tipoordencompraid: new FormControl({ id: 1, nombre: 'NACIONAL'}, Validators.required),
      notalugarentrega: new FormControl(null),
      notaanexos: new FormControl(null),
      notaobservaciones: new FormControl(null),
      condicionpagoid : new FormControl(1),
      estadoid : new FormControl({ id: 1, nombre: 'PENDIENTE'}, Validators.required),
      glosa : new FormControl(null),
      codtipooperacion : new FormControl("0101"),
      motivonotaid: new FormControl(-1),
      dsctoglobalrporcentaje: new FormControl(0),
      esafectodetraccion: new FormControl(false),
      fechadetraccion: new FormControl(this.fechaActual),
      esdeduccionanticipo: new FormControl(false), 
      nrodetraccion: new FormControl(null), 
      codigodetraccion: new FormControl(0),
      esafectopercepcion: new FormControl(false), 
      porcentajedetraccion: new FormControl(null),  
      porcentajepercepcion: new FormControl(null),  
      importepercepcion:new FormControl(null),  
      importebasepercepcion: new FormControl(null), 
      arrayDetalleCompra: new FormArray([]),
      esafectoretencion : new FormControl(false), 
      esrecargoconsumo : new FormControl(false), 
      esordencompra : new FormControl(true), 
      dsctoglobalimporte : new FormControl(0), 
      importeanticipo : new FormControl(0), 
      importedescuento : new FormControl(0), 
      importevalorventa : new FormControl(0), 
      cantidadtotal : new FormControl(0), 
      importeigv : new FormControl(0), 
      importeicbper : new FormControl(0), 
      importeotrostributos : new FormControl(0), 
      importetotalventa : new FormControl(0),  
      descuentoporitem : new FormControl(0),  
      importeexonerado : new FormControl(0),  
      importeinafecto: new FormControl(0),  
      importegravada: new FormControl(0),   
      importegratuita: new FormControl(0),   
    })
  }
  
  ngOnInit(): void {  
    this.onCargarDropdown();  
    this.onTabsForm();
    if(this.dataOrdenCompra){ 
      this.spinner.show();
      this.tituloNuevaOrdenCompra = "EDITAR ORDEN COMPRA"  
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

  onCargarDatosdeConfiguracion(){
    this.configService.listadoConfiguraciones().subscribe((resp) => {
      if(resp){
        this.dataConfiguracion = resp  
        this.Form.patchValue({  
          importeicbper :this.dataConfiguracion.porcentajebolsaplastica, 
          monedaid: this.arrayMonedas.find(
            (x) => x.id === this.dataConfiguracion.compramonedadefault
          ),    
          glosa :this.dataConfiguracion.compraglosadefault,  
        })
      }
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
        label: 'NOTAS',
        icon: 'fas fa-square-plus',
        command: event => {
          this.activateMenu(event.item.id);
        }
      },
      {
        id: '3',
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
    this.NotasForm = false; 
    this.DetalleForm = false;
    this.TotalesForm = false;
    this.TabTotalesActivo = true;

    if(event ===  "2" ){
      this.NotasForm = true;
      this.activeItem = this.items[1];
     }else if(event ===  "3" ){
      this.TotalesForm = true;
      this.activeItem = this.items[2];
      this.TabTotalesActivo = false;
    }else{
      this.DetalleForm = true;
      this.activeItem = this.items[0];
    }

  }


  onCargarDropdown(){
    const data={
      esOrdenCompra : true
     } 
    const obsDatos = forkJoin(
      this.generalService.listadoDocumentoPortipoParacombo(data), 
      this.generalService.listadoPorGrupo('Monedas'), 
      this.generalService.listadoComboEstablecimientos(),
      this.generalService.listadoUnidadMedida(),
      this.generalService.listadoPorGrupo('DestinosCompras'), 
    );
    obsDatos.subscribe((response) => {
      this.arrayTipoDocumento = response[0]; 
      this.arrayMonedas = response[1]; 
      this.arrayEstablecimiento = response[2];
      this.arrayUnidadMedida = response[3];
      this.arrayDestino = response[4]; 
      this.FlgLlenaronCombo.next(true);
      if(!this.dataOrdenCompra){
        this.existeEstablecimientoSeleccionado = true; 
       this.onCargarTipoCambio(); 
       this.onCargarDatosdeConfiguracion(); 
       this.dataPredeterminadosDesencryptada = JSON.parse(localStorage.getItem('Predeterminados')); 
       if(this.dataPredeterminadosDesencryptada){
        this.Form.patchValue({
          establecimientoid: this.arrayEstablecimiento.find(
            (x) => x.id === +this.dataPredeterminadosDesencryptada.idEstablecimiento ?? 0
          ), 
        }) 
        this.onObtenerEstablecimiento(+this.dataPredeterminadosDesencryptada.idEstablecimiento);
        this.onCargarAlmacenes(+this.dataPredeterminadosDesencryptada.idEstablecimiento); 
      }
      } 
    });
  }
 
  Avisar() {
    this.FlgLlenaronCombo.subscribe((x) => {
      this.onObtenerVentaPorId(this.dataOrdenCompra.idCompra,'editar');
    });
  }
 

  onObtenerVentaPorId(idcompra : number, estado: string){ 
    this.ocService.ordenCompraPorId(idcompra).subscribe((resp)=>{ 
      if(resp){    
        this.OrdenCompraEditar = resp;
        this.idEstablecimientoSeleccionado = resp.establecimientoid;  
        this.onCargarDropdownParaEditar(this.idEstablecimientoSeleccionado); 
        this.estadoForm = estado;
        this.idProveedorSeleccionado = resp.idproveedor;  
        this.totalaPagar = resp.importetotalventa
        this.existenroRegsitro = true;  
        this.AvisarParaActualizar();
        this.mostrarBotonReportes = true;
        this.spinner.hide();
      } 
    });
  }
 
  onCargarDropdownParaEditar(data:any){  
    const obsDatos = forkJoin(
      this.generalService.listadoAlmacenesParams(data), 
    );
    obsDatos.subscribe((response) => {
      this.arrayAlmacen = response[0]; 
      this.FlgLlenaronComboParaActualizar.next(true);
    });
  }

  AvisarParaActualizar(){
    this.FlgLlenaronComboParaActualizar.subscribe((x) => {
      this.onPintarCompraParaEditar();
    });
  }
  

  onPintarCompraParaEditar(){   
    this.Form.patchValue({
      motivonotaid : this.OrdenCompraEditar.motivonotaid, 
      secuencialventa :  this.OrdenCompraEditar.secuencialventa,
      establecimientoid: this.arrayEstablecimiento.find(
        (x) => x.id === this.OrdenCompraEditar.establecimientoid
      ),
      documentoid: this.arrayTipoDocumento.find(
        (x) => x.id === this.OrdenCompraEditar.documentoid
      ),
      monedaid: this.arrayMonedas.find(
        (x) => x.id === this.OrdenCompraEditar.monedaid
      ),
      serieventa :  this.OrdenCompraEditar.serieventa,
      nrodocumentocliente: this.OrdenCompraEditar.nroDocumentoCliente,
      nombrecliente: this.OrdenCompraEditar.nombrecliente,
      direccioncliente: this.OrdenCompraEditar.direccioncliente,
      fechaemision:  new Date(this.OrdenCompraEditar.fechaemision),
      fechavencimiento:  new Date(this.OrdenCompraEditar.fechavencimiento),
      tipocambio: this.OrdenCompraEditar.tipocambio,
   
      estadoid: this.arrayEstado.find(
        (x) => x.id === this.OrdenCompraEditar.ordenCompraCmd.estadoextraccionid
      ),
      glosa: this.OrdenCompraEditar.glosa, 
      dsctoglobalrporcentaje: this.OrdenCompraEditar.dsctoglobalrporcentaje ?? 0,
      esafectodetraccion: this.OrdenCompraEditar.esafectodetraccion, 
      porcentajedetraccion: this.OrdenCompraEditar.porcentajedetraccion ?? 0, 
      diasvencimiento: this.OrdenCompraEditar.diasvencimiento,
      dsctoglobalimporte : this.OrdenCompraEditar.dsctoglobalimporte ?? 0,
      importeanticipo : this.OrdenCompraEditar.importeanticipo ?? 0,
      importedescuento : this.OrdenCompraEditar.importedescuento ?? 0,
      importeicbper : this.OrdenCompraEditar.importeicbper ?? 0,
      importeigv : this.OrdenCompraEditar.importeigv ?? 0,
      importeotrostributos  : this.OrdenCompraEditar.importeotrostributos ?? 0,
      importetotalventa : this.OrdenCompraEditar.importetotalventa ?? 0,
      importevalorventa : this.OrdenCompraEditar.importevalorventa ?? 0, 
      esafectopercepcion: this.OrdenCompraEditar.esafectopercepcion, 
      fechapercepcion:  new Date(this.OrdenCompraEditar.fechapercepcion), 
      fechadetraccion:  new Date(this.OrdenCompraEditar.fechadetraccion),  
      serialpercepcion : this.OrdenCompraEditar.serialpercepcion,
      importebasepercepcion: this.OrdenCompraEditar.importebasepercepcion,
      porcentajepercepcion: this.OrdenCompraEditar.porcentajepercepcion,
      importepercepcion: this.OrdenCompraEditar.importepercepcion,
      formapagoid: this.arrayFormasPago.find(
        (x) => x.id === this.OrdenCompraEditar.ordenCompraCmd.formapagoid
      ),
      areasolicitanteid: this.arrayAreaSolicitante.find(
        (x) => x.id === this.OrdenCompraEditar.ordenCompraCmd.areasolicitanteid
      ),
      tipoordencompraid: this.arrayTipoOrden.find(
        (x) => x.id === this.OrdenCompraEditar.ordenCompraCmd.tipoordencompraid
      ),
      notalugarentrega: this.OrdenCompraEditar.ordenCompraCmd.notalugarentrega,
      notaanexos: this.OrdenCompraEditar.ordenCompraCmd.notaanexos,
      notaobservaciones: this.OrdenCompraEditar.ordenCompraCmd.notaobservaciones,

    
    })
 
    for( let  i = 0; i < this.OrdenCompraEditar.detalles.length; i++){
      if(this.estadoForm === 'editar'){
        this.onAgregarDetalleCompra();
      }
       
      this.detallesCompraForm[i].patchValue({
        almacenid: this.arrayAlmacen.find(
          (x) => x.id ===  this.OrdenCompraEditar.detalles[i].almacenid
        ),
        compradetalleid : this.OrdenCompraEditar.detalles[i].compradetalleid, 
        compraid :this.OrdenCompraEditar.detalles[i].compraid,
        codproductofinal : this.OrdenCompraEditar.detalles[i].codproductofinal ,
        productoid :this.OrdenCompraEditar.detalles[i].productoid,
        descripcionproducto : this.OrdenCompraEditar.detalles[i].descripcionproducto, 
        unidadmedidaid: this.arrayUnidadMedida.find(
          (x) => x.id ===  this.OrdenCompraEditar.detalles[i].unidadmedidaid
        ),
        cantidad : this.OrdenCompraEditar.detalles[i].cantidad,
        preciounitario : this.OrdenCompraEditar.detalles[i].preciounitario,
        precioincluyeigv :  this.OrdenCompraEditar.detalles[i].precioincluyeigv,
        baseimponible : this.OrdenCompraEditar.detalles[i].baseimponible,
        tipoafectacionid: this.arrayDestino.find(
          (x) => x.id ===  this.OrdenCompraEditar.detalles[i].tipoafectacionid
        ),
        porcentajedescuento : this.OrdenCompraEditar.detalles[i].porcentajedescuento,
        importedescuento: this.OrdenCompraEditar.detalles[i].importedescuento,
        observaciones:  this.OrdenCompraEditar.detalles[i].observaciones,
        valorventa: this.OrdenCompraEditar.detalles[i].valorventa,
        igv : this.OrdenCompraEditar.detalles[i].igv,
        importesotroscargos : this.OrdenCompraEditar.detalles[i].importeotroscargos,
        importeicbper : this.OrdenCompraEditar.detalles[i].importeicbper,
        precioventa : this.OrdenCompraEditar.detalles[i].precioventa,
        nrolote :  this.OrdenCompraEditar.detalles[i].nrolote,
        nroserie:  this.OrdenCompraEditar.detalles[i].nroserie,
        fechavencimiento:  new Date( this.OrdenCompraEditar.detalles[i].fechavencimiento),
        esanticipo:  this.OrdenCompraEditar.detalles[i].esanticipo,    
      });
    }
  
    this.spinner.hide();
    this.onCalcularTotalCompra(); 
  }

  /* BUSCAR POR DOCUMENTO AL PROVEEDOR */
  onObtenerPersonaPorNroDocumentoVenta(event : any){
    let numdocumento = event.target.value; 
      this.comprasService.obtenerPersonaPorNroDocumentoCompra(numdocumento).subscribe((resp) => { 
         if(resp.personaData.nombreCompleto != "NO ENCONTRADO"){ 
          this.idProveedorSeleccionado = resp.idproveedor
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
      });
  }


  onObtenerEstablecimiento(event : any){ 
    if(event){
        this.idEstablecimientoSeleccionado = event;
        this.existeEstablecimientoSeleccionado = true;
        this.onCargarAlmacenes(this.idEstablecimientoSeleccionado) 
    }else{
      this.existeEstablecimientoSeleccionado = false;
      this.idEstablecimientoSeleccionado = null; 
      this.Form.controls['documentoid'].setValue(null); 
    }
  }

  onCargarAlmacenes(event: number){
    this.generalService.listadoAlmacenesParams(event).subscribe((resp) =>{
      if(resp){
        this.arrayAlmacen = resp;
      }
    });
  }
   

  /* BUSCAR PROVEEDOR */
  onBuscarProveedor(){
    this.modalBuscarPersona = true;
  }

  onPintarPersonaSeleccionada(data: any){ 
    if(data.direccionPrincipal){
      this.existeDireccionCliente = true;
      this.Form.controls['direccioncliente'].setValue(data.direccionPrincipal);
    }

    this.idProveedorSeleccionado = data.idProveedor;
    this.Form.controls['nrodocumentocliente'].setValue(data.nroDocumento);
    this.Form.controls['nombrecliente'].setValue(data.nombreRazSocial);
    this.existeProveedorSeleccionado = true;
    this.modalBuscarPersona = false;
  }

  onBorrarProveedor(){
    this.swal.mensajePregunta('¿Seguro de quitar al proveedor actual?').then((response) => {
      if (response.isConfirmed) {
      this.Form.controls['nombrecliente'].setValue(null);
      this.Form.controls['nrodocumentocliente'].setValue(null);
      if(this.Form.controls['direccioncliente'].value){
        this.Form.controls['direccioncliente'].setValue(null);
      }  
      this.existeDireccionCliente = false;
      this.existeProveedorSeleccionado = false;
      }
    })
  }

  onBuscarProductoPorCodigo(posicion: any){
    let codProductoaBuscar = (this.Form.get('arrayDetalleCompra') as FormArray).at(posicion).value.codproductofinal;
    const data = {
      periodo : this.fechaActual.getFullYear(),
      criteriodescripcion : codProductoaBuscar
    }
    this.generalService.BuscarProductoPorCodigo(data).subscribe((resp) => {
      if(resp[0]){
        this.detallesCompraForm[posicion].patchValue({
          codproductofinal:  resp[0].codProducto,
          descripcionproducto: resp[0].nombreProducto,
          unidadmedidaid: this.arrayUnidadMedida.find(
            (x) => x.id ===   resp[0].unidadMedidaId
          ),
          tipoafectacionid : this.arrayDestino.find(
            (x) => x.id ===   resp[0].tipoAfectacionId
          ),
          preciounitario : resp[0].precioDefault.toFixed(2),
          precioincluyeigv : resp[0].precioIncluyeIgv,
          productoid : resp[0].productoId,
          esafectoicbper :resp[0].esAfectoICBPER,
          nroSerie: resp[0].serie === "0" ? null : resp[0].serie, 
          nroLote: resp[0].lote === "0" ? null : resp[0].lote, 
          esGravada : resp[0].precioIncluyeIgv
        });
        this.onCalcularPrecioCompra(posicion);
      }else{
        this.swal.mensajeAdvertencia('no se encontraron datos con el codigo ingresado.');
      }
    });
  }


  
  /* BUSCAR PRODUCTO */
  onModalBuscarProducto(posicion : number){
    let ValorAlmacen = (this.Form.get('arrayDetalleCompra') as FormArray).at(posicion).value.almacenid;
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
    this.detallesCompraForm[event.posicion].patchValue({
      codproductofinal:  event.data.codProducto,
      descripcionproducto: event.data.nombreProducto,
      unidadmedidaid: this.arrayUnidadMedida.find(
        (x) => x.id ===   event.data.unidadMedidaId
      ),
      tipoafectacionid: this.arrayDestino.find(
        (x) => x.id ===   event.data.tipoAfectacionId
      ),
      preciounitario : event.data.precioDefault.toFixed(2),
      productoid : event.data.productoId,
      esafectoicbper :event.data.esAfectoICBPER,
      nroSerie: event.data.serie === "0" ? null : event.data.serie, 
      nroLote: event.data.lote === "0" ? null : event.data.lote, 
      precioincluyeigv : event.data.precioIncluyeIgv, 
      esGravada : event.data.precioIncluyeIgv
    });
    this.onCalcularPrecioCompra(event.posicion); 
    this.modalBuscarProducto = false;
  }



  /* BUSCAR ANTICIPOS */
  onModalBuscaAnticipo(posicion: number, data :any){
    const dataAnticipo = {
      posicion : posicion,
      idcompra : data.compraid,
      idproveedor : this.idProveedorSeleccionado
    }
    this.dataAnticipo = dataAnticipo
    this.modalBuscarAnticipo = true;
  }

  onPintarAnticipoSeleccionado(data:any){
    console.log(data);
  }
 
  
  /* AGREGAR DETALLE DE LA COMPRA */
  get fa() { return this.Form.get('arrayDetalleCompra') as FormArray; }
  get detallesCompraForm() { return this.fa.controls as FormGroup[]; }

  onAgregarDetalleCompra(){
    // if(!this.Form.controls['establecimientoid'].value){
    //   this.swal.mensajeAdvertencia('Debes Seleccionar un Establecimiento para agregar detalles.');
    //   return;
    // }
    this.detallesCompraForm.push(this.AddDetalleCompra());
  }

  AddDetalleCompra(){
    return this.fb.group({ 
        esExonerado : new  FormControl(null), 
        compradetalleid : new FormControl(0),
        compraid :  new FormControl(0),
        productoid: new FormControl(null), 
       // almacenid: new FormControl(null), 
        almacenid: this.arrayAlmacen.find(
          (x) => x.id === (this.dataPredeterminadosDesencryptada ? this.dataPredeterminadosDesencryptada.idalmacen : null)
        ),
        unidadmedidaid: new FormControl(null),
        codproductofinal : new  FormControl(null),
        descripcionproducto : new  FormControl(null),
        cantidad: new  FormControl(1),
        preciounitario: new  FormControl(0),
        precioincluyeigv : new  FormControl(false),
        baseimponible: new  FormControl(0),
        tipoafectacionid: new  FormControl(0),
        porcentajedescuento : new  FormControl(0),
        observaciones: new  FormControl(null), 
        importedescuento: new  FormControl(0), 
        esanticipo: new  FormControl(false),
        codigoAnticipo: new  FormControl(null), // Por Confirmar
        valorventa: new  FormControl(0),
        igv : new  FormControl(0),
        importeotroscargos: new  FormControl(0),
        importeicbper: new  FormControl(0),
        precioventa : new  FormControl(0),
        nrolote: new  FormControl(null), 
        nroserie: new  FormControl(null),
        fechavencimiento: new  FormControl(new Date), 
        esInafecto : new  FormControl(false),
        esGratuito: new  FormControl(false),
        esGravada: new  FormControl(false),
    })
  }

  onEliminarDetalleCompra(index : any, compradetalleid : any){ 
    if(compradetalleid === 0){
      this.fa.removeAt(index);
      this.cdr.detectChanges();  
      if(this.detallesCompraForm.length === 0){
        this.totalaPagar = 0
      }
    }else{
      this.swal.mensajePregunta("¿Seguro que desea eliminar del detalle de la compra.?").then((response) => {
        if (response.isConfirmed) {
          this.arrayDetallesEliminados.push(compradetalleid); 
          this.fa.removeAt(index);
          if(this.detallesCompraForm.length === 0){
            this.totalaPagar = 0
          }
          this.swal.mensajeExito('El detalle ha sido eliminado correctamente!.');
        }
      })
    }
  }
  
  /*CALCULOS*/
  onObtenerDestino(posicion : number, event:any){ 
    let idAfectacion = event.id 
    if(idAfectacion === 4){ 
      this.detallesCompraForm[posicion].patchValue({
        esGratuito : false, 
      });
    }else{
      this.detallesCompraForm[posicion].patchValue({
        esInafecto : true,
        esGratuito : false,  
      });
    } 

  }

  onCalcularPrecioCompra(posicion : number){ 
    let isOperacionGravada : boolean = (this.Form.get('arrayDetalleCompra') as FormArray).at(posicion).value.esGravada;
    let Preciounitario = (this.Form.get('arrayDetalleCompra') as FormArray).at(posicion).value.preciounitario;
    let Porcentajedescuento = (this.Form.get('arrayDetalleCompra') as FormArray).at(posicion).value.porcentajedescuento;
    let Cantidad : number = (this.Form.get('arrayDetalleCompra') as FormArray).at(posicion).value.cantidad;  
    if (!isOperacionGravada){
      this.detallesCompraForm[posicion].patchValue({
        precioincluyeigv : false
      });
    }

    let Precioincluyeigv = (this.Form.get('arrayDetalleCompra') as FormArray).at(posicion).value.precioincluyeigv; 
    let preciosinigv
    if(Precioincluyeigv){
      preciosinigv = +(Preciounitario / (1 +this.valorIGV))
    }else{
      preciosinigv = +Preciounitario
    }


    let biActualizar  = Cantidad *  +parseFloat(preciosinigv.toFixed(3)) 
    this.detallesCompraForm[posicion].patchValue({
      baseimponible :  +parseFloat(biActualizar.toFixed(2))
    });

    //let Baseimponible : number  = (this.Form.get('arrayDetalleCompra') as FormArray).at(posicion).value.baseimponible;
    if( Porcentajedescuento > 0){
      let dsctoFactor =  ( Porcentajedescuento / 100);
      let impd : number = (biActualizar * dsctoFactor);

      this.detallesCompraForm[posicion].patchValue({
        importedescuento : +parseFloat(impd.toFixed(2))
      });
    }else{
      this.detallesCompraForm[posicion].patchValue({
        importedescuento : 0
      });
    }
    let Importedescuento : number = (this.Form.get('arrayDetalleCompra') as FormArray).at(posicion).value.importedescuento;
    let vVenta = (biActualizar - Importedescuento);
    this.detallesCompraForm[posicion].patchValue({
      valorventa :  +parseFloat(vVenta.toFixed(2))
    });

   // let Valorventa : number  = (this.Form.get('arrayDetalleCompra') as FormArray).at(posicion).value.valorventa;

    if(isOperacionGravada){
      let igvAct = (vVenta * this.valorIGV);
      let newigcAtc = Math.round((igvAct + Number.EPSILON) * 100) / 100; 
      this.detallesCompraForm[posicion].patchValue({
        igv : newigcAtc
      });
    }else{
      this.detallesCompraForm[posicion].patchValue({
        igv : 0
      });
    }

    let Importeotroscargos : number = (this.Form.get('arrayDetalleCompra') as FormArray).at(posicion).value.importeotroscargos;
    let Igv : number = (this.Form.get('arrayDetalleCompra') as FormArray).at(posicion).value.igv;

    let precioventaAct : number =  (vVenta +  Igv + Importeotroscargos);

    this.detallesCompraForm[posicion].patchValue({ 
      precioventa : +parseFloat(precioventaAct.toFixed(2))
    });
 
    this.onCalcularTotalCompra(); 
  }
 
  onCalcularTotalCompra(){ 
    let Dsctoglobalporcentaje = this.Form.controls['dsctoglobalrporcentaje'].value;
    let Afectopercepcion   = this.Form.controls['esafectopercepcion'].value; 
    let IBasePercepcion = this.Form.controls['importebasepercepcion'].value ?? 0; 
    let PorcentajePercpecion : number  =   this.Form.controls['porcentajepercepcion'].value;  
    let Importeicbper : number  =   this.Form.controls['importeicbper'].value;  
    let detallesNoGratuitos : any[]=[];
    let NoAnticipos : any[]=[];
    let Anticipos : any[]=[];

    //* RECORREMOS LOS NO GRATUITOS
    this.detallesCompraForm.forEach(det => {
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
    
 
    if(Afectopercepcion){
      let ipAct =  (IBasePercepcion * (PorcentajePercpecion / 100))
      this.Form.controls['importepercepcion'].setValue(ipAct) 
    }else{
      this.Form.controls['importepercepcion'].setValue(0) 
    }
 
    let Percepcion
    if(!Afectopercepcion){
      Percepcion = 0
    }else{
      Percepcion = this.Form.controls['importepercepcion'].value ?? 0;
    }

    //* SUMAMOS LOS IMPORTES ICBPER
    let importeanticipoAct = Anticipos.reduce((sum, value)=> (sum + value.precioventa), 0)
    this.Form.controls['importeanticipo'].setValue(importeanticipoAct)
 
    let importeValorVentaAct = NoAnticipos.reduce((sum, value)=> (sum + value.baseimponible), 0) - Anticipos.reduce((sum, value) => (sum + value.baseimponible), 0)
    this.Form.controls['importevalorventa'].setValue(importeValorVentaAct)
 
    let dsctosunitarios = NoAnticipos.reduce((sum, value)=> (sum + value.importedescuento ?? 0), 0);

    let importeigvAct = NoAnticipos.reduce((sum, value)=> (sum + value.igv ?? 0), 0) -  Anticipos.reduce((sum, value)=> (sum + value.igv ?? 0 ), 0)
    this.Form.controls['importeigv'].setValue(importeigvAct)

    let ImpIGV =  this.Form.controls['importeigv'].value;

    if (Dsctoglobalporcentaje > 0){
      //  let valdetalles = this.detallesCompraForm.reduce((sum, data)=> (sum + data.value.valorVenta), 0);
        let dsctoglobalimporteActualizar = (importeValorVentaAct - dsctosunitarios ) * (Dsctoglobalporcentaje / 100);
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
    let icbper = detallesNoGratuitos.reduce((sum, value)=> (sum + value.importeicbper ?? 0 ), 0);
    this.Form.controls['importeicbper'].setValue(icbper);

    let importeotrostributosActualizar = (NoAnticipos.reduce((sum, value)=> (sum + value.importeotroscargos), 0) -  Anticipos.reduce((sum, value)=> (sum + value.importeotroscargos), 0))
    this.Form.controls['importeotrostributos'].setValue(importeotrostributosActualizar);


    let importevalorventaActualizar = this.Form.controls['importevalorventa'].value;
    // let importevalorventaActualizar = NoAnticipos.reduce((sum, value)=> (sum + value.baseimponible), 0) - Anticipos.reduce((sum, value) => (sum + value.baseimponible), 0) - Importedescuento
    // this.Form.controls['importevalorventa'].setValue(importevalorventaActualizar)
 
    let importeotrostributosActualizar2 = this.Form.controls['importeotrostributos'].value;
    let importetotalventaActualizar  = importevalorventaActualizar + Importeigvv + (importeotrostributosActualizar2 ?? 0) + Importeicbper - Importedescuento + Percepcion
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

    this.detallesCompraForm.forEach(det => {
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

    let SumImporteDescuento : number = this.detallesCompraForm.reduce((sum, data)=> (sum + data.value.importedescuento ?? 0 ), 0);
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
    
    this.onCalcularTotalCompra();
  }
 
  /* GRABAR COMPRA */
    onGrabar(){
      const dataform = this.Form.value; 
      let IDetalleCompra :any[] = this.onGrabarDetalleCompra();  
      let IDetalleCompraCMD :any = this.onGrabarDetalleCompraCMD();  
 
       const newOrdenCompra : ICreateOrdenCompra = {
         compraid: this.OrdenCompraEditar ? this.OrdenCompraEditar.compraid : 0,
         correlativomensual: this.OrdenCompraEditar ? this.OrdenCompraEditar.correlativomensual : 0,
         establecimientoid: dataform.establecimientoid.id,
         documentoid: dataform.documentoid.id,
         idproveedor: this.idProveedorSeleccionado,
         serieventa: dataform.serieventa,
         secuencialventa: dataform.secuencialventa,
         fechaemision:  this.formatoFecha.transform(dataform.fechaemision,ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),   
         condicionpagoid: dataform.condicionpagoid,
         nombrecliente: dataform.nombrecliente,
         direccioncliente: dataform.direccioncliente,
         monedaid: dataform.monedaid.id,
         tipocambio: dataform.tipocambio,
         diasvencimiento: dataform.diasvencimiento,
         fechavencimiento: this.formatoFecha.transform(dataform.fechavencimiento,ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),   
         glosa: dataform.glosa,
         estadoid: dataform.estadoid.id, 
         dsctoglobalimporte: -dataform.dsctoglobalimporte.toFixed(3),
         codtipooperacion: dataform.codtipooperacion,
         esdeduccionanticipo: dataform.esdeduccionanticipo,
         esafectodetraccion: dataform.esafectodetraccion, 
         esafectoretencion: false,
         motivonotaid: dataform.motivonotaid,
         esrecargoconsumo: this.OrdenCompraEditar ? this.OrdenCompraEditar.esrecargoconsumo : false,
         cantidadtotal: this.OrdenCompraEditar ? this.OrdenCompraEditar.cantidadtotal : 0,
         importeanticipo: +dataform.importeanticipo.toFixed(2),
         importedescuento: -dataform.importedescuento.toFixed(2),
         importevalorventa: +dataform.importevalorventa.toFixed(2),
         importeigv: +dataform.importeigv.toFixed(2),
         importeicbper: +dataform.importeicbper.toFixed(2),
         importeotrostributos: +dataform.importeotrostributos.toFixed(2),
         importetotalventa: +dataform.importetotalventa.toFixed(2),
         importepercepcion: dataform.importepercepcion,
         esordencompra: dataform.esordencompra,
         detalles: IDetalleCompra,
         documentoReferenciaDtos: [],
         idsToDelete: this.arrayDetallesEliminados,
         ordenCompraCmd: IDetalleCompraCMD
       } 

       console.log(newOrdenCompra);

      if(!this.OrdenCompraEditar){
        this.ocService.createOrdenCompra(newOrdenCompra).subscribe((resp) => {
          if(resp){
            this.swal.mensajePregunta("¿Quiere continuar con el registro?").then((response) => {
              if (response.isConfirmed) {
                this.onObtenerVentaPorId(resp, 'nuevo')
              }else{
                 this.cerrar.emit(true);
                this.swal.mensajeExito('Se grabaron los datos correctamente!.');
              }
            }) 
          } 
        });
      }else{
        this.ocService.updateOrdenCompra(newOrdenCompra).subscribe((resp) => {
          this.swal.mensajePregunta("¿Quiere seguir editando el registro?").then((response) => {
            if (response.isConfirmed) {
              this.onObtenerVentaPorId(newOrdenCompra.compraid, 'nuevo')
            }else{
               this.cerrar.emit(true);
              this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
            }
          })    
        });
      } 
    }


  onGrabarDetalleCompra(){
    this.arrayDetalleCompraGrabar = [];
  
      this.detallesCompraForm.forEach((element,i) => { 
        if(!element.value){
          this.swal.mensajeInformacion('Aquellos registros vacios no se insertaran en al registro.');
          return;
        }else{  
      
          this.arrayDetalleCompraGrabar.push({  
            compradetalleid :   element.value.compradetalleid,
            compraid : element.value.compraid,
            productoid: element.value.productoid,
            almacenid: element.value.almacenid.id,
            unidadmedidaid: element.value.unidadmedidaid.id, 
            codproductofinal: element.value.codproductofinal,
            descripcionproducto: element.value.descripcionproducto,
            cantidad :  element.value.cantidad,
            preciounitario : element.value.preciounitario,
            precioincluyeigv : element.value.precioincluyeigv,
            baseimponible:  element.value.baseimponible,
            tipoafectacionid : element.value.tipoafectacionid ? element.value.tipoafectacionid.id : null,
            porcentajedescuento:  element.value.porcentajedescuento,
            observaciones:  element.value.observaciones,
            importedescuento :  element.value.importedescuento,
            esanticipo : element.value.esanticipo, 
            valorventa : element.value.valorventa,
            igv :  element.value.igv,
            importeotroscargos:  element.value.importeotroscargos,
            precioventa :  element.value.precioventa,
            nrolote :  element.value.nroLote, 
            nroserie:  element.value.nroSerie, 
            fechavencimiento: this.formatoFecha.transform(element.value.fechavencimiento,ConstantesGenerales._FORMATO_FECHA_BUSQUEDA), 
            esGratuito : element.value.esGratuito,
            esGravada : element.value.esGravada, 
          });
        }
      })
      return  this.arrayDetalleCompraGrabar;
    }


    onGrabarDetalleCompraCMD(){
      this.arrayDetalleComraCMDGrabar = null;
      const dataform = this.Form.value;

      this.arrayDetalleComraCMDGrabar = {  
        ordencompraid : this.OrdenCompraEditar ? this.OrdenCompraEditar.ordencompraid : 0,
        estadoextraccionid : dataform.estadoid.id,
        formapagoid : dataform.formapagoid.id,
        areasolicitanteid : dataform.areasolicitanteid.id,
        tipoordencompraid : dataform.tipoordencompraid.id,
        notalugarentrega : dataform.notalugarentrega,
        notaanexos : dataform.notaanexos,
        notaobservaciones : dataform.notaobservaciones
      };

      return  this. arrayDetalleComraCMDGrabar;
    }
 
 
  
    onRegresar(){
      this.cerrar.emit(false);
    }
  

    onReporte(){
      this.dataReporte = this.OrdenCompraEditar
      this.VistaReporte = true;
    }
     
    onRetornar(){
      this.VistaReporte = false;
    }
  

    onCalculardiasVencimiento(){
      let f1x = this.formatoFecha.transform(this.Form.controls['fechaemision'].value, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA);
      let f2x = this.formatoFecha.transform(this.Form.controls['fechavencimiento'].value, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA);
      let fechaI = new Date(f1x);
      let fechaF = new Date(f2x); 
      let dias = Math.floor((fechaF.getTime() - fechaI.getTime()) / (1000 * 60 * 60 * 24)); 
      this.Form.controls['diasvencimiento'].setValue(dias);
    }
  
  
    onCalcularfechaVencimiento(event){
      let diasV = +event.target.value;
      let FV = new Date(this.Form.controls['fechaemision'].value);
      let NuevaFecha =  new Date(FV.setDate(FV.getDate() + diasV));
      this.Form.controls['fechavencimiento'].setValue(NuevaFecha);
    }
    
 


}