import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services'; 
import { IModuloReporte } from '../../../almacen/a-mantenimientos/productos/interface/producto.interface';
import { ReportesComprasService } from '../service/reportescompras.service';


@Component({
  selector: 'app-compra-producto-resumen',
  templateUrl: './compra-producto-resumen.component.html'
})
export class CompraProductoResumenComponent implements OnInit {
  es = ConstantesGenerales.ES_CALENDARIO;
  contenidoReporte : IModuloReporte;
  Pdf : any; 
  Form : FormGroup;
  dataProductos :any;
  modalBuscarProducto : boolean = false;  

  constructor(
    private reporteService : ReportesComprasService, 
    public sanitizer: DomSanitizer, 
    private config : PrimeNGConfig,
    private dataform : DatePipe,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) {
    this.builform();
  }
  
  public builform(){ 
    this.Form = new FormGroup({ 
      nombreProducto : new FormControl(null), 
      productoid : new FormControl(null), 
      fechaInicio : new FormControl(new Date),
      fechaFin : new FormControl(new Date),  
    })
  }

  ngOnInit(): void {
    this.config.setTranslation(this.es) 
  }
 
  onGenerarReporte(){
    const data = this.Form.value;  
    const params = {
      tipoPresentacion : 'PDF',  
      f1 :  this.dataform.transform(data.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      f2 :  this.dataform.transform(data.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA), 
      productoid : data.productoid,
    }
  
    this.spinner.show();
    this.reporteService.generarReporteProductoResumen(params).subscribe((resp) => { 
      if(resp){ 
        this.contenidoReporte = resp    
        var blob = new Blob([this.onBase64ToArrayBuffer(this.contenidoReporte.fileContent)], {type: "application/pdf"});
        const url = URL.createObjectURL(blob);     
        this.Pdf= this.sanitizer.bypassSecurityTrustResourceUrl(url); 
        this.spinner.hide();
      }    
    },error => { 
      this.spinner.hide();
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
 
  onModalBuscarProducto(){ 
    this.dataProductos = { idAlmacenSelect : -1};
    this.modalBuscarProducto = true;
  }

  onPintarProductoSeleccionado(event : any){  
    this.modalBuscarProducto= false;  
    this.Form.controls['nombreProducto'].setValue(event.data.nombreProducto);
    this.Form.controls['productoid'].setValue(event.data.productoId); 
  }


}