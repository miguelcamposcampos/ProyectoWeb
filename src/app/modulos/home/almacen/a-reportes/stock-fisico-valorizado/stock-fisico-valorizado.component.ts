import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser'; 
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IModuloReporte } from '../../a-mantenimientos/productos/interface/producto.interface';
import { IReporteModalidad } from '../interface/reporte.interface'; 
import { ReportesAlmacenService } from '../services/reporte.service';

@Component({
  selector: 'app-stock-fisico-valorizado',
  templateUrl: './stock-fisico-valorizado.component.html'
})
export class StockFisicoValorizadoComponent implements OnInit {
 
  contenidoReporte : IModuloReporte;
  Pdf : any;
  urlGenerate : any;
  arrayModalidad : IReporteModalidad[];
  arrayMonedas : IReporteModalidad[]
  Form : FormGroup;
  fechaActual = new Date();

  constructor(
    private reporteService : ReportesAlmacenService, 
    public sanitizer: DomSanitizer,
    private swal : MensajesSwalService,
    private generalService : GeneralService
  ) {  
    this.builform();
  }

  public builform(){ 
    this.Form = new FormGroup({ 
     Moneda : new FormControl(null),
     Modalidad : new FormControl(null),
    })
  }


  ngOnInit(): void { 
    this.onCargarCombos();
  }

  onCargarCombos(){ 
    this.arrayMonedas = [
      {nombre : 'SOLES', codigo: 'PEN'},
      {nombre : 'DOLARES', codigo: 'USD'}, 
    ]

    this.arrayModalidad = [
      {nombre : 'FISICO', codigo: 'Fisico'},
      {nombre : 'VALORIZADO', codigo: 'Valorizado'},
    ] 
  }

  onGenerarReporte(){
    const data = this.Form.value;
   
    let moneda = data.Moneda ? data.Moneda.codigo : 'PEN'
    let modalidad  = data.Modalidad ? data.Modalidad.codigo : 'Fisico'
    const params = {
      tipoPresentacion : 'PDF',  
      periodo : this.fechaActual.getFullYear(),
      monedareporte: moneda,
      modalidad : modalidad
    }
 

    this.swal.mensajePreloader(true); 
    this.reporteService.generarReporteStock(params).subscribe((resp) => { 
      if(resp){ 
        this.contenidoReporte = resp    
        var blob = new Blob([this.onBase64ToArrayBuffer(this.contenidoReporte.fileContent)], {type: "application/pdf"});
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
    const binary_string = window.atob(this.contenidoReporte.fileContent);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    } 
    return bytes.buffer;
  }

}