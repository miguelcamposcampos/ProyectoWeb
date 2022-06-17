import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api'; 
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces'; 
import { GeneralService } from 'src/app/shared/services/generales.services'; 
import { IModuloReporte, IReporte } from '../../a-mantenimientos/productos/interface/producto.interface';
import { IReporteModalidad } from '../interface/reporte.interface';  
import { ReportesAlmacenService } from '../services/reporte.service';

@Component({
  selector: 'app-kardex-fisico-valorizado',
  templateUrl: './kardex-fisico-valorizado.component.html'
})
export class KardexFisicoValorizadoComponent implements OnInit {

  es = ConstantesGenerales.ES_CALENDARIO;
  contenidoReporte : IModuloReporte;
  Pdf : any;
  urlGenerate : any;
  arrayModalidad : IReporteModalidad[];
  arrayMonedas : IReporteModalidad[]
  Form : FormGroup;
 
  constructor(
    private reporteService : ReportesAlmacenService, 
    public sanitizer: DomSanitizer,
    private spinner : NgxSpinnerService,
    private config : PrimeNGConfig,
    private dataform : DatePipe,
    private generalService : GeneralService,
    
  ) {
    this.builform();
   }

   public builform(){ 
     this.Form = new FormGroup({ 
      fechaInicio : new FormControl(new Date),
      fechaFin : new FormControl(new Date),
      Moneda : new FormControl(null),
      Modalidad : new FormControl(null),
     })
   }

  ngOnInit(): void {
    this.config.setTranslation(this.es) 
    this.onCargarCombos();
  }

  onCargarCombos(){ 
    this.arrayMonedas = [
      {nombre : 'SOLES', codigo: 'PEN'},
      {nombre : 'DOLARES', codigo: 'USD'}, 
    ]

    this.arrayModalidad = [
      {nombre : 'FISICO', codigo: 'Fisico'},
      {nombre : 'FISICO-SUNAT', codigo: 'FisicoSUNAT'},
      {nombre : 'VALORIZADO', codigo: 'Valorizado'},
      {nombre : 'VALORIZADO-SUNAT', codigo: 'ValorizadoSUNAT'}
    ] 
  }


  onGenerarReporte(){
    const data = this.Form.value;
   
    let moneda = data.Moneda ? data.Moneda.codigo : 'PEN'
    let modalidad  = data.Modalidad ? data.Modalidad.codigo : 'Fisico'
    const params = {
      tipoPresentacion : 'PDF', 
      f1 :  this.dataform.transform(data.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      f2 :  this.dataform.transform(data.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      monedareporte: moneda,
      modalidad : modalidad
    } 

    this.spinner.show();
    this.reporteService.generarReporteKardex(params).subscribe((resp) => { 
      if(resp){ 
        this.contenidoReporte = resp    
        var blob = new Blob([this.onBase64ToArrayBuffer(this.contenidoReporte.fileContent)], {type: "application/pdf"});
        const url = URL.createObjectURL(blob);    
        this.urlGenerate = url;
        this.Pdf= this.sanitizer.bypassSecurityTrustResourceUrl(this.urlGenerate); 
        this.spinner.hide();
      }    
    },error => { 
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);  
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
