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
import { ICompraPorId, ICrearCompra } from '../interface/compras.interface';
import { ComprasService } from '../service/compras.service';

@Component({
  selector: 'app-nueva-compra',
  templateUrl: './nueva-compra.component.html',
  styleUrls: ['./nueva-compra.component.scss']
})
export class NuevaCompraComponent implements OnInit {


  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  public FlgLlenaronComboParaActualizar: Subject<boolean> = new Subject<boolean>();
  @Input() dataCompra : any;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  valorIGV : number = 0.18;
  fechaActual = new Date();
  tituloNuevaCompra: string ="NUEVA COMPRA";
  opcionesNuevaCompra: MenuItem[];
  Form : FormGroup; 
  CompraEditar : ICompraPorId; 
  dataReporte : any;
  estadoForm : string ="";
  es = ConstantesGenerales.ES_CALENDARIO;
  arrayDetalleCompraGrabar : any[] = []; 
  arrayDetalleDocumentoRefGrabar : any[] = [];
  arrayDetalleGuiaRemisionGrabar : any[]= []; 

 // arraySeriePorDocumento : ICombo[];
  arrayTipoDocumento : ICombo[];
  arrayTipoDocumentoPercepcion : ICombo[];
  arraySeriePorDocumentoPercepcion : ICombo[];
  arrayCondicionPago : ICombo[];
  arrayMonedas : ICombo[];
  arrayEstado : any[];
  arrayTipoOperacion : ICombo[];
  arrayEstablecimiento : ICombo[];
  arrayUnidadMedida : ICombo[];
  arrayAlmacen : ICombo[];
  arrayDestino : ICombo[];
  arrayMotivoNota : ICombo[];
  arrayCodigoDetraccion: ICombo[]; 
  
  idProveedorSeleccionado : number = 0;
  idEstablecimientoSeleccionado : number = 0;
  existenroRegsitro : boolean = false;
  existeDireccionCliente : boolean = false;
  existeProveedorSeleccionado : boolean = false;
  existeEstablecimientoSeleccionado : boolean = false; 
  mostrarTabsDocumentReferencia : boolean = true;
  mostrarbotoneliminarDetalle : boolean = false; 
  mostrarCamposAnticipo : boolean = false; 
  mostrarCamposDetraccion : boolean = false; 
  mostrarCamposPercepcion : boolean = false;  
  arrayDetallesEliminados: any[] =[]; 
  arrayDetallesGuiaRemisionEliminados: any[] =[];
  arrayDetallesDocumentoRefEliminados: any[] =[];
 
  modalBuscarPersona: boolean = false;
  modalBuscarProducto: boolean = false; 
  modalBuscarAnticipo: boolean = false; 
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
  GuiaRemisionForm : boolean = false;
  DocReferenciaForm : boolean = false;
  OtrosForm : boolean = false; 
  TotalesForm: boolean = false;  
  totalaPagar : number = 0;  

  dataPredeterminadosDesencryptada:any;

  constructor(
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
      { id: true,  nombre: 'ACTIVA'},
      { id: false, nombre: 'ANULADA'},
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
      tipocambio : new FormControl(null),
      condicionpagoid : new FormControl(null ,Validators.required),
      estadoid : new FormControl({ id: true, nombre: 'ACTIVA'}, Validators.required),
      glosa : new FormControl(null),
      codtipooperacion : new FormControl(null),
      motivonotaid: new FormControl(0),
      dsctoglobalrporcentaje: new FormControl(0),
      esafectodetraccion: new FormControl(false),
      fechadetraccion: new FormControl(this.fechaActual),
      esdeduccionanticipo: new FormControl(false), 
      nrodetraccion: new FormControl(null), 
      codigodetraccion: new FormControl(0),
      fechapercepcion:  new FormControl(this.fechaActual),
      porcentajedetraccion: new FormControl(null), 
      esafectopercepcion: new FormControl(false), 
      tipodocpercepcion: new FormControl(0), 
      seriepercepcion: new FormControl(null), 
      serialpercepcion : new FormControl(null), 
      importebasepercepcion: new FormControl(null), 
      porcentajepercepcion: new FormControl(null), 
      importepercepcion:new FormControl(null),  
      arrayDetalleCompra: new FormArray([]),
      arrayDetalleGuiaRemision:  new FormArray([]),
      arrayDetalleDocumentoRef:  new FormArray([]), 
      esafectoretencion : new FormControl(false), 
      esrecargoconsumo : new FormControl(false), 
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
      importegratuita: new FormControl(0)
     // conceptocontableid  : new FormControl(0)
    })
  }
  
  ngOnInit(): void { 
    this.onCargarDropdown();  

    if(this.dataCompra){ 
      this.spinner.show();
      this.tituloNuevaCompra = "EDITAR COMPRA"  
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
   

  onCargarDatosdeConfiguracion(){
    this.configService.listadoConfiguraciones().subscribe((resp) => {
      if(resp){
        this.dataConfiguracion = resp  
        this.Form.patchValue({  
          importeicbper :this.dataConfiguracion.porcentajebolsaplastica, 
          monedaid: this.arrayMonedas.find(
            (x) => x.id === this.dataConfiguracion.compramonedadefault
          ),   
          condicionpagoid: this.arrayCondicionPago.find(
            (x) => x.id === this.dataConfiguracion.compracondicionpagodefault
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
      esUsadoCompras : true
     }

    const obsDatos = forkJoin(
      this.generalService.listadoDocumentoPortipoParacombo(data),
      this.generalService.listadoCondicionPagoParaCombo(),
      this.generalService.listadoPorGrupo('Monedas'),
      this.generalService.listadoPorGrupo('TipoOperacionVenta'),
      this.generalService.listadoComboEstablecimientos(),
      this.generalService.listadoUnidadMedida(),
      this.generalService.listadoPorGrupo('DestinosCompras'),
      this.generalService.listadoPorGrupo('CodigoDetracciones'),
      this.generalService.listadoDocumentoPortipoParacombo(data),
    );
    obsDatos.subscribe((response) => {
      this.arrayTipoDocumento = response[0];
      this.arrayCondicionPago = response[1];
      this.arrayMonedas = response[2];
      this.arrayTipoOperacion = response[3];
      this.arrayEstablecimiento = response[4];
      this.arrayUnidadMedida = response[5];
      this.arrayDestino = response[6];
      this.arrayCodigoDetraccion = response[7];
      this.arrayTipoDocumentoPercepcion = response[8]; 
      this.FlgLlenaronCombo.next(true);
      if(!this.dataCompra){
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
          this.idEstablecimientoSeleccionado = +this.dataPredeterminadosDesencryptada.idEstablecimiento
          this.onObtenerEstablecimiento(+this.dataPredeterminadosDesencryptada.idEstablecimiento);
          this.onCargarAlmacenes(+this.dataPredeterminadosDesencryptada.idEstablecimiento); 
        }
      }
    });
  }

  Avisar() {
    this.FlgLlenaronCombo.subscribe((x) => {
      this.onObtenerVentaPorId(this.dataCompra.idCompra,'editar');
    });
  }

  onObtenerVentaPorId(idcompra : number, estado: string){ 
    this.comprasService.ComrpasPorId(idcompra).subscribe((resp)=>{ 
      if(resp){  
        this.CompraEditar = resp;
        this.idEstablecimientoSeleccionado = resp.establecimientoid;
      
        this.mostrarCamposDetraccion = this.CompraEditar.esafectodetraccion;
        this.mostrarCamposPercepcion = this.CompraEditar.esafectopercepcion;
  
        this.estadoForm = estado;
        this.idProveedorSeleccionado = resp.idproveedor; 
        let tipoDocumento = this.arrayTipoDocumento.find((x) => x.id === this.CompraEditar.documentoid) 
        this.onValidacionRequired(tipoDocumento);
        this.onObtenerTipoDocumento(tipoDocumento);    
        this.onCargarDropdownParaEditar(resp);
        this.AvisarParaActualizar();  
        this.totalaPagar = resp.importetotalventa
        this.existenroRegsitro = true; 
        this.spinner.hide(); 
      }  
      
    });
  }

  onCargarDropdownParaEditar(data:any){  
    const dataSeriePercepcion = {
      idestablecimiento : this.idEstablecimientoSeleccionado,
      tipodocumentoid : data.tipodocpercepcion  ?? 0
    }
 
    const obsDatos = forkJoin(
      this.generalService.listadoAlmacenesParams(data.establecimientoid),  
      this.generalService.listadoSeriePorDocumentocombo(dataSeriePercepcion),
    );
    obsDatos.subscribe((response) => {
      this.arrayAlmacen = response[0];  
      this.arraySeriePorDocumentoPercepcion = response[1]; 
      this.FlgLlenaronComboParaActualizar.next(true);
    });
  }

    AvisarParaActualizar(){
      this.FlgLlenaronComboParaActualizar.subscribe((x) => {
        this.onPintarCompraParaEditar();
      });
    }



  onPintarCompraParaEditar(){ 
    let tipoOperacionPintar = this.arrayTipoOperacion.find((x) => x.valor2 === this.CompraEditar.codtipooperacion)
    let seriePercepcionPintar = this.arraySeriePorDocumentoPercepcion.find((x) => x.valor1 === this.CompraEditar.seriepercepcion) 
 
    this.CompraEditar.motivonotaid = (this.CompraEditar.motivonotaid === -1 ? null : this.CompraEditar.motivonotaid) 
    if(this.CompraEditar.motivonotaid && this.CompraEditar.motivonotaid > 0){
      this.Form.patchValue({
        motivonotaid: this.arrayMotivoNota.find(
          (x) => x.id === this.CompraEditar.motivonotaid
        )
      })
    }
      
    if(seriePercepcionPintar){
      this.Form.patchValue({
        seriepercepcion :  this.arraySeriePorDocumentoPercepcion.find(
          (x) => x.id === seriePercepcionPintar.id ?? 0
        ),
      })
    }
  
    this.Form.patchValue({
      secuencialventa :  this.CompraEditar.secuencialventa,
      establecimientoid: this.arrayEstablecimiento.find(
        (x) => x.id === this.CompraEditar.establecimientoid
      ),
      documentoid: this.arrayTipoDocumento.find(
        (x) => x.id === this.CompraEditar.documentoid
      ),
      monedaid: this.arrayMonedas.find(
        (x) => x.id === this.CompraEditar.monedaid
      ),
      serieventa :  this.CompraEditar.serieventa,
      nrodocumentocliente: this.CompraEditar.nroDocumentoCliente,
      nombrecliente: this.CompraEditar.nombrecliente,
      direccioncliente: this.CompraEditar.direccioncliente,
      fechaemision: new Date(this.CompraEditar.fechaemision),
      fechavencimiento: new Date(this.CompraEditar.fechavencimiento),
      tipocambio: this.CompraEditar.tipocambio,
      condicionpagoid: this.arrayCondicionPago.find(
        (x) => x.id === this.CompraEditar.condicionpagoid
      ),
      estadoid: this.arrayEstado.find(
        (x) => x.id === this.CompraEditar.estadoid
      ),
      glosa: this.CompraEditar.glosa,
      codtipooperacion : this.arrayTipoOperacion.find(
        (x) => x.id === tipoOperacionPintar.id
      ), 
      dsctoglobalrporcentaje: this.CompraEditar.dsctoglobalrporcentaje ?? 0,
      esafectodetraccion: this.CompraEditar.esafectodetraccion,
      codigodetraccion: this.arrayCodigoDetraccion.find(
        (x) => x.id === +this.CompraEditar.codigodetraccion
      ),
      porcentajedetraccion: this.CompraEditar.porcentajedetraccion ?? 0,

  
      diasvencimiento: this.CompraEditar.diasvencimiento,
      dsctoglobalimporte : this.CompraEditar.dsctoglobalimporte ?? 0,
      importeanticipo : this.CompraEditar.importeanticipo ?? 0,
      importedescuento : this.CompraEditar.importedescuento ?? 0,
      importeicbper : this.CompraEditar.importeicbper ?? 0,
      importeigv : this.CompraEditar.importeigv ?? 0,
      importeotrostributos  : this.CompraEditar.importeotrostributos ?? 0,
      importetotalventa : this.CompraEditar.importetotalventa ?? 0,
      importevalorventa : this.CompraEditar.importevalorventa ?? 0,

      esafectopercepcion: this.CompraEditar.esafectopercepcion, 
      tipodocpercepcion :  this.arrayTipoDocumentoPercepcion.find(
        (x) => x.id === +this.CompraEditar.tipodocpercepcion
      ),
      fechapercepcion:  new Date(this.CompraEditar.fechapercepcion), 
      fechadetraccion:  new Date(this.CompraEditar.fechadetraccion), 
 
      serialpercepcion : this.CompraEditar.serialpercepcion,
      importebasepercepcion: this.CompraEditar.importebasepercepcion,
      porcentajepercepcion: this.CompraEditar.porcentajepercepcion,
      importepercepcion: this.CompraEditar.importepercepcion
     // conceptocontableid  : this.CompraEditar.conceptocontableid  
    })

 

    for( let  i = 0; i < this.CompraEditar.detalles.length; i++){
      if(this.estadoForm === 'editar'){
        this.onAgregarDetalleCompra();
      }
       
      this.detallesCompraForm[i].patchValue({
        almacenid: this.arrayAlmacen.find(
          (x) => x.id ===  this.CompraEditar.detalles[i].almacenid
        ),
        compradetalleid : this.CompraEditar.detalles[i].compradetalleid,
        ventadetallemigradaid: this.CompraEditar.detalles[i].ventadetallemigradaid,
        compraid :this.CompraEditar.detalles[i].compraid,
        codproductofinal : this.CompraEditar.detalles[i].codproductofinal ,
        productoid :this.CompraEditar.detalles[i].productoid,
        descripcionproducto : this.CompraEditar.detalles[i].descripcionproducto, 
        unidadmedidaid: this.arrayUnidadMedida.find(
          (x) => x.id ===  this.CompraEditar.detalles[i].unidadmedidaid
        ),
        cantidad : this.CompraEditar.detalles[i].cantidad,
        preciounitario : this.CompraEditar.detalles[i].preciounitario,
        precioincluyeigv :  this.CompraEditar.detalles[i].precioincluyeigv,
        baseimponible : this.CompraEditar.detalles[i].baseimponible,
        tipoafectacionid: this.arrayDestino.find(
          (x) => x.id ===  this.CompraEditar.detalles[i].tipoafectacionid
        ),
        porcentajedescuento : this.CompraEditar.detalles[i].porcentajedescuento,
        importedescuento: this.CompraEditar.detalles[i].importedescuento,
        observaciones:  this.CompraEditar.detalles[i].observaciones,
        valorventa: this.CompraEditar.detalles[i].valorventa,
        igv : this.CompraEditar.detalles[i].igv,
        importesotroscargos : this.CompraEditar.detalles[i].importeotroscargos,
        importeicbper : this.CompraEditar.detalles[i].importeicbper,
        precioventa : this.CompraEditar.detalles[i].precioventa,
        nrolote :  this.CompraEditar.detalles[i].nrolote,
        nroserie:  this.CompraEditar.detalles[i].nroserie,
        fechavencimiento:  new Date( this.CompraEditar.detalles[i].fechavencimiento),
        esanticipo:  this.CompraEditar.detalles[i].esanticipo,   
        valordetraccionmn: this.CompraEditar.detalles[i].valordetraccionmn,
        valordetraccionme:this.CompraEditar.detalles[i].valordetraccionme,  
        nrocuenta:this.CompraEditar.detalles[i].nrocuenta,  
      });
    }
  
    let SonGuiasRemision : any [] = [];
    let SonDocumentoRef : any [] = [];
     
    if(this.CompraEditar.documentoReferenciaDtos){
      this.CompraEditar.documentoReferenciaDtos.forEach(x => {
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
          compradocumentosreferenciaid: this.CompraEditar.documentoReferenciaDtos[i].compradocumentosreferenciaid,
          compraid : this.CompraEditar.documentoReferenciaDtos[i].compraid,
          idproveedor: this.CompraEditar.documentoReferenciaDtos[i].idproveedor,
          documentoid: this.CompraEditar.documentoReferenciaDtos[i].documentoid,
          serieguia : this.CompraEditar.documentoReferenciaDtos[i].seriereferencia,
          nroguia : this.CompraEditar.documentoReferenciaDtos[i].secuencialreferencia, 
          esgrm : this.CompraEditar.documentoReferenciaDtos[i].esgrm, 
        });
      }
    }

    if(SonDocumentoRef){
      for( let  i = 0; i < SonDocumentoRef.length; i++){
        if(this.estadoForm === 'editar'){
          this.onAgregarDetalleDocumentoRef();
        } 
        this.detallesDocumentoRef[i].patchValue({
          compradocumentosreferenciaid: this.CompraEditar.documentoReferenciaDtos[i].compradocumentosreferenciaid,
          compraid : this.CompraEditar.documentoReferenciaDtos[i].compraid,
          idproveedor: this.CompraEditar.documentoReferenciaDtos[i].idproveedor,
          documentoid: this.CompraEditar.documentoReferenciaDtos[i].documentoid,
          serieguia : this.CompraEditar.documentoReferenciaDtos[i].seriereferencia,
          nroguia : this.CompraEditar.documentoReferenciaDtos[i].secuencialreferencia, 
          esgrm : this.CompraEditar.documentoReferenciaDtos[i].esgrm,
          fechadocref : this.CompraEditar.documentoReferenciaDtos[i].fechadocref,
        });
      }
    }
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
    }
  }
 
  onObtenerTipoDocumentoPercepcion(event : any){ 
    if(event){ 
      this.onCargarDocumentoPorSeriePercepcion(event.id) 
    }else{ 
      this.arraySeriePorDocumentoPercepcion = [];
      this.Form.controls['serialpercepcion'].setValue(null);
    }
  }

  onCargarDocumentoPorSeriePercepcion(event : any){
    const data = {
      idestablecimiento : this.idEstablecimientoSeleccionado,
      tipodocumentoid : event
    } 
    this.generalService.listadoSeriePorDocumentocombo(data).subscribe((resp) => {
      if(resp){
        this.arraySeriePorDocumentoPercepcion = resp;
      }
    })
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
          productoid : resp[0].productoId,
          precioincluyeigv : resp[0].precioIncluyeIgv,
          esafectoicbper :resp[0].esAfectoICBPER,
          nroSerie: resp[0].serie === "0" ? null : resp[0].serie, 
          nroLote: resp[0].lote === "0" ? null : resp[0].lote, 
          esGravada : resp[0].precioIncluyeIgv,
          nrocuenta : resp[0].ctaCompra
        });
        this.onCalcularPrecioCompra(posicion)
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
      esGravada : event.data.precioIncluyeIgv,
      nrocuenta : event.data.ctaCompra
    });

    this.onCalcularPrecioCompra(event.posicion)
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
 

  /* REFERENCIAR DOCUMENTO */
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
    this.comprasService.referenciardocumentoRef(dataParams).subscribe((resp) => {
      if(resp){   
        this.detallesCompraForm.length = 0; 
        this.CompraEditar = resp
        for( let  i = 0; i < this.CompraEditar.detalles.length; i++){ 
          this.onAgregarDetalleCompra(); 
          this.detallesCompraForm[i].patchValue({ 
            compradetalleid : this.CompraEditar.detalles[i].compradetalleid, 
            compraid : this.CompraEditar.detalles[i].compraid, 
            productoid: this.CompraEditar.detalles[i].productoid,
            almacenid: this.arrayAlmacen.find(
              (x) => x.id ===  this.CompraEditar.detalles[i].almacenid
            ),
            unidadmedidaid: this.arrayUnidadMedida.find(
              (x) => x.id ===  this.CompraEditar.detalles[i].unidadmedidaid
            ),
            descripcionproducto : this.CompraEditar.detalles[i].descripcionproducto,  
            cantidad : this.CompraEditar.detalles[i].cantidad, 
            preciounitario : this.CompraEditar.detalles[i].preciounitario,
            precioincluyeigv :  this.CompraEditar.detalles[i].precioincluyeigv,
            baseimponible : this.CompraEditar.detalles[i].baseimponible, 
            tipoafectacionid: this.arrayDestino.find(
              (x) => x.id ===  this.CompraEditar.detalles[i].tipoafectacionid
            ),
            porcentajedescuento : this.CompraEditar.detalles[i].porcentajedescuento,
            importedescuento: this.CompraEditar.detalles[i].importedescuento,
            observaciones:  this.CompraEditar.detalles[i].observaciones,
            esanticipo:  this.CompraEditar.detalles[i].esanticipo, 
            valorventa: this.CompraEditar.detalles[i].valorventa,
            igv : this.CompraEditar.detalles[i].igv,
            importeotroscargos : this.CompraEditar.detalles[i].importeotroscargos,
            importeicbper : this.CompraEditar.detalles[i].importeicbper,
            precioventa : this.CompraEditar.detalles[i].precioventa,
            nrolote:  this.CompraEditar.detalles[i].nrolote,
            nroserie: this.CompraEditar.detalles[i].nroserie,
            fechavencimiento:  new Date(this.CompraEditar.detalles[i].fechavencimiento), 
            valordetraccionmn: this.CompraEditar.detalles[i].valordetraccionmn,
            valordetraccionme: this.CompraEditar.detalles[i].valordetraccionme, 
          });
        }
        this.swal.mensajeExito('El documento ha sido referenciado correctamente!.');
        this.onCalcularTotalCompra();
      }
    })
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
        valordetraccionmn: new  FormControl(0),
        valordetraccionme: new  FormControl(0), 
        esInafecto : new  FormControl(false),
        esGratuito: new  FormControl(false),
        esGravada: new  FormControl(false),
        nrocuenta: new  FormControl(null)
    })
  }

  onEliminarDetalleCompra(index : any, compradetalleid : any){
    if(compradetalleid === 0){
      this.fa.removeAt(index);
      this.cdr.detectChanges();  
      if(this.detallesCompraForm.length === 0){
        this.totalaPagar = 0
      }
    } else{
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

   /* AGREGAR DETALLE GUIA REMISION */
   get fadgr() { return this.Form.get('arrayDetalleGuiaRemision') as FormArray; }
   get detallesGuiaRemision() { return this.fadgr.controls as FormGroup[]; }

   onAgregarDetalleGuiaRemision(){
     this.detallesGuiaRemision.push(this.AddDetalleGR());
   }

   AddDetalleGR(){
     return this.fb.group({
      compradocumentosreferenciaid: new FormControl(0),
      compraid : new FormControl(0),
      idproveedor: new FormControl(null),
      documentoid: new FormControl(null),
      serieguia: new FormControl(null),
      nroguia : new  FormControl(null),
      esgrm : new  FormControl(true),
     })
   }

   onEliminarDetalleGuiaRemision(index : any, compradocumentosreferenciaid : any){  
     if(compradocumentosreferenciaid === 0){
       this.fadgr.removeAt(index);
       this.cdr.detectChanges();
     } else{
       this.swal.mensajePregunta("¿Seguro que desea eliminar el detalle.?").then((response) => {
         if (response.isConfirmed) {
           this.arrayDetallesGuiaRemisionEliminados.push(compradocumentosreferenciaid);
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
      compradocumentosreferenciaid: new FormControl(0),
      compraid : new FormControl(0),
      idproveedor: new FormControl(null),
      documentoid: new FormControl(null),
      serieguia : new  FormControl(null),
      nroguia : new  FormControl(null),
      fechadocref : new  FormControl(this.fechaActual),
      esgrm : new  FormControl(false),
     })
   }

   onEliminarDetalleDocumentoRef(index : any, ventadocumentosreferenciaid : any){
     if(ventadocumentosreferenciaid === 0){
       this.fadref.removeAt(index);
       this.cdr.detectChanges();
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



  /* Habilitar Campos Anticipo */
  onHabilitarCamposAnticipo(){ 
    this.mostrarCamposAnticipo = !this.mostrarCamposAnticipo 
  }

  /* Habilitar Campos Detraccion */
  onHabilitarCamposDetraccion(){ 
    this.mostrarCamposDetraccion = !this.mostrarCamposDetraccion; 
    this.onCalcularDetraccion();
  }
 
  /* Habilitar Campos Detraccion */
  onHabilitarCamposPercepcion(){ 
    this.mostrarCamposPercepcion = !this.mostrarCamposPercepcion     
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
        precioincluyeigv : true
      });
    } 

  }

  onCalcularPrecioCompra(posicion : number){ 
    const DataForm = (this.Form.get('arrayDetalleCompra') as FormArray).at(posicion).value; 

    if (!DataForm.esGravada) this.detallesCompraForm[posicion].controls['precioincluyeigv'].setValue(false);
    let preciosinigv = DataForm.precioincluyeigv ? (+DataForm.preciounitario / (1 +this.valorIGV)) : +DataForm.preciounitario; 
    let biActualizar  = DataForm.cantidad * preciosinigv;
    this.detallesCompraForm[posicion].controls['baseimponible'].setValue(biActualizar)
 
    let impd = (DataForm.porcentajedescuento > 0) ?  (biActualizar *  ( DataForm.porcentajedescuento / 100)) : 0
    this.detallesCompraForm[posicion].controls['importedescuento'].setValue(impd);

    let vVenta = (biActualizar - DataForm.importedescuento);
    this.detallesCompraForm[posicion].controls['valorVenta'].setValue(vVenta)

    let igvAct =  DataForm.esGravada ? ( vVenta * this.valorIGV) : 0
    this.detallesCompraForm[posicion].controls['igv'].setValue(igvAct);
   
    let precioventaAct = (+vVenta + igvAct + DataForm.importesotroscargos); 
    this.detallesCompraForm[posicion].controls['precioventa'].setValue(precioventaAct)
  
    if(this.mostrarCamposDetraccion) {
      this.onCalcularDetraccion();
    }

    this.onCalcularTotalCompra();
  }

  onCalcularDetraccion(){
    // this.Form.patchValue({
    //   porcentajedetraccion : 9, 
    // });

    let TCambio = this.Form.controls['tipocambio'].value ?? 1; 
    let Moneda = this.Form.controls['monedaid'].value
    let Dsctoglobalporcentaje  = (this.Form.controls['porcentajedetraccion'].value / 100);

    for( let  i = 0; i < this.detallesCompraForm.length; i++){  
      let PVenta = (this.Form.get('arrayDetalleCompra') as FormArray).at(i).value.precioventa;

      if(Moneda.id === 1){
        let PCompra = PVenta * Dsctoglobalporcentaje 
        this.detallesCompraForm[i].patchValue({
          valordetraccionmn : PCompra, 
        });
  
        let VDetraccionAct : number = (this.Form.get('arrayDetalleCompra') as FormArray).at(i).value.valordetraccionmn;
        let VaorAct = (VDetraccionAct ?? 1 ) / TCambio
  
        this.detallesCompraForm[i].patchValue({
          valordetraccionme : VaorAct, 
        });
      }
  
      if(Moneda.id === 2){
        let PCompra = PVenta * Dsctoglobalporcentaje 
        this.detallesCompraForm[i].patchValue({
          valordetraccionme : PCompra, 
        });
  
        let VDetraccionAct : number = (this.Form.get('arrayDetalleCompra') as FormArray).at(i).value.valordetraccionme;
        let VaorAct = (VDetraccionAct ?? 1 ) / TCambio
  
        this.detallesCompraForm[i].patchValue({
          valordetraccionmn : VaorAct, 
        });
      } 
    }

    this.onCalcularTotalCompra();
  }


  onCalcularTotalCompra(){  
    const DataForm = this.Form.value;
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
    
    let ipAct = DataForm.esafectopercepcion ? (DataForm.importebasepercepcion * (DataForm.porcentajepercepcion / 100)) : 0
    this.Form.controls['importepercepcion'].setValue(ipAct) 
  
    let Percepcion = !DataForm.esafectopercepcion ? 0 : ipAct;

    //* SUMAMOS LOS IMPORTES ICBPER
    let importeanticipoAct = Anticipos.reduce((sum, value)=> (sum + value.precioventa), 0)
    this.Form.controls['importeanticipo'].setValue(importeanticipoAct)
 
    let importeValorVentaAct = NoAnticipos.reduce((sum, value)=> (sum + value.baseimponible), 0) - Anticipos.reduce((sum, value) => (sum + value.baseimponible), 0)
    this.Form.controls['importevalorventa'].setValue(importeValorVentaAct)
 
    let dsctosunitarios = NoAnticipos.reduce((sum, value)=> (sum + value.importedescuento ?? 0), 0);

    let importeigvAct = NoAnticipos.reduce((sum, value)=> (sum + value.igv ?? 0), 0) -  Anticipos.reduce((sum, value)=> (sum + value.igv ?? 0 ), 0)
    this.Form.controls['importeigv'].setValue(importeigvAct)

    let ImpIGV = importeigvAct;
    if (DataForm.dsctoglobalrporcentaje > 0){ 
        let dsctoglobalimporteActualizar = (importeValorVentaAct - dsctosunitarios ) * (DataForm.dsctoglobalrporcentaje / 100);
        ImpIGV -= (ImpIGV) * ((DataForm.dsctoglobalrporcentaje ?? 1) / 100);
        this.Form.controls['dsctoglobalimporte'].setValue(dsctoglobalimporteActualizar)
        this.Form.controls['importeigv'].setValue(ImpIGV)
    }else{
      this.Form.controls['dsctoglobalimporte'].setValue(0);
    }
 
    let importedescuentoActualizar = (DataForm.dsctoglobalimporte ?? 0 ) + dsctosunitarios;
    this.Form.controls['importedescuento'].setValue(importedescuentoActualizar);

    let Importedescuento = this.Form.controls['importedescuento'].value;
    let icbper = detallesNoGratuitos.reduce((sum, value)=> (sum + value.importeicbper ?? 0 ), 0);
    this.Form.controls['importeicbper'].setValue(icbper);

    let importeotrostributosActualizar = (NoAnticipos.reduce((sum, value)=> (sum + value.importeotroscargos), 0) -  Anticipos.reduce((sum, value)=> (sum + value.importeotroscargos), 0))
    this.Form.controls['importeotrostributos'].setValue(importeotrostributosActualizar);
  
    let importetotalventaActualizar  = importeValorVentaAct + ImpIGV + (importeotrostributosActualizar ?? 0) + icbper - Importedescuento + Percepcion
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
    let convertirNumero =  dsctoglobalporcentaje;
    this.Form.controls['dsctoglobalrporcentaje'].setValue(+convertirNumero);
    
    this.onCalcularTotalCompra();
  }

 
  /* GRABAR COMPRA */
    onGrabar(){
      const dataform = this.Form.value; 
      let IDetalleCompra :any[] = this.onGrabarDetalleCompra(); 
      let IDocumentoReferenciaDTO :any[] = this.onGrabarDetalleDocumentoRef();
        
       const newCompra : ICrearCompra = {
        compraid : this.CompraEditar ? this.CompraEditar.compraid : 0,
        correlativomensual: this.CompraEditar ? this.CompraEditar.correlativomensual :  0,
        establecimientoid: dataform.establecimientoid.id,
        documentoid : dataform.documentoid.id,
        idproveedor : this.idProveedorSeleccionado, 
        serieventa : dataform.serieventa,
        secuencialventa : dataform.secuencialventa,
        fechaemision: this.formatoFecha.transform(dataform.fechaemision, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
        condicionpagoid: dataform.condicionpagoid.id,
        nombrecliente :  dataform.nombrecliente,
        direccioncliente :  dataform.direccioncliente,
        monedaid: dataform.monedaid.id,
        tipocambio : dataform.tipocambio,
        diasvencimiento  :dataform.diasvencimiento,
        fechavencimiento:  this.formatoFecha.transform(dataform.fechavencimiento, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA), 
        glosa :  dataform.glosa, 
        estadoid : dataform.estadoid.id,
        dsctoglobalrporcentaje: dataform.dsctoglobalrporcentaje,
        dsctoglobalimporte: -dataform.dsctoglobalimporte.toFixed(3),
        codtipooperacion: "0101",
        esdeduccionanticipo: dataform.esdeduccionanticipo,
        esafectodetraccion: dataform.esafectodetraccion,
        codigodetraccion :  dataform.codigodetraccion ? dataform.codigodetraccion.id : null,
        porcentajedetraccion : dataform.porcentajedetraccion,
        nrodetraccion: dataform.nrodetraccion,
        fechadetraccion : this.formatoFecha.transform(dataform.fechadetraccion, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),   
        esafectoretencion : false,
        motivonotaid: dataform.motivonotaid.id,  
        esrecargoconsumo :this.CompraEditar ? this.CompraEditar.esrecargoconsumo :  false,
        cantidadtotal : this.CompraEditar ? this.CompraEditar.cantidadtotal : 0,
        importeanticipo : +dataform.importeanticipo,
        importedescuento : -dataform.importedescuento, 
        importevalorventa : +dataform.importevalorventa, 
        importeigv :  +dataform.importeigv, 
        importeicbper : +dataform.importeicbper, 
        importeotrostributos: +dataform.importeotrostributos,  
        importetotalventa : +dataform.importetotalventa,   
        idauditoria : this.CompraEditar ? this.CompraEditar.idauditoria : 0, 
        esafectopercepcion: dataform.esafectopercepcion,
        tipodocpercepcion: dataform.tipodocpercepcion ? dataform.tipodocpercepcion.id : null,
        fechapercepcion: this.formatoFecha.transform(dataform.fechapercepcion, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),  
        seriepercepcion: dataform.seriepercepcion ? dataform.seriepercepcion.valor1 : '',
        serialpercepcion : dataform.serialpercepcion,
        importebasepercepcion: dataform.importebasepercepcion,
        porcentajepercepcion: dataform.porcentajepercepcion,
        importepercepcion: dataform.importepercepcion,
        detalles : IDetalleCompra,
        documentoReferenciaDtos: IDocumentoReferenciaDTO,
        idsToDelete : this.arrayDetallesEliminados
        //conceptocontableid  : dataform.conceptocontableid  
       } 

       console.log(newCompra);

      if(!this.CompraEditar){
        this.comprasService.createCompra(newCompra).subscribe((resp) => {
          if(resp){
            this.swal.mensajePregunta("¿Quiere continuar con el registro?").then((response) => {
              if (response.isConfirmed) {
                this.onObtenerVentaPorId(resp, 'nuevo')
              }else{
                this.onVolver();
                this.swal.mensajeExito('Los cambios se grabaron correctamente!.')    
              }
            })   
          } 
        });
      }else{
        this.comprasService.updateCompra(newCompra).subscribe((resp) => {
          this.swal.mensajePregunta("¿Quiere seguir editando el registro?").then((response) => {
            if (response.isConfirmed) {
              this.onObtenerVentaPorId(newCompra.compraid, 'nuevo')
            }else{
              this.swal.mensajeExito('Se actualizaron los datos correctamente!.');  
              this.onVolver();
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
            tipoafectacionid : element.value.tipoafectacionid.id,
            porcentajedescuento:  element.value.porcentajedescuento,
            observaciones:  element.value.observaciones,
            importedescuento :  element.value.importedescuento,
            valorventa : element.value.valorVenta,
            igv :  element.value.igv,
            importeotroscargos:  element.value.importeotroscargos,
            precioventa :  element.value.precioventa,
            nrolote :  element.value.nroLote, 
            nroserie:  element.value.nroSerie, 
            fechavencimiento:  this.formatoFecha.transform(element.value.fechavencimiento, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),   
            valordetraccionmn: element.value.valordetraccionmn, 
            valordetraccionme: element.value.valordetraccionme, 
            esGratuito : element.value.esGratuito,
            esGravada : element.value.esGravada, 
            nrocuenta : element.value.nrocuenta 
          });
        }
      })
      return  this.arrayDetalleCompraGrabar;
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
              compradocumentosreferenciaid: element.value.compradocumentosreferenciaid,
              compraid :element.value.compraid,
              idproveedor :element.value.idproveedor,
              documentoid :element.value.documentoid.id,
              fechadocref : this.formatoFecha.transform(element.value.fechadocref, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),  
              serieguia: element.value.seriereferencia,
              nroguia : element.value.secuencialreferencia ,
              esgrm : element.value.esgrm

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
              compradocumentosreferenciaid: element.value.compradocumentosreferenciaid,
              compraid :element.value.compraid,
              idproveedor :element.value.idproveedor,
              documentoid :element.value.documentoid,
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
 
    onCalcularPercepcion(){ 
      let importe = this.Form.controls['importebasepercepcion'].value
      let porcentaje = this.Form.controls['porcentajepercepcion'].value
      let newimportePercepcion = (+importe * (porcentaje / 100))
      this.Form.controls['importepercepcion'].setValue(newimportePercepcion);
      
      this.onCalcularTotalCompra();
    }
 
    onVolver(){
      this.cerrar.emit('exito');
    }
  
    onRegresar(){
      this.cerrar.emit(false);
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
