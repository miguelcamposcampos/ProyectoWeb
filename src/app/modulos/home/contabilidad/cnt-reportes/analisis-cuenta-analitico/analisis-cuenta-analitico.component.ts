import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { IReporte } from '../../../almacen/a-mantenimientos/productos/interface/producto.interface';

@Component({
  selector: 'app-analisis-cuenta-analitico',
  templateUrl: './analisis-cuenta-analitico.component.html',
  styleUrls: ['./analisis-cuenta-analitico.component.scss']
})
export class AnalisisCuentaAnaliticoComponent implements OnInit {

  dataReporte :any   
  //fechayhoraImpresion = new FormControl(true);
  Pdf : any; 
  urlGenerate : any;
  contenidoReporte : IReporte; 

  constructor(
   // private reporteService : ReportesVentasService, 
    public sanitizer: DomSanitizer, 
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) { 
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
  }
  ngOnInit(): void {
  }


  
  onGenerarReporte(){ 
    const Params = {
      //fechayhora : this.fechayhoraImpresion.value,
      orderBy : -1,
      tipoPersona : 1
    } 
    this.spinner.show();
    // this.reporteService.generarReporteCliente(Params).subscribe((resp) => { 
    //   if(resp){ 
    //     this.contenidoReporte = resp 
    //     var blob = new Blob([this.onBase64ToArrayBuffer(this.contenidoReporte.contentBytes)], {type: "application/pdf"});
    //     const url = URL.createObjectURL(blob);    
    //     this.urlGenerate = url;
    //     this.Pdf= this.sanitizer.bypassSecurityTrustResourceUrl(this.urlGenerate); 
    //     this.spinner.hide();
    //   } 
    // });
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
