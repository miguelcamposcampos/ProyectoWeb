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
import { IReporte } from '../../../almacen/a-mantenimientos/productos/interface/producto.interface';
import { ReportesVentasService } from '../service/reportesventas.service';

@Component({
  selector: 'app-ventas-por-cliente-rep-resumen',
  templateUrl: './ventas-por-cliente-rep-resumen.component.html'
})
export class VentasPorClienteRepResumenComponent implements OnInit {
 
  modalBuscarPersona : boolean = false;
  existeClienteSeleccionado: boolean = false;
  es = ConstantesGenerales.ES_CALENDARIO; 
  Pdf : any;
  Form : FormGroup;
  urlGenerate : any;   
  arrayMonedas : ICombo[];
  contenidoReporte : IReporte;
  idClienteSeleccionado : number = 0;  

 
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
    this.generalService._hideSpinner$.subscribe(val => { 
      this.spinner.hide();
    });
  }

  public builform(){ 
    this.Form = new FormGroup({ 
      fechaInicio : new FormControl(new Date),
      fechaFin : new FormControl(new Date), 
      monedaid : new FormControl(null),
      nombreCliente : new FormControl(null)
    })
  }

  ngOnInit(): void {
    this.config.setTranslation(this.es)
    this.onCargarDropwdon(); 
  }


  onCargarDropwdon(){ 
    this.generalService.listadoPorGrupo('Monedas').subscribe((resp) => {
      if(resp){
        this.arrayMonedas = resp;    
      }
    }); 
  }
 
  

  onGenerarReporte(){  
    const data = this.Form.value;  
  
    const Params = { 
      f1 :  this.dataformat.transform(data.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      f2 :  this.dataformat.transform(data.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      cliente: this.idClienteSeleccionado,
      moneda : data.monedaid,
    } 

    this.spinner.show(); 
    this.reporteService.generarReporteVentaClienteResumen(Params).subscribe((resp) => { 
      if(resp){  
        this.contenidoReporte = resp 
        var blob = new Blob([this.onBase64ToArrayBuffer(this.contenidoReporte.contentBytes)], {type: "application/pdf"});
        const url = URL.createObjectURL(blob);    
        this.urlGenerate = url;
        this.Pdf= this.sanitizer.bypassSecurityTrustResourceUrl(this.urlGenerate); 
        this.spinner.hide();
      } 
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
        this.idClienteSeleccionado = null;
        this.Form.controls['nombreCliente'].setValue(null);
        this.existeClienteSeleccionado = false;
      }
    })
  }
}
