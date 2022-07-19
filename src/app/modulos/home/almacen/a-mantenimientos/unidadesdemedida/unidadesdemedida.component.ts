import { Component, OnInit } from '@angular/core'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IListaUnidadMedida } from './interfaces/unidaddemedida.interface';
import { UnidaddeMedidaService } from './servicio/unidaddemedida.service';

@Component({
  selector: 'app-unidadesdemedida',
  templateUrl: './unidadesdemedida.component.html'
})
export class UnidadesdemedidaComponent implements OnInit {

  modalNuevoUnidadMedida: boolean = false; 
  cols : InterfaceColumnasGrilla[] = [];
  listUnidadMedida : IListaUnidadMedida[];
  idUnidadMedida : number = 0; 

  constructor(
    private unidadMedidaService : UnidaddeMedidaService,
    private swal : MensajesSwalService,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) { }

  ngOnInit(){
    this.onLoadUnidadMedida();
    this.cols = [ 
      { field: 'codigosunat', header: 'Cod.Sunat', visibility: true }, 
      { field: 'siglasum', header: 'Sigla', visibility: true },  
      { field: 'nombreunidadmedida', header: 'Nombre', visibility: true },  
      { field: 'valorconversion', header: 'Valor', visibility: true },   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];
 
  }

  onLoadUnidadMedida(){
    this.spinner.show();
    this.unidadMedidaService.listadoUnidadMedida().subscribe((resp) => {
      if(resp){
        this.listUnidadMedida = resp;
        this.spinner.hide();
      } 
    });
  }


  onModalNuevoUnidadMedida(){  
    this.idUnidadMedida = null;
    this.modalNuevoUnidadMedida = true;
  }

  onEditar(id  : number){  
    this.idUnidadMedida = id;
    this.modalNuevoUnidadMedida = true;
  }
 
    
  
  onModalEliminar(data:any){ 
    this.swal.mensajePregunta("¿Seguro que desea eliminar la unidad de medida " + data.nombreunidadmedida + " ?").then((response) => {
      if (response.isConfirmed) {
        this.unidadMedidaService.deleteUnidadMedida(data.idUnidadMedida).subscribe((resp) => { 
          this.onLoadUnidadMedida(); 
          this.swal.mensajeExito('La unidad de medida ha sido eliminado correctamente!.'); 
        });
      }
    })  
  }
 

  onRetornar(event: any){ 
    if(event === 'exito'){
      this.onLoadUnidadMedida();
    } 
    this.modalNuevoUnidadMedida = false; 
  }

  
}
