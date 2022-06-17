import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces'; 
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IListadoStock } from '../../home/almacen/a-procesos/consulta-stock/interface/consultastock.interface';
import { ConsultaStockService } from '../../home/almacen/a-procesos/consulta-stock/service/consultastock.service';

@Component({
  selector: 'app-buscar-producto',
  templateUrl: './buscar-producto.component.html',
  styleUrls: ['./buscar-producto.component.scss']
})
export class BuscarProductoComponent implements OnInit {

  @Input() dataProductos : any;
  @Output() productoSelect : EventEmitter<any> = new EventEmitter<any>();

  cols : InterfaceColumnasGrilla[]=[];
  soloServicio = new FormControl(false);
  criterio = new FormControl('');
  fechaActual = new Date();
  periodo = this.fechaActual.getFullYear();
  listaProductos: IListadoStock[]
  arrayAlmacenes: any[]=[];

  constructor(
    private consultastockService : ConsultaStockService, 
    private swal : MensajesSwalService,
    private spinner : NgxSpinnerService

  ) {
   
   }

  ngOnInit(): void { 
   // this.onLoadProductos();

    this.cols = [ 
      { field: 'codProducto', header: 'Codigo', visibility: true }, 
      { field: 'nombreProducto', header: 'Nombre', visibility: true }, 
      { field: 'stockUnidades', header: 'Stock', visibility: true},    
      { field: 'stockFinal', header: 'Stock Final', visibility: true},     
      { field: 'lote', header: 'Lote.', visibility: true},    
      { field: 'serie', header: 'Serie.', visibility: true},    
      { field: 'linea', header: 'Linea.', visibility: true},    
      { field: 'marca', header: 'Marca', visibility: true},    
      // { field: 'modelo', header: 'Modelo', visibility: true},   
      // { field: 'color', header: 'Color', visibility: true},    
      // { field: 'permiteEditarDescripcion', header: 'Edita Descrip.', visibility: true , tipoFlag:'boolean'},    
      // { field: 'esServicio', header: 'Es Servivio', visibility: true , tipoFlag:'boolean'},    
      // { field: 'esAfectoICBPER', header: 'Es AfectoCBPER', visibility: true , tipoFlag:'boolean'},    
      { field: 'unidadMedida', header: 'Und. Medida', visibility: true},    
      { field: 'precioDefault', header: 'Precio Default', visibility: true},    
      { field: 'precioIncluyeIgv', header: 'Incluye Igv', visibility: true , tipoFlag:'boolean'},    
      { field: 'monedaPrecioId', header: 'Cod Moneda', visibility: true},    
    ];

  }

  onBuscarProductos(){
    if(!this.criterio.value){
      this.swal.mensajePregunta("¿Desea hacer la busqueda de productos sin filtro?, esto podria tomar un tiempo!.").then((response) => {
        if (response.isConfirmed) {
          this.criterio.setValue('')
          this.onLoadProductos();
        }else{ 
         return;
        }
      })  
    }else{
      this.onLoadProductos();
    }
  }
  

  onLoadProductos(){
    this.arrayAlmacenes.push(this.dataProductos.idAlmacenSelect);

    const data = {
      periodo : this.periodo,
      criteriodescripcion : this.criterio.value,
      arrayAlmacenes : this.arrayAlmacenes,
      soloservicios: this.soloServicio.value
    }
    this.spinner.show(); 
    this.consultastockService.listadoStock(data).subscribe((resp)=> {
      if(resp){ 
        this.listaProductos = resp;
        this.spinner.hide();
      }  
    })
   
  }

  onSeleccionarProducto(event: any){
    if(event){ 
      this.swal.mensajePregunta("Seguro de seleccionar: " + event.data.nombreProducto + " ?").then((response) => {
        if (response.isConfirmed) {  
          const data ={
            data : event.data,
            posicion : this.dataProductos.idPosicionProducto
          }
          this.productoSelect.emit(data);
        }
      })   
    }


  }

}
