import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IListaUnidadMedida } from '../interfaces/unidaddemedida.interface';
import { UnidaddeMedidaService } from '../servicio/unidaddemedida.service';

@Component({
  selector: 'app-nuevo-unidaddemedida',
  templateUrl: './nuevo-unidaddemedida.component.html'
})
export class NuevoUnidaddemedidaComponent implements OnInit {

  @Input() idUnidadMedida : number;
  @Output() cerrar : EventEmitter<boolean> = new EventEmitter<boolean>();

  Form : FormGroup;
  UnidadMedidaEditar : IListaUnidadMedida;

  constructor(
    private unidadMedidadService : UnidaddeMedidaService,
    private swal : MensajesSwalService, 
    public generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) { 
    this.builform();
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
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
      this.spinner.show();
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
        });
        this.spinner.hide();
      }
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
        this.swal.mensajeExito("Se actualizaron los datos correctamente!.");
       this.cerrar.emit(false);
      }
      });
    }else{
      this.unidadMedidadService.createUnidadMedida(newUnidadMedidad).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito("Se grabaron los datos correctamente!.");
         this.cerrar.emit(false);
        }
      });
    }
  }

 

  onRegresar(){ 
    this.cerrar.emit(false);
  }
 

}
