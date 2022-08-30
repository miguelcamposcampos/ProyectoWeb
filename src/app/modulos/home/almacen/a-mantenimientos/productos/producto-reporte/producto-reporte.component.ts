import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IReporte } from '../interface/producto.interface';
import { ProductosService } from '../service/productos.service';
import { saveAs } from 'file-saver';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-producto-reporte',
  templateUrl: './producto-reporte.component.html'
})
export class ProductoReporteComponent   {

  @Output() cerrar : EventEmitter<boolean> = new EventEmitter<boolean>();

  contenidoReporte : IReporte;
  Pdf : any;
  urlGenerate : any;
  constructor(
    private productoService : ProductosService,
    public sanitizer:DomSanitizer,
    private swal : MensajesSwalService,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) { }
 
  onGenerarReporte(){
    this.spinner.show();
    this.productoService.generarReporte().subscribe((resp) => { 
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
    saveAs(blob, "Productos.pdf");
  }
 

  onRegresar(){
    this.cerrar.emit(false)
  }

  
}
