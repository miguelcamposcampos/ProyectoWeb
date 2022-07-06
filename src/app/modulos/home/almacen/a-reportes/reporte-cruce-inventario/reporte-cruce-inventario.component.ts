import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services'; 
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IModuloReporte } from '../../a-mantenimientos/productos/interface/producto.interface';
import { ReportesAlmacenService } from '../services/reporte.service';

@Component({
  selector: 'reporte-cruce-inventario',
  templateUrl: './reporte-cruce-inventario.component.html',
  styles: [
  ]
})
export class ReporteCruceInventarioComponent implements OnInit {

  es = ConstantesGenerales.ES_CALENDARIO;
  contenidoReporte : IModuloReporte;
  Pdf : any;
  urlGenerate : any;
  arrayAlmacen : ICombo[]; 
  arrayLinea : ICombo[];

  Form : FormGroup;

  dataProductos :any;
  modalBuscarProducto : boolean = false;  

  constructor(
    private reporteService : ReportesAlmacenService, 
    private generalService : GeneralService,
    public sanitizer: DomSanitizer, 
    private config : PrimeNGConfig,
    private dataform : DatePipe,
    private spinner : NgxSpinnerService,
    private swal : MensajesSwalService
  ) {
    this.builform();
  }
  
  public builform(){ 
    this.Form = new FormGroup({ 
    fechaInicio : new FormControl(new Date),
    fechaFin : new FormControl(new Date),
    Almacen : new FormControl(null), 
    lineaid: new FormControl(null),  
    nombreProducto : new FormControl(null), 
    codigoProducto : new FormControl(null), 
    })
  }

  ngOnInit(): void {
    this.config.setTranslation(this.es) 
    this.onCargarCombos();
  }

  onCargarCombos(){ 
    this.generalService.listadoAlmacenes().subscribe((resp) =>{
      if(resp){ 
        this.arrayAlmacen = resp;
      }
    })

    this.generalService.listadoLineas().subscribe((resp) => { 
      if(resp){
        this.arrayLinea = resp;   
      } 
    }); 


  }


  onGenerarReporte(){
    const data = this.Form.value; 
    const params = {
      tipoPresentacion : 'PDF', 
      f1 :  this.dataform.transform(data.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      f2 :  this.dataform.transform(data.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      almacen: data.Almacen ? data.Almacen.id : -1,
      codigoProducto : data.codigoProducto,
      lineaid : data.lineaid,
    } 

    this.spinner.show();
    this.reporteService.generarReporteCruceInventario(params).subscribe((resp) => { 
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
     const data = this.Form.value;  
     if(!data.Almacen.id){
      this.swal.mensajeAdvertencia('Debes seleccionar un almacen');
     }
     const dataProducto = {
       idAlmacenSelect : data.Almacen.id,
     //  idAlmacenSelect : data.Almacen ? data.Almacen.id : -1,
       idPosicionProducto : null
     }
     this.dataProductos = dataProducto;
     this.modalBuscarProducto = true;
   }
 
   onPintarProductoSeleccionado(event : any){  
     this.modalBuscarProducto= false;  
     this.Form.controls['nombreProducto'].setValue(event.data.nombreProducto);
     this.Form.controls['codigoProducto'].setValue(event.data.codProducto); 
   }

 
}
