import { Component, OnInit } from '@angular/core';
import { FormControl} from '@angular/forms'; 
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service'; 
import { ICliente } from './interface/clientes.interface';
import { ClienteService } from './servicio/clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

 
  cols: InterfaceColumnasGrilla[] =[];
  VistaNuevoCliente : boolean = false;
  dataCliente : ICliente;
  listaClientees : ICliente[];
  razonsocial = new FormControl('')
  nrodoc = new FormControl('')
  textoPaginado : string="";
  pagina: number = 1;
  size: number = 50;

  constructor(
    private swal : MensajesSwalService, 
    private clienteService : ClienteService, 
    private generalService: GeneralService
  ) { }
 


ngOnInit(): void {
  this.onLoadClientes(null);
  this.cols = [ 
    { field: 'cod', header: 'Codigo', visibility: true }, 
    { field: 'tipoPersona', header: 'Persona', visibility: true }, 
    { field: 'tipoDocumento', header: 'Documento', visibility: true }, 
    { field: 'nroDocumento', header: 'Nro Documento', visibility: true},  
    { field: 'nombrecompleto', header: 'Nombre / Razon Social', visibility: true},  
    { field: 'fechaRegistro', header: 'Fec.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
    { field: 'acciones', header: 'Ajustes', visibility: true  }, 
  ];
}

  onLoadClientes(event : any){
    const data = {
      pagIndex : event ? event.first : this.pagina,
      itemsporpagina: event ? event.rows :  this.size,
      razonsocial : this.razonsocial.value,
      nrodoc : this.nrodoc.value,
    }
    this.swal.mensajePreloader(true);
    this.clienteService.listadoClientes(data).subscribe((resp) => {
      if(resp){ 
        this.textoPaginado = resp.label;
        this.listaClientees = resp.items;
      }
      this.swal.mensajePreloader(false);
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }
 
  onNuevoCliente(){
    this.dataCliente = null;
    this.VistaNuevoCliente = true;
  }

  onEditar(data : any){
    this.dataCliente = data;
    this.VistaNuevoCliente = true;
  }

  onEliminar(data:any){ 
    this.swal.mensajePregunta("¿Seguro que desea eliminar al cliente " + data.nombrecompleto + " ?").then((response) => {
      if (response.isConfirmed) {
        this.clienteService.deleteCliente(data.idCliente).subscribe((resp) => { 
          this.onLoadClientes(null); 
          this.swal.mensajeExito('El cliente ha sido eliminado correctamente!.'); 
        },error => { 
          this.generalService.onValidarOtraSesion(error);  
        });
      }
    })  
  }
  

  onRetornar(event: any){ 
    if(event === 'exito'){
      this.onLoadClientes(null);
    } 
    this.VistaNuevoCliente = false; 
  }

 

}
