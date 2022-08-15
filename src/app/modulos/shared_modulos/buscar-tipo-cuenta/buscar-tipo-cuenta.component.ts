import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IModalPlanCuenta } from '../../home/contabilidad/cnt-mantenimientos/administracion-conceptos/interface/admin-conceptos.interface';

@Component({
  selector: 'app-buscar-tipo-cuenta',
  templateUrl: './buscar-tipo-cuenta.component.html',
  styleUrls: ['./buscar-tipo-cuenta.component.scss']
})
export class BuscarTipoCuentaComponent implements OnInit {

  @Input() tipoCuenta : any;
  @Output() CuentaSelect : EventEmitter<any> = new EventEmitter<any>();
  cols: InterfaceColumnasGrilla[] =[];
  list :  IModalPlanCuenta[];
  criterioBuscar = new FormControl(null)

  constructor(
    private generalService : GeneralService,
    private swal: MensajesSwalService,  
    private spinner : NgxSpinnerService
  ) { }

  ngOnInit(): void {  
    this.cols = [  
      { field: 'nroCuenta', header: 'Numero Cuenta', visibility: true },  
      { field: 'nombreCuenta', header: 'Nombre.', visibility: true},    
    ]; 
  }

  onLoad(){
    if(!this.criterioBuscar.value ){
      this.swal.mensajeAdvertencia('Debe ingresar un numero de cuenta para realizar la busqueda');
      return;
    }
    const data = { criterio : this.criterioBuscar.value  } 
    this.spinner.show(); 
    this.generalService.getcuentacontable(data).subscribe((resp) =>{
      if(resp){ 
        this.list = resp;
        this.spinner.hide();
      }  
    })
  }


  onSeleccionar(event : any){
    if(event){ 
      if(!event.data.esImputable){
        this.swal.mensajeAdvertencia('Debes seleccionar cuentas Imputables.');
        return;
      }
      this.swal.mensajePregunta("Seguro de seleccionar : " + event.data.nombreCuenta + " ?").then((response) => {
        if (response.isConfirmed) {  
          const data = {
            data : event.data,
            tipoCuenta : this.tipoCuenta,
            posicion: this.tipoCuenta
          }
          this.CuentaSelect.emit(data); 
        }
      })   
    }
  }

}
