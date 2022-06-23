import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'; 
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service'; 
import { IAnexosMA } from '../../home/almacen/a-procesos/movimientos-almacen/interface/movimientosalmacen.interface'; 
import { ComprasService } from '../../home/compras/c-procesos/compras/service/compras.service';

interface TiPersona {
  nombre: string, 
}


@Component({
  selector: 'app-buscar-anticipo',
  templateUrl: './buscar-anticipo.component.html',
})
 
export class BuscarAnticipoComponent implements OnInit {
  @Input() dataAnticipo : any;
  @Output() AnticipoSelect : EventEmitter<any> = new EventEmitter<any>();
  cols: InterfaceColumnasGrilla[] =[];
  listaAncicipos :  IAnexosMA[]; 
  fechaActual = new Date();
  fecha = new FormControl(this.fechaActual); 
  
  es = ConstantesGenerales.ES_CALENDARIO

  constructor(
    private comprasService : ComprasService,
    private swal: MensajesSwalService,
    private config : PrimeNGConfig,
    private spinner : NgxSpinnerService
  ) {
     
   }

  ngOnInit(): void {  
    this.config.setTranslation(this.es);
    this.onLoadAnticipos();
    this.cols = [  
      { field: 'tipoDocumento', header: 'Tipo Documento', visibility: true }, 
      { field: 'nroDocumento', header: 'Nro Documento.', visibility: true},   
      { field: 'moneda', header: 'Moneda', visibility: true }, 
      { field: 'importetotal', header: 'Importe Total', visibility: true }, 
      { field: 'fechaEmision', header: 'Fec. Emisión.', visibility: true},    
    ];
  }
 
  onLoadAnticipos(){
    const data = {
      idproveedor :  this.dataAnticipo.idproveedor,
      idcompra : this.dataAnticipo.idcompra,
      fecha : this.fecha.value
    } 
    this.spinner.show(); 
    this.comprasService.buscarAnticipos(data).subscribe((resp) =>{
      if(resp){
        this.listaAncicipos = resp;
        this.spinner.hide();
      }  
    })
  }

  onSeleccionarPersona(event : any){
    if(event){ 
      this.swal.mensajePregunta("Seguro de seleccionar a: " + event.data + " ?").then((response) => {
        if (response.isConfirmed) {  
          const dataAnticipo = {
            data : event.data,
            posicion : this.dataAnticipo.posicion
          }
          this.AnticipoSelect.emit(dataAnticipo); 
        }
      })   
    }
  }

 


}
