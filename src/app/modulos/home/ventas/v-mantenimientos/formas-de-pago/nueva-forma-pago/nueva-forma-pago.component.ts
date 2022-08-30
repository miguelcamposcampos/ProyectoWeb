import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Subject } from 'rxjs';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICrearFormasPago } from '../interface/formaspago.interface';
import { FomrasDePagoService } from '../servicio/formaspago.service';

@Component({
  selector: 'app-nueva-forma-pago',
  templateUrl: './nueva-forma-pago.component.html'
})
export class NuevaFormaPagoComponent implements OnInit {


public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
@Input() dataFormaPago : any;
@Output() cerrar : EventEmitter<boolean> = new EventEmitter<boolean>();
Form : FormGroup;
FormPagoEditar : ICrearFormasPago;

arrayMedioPago: ICombo[];
arrayEstablecimiento: ICombo[];
arrayMoneda: ICombo[];
arrayDocumento: ICombo[];
arrayDocumentoRef: ICombo[];


constructor(
  private swal : MensajesSwalService, 
  private formpagoService : FomrasDePagoService,
  private generalService : GeneralService,
  private spinner : NgxSpinnerService 
) { 
  this.builform();

  this.generalService._hideSpinner$.subscribe(x=>{
    this.spinner.hide();
  })
}

public builform(){
  this.Form = new FormGroup({
    titulo: new FormControl('', Validators.required),
    mediodePago: new FormControl(null, Validators.required),
    establecimiento: new FormControl(null, Validators.required),
    moneda: new FormControl(null, Validators.required),
    documento: new FormControl(null, Validators.required),
    documentoref: new FormControl(null),
    docrequierereferencia: new FormControl(false)
  })
}

ngOnInit(): void {
  this.onCargarDropdown();
  if(this.dataFormaPago){
    this.spinner.show();
    this.Avisar();  
  }
}

  
onCargarDropdown(){
  const data={
    esCajaBanco : true
   }

   const data2={
    esNotaCredito : true
   }

  const obsDatos = forkJoin(   
    this.generalService.listadoPorGrupo('MediosPago'), 
    this.generalService.listadoComboEstablecimientos(), 
    this.generalService.listadoPorGrupo('Monedas'), 
    this.generalService.listadoDocumentoPortipoParacombo(data), 
    this.generalService.listadoDocumentoPortipoParacombo(data2), 
  );
 
  obsDatos.subscribe((response) => { 
    this.arrayMedioPago = response[0];   
    this.arrayEstablecimiento = response[1];  
    this.arrayMoneda = response[2];   
    this.arrayDocumento = response[3];   
    this.arrayDocumentoRef = response[4];   
    this.FlgLlenaronCombo.next(true); 
  });
}

Avisar(){
  this.FlgLlenaronCombo.subscribe((x) => {
    this.onObtenerFormPagoPorId(); 
  });
}

onObtenerFormPagoPorId(){  
  this.formpagoService.formaPagoPorId(this.dataFormaPago.idFormaPago).subscribe((resp)=> {
    if(resp){ 
      this.FormPagoEditar = resp;  
      this.Form.patchValue({
          documento: this.arrayDocumento.find(
          (x) => x.id === this.FormPagoEditar.documentoid
          ),
          moneda: this.arrayMoneda.find(
            (x) => x.id === this.FormPagoEditar.monedaid
          ), 
          mediodePago: this.arrayMedioPago.find(
            (x) => x.id === this.FormPagoEditar.mediopagoid
          ),
          establecimiento: this.arrayEstablecimiento.find(
            (x) => x.id === this.FormPagoEditar.establecimientoid
          ), 
          documentoref: this.arrayDocumentoRef.find(
            (x) => x.id === this.FormPagoEditar.documentorefid
          ), 
          titulo: this.FormPagoEditar.titulo,
          docrequierereferencia: this.FormPagoEditar.requieredocref,
      });
      this.spinner.hide();
    } 
  })
}

 

onGrabar(){
  const data = this.Form.value;

  const newCondicionPago : ICrearFormasPago = {
    documentoid: data.documento.id,
    documentorefid : data.documentoref ? data.documentoref.id : 0,
    establecimientoid: data.establecimiento ? data.establecimiento.id : 0,
    formaspagoid: this.FormPagoEditar ? this.FormPagoEditar.formaspagoid : 0, 
    mediopagoid: data.mediodePago.id,
    monedaid: data.moneda.id,
    requieredocref: data.docrequierereferencia,
    titulo : data.titulo
  }
 ;

  if(!this.FormPagoEditar){
    this.formpagoService.crearFormaPago(newCondicionPago).subscribe((resp) => {
      if(resp){
        this.swal.mensajeExito('Se grabaron los datos correctamente!.');
          this.cerrar.emit(true);
      }
    });
  }else{
    this.formpagoService.updateFormaPago(newCondicionPago).subscribe((resp) => {
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
