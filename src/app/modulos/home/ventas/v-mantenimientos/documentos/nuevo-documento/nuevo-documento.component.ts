import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IListarDocumentos } from '../interface/documentos.interface';
import { DocumentosService } from '../servicio/documentos.service';

@Component({
  selector: 'app-nuevo-documento',
  templateUrl: './nuevo-documento.component.html',
  styleUrls: ['./nuevo-documento.component.scss']
})
export class NuevoDocumentoComponent implements OnInit {

  @Input() dataDocumento : any;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  Form : FormGroup;
  DocumentoEditar : IListarDocumentos 

  constructor(
    private documentoService : DocumentosService,
    private swal : MensajesSwalService,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) { 
    this.builform();
  }

  public builform(){
    this.Form = new FormGroup({
      codigo : new FormControl('', Validators.required),
      siglas : new FormControl('', Validators.required),
      nombre : new FormControl('', Validators.required),
      contable: new FormControl(false),
      notacredito: new FormControl(false),
      compra: new FormControl(false),
      venta: new FormControl(false),
      pedido: new FormControl(false),
      recibohonorario: new FormControl(false),
      cotizacion : new FormControl(false),
      ordencompra : new FormControl(false),
      guiaremision : new FormControl(false),
      anticipo : new FormControl(false),
      muevestock : new FormControl(false),
      requerido : new FormControl(false),
      sunat : new FormControl(false),
      notaingalmacen : new FormControl(false),
      notasalalmacen : new FormControl(false),
      cajabanco : new FormControl(false), 
    })
  }
 
  ngOnInit(): void { 
    if(this.dataDocumento){
      this.spinner.show();
      this.onObtnerDocumentoPorId();
    }
  }

  onObtnerDocumentoPorId(){  
    this.documentoService.DocumentoPorId(this.dataDocumento.documentoid).subscribe((resp)=> {
      if(resp){
        this.DocumentoEditar = resp;
        this.Form.patchValue({
          codigo : this.DocumentoEditar.documentoid,
          nombre : this.DocumentoEditar.nombre,
          siglas : this.DocumentoEditar.siglasdocumento,
          anticipo : this.DocumentoEditar.esanticipo,
          cajabanco : this.DocumentoEditar.escajabanco,
          contable: this.DocumentoEditar.escontable,
          cotizacion : this.DocumentoEditar.escotizacion,
          sunat : this.DocumentoEditar.esdesunat,
          guiaremision : this.DocumentoEditar.esguiaremision,
          notacredito: this.DocumentoEditar.esnotacredito,
          notaingalmacen : this.DocumentoEditar.esnotaingresoalmacen,
          notasalalmacen : this.DocumentoEditar.esnotasalidaalmacen,
          compra: this.DocumentoEditar.usadocompras,
          pedido: this.DocumentoEditar.espedido,
          muevestock : this.DocumentoEditar.muevestock,
          requerido : this.DocumentoEditar.requierenrodocumento,
          ordencompra : this.DocumentoEditar.esordencompra,
          recibohonorario: this.DocumentoEditar.usadorecibohonorario,
          venta: this.DocumentoEditar.usadoventas,
        });
        this.spinner.hide();
      } 
    },error => { 
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  onGrabar(){
    const data = this.Form.value;
    const newDocumento : IListarDocumentos = {
      documentoid : data.codigo,
      nombre : data.nombre,
      siglasdocumento : data.siglas,
    //  esadelanto : data.adelanto,
      esanticipo : data.anticipo,
      escajabanco : data.cajabanco,
      escontable : data.contable, 
      escotizacion : data.cotizacion,
      esdesunat : data.sunat,
      esguiaremision : data.guiaremision,
      esnotacredito  : data.notacredito,
      esnotaingresoalmacen : data.notaingalmacen,
      esnotasalidaalmacen : data.notasalalmacen,
      esordencompra : data.ordencompra,
      espedido: data.pedido,
      idauditoria : this.DocumentoEditar ? this.DocumentoEditar.idauditoria :  0,
      muevestock : data.muevestock,
      requierenrodocumento : data.requerido,
      usadocompras : data.compra,
      usadorecibohonorario : data.recibohonorario,
      usadoventas : data.venta,

    } 
    if(!this.DocumentoEditar){
      this.documentoService.crearDocumento(newDocumento).subscribe((resp)=>{
        if(resp){
          this.swal.mensajeExito('Se grabaron los datos correctamente!');
          this.onVolver();
        }
      },error => { 
        this.generalService.onValidarOtraSesion(error);  
      });
    }else{
      this.documentoService.updateDocumento(newDocumento).subscribe((resp)=>{
        if(resp){
          this.swal.mensajeExito('Se actualziaron los datos correctamente!');
          this.onVolver();
        }
      },error => { 
        this.generalService.onValidarOtraSesion(error);  
      });
    }
  }
  
  onVolver(){
    this.cerrar.emit('exito')
  }

  onRegresar(){
    this.cerrar.emit(false)
  }

}
