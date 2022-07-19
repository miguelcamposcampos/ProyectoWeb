import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services'; 
import { IModuloReporte } from '../../a-mantenimientos/productos/interface/producto.interface';
import { ReportesAlmacenService } from '../services/reporte.service';

@Component({
  selector: 'reporte-reposicion-mercaderia',
  templateUrl: './reporte-reposicion-mercaderia.component.html',
  styles: [
  ]
})
export class ReporteReposicionMercaderiaComponent implements OnInit {

  es = ConstantesGenerales.ES_CALENDARIO;
  contenidoReporte : IModuloReporte;
  Pdf : any;
  urlGenerate : any;
  arrayAlmacen : ICombo[]; 
  arrayLinea : ICombo[];
  Form : FormGroup;

  constructor(
    private reporteService : ReportesAlmacenService, 
    private generalService : GeneralService,
    public sanitizer: DomSanitizer, 
    private config : PrimeNGConfig,
    private dataform : DatePipe,
    private spinner : NgxSpinnerService
  ) {
    this.builform();
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
  }
  
  public builform(){ 
    this.Form = new FormGroup({ 
    fechaInicio : new FormControl(new Date),
    fechaFin : new FormControl(new Date),
    Almacen : new FormControl(null), 
    lineaid: new FormControl(null),   
    })
  }

  ngOnInit(): void {
    this.config.setTranslation(this.es) 
    this.onCargarCombos();
  }

  onCargarCombos(){ 
    this.generalService.listadoAlmacenes().subscribe((resp) =>{
      if(resp){ 
        this.arrayAlmacen = resp;
      }
    })
    this.generalService.listadoLineas().subscribe((resp) => { 
      if(resp){
        this.arrayLinea = resp;   
      } 
    }); 

  }


  onGenerarReporte(){
    const data = this.Form.value; 
    const params = {
      tipoPresentacion : 'PDF', 
      f1 :  this.dataform.transform(data.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      f2 :  this.dataform.transform(data.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      almacen: data.Almacen ? data.Almacen.id : -1,
      lineaid : data.lineaid,
    } 

    this.spinner.show();
    this.reporteService.generarReporteReposicionMercaderia(params).subscribe((resp) => { 
      if(resp){ 
        this.contenidoReporte = resp    
        var blob = new Blob([this.onBase64ToArrayBuffer(this.contenidoReporte.fileContent)], {type: "application/pdf"});
        const url = URL.createObjectURL(blob);    
        this.urlGenerate = url;
        this.Pdf= this.sanitizer.bypassSecurityTrustResourceUrl(this.urlGenerate); 
        this.spinner.hide();
      }    
    });
  }

  onBase64ToArrayBuffer(base64) {
    const binary_string = window.atob(this.contenidoReporte.fileContent);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    } 
    return bytes.buffer;
  }
 
}
