import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IListarDocumentos } from './interface/documentos.interface';
import { DocumentosService } from './servicio/documentos.service';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html'
})
export class DocumentosComponent implements OnInit {

  cols: InterfaceColumnasGrilla[] =[];
  modalNuevoDocumento : boolean = false;
  dataDocumento : IListarDocumentos;
  listaDocumentos : IListarDocumentos[]; 
  nombre = new FormControl('');
  siglas = new FormControl('');


  constructor(
    private documentosServices: DocumentosService,
    private swal : MensajesSwalService,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) { }

 
  ngOnInit(): void {
    this.onLoadDocumentos();
    this.cols = [ 
      { field: 'documentoid', header: 'N°', visibility: true }, 
      { field: 'siglasdocumento', header: 'Siglas', visibility: true }, 
      { field: 'nombre', header: 'Nombre', visibility: true},   
      { field: 'esadelanto', header: '¿Adelanto?', visibility: true, tipoFlag: 'boolean'},     
      { field: 'escajabanco', header: '¿Caja Banco?', visibility: true, tipoFlag: 'boolean'},     
      { field: 'usadorecibohonorario', header: '¿Usa RRxHH?', visibility: true, tipoFlag: 'boolean'},     
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ]; 
  }


  
  onNuevo(){ 
    this.dataDocumento = null;
    this.modalNuevoDocumento = true;
  }

  onEditar(data : any){ 
    this.dataDocumento = data;
    this.modalNuevoDocumento = true;
  }

  onEliminar(data:any){
    this.swal.mensajePregunta("¿Seguro que desea eliminar el documento " + data.nombre + " ?").then((response) => {
      if (response.isConfirmed) {
        this.swal.mensajeExito('El documento se ha sido eliminado correctamente!.'); 
        this.documentosServices.deleteDocumento(data.idFormaPago).subscribe((resp) => {
          if(resp){
            this.onLoadDocumentos();
          }
        },error => { 
          this.generalService.onValidarOtraSesion(error);  
        });
      }
    })  
  }
 
  onLoadDocumentos(){ 
   const data = {
     nombre : this.nombre.value,
     siglas : this.siglas.value
   }
 
   this.spinner.show();
    this.documentosServices.listadoDocumentos(data).subscribe((resp) => {
      if(resp){
        this.listaDocumentos = resp; 
        this.spinner.hide();
      }
    },error => {  
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  
  onRetornar(event: any){ 
    if(event === 'exito'){
      this.onLoadDocumentos();
    } 
    this.modalNuevoDocumento = false; 
  }


}
