import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ReciboPorHonorarioService } from './service/reciboporhonorario.service';

@Component({
  selector: 'app-reciboporhonorario',
  templateUrl: './reciboporhonorario.component.html',
  styleUrls: ['./reciboporhonorario.component.scss']
})
export class ReciboporhonorarioComponent implements OnInit {

  cols: InterfaceColumnasGrilla[] = [];
  FormBusqueda : FormGroup;   
  listadoReciboPorHonorario : any[];
  dataRxH: any;
  fechaActual = new Date(); 
  es = ConstantesGenerales.ES_CALENDARIO;
  VistaNuevoReciboPorHonorario : boolean = false; 
  modalBuscarPersona: boolean = false; 
  existeClienteSeleccionado : boolean = false;
  idProveedorSeleccionado : number = 0;
  textoPaginado : string="";
  pagina: number = 1;
  size: number = 50;

  constructor(
    private swal : MensajesSwalService,
    private config : PrimeNGConfig,
    private rxhservice: ReciboPorHonorarioService, 
    private formatFecha : DatePipe
    ) {
      this.builform();
    }

    public builform(){
      this.FormBusqueda = new FormGroup({
        fechaInicio: new FormControl(this.fechaActual, Validators.required),
        fechaFin: new FormControl(this.fechaActual, Validators.required),
        cliente: new FormControl(''),
      })
    }
  


    ngOnInit(): void {
      this.config.setTranslation(this.es);  
      this.onLoadRecibosPorHonorario(null);
      this.cols = [ 
        { field: 'nroRegistro', header: 'Nro Registro', visibility: true }, 
        { field: 'tipoDocumento', header: 'Tipo Documento', visibility: true},   
        { field: 'nroDocumento', header: 'Nro Documento', visibility: true},   
        { field: 'fechaEmision', header: 'Fec. Emision',  visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA},   
        { field: 'fechaVencimiento', header: 'Fec. Vencimiento',  visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA},   
        { field: 'clienteDocumento', header: 'Cliente Documento', visibility: true},   
        { field: 'clienteNombreRazSocial', header: 'Cliente Nombre / R.Social', visibility: true}, 
        { field: 'moneda', header: 'Moneda', visibility: true }, 
        { field: 'importe', header: 'Importe', visibility: true},   
        { field: 'saldo', header: 'Saldo', visibility: true},  
        { field: 'estadoSUNAT', header: 'Sunat', visibility: true},   
        { field: 'vendedor', header: 'Vendedor', visibility: true},   
        { field: 'fechaRegistro', header: 'Fec. Registro',  visibility: true, formatoFecha : ConstantesGenerales._FORMATO_FECHA_VISTA},   
        { field: 'usuarioRegistro', header: 'Usuario. Reg', visibility: true},   
        { field: 'acciones', header: 'Ajustes', visibility: true  }, 
      ];
    }

    onLoadRecibosPorHonorario(event : any){
      const dataform = this.FormBusqueda.value;
      const data = {
        paginaindex  :  event ? event.firs : this.pagina,
        itemsxpagina : event ? event.rows : this.size,
        finicio : this.formatFecha.transform(dataform.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
        ffin : this.formatFecha.transform(dataform.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA), 
        proveedorid : this.idProveedorSeleccionado,
      }
      this.swal.mensajePreloader(true);
      this.rxhservice.listadoReciboPorHonorario(data).subscribe((resp)=> {
        if(resp){  
          this.textoPaginado = resp.label;
          this.listadoReciboPorHonorario = resp.items;  
        }
        this.swal.mensajePreloader(false);
      })
  
    }
  
    /* BUSCAR CLIENTE */
    onBuscarCliente(){
      this.modalBuscarPersona = true;
    }
  
    onPintarPersonaSeleccionada(data: any){
      this.idProveedorSeleccionado = data.idProveedor;
      this.FormBusqueda.controls['cliente'].setValue(data.nombreRazSocial);
      this.existeClienteSeleccionado = true;
      this.modalBuscarPersona = false;
    }
  
    onBorrarCliente(){
      this.swal.mensajePregunta('¿Seguro de quitar al cliente actual?').then((response) => {
        if (response.isConfirmed) {
          this.idProveedorSeleccionado = null;
          this.FormBusqueda.controls['cliente'].setValue(null);
          this.existeClienteSeleccionado = false;
        }
      })
    }
  
   
    onNuevo(){
      this.dataRxH = null
      this.VistaNuevoReciboPorHonorario = true;
    }
   
    onEditar(ventas : any){
      this.dataRxH = ventas
      this.VistaNuevoReciboPorHonorario = true;
    }
  
    onEliminar(ventas: any){ 
      this.swal.mensajePregunta("¿Seguro que desea eliminar la venta con nuero de registro: " + ventas.nroRegistro + " ?").then((response) => {
        if (response.isConfirmed) {
          this.swal.mensajeExito('El documento se ha sido eliminado correctamente!.'); 
          this.rxhservice.deleteRxh(ventas.idVenta).subscribe((resp) => {
            if(resp){
              this.onLoadRecibosPorHonorario(null);
            }
          })
        }
      })  
    }
   
  
    onRetornar(event : any){
      if(event === "exito"){
        this.onLoadRecibosPorHonorario(null);
      }
      this.VistaNuevoReciboPorHonorario = false; 
    }
  
  
    
    

}
