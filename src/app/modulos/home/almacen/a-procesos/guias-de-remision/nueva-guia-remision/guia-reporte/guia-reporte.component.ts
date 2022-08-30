import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IReporte } from '../../../../a-mantenimientos/productos/interface/producto.interface';
import { GuiaRemisionService } from '../../service/guiaremision.service';
import { saveAs } from 'file-saver';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-guia-reporte',
  templateUrl: './guia-reporte.component.html'
})
export class GuiaReporteComponent   {

  @Output() cerrar : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() dataReporte : any;
  contenidoReporte : IReporte;
  Pdf : any;
  urlGenerate : any;

  constructor(
    private guiasremisionService : GuiaRemisionService,
    public sanitizer: DomSanitizer, 
    private generalService : GeneralService,
    private spinner : NgxSpinnerService 
  ) { }
  
  onGenerarReporte(){
    const data = {
      guiaremisionid : this.dataReporte.guiaremisionid,
      nroregistro : this.dataReporte.nroRegistro
    }
    this.spinner.show();
    this.guiasremisionService.generarReporte(data).subscribe((resp) => { 
      if(resp){ 
        this.contenidoReporte = resp    
        var blob = new Blob([this.onBase64ToArrayBuffer(this.contenidoReporte.contentBytes)], {type: "application/pdf"});
        const url = URL.createObjectURL(blob);    
        this.urlGenerate = url;
        this.Pdf= this.sanitizer.bypassSecurityTrustResourceUrl(this.urlGenerate); 
        this.spinner.hide();
      }    
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
 
  
  onDescargar(){
    var blob = new Blob([this.onBase64ToArrayBuffer(this.contenidoReporte.contentBytes)], {type: "application/pdf"}); 
    saveAs(blob, "GuiaRemisión.pdf");
  }
 

  onRegresar(){
    this.cerrar.emit(false)
  }


}
