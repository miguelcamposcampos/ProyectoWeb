import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { forkJoin, Subject } from 'rxjs'; 
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IItemsProductos } from './interface/producto.interface';
import { ProductosService } from './service/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss']
})
export class ProductosComponent implements OnInit {
 
  VistaNuevoProducto : boolean = false;
  VistaReporte : boolean = false;
  VistaSubirProductos : boolean = false;
   
  cols: InterfaceColumnasGrilla[] = [];

  arrayColores : ICombo[];
  arrayLinea : ICombo[];
  arrayTipoProducto : ICombo[];
 
  listaProductos : IItemsProductos[];
  textoPaginado : string="";
  FormBusqueda  : FormGroup;
 
  opcioneSplitNProducto : MenuItem[];
 
  pagina: number = 1;
  row: number = 50;
  totalItems : number  = 0;
  idProductoEdit : number = 0; 
 
  constructor(
    private swal : MensajesSwalService,
    private productoService : ProductosService,
    private generalService: GeneralService

  ) { 
    this.builform();
  }

  private builform() : void {
    this.FormBusqueda = new FormGroup({
      criterio: new FormControl(''), 
      soloActivo: new FormControl(true), 
      usadoVentas: new FormControl(true),  
      usadoCompras: new FormControl(true), 
      soloServicioArticulo: new FormControl('Todos'),   
      soloServicio: new FormControl(false),
      soloArticulo: new FormControl(false),
      idLinea: new FormControl(null),   
      idColor: new FormControl(null),   
      idtipoProducto: new FormControl(null),
    });
  }


  ngOnInit(): void {  
    this.cols = [ 
      { field: 'codigo', header: 'Cod', visibility: true }, 
      { field: 'descripcion', header: 'Descripcion', visibility: true},  
      { field: 'linea', header: 'Linea', visibility: true }, 
      { field: 'modelo', header: 'Modelo', visibility: true }, 
      { field: 'color', header: 'Color', visibility: true }, 
      { field: 'codigoProveedor', header: 'Cod. Proovedor', visibility: true },  
      { field: 'fechaRegistro', header: 'Fec.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'estado', header: 'Estado', visibility: true , tipoFlag: 'estado', }, 
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];
   
    this.onOpcionesProducto();  
    this.onCargarDropDown();  
  }

  onCargarDropDown(){ 
    const obsDatos = forkJoin( 
      this.generalService.listadoColores(), 
      this.generalService.listadoLineas(),  
      this.generalService.listadoPorGrupo('TipoProducto'), 
    );
    obsDatos.subscribe((response) => {
      this.arrayColores = response[0];
      this.arrayLinea = response[1];  
      this.arrayTipoProducto = response[2];   
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
 
  } 
 
  onOpcionesProducto(){
    this.opcioneSplitNProducto = [ 
      {
        label:'Reporte',
        icon:'pi pi-fw pi-file',
        command:()=>{
          this.onVistaReporte();
        }
      },
      {
        label:'Subir Producto',
        icon:'pi pi-fw pi-cloud-upload',
        command:()=>{
         this.onVistaSubirProductos();
        }
      }, 
    ]
  }
   
 

  onLoadProductos(event : any){ 
    const data = this.FormBusqueda.value 
    /* Validacion de radios */
    if(data.soloServicioArticulo === "SoloArticulo"){ 
      data.soloArticulo = true;
      data.soloServicio = false; 
    }else if(data.soloServicioArticulo === "SoloServicio"){
      data.soloServicio = true; 
      data.soloArticulo = false;
    }else{
      data.soloArticulo = false;
      data.soloServicio = false; 
    }
 
    const datapaginado  = {
      descripcion:  data.criterio, 
      idLinea : data.idLinea ? data.idLinea.id : -1,
      idColor :  data.idColor ?  data.idColor.id : -1,
      tipoProductoId :  data.idtipoProducto ? data.idtipoProducto.id : -1,
      soloActivos :  data.soloActivo,
      soloArticulos :  data.soloArticulo,
      soloServicios:  data.soloServicio,
      usadoCompras :  data.usadoCompras,
      usadoVentas:  data.usadoVentas,
      pagIndex : event ? event.first :  this.pagina,
      itemsporpagina : event ? event.rows : this.row
    } 
    this.productoService.listadoProductos(datapaginado).subscribe((resp) =>{
      if(resp){    
        this.totalItems = resp.total; 
        this.textoPaginado = resp.label;
        this.listaProductos = resp.items;  
        this.swal.mensajePreloader(false);  
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  }
  
  onNuevoProducto(){
    this.idProductoEdit = null;
    this.VistaNuevoProducto = true;
  }
  
  onVistaReporte(){
    this.VistaReporte = true;
  }
 
  onVistaSubirProductos(){
    this.VistaSubirProductos = true;
  }

  onEditar( idproducto : any){   
    this.idProductoEdit = idproducto
    this.VistaNuevoProducto = true;
  }
 
  
  onModalEliminar(data:any){ 
    this.swal.mensajePregunta("¿Seguro que desea eliminar el producot " + data.descripcion + " ?").then((response) => {
      if (response.isConfirmed) {
        this.productoService.deletePrecio(data.id).subscribe((resp) => { 
          this.onLoadProductos(null); 
          this.swal.mensajeExito('El producto ha sido eliminado correctamente!.'); 
        },error => { 
          this.generalService.onValidarOtraSesion(error);
        });
      }
    })  
  }
 

  onRetornar(event: any){ 
    if(event === 'exito'){
      this.onLoadProductos(null);
    }
    
    this.VistaNuevoProducto = false;
    this.VistaReporte = false;
    this.VistaSubirProductos = false;
  }

  
 
 
}
