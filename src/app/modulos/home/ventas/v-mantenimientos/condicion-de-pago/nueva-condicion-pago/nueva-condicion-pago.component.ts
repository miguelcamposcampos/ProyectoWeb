import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IListaCondicionesPago } from '../interface/condicionespago.interface';
import { CondicionPagoService } from '../servicio/condicionespago.service';

@Component({
  selector: 'app-nueva-condicion-pago',
  templateUrl: './nueva-condicion-pago.component.html'
})
export class NuevaCondicionPagoComponent implements OnInit {

  @Input() dataCondicion : any;
  @Output() cerrar : EventEmitter<boolean> = new EventEmitter<boolean>();
  Form : FormGroup;
  CondicionPagoEditar : IListaCondicionesPago;

  constructor(
    private swal : MensajesSwalService, 
    private condicionPagoService : CondicionPagoService,
    private generalService : GeneralService,
    private spinner: NgxSpinnerService
  ) { 
    this.builform();
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
  }

  public builform(){
    this.Form = new FormGroup({
      nombre: new FormControl(''),
      escredito : new FormControl(false, Validators.required),
    })
  }

  ngOnInit(): void {
    if(this.dataCondicion){ 
      this.spinner.show();
      this.onObtenerCondicionPorId();
    }
  }

  onObtenerCondicionPorId(){  
    this.condicionPagoService.condicionPagoPorId(this.dataCondicion.condicionpagoid).subscribe((resp)=> {
      if(resp){
        this.CondicionPagoEditar = resp;
        this.Form.patchValue({
          nombre : this.CondicionPagoEditar.nombre,
          escredito : this.CondicionPagoEditar.escredito
        }); 
      this.spinner.hide();
      } 
    });
  }

  onGrabar(){
    const data = this.Form.value;

    const newCondicionPago : IListaCondicionesPago = {
      condicionpagoid: this.CondicionPagoEditar ? this.CondicionPagoEditar.condicionpagoid : 0,
      escredito : data.escredito,
      idauditoria: this.CondicionPagoEditar ? this.CondicionPagoEditar.idauditoria : 0,
      nombre :data.nombre
    }
 

    if(!this.CondicionPagoEditar){
      this.condicionPagoService.crearCondicionPago(newCondicionPago).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Se grabaron los datos correctamente!.');
           this.cerrar.emit(true);
        }
      });
    }else{
      this.condicionPagoService.updateCondicionPago(newCondicionPago).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
           this.cerrar.emit(true);
        }
      });
  
    } 
  }
 

  onRegresar(){
    this.cerrar.emit(false)
  }


}
