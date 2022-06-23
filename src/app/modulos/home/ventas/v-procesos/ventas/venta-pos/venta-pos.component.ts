import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services'; 

@Component({
  selector: 'app-venta-pos',
  templateUrl: './venta-pos.component.html',
  styleUrls: ['./venta-pos.component.scss']
})
export class VentaPOSComponent implements OnInit {
    
  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();

  @Output() cerrar : any = new EventEmitter<any>();
  arrayEstablecimientos : ICombo[];
  arrayAlmacenes : ICombo[];
  Form: FormGroup;
  idEstablecimientoSeleccionado : number = 0; 
  almacenParabuscarStock : any[]=[];
  dataVentaPos : any;
  fechaActual = new Date;
  periodoActual = this.fechaActual.getFullYear();

  mostrarItemsVentaPos : boolean = false;
  isSqueletonDiv : boolean = false;  
  dataPredeterminadosDesencryptada :any;

  constructor(
    private generalService : GeneralService,
  ) { 
    this.builform();
  }

  public builform(){
    this.Form = new FormGroup({
     establecimientoid : new FormControl(null, Validators.required),
     almacenid : new FormControl(null, Validators.required), 
    })
  }

  ngOnInit(): void {
    this.isSqueletonDiv = true;  
    this.onCargarDropdown(); 
  }
 
   
  onCargarDropdown(){
    const obsDatos = forkJoin(
      this.generalService.listadoComboEstablecimientos(), 
    );
    obsDatos.subscribe((response) => {
      this.arrayEstablecimientos = response[0]; 
      this.FlgLlenaronCombo.next(true);
      this.dataPredeterminadosDesencryptada = JSON.parse(localStorage.getItem('Predeterminados')); 
      if( this.dataPredeterminadosDesencryptada ){
        this.Form.patchValue({
          establecimientoid: this.arrayEstablecimientos.find(
            (x) => x.id === this.dataPredeterminadosDesencryptada.idEstablecimiento ?? 0
          ), 
        })
        this.onCargarAlmacenes(+this.dataPredeterminadosDesencryptada.idEstablecimiento ?? 0 );
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }
 
  onObtenerEstablecimiento(event : any){ 
    if(event.value){ 
        this.onCargarAlmacenes(event.value.id) 
    }else{ 
      this.arrayAlmacenes = []; 
    }
  }

  onCargarAlmacenes(id : number){
    this.generalService.listadoAlmacenesParams(id).subscribe((resp) =>{
      if(resp){
        this.arrayAlmacenes = resp
        if( this.dataPredeterminadosDesencryptada ){
          this.Form.patchValue({
            almacenid: this.arrayAlmacenes.find(
              (x) => x.id === +this.dataPredeterminadosDesencryptada.idalmacen
            ), 
          })
          this.onObtenerAlmacen(+this.dataPredeterminadosDesencryptada.idalmacen);
        }
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }


  onObtenerAlmacen(event :any){
    if(event){ 
      if(!this.almacenParabuscarStock.includes(event)){
        this.almacenParabuscarStock.push(event); 
      }
      this.onShowItems();  
    }else{
      return;
    }
  } 

  onShowItems(){
    const dataForm = this.Form.value;
    const data = { 
      periodo : this.periodoActual, 
      arrayAlmacenes : this.almacenParabuscarStock, 
      idEstablecimiento : dataForm.establecimientoid.id 
    } 
    this.isSqueletonDiv = false;  
    this.dataVentaPos = data
    this.mostrarItemsVentaPos = true;
  }

  
  onRegresar(){
    this.cerrar.emit(false)
  }

  


}
