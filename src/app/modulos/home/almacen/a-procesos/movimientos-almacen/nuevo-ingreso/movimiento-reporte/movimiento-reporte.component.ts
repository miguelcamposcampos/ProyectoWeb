import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IReporte } from '../../../../a-mantenimientos/productos/interface/producto.interface';
import { MovimientosAlmacenService } from '../../service/movimientosalmacen.service';
import { saveAs } from 'file-saver';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-movimiento-reporte',
  templateUrl: './movimiento-reporte.component.html',
  styleUrls: ['./movimiento-reporte.component.scss']
})
export class MovimientoReporteComponent {

  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  @Input() dataReporte : any;
  contenidoReporte : IReporte;
  Pdf : any;
  urlGenerate : any;

  constructor(
    private movialmacenService : MovimientosAlmacenService,
    public sanitizer: DomSanitizer, 
    private generalService : GeneralService,
    private spinner : NgxSpinnerService, 
  ) { }
 
  onGenerarReporte(){ 
    this.spinner.show();
    const data = {
     fechaHora : true,
     idMovimiento : this.dataReporte.movimientoid,
     nroRegistro : this.dataReporte.nroRegistro
    }
    this.movialmacenService.generarReporte(data).subscribe((resp) => { 
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
 
  
  onDescargar(){
    var blob = new Blob([this.onBase64ToArrayBuffer(this.contenidoReporte.contentBytes)], {type: "application/pdf"}); 
    saveAs(blob, "Productos.pdf");
  }
 

  onRegresar(){
    this.cerrar.emit(false)
  }

}
