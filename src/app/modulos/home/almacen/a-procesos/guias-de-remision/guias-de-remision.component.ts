import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api'; 
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IGuiasRemision } from './interface/guiasremision.interface';
import { GuiaRemisionService } from './service/guiaremision.service';

@Component({
  selector: 'app-guias-de-remision',
  templateUrl: './guias-de-remision.component.html'
})
export class GuiasDeRemisionComponent implements OnInit {
 
  cols: InterfaceColumnasGrilla[] =[];
  listaGuiasRemision : IGuiasRemision[]; 
  FormBusqueda : FormGroup;
  dataGuia : any;
  fechaActual = new Date(); 
  textoPaginado : string="";
  pagina: number = 1;
  size: number = 50; 

  VistaNuevaGuiaRemision : boolean = false; 
  es : any = ConstantesGenerales.ES_CALENDARIO;

  constructor(
    private guiaRemisionService : GuiaRemisionService,
    private swal : MensajesSwalService,
    private readonly formatoFecha: DatePipe,
    private primengConfig : PrimeNGConfig,
    private generalService : GeneralService
  ) { 
    this.builform(); 
  }

  public builform(): void {
    this.FormBusqueda = new FormGroup({
      secuencial: new FormControl("", Validators.required),
      fechaInicioBusqueda: new FormControl(this.fechaActual, Validators.required),
      fechaFinBusqueda: new FormControl(this.fechaActual, Validators.required),  
    });
  }

  ngOnInit(): void { 
    this.cols = [  
      { field: 'nroRegistro', header: 'Nro Registro', visibility: true }, 
      { field: 'docGuia', header: 'Doc.Guia', visibility: true},  
      { field: 'fechaEmision', header: 'Fec.Emisión', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'fechaTraslado', header: 'Fec.Traslado', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'docReferencia', header: 'Doc.Referencia', visibility: true }, 
      { field: 'cliente', header: 'Cliente', visibility: true},  
      { field: 'ordenCompra', header: 'Orden Compra', visibility: true},  
      { field: 'transportista', header: 'Transportista', visibility: true},   
      { field: 'ubigeoLlegada', header: 'Ubi.Llegada', visibility: true},  
      { field: 'usuarioRegistro', header: 'Usuario Reg.', visibility: true},  
      { field: 'fechaRegistro', header: 'Fec.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA },  
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];


    this.primengConfig.setTranslation(this.es);
    this.onLoadGuiasRemision(null);
  }

  onLoadGuiasRemision(event:any){
    const form = this.FormBusqueda.value;
    let fechaInicioBusqueda = this.formatoFecha.transform(form.fechaInicioBusqueda, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA);
    let fechaFinBusqueda = this.formatoFecha.transform(form.fechaFinBusqueda, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA);
    
    const data = { 
      paginaindex  : event ? event.first : this.pagina,
      itemsxpagina : event ? event.rows : this.size,
      finicio: fechaInicioBusqueda,
      ffin: fechaFinBusqueda,
    }
    
    this.swal.mensajePreloader(true);
    this.guiaRemisionService.listadodeGuiasRemision(data).subscribe((resp) => {
      if(resp){
        this.textoPaginado = resp.label;
        this.listaGuiasRemision = resp.items;
      }
      this.swal.mensajePreloader(false);
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }
  
  onNuevaGuiasRemision(){
    this.dataGuia = null;
    this.VistaNuevaGuiaRemision = true;
  }

  onEditar( data : any){ 
    this.dataGuia =  data,
    this.VistaNuevaGuiaRemision = true;
  }


  onModalEliminar(data:any){ 
    this.swal.mensajePregunta("¿Seguro que desea eliminar la guia de remisión " + data.nroRegistro + " ?").then((response) => {
      if (response.isConfirmed) {
        this.guiaRemisionService.deleteguiaRemision(data.id).subscribe((resp) => { 
          this.onLoadGuiasRemision(null); 
          this.swal.mensajeExito('La guia de remisión ha sido eliminado correctamente!.'); 
        },error => { 
          this.generalService.onValidarOtraSesion(error);  
        });
      }
    })  
  }
 

  onRetornar(event : any){
    if(event === 'exito'){
      this.onLoadGuiasRemision(null);
    }
    this.VistaNuevaGuiaRemision = false;
   
  }
}
