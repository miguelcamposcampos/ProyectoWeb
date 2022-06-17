import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'; 
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { IReporte, IReporteExcel } from '../../../almacen/a-mantenimientos/productos/interface/producto.interface';
import * as XLSX from 'xlsx';   
import { saveAs } from 'file-saver';
import { ReportesVentasService } from '../service/reportesventas.service'; 
import { PrimeNGConfig } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-rep-planilla-cobranza',
  templateUrl: './rep-planilla-cobranza.component.html'
})
export class RepPlanillaCobranzaComponent implements OnInit {


  es = ConstantesGenerales.ES_CALENDARIO; 
  Pdf : any;
  Form : FormGroup;
  urlGenerate : any;  
  dataExel :IReporteExcel;
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  contenidoReporte : IReporte;

  constructor(
    private reporteService : ReportesVentasService,  
    private config : PrimeNGConfig,
    private dataformat : DatePipe,
    public sanitizer: DomSanitizer, 
    private generalService: GeneralService,
    private spinner : NgxSpinnerService
    
  ) {
    this.builform();
    }
  
  public builform(){ 
    this.Form = new FormGroup({ 
      fechaInicio : new FormControl(new Date),
      fechaFin : new FormControl(new Date), 
    })
  }

  ngOnInit(): void {
    this.config.setTranslation(this.es)  
  }
 
 
  onGenerarReporte(){ 
    const data = this.Form.value;  
    const Params = { 
      f1 :  this.dataformat.transform(data.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      f2 :  this.dataformat.transform(data.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      documento: -1,
      order : -1
    }  
    this.spinner.show();
    this.reporteService.generarReportePlanillaCobranza(Params).subscribe((resp) => { 
      if(resp){  
        this.contenidoReporte = resp 
        var blob = new Blob([this.onBase64ToArrayBuffer(this.contenidoReporte.contentBytes)], {type: "application/pdf"});
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
    const binary_string = window.atob(this.contenidoReporte.contentBytes);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    } 
    return bytes.buffer;
  }



 
  onGenerarExcel(){  
    const data = this.Form.value;  
    const Params = { 
      f1 :  this.dataformat.transform(data.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      f2 :  this.dataformat.transform(data.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
    } 
    this.reporteService.generarReporteExcelPlanillaCobranza(Params).subscribe((resp) => { 
      if(resp){  
        this.dataExel = resp;
        var blob = new Blob([this.onBase64ToArrayBufferExcel(this.dataExel.data)], {type: "application/xlsx"}); 
        saveAs(blob, "Reporte-Planilla-Cobranza.xlsx");  
      }
    }, error => {
      this.generalService.onValidarOtraSesion(error);  
    }); 
  }

  onBase64ToArrayBufferExcel(base64) {
    const binary_string = window.atob(this.dataExel.data);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    } 
    return bytes.buffer;
  }



}
