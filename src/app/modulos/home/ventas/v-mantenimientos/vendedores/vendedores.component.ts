import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IVendedor } from './interface/vendedores.interface';
import { VendedoresService } from './servicio/vendedor.service';

@Component({
  selector: 'app-vendedores',
  templateUrl: './vendedores.component.html'
})
export class VendedoresComponent implements OnInit {

  cols: InterfaceColumnasGrilla[] =[];
  VistaNuevoVendedor : boolean = false;
  dataVendedor : IVendedor;
  listaVendedores : IVendedor[];
  descripcion = new FormControl('')
  textoPaginado : string="";
  pagina: number = 1;
  size: number = 50;

  constructor(
    private swal : MensajesSwalService,
    private vendedorService : VendedoresService,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.onLoadVendedores(null);
    this.cols = [ 
      { field: 'codigo', header: 'Codigo', visibility: true }, 
      { field: 'nroDocumento', header: 'Nro Documento', visibility: true},  
      { field: 'nombre', header: 'Nombre', visibility: true},  
      { field: 'fechaRegistro', header: 'Fec.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'establecimiento', header: 'Establecimiento', visibility: true  }, 
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];

  }

  onNuevoVendedor(){
    this.dataVendedor = null;
    this.VistaNuevoVendedor = true;
  }

  onEditar(data : any){
    this.dataVendedor = data;
    this.VistaNuevoVendedor = true;
  }

  onEliminar(data:any){
    this.swal.mensajePregunta("¿Seguro que desea eliminar al vendedor " + data.nombre + " ?").then((response) => {
      if (response.isConfirmed) {
        this.vendedorService.deleteVendedor(data.id).subscribe((resp) => {
          if(resp){
            this.onLoadVendedores(null);
          }
          this.swal.mensajeExito('El vendedor ha sido eliminado correctamente!.'); 
        });
      }
    })  
  }

  onLoadVendedores(event: any){
    this.spinner.show();
    const data = {
      paginaIndex : event ? event.first : this.pagina,
      itemsporpagina: event ? event.rows :  this.size,
      descripcion : this.descripcion.value
    }

    this.vendedorService.listadoVendedores(data).subscribe((resp) => {
      if(resp){
        this.textoPaginado = resp.label;
        this.listaVendedores = resp.items; 
        this.spinner.hide();
      }
    });
  }


  onRetornar(event: any){ 
    if(event === 'exito'){
      this.onLoadVendedores(null);
    } 
    this.VistaNuevoVendedor = false; 
  }

 
}
