import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IPlantillaExcel, ISubirProductos } from '../interface/producto.interface';
import { ProductosService } from '../service/productos.service';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';    

@Component({
  selector: 'app-subir-productos',
  templateUrl: './subir-productos.component.html'
})
export class SubirProductosComponent implements OnInit {

  
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  cols: InterfaceColumnasGrilla[] = [];
  arrayProductos : ISubirProductos[]=[];
  plantillaExcel : IPlantillaExcel;
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  DataImportada : ISubirProductos[] = [];
  data :any[]= [];
  mostrarBotonCargar : boolean = true; 

  constructor(
    private productoService : ProductosService, 
    private swal : MensajesSwalService, 
  ) { }

  ngOnInit(): void {
    this.cols = [ 
      { field: 'CodigoProducto', header: 'Cod.Producto', visibility: true }, 
      { field: 'CodProveedor', header: 'Cod.Proveedor', visibility: true }, 
      { field: 'CodUnesco', header: 'Cod.Unesco', visibility: true }, 
      { field: 'Nombre', header: 'Nombre', visibility: true },
      { field: 'CodUnidadMedida', header: 'Cod.Unidad Medida', visibility: true }, 
      { field: 'EsArticulo', header: 'Articulo', visibility: true }, 
      { field: 'EsServicio', header: 'Servicio', visibility: true }, 
    ];

   
  } 
 
  onDescargarPlantilla(){
    const tipoPlantilla = "Productos";
    this.productoService.descargarPlantillaExcel(tipoPlantilla).subscribe((resp) => {
        if(resp){
          this.plantillaExcel = resp;
          var blob = new Blob([this.onBase64ToArrayBuffer(this.plantillaExcel.content)], {type: "application/xlsx"}); 
          saveAs(blob, "Plantilla Subir Productos.xlsx");
        }
      });
  }

  onBase64ToArrayBuffer(base64) {
    const binary_string = window.atob(this.plantillaExcel.content);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    } 
    return bytes.buffer;
  }


  onUpload(event : any) {     
    let data;
    const target: DataTransfer = <DataTransfer>(event);   
    if (target.files){
      const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];

          data = XLSX.utils.sheet_to_json(ws); 
          let arrayData = data;
          arrayData.forEach(element => {  
            this.mostrarBotonCargar = false;
            this.arrayProductos.push(element)
          });
        };
         reader.readAsBinaryString(target.files[0]); 
    }
  }
  
  onLimpiarTabal(){
    this.arrayProductos = [];
    this.mostrarBotonCargar = true;
  }


  onGrabarListaProductos(){
    this.productoService.createSubirProductos(this.arrayProductos).subscribe((resp) =>{
      if(resp){
        this.swal.mensajeExito('Se cargo la lista de productos correctamente!.');
        this.onVolver();
      }
    });
  }

  onVolver(){
    this.cerrar.emit('exito')
  }

  onRegresar(){
    this.cerrar.emit(false)
  }



}
