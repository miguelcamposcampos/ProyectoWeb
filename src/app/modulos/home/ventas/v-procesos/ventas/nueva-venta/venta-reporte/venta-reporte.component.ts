import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'; 
import { VentasService } from '../../service/venta.service';
import { saveAs } from 'file-saver';
import { IModuloReporte } from 'src/app/modulos/home/almacen/a-mantenimientos/productos/interface/producto.interface';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-venta-reporte',
  templateUrl: './venta-reporte.component.html'
})
export class VentaReporteComponent  {

  
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  @Input() dataReporte : any;
  contenidoReporte : IModuloReporte;
  Pdf : any;
  urlGenerate : any;

  constructor(
    private ventasService : VentasService,
    public sanitizer: DomSanitizer,
    private spinner : NgxSpinnerService,
    private generalService: GeneralService,
    
  ) { }

 
  
  onGenerarReporte(){
    this.spinner.show(); 
    this.ventasService.generarReporte(this.dataReporte.ventaid).subscribe((resp) => { 
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
 
  
  onDescargar(){
    var blob = new Blob([this.onBase64ToArrayBuffer(this.contenidoReporte.fileContent)], {type: "application/pdf"}); 
    saveAs(blob, "Venta.pdf");
  }
 

  onRegresar(){
    this.cerrar.emit(false)
  }

}
