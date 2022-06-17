import { Component, OnInit } from '@angular/core'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IListaCondicionesPago } from './interface/condicionespago.interface';
import { CondicionPagoService } from './servicio/condicionespago.service';

@Component({
  selector: 'app-condicion-de-pago',
  templateUrl: './condicion-de-pago.component.html'
})
export class CondicionDePagoComponent implements OnInit {

  cols: InterfaceColumnasGrilla[] =[];
  modalNuevaCondicionPago : boolean = false;
  dataCondicion : IListaCondicionesPago;
  listaCondicionPago : IListaCondicionesPago[]; 


  constructor(
    private condicionService: CondicionPagoService,
    private swal : MensajesSwalService,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.onLoadCondicionPago();
    this.cols = [ 
      { field: 'nombre', header: 'Nombre', visibility: true }, 
      { field: 'escredito', header: 'Es Credito', visibility: true, tipoFlag:'boolean'},   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];

  }

  
  onNuevo(){ 
    this.dataCondicion = null;
    this.modalNuevaCondicionPago = true;
  }

  onEditar(data : any){ 
    this.dataCondicion = data;
    this.modalNuevaCondicionPago = true;
  }

  onEliminar(data:any){
    this.swal.mensajePregunta("¿Seguro que desea eliminar la condicion de pago " + data.nombre + " ?").then((response) => {
      if (response.isConfirmed) {
        this.condicionService.deleteCondicionPago(data.condicionpagoid).subscribe((resp) => {
          if(resp){
            this.onLoadCondicionPago();
          }
          this.swal.mensajeExito('La condicion de pago se ha sido eliminado correctamente!.'); 
        },error => { 
          this.generalService.onValidarOtraSesion(error);  
        });
      }
    })  
  }
 
  onLoadCondicionPago(){
    this.spinner.show();
    this.condicionService.listadoCondicionPago().subscribe((resp) => {
      if(resp){
        this.listaCondicionPago = resp;
        this.spinner.hide();
      }
    },error => {  
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);  
    });
  }
  onRetornar(event: any){ 
    if(event === 'exito'){
      this.onLoadCondicionPago();
    } 
    this.modalNuevaCondicionPago = false; 
  }

}
