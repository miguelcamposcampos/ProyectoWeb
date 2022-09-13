import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IProveedor } from './interface/proveedor.interface';
import { ProveedorService } from './service/proveedor.service';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html'
})
export class ProveedoresComponent implements OnInit {

  cols: InterfaceColumnasGrilla[] =[];
  VistaNuevoProveedor : boolean = false;
  dataProveedor : IProveedor;
  listaProveedores : IProveedor[];
  razonsocial = new FormControl('')
  nrodocumento = new FormControl('')

  textoPaginado : string="";
  pagina: number = 1;
  size: number = 50;

  constructor(
    private swal : MensajesSwalService, 
    private proveedorService : ProveedorService, 
    private generalService : GeneralService, 
    private spinner : NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.onLoadProveedores(null);
    this.cols = [ 
      { field: 'cod', header: 'Codigo', visibility: true }, 
      { field: 'tipoPersona', header: 'Tipo Persona', visibility: true }, 
      { field: 'tipoDocumento', header: 'Tipo Documento', visibility: true }, 
      { field: 'nroDocumento', header: 'Nro Documento', visibility: true},  
      { field: 'nombrecompleto', header: 'Nombre / Razon Social', visibility: true},  
      { field: 'fechaRegistro', header: 'Fecha Reg', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'usuarioRegistro', header: 'Usuario Reg', visibility: true}, 
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];
  }

  onLoadProveedores(event : any){
    const data = {
      pagIndex : event ? event.first :  this.pagina,
      itemsporpagina:  event ? event.rows : this.size,
      razonsocial : this.razonsocial.value,
      nrodocumento : this.nrodocumento.value,
    }
    this.spinner.show();
    this.proveedorService.listadoProveedor(data).subscribe((resp) => {
      if(resp){ 
        this.textoPaginado = resp.label;
        this.listaProveedores = resp.items;
        this.spinner.hide();
      } 
    });
  }
 
  onNuevo(){
    this.dataProveedor = null;
    this.VistaNuevoProveedor = true;
  }

  onEditar(data : any){
    this.dataProveedor = data;
    this.VistaNuevoProveedor = true;
  }

  onEliminar(data:any){ 
    this.swal.mensajePregunta("¿Seguro que desea eliminar al proveedor " + data.nombrecompleto + " ?").then((response) => {
      if (response.isConfirmed) {
        this.proveedorService.deletProveedor(data.idProveedor).subscribe((resp) => { 
          this.onLoadProveedores(null); 
          this.swal.mensajeExito('El proveedor ha sido eliminado correctamente!.'); 
        });
      }
    })  
  }
  

  onRetornar(event: any){ 
    if(event ){
      this.onLoadProveedores(null);
    } 
    this.VistaNuevoProveedor = false; 
  }
 

}
