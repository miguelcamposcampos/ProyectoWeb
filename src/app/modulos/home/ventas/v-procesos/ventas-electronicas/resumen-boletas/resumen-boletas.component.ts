import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IListarResumenBoleta } from '../interface/ventaelectronica.interface';
import { VentaElectronciaService } from '../servicio/ventaelectronica.service';

@Component({
  selector: 'app-resumen-boletas',
  templateUrl: './resumen-boletas.component.html',
  styleUrls: ['./resumen-boletas.component.scss']
})
export class ResumenBoletasComponent implements OnInit {

  @Output() cerrar : EventEmitter<boolean> = new EventEmitter<boolean>();
  cols: InterfaceColumnasGrilla[] = []; 
  FormBusqueda : FormGroup;
  listadoResumen : IListarResumenBoleta[]; 
  fechaActual = new Date();
  es = ConstantesGenerales.ES_CALENDARIO;

  constructor(
    private config : PrimeNGConfig,
    private swal : MensajesSwalService,
    private ventasElectronicasService: VentaElectronciaService,
    private readonly formatoFecha : DatePipe
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
    this.config.setTranslation(this.es);
    this.onLoadResumen();
    this.cols = [ 
      { field: 'tipoResumen', header: 'Tipo Resumen', visibility: true },  
      { field: 'fechaResumen', header: 'F.Resumen', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'notaSunat', header: 'Nota Sunat', visibility: true }, 
      { field: 'nroTicket', header: 'Nro Ticket', visibility: true },  
      { field: 'aceptado', header: 'Aceptado', visibility: true, tipoFlag: 'boolean'}
    ];

  }

  onLoadResumen(){
    const dataform = this.FormBusqueda.value; 
    const data = {
      fechaInicio :  this.formatoFecha.transform(dataform.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      fechaFin:   this.formatoFecha.transform(dataform.fechaFin , ConstantesGenerales._FORMATO_FECHA_BUSQUEDA)
    } 

    this.swal.mensajePreloader(true);
    this.ventasElectronicasService.listarResumen(data).subscribe((resp)=>{
      if(resp){
        this.listadoResumen = resp;
      }
      this.swal.mensajePreloader(false);
    });
  }


  onRegresar(){
    this.cerrar.emit(false)
  }


}
