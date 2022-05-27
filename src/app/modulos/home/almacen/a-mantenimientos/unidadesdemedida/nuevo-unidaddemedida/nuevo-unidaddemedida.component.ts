import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IListaUnidadMedida } from '../interfaces/unidaddemedida.interface';
import { UnidaddeMedidaService } from '../servicio/unidaddemedida.service';

@Component({
  selector: 'app-nuevo-unidaddemedida',
  templateUrl: './nuevo-unidaddemedida.component.html',
  styleUrls: ['./nuevo-unidaddemedida.component.scss']
})
export class NuevoUnidaddemedidaComponent implements OnInit {

  @Input() idUnidadMedida : number;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();

  Form : FormGroup;
  UnidadMedidaEditar : IListaUnidadMedida;

  constructor(
    private unidadMedidadService : UnidaddeMedidaService,
    private swal : MensajesSwalService, 
    private generalService : GeneralService
  ) { 
    this.builform();
  }

  public builform(): void {
    this.Form = new FormGroup({
      codigosunat: new FormControl(null),
      nombreunidadmedida: new FormControl(null, Validators.required), 
      siglasum: new FormControl(null, Validators.required),   
      valorconversion: new FormControl(null, Validators.required), 
    });
  }

  ngOnInit(): void {  
    if(this.idUnidadMedida){
      this.onBuscarUnidadMedidadPorId();
    }
  }

  onBuscarUnidadMedidadPorId(){
    this.unidadMedidadService.unidadMedidaPorId(this.idUnidadMedida).subscribe((resp) => {
      if(resp){ 
        this.UnidadMedidaEditar = resp
        this.Form.patchValue({
          codigosunat : this.UnidadMedidaEditar.codigosunat,
          nombreunidadmedida : this.UnidadMedidaEditar.codigosunat,
          siglasum : this.UnidadMedidaEditar.siglasum,
          valorconversion : this.UnidadMedidaEditar.valorconversion, 
        })
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }
 
  onGrabar(){
    const dataForm = this.Form.value;
    const newUnidadMedidad : IListaUnidadMedida = {
      codigosunat : dataForm.codigosunat,
      nombreunidadmedida : dataForm.codigosunat,
      siglasum : dataForm.siglasum,
      valorconversion : dataForm.valorconversion,
      unidadmedidaid: this.UnidadMedidaEditar ? this.UnidadMedidaEditar.unidadmedidaid : 0,
      idauditoria: this.UnidadMedidaEditar ? this.UnidadMedidaEditar.idauditoria : 0,
    } 
    if(this.UnidadMedidaEditar){
     this.unidadMedidadService.updateUnidadMedida(newUnidadMedidad).subscribe((resp) => {
      if(resp){
        this.onVolver();
      }
      this.swal.mensajeExito("Se actualizaron los datos correctamente!.");
      },error => { 
        this.generalService.onValidarOtraSesion(error);  
      });
    }else{
      this.unidadMedidadService.createUnidadMedida(newUnidadMedidad).subscribe((resp) => {
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito("Se grabaron los datos correctamente!.");
      },error => { 
        this.generalService.onValidarOtraSesion(error);  
      });
    }
  }

  onVolver(){ 
    this.cerrar.emit('exito');
  }

  onRegresar(){ 
    this.cerrar.emit(false);
  }
}
