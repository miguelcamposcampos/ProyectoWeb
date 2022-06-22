import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IListaTipoCambio, IMesesTipoCambio } from './interfaces/tipocambio.interface';
import { TipoCambioService } from './service/tipocambio.service';

@Component({
  selector: 'app-tipodecambio',
  templateUrl: './tipodecambio.component.html',
  styleUrls: ['./tipodecambio.component.scss']
})
export class TipodecambioComponent implements OnInit {

  modalNuevoTipoCambio : boolean = false;
  modalBuscarPorMes : boolean = false;
  cols : InterfaceColumnasGrilla[] = [];
  listaTipoCambio : IListaTipoCambio[];
  idTipoCambio : number = 0;

  fechaActual = new Date();
  fechaInicio = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth(), 1);
  fechaFin = new Date(this.fechaActual.getFullYear(), this.fechaActual.getMonth() + 1, 0);

  FormBusqueda : FormGroup;
  opcioneSplitTipoCambio: MenuItem[];
  arrayMeses : IMesesTipoCambio[];
  // mesSeleccionado : number= 0;
  mesSeleccionado = new FormControl(null, Validators.required)

  es : any = ConstantesGenerales.ES_CALENDARIO;
  meses : any = ConstantesGenerales.arrayMeses


  constructor(
    private tipocambioService : TipoCambioService,
    private swal : MensajesSwalService,
    private readonly formatoFecha: DatePipe,
    private primengConfig : PrimeNGConfig,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService

  ) {
    this.arrayMeses = this.meses;
    this.builform();
  }


   public builform(): void {
    this.FormBusqueda = new FormGroup({
      fechaInicioBusqueda: new FormControl(this.fechaInicio, Validators.required),
      fechaFinBusqueda: new FormControl(this.fechaFin, Validators.required),
    });
  }


  ngOnInit(): void {
    this.primengConfig.setTranslation(this.es);
    this.onLoadTipoCambio();
    this.onOpcionesTipoCambio();
    this.cols = [
      { field: 'fecha', header: 'Fecha TipoCambio', visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA },
      { field: 'valorCompra', header: 'Compra', visibility: true },
      { field: 'valorVenta', header: 'Venta', visibility: true },
      { field: 'fechaRegistro', header: 'Fec. Registro', visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA },
      { field: 'fechaEdicion', header: 'Fec. Edición', visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA },
      { field: 'acciones', header: 'Ajustes', visibility: true  },
    ];
  }

  onOpcionesTipoCambio(){
    this.opcioneSplitTipoCambio = [
      {
        label:'Agregar',
        icon:'pi pi-fw pi-plus',
        command:()=>{
          this.onModalNuevoTipoCambio();
        }
      },
      {
        label:'Obtener Por Mes',
        icon:'fas fa-broadcast-tower',
        command:()=>{
          this.onObtenerPorMes();
        }
      },
    ]
  }

  onLoadTipoCambio(){
    const data = this.FormBusqueda.value;
    const fechas = {
      f1 :  this.formatoFecha.transform(data.fechaInicioBusqueda, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      f2:   this.formatoFecha.transform(data.fechaFinBusqueda , ConstantesGenerales._FORMATO_FECHA_BUSQUEDA)
    }
    this.spinner.show();
    this.tipocambioService.listadoTipoCambio(fechas).subscribe((resp) => {
      if(resp){
        this.listaTipoCambio = resp; 
        this.spinner.hide();
      } 
    },error => {   
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  onObtenerPorMes(){
    this.mesSeleccionado.setValue(null);
    this.modalBuscarPorMes = true;
  }

 
  onBuscarPorMesSeleccionado(){ 
    const dataPorMes = {
      periodo: this.fechaActual.getFullYear(),
      mes: this.mesSeleccionado.value.mes
    }  
    this.tipocambioService.listadoTipoCambioPorMes(dataPorMes).subscribe((resp)=> {
      if(resp){
        let fechaInicioPorMesObtenido= new Date(dataPorMes.periodo, (dataPorMes.mes -1), 1);
        let fechaFinPorMesObtenido = new Date(dataPorMes.periodo, (dataPorMes.mes -1)  + 1, 0);
        this.FormBusqueda.patchValue({
          fechaInicioBusqueda: fechaInicioPorMesObtenido,
          fechaFinBusqueda: fechaFinPorMesObtenido
        })
        this.onLoadTipoCambio();
      }else{
        return;
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    }); 
    this.modalBuscarPorMes = false;

  }


  onModalNuevoTipoCambio(){
    this.idTipoCambio = null
    this.modalNuevoTipoCambio = true;
  }
 
  onEditar( idTipoCambio : number){
    this.idTipoCambio = idTipoCambio
    this.modalNuevoTipoCambio = true;
  }
   
  onModalEliminar(data:any){
    this.swal.mensajePregunta("¿Seguro que desea eliminar el tipo de canbio con fecha: " + data.fecha + " ?").then((response) => {
      if (response.isConfirmed) {
        this.tipocambioService.deleteTipoCambio(data.id).subscribe((resp) => {
          this.onLoadTipoCambio();
          this.swal.mensajeExito('El tipo de cambio ha sido eliminado correctamente!.');
        },error => { 
          this.generalService.onValidarOtraSesion(error);  
        });
      }
    })
  }


  onRetornar(event: any){
    if(event === 'exito'){
      this.onLoadTipoCambio();
    }
    this.modalNuevoTipoCambio = false;
  }
 

}
