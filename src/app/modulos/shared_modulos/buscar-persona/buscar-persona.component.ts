import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'; 
import { FormControl } from '@angular/forms';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service'; 
import { IAnexosMA } from '../../home/almacen/a-procesos/movimientos-almacen/interface/movimientosalmacen.interface';
import { MovimientosAlmacenService } from '../../home/almacen/a-procesos/movimientos-almacen/service/movimientosalmacen.service';
interface TiPersona {
  nombre: string, 
}


@Component({
  selector: 'app-buscar-persona',
  templateUrl: './buscar-persona.component.html',
  styleUrls: ['./buscar-persona.component.scss']
})
 
export class BuscarPersonaComponent implements OnInit {

  @Input() dataPersona : string;
  @Output() PersonaSelect : EventEmitter<any> = new EventEmitter<any>();
  cols: InterfaceColumnasGrilla[] =[];
  listaAnexos :  IAnexosMA[];
  ArraytipoPersona : TiPersona[]=[];
  criterio = new FormControl('');
  tipopersonaBuscar = new FormControl( {nombre : 'Cliente'});
  
  textoPaginado : string="";
  pagina: number = 1;
  size: number = 50;

  constructor(
    private moviAlmacenService : MovimientosAlmacenService,
    private swal: MensajesSwalService
  ) {
    this.ArraytipoPersona = [
      {nombre : 'Proveedor'},
      {nombre : 'Cliente'},
      {nombre : 'Trabajador'}
    ]
   }

  ngOnInit(): void { 
    this.tipopersonaBuscar.value.nombre = this.dataPersona 
    this.onLoadPersonas(null);
    this.cols = [ 
      { field: (this.dataPersona === 'Cliente') ? 'codCliente' : 'codProveedor', header: 'Codigo', visibility: true }, 
      { field: 'nombreRazSocial', header: 'Nombre', visibility: true }, 
      { field: 'nroDocumento', header: 'Nro Documento.', visibility: true},    
    ];
  }
 
  onLoadPersonas(event :any){
    const data = {
      paginaIndex :   event ? event.first : this.pagina,
      itemsPorPagina :  event ? event.rows : this.size,
      categoria : this.tipopersonaBuscar.value.nombre,
      criterio : this.criterio.value
    } 
    this.swal.mensajePreloader(true);  
    this.moviAlmacenService.listadoAnexosMA(data).subscribe((resp) =>{
      if(resp){
        this.textoPaginado = resp.label;
        this.listaAnexos = resp.items;
      }
      this.swal.mensajePreloader(false);  
    })
  }

  onSeleccionarPersona(event : any){
    if(event){ 
      this.swal.mensajePregunta("Seguro de seleccionar a: " + event.data.nombreRazSocial + " ?").then((response) => {
        if (response.isConfirmed) {  
          this.PersonaSelect.emit(event.data); 
        }
      })   
    }
  }


 


}
