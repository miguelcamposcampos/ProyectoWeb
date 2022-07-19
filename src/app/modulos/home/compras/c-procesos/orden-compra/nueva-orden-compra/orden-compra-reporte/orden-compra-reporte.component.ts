import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service'; 
import { saveAs } from 'file-saver';
import { OrdenCompraService } from '../../service/ordencompraService';
import { IModuloReporte } from 'src/app/modulos/home/almacen/a-mantenimientos/productos/interface/producto.interface';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-orden-compra-reporte',
  templateUrl: './orden-compra-reporte.component.html'
})
export class OrdenCompraReporteComponent   {
 
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  @Input() dataReporte : any;
  contenidoReporte : IModuloReporte;
  Pdf : any;
  urlGenerate : any;
 
  constructor(
    private ocService : OrdenCompraService,
    public sanitizer: DomSanitizer,
    private swal : MensajesSwalService,
    private generalService: GeneralService,
    private spinner : NgxSpinnerService
  ) { }
 
  onGenerarReporte(){ 
    const data = {
     tipo : 'PDF',
     idOrdenCompra : this.dataReporte.compraid
    }
    this.spinner.show();
    this.ocService.generarReporte(data).subscribe((resp) => { 
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
    saveAs(blob, "OrdenCompra.pdf");
  }
 

  onRegresar(){
    this.cerrar.emit(false)
  }


}
