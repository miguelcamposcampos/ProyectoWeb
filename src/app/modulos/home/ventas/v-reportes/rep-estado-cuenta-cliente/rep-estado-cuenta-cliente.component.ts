import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PrimeNGConfig } from 'primeng/api';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IReporte, IReporteExcel } from '../../../almacen/a-mantenimientos/productos/interface/producto.interface';
import { ReportesVentasService } from '../service/reportesventas.service';
import * as XLSX from 'xlsx';   
import { saveAs } from 'file-saver';
import { GeneralService } from 'src/app/shared/services/generales.services';

@Component({
  selector: 'app-rep-estado-cuenta-cliente',
  templateUrl: './rep-estado-cuenta-cliente.component.html'
})
export class RepEstadoCuentaClienteComponent implements OnInit {

  modalBuscarPersona : boolean = false;
  existeClienteSeleccionado: boolean = false;
  es = ConstantesGenerales.ES_CALENDARIO; 
  Pdf : any;
  Form : FormGroup;
  urlGenerate : any; 
  dataExcel : any
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  contenidoReporte : IReporte;
  idClienteSeleccionado : number = 0;
  dataExel :IReporteExcel
  constructor(
    private reporteService : ReportesVentasService, 
    private swal : MensajesSwalService,
    private config : PrimeNGConfig,
    private dataformat : DatePipe,
    public sanitizer: DomSanitizer, 
    private generalService : GeneralService
  ) {
    this.builform();
  }

  public builform(){ 
    this.Form = new FormGroup({ 
      fechaInicio : new FormControl(new Date),
      fechaFin : new FormControl(new Date),
      nombreCliente : new FormControl(null)
    })
  }

  ngOnInit(): void {
    this.config.setTranslation(this.es)
  }


 
  onGenerarReporte(){ 
    const data = this.Form.value;

    if(!this.idClienteSeleccionado ){
      this.swal.mensajeAdvertencia('Seleccionar un Cliente para emitir el reporte!.');
      return;
    }

    const Params = { 
      f1 :  this.dataformat.transform(data.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      f2 :  this.dataformat.transform(data.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      cliente: this.idClienteSeleccionado  
    } 

    this.swal.mensajePreloader(true); 
    this.reporteService.generarReporteEstadoCuentaCliente(Params).subscribe((resp) => { 
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



 
  onGenerarExcel(){  
    const data = this.Form.value;  
    const Params = { 
      f1 :  this.dataformat.transform(data.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      f2 :  this.dataformat.transform(data.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA), 
    } 
    this.reporteService.generarReporteExcelEstadoCuentaCliente(Params).subscribe((resp) => { 
      if(resp){  
        this.dataExel = resp;
        var blob = new Blob([this.onBase64ToArrayBufferExcel(this.dataExel.data)], {type: "application/xlsx"}); 
        saveAs(blob, "Reporte-Estado-Cuenta-Cliente.xlsx");  
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }


  onBase64ToArrayBufferExcel(base64) {
    const binary_string = window.atob(this.dataExel.data);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    } 
    return bytes.buffer;
  }



  onModalBuscarCliente(){
    this.modalBuscarPersona = true;
  }

  onPintarPersonaSeleccionada(event : any){   
    this.idClienteSeleccionado = event.idCliente,
    this.Form.controls['nombreCliente'].setValue(event.nombreRazSocial); 
    this.existeClienteSeleccionado = true;
    this.modalBuscarPersona= false;
  }

  onBorrarCliente(){
    this.swal.mensajePregunta('¿Seguro de quitar al cliente actual?').then((response) => {
      if (response.isConfirmed) {
        this.idClienteSeleccionado = 0;
        this.Form.controls['nombreCliente'].setValue(null);
        this.existeClienteSeleccionado = false;
      }
    })
  }

}