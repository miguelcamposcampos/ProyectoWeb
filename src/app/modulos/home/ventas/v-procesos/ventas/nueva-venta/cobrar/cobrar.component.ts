import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
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
  SaldoTotalaCobrar : number = 0;

  esModal : boolean;

  constructor(
    private ventaservice : VentasService, 
    private generalService : GeneralService, 
    private swal : MensajesSwalService,
    private messageService: MessageService,
    private config : PrimeNGConfig, 
    private dataFormat : DatePipe
  ) {
    this.builform();
   }


   public builform(){
    this.Form = new FormGroup({
      fechacobranza: new FormControl(this.fechaActual, Validators.required),
      NroReferencia: new FormControl(null, Validators.required),
      MonedaaCobrar: new FormControl(null, Validators.required),
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
  },error => { 
    this.generalService.onValidarOtraSesion(error);  
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
  this.swal.mensajePreloader(true);
  this.ventaservice.obtenerSaldoPendiente(this.dataCobrar.ventaid).subscribe((resp)=> {
    if(resp){
      this.saldoPendiente = resp;
      this.SaldoTotalaCobrar =  this.saldoPendiente.importesaldo;
      this.SaldoTotalaCobrar= +parseFloat(this.saldoPendiente.importesaldo.toString()).toFixed(2); 
      let nombreMoneda = this.arrayMonedas.find(x => x.id === this.saldoPendiente.monedaId) 
      this.Form.controls['MonedaaCobrar'].setValue(nombreMoneda.valor2); 
    }
    this.swal.mensajePreloader(false);
  },error => { 
    this.generalService.onValidarOtraSesion(error);  
  });
 }

 onObtenerFormPago(event : any){
  console.log('que selecciono ',event); 
  const dataFormulario = this.Form.value;
  if(event){  
    /* VALOR3 = 2 => DOLARES  y  VALOR3 = 1 => SOLES */
      if(event.valor3 === 2){
        this.Form.controls['MonedaaCobrar'].setValue('USD');
        if(dataFormulario.MonedaaCobrar === 'USD' ){
          return;
        }else{
          this.SaldoTotalaCobrar = (this.SaldoTotalaCobrar / dataFormulario.TipoCambio) 
        } 
      }else if(event.valor3 === 1){
        this.Form.controls['MonedaaCobrar'].setValue('PEN');
        if(dataFormulario.MonedaaCobrar === 'PEN' ){
          return;
        }else{
        this.SaldoTotalaCobrar =  (this.SaldoTotalaCobrar * dataFormulario.TipoCambio)  
        }
      }  
  } 
 }
 
 onValidarTipoCambioExiste(event){ 
  if(event.target.value){
    this.bloquearBotonAgregarCobro = false;
  }else{
    this.swal.mensajeAdvertencia('Debes ingresar un tipo de cambio para continuar.'); 
    this.bloquearBotonAgregarCobro = true;
    return;
  }
 
 }

  get fa() { return this.Form.get('arraycobranza') as FormArray; } 
  get arrayPagosRegistrados() { return this.fa.controls as FormGroup[]; }

  onAgregarCobro(){  
    const dataForm = this.Form.value;
  
    if(!dataForm.ImporteACobrar){
      this.swal.mensajeAdvertencia('Ingresa un monto a cobrar porfavor!.');
      return;
    }
 
    let numParseado = +parseFloat(dataForm.ImporteACobrar.toString()).toFixed(2)
    
    if(numParseado < 1){
      this.swal.mensajeAdvertencia('no puede ingresar números negativos');
      return;
    } 

    if(numParseado > this.SaldoTotalaCobrar){
      this.swal.mensajeAdvertencia('no puede ingresar un monto mayor al importe total');
      return;
    } 

    let monedaGrabar = this.arrayMonedas.find(x => x.valor2 === dataForm.MonedaaCobrar) 
   
    const newCobro = {
      formaPagoId: dataForm.FormadePago.id,
      formaPago: dataForm.FormadePago.valor1,
      importe: numParseado,
      Moneda :  dataForm.MonedaaCobrar, 
      MonedaId : monedaGrabar,
      nroDocRef: dataForm.NroReferencia,
      tipodocRefId: 0,
    }
    if(newCobro.formaPagoId){
      console.log('newCobro',newCobro);
      this.arrayCobro.push(newCobro);  
      this.messageService.add({key: 'ToastExitoso', severity:'success', summary: 'El cobro se añadió correctamente!.'});
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
    let totaldeCobrosRealizados  = CobrosRealizados.reduce((sum, value)=> (sum + (+value.importe) ?? 0 ), 0);
    this.SaldoTotalaCobrar = this.saldoPendiente.importesaldo - totaldeCobrosRealizados
    if(this.SaldoTotalaCobrar === 0){
      this.bloquearBotonAgregarCobro = true;
      this.bloquearComboFormaPago = true;
    }else{
      this.bloquearComboFormaPago = false;
      this.bloquearBotonAgregarCobro = false;
    }  
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
        this.cerrar.emit('exito')
      }
      this.swal.mensajeExito('Se grabaron los datos correctamente!.')
    }, error => { 
      this.generalService.onValidarOtraSesion(error);  
    })
  }
 
 

  onRegresar(){
    this.cerrar.emit(false)
  }

}
