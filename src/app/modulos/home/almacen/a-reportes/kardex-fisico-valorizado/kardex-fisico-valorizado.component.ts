import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api'; 
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces'; 
import { GeneralService } from 'src/app/shared/services/generales.services'; 
import { IModuloReporte, IReporte } from '../../a-mantenimientos/productos/interface/producto.interface';
import { IReporteModalidad } from '../interface/reporte.interface';  
import { ReportesAlmacenService } from '../services/reporte.service';

@Component({
  selector: 'app-kardex-fisico-valorizado',
  templateUrl: './kardex-fisico-valorizado.component.html'
})
export class KardexFisicoValorizadoComponent implements OnInit {

  es = ConstantesGenerales.ES_CALENDARIO;
  contenidoReporte : IModuloReporte;
  Pdf : any;
  urlGenerate : any;
  arrayModalidad : IReporteModalidad[];
  arrayMonedas : IReporteModalidad[];
  arrayEstablecimientos : ICombo[]; 
  arrayLinea : ICombo[];
  Form : FormGroup;
 
  dataProductos :any;
  modalBuscarProducto : boolean = false;  

  constructor(
    private reporteService : ReportesAlmacenService, 
    public sanitizer: DomSanitizer,
    private spinner : NgxSpinnerService,
    private config : PrimeNGConfig,
    private dataform : DatePipe,
    private generalService : GeneralService,
    
  ) {
    this.builform();
   }

   public builform(){ 
     this.Form = new FormGroup({ 
      nombreProducto : new FormControl(null), 
      productoid : new FormControl(null), 
      establecimientoId : new FormControl(null), 
      lineaid: new FormControl(null),   
      fechaInicio : new FormControl(new Date),
      fechaFin : new FormControl(new Date),
      Moneda : new FormControl( {nombre : 'SOLES', codigo: 'PEN'}),
      Modalidad : new FormControl( {nombre : 'FISICO', codigo: 'Fisico'}),
     })
   }

  ngOnInit(): void {
    this.config.setTranslation(this.es) 
    this.onCargarCombos();
  }

  onCargarCombos(){ 

    this.generalService.listadoComboEstablecimientos().subscribe((resp) => { 
      if(resp){
        this.arrayEstablecimientos = resp;   
      } 
    });

    this.generalService.listadoLineas().subscribe((resp) => { 
      if(resp){
        this.arrayLinea = resp;   
      } 
    }); 

    this.arrayMonedas = [
      {nombre : 'SOLES', codigo: 'PEN'},
      {nombre : 'DOLARES', codigo: 'USD'}, 
    ]

    this.arrayModalidad = [
      {nombre : 'FISICO', codigo: 'Fisico'},
      {nombre : 'FISICO-SUNAT', codigo: 'FisicoSUNAT'},
      {nombre : 'VALORIZADO', codigo: 'Valorizado'},
      {nombre : 'VALORIZADO-SUNAT', codigo: 'ValorizadoSUNAT'}
    ] 
  }


  onGenerarReporte(){
    const data = this.Form.value;
  //  let moneda = data.Moneda ? data.Moneda.codigo : 'PEN'
 //   let modalidad  = data.Modalidad ? data.Modalidad.codigo : 'Fisico'
    const params = {
      tipoPresentacion : 'PDF', 
      monedareporte: data.Moneda,
      f1 :  this.dataform.transform(data.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      f2 :  this.dataform.transform(data.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      establecimientoId : data.establecimientoId,
      productoid : data.productoid,
      lineaid :  data.lineaid,
      modalidad : data.Modalidad
    } 

    this.spinner.show();
    this.reporteService.generarReporteKardex(params).subscribe((resp) => { 
      if(resp){ 
        this.contenidoReporte = resp    
        var blob = new Blob([this.onBase64ToArrayBuffer(this.contenidoReporte.fileContent)], {type: "application/pdf"});
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
    const binary_string = window.atob(this.contenidoReporte.fileContent);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    } 
    return bytes.buffer;
  }
 

  onModalBuscarProducto(){   
    this.dataProductos = { idAlmacenSelect : -1 };
    this.modalBuscarProducto = true;
  }

  onPintarProductoSeleccionado(event : any){  
    this.modalBuscarProducto= false;  
    this.Form.controls['nombreProducto'].setValue(event.data.nombreProducto);
    this.Form.controls['productoid'].setValue(event.data.productoId); 
  }

}
