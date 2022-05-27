import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICrearUnidadTransporte } from '../interface/transportista.interface';
import { TransportistaService } from '../service/transportista.service';

@Component({
  selector: 'app-nuevo-unidad-transporte',
  templateUrl: './nuevo-unidad-transporte.component.html',
  styleUrls: ['./nuevo-unidad-transporte.component.scss']
})
export class NuevoUnidadTransporteComponent implements OnInit {

    
  tituloVistaUnidadTransporte :string = "NUEVO UNIDAD TRANSPORTE";
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  @Input() dataUnidadTransporte! : any;
  EditarUnidadTransporte : ICrearUnidadTransporte;

  Form : FormGroup;

  constructor(
    private transpService: TransportistaService, 
    private swal : MensajesSwalService,
    private generalService : GeneralService,
  ) {
    this.builform();
   }

  private builform(): void{
    this.Form = new FormGroup({
      placa:new FormControl(null), 
      marca:new FormControl(null), 
      modelo:new FormControl(null), 
      certificado:new FormControl(null), 
      carretaPlaca:new FormControl(null, Validators.required), 
      carretaMarca:new FormControl(null), 
      carretaCertificado:new FormControl(null), 
    })
  }
  ngOnInit(): void {
    if(this.dataUnidadTransporte.idUnidaTransporte){
      this.tituloVistaUnidadTransporte = "EDITAR UNIDAD TRANSPORTE";
      this.onObtenerDataUnidadEditar();
    }
  }


  onObtenerDataUnidadEditar(){
    this.swal.mensajePreloader(true);
    this.transpService.unidadTransporteporId(this.dataUnidadTransporte.idUnidaTransporte).subscribe((resp) => {
      if(resp){
        this.swal.mensajePreloader(false);
        this.EditarUnidadTransporte = resp; 
        this.Form.patchValue({
          placa:  this.EditarUnidadTransporte.tractonroplaca, 
          marca:  this.EditarUnidadTransporte.tractomarca, 
          modelo:  this.EditarUnidadTransporte.tractomodelo, 
          certificado:  this.EditarUnidadTransporte.tractocertificadomtc,
          carretaPlaca :  this.EditarUnidadTransporte.carretaplaca,
          carretaMarca:   this.EditarUnidadTransporte.carretamarca,
          carretaCertificado:  this.EditarUnidadTransporte.carretacertificadomtc, 
        })
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  onGrabarUnidadTransporte(){
    const data  = this.Form.value;
    const newUnidadTransporte : ICrearUnidadTransporte = {

      tractonroplaca :  data.placa,
      tractomarca : data.marca,
      tractomodelo :  data.modelo,
      tractocertificadomtc : data.certificado ? data.certificado : '',
      carretaplaca :  data.carretaPlaca ? data.carretaPlaca : '',
      carretamarca :  data.carretaMarca ?  data.carretaMarca : '',
      carretacertificadomtc: data.carretaCertificado ? data.carretaCertificado : '', 
      transportistaid:  this.dataUnidadTransporte ? this.dataUnidadTransporte.idTransportista : 0,
      transportistaunidadid : this.dataUnidadTransporte ? this.dataUnidadTransporte.idUnidaTransporte : 0
    }
 
    //SI LLEGA DATA PARA EDITAR ENTONCES SE INSERTA UN NUEVO REGISTRO DE LO CONTRARIO SE ACTUALIZA
    if (!this.EditarUnidadTransporte) {
      this.transpService.grabarUnidadTransporte(newUnidadTransporte).subscribe((resp) => {
        if(resp){
          this.onVolver(); 
         }
         this.swal.mensajeExito('Se grabaron los datos correctamente!.');
        },error => { 
          this.generalService.onValidarOtraSesion(error);  
        });
    }else { 
      this.transpService.updateUnidadTransporte(newUnidadTransporte).subscribe((resp) =>{
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
      },error => { 
        this.generalService.onValidarOtraSesion(error);  
      });
    }
  }


  onRegresar() {   
    this.cerrar.emit(false); 
  }


  onVolver() {   
    this.cerrar.emit('exito'); 
  }

 

}
