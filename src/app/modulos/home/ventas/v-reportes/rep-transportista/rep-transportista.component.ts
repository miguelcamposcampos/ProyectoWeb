import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IReporte } from '../../../almacen/a-mantenimientos/productos/interface/producto.interface';
import { ReportesVentasService } from '../service/reportesventas.service';

@Component({
  selector: 'app-rep-transportista',
  templateUrl: './rep-transportista.component.html'
})
export class RepTransportistaComponent  {

  dataReporte :any   
  busConChofer = new FormControl(false);
  busConUnidadTransporte = new FormControl(false);
  fechayhoraImpresion = new FormControl(true);

  Pdf : any; 
  urlGenerate : any;
  contenidoReporte : IReporte;

  constructor(
    private reporteService : ReportesVentasService,
    private swal : MensajesSwalService,
    public sanitizer: DomSanitizer, 
    private generalService: GeneralService
  ) { }

 
  onGenerarReporte(){ 
    const Params = {
      fechayhora : this.fechayhoraImpresion.value,
      chofer : this.busConChofer.value,
      ut : this.busConUnidadTransporte.value,
      
    }
    this.swal.mensajePreloader(true); 
    this.reporteService.generarReporteTransportista(Params).subscribe((resp) => { 
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



}
