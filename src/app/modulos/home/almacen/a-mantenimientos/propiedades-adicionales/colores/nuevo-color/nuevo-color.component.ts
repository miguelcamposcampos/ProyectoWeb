import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service'; 
import { IColorPorId, ICrearColor } from '../../interface/propiedadesadicionales.interface';
import { PropiedadesAdicionalesServices } from '../../service/propiedadesadicionales.service';

@Component({
  selector: 'app-nuevo-color',
  templateUrl: './nuevo-color.component.html'
})
export class NuevoColorComponent implements OnInit {

  @Input() idColorEdit : any;
  @Output() cerrar : EventEmitter<boolean> = new EventEmitter<boolean>();
  Form : FormGroup;
  dataColorEdit : IColorPorId;
  mostrarCodigo: boolean = false;

  constructor(
    private swal : MensajesSwalService, 
    private colorService : PropiedadesAdicionalesServices,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) {
    this.builform();
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
   }

  public builform(): void {
    this.Form = new FormGroup({ 
      colorid: new FormControl(0),  
      nombre: new FormControl(null, Validators.required),
      codigo: new FormControl(null),  
      rgb: new FormControl( '-' ),  
    })
  }

  ngOnInit(): void {
    if(this.idColorEdit){
      this.mostrarCodigo = true; 
      this.spinner.show();
      this.onObtenerColorPorId();
    }
  }

  onObtenerColorPorId(){ 
    this.colorService.colorPorId(this.idColorEdit).subscribe((resp)=> {
      if(resp){  
        this.dataColorEdit = resp;
        this.Form.patchValue({
          nombre : this.dataColorEdit.nombrecolor,
          codigo : this.dataColorEdit.codigocolor,
          colorid : this.dataColorEdit.colorid
        }); 
        this.spinner.hide();
      } 
    });
  }


  onGrabar(){
    const data = this.Form.value;

    const newColor : ICrearColor = {
      nombrecolor : data.nombre,
      rgb : data.rgb,
      colorid : data.colorid,
      codigocolor : data.codigo
    }


    if(!this.dataColorEdit){
      this.colorService.crearColor(newColor).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Se grabaron los datos correctamente!.');
           this.cerrar.emit(true);
        }
      });
    }else{
      this.colorService.updateColor(newColor).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
           this.cerrar.emit(true);
        }
      });
    } 
  }
 

  onRegresar(){
    this.cerrar.emit(false)
  }


}
