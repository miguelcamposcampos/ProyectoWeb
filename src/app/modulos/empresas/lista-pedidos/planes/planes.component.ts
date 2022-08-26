import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';  
import { FormControl, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/services/auth.service';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IDatosPlan, IPlanes } from '../../interface/empresa.interface'; 
import { PlanesService } from '../../services/planes.services';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.scss']
})
export class PlanesComponent implements OnInit {
  
  @Input() mostrarHeader!: boolean; //datos de la empresa que queremos asociar a un plan 
  @Output() onChange : any  = new EventEmitter();
  @Output() cerrar : any  = new EventEmitter<boolean>();
 
  listaPlanes : IPlanes[] = []; 
  datosPlan! : IDatosPlan; 
  datosPlanArray! : IDatosPlan[]; 
  mostrardatosArray : boolean = false;
  cantidadIngresada = new FormControl(0, Validators.required);

  constructor(
    private planesService: PlanesService,  
    private swal : MensajesSwalService,
    private authService : AuthService,
    private generalService : GeneralService,
    private spinner: NgxSpinnerService
  ) {  

    this.generalService._hideSpinner$.subscribe(x => {
      this.spinner.hide();
    })

    this.authService.verificarAutenticacion(); 
  }

  ngOnInit(): void {  
    this.onCargarPlanes();  
  //  this.onInfoPlan(1)
  }

  onCargarPlanes(){
    this.spinner.show();
    this.planesService.planesGet().subscribe((resp)=>{ 
      if(resp){
        this.listaPlanes = resp;  
        this.onInfoPlan(null);
        this.spinner.hide();
      } 
    });
  }

  onInfoPlan(plan : any){   
    this.cantidadIngresada.setValue(0);  
    const idplan = plan ? plan + 1 : 1;
    this.spinner.show();

    this.planesService.datosPlanPorId(idplan).subscribe((resp) => { 
      if(resp){
        if(resp.length > 1){
          this.mostrardatosArray = true;
        }else{
          this.mostrardatosArray = false;
        }
        let ArrayDatos: IDatosPlan[] = Object.values(resp) 
        this.datosPlanArray = ArrayDatos; 
        this.spinner.hide();
      }
    }); 
  }

  onPlanElegido(plan : any){   
    if(!this.cantidadIngresada.value){
      this.swal.mensajeAdvertencia('Debe ingresar una cantidad');
      return;
    }
    const PlanElegido : any = {
      plan : plan,
      cantidad : this.cantidadIngresada.value
    } 
    this.onChange.emit(PlanElegido);   
    this.cantidadIngresada.value === 0; 
  }
  
  
  onRegresar() { 
    this.cerrar.emit(false); 
  }
    

}
