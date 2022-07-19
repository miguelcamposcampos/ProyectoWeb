import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { forkJoin } from 'rxjs';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ITomaInventario } from './interface/tomainventario.interface';
import { TomaInventarioService } from './service/tomainventario.service';

@Component({
  selector: 'app-toma-inventario',
  templateUrl: './toma-inventario.component.html'
})
export class TomaInventarioComponent implements OnInit { 
  Form: FormGroup;
  cols: InterfaceColumnasGrilla[] =[];
  listadoTomaInventario : ITomaInventario; 
  es = ConstantesGenerales.ES_CALENDARIO;
  arrayEstablecimiento : ICombo[];
  arrayAlmacenes : ICombo[]; 
  fechaActual = new Date; 
  dataPredeterminadosDesencryptada :any;

  constructor(
    private generalService : GeneralService,
    private tomainventarioService: TomaInventarioService,
    private messageService: MessageService,
    private swal : MensajesSwalService,
    private config : PrimeNGConfig,
    private dataFormat : DatePipe,
    private spinner : NgxSpinnerService
    
  ) {
    this.builform();
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
   }

   public builform(){
     this.Form = new FormGroup({
      establecimientoid : new FormControl(null, Validators.required),
      almacenid : new FormControl(null, Validators.required),
      fechaInicio : new FormControl(this.fechaActual),
      fechaFin : new FormControl(this.fechaActual),
      codigo: new FormControl(null),
      cantidad: new FormControl(1), 
     })
   }

  ngOnInit(): void {
    this.onCargarDropdown();
    this.dataPredeterminadosDesencryptada = JSON.parse(localStorage.getItem('Predeterminados')); 
    if(this.dataPredeterminadosDesencryptada){
      this.onAlmacenesPorId(+this.dataPredeterminadosDesencryptada.idEstablecimiento)
    }

  
    this.config.setTranslation(this.es);
    this.onLoadTomaInventarios();
    
    this.cols = [  
      { field: 'almacen', header: 'Almacen', visibility: true }, 
      { field: 'codProducto', header: 'Cod. Producto', visibility: true},   
      { field: 'producto', header: 'Producto', visibility: true }, 
      { field: 'linea', header: 'Linea', visibility: true},  
      { field: 'cantidad', header: 'Cantidad', visibility: true},   
      { field: 'fechaRegistro', header: 'Fec.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA },  
     // { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];

  }

  onCargarDropdown(){
    const obsDatos = forkJoin(  
      this.generalService.listadoComboEstablecimientos(), 
    );
    obsDatos.subscribe((response) => {
      this.arrayEstablecimiento = response[0];   
      if(this.dataPredeterminadosDesencryptada){
        this.Form.patchValue({
          establecimientoid: this.arrayEstablecimiento.find(
            (x) => x.id === +this.dataPredeterminadosDesencryptada.idEstablecimiento
          )
        })
      }
    });
  }
 

  

  onObtenerEstablecimiento(event : any){ 
    if(event){ 
      this.onAlmacenesPorId(event.value.id)
    }
  }

  onAlmacenesPorId(event: number){
    this.generalService.listadoAlmacenesParams(event).subscribe((resp) =>{
      if(resp){ 
        this.arrayAlmacenes = resp; 
        this.Form.patchValue({ 
          almacenid: this.arrayAlmacenes.find(
            (x) => x.id === +this.dataPredeterminadosDesencryptada.idalmacen
          ), 
        })
      }
    });
  }

 

  onLoadTomaInventarios(){ 
    const dataform = this.Form.value; 
    const data = {
      finicio : this.dataFormat.transform(dataform.fechaInicio, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      ffin : this.dataFormat.transform(dataform.fechaFin, ConstantesGenerales._FORMATO_FECHA_BUSQUEDA),
      idAlmacen :  dataform.almacenid ? dataform.almacenid.id : 0
    }
    this.spinner.show();
    this.tomainventarioService.listadoTomaInventario(data).subscribe((resp) => {
      if(resp){
        this.listadoTomaInventario = resp;
        this.spinner.hide();
      }
    });
  }


  onRegistrarProducto(){  
      const dataform = this.Form.value; 
      if(!dataform.establecimientoid|| !dataform.almacenid){
        this.swal.mensajeAdvertencia('Debe seleccionar un Establecimiento y un Almacen!.');
        return;
      }
  
      if(!dataform.codigo){
        this.swal.mensajeAdvertencia('Debes ingresar el codigo del producto.');
        return;
      }
  
      if(dataform.cantidad <= 0){
        this.swal.mensajeAdvertencia('Debes ingresar una cantidad valida!.');
        return;
      }
    
      const newTomaInventario = {
        almacenid : dataform.almacenid.id,
        codProducto : dataform.codigo,
        cantidad : dataform.cantidad
      } 
      this.tomainventarioService.createTomaInventario(newTomaInventario).subscribe((resp) => {
       if(resp){
        this.onLoadTomaInventarios();
       }  
       this.messageService.add({key: 'ToastExitoso', severity:'success', summary: 'EXCELENTE!.', detail:  newTomaInventario.cantidad + ' Productos fueron registrados con exito!.'});
       this.Form.controls['cantidad'].setValue(1);
      });
    } 

}


 