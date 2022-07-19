import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IModuloReporte } from 'src/app/modulos/home/almacen/a-mantenimientos/productos/interface/producto.interface'; 
import { PedidoService } from '../service/pedido.service';
import { saveAs } from 'file-saver';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-reporte-pedido',
  templateUrl: './reporte-pedido.component.html'
})
export class ReportePedidoComponent  {

  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  @Input() dataReporte : any;
  contenidoReporte : IModuloReporte;
  Pdf : any;
  urlGenerate : any;

  constructor(
    private pedidoService : PedidoService,
    public sanitizer: DomSanitizer, 
    private generalService: GeneralService,
    private spinner : NgxSpinnerService
  ) { }

 
  
  onGenerarReporte(){
    this.spinner.show(); 
    this.pedidoService.generarReporte(this.dataReporte.pedidoid).subscribe((resp) => { 
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
    saveAs(blob, "Pedido.pdf");
  }
 

  onRegresar(){
    this.cerrar.emit(false)
  }

}
