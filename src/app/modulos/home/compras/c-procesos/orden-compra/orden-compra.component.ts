import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { PrimeNGConfig } from 'primeng/api'; 
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { OrdenCompraService } from './service/ordencompraService';

@Component({
  selector: 'app-orden-compra',
  templateUrl: './orden-compra.component.html',
  styleUrls: ['./orden-compra.component.scss']
})
export class OrdenCompraComponent implements OnInit {
 
  es = ConstantesGenerales.ES_CALENDARIO
  cols : InterfaceColumnasGrilla[]=[];
  
  VistaNuevaOrdenCompra : boolean = false;
  existeProveedorSeleccionado : boolean = false;
  modalBuscarProveedor: boolean = false; 
  idProveedorSeleccionado : number = 0;

  Form : FormGroup;
  listaOrdenCompra : any[];
  dataOrdenCompra: any;
  fechaActual = new Date(); 
  textoPaginado : string="";
  pagina: number = 1;
  size: number = 50; 


  arrayDocumentos : ICombo[];

  constructor(
    private config : PrimeNGConfig,
    private formatFecha : DatePipe,
    private ocService : OrdenCompraService,
    private generalService : GeneralService,
    private swal : MensajesSwalService, 
    private spinner : NgxSpinnerService
  ) { 
    this.builform();
  }


  public builform(){
    this.Form = new FormGroup({
      fechaInicio: new FormControl(this.fechaActual, Validators.required),
      fechaFin: new FormControl(this.fechaActual, Validators.required),
      documento: new FormControl(null),
      serie: new FormControl(''),
      correlativo: new FormControl(null),
      proveedor : new FormControl(null)
    })
  }

  ngOnInit(): void {
    this.config.setTranslation(this.es)
    this.onLoadOrdenCompra(null);
    this.onCargarTipoDocumento(); 

    this.cols = [ 
      { field: 'nroRegistro', header: 'Nro Registro', visibility: true }, 
      { field: 'tipoDocumento', header: 'Tipo Documento', visibility: true},   
      { field: 'nroDocumento', header: 'Nro Documento', visibility: true},   
      { field: 'fechaEmision', header: 'Fec. Emision',  visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA},   
      { field: 'proveedorDocumento', header: 'Proveedor Documento', visibility: true},   
      { field: 'proveedorNombreRazSocial', header: 'Proveedor Nombre / R.Social', visibility: true}, 
      { field: 'moneda', header: 'Moneda', visibility: true }, 
      { field: 'importe', header: 'Importe', visibility: true},   
      { field: 'saldo', header: 'Saldo', visibility: true},     
      { field: 'vendedor', header: 'Vendedor', visibility: true},   
      { field: 'fechaRegistro', header: 'Fec. Registro',  visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA},   
      { field: 'usuarioRegistro', header: 'Usuario. Reg', visibility: true},   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];

  }

  onCargarTipoDocumento(){
    const data ={
      esOrdenCompra : true
     }
    this.generalService.listadoDocumentoPortipoParacombo(data).subscribe((resp)=> {
      if(resp){
        this.arrayDocumentos = resp;
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }
 
 

  onLoadOrdenCompra(event :any){ 
    
    const dataform = this.Form.value;
    const data = { 
      paginaIndex  : event ? event.first : this.pagina,
      itemsxpagina : event ? event.rows : this.size, 
      finicio : this.formatFecha.transform(dataform.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      ffin : this.formatFecha.transform(dataform.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA), 
      tipoDocId : dataform.documento ? dataform.documento.id : null,
      serie : dataform.serie,
      correlativo : dataform.correlativo,
      proveedorid : this.idProveedorSeleccionado,
    }

    this.spinner.show();
    this.ocService.listadoOrdenCompra(data).subscribe((resp) => {
      if(resp){ 
        this.listaOrdenCompra = resp.items;
        this.textoPaginado = resp.label;
        this.spinner.hide();
      }
    },error => { 
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  onNuevo(){
    this.dataOrdenCompra = null
    this.VistaNuevaOrdenCompra = true;
  }

  onEditar(compra : any){
    this.dataOrdenCompra = compra
    this.VistaNuevaOrdenCompra = true;
  }

  onEliminar(compra : any){
    console.log(compra);
    this.swal.mensajePregunta("¿Seguro que desea eliminar la orden de compra: " + compra.nroRegistro + " ?").then((response) => {
      if (response.isConfirmed) {
        this.swal.mensajeExito('La orden de Compra ha sido eliminado correctamente!.'); 
        this.ocService.deleteOrdenCompra(compra.idCompra).subscribe((resp) => {
          if(resp){
            this.onLoadOrdenCompra(null);
          }
        },error => { 
          this.generalService.onValidarOtraSesion(error);  
        });
      }
    })

  }


  /* BUSCAR PROVEEDOR */
  onBuscarProveedor(){
    this.modalBuscarProveedor = true;
  }

  onPintarProveedorSeleccionada(data: any){ 
    this.idProveedorSeleccionado = data.idproveedor;
    this.Form.controls['proveedor'].setValue(data.nombreRazSocial);
    this.existeProveedorSeleccionado = true;
    this.modalBuscarProveedor = false;
  }

  onBorrarProveedor(){
    this.swal.mensajePregunta('¿Seguro de quitar al proveedor actual?').then((response) => {
      if (response.isConfirmed) {
        this.idProveedorSeleccionado = null;
        this.Form.controls['proveedor'].setValue(null);
        this.existeProveedorSeleccionado = false;
      }
    })
  }



  onRetornar(event : any){
    if(event === 'exito'){
      this.onLoadOrdenCompra(null);
    }
    this.VistaNuevaOrdenCompra = false;
  }

}
