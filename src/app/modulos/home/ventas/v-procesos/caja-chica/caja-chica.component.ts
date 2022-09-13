import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICajaChica } from './interface/cajachica.interface';
import { CajaChicasService } from './service/cajachica.service';

@Component({
  selector: 'app-caja-chica',
  templateUrl: './caja-chica.component.html',
  styleUrls: ['./caja-chica.component.scss']
})
export class CajaChicaComponent implements OnInit {

  FormBusqueda: FormGroup;
  cols: InterfaceColumnasGrilla[] = [];
  listaCajaChica : ICajaChica[];
  fechaActual = new Date(); 
  VistaNuevoCajaChica: boolean = false;
  es = ConstantesGenerales.ES_CALENDARIO;
  dataCajaChica:any;
  textoPaginado : string="";
  pagina: number = 1;
  size: number = 50;

  constructor(
    private cajachicaService : CajaChicasService,
    private swal: MensajesSwalService,
    private formatFecha : DatePipe,
    private config : PrimeNGConfig,
    private generalService: GeneralService,
    private spinner : NgxSpinnerService
  ) {  
    this.builform();

    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
  }

  public builform(){
    this.FormBusqueda = new FormGroup({
      fechaInicio: new FormControl(this.fechaActual, Validators.required),
      fechaFin: new FormControl(this.fechaActual, Validators.required), 
    })
  }

  ngOnInit(): void {
    this.config.setTranslation(this.es)
    this.onLoadCajachica(null);

    this.cols = [ 
      { field: 'nroRegistro', header: 'Nro Registro', visibility: true }, 
      { field: 'tipoDoc', header: 'T. Doc', visibility: true},    
      { field: 'fechaEmision', header: 'Fec. Emision',  visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA},   
      { field: 'cliente', header: 'Cliente',  visibility: true},   
      { field: 'estado', header: 'Estado', visibility: true},   
      { field: 'moneda', header: 'Moneda', visibility: true}, 
      { field: 'totalIngresos', header: 'Total Ingresos', visibility: true }, 
      { field: 'totalGastos', header: 'Total Gastos', visibility: true},   
      { field: 'saldoCaja', header: 'Saldo Caja', visibility: true},   
      { field: 'fechaRegistro', header: 'Fec. Registro',  visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA},   
      { field: 'usuarioRegistro', header: 'Usuario. Reg', visibility: true},   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];

  }

  onLoadCajachica(event : any){
    const dataform = this.FormBusqueda.value;
    
    const data = {
      paginaIndex  : event ? event.first : this.pagina,
      itemsxpagina :  event ? event.rows : this.size,
      finicio : this.formatFecha.transform(dataform.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      ffin : this.formatFecha.transform(dataform.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
    }
    this.spinner.show();
    this.cajachicaService.listadoCajaChica(data).subscribe((resp)=>{
      if(resp){ 
        this.listaCajaChica = resp.items;
        this.textoPaginado = resp.label;
        this.spinner.hide();
      } 
    });
  }


  onNuevo(){
    this.dataCajaChica = null;
    this.VistaNuevoCajaChica = true;
  }

  onEditar( data: any){ 
    this.dataCajaChica = data;
    this.VistaNuevoCajaChica = true;
  }

  onEliminar(data :any){
    this.swal.mensajePregunta("¿Seguro que desea eliminar cajachica con número de registro: " + data.nroRegistro + " ?").then((response) => {
      if (response.isConfirmed) {
        this.cajachicaService.deleteCajaChica(data.idCajaChica).subscribe((resp) => {
          if(resp){
            this.onLoadCajachica(null);
            this.swal.mensajeExito('El documento se ha sido eliminado correctamente!.'); 
          }
        });
      }
    })  
  }

  onRetornar(event : any){
    if(event ){
      this.onLoadCajachica(null);
    }
    this.VistaNuevoCajaChica = false;
  }


}
