import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services'; 
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
  arrayMonedas : IReporteModalidad[];
  arrayEstablecimientos : ICombo[]; 
  arrayLinea : ICombo[];
  Form : FormGroup;
  fechaActual = new Date();

  constructor(
    private reporteService : ReportesAlmacenService, 
    public sanitizer: DomSanitizer,
    private spinner : NgxSpinnerService,
    private generalService : GeneralService
  ) {  
    this.builform();
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
  }

  public builform(){ 
    this.Form = new FormGroup({ 
     Moneda : new FormControl(  {nombre : 'SOLES', codigo: 'PEN'}),
     Modalidad : new FormControl(   {nombre : 'FISICO', codigo: 'Fisico'}),
     establecimientoId : new FormControl(null), 
     lineaid: new FormControl(null),   
    })
  }


  ngOnInit(): void { 
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
      {nombre : 'VALORIZADO', codigo: 'Valorizado'},
    ] 
  }

  onGenerarReporte(){
    const data = this.Form.value; 

    const params = {
      tipoPresentacion : 'PDF',  
      modalidad :  data.Modalidad,
      periodo : this.fechaActual.getFullYear(),
      establecimientoId : data.establecimientoId, 
      lineaid : data.lineaid,
      monedareporte: data.Moneda
    }
 

    this.spinner.show();
    this.reporteService.generarReporteStock(params).subscribe((resp) => { 
      if(resp){ 
        this.contenidoReporte = resp    
        var blob = new Blob([this.onBase64ToArrayBuffer(this.contenidoReporte.fileContent)], {type: "application/pdf"});
        const url = URL.createObjectURL(blob);    
        this.urlGenerate = url;
        this.Pdf= this.sanitizer.bypassSecurityTrustResourceUrl(this.urlGenerate); 
        this.spinner.hide();
      }    
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