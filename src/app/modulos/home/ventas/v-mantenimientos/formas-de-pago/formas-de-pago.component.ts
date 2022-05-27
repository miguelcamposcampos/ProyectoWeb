import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IListaFormasPago } from './interface/formaspago.interface';
import { FomrasDePagoService } from './servicio/formaspago.service';

@Component({
  selector: 'app-formas-de-pago',
  templateUrl: './formas-de-pago.component.html'
})
export class FormasDePagoComponent implements OnInit {

  
  cols: InterfaceColumnasGrilla[] =[];
  modalNuevaFormaPago : boolean = false;
  dataFormaPago : IListaFormasPago;
  listaFormaPago : IListaFormasPago[]; 
  criterio = new FormControl('');

  constructor(
    private formaspagoService: FomrasDePagoService,
    private swal : MensajesSwalService,
    private generalService : GeneralService
  ) { }

 
  ngOnInit(): void {
    this.onLoadFormasPago();
    this.cols = [ 
      { field: 'titulo', header: 'Titulo', visibility: true }, 
      { field: 'documento', header: 'Documento', visibility: true},   
      { field: 'establecimiento', header: 'Establecimiento', visibility: true},   
      { field: 'fechaRegistro', header: 'Fec. Registro',  visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA},   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];

  }

  
  onNuevo(){ 
    this.dataFormaPago = null;
    this.modalNuevaFormaPago = true;
  }

  onEditar(data : any){ 
    this.dataFormaPago = data;
    this.modalNuevaFormaPago = true;
  }

  onEliminar(data:any){
    this.swal.mensajePregunta("¿Seguro que desea eliminar la forma de pago " + data.titulo + " ?").then((response) => {
      if (response.isConfirmed) {
        this.formaspagoService.deleteFormaPago(data.idFormaPago).subscribe((resp) => {
          if(resp){
            this.onLoadFormasPago();
            this.swal.mensajeExito('La forma de pago se ha sido eliminado correctamente!.'); 
          }
        },error => { 
          this.generalService.onValidarOtraSesion(error);  
        });
      }
    })  
  }
 
  onLoadFormasPago(){
    this.swal.mensajePreloader(true); 
    this.formaspagoService.listadoFormaPago(this.criterio.value).subscribe((resp) => {
      if(resp){
        this.listaFormaPago = resp;
        this.swal.mensajePreloader(false);
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }
  onRetornar(event: any){ 
    if(event === 'exito'){
      this.onLoadFormasPago();
    } 
    this.modalNuevaFormaPago = false; 
  }


}
