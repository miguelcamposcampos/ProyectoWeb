import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser'; 
import { IReporte, IReporteExcel } from '../../../almacen/a-mantenimientos/productos/interface/producto.interface';
import { ReportesVentasService } from '../service/reportesventas.service'; 
import { saveAs } from 'file-saver';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-rep-cliente',
  templateUrl: './rep-cliente.component.html'
})
export class RepClienteComponent  {

  dataReporte :any   
  fechayhoraImpresion = new FormControl(true);
  Pdf : any; 
  urlGenerate : any;
  contenidoReporte : IReporte;
  dataExel :IReporteExcel
  
  constructor(
    private reporteService : ReportesVentasService, 
    public sanitizer: DomSanitizer, 
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) { }

 
  onGenerarReporte(){ 
    const Params = {
      fechayhora : this.fechayhoraImpresion.value,
      orderBy : -1,
      tipoPersona : 0
    } 
    this.spinner.show();
    this.reporteService.generarReporteCliente(Params).subscribe((resp) => { 
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

  GenerarExcel(){
    const Params = {
      fechayhora : this.fechayhoraImpresion.value,
      orderBy : -1
    }
    this.reporteService.generarReporteExcelCliente(Params).subscribe((resp) => {  
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
