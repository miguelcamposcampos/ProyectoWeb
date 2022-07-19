import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';   
import { IListadoStock } from 'src/app/modulos/home/almacen/a-procesos/consulta-stock/interface/consultastock.interface';
import { ConsultaStockService } from 'src/app/modulos/home/almacen/a-procesos/consulta-stock/service/consultastock.service';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICondicionPagoSunat, ICrearVenta, IDetalleDetraccionTransporte } from '../../interface/venta.interface';
import { VentasService } from '../../service/venta.service';

@Component({
  selector: 'app-items-venta-pos',
  templateUrl: './items-venta-pos.component.html',
  styleUrls: ['./items-venta-pos.component.scss']
})
export class ItemsVentaPosComponent implements OnInit { 
 
 
  @Input() dataVentaPos : any;  
  Tabs: any[]; 
  arrayDetalleCondicionPagoGrabar : ICondicionPagoSunat[] = [];
  arrayDetalleVentaDetraccionTransportista : IDetalleDetraccionTransporte;
  arrayLineas: any[]=[];
  arrayLineasMostrar: any[]=[];
  arrayServicios :  any[]=[];
  arrayProductos : any[]=[]; 
  detalleGrabar: any[]=[]; 
  dataPublicoGeneral : any;
  dataCobrar : any; 
  listadoStock : IListadoStock[];    
  modalBuscarPersona : boolean = false;
  modalCobrar : boolean = false;  
  mostrarBotonPublicGeneral : boolean = false;   
  isSqueleton : boolean = false;    
  isSqueletonDiv : boolean = false;    
  idIndexTab :any;
  activeItem: any; 
  searchText : string ="";
  minlen: number = 8;
  maxlen : number = 8;
  fechaActual =  new Date();
  
  constructor(
    private consutlaService : ConsultaStockService,
    private ventasservice : VentasService,
    private generalService : GeneralService,
    private swal : MensajesSwalService, 
    private formatoFecha : DatePipe,
    private cdr: ChangeDetectorRef,
  ) {} 
 

  ngOnInit(): void { 
    this.onPublicoGeneral(); 
  }

  onPublicoGeneral(){
    this.isSqueletonDiv = true;
    this.ventasservice.obtenerPublicoGeneral().subscribe((resp=> {
      if(resp){
        this.dataPublicoGeneral = resp
        if(this.dataVentaPos){
          this.onTabsForm();
          this.onCargarStock();
        }   
      }
    }))
  }
 

  onTabsForm(){  
    let direccion = this.dataPublicoGeneral.personaData.direccionprincipal
    this.Tabs = [{
      id: '0',
      label:  'Venta#01', 
      items : [],
      iProducto : false,
      iServicio: false,
      documentoSeleccionado: "BOLETA",
      seleccionarFactura:  false,
      seleccionarBoleta :  true,
      valorTotal : 0,
      tipoDocumento : '',
      idDocumento : 0,
      nrodocumentocliente : this.dataPublicoGeneral.personaData.nrodocumentoidentidad,
      nombreCliente : this.dataPublicoGeneral.personaData.nombreCompleto,
      liente : direccion ? direccion : '' ,
      idCliente : this.dataPublicoGeneral.idcliente, 
      idVenta : 0,
      mostrarBotonCobrar : false,
      mostrarBotonCliente : false
    }]    
    this.idIndexTab = this.Tabs[0].id;
    this.isSqueletonDiv = false;
    this.cdr.detectChanges(); 
  }


  onAgregarNuevaVentaPos() {  
    let direccion = this.dataPublicoGeneral.personaData.direccionprincipal
    let nroTab = this.Tabs.length
    this.Tabs.push({ 
      id:  nroTab.toString(),
      label: 'Venta#0'+(nroTab+1), 
      items: [],
      iProducto : false,
      iServicio: false,
      documentoSeleccionado: "BOLETA",
      seleccionarFactura:  false,
      seleccionarBoleta :  true,
      valorTotal : 0,
      tipoDocumento : '',
      idDocumento : 0,
      nrodocumentocliente : this.dataPublicoGeneral.personaData.nrodocumentoidentidad,
      nombreCliente : this.dataPublicoGeneral.personaData.nombreCompleto,
      direccionCliente : direccion ? direccion : '' ,
      idCliente : this.dataPublicoGeneral.idcliente, 
      idVenta: 0,
      mostrarBotonCobrar : false,
      mostrarBotonCliente : false
    });   
    this.idIndexTab = this.Tabs[nroTab].id; 
  }

  onEliminarTab(index: number) {  
    this.swal.mensajePregunta('¿Seguro de eliminar la venta?').then((response) => {
      if (response.isConfirmed) {
        this.idIndexTab = 0
        this.Tabs.splice(index, 1);  
        this.cdr.detectChanges();  
      }
    })
    
  }

  onChangeTab(index: number) { 
    this.activeItem =  this.Tabs[index].id; 
    this.idIndexTab = index
    this.cdr.detectChanges();  
  }

  onCargarStock(){ 
    const data = { 
      periodo : this.dataVentaPos.periodo,
      criteriodescripcion : '',
      arrayAlmacenes : this.dataVentaPos.arrayAlmacenes,
      soloservicios: false
    } 

    this.isSqueleton = true;
    this.consutlaService.listadoStock(data).subscribe((resp)=>{
      if(resp){
        this.listadoStock = resp;
        this.listadoStock.forEach(element=> { 
          if(!this.arrayLineas.includes(element.linea)){
            this.arrayLineas.push(element.linea);
          } 
          if(element.linea ===  "MERCADERÍA"){
            this.arrayProductos.push(element);
          }
          if(element.linea === "SERVICIO"){
            this.arrayServicios.push(element);
          }
        })

        this.arrayLineas.forEach(x => {
          this.arrayLineasMostrar.push({ nombreProducto : x})
        });
        this.isSqueleton = false;
      }
    });
   
  }
 
 
  onObtenerLinea(linea : string, indexTab: any){  
    if(linea === "MERCADERÍA" ){ 
       this.Tabs[indexTab].iProducto = true;
    }else if (linea === "SERVICIO"){ 
      this.Tabs[indexTab].iServicio = true;
    } 
  }


  onCerrarItems(indexTab:any){ 
    this.searchText = "";
    this.Tabs[indexTab].iProducto = false;
    this.Tabs[indexTab].iServicio = false; 
  }
 

  onSeleccionarItems(data: any, idTabs : any){
    this.Tabs[idTabs].items.push({ 
      producto : data.codProducto +' - '+ data.nombreProducto,
      precioProducto : data.precioDefault ? parseFloat(data.precioDefault).toFixed(2)  : null, 
      detalle : data, 
    }) 
    this.Tabs[idTabs].mostrarBotonCliente = true;
    this.idIndexTab = idTabs
    this.CalcularTotal(null, null, idTabs)
  }
 
  onEliminarItem(rowIndex: number, indexTab : number){
    this.Tabs[indexTab].items.splice(rowIndex,1);

    if(this.Tabs[indexTab].items.length === 0){
      this.Tabs[indexTab].mostrarBotonCliente = false;
    }

    this.CalcularTotal(null, rowIndex,  indexTab);
  }
 
  CalcularTotal(event : any , rowIndex : any,  indexTab : any){  
    if(event){
      let newPrecio = event.target.value; 
      this.Tabs[indexTab].items[rowIndex].precioProducto = +(newPrecio)
    }
    this.Tabs[indexTab].valorTotal =  this.Tabs[indexTab].items.reduce((sum, datos)=> (sum + (+datos.precioProducto) ?? 0 ), 0); 
  }


  onGrabar(indexTab : any){  
    if(!this.Tabs[indexTab].documentoSeleccionado){
      this.swal.mensajeAdvertencia('Debe seleccionar un comprobante, Boleta o Factura!.');
      return;
    }  
    if(!this.Tabs[indexTab].idCliente){
      this.swal.mensajeAdvertencia('Debe seleccionar un cliente!.');
      return;
    } 
    
    let DetallesVentaGrabar :any[] = this.onGrabarDetallesVenta(indexTab);
    let DetallesCondicionPagoGrabar :any[] = this.onGrabarCondicionPago();
  
    const newVentaPOS : ICrearVenta = {
      establecimientoid: this.dataVentaPos.idEstablecimiento,
      vendedorid : 0,
      documentoid : this.Tabs[indexTab].idDocumento,
      correlativomensual:  0,
      serieventa : this.Tabs[indexTab].idDocumento,
      secuencialventa : null,
      fechaemision: this.formatoFecha.transform(this.fechaActual, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      condicionpagoid: 1,
      idcliente : this.Tabs[indexTab].idCliente,
      nombrecliente : this.Tabs[indexTab].nombreCliente,
      direccioncliente : this.Tabs[indexTab].direccionCliente,
      monedaid: 1,
      tipocambio : 0,
      diasvencimiento : 0,
      fechavencimiento : null, 
      glosa : 'Venta rápida',
      estado : '',
      estadoid : true,
      dsctoglobalrporcentaje: 0,
      dsctoglobalimporte: 0,
      codtipooperacion: '0101',
      esdeduccionanticipo: false,
      esafectodetraccion: false,
      codigodetraccion : 0,
      porcentajedetraccion : 0,
      esafectoretencion : false,
      motivonotaid: 0,
      ordenservicio :  0,
      ordencompra: 0,
      fechaordencompra: null,
      esrecargoconsumo : false,
      cantidadtotal :  0,
      importeanticipo : 0,
      importedescuento : 0, 
      importevalorventa : +this.Tabs[indexTab].valorTotal.toFixed(2), 
      importeigv : 0, 
      importeicbper : 0, 
      importeotrostributos: 0,  
      importetotalventa : +this.Tabs[indexTab].valorTotal.toFixed(2),   
      condicionesPagoSunat : DetallesCondicionPagoGrabar,
      detalles : DetallesVentaGrabar,
      documentoReferenciaDtos: [],
      idsCondicionPagoToDelet: [],
      idsToDelete: [],
      ventaid : 0
     // conceptocontableid: 0
    } 
    this.ventasservice.createVenta(newVentaPOS).subscribe((resp) => {
      if(resp){ 
        this.idIndexTab = indexTab;
        this.Tabs[indexTab].mostrarBotonCobrar = true;
        this.Tabs[indexTab].idVenta = resp
        this.onCobrar(this.Tabs[indexTab].idVenta);
      }
      this.swal.mensajeExito('Se grabaron los datos correctamente!.');
    });
    
  }

  onGrabarDetallesVenta(indexTab :any){
    this.detalleGrabar = [];

    let arrayVentaDetalleDetraccionTransporte :any = this.onGrabarDetalleVentaDetraccionTransporte();
    let detaleTab : any[] = []; 

    this.Tabs[indexTab].items.forEach(element => {
      detaleTab.push(element.detalle)
    })

    detaleTab.forEach(element => {
      this.detalleGrabar.push({
        ventadetalleid: 0,
        ventaid :  0,
        productoid:  element.productoId,
        codproductofinal :  element.codProducto,
        descripcionproducto :  element.nombreProducto,
        unidadmedidaid:  element.unidadMedidaId,
        almacenid :  element.almacenId,
        cantidad :  1,
        preciounitario :  element.precioDefault,
        precioincluyeigv :  element.precioIncluyeIgv,
        baseimponible: element.precioDefault,
        tipoafectacionid :  element.tipoAfectacionId,
        porcentajedescuento: 0,
        observaciones: '',
        importedescuento :  0,
        esanticipo : false,
        valorventa : element.valorVenta,
        igv :  0,
        importeotroscargos: 0,
        importeicbper :  0,
        precioventa : element.precioDefault,
        nrolote :  element.lote,
        fechavencimiento : null,
        nroserie:  element.serie,
        ventaanticiporeferenciaid : null, 
        esafectoicbper : false,
        esGratuito : false,
        esGravada : false,
        unidadMedida : element.unidadMedida,
        ventaAnticipoReferencia :  '',
        ventadetallemigradaid:  null,
        ventaDetalleDetraccionTransporteInfoDTO : arrayVentaDetalleDetraccionTransporte
      });
    });

    return this.detalleGrabar;
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

  onGrabarCondicionPago(){
    this.arrayDetalleCondicionPagoGrabar = [];
    this.arrayDetalleCondicionPagoGrabar.push({
      descripcion : 'Contado',
      escredito:  false,
      escuota :   false,
      fechapagocuota: null,
      importe :  null,
      nrocuota:  null,
      ventacuotascreditoid:0,
      ventaid: 0,
    }) 
    return this.arrayDetalleCondicionPagoGrabar; 
  }

  onCobrar(idventa : any ){
    const data = {
      ventaid : idventa,
      establecimientoid : this.dataVentaPos.idEstablecimiento,
      ismodal: true
    }
    this.dataCobrar = data
    this.modalCobrar = true;
  }

  onCliente(indexTab : any){ 
    if(!this.Tabs[indexTab].documentoSeleccionado){
      this.swal.mensajeAdvertencia('Selecciona BOLETA o FACTURA');
      return;
    }
    if(this.Tabs[indexTab].documentoSeleccionado === 'BOLETA'){ 
      this.mostrarBotonPublicGeneral = true;
    }else{ 
      this.mostrarBotonPublicGeneral = false;
    } 
    this.modalBuscarPersona = true;
  }


  onCargarPublicoGeneral(indexTab : any){ 
    this.Tabs[indexTab].nrodocumentocliente = this.dataPublicoGeneral.personaData.nrodocumentoidentidad,
    this.Tabs[indexTab].nombreCliente = this.dataPublicoGeneral.personaData.nombreCompleto,
    this.Tabs[indexTab].direccionCliente = this.dataPublicoGeneral.personaData.direccionprincipal,
    this.Tabs[indexTab].idCliente = this.dataPublicoGeneral.idcliente   
  }

  onBuscarNuevoCliente(event: any){ 
    if(event){  
      this.ventasservice.obtenerPersonaPorNroDocumentoVenta(event.value).subscribe((resp)=> { 
        if(resp.personaData.nombreCompleto != "NO ENCONTRADO"){  
          this.Tabs[this.idIndexTab].nrodocumentocliente = resp.personaData.nrodocumentoidentidad,
          this.Tabs[this.idIndexTab].nombreCliente = resp.personaData.nombreCompleto ? resp.personaData.nombreCompleto : resp.personaData.razonsocial,
          this.Tabs[this.idIndexTab].direccionCliente = resp.personaData.direccionprincipal,
          this.Tabs[this.idIndexTab].idCliente = resp.idcliente 
        }else{
          this.swal.mensajeAdvertencia('NUMERO DE DOCUMENTO NO ENCONTRADO!.');
          return;
        }   
      })
    } 
  } 
 
  onSeleccionarBF(tipoDoc : string, indexTab: any) { 
    this.idIndexTab = indexTab;

    if(tipoDoc === 'B'){  
      this.Tabs[indexTab].seleccionarBoleta = !this.Tabs[indexTab].seleccionarBoleta;   
      this.Tabs[indexTab].seleccionarFactura = false
      if(this.Tabs[indexTab].seleccionarBoleta){
        this.Tabs[indexTab].documentoSeleccionado = 'BOLETA';
        this.onCargarPublicoGeneral(indexTab);
        this.onLlamarDocumento(indexTab);
      }
    }else{  
      this.minlen = 11;
      this.maxlen = 11;
      this.Tabs[indexTab].seleccionarFactura = !this.Tabs[indexTab].seleccionarFactura; ; 
      this.Tabs[indexTab].seleccionarBoleta = false
      if(this.Tabs[indexTab].seleccionarFactura){
        this.Tabs[indexTab].documentoSeleccionado = 'FACTURA';
        this.Tabs[indexTab].nrodocumentocliente = '';
        this.Tabs[indexTab].nombreCliente = '';
        this.Tabs[indexTab].direccionCliente = '';
        this.Tabs[indexTab].idCliente = 0; 
        this.onLlamarDocumento(indexTab);
      } 
    }  
  }


  onLlamarDocumento(indexTab:any){
    let doc
    if(this.Tabs[indexTab].documentoSeleccionado === 'BOLETA') doc = 3

    const data = {
      idestablecimiento : this.dataVentaPos.idEstablecimiento,
      tipodocumentoid : doc ? 3 : 1
    }

    this.generalService.listadoSeriePorDocumentocombo(data).subscribe((resp) => {
      if(resp){
        this.Tabs[indexTab].tipoDocumento = resp[0].valor1,
        this.Tabs[indexTab].idDocumento = resp[0].id
      }
    })

  }
 

  onRetornar(){
    this.modalCobrar = false;
  }
}
