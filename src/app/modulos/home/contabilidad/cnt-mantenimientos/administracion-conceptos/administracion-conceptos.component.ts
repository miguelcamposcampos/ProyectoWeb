import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service'; 
import { IListAdminConcepto } from './interface/admin-conceptos.interface';
import { AdministracionConceptosService } from './service/admin-conceptos.service';

@Component({
  selector: 'app-administracion-conceptos',
  templateUrl: './administracion-conceptos.component.html',
  styleUrls: ['./administracion-conceptos.component.scss']
})
export class AdministracionConceptosComponent implements OnInit {

  cols: InterfaceColumnasGrilla[] =[]; 
  vNuevo :boolean = false;
  data: any;
  list: IListAdminConcepto[];

  constructor(
    private apiService : AdministracionConceptosService,
    private swal : MensajesSwalService,
    private spinner : NgxSpinnerService,
    private generalService : GeneralService
  ) { 
    this.generalService._hideSpinner$.subscribe(x => {
      this.spinner.hide();
    })
  }

  ngOnInit(): void {  
    this.cols = [ 
      { field: 'codigo', header: 'Código', visibility: true }, 
      { field: 'nombre', header: 'Nombre', visibility: true},   
      { field: 'area', header: 'Area', visibility: true }, 
      { field: 'cuentaPrecioVenta', header: 'Cuenta Precio Venta', visibility: true},   
      { field: 'cuentaIgv', header: 'Cuenta Igv', visibility: true }, 
      { field: 'cuentaDetraccion', header: 'Cuenta Detracción', visibility: true},   
      { field: 'cuentaDescuento', header: 'Cuenta Descuento', visibility: true},   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ]; 
  }

  onLoadTable(){
    this.apiService.list().subscribe((resp) => {
      if(resp){   
        this.spinner.hide();
        this.list = resp; 
      }
    });
  }

  onAdd(data : IListAdminConcepto){
    this.data = null;
    this.vNuevo = true;
  }

  onEdit(data : IListAdminConcepto){
    this.data = data;
    this.vNuevo = true; 
  }

  onDelete(data: any){
    this.swal.mensajePregunta("¿Seguro que desea eliminar el registro " + data.nombre  + " ?").then((response) => {
      if (response.isConfirmed) {
        this.apiService.delete(data.conceptoContableId).subscribe((resp) => { 
          this.onLoadTable(); 
          this.swal.mensajeExito('El registro sido eliminado correctamente!.'); 
        });
      }
    })  
  } 

  onRegresar(event){ 
    this.vNuevo= false;
  }

}
