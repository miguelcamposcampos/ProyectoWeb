import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeNode } from 'primeng/api'; 
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { EstablecimientoService } from './service/establecimiento.service';

@Component({
  selector: 'app-establecimientos',
  templateUrl: './establecimientos.component.html',
  styleUrls: ['./establecimientos.component.scss']
})
export class EstablecimientosComponent implements OnInit {

  cols: InterfaceColumnasGrilla[] = [];
  colsAlmacen: InterfaceColumnasGrilla[] = [];
  treeTable: any[] = [];
  arrayAlmacen : any[] = []; 
  listaEstablecimiento : TreeNode[] = [];

  VistaNuevoEstablecimiento : boolean = false;
  VistaSeries : boolean = false;
  modalNuevoAlmacen : boolean = false;
  idEstablecimientoEdit : number = null; 
  dataAlmacenEdit : any; 

  pagina: number = 1;
  size: number = 50;
  textoPaginado : string="";

 
  constructor(
    private swal : MensajesSwalService, 
    private establecimientoService : EstablecimientoService,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) { 
    this.generalService._hideSpinner$.subscribe(x => {
      this.spinner.hide();
    })
  }

  ngOnInit(): void {
    this.cols = [ 
      { field: 'codSunat', header: 'Cod. Sunat', visibility: true }, 
      { field: 'nombre', header: 'Nombre', visibility: true},  
      { field: 'ubigeo', header: 'Ubigeo', visibility: true }, 
      { field: 'direccion', header: 'Dirección', visibility: true},    
      { field: 'nombreComercial', header: 'Nombre Comercial', visibility: true},  
      { field: 'fechaRegistro', header: 'Fec.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];
    
    this.colsAlmacen = [ 
      { field: 'nombreAlmacen', header: 'Nombre', visibility: true }, 
      { field: 'fechaRegistro', header: 'Fec.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];
    
    this.onLoadEstablecimientos(null);
  }

  /* FUNCIONES DE Establecimientos */
  onLoadEstablecimientos(event : any){
    const Params = {
      pagIndex : event ? event.first :  this.pagina,
      itemsporpagina : event ? event.rows : this.size
    }
    this.spinner.show();
    this.establecimientoService.listadoEstablecimientos(Params).subscribe((resp) =>{
      if(resp){
        this.textoPaginado = resp.label; 
        this.treeTable = resp.items;

        let finall : any[] = [];
        this.treeTable.forEach((x) => {
          finall.push({
            codSunat : x.codSunat,
            id : x.idEstablecimiento,
            nombre : x.nombre,
            ubigeo : x.ubigeo,
            direccion : x.direccion,
            nombreComercial : x.nombreComercial,
            fechaRegistro : x.fechaRegistro,
            almacenes : x.almacenes,  
          })
        })
        this.listaEstablecimiento = finall;
        this.spinner.hide();
      }
    });
  }

  onAddEstablecimiento(){ 
    this.idEstablecimientoEdit = null;
    this.VistaNuevoEstablecimiento = true;
  }
  
  onEditEstablecimiento(id : number){  
    this.idEstablecimientoEdit = id;
    this.VistaNuevoEstablecimiento = true;
  }

  onVerSeries(id : number){
    this.idEstablecimientoEdit = id;
    this.VistaSeries = true;
  }


  /* FUNCIONES DE ALMACEN */
  onAddAlmacen(idEstablecimiento : number){ 
    const Data = { idEstablecimiento }
    this.dataAlmacenEdit = Data
    this.modalNuevoAlmacen = true;
  }

  onEditAlmacen(idAlmacen : any, idEstablecimiento : any){ 
    const Data = {
      idAlmacenEdit : idAlmacen,
      idEstablecimiento : idEstablecimiento
    }
    this.dataAlmacenEdit = Data;
    this.modalNuevoAlmacen = true;
  }
 
  onDelete(data:any){
    this.swal.mensajePregunta("¿Seguro que desea eliminar el almacén " + data.nombreAlmacen + " ?").then((response) => {
      if (response.isConfirmed) {
        this.establecimientoService.deleteAlmacen(data.idAlmacen).subscribe((resp) => { 
          this.onLoadEstablecimientos(null); 
          this.swal.mensajeExito('El almacén ha sido eliminado correctamente!.'); 
        });
      }
    })  
  }

  

  onRetornar(event : any){    
    if(event){
      this.onLoadEstablecimientos(null)
     }

    this.VistaNuevoEstablecimiento  = false; 
    this.VistaSeries = false;
    this.modalNuevoAlmacen = false;

  }


  
  
}
