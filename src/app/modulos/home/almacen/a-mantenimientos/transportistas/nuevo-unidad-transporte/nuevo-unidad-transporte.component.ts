import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
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
  @Output() cerrar : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() dataUnidadTransporte! : any;
  EditarUnidadTransporte : ICrearUnidadTransporte;

  Form : FormGroup;

  constructor(
    private transpService: TransportistaService, 
    private swal : MensajesSwalService,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) {
    this.builform();
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
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
      this.spinner.show();
      this.tituloVistaUnidadTransporte = "EDITAR UNIDAD TRANSPORTE";
      this.onObtenerDataUnidadEditar();
    }
  }


  onObtenerDataUnidadEditar(){ 
    this.transpService.unidadTransporteporId(this.dataUnidadTransporte.idUnidaTransporte).subscribe((resp) => {
      if(resp){ 
        this.EditarUnidadTransporte = resp; 
        this.Form.patchValue({
          placa:  this.EditarUnidadTransporte.tractonroplaca, 
          marca:  this.EditarUnidadTransporte.tractomarca, 
          modelo:  this.EditarUnidadTransporte.tractomodelo, 
          certificado:  this.EditarUnidadTransporte.tractocertificadomtc,
          carretaPlaca :  this.EditarUnidadTransporte.carretaplaca,
          carretaMarca:   this.EditarUnidadTransporte.carretamarca,
          carretaCertificado:  this.EditarUnidadTransporte.carretacertificadomtc, 
        });
        this.spinner.hide();
      }
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
          this.swal.mensajeExito('Se grabaron los datos correctamente!.');
            this.cerrar.emit(true);
         }
        });
    }else { 
      this.transpService.updateUnidadTransporte(newUnidadTransporte).subscribe((resp) =>{
        if(resp){
          this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
            this.cerrar.emit(true);
        }
      });
    }
  }


  onRegresar() {   
    this.cerrar.emit(false); 
  }
 
 
 

}
