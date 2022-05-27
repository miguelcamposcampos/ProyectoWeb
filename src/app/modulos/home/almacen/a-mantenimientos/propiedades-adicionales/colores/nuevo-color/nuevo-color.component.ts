import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service'; 
import { IColorPorId, ICrearColor } from '../../interface/propiedadesadicionales.interface';
import { PropiedadesAdicionalesServices } from '../../service/propiedadesadicionales.service';

@Component({
  selector: 'app-nuevo-color',
  templateUrl: './nuevo-color.component.html',
  styleUrls: ['./nuevo-color.component.scss']
})
export class NuevoColorComponent implements OnInit {

  @Input() idColorEdit : any;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  Form : FormGroup;
  dataColorEdit : IColorPorId;
  mostrarCodigo: boolean = false;

  constructor(
    private swal : MensajesSwalService, 
    private colorService : PropiedadesAdicionalesServices,
    private generalService : GeneralService,
  ) {
    this.builform();
   }

  public builform(): void {
    this.Form = new FormGroup({ 
      nombre: new FormControl(null, Validators.required),
      codigo: new FormControl(null),  
      rgb: new FormControl( '-' ),  
    })
  }

  ngOnInit(): void {
    if(this.idColorEdit){
      this.mostrarCodigo = true; 
      this.onObtenerColorPorId();
    }
  }

  onObtenerColorPorId(){
    this.swal.mensajePreloader(true);
    this.colorService.colorPorId(this.idColorEdit).subscribe((resp)=> {
      if(resp){
        this.dataColorEdit = resp;
        this.Form.patchValue({
          nombre : this.dataColorEdit.nombrecolor,
          codigo : this.dataColorEdit.codigocolor
        });
      }
      this.swal.mensajePreloader(false);
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  }


  onGrabar(){
    const data = this.Form.value;

    const newColor : ICrearColor = {
      nombrecolor : data.nombre,
      rgb : data.rgb,
      colorid : this.idColorEdit ? this.idColorEdit : 0,
      codigocolor : this.dataColorEdit ? this.dataColorEdit.codigocolor : null
    }


    if(!this.idColorEdit){
      this.colorService.crearColor(newColor).subscribe((resp) => {
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito('Se grabaron los datos correctamente!.');
      },error => { 
        this.generalService.onValidarOtraSesion(error);
      });
    }else{
      this.colorService.updateColor(newColor).subscribe((resp) => {
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
      },error => { 
        this.generalService.onValidarOtraSesion(error);
      });
    }
    

 

  }

  onVolver(){
    this.cerrar.emit('exito')
  }

  onRegresar(){
    this.cerrar.emit(false)
  }


}
