import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PrimeNGConfig } from 'primeng/api';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IModuloReporte } from '../../a-mantenimientos/productos/interface/producto.interface';
import { IReporteModalidad } from '../interface/reporte.interface'; 
import { ReportesAlmacenService } from '../services/reporte.service';

@Component({
  selector: 'app-reporte-ingresos-almacen',
  templateUrl: './reporte-ingresos-almacen.component.html'
})
export class ReporteIngresosAlmacenComponent implements OnInit {

  
  es = ConstantesGenerales.ES_CALENDARIO;
  contenidoReporte : IModuloReporte;
  Pdf : any;
  urlGenerate : any;
  arrayAgrupado : IReporteModalidad[]; 
  Form : FormGroup;

 
  constructor(
    private reporteService : ReportesAlmacenService, 
    public sanitizer: DomSanitizer,
    private swal : MensajesSwalService,
    private config : PrimeNGConfig,
    private dataform : DatePipe,
    private generalService : GeneralService
  ) {
    this.builform();
   }

   public builform(){ 
     this.Form = new FormGroup({ 
      fechaInicio : new FormControl(new Date),
      fechaFin : new FormControl(new Date), 
      Agrupado : new FormControl(null),
     })
   }

  ngOnInit(): void {
    this.config.setTranslation(this.es) 
    this.onCargarCombos();
  }

  onCargarCombos(){  
    this.arrayAgrupado = [
      {nombre : 'PRODUCTO', codigo: 'Producto'},
      {nombre : 'LINEA', codigo: 'Linea'},
      {nombre : 'PROVEEDOR', codigo: 'Cliente'}, 
    ]
  }

  
  onGenerarReporte(){
    const data = this.Form.value; 
    let agrupador  = data.Agrupado ? data.Agrupado.codigo : ''
    const params = {
      tipoPresentacion : 'PDF', 
      tipoMovimiento : 1,
      f1 :  this.dataform.transform(data.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      f2 :  this.dataform.transform(data.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      agrupador : agrupador
    }
 
    this.swal.mensajePreloader(true); 
    this.reporteService.generarReporteIngresosySalidasAlmacen(params).subscribe((resp) => { 
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
