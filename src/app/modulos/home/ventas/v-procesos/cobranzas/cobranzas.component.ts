import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { SignalRService } from 'src/app/modulos/shared_modulos/signalR/signalr.service';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICobranza } from './interface/cobranza.interface';
import { CobranzaService } from './service/cobranza.service';

@Component({
  selector: 'app-cobranzas',
  templateUrl: './cobranzas.component.html'
})
export class CobranzasComponent implements OnInit , OnDestroy{

  cols: InterfaceColumnasGrilla[] = [];
  opcioneSplitCobranza : MenuItem[];
  FormBusqueda : FormGroup;
  listadoCobranzas : ICobranza[];
  dataCobranza : ICobranza;
  textoPaginado : string="";
  pagina: number = 1;
  size: number = 50;
  fechaActual = new Date();
  VistaNuevoCobranza : boolean = false;
  es = ConstantesGenerales.ES_CALENDARIO;


  constructor(
    private cobranzaservice : CobranzaService,
    private config : PrimeNGConfig,
    private swal : MensajesSwalService,
    private dataFormat : DatePipe, 
    public signalService : SignalRService,
    private generalService: GeneralService
  ) {
    this.builform();
   }

  
  private builform() : void {
    this.FormBusqueda = new FormGroup({
      fechaInicio: new FormControl(this.fechaActual), 
      fechaFin: new FormControl(this.fechaActual),  
    });
  }



  ngOnInit(): void {  
    this.onSignalERP();
    this.config.setTranslation(this.es)
    this.onLoadCobranzas(null);
    this.cols = [ 
      { field: 'tipoDoc', header: 'T.Doc', visibility: true},  
      { field: 'nroRegistro', header: 'Nro Registro', visibility: true }, 
      { field: 'fechaCobranza', header: 'F.Cobranza', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA },  
      { field: 'glosa', header: 'Glosa', visibility: true }, 
      { field: 'moneda', header: 'Moneda', visibility: true }, 
      { field: 'importeCobrado', header: 'ImporteCobrado', visibility: true },  
      { field: 'fechaRegistro', header: 'F.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'usuarioRegistro', header: 'Usuario.Reg', visibility: true }, 
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];

  }


  onSignalERP(){ 
    this.signalService.iniciarConeccionSR(); 
    this.signalService.InfoCobranzas.subscribe((resp) => { 
      if(resp){
        this.onLoadCobranzas(null);
      } 
    });
  }




  onLoadCobranzas(event : any){
    this.swal.mensajePreloader(true);
    const dataform = this.FormBusqueda.value;
      const data = {
        finicio : this.dataFormat.transform(dataform.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
        ffin : this.dataFormat.transform(dataform.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
        paginaindex :  event ? event.first : this.pagina,
        itemporPagina :  event ? event.rows : this.size
      }

      this.cobranzaservice.listadoCobranza(data).subscribe((resp) => {
        if(resp){
          this.listadoCobranzas = resp.items,
          this.textoPaginado = resp.label,
          this.swal.mensajePreloader(false);
        }
      },error => { 
        this.generalService.onValidarOtraSesion(error);  
      });
  }

  onNuevo(){
    this.dataCobranza = null;
    this.VistaNuevoCobranza = true;
  }

  onEditar(data :any){
    this.dataCobranza = data;
    this.VistaNuevoCobranza = true;
  }


  onModalEliminar(data :any){ 
    this.swal.mensajePregunta("¿Seguro que desea eliminar el cobro con nuero de registro: " + data.nroRegistro + " ?").then((response) => {
      if (response.isConfirmed) {
        this.swal.mensajeExito('El cobro se ha sido eliminado correctamente!.'); 
        this.cobranzaservice.deleteCobranza(data.idCobranza).subscribe((resp) => {
          if(resp){
            this.onLoadCobranzas(null);
          }
        },error => { 
          this.generalService.onValidarOtraSesion(error);  
        });
      }
    })  
  } 

  onRetornar(event : any){
    if(event === 'exito'){
      this.onLoadCobranzas(null);
    }
    this.VistaNuevoCobranza = false;
  }

  ngOnDestroy(): void {
    this.signalService.hubConnection.off('onEscucharCobranzas');
  }
 

}
