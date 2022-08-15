import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { IModuloReporteContabilidad, IReporte } from '../../../almacen/a-mantenimientos/productos/interface/producto.interface';
import { ReportesContabilidadService } from '../service/reportescontabilidad';

@Component({
  selector: 'app-analisis-cuenta-analitico',
  templateUrl: './analisis-cuenta-analitico.component.html',
  styleUrls: ['./analisis-cuenta-analitico.component.scss']
})
export class AnalisisCuentaAnaliticoComponent implements OnInit {

 
  dataReporte :any   
  Form : FormGroup;
  Pdf : any; 
  urlGenerate : any;
  contenidoReporte : IModuloReporteContabilidad; 
  es = ConstantesGenerales.ES_CALENDARIO; 
  existeAnexoSeleccionado
  modalBuscarAnexo : boolean = false;
  ArrayNivel: any[];

  constructor(
   // private reporteService : ReportesVentasService, 
    public sanitizer: DomSanitizer, 
    private generalService : GeneralService,
    private spinner : NgxSpinnerService,
    private config : PrimeNGConfig,
    private dataformat : DatePipe,
    private reporteService : ReportesContabilidadService
  ) { 
    this.builform();
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })

    this.ArrayNivel = [
      {nombre : 'PorAnexo'},
      {nombre : 'PorDocumento'},
    ]
  }

  public builform(){ 
    this.Form = new FormGroup({ 
      fechaHasta : new FormControl(new Date),  
      nrodocanexo : new FormControl(""),
      agrupamiento : new FormControl(null),
      solocondetalle : new FormControl(false),
    })
  }

  ngOnInit(): void {
    this.config.setTranslation(this.es)
  }
 
  onGenerarReporte(){ 
    const data = this.Form.value;  
  
    const Params = { 
      fechaHasta : this.dataformat.transform(data.fechaHasta, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      nrodocanexo:  data.nrodocanexo,
      solocondetalle : data.solocondetalle,
      agrupamiento : data.agrupamiento.nombre,
      tipoPresentacion : 'PDF'
    } 
  
    this.spinner.show();
    this.reporteService.generarReporteAnalisisCuentaAnalitico(Params).subscribe((resp) => { 
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
 
  onModalBuscarAnexo(){
    this.modalBuscarAnexo = true;
  }

  onBorrarAnexo(){
    this.Form.controls['nrodocanexo'].setValue("");
    this.existeAnexoSeleccionado = false;
  }

  onPintarAnexo(data:any){
    console.log('data',data);
    this.Form.controls['nrodocanexo'].setValue(data.nroDocumento);
    this.existeAnexoSeleccionado = true;
    this.modalBuscarAnexo = false;
  }
   

 
}
