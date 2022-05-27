import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';  
import { FormControl, Validators } from '@angular/forms';
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
  pintarforeach : boolean = false;
  cantidadIngresada = new FormControl(0, Validators.required);

  constructor(
    private planesService: PlanesService,  
    private swal : MensajesSwalService,
    private authService : AuthService,
    private generalService : GeneralService
  ) {  
    this.authService.verificarAutenticacion(); 
  }

  ngOnInit(): void {  
    this.onCargarPlanes();  
    this.onInfoPlan(1)
  }

  onCargarPlanes(){
    this.swal.mensajePreloader(true);
    this.planesService.planesGet().subscribe((resp)=>{ 
      if(resp){
        this.listaPlanes = resp;  
      }
      this.swal.mensajePreloader(false);
    },error => {
      this.generalService.onValidarOtraSesion(error);
   })
  }

  onInfoPlan(plan : any){   
    this.cantidadIngresada.setValue(0); 
    let id = (plan.index + 1)
    const idplan = id ? id : 1;
    this.swal.mensajePreloader(true);
    this.planesService.datosPlanPorId(idplan).subscribe((resp) => { 
      if(resp.length > 1){
        let ArrayDatos: IDatosPlan[] = Object.values(resp) 
        this.datosPlanArray = ArrayDatos;
        this.pintarforeach = true;  
      }else{
        this.pintarforeach = false 
        let Datos : IDatosPlan[] = Object.values(resp) 
        this.datosPlan = Datos[0];   
      }
      this.swal.mensajePreloader(false);
    },error => {
      this.generalService.onValidarOtraSesion(error);
   })
  }

  onPlanElegido(plan : any){  
    console.log('plan elegido',plan);
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
