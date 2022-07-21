import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICuentasMayores } from './interface/cuentas-mayores.interface';
import { CuentasMayoresService } from './service/cuentas-mayores.service';

@Component({
  selector: 'app-cuentas-mayores',
  templateUrl: './cuentas-mayores.component.html',
  styleUrls: ['./cuentas-mayores.component.scss']
})
export class CuentasMayoresComponent implements OnInit {

  cols: InterfaceColumnasGrilla[] =[];
  vNuevaCuenta : boolean = false; 
  data : any; 
  list : ICuentasMayores[];


  constructor(
    private swal  : MensajesSwalService,
    private apiService : CuentasMayoresService,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) {
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
   }

  ngOnInit(): void {
    this.onLoadList(); 
    this.cols = [ 
      { field: 'nroCuenta', header: 'Nro cuenta', visibility: true }, 
      { field: 'nombreCuenta', header: 'Nombre cuenta', visibility: true},   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ]; 
  }


  onLoadList(){
    this.spinner.show();
    this.apiService.list().subscribe((resp=> {
      this.list = resp;
      this.spinner.hide();
    }))
  }

  onAdd(){ 
    this.data = null;
    this.vNuevaCuenta = true;
  }

  onEdit(data: ICuentasMayores){
    this.data = data; 
    this.vNuevaCuenta = true;
  }

  onDelete(data: ICuentasMayores){
    console.log('data', data);
    this.swal.mensajePregunta("¿Seguro que desea eliminar el número de cuenta " + data.nroCuenta  + " ?").then((response) => {
      if (response.isConfirmed) {
        this.apiService.delete(data.idPlanCuenta).subscribe((resp) => { 
          this.onLoadList(); 
          this.swal.mensajeExito('El número de cuenta sido eliminado correctamente!.'); 
        });
      }
    })  
  }



  onRegresar(event: any){
    if(event) {
      this.onLoadList();
    }
    this.vNuevaCuenta = false;
  }
}
