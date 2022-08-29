import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, PrimeNGConfig } from 'primeng/api'; 
import { Subject } from 'rxjs'; 
import { ITipoCambioPorId } from 'src/app/modulos/home/almacen/a-mantenimientos/tipodecambio/interfaces/tipocambio.interface';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICobrarSaldoPendiente } from '../../interface/venta.interface';
import { VentasService } from '../../service/venta.service';

@Component({
  selector: 'app-cobrar',
  templateUrl: './cobrar.component.html',
  styleUrls: ['./cobrar.component.scss']
})
export class CobrarComponent implements OnInit {

  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  @Input() dataCobrar : any;
  arrayFormasPago : ICombo[];
  es = ConstantesGenerales.ES_CALENDARIO;
  fechaActual = new Date(); 
  Form : FormGroup;
  saldoPendiente: ICobrarSaldoPendiente;
  tipoCambio: ITipoCambioPorId;
  arrayCobro : any []= [];
  arrayMonedas: ICombo[];
  detalleCobranza : any[] = [];
  bloquearBotonAgregarCobro : boolean = true;
  bloquearComboFormaPago : boolean = false;
  SaldoTotalaCobrar : any; 
  totaldeCobrosRealizados : number; 
  esModal : boolean;

  constructor(
    private ventaservice : VentasService, 
    private generalService : GeneralService, 
    private swal : MensajesSwalService,
    private messageService: MessageService,
    private config : PrimeNGConfig, 
    private dataFormat : DatePipe,
    private spinner : NgxSpinnerService

  ) {
    this.builform();

    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
   }


   public builform(){
    this.Form = new FormGroup({
      fechacobranza: new FormControl(this.fechaActual, Validators.required),
      NroReferencia: new FormControl(null, Validators.required),
      MonedaaCobrar: new FormControl(null, Validators.required),
      MonedaId: new FormControl(null),
      FormadePago: new FormControl(null),  
      ImporteACobrar: new FormControl(null),  
      TipoCambio: new FormControl(null),  
      arraycobranza: new FormGroup({
        formapago: new FormControl(null, Validators.required),
        nroReferencia: new FormControl(null),
        moneda: new FormControl(''),
        importe: new FormControl('', Validators.required), 
      }), 
    })
  }


  ngOnInit(): void {  
    this.config.setTranslation(this.es); 
    this.onCargarTipoCambio();
    this.onCargarMonedas();
    this.onCargarFormasPago(); 
    if(this.dataCobrar.ismodal){
       this.esModal = this.dataCobrar.ismodal
    }else{
      this.esModal = false
    } 
  }
   
 onCargarFormasPago(){
  this.ventaservice.obtenerFormasdePagoCobrar(this.dataCobrar.establecimientoid).subscribe((resp)=> {
    this.arrayFormasPago = resp;
  });
 }

 onCargarTipoCambio(){
  const dataform = this.Form.value; 
  let fecha = this.dataFormat.transform(dataform.fechacobranza, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA) 
  let fechaSearch = fecha ? fecha : 0;
    this.ventaservice.obtenertipodeCambioCobrar(fechaSearch).subscribe((resp)=> {
      this.tipoCambio = resp;
      this.Form.controls['TipoCambio'].setValue(this.tipoCambio.valorventa);
    })
 }

 onCargarMonedas(){
  this.generalService.listadoPorGrupo('Monedas').subscribe((resp)=> {
    this.arrayMonedas = resp;
    this.onCargarSaldoPendiente();
  })
 }

 onCargarSaldoPendiente(){
  this.spinner.show(); 
  this.ventaservice.obtenerSaldoPendiente(this.dataCobrar.ventaid).subscribe((resp)=> {
    if(resp){
      this.saldoPendiente = resp;  
      this.SaldoTotalaCobrar = parseFloat(this.saldoPendiente.importesaldo.toString()).toFixed(2);  
      this.spinner.hide();
    } 
  });
 }

 onObtenerFormPago(event : any){  
  if(event){    
    this.bloquearBotonAgregarCobro = false;
    let nombreMoneda = this.arrayMonedas.find(x => x.id === event.valor3) 
    this.Form.controls['MonedaaCobrar'].setValue(nombreMoneda.valor2);  
    this.Form.controls['MonedaId'].setValue(nombreMoneda.valor1);  
    this.onCalcularCambioaDolar(nombreMoneda.valor3); 
  }else{
    this.bloquearBotonAgregarCobro = true; 
  }
 }

 onCalcularCambioaDolar(event){ 
  const dataFormulario = this.Form.value; 

  if(event === 2){  
    this.SaldoTotalaCobrar = this.arrayCobro.length
    ? ((this.saldoPendiente.importesaldo - this.totaldeCobrosRealizados) / dataFormulario.TipoCambio) 
    : (this.saldoPendiente.importesaldo / dataFormulario.TipoCambio)
  }else if(event === 1){   
    this.SaldoTotalaCobrar = this.arrayCobro.length
    ? (this.saldoPendiente.importesaldo - this.totaldeCobrosRealizados)
    : this.saldoPendiente.importesaldo;
  }
  this.CalcularMontoRestante();
 }


  get fa() { return this.Form.get('arraycobranza') as FormArray; } 
  get arrayPagosRegistrados() { return this.fa.controls as FormGroup[]; }

  onAgregarCobro(){  
    const dataForm = this.Form.value;
  
    if(!dataForm.ImporteACobrar){
      this.swal.mensajeAdvertencia('Ingresa un monto a cobrar porfavor!.');
      return;
    }
  
    if(dataForm.ImporteACobrar < 0.01){
      this.swal.mensajeAdvertencia('no puede ingresar números negativos');
      return;
    } 

    if(dataForm.ImporteACobrar > this.SaldoTotalaCobrar){
      this.swal.mensajeAdvertencia('no puede ingresar un monto mayor al importe total');
      return;
    } 

    let monedaGrabar = this.arrayMonedas.find(x => x.valor2 === dataForm.MonedaaCobrar) 
   
    const newCobro = {
      formaPagoId: dataForm.FormadePago.id,
      formaPago: dataForm.FormadePago.valor1,
      importe: +dataForm.ImporteACobrar,
      Moneda :  dataForm.MonedaaCobrar, 
      MonedaId : dataForm.MonedaId, //monedaGrabar,
      nroDocRef: dataForm.NroReferencia,
      tipodocRefId: 0,
    }
    if(newCobro.formaPagoId){
      console.log('newCobro',newCobro);
      this.arrayCobro.push(newCobro);  
      this.messageService.add({key: 'ToastExitoso', severity:'success', summary: 'El cobro se añadió correctamente!.'});
      this.Form.controls['ImporteACobrar'].setValue(null);
      this.CalcularMontoRestante();
    }else{ 
      this.swal.mensajeAdvertencia('Seleccione una forma de pago porfavor!.'); 
    }

  }


  CalcularMontoRestante(){
    let CobrosRealizados : any [] = [];
    this.arrayCobro.forEach(det => { 
      CobrosRealizados.push(det); 
    }) 

 
    this.totaldeCobrosRealizados  = CobrosRealizados.reduce(
      (sum, value)=> (
        sum + (
          value.MonedaId.valor2 === 'PEN' ? +value.importe : (+value.importe * this.Form.controls['TipoCambio'].value)
          ) ?? 0 
      ), 0);

    if(this.Form.controls['MonedaaCobrar'].value === 'PEN'){ 
      let nuevoSaldosoles = this.saldoPendiente.importesaldo - this.totaldeCobrosRealizados 
      let numeroDosdig = parseFloat(nuevoSaldosoles.toString()).toFixed(2); 
      this.SaldoTotalaCobrar = +numeroDosdig //this.onDosDecimales(nuevoSaldosoles);  
    }else{
      let importeSaldoDolar =  (this.saldoPendiente.importesaldo / this.Form.controls['TipoCambio'].value);
      let cobradoDolares =  (this.totaldeCobrosRealizados / this.Form.controls['TipoCambio'].value);
      let nuevoSaldodolar = importeSaldoDolar - cobradoDolares; 
      let numeroDosdig = parseFloat(nuevoSaldodolar.toString()).toFixed(2); 
      this.SaldoTotalaCobrar = +numeroDosdig // this.onDosDecimales(nuevoSaldodolar); 
    }
    
    this.bloquearBotonAgregarCobro = (this.SaldoTotalaCobrar === 0) ?  true : false;
    this.bloquearComboFormaPago = (this.SaldoTotalaCobrar === 0) ?  true : false;
    
  }

 
  onEliminarCobranza(index : any){
    this.arrayCobro.splice(index, 1);
    this.CalcularMontoRestante();
  }

  
  onGrabar(){   
    this.detalleCobranza = [];
    this.arrayCobro.forEach(element => { 
      this.detalleCobranza.push({
        formaPagoId : element.formaPagoId,
        importe :  +element.importe,
        Moneda :  element.Moneda,
        MonedaId :  element.MonedaId,
        nroDocRef : '',
        tipoDocRefId: 0
      })
    })

    const data = this.Form.value;
    const newCobranzaRapida = {
      detalleCobranzaRapidas: this.detalleCobranza,
      fecha : this.dataFormat.transform(data.fechacobranza,ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      tipoCambio: data.TipoCambio,
      ventaId: this.dataCobrar.ventaid
    }
    console.log('newCobranzaRapida',newCobranzaRapida);
    this.ventaservice.crearCobranzaRapida(newCobranzaRapida).subscribe((resp) => {
      if(resp){
        this.cerrar.emit(true);
      }
      this.swal.mensajeExito('Se grabaron los datos correctamente!.')
    })
  }
 
 

  onRegresar(){
    this.cerrar.emit(false)
  }

}

