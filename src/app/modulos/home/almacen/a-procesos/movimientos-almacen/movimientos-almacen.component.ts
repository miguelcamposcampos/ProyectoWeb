import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IMovimientosAlmacen } from './interface/movimientosalmacen.interface';
import { MovimientosAlmacenService } from './service/movimientosalmacen.service';

@Component({
  selector: 'app-movimientos-almacen',
  templateUrl: './movimientos-almacen.component.html',
  styleUrls: ['./movimientos-almacen.component.scss']  
})
export class MovimientosAlmacenComponent implements OnInit {
 
  cols: InterfaceColumnasGrilla[] =[];
  listaMovimientos : IMovimientosAlmacen[];
  opcioneSplitMovimientos: MenuItem[]; 
  FormBusqueda : FormGroup;
  textoPaginado : string="";
  pagina: number = 1;
  size: number = 50; 
  fechaActual = new Date();  
  dataMovimientoEdit : any;
  VistaNuevoMovimientos : boolean = false; 

  es : any = ConstantesGenerales.ES_CALENDARIO;
  
  constructor(
    private moviAlmacenService : MovimientosAlmacenService,
    private swal : MensajesSwalService,
    private readonly formatoFecha: DatePipe,
    private primengConfig : PrimeNGConfig,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) { 
    this.builform();
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })

  }

  public builform(): void {
    this.FormBusqueda = new FormGroup({
      anexo: new FormControl("", Validators.required),
      fechaInicioBusqueda: new FormControl(this.fechaActual, Validators.required),
      fechaFinBusqueda: new FormControl(this.fechaActual, Validators.required),  
    });
  }


  ngOnInit(): void {
    this.primengConfig.setTranslation(this.es);
    this.onOpcionesProducto();
    this.onLoadMovimientos();

    this.cols = [ 
      { field: 'tipoMovimientoId', header: 'Tipo Mov', visibility: true }, 
      { field: 'nroRegistro', header: 'Nro Registro', visibility: true }, 
      { field: 'registroRef', header: 'Registro Ref.', visibility: true},  
      { field: 'fecha', header: 'Fecha', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'glosa', header: 'Glosa', visibility: true }, 
      { field: 'anexo', header: 'Anexo', visibility: true},  
      { field: 'fechaRegistro', header: 'Fec.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'usuarioRegistro', header: 'Usuario Reg.', visibility: true},  
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];

  }

  onLoadMovimientos(){
    const form = this.FormBusqueda.value;
    let fechaInicioBusqueda = this.formatoFecha.transform(form.fechaInicioBusqueda, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA);
    let fechaFinBusqueda = this.formatoFecha.transform(form.fechaFinBusqueda, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA);
    
    const data = {
      paginaIndex :  this.pagina,
      itemsPorPagina : this.size,
      finicio : fechaInicioBusqueda,
      ffin : fechaFinBusqueda
    } 
    this.spinner.show();
    this.moviAlmacenService.listadodeMovimientosAlmacen(data).subscribe((resp)=> {
      if(resp){
        this.textoPaginado = resp.label;
        this.listaMovimientos = resp.items;  
        this.spinner.hide();
      } 
    });
  }

  onOpcionesProducto(){
    this.opcioneSplitMovimientos = [
      {
        label:'Nuevo Ingreso',
        icon:'fas fa-arrow-alt-circle-down', 
        command:()=>{
          this.onNuevoIngreso();
        }
      },
      {
        label:'Nueva Salida',
        icon:'fas fa-arrow-alt-circle-up', 
        command:()=>{
          this.onNuevaSalida();
        }
      },
      {
        label:'Nueva Transferencia',
        icon:'fas fa-sync-alt',
        command:()=>{
         this.onNuevaTransferencia();
        }
      }, 
    ]
  }

  onNuevoIngreso(){
    this.dataMovimientoEdit = {idTipoMovimiento : 1 }
    this.VistaNuevoMovimientos = true;
  }

  onNuevaSalida(){
    this.dataMovimientoEdit = {idTipoMovimiento : 2 }
    this.VistaNuevoMovimientos = true;
  }

  onNuevaTransferencia(){
    this.dataMovimientoEdit = {idTipoMovimiento : 3 }
    this.VistaNuevoMovimientos = true;
  }

  onEditar(data : any){ 
    const dataMovimiento = {
      idTipoMovimiento : data.tipoMovimientoId,
      idMovimiento : data.id
    }  
    this.dataMovimientoEdit = dataMovimiento
    this.VistaNuevoMovimientos = true;
  }


  onModalEliminar(data:any){ 
    this.swal.mensajePregunta("¿Seguro que desea eliminar el movimiento con numero de registro: " + data.nroRegistro + " ?").then((response) => {
      if (response.isConfirmed) {
        this.moviAlmacenService.deletemovimientoAlmacen(data.id).subscribe((resp) => { 
          this.onLoadMovimientos(); 
          this.swal.mensajeExito('El movimiento ha sido eliminado correctamente!.'); 
        });
      }
    })  
  } 

  onRetornar(event : any){ 
    if(event ){
      this.onLoadMovimientos(); 
    } 
    this.VistaNuevoMovimientos = false;  
    
  }


}
