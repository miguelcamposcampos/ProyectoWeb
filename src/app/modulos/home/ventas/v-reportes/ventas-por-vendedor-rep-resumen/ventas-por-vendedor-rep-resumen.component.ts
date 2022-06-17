import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api'; 
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ReportesVentasService } from '../service/reportesventas.service'; 
import { DomSanitizer } from '@angular/platform-browser';    
import { IReporte } from '../../../almacen/a-mantenimientos/productos/interface/producto.interface';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-ventas-por-vendedor-rep-resumen',
  templateUrl: './ventas-por-vendedor-rep-resumen.component.html'
})
export class VentasPorVendedorRepResumenComponent implements OnInit {

  es = ConstantesGenerales.ES_CALENDARIO; 
  Pdf : any;
  Form : FormGroup;
  urlGenerate : any;
  arrayMonedas : ICombo[] 
  contenidoReporte : IReporte;

  constructor(
    private reporteService : ReportesVentasService,
    private generalService : GeneralService,
    private swal : MensajesSwalService,
    private config : PrimeNGConfig,
    private dataformat : DatePipe,
    public sanitizer: DomSanitizer, 
    private spinner : NgxSpinnerService
  ) {
    this.builform();
    }
  
  public builform(){ 
    this.Form = new FormGroup({ 
      fechaInicio : new FormControl(new Date),
      fechaFin : new FormControl(new Date),
      Moneda : new FormControl({id: 1, valor1: "SOLES", valor2: "PEN", valor3: 0, valor4: false}),
    })
  }

  ngOnInit(): void {
    this.config.setTranslation(this.es)
    this.onCargarDropdown(); 
  }

  onCargarDropdown(){ 
    this.generalService.listadoPorGrupo('Monedas').subscribe((resp) => {
      if(resp){
        this.arrayMonedas = resp 
      } 
    });  
  }
 
  onGenerarReporte(){ 
    const data = this.Form.value;  
    const Params = { 
      f1 :  this.dataformat.transform(data.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      f2 :  this.dataformat.transform(data.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      moneda: data.Moneda.id,  
    } 
    this.spinner.show();
    this.reporteService.generarReporteVendedorResumen(Params).subscribe((resp) => { 
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
 
  
}
