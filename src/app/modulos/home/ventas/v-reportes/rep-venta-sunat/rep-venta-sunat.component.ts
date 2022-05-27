import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api'; 
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ReportesVentasService } from '../service/reportesventas.service';
import * as XLSX from 'xlsx';   
import { saveAs } from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';    
import { IReporte, IReporteExcel } from '../../../almacen/a-mantenimientos/productos/interface/producto.interface';

@Component({
  selector: 'app-rep-venta-sunat',
  templateUrl: './rep-venta-sunat.component.html'
})
export class RepVentaSunatComponent implements OnInit {
 
  es = ConstantesGenerales.ES_CALENDARIO; 
  Pdf : any;
  Form : FormGroup;
  urlGenerate : any;
  arrayMonedas : ICombo[]
  dataExcel : any
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  contenidoReporte : IReporte;
  dataExel :IReporteExcel 

  constructor(
    private reporteService : ReportesVentasService,
    private generalService : GeneralService,
    private swal : MensajesSwalService,
    private config : PrimeNGConfig,
    private dataformat : DatePipe,
    public sanitizer: DomSanitizer, 
  ) {
    this.builform();
    }
  
  public builform(){ 
    this.Form = new FormGroup({ 
      fechaInicio : new FormControl(new Date),
      fechaFin : new FormControl(new Date),
      Moneda : new FormControl({id: 1, valor1: "SOLES", valor2: "PEN", valor3: 0, valor4: false}),
    })
  }

  ngOnInit(): void {
    this.config.setTranslation(this.es) 
    this.onCargarDropdown();
  }

  onCargarDropdown(){ 
    this.generalService.listadoPorGrupo('Monedas').subscribe((resp) => {
      if(resp){
        this.arrayMonedas = resp 
      } 
    });  
  }
 
  onGenerarReporte(){ 
    const data = this.Form.value;  
    const Params = { 
      f1 :  this.dataformat.transform(data.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      f2 :  this.dataformat.transform(data.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      moneda: data.Moneda.id, 
      order : -1
    } 
    this.swal.mensajePreloader(true); 
    this.reporteService.generarReporteVentaSunat(Params).subscribe((resp) => { 
      if(resp){  
        this.contenidoReporte = resp 
        var blob = new Blob([this.onBase64ToArrayBuffer(this.contenidoReporte.contentBytes)], {type: "application/pdf"});
        const url = URL.createObjectURL(blob);    
        this.urlGenerate = url;
        this.Pdf= this.sanitizer.bypassSecurityTrustResourceUrl(this.urlGenerate); 
      }
      this.swal.mensajePreloader(false);
    },error => { 
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
    //  moneda: data.Moneda.id,  
      moneda: -1 
    } 
    this.reporteService.generarExcelVentaSunat(Params).subscribe((resp) => {  
      if(resp){  
        this.dataExel = resp; 
        var blob = new Blob([this.onBase64ToArrayBufferExcel(this.dataExel.data)], {type: "application/xlsx"}); 
        saveAs(blob, "Reporte-Ventas-Sunat.xlsx");  
      }
    },error => { 
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
