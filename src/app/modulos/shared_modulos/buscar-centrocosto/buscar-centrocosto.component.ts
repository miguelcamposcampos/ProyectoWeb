import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';  
import { ComprasService } from '../../home/compras/c-procesos/compras/service/compras.service';

  
@Component({
  selector: 'app-buscar-centrocosto',
  templateUrl: './buscar-centrocosto.component.html'
})
 
export class BuscarCentrocostoComponent implements OnInit {
  @Input() dataCentroCosto : any;
  @Output() CentroCostoSelect : EventEmitter<any> = new EventEmitter<any>();
  cols: InterfaceColumnasGrilla[] =[];
  listaCentroCosto :  any[];   

  constructor(
    private comprasService : ComprasService,
    private swal: MensajesSwalService, 
    private spinner : NgxSpinnerService
  ) {}

  ngOnInit(): void {   
    this.onLoadCentroCosto();
    this.cols = [  
      { field: 'cod', header: 'Código', visibility: true }, 
      { field: 'nombre', header: 'Nombre', visibility: true}, 
    ];
  }
 
  onLoadCentroCosto(){
    this.spinner.show();
    this.comprasService.buscarCentroCosto().subscribe((resp) =>{
      if(resp){
        this.listaCentroCosto = resp;
        this.spinner.hide();
      }  
    })
  }

  onSeleccionarPersona(event : any){
    if(event){ 
      this.swal.mensajePregunta("Seguro de seleccionar a: " + event.data + " ?").then((response) => {
        if (response.isConfirmed) {  
          const dataCentroCosto = {
            data : event.data,
            posicion : this.dataCentroCosto.posicion
          }
          this.CentroCostoSelect.emit(dataCentroCosto); 
        }
      })   
    }
  }

 


}
