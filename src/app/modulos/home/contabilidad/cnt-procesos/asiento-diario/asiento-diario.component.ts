import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IAsientoDiario, IListAsientoDiario } from './interface/asiento-diario.interface';
import { AsientoDiarioService } from './service/asiento-diario.service';

@Component({
  selector: 'app-asiento-diario',
  templateUrl: './asiento-diario.component.html',
  styleUrls: ['./asiento-diario.component.scss']
})
export class AsientoDiarioComponent implements OnInit {

  cols : InterfaceColumnasGrilla[]=[];
  list : IAsientoDiario[];
  vNuevo : boolean = false;
  data : IAsientoDiario;
  Form: FormGroup;
  es = ConstantesGenerales.ES_CALENDARIO;

  textoPaginado : string="";
  pagina: number = 1;
  size: number = 50;
  fechaActual = new Date();
  fechaInicio = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), 1);

  constructor(
    private apiService : AsientoDiarioService, 
    private config : PrimeNGConfig,
    private swal : MensajesSwalService,
    private generalService: GeneralService,
    private spinner : NgxSpinnerService,
    private formatFecha : DatePipe
  ) {
    this.builform();

    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
   }


   private builform() : void {
    this.Form = new FormGroup({
      fechaInicio: new FormControl(this.fechaInicio), 
      fechaFin: new FormControl(this.fechaActual),  
    });
  }


  ngOnInit(): void {
    this.config.setTranslation(this.es);
    this.cols = [ 
      { field: 'tipoDoc', header: 'Tipo Doc.', visibility: true },
      { field: 'nroRegistro', header: 'Nro Registro', visibility: true },
      { field: 'tipoComprobante', header: 'Tipo Comprobante', visibility: true },
      { field: 'nombre', header: 'Nombre', visibility: true }, 
      { field: 'fechaRegistro', header: 'Fec. Registro', visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA },
      { field: 'usuarioRegistro', header: 'Usu. Registro', visibility: true },
      { field: 'acciones', header: 'Ajustes', visibility: true  },
    ];

  }
 
  onLoad(event : any){ 
    const dataform = this.Form.value;
    let finicio =  this.formatFecha.transform(dataform.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA);
    let fehfin   =  this.formatFecha.transform(dataform.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA);
   
    const data = {
      paginaindex  : event ? event.first : this.pagina,
      itemsxpagina : event ? event.rows : this.size,
      finicio : finicio,
      ffin : fehfin
    }

    this.spinner.show();
    this.apiService.list(data).subscribe((resp)=> {
      if(resp){  
        this.textoPaginado = resp.label;
        this.list = resp.items;   
        this.spinner.hide(); 
      } 
    });

  }

  onAdd(){
    this.vNuevo = true;
  }

  onEdit(data: IAsientoDiario){
    this.data = data;
    this.vNuevo = true;
  }

  onDelete(data: IAsientoDiario){

  }



}
