import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICreatePlanCuenta, IListPlanCuenta } from './interface/plan-cuentas.interface';
import { PlanCuentaService } from './service/plan-cuenta.service';

@Component({
  selector: 'app-plan-de-cuentas',
  templateUrl: './plan-de-cuentas.component.html',
  styleUrls: ['./plan-de-cuentas.component.scss']
})
export class PlanDeCuentasComponent implements OnInit {

  cols: InterfaceColumnasGrilla[] =[];
  vSubirPlanCuenta : boolean = false;
  vNuevoPlan:boolean = false;
  data: IListPlanCuenta;
  list: IListPlanCuenta[];
  nombrePlanCuenta:string="";
  nroCuentaBuscar = new FormControl(null, Validators.required);


  constructor(
    private apiService : PlanCuentaService,
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
      { field: 'nroCuenta', header: 'Nro Cuenta', visibility: true }, 
      { field: 'nombreCuenta', header: 'Nombre Cuenta', visibility: true},   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ]; 
  }

  onSearch(){
    this.spinner.show();  
    this.apiService.obtenernombrePlanCuenta(this.nroCuentaBuscar.value).subscribe((resp) => {
      console.log('resñ', resp);
      if(resp){  
        this.nombrePlanCuenta = resp.nombrecuenta;
        this.onLoadTable();
      }else{
        this.spinner.hide();
      }
    });
  }

  onLoadTable(){
    this.apiService.list(this.nroCuentaBuscar.value).subscribe((resp) => {
      if(resp){   
        this.spinner.hide();
        this.list = resp; 
      }
    });
  }
  
  onValidarNroCuenta(event :any){
    if(!event.target.value){
      this.nombrePlanCuenta = null;
      this.list=[];
    }
  }


  onAdd(){
    this.data = null;
    this.vNuevoPlan = true;
  }

  onEdit(data: IListPlanCuenta){
    this.data = data;
    this.vNuevoPlan = true;
  }


  onDelete(data: IListPlanCuenta){
    this.swal.mensajePregunta("¿Seguro que desea eliminar el plan de cuenta " + data.nombreCuenta  + " ?").then((response) => {
      if (response.isConfirmed) {
        this.apiService.delete(data.idPlanCuenta).subscribe((resp) => { 
          this.onLoadTable(); 
          this.swal.mensajeExito('El plan de cuenta sido eliminado correctamente!.'); 
        });
      }
    })  
  }

  onUpload(){
    this.vSubirPlanCuenta = true;
  }

  onRegresar(event){ 
    this.vNuevoPlan= false;
  }

  onRetornar(){
    this.vSubirPlanCuenta = false;
  }
}
