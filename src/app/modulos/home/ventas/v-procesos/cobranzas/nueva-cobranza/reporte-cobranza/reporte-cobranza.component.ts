import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { IReporte } from 'src/app/modulos/home/almacen/a-mantenimientos/productos/interface/producto.interface';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { CobranzaService } from '../../service/cobranza.service';
import { saveAs } from 'file-saver';
import { GeneralService } from 'src/app/shared/services/generales.services';


@Component({
  selector: 'app-reporte-cobranza',
  templateUrl: './reporte-cobranza.component.html',
  styleUrls: ['./reporte-cobranza.component.scss']
})
export class ReporteCobranzaComponent  {

  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  @Input() dataReporte : any;
  contenidoReporte : IReporte;
  Pdf : any;
  urlGenerate : any;


  constructor(
    private cobranzaService : CobranzaService,
    public sanitizer: DomSanitizer,
    private swal : MensajesSwalService,
    private generalService : GeneralService
  ) { }
 
  
  onGenerarReporte(){
    const data = {
      fechaHora : true,
      cobranzaID : this.dataReporte.cobranzaid,
      correlativo : this.dataReporte.nroRegistro
    }
    this.swal.mensajePreloader(true);
    this.cobranzaService.generarReporte(data).subscribe((resp) => { 
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
 
  
  onDescargar(){
    var blob = new Blob([this.onBase64ToArrayBuffer(this.contenidoReporte.contentBytes)], {type: "application/pdf"}); 
    saveAs(blob, "Productos.pdf");
  }
 

  onRegresar(){
    this.cerrar.emit(false)
  }


}
