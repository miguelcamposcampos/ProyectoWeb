import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { forkJoin, Subject } from 'rxjs';
import { VentasService } from 'src/app/modulos/home/ventas/v-procesos/ventas/service/venta.service';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { TransportistaService } from '../../../a-mantenimientos/transportistas/service/transportista.service';
import { ICrearGuiasRemision, IGuiaDetalle, IGuiaRemisionPorId } from '../interface/guiasremision.interface';
import { GuiaRemisionService } from '../service/guiaremision.service';

@Component({
  selector: 'app-nueva-guia-remision',
  templateUrl: './nueva-guia-remision.component.html',
  styleUrls: ['./nueva-guia-remision.component.scss']
})
export class NuevaGuiaRemisionComponent implements OnInit {

  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  public FlgLlenaronComboParaActualizar: Subject<boolean> = new Subject<boolean>();
  @Input() dataGuia! : any;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  tituloNuevoguiaRemision : string = "NUEVO GUIA REMISION";
  mostrarBotonReportes : boolean = false;
  existenroGuiaRemision : boolean = false; 
  bloquearComboEstablecimiento : boolean = false;
  VistaReporte : boolean = false;  
  /* MODALES */
  modalBuscarPersona : boolean = false;
  modalBuscarProducto : boolean = false;
  modalBuscarTransportista : boolean = false; 
  modalBuscarUbigeo : boolean =false; 
  /* TABS */
  datosFormulario : boolean = true;
  datosFormulario2 : boolean = false; 

  idEstablecimientoSeleccionado : number = 0; 
  idTransportistaSeleccionado : number = 0;
  idChoferSeleccionado : number = 0;
  idGuaiRemisionQueRetorna : number = 0;
  idClienteSelccionado : number = 0;
  idUndTransporteSeleccionado : number = 0;

  /* COMBOS */
  arrayMonedas : ICombo[];
  arrayModalidad : ICombo[];  
  arrayMotivo : ICombo[];  
  arrayUnidadesMedida : ICombo[];
  arrayEstablecimiento : ICombo[];
  arraySeries : ICombo[];
  arraySeriePorDocumento : ICombo[];
  arrayDetalleGrabar : IGuiaDetalle[] = [];
  arrayTGuia : ICombo[];
  arrayChofercombo: ICombo[];
  arrayPlacaCombo : ICombo[];
  arrayAlmacenes : ICombo[];
  GuiaRemisionEditar : IGuiaRemisionPorId;
  Form: FormGroup;
  arrayDetallesEliminados: any[] =[];
  items: MenuItem[];
  activeItem: MenuItem;
  es : any = ConstantesGenerales.ES_CALENDARIO;
  estadoForm : string ="";

  dataUbigeo : any
  dataProductos :any;
  dataReporte : any;
  fechaActual = new Date; 


  ubigeoParaMostrar : string ="";
  ubigeoParaMostrarLlegada : string ="";
  dataPredeterminadosDesencryptada = JSON.parse(localStorage.getItem('Predeterminados')); 

  constructor(
    private guiaRemisionService : GuiaRemisionService,
    private generalService : GeneralService,
    private ventaService : VentasService,
    private transportistaService : TransportistaService,
    private swal : MensajesSwalService,
    private fb : FormBuilder,
    private primengConfig : PrimeNGConfig,
    private cdr: ChangeDetectorRef,
    private formatoFecha : DatePipe,
    private spinner : NgxSpinnerService
  ) {  
    this.builform();
  }

  public builform(): void{
    this.Form = this.fb.group({
      activo: new FormControl(true, Validators.required),
      establecimiento: new FormControl(null, Validators.required),
      moneda: new FormControl(null, Validators.required), 
      tipoguia: new FormControl(null, Validators.required), 
      serieguia : new FormControl(null),
      sencuencialguia : new FormControl(0),
      docReferencia: new FormControl(null),
      seriedocref : new FormControl(null),
      secuencialref : new FormControl(null),

      fechaEmision: new FormControl(new Date, Validators.required), 
      tipoCambio: new FormControl(null, Validators.required), 
      fechaTraslado: new FormControl(new Date, Validators.required), 

      ordenCompra: new FormControl(null), 
      nroPedCot: new FormControl(null), 
      modalidad: new FormControl(null, Validators.required), 
      motivo: new FormControl(null, Validators.required), 

      puntoPartida: new FormControl(null, Validators.required), 
      ubigeoPartida: new FormControl(null, Validators.required), 
      puntoLlegada: new FormControl(null, Validators.required), 
      ubigeoLlegada: new FormControl(null, Validators.required),
      
      observacion : new FormControl(null),
      
      rucCliente: new FormControl(null, Validators.required), 
      codigoCliente: new FormControl(null, Validators.required), 
      razonSocialCliente: new FormControl(null, Validators.required), 

      rucTransportista: new FormControl(null, Validators.required),
      codigoTransportista: new FormControl(null, Validators.required), 
      razonSocialTransportista: new FormControl(null, Validators.required), 

      placa: new FormControl(null), 
      marca: new FormControl(null), 
      certificado: new FormControl(null),

      chofer: new FormControl(null), 
      brevete: new FormControl(null),  

      arrayDetalles: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.primengConfig.setTranslation(this.es);
    this.onCargarDropdown();  
    if(this.dataGuia){
      this.spinner.show();
      this.Avisar();
      this.tituloNuevoguiaRemision ="EDITAR GUIA REMISION";  
    } 
    this.onTabsForm();
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
    const data={ 
     esGuiaRemision : true
    }
    const obsDatos = forkJoin(  
      this.generalService.listadoPorGrupo('Monedas'), 
      this.generalService.listadoPorGrupo('GRMModalidad'), 
      this.generalService.listadoPorGrupo('MotivosSalidas'), 
      this.generalService.listadoUnidadMedida(), 
      this.generalService.listadoComboEstablecimientos(),
      this.generalService.listadoComboSerie(), 
      this.generalService.listadoDocumentoPortipoParacombo(data)

    );
    obsDatos.subscribe((response) => {
      this.arrayMonedas = response[0];
      this.arrayModalidad = response[1];  
      this.arrayMotivo = response[2]; 
      this.arrayUnidadesMedida = response[3];
      this.arrayEstablecimiento = response[4];  
      this.arraySeries = response[5]; 
      this.arrayTGuia = response[6]; 
      this.FlgLlenaronCombo.next(true);  
      if(!this.dataGuia){
        this.onCargarTipoCambio(); 
        if(this.dataPredeterminadosDesencryptada){ 
          this.Form.patchValue({
            establecimiento: this.arrayEstablecimiento.find(
              (x) => x.id ===   +this.dataPredeterminadosDesencryptada.idEstablecimiento
            )
          })
          this.idEstablecimientoSeleccionado =  +this.dataPredeterminadosDesencryptada.idEstablecimiento;
          this.onAlmacenesPorId(+this.dataPredeterminadosDesencryptada.idEstablecimiento)
        }
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }
 

  onBuscarProductoPorCodigo(posicion: any){
    let codProductoaBuscar = (this.Form.get('arrayDetalles') as FormArray).at(posicion).value.codigoProducto;
    const data = {
      periodo : this.fechaActual.getFullYear(),
      criteriodescripcion : codProductoaBuscar
    }
    this.spinner.show();
    this.generalService.BuscarProductoPorCodigo(data).subscribe((resp) => { 
      console.log(resp);
      if(resp[0]){
        this.detallesForm[posicion].patchValue({
          codigoProducto:  resp[0].codProducto,
          descripcion: resp[0].nombreProducto,
          unidadMedida: this.arrayUnidadesMedida.find(
            (x) => x.id ===   resp[0].unidadMedidaId
          ), 
          productoid : resp[0].productoId,
          esafectoicbper :resp[0].esAfectoICBPER,
          nroSerie: resp[0].serie === "0" ? null : resp[0].serie, 
          nroLote: resp[0].lote === "0" ? null : resp[0].lote,  
        });
      }else{
        this.swal.mensajeAdvertencia('no se encontraron datos con el codigo ingresado.');
      }
      this.spinner.hide();
    },error => { 
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);  
    });
  }
  

  onCargarDropdownParaEditar(data :any){
    const dataParams = {
      idestablecimiento : data.establecimientoid,
      tipodocumentoid : data.tipodocumentoid
    } 


    const obsDatos = forkJoin(     
      this.generalService.listarChoferCombo(data.transportistaid),
      this.generalService.listarUndTransporteCombo(data.transportistaid),
      this.generalService.listadoAlmacenesParams(data.establecimientoid),
      this.generalService.listadoSeriePorDocumentocombo(dataParams)
    );
    obsDatos.subscribe((response) => { 
      this.arrayChofercombo = response[0];  
      this.arrayPlacaCombo = response[1]; 
      this.arrayAlmacenes = response[2]; 
      this.arraySeriePorDocumento = response[3]; 
      this.FlgLlenaronComboParaActualizar.next(true); 
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }



  onObtenerEstablecimiento(event : any){ 
    if(event){
      this.idEstablecimientoSeleccionado = event.value.id
      this.onAlmacenesPorId(this.idEstablecimientoSeleccionado)
    }
  }

  onAlmacenesPorId(event: number){
    this.generalService.listadoAlmacenesParams(event).subscribe((resp) =>{
      if(resp){ 
        this.arrayAlmacenes = resp;
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }


  onObtenerTguia(event: any){ 
    if(event){
      const data = {
        idestablecimiento : this.idEstablecimientoSeleccionado,
        tipodocumentoid : event.value.id, 
      } 
      this.onListarDocumentosParams(data);
    } 
  }

  onListarDocumentosParams(event:any){
    this.generalService.listadoSeriePorDocumentocombo(event).subscribe((resp) => {
      if(resp){
        this.arraySeriePorDocumento = resp;
      } 
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  onObtenerDocReferencia(event : any){
    console.log(event.value);
    if(event.value){
      this.Form.patchValue({
        docReferencia: this.arraySeries.find(
          (x) => x.id === event.value.id
        )
      })
    }else{
      this.Form.controls['docReferencia'].setValue(null);
    }
  }

  Avisar(){
    this.FlgLlenaronCombo.subscribe((x) => {
      this.onObtenerguiaRemisionPorId(this.dataGuia.id, 'editar'); 
    });
  }
 
  AvisarParaActualizar(){
    this.FlgLlenaronComboParaActualizar.subscribe((x) => {
      this.onPintarDataFormulario();
    });
  }
 

  onObtenerguiaRemisionPorId(guiaremisionid: number, estado : string){    
    this.estadoForm = estado;

    this.spinner.show();
    this.guiaRemisionService.guiaRemisionPorId(guiaremisionid).subscribe((resp) => {
      this.onCargarDropdownParaEditar(resp)
      if(resp){   
        this.AvisarParaActualizar();
        this.existenroGuiaRemision = true;
        this.mostrarBotonReportes = true;
        this.GuiaRemisionEditar = resp;  
        this.spinner.hide();  
      } 
    },error => { 
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  onPintarDataFormulario(){ 
    this.Form.controls['serieguia'].setValue(this.GuiaRemisionEditar.serieguia);
    let serieguiaEditar = this.arraySeriePorDocumento.find(x => x.valor1 === this.GuiaRemisionEditar.serieguia)
      this.Form.patchValue({
        activo : this.GuiaRemisionEditar.estadoid,
        fechaEmision: new Date(this.GuiaRemisionEditar.fechaemision),
        fechaTraslado: new Date(this.GuiaRemisionEditar.fechatraslado),
        establecimiento: this.arrayEstablecimiento.find(
          (x) => x.id === this.GuiaRemisionEditar.establecimientoid
        ),
        moneda: this.arrayMonedas.find(
          (x) => x.id === this.GuiaRemisionEditar.monedaid
        ),
        motivo: this.arrayMotivo.find(
          (x) => x.id === this.GuiaRemisionEditar.motivoid
        ),
        tipoguia: this.arrayTGuia.find(
          (x) => x.id === this.GuiaRemisionEditar.tipodocumentoid
        ),
        serieguia: this.arraySeriePorDocumento.find(
          (x) => x.id === serieguiaEditar.id
        ),

        sencuencialguia: this.GuiaRemisionEditar.secuencialguia,
        docReferencia: this.arraySeries.find(
          (x) => x.id === this.GuiaRemisionEditar.tipodocumentoidref
        ), 
        seriedocref: this.GuiaRemisionEditar.seriedocumentoref,
        secuencialref: this.GuiaRemisionEditar.secuencialref,

        tipoCambio: this.GuiaRemisionEditar.tipocambio,

        ordenCompra: this.GuiaRemisionEditar.ordencompra,
        nroPedCot: this.GuiaRemisionEditar.pedidocot,

        modalidad: this.arrayModalidad.find(
          (x) => x.id === this.GuiaRemisionEditar.modalidadid
        ),
        puntoPartida: this.GuiaRemisionEditar.partidadireccion,
        ubigeoPartida: this.GuiaRemisionEditar.partidaubigeo,
        puntoLlegada: this.GuiaRemisionEditar.llegadadireccion,
        ubigeoLlegada: this.GuiaRemisionEditar.llegadaubigeo,
        observacion: this.GuiaRemisionEditar.observacion,

        rucCliente: this.GuiaRemisionEditar.rucCliente,
        codigoCliente: this.GuiaRemisionEditar.codCliente,
        razonSocialCliente: this.GuiaRemisionEditar.nombreCliente,

      
        placa: this.arrayPlacaCombo.find(
            (x) => x.id === this.GuiaRemisionEditar.transportistaunidadid
        ),  

        rucTransportista: this.GuiaRemisionEditar.rucTransportista,
        codigoTransportista: this.GuiaRemisionEditar.codigoTransportista,
        razonSocialTransportista: this.GuiaRemisionEditar.nombreTransportista, 
        
        chofer: this.arrayChofercombo.find(
        (x) => x.id === this.GuiaRemisionEditar.transportistachoferid
        ),  

        marca: this.GuiaRemisionEditar.marcaPlacaUT,
        certificado: this.GuiaRemisionEditar.certificadoUT,
        brevete: this.GuiaRemisionEditar.breveteChofer,


      }) 
      
      for( let  i = 0; i < this.GuiaRemisionEditar.detalles.length; i++){ 
        if(this.estadoForm === 'editar'){
          this.onAgregarDetalle(); 
        }

        this.detallesForm[i].patchValue({ 
          almacen: this.arrayAlmacenes.find(
            (x) => x.id ===  this.GuiaRemisionEditar.detalles[i].almacenid
          ),   

          bultos: this.GuiaRemisionEditar.detalles[i].bultos,
          cantidad: this.GuiaRemisionEditar.detalles[i].cantidad,
          codigoProducto : this.GuiaRemisionEditar.detalles[i].codproductofinal,
          descripcion : this.GuiaRemisionEditar.detalles[i].descripcionproductofinal, 
          guiaremisiondetalleid: this.GuiaRemisionEditar.detalles[i].guiaremisiondetalleid,
          guiaremisionid: this.GuiaRemisionEditar.detalles[i].guiaremisionid,
          pesoTotal:  this.GuiaRemisionEditar.detalles[i].pesototal,
          pesoUnitario:  this.GuiaRemisionEditar.detalles[i].pesounitario, 
          precioUnitario:  this.GuiaRemisionEditar.detalles[i].preciounitario, 
          productoid :  this.GuiaRemisionEditar.detalles[i].productoid,
          idauditoria : this.GuiaRemisionEditar.detalles[i].idauditoria,
          unidadMedida: this.arrayUnidadesMedida.find(
            (x) => x.id ===  this.GuiaRemisionEditar.detalles[i].unidadmedidaid
          ),   
        }); 
      } 
  }



  onTabsForm(){
    this.items = [
      {
        id: '1',
        label: 'Informacion-General', 
        icon: 'pi pi-fw pi-info-circle', 
        command: event => {
          this.activateMenu(event);
        }
      },
      {
        id: '2',
        label: 'Cliente / Transportista', 
        icon: 'fas fa-truck', 
        command: event => {
          this.activateMenu(event);
        }
      }
  ]; 
  this.activeItem = this.items[0];
  }
  
  activateMenu(event) {
    if(event.item.id ===  "2" ){
      this.datosFormulario = false;
      this.datosFormulario2 = true; 
    }else{
      this.datosFormulario = true;
      this.datosFormulario2 = false; 
    } 
  }
 
  /* FORM ARRAY */
  get fa() { return this.Form.get('arrayDetalles') as FormArray; } 
  get detallesForm() { return this.fa.controls as FormGroup[]; }

  onAgregarDetalle(){ 
    const data = this.Form.value; 
    if(!data.establecimiento){
      this.swal.mensajeAdvertencia('Debes Seleccionar un Establecimeinto para continuar');
      return;
    } 
    if(this.detallesForm.length > 0){ 
      this.bloquearComboEstablecimiento = true;
    }
    this.detallesForm.push(this.AddDetalle());    
  }

  AddDetalle(){ 
    return this.fb.group({ 
      productoid: new FormControl(null),  
     // almacen : new  FormControl(null, Validators.required),  
      almacen: this.arrayAlmacenes.find(
        (x) => x.id === (this.dataPredeterminadosDesencryptada ? this.dataPredeterminadosDesencryptada.idalmacen : null)
      ),
      codigoProducto : new FormControl(null, Validators.required), 
      descripcion: new FormControl(null),  
      unidadMedida: new FormControl(null, Validators.required),
      cantidad: new FormControl(0),   
      bultos: new FormControl(null, Validators.required),   
      pesoUnitario: new FormControl(null),  
      precioUnitario: new FormControl(null),
      pesoTotal: new FormControl(null),
      guiaremisiondetalleid: new FormControl(null),
      guiaremisionid: new FormControl(null), 
    });
  }

  onEliminarDetalle(index : any, idDetalleArray: any){   
    if(!idDetalleArray){  
      this.fa.removeAt(index);  
      this.cdr.detectChanges();  
      if(this.detallesForm.length === 0){ 
        this.bloquearComboEstablecimiento = false;
      }  
    }else{
      this.swal.mensajePregunta("¿Seguro que desea eliminar el detalle.?").then((response) => {
        if (response.isConfirmed) { 
          this.arrayDetallesEliminados.push(idDetalleArray);
          this.fa.removeAt(index);  
          this.swal.mensajeExito('El detalle ha sido eliminado correctamente!.'); 
       }
      }) 
    }
  }

  /* BUSCAR PERSONA */
  onModalBuscarPersona(){
    this.modalBuscarPersona = true;
  }

  onPintarPersonaSeleccionada(event : any){   
    this.idClienteSelccionado = event.idCliente,
    this.Form.controls['rucCliente'].setValue(event.nroDocumento); 
    this.Form.controls['codigoCliente'].setValue(event.codCliente); 
    this.Form.controls['razonSocialCliente'].setValue(event.nombreRazSocial); 
    this.modalBuscarPersona= false;
  }

  /* BUSCAR TRANSPORTISTA */
  onModalBuscarTransportista(){
    this.modalBuscarTransportista = true;
  }

  onPintarTransportistaSeleccionado(event : any){ 
    this.idTransportistaSeleccionado = event.id; 
    this.Form.controls['rucTransportista'].setValue(event.nroDocumento); 
    this.Form.controls['codigoTransportista'].setValue(event.cod); 
    this.Form.controls['razonSocialTransportista'].setValue(event.nombre); 
    this.modalBuscarTransportista= false;
    this.onCargarComboChofer(this.idTransportistaSeleccionado);
    this.onCargarComboUndTransporte(this.idTransportistaSeleccionado);
  }

  onCargarComboUndTransporte(event : number){
    this.generalService.listarUndTransporteCombo(event).subscribe((resp) => {
      this.arrayPlacaCombo = resp; 
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  onPintarDatosDeUndTransporteSeleccionado(event :any){ 
    if(event.value){
      this.idUndTransporteSeleccionado = event.value.id 
      this.Form.controls['placa'].setValue(event.value.id);
      this.onCargarTransportePorId(this.idUndTransporteSeleccionado);
    }else{
      this.Form.controls['certificado'].setValue(null);
      this.Form.controls['marca'].setValue(null); 
    }
  }

  onCargarTransportePorId(event: number){
    this.spinner.show();
    this.transportistaService.unidadTransporteporId(event).subscribe((resp)=>{
      if(resp){
        this.Form.controls['certificado'].setValue(resp.tractocertificadomtc);
        this.Form.controls['marca'].setValue(resp.tractomarca); 
        this.spinner.hide();
      } 
    },error => { 
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);  
    });
  }
 

  onCargarComboChofer(event : number){
    this.generalService.listarChoferCombo(event).subscribe((resp) => {
      this.arrayChofercombo = resp;  
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  onPintarDatosDeChoferSeleccionado(event : any){
    if(event.value){
      this.idChoferSeleccionado = event.value.id
      this.Form.controls['chofer'].setValue(event.value.id);
      this.onCargarChoferPorId(this.idChoferSeleccionado);
    }else{
      this.Form.controls['brevete'].setValue(null); 
    }
  }

  onCargarChoferPorId(event: number){ 
    this.spinner.show();
    this.transportistaService.choferporId(event).subscribe((resp)=>{
      if(resp){ 
        this.Form.controls['brevete'].setValue(resp.brevete); 
        this.spinner.hide();
      } 
    },error => { 
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);  
    });
  }

 /* BUSCAR PRODUCTO */
  onModalBuscarProducto(posicion : number){
    let ValorAlmacen = (this.Form.get('arrayDetalles') as FormArray).at(posicion).value.almacen;
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

  onPintarProductoSeleccionado(event : any){ 
    this.detallesForm[event.posicion].patchValue({
      codigoProducto:  event.data.codProducto,
      descripcion: event.data.nombreProducto, 
      unidadMedida: this.arrayUnidadesMedida.find(
        (x) => x.id ===   event.data.unidadMedidaId
      ),   
      preciounitario : event.data.precioDefault,
      productoid : event.data.productoId, 
    });

    this.modalBuscarProducto= false;  

  }
 
 
  /* BUSCAR UBIGEO */
  onModalBuscarUbigeo(event : string){ 
    this.dataUbigeo = event
    this.modalBuscarUbigeo = true;
  }
       
  onPintarUbigeoSeleccionado(event :any){ 
    if(event.punto === 'partida'){ 
      this.Form.controls['ubigeoPartida'].setValue(event.ubigeo);
      this.Form.controls['puntoPartida'].setValue(event.nombreubigeo);
    }else{ 
      this.Form.controls['ubigeoLlegada'].setValue(event.ubigeo);
      this.Form.controls['puntoLlegada'].setValue(event.nombreubigeo);
    } 
    this.modalBuscarUbigeo = false;
  }
 
  onCalcularValorTotal(posicion : number, data:any){
    this.detallesForm[posicion].patchValue({
      pesoTotal : data.cantidad * data.pesoUnitario
    });
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
          almacenid : element.value.almacen.id,
          bultos : element.value.bultos,
          cantidad : element.value.cantidad,
          codproductofinal: element.value.codigoProducto,
          descripcionproductofinal : element.value.descripcion,  
          guiaremisiondetalleid:  element.value.guiaremisiondetalleid ? element.value.guiaremisiondetalleid : 0, 
          guiaremisionid : element.value.guiaremisionid ? element.value.guiaremisionid : 0,
          pesototal : element.value.pesoTotal,
          pesounitario : +element.value.pesoUnitario, 
          preciounitario : element.value.precioUnitario,
          productoid : element.value.productoid, 
          unidadmedidaid : element.value.unidadMedida.id   
        });  
      }
    })    
 
    const newGuiaRemision : ICrearGuiasRemision = {
      correlativomensual : this.GuiaRemisionEditar ? this.GuiaRemisionEditar.correlativomensual : 0,
      detalles: this.arrayDetalleGrabar,
      estadoid: dataform.activo,
      establecimientoid:  this.GuiaRemisionEditar ? this.GuiaRemisionEditar.establecimientoid : this.idEstablecimientoSeleccionado,
      fechaemision :  this.formatoFecha.transform(dataform.fechaEmision,ConstantesGenerales._FORMATO_FECHA_BUSQUEDA), 
      fechatraslado :  this.formatoFecha.transform(dataform.fechaTraslado,ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),  
      guiaremisionid: this.GuiaRemisionEditar ? this.GuiaRemisionEditar.guiaremisionid :  0,
      idauditoria: this.GuiaRemisionEditar ? this.GuiaRemisionEditar.idauditoria : 0 ,
      idcliente: this.GuiaRemisionEditar ? this.GuiaRemisionEditar.idcliente : this.idClienteSelccionado,
      idsToDelete : this.arrayDetallesEliminados,
      importetotal: this.GuiaRemisionEditar ? this.GuiaRemisionEditar.importetotal : 0 ,
      llegadadireccion :  dataform.puntoLlegada,
      llegadaubigeo :  +dataform.ubigeoLlegada,
      modalidadid:   this.GuiaRemisionEditar ? this.GuiaRemisionEditar.modalidadid : dataform.modalidad.id,
      monedaid:  this.GuiaRemisionEditar ? this.GuiaRemisionEditar.monedaid : dataform.moneda.id,
      motivoid:  this.GuiaRemisionEditar ? this.GuiaRemisionEditar.motivoid : dataform.motivo.id,
      observacion: dataform.observacion,
      ordencompra : +dataform.ordenCompra,
      partidadireccion :  dataform.puntoPartida,
      partidaubigeo : +dataform.ubigeoPartida,
      pedidocot : +dataform.nroPedCot,
      pesototal: this.GuiaRemisionEditar ? this.GuiaRemisionEditar.pesototal : 0 ,
      redondeo: this.GuiaRemisionEditar ? this.GuiaRemisionEditar.redondeo : 0 ,
      secuencialguia: dataform.sencuencialguia,
      secuencialref: dataform.secuencialref,
      seriedocumentoref : +dataform.seriedocref,
      serieguia : dataform.serieguia ? dataform.serieguia.valor1 : dataform.serieguia,
      tipocambio: dataform.tipoCambio,
      tipodocumentoid: this.GuiaRemisionEditar ? this.GuiaRemisionEditar.tipodocumentoid :  dataform.tipoguia.id,
      tipodocumentoidref:  dataform.docReferencia ? dataform.docReferencia.id : null,
      totalbultos: this.GuiaRemisionEditar ? this.GuiaRemisionEditar.totalbultos : 0 ,
      transportistaid: this.GuiaRemisionEditar ? this.GuiaRemisionEditar.transportistaid : this.idTransportistaSeleccionado,
      transportistachoferid: dataform.chofer ? dataform.chofer.id : null,
      transportistaunidadid: dataform.placa ? dataform.placa.id : null,
    }
  
    if(!this.GuiaRemisionEditar){
      this.guiaRemisionService.createguiaRemision(newGuiaRemision).subscribe((resp)=>{
        if(resp){ 
          this.swal.mensajePregunta("¿Quiere editar la guia de remision?").then((response) => {
            if (response.isConfirmed) {
              this.onObtenerguiaRemisionPorId(resp, 'nuevo')
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
      this.guiaRemisionService.updateguiaRemision(newGuiaRemision).subscribe((resp)=>{
        this.swal.mensajePregunta("¿Quiere seguir editando la guia de remisión?").then((response) => {
          if (response.isConfirmed) {
            this.onObtenerguiaRemisionPorId(newGuiaRemision.guiaremisionid, 'nuevo')
          }else{
            this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
            this.onVolver();
          }
        })  
      },error => { 
        this.generalService.onValidarOtraSesion(error);  
      });
    } 
  }

  onReporte(){
    this.dataReporte = this.GuiaRemisionEditar
    this.VistaReporte = true;
  }
   
  onRetornar(){
    this.VistaReporte = false;
  }


  onVolver(){ 
    this.cerrar.emit('exito') 
  }

  onRegresar(){
    this.cerrar.emit(false);
  }

  onObtnerModaldidad(event: any){   
    const PLACA = this.Form.get("placa");
    const CHOFER = this.Form.get("chofer"); 
    
    if (event.value.id === 2) { 
      PLACA.setValidators([Validators.required]);
      CHOFER.setValidators([Validators.required]);    
    } else{ 
      PLACA.setValidators(null);
      CHOFER.setValidators(null);  
    }

    PLACA.updateValueAndValidity();
    CHOFER.updateValueAndValidity(); 
  }

  validateFormat(event) { 
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
     if (!regex.test(key)) {
      event.returnValue = false;
       if (event.preventDefault) {
        event.preventDefault();
       }
     }
    }
    


}
