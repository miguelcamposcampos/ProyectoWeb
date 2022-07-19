import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { SignalRService } from 'src/app/modulos/shared_modulos/signalR/signalr.service';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IListarVentasElectronicas } from './interface/ventaelectronica.interface';
import { VentaElectronciaService } from './servicio/ventaelectronica.service'; 

@Component({
  selector: 'app-ventas-electronicas',
  templateUrl: './ventas-electronicas.component.html',
  styleUrls: ['./ventas-electronicas.component.scss']
})
export class VentasElectronicasComponent implements OnInit  {

 
  opcioneVentaElectronica: MenuItem[];
  cols: InterfaceColumnasGrilla[] = []; 
  colsVisibles: InterfaceColumnasGrilla[] = [];
  es = ConstantesGenerales.ES_CALENDARIO;
  FormBusqueda : FormGroup;
  listadoVentasEletronicas : IListarVentasElectronicas[]; 
  fechaActual = new Date();
  meses = ConstantesGenerales.arrayMeses
  modalResumenBoletas : boolean = false;
  modalResumenAltayBaja: boolean = false;
  titulomodalResumen : string = ""; 
  fechaResumen  = new FormControl(this.fechaActual)
  tipo : string =""; 
  mostrarBloqueo: boolean = false; 
  idVentaaBloquear: string ="";
  filasBloqueadas: any[]=[];  
 
  
  constructor(
    private config : PrimeNGConfig,
    private swal : MensajesSwalService,
    private ventaselectronicasService : VentaElectronciaService,
    private readonly formatoFecha : DatePipe, 
    public signalService : SignalRService, 
    private generalService: GeneralService,
    private spinner : NgxSpinnerService

    ) {
      this.builform();
      this.onListarJobs();

      this.generalService._hideSpinner$.subscribe(x=>{
        this.spinner.hide();
      })
      
     }
  
  
  private builform() : void {
    this.FormBusqueda = new FormGroup({
      fechaInicio: new FormControl(this.fechaActual), 
      fechaFin: new FormControl(this.fechaActual),  
    });
  }

  ngOnInit(): void {     
    this.config.setTranslation(this.es);
    this.onOpcionesVentasEletronicas();  
    this.onLoadVentasElectronicas();  
    this.onSignalERP();
    this.signalService.iniciarConeccionIntegracion();

    this.cols = [ 
      { field: 'nroRegistro', header: 'Nro Registro', visibility: true }, 
      { field: 'tipoDocumento', header: 'T.Documento', visibility: true},  
      { field: 'nroDocumento', header: 'Nro Documento', visibility: true }, 
      { field: 'fechaEmision', header: 'F.Emision', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'fechaVencimiento', header: 'F.Vencimiento', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'clienteDocumento', header: 'Nro Doc Cliente', visibility: true }, 
      { field: 'clienteNombreRazSocial', header: 'Cliente', visibility: true }, 
      { field: 'moneda', header: 'Moneda', visibility: true }, 
      { field: 'importe', header: 'Importe', visibility: true }, 
      { field: 'estado', header: 'Estado', visibility: true }, 
      { field: 'altabajaSunat', header: 'Acciones', visibility: true }, 
      { field: 'observacionesSunat', header: 'Observaciónes-Sunat', visibility: true }, 
      { field: 'altabajaFechaSunat', header: 'F.Envio.Sunat', visibility: true }, 
      { field: 'fechaBajaSunat', header: '', visibility: false, formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'fechaAltaSunat', header: '', visibility: false, formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'notasAltaSunat', header: '', visibility: false }, 
      { field: 'notasBajaSunat', header: '', visibility: false },  
      { field: 'altaCpePermitido', header: '', visibility: false },  
      { field: 'bajaCpePermitido', header: '', visibility: false },   
      { field: 'fechaRegistro', header: 'F.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'usuarioRegistro', header: 'Usuario.Reg', visibility: true }, 
      { field: 'acciones', header: 'Act. Estado', visibility: true  }, 
    ];

    this.colsVisibles = this.cols.filter(x => x.visibility == true);
 
  }
 
  onSignalERP(){ 
    this.signalService.iniciarConeccionSR(); 
    this.signalService.InfoVentas.subscribe((resp) => { 
      if(resp){
        this.onLoadVentasElectronicas();
      } 
    });
  }
  
  onSingalIntegracion(){  
    this.signalService.InfoEnvioMasivo.subscribe((resp) => { 
      if(resp){
        this.mostrarBloqueo = false; 
      }
    });   
  }

  onLoadVentasElectronicas(){
    const dataform = this.FormBusqueda.value; 
    const data = {
      fechaInicio :  this.formatoFecha.transform(dataform.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      fechaFin:   this.formatoFecha.transform(dataform.fechaFin , ConstantesGenerales._FORMATO_FECHA_BUSQUEDA)
    } 
 
    this.spinner.show(); 
    this.ventaselectronicasService.listadoVentasElectronicas(data).subscribe((resp) => {
      if(resp){
        this.listadoVentasEletronicas = resp; 
        this.spinner.hide();
      } 
    });
  }

  onOpcionesVentasEletronicas(){
    this.opcioneVentaElectronica = [
      {
        label:'Resumen Boleta',
        icon:'fa-solid fa-file-lines', 
        command:()=>{
          this.onModalResumen();
        }
      },
      {
        label:'Resumen Alta',
        icon:'fas fa-arrow-trend-up',
        command:()=>{
          this.onResumenAltayBaja('alta');
        }
      },
      {
        label:'Resumen Baja',
        icon:'fas fa-arrow-trend-down',
        command:()=>{
         this.onResumenAltayBaja('baja');
        }
      },  
    ] 
  }
 
  onListarJobs(){  
    const estado = 'EnCurso'
    this.ventaselectronicasService.listarJobs(estado).subscribe((resp)=> { 
      if(resp){ 
        this.mostrarBloqueo = true;
      }
    })
  }

  onModalResumen(){ 
    this.modalResumenBoletas = true;
  }

  onResumenAltayBaja(tipo : string){ 
    this.titulomodalResumen = tipo === 'alta' ? "CREAR RESUMEN ALTA" :  "CREAR RESUMEN BAJA";    
    this.tipo = tipo;
    this.fechaResumen.setValue(this.fechaActual);
    this.modalResumenAltayBaja = true;
  }
 
  onCrearResumen(tipo : string){ 
    const data = {
      action : tipo === 'alta' ? 'void' : 'create',
      fecha :  this.formatoFecha.transform(this.fechaResumen.value, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA)
    }
   
    this.ventaselectronicasService.crearResumenAltayBaja(data).subscribe((resp)=>{
      if(resp){
        this.modalResumenAltayBaja = false;
      }
      this.swal.mensajeExito('Se creó el resumen correctamente!.');
    });
  }

  onModalEnvioMasivo(){ 
    this.swal.mensajePreguntaElegirMes("Esta tarea enviará sus comprobantes del mes elegido incluyendo las Bajas, ¿Seguro de continuar?").then((response) => {
      if (response.isConfirmed) {  
        const data = {
          periodo : this.fechaActual.getFullYear(),
          mes : +response.value
        }
        let MesElegido =  this.meses.find(x => x.mes === +response.value) 
        this.ventaselectronicasService.crearEnvioMasivo(data).subscribe((resp)=> {
          if(resp){     
            this.signalService.onEscucharEnviosMasivos(resp.toString())
            this.onSingalIntegracion();
          }
          this.mostrarBloqueo = true;    
          this.swal.mensajeExito('Se enviaron los comprobantes del mes de ' + MesElegido.nombre);   
        });
      }
    })  
  }
 
   
  onVerEstado(data : any, estado : string){    
    if(!this.filasBloqueadas.includes(data.nroRegistro)){
      this.filasBloqueadas.push(data.nroRegistro); 
    } 

    let estadoVoidRequest = (estado === 'Alta') ? false : true;
    const dataParams = {
      invoiceId : data.idVenta,
      isVoidRequest : estadoVoidRequest
    }

    this.ventaselectronicasService.consultarAltaBaja(dataParams).subscribe((resp) => {
      if(resp){    
        this.filasBloqueadas.splice(data.nroRegistro , 1); 
      } 
      if(this.filasBloqueadas){
        this.onListaFilasBloqueados(data.idVenta)
      }
    });
  }
 

  onListaFilasBloqueados(nroRegistro: number){  
    let id  = this.filasBloqueadas.filter(x => x === nroRegistro)
    if(id.length === 0){
      return 0
    }else{ 
      return nroRegistro
    }
  
  }
  
  onEnviarAltaBaja(invoideId: number, estado : string){
    let estadoVoidRequest = (estado === 'Alta') ? false : true; 
    const dataParams = {
      autoEnvio : true,
      isVoidRequest : estadoVoidRequest,
      invoiceId: invoideId
    } 
    this.ventaselectronicasService.consultarAltaBaja(dataParams).subscribe((resp) => {
      if(resp){ 
        this.onLoadVentasElectronicas();
      }
    });
  }

 onRetornar(){
   this.modalResumenBoletas = false;
 }

 

}
