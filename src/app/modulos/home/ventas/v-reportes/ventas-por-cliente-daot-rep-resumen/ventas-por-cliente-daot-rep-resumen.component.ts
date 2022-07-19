import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';    
import { FormControl, FormGroup } from '@angular/forms';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { IModuloReporte, IReporte } from '../../../almacen/a-mantenimientos/productos/interface/producto.interface';
import { ReportesVentasService } from '../service/reportesventas.service'; 
import { PrimeNGConfig } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-ventas-por-cliente-daot-rep-resumen',
  templateUrl: './ventas-por-cliente-daot-rep-resumen.component.html'
})
export class VentasPorClienteDAOTRepResumenComponent implements OnInit {
 
  es = ConstantesGenerales.ES_CALENDARIO; 
  Pdf : any;
  Form : FormGroup;
  urlGenerate : any;  
  dataExcel : any
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  contenidoReporte : IModuloReporte;

  constructor(
    private reporteService : ReportesVentasService,  
    private config : PrimeNGConfig,
    private dataformat : DatePipe,
    public sanitizer: DomSanitizer,
    private generalService: GeneralService,
    private spinner : NgxSpinnerService
  ) { 
    this.builform();
    this.generalService._hideSpinner$.subscribe(val => { 
      this.spinner.hide();
    });
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
      presentacion: 'PDF'
    } 
    this.spinner.show();
    this.reporteService.generarReporteVxCDAOTresumen(Params).subscribe((resp) => { 
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
