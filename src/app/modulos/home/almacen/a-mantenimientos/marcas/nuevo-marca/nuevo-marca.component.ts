import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner'; 
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICrearMarca } from '../interface/marca.interface';
import { MarcaService } from '../service/marca.service';

@Component({
  selector: 'app-nuevo-marca',
  templateUrl: './nuevo-marca.component.html'
})
export class NuevoMarcaComponent implements OnInit {

  @Input() idMarcaEdit : any;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  Form : FormGroup;
  dataMarcaEdit : ICrearMarca;

  constructor(    
    private swal : MensajesSwalService, 
    private marcaService : MarcaService, 
    private spinner : NgxSpinnerService
  ) {
    this.builform(); 
   }

   public builform(): void {
    this.Form = new FormGroup({ 
      nombreMarca: new FormControl(null, Validators.required), 
    })
  }

  ngOnInit(): void {
    if(this.idMarcaEdit){ 
      this.spinner.show();
      this.onObtenerMarcaPorId();
    }
  }

  onObtenerMarcaPorId(){ 
    this.marcaService.marcaPorId(this.idMarcaEdit).subscribe((resp) => {
      if(resp){
        this.dataMarcaEdit = resp;
        this.Form.patchValue({
          nombreMarca : this.dataMarcaEdit.nombre
        })
        this.spinner.hide();
      } 
    });
  }


  
  onGrabar(){
    const data = this.Form.value;

    const newMarca : ICrearMarca = {
      nombre : data.nombreMarca,
      marcaid: this.idMarcaEdit ? this.idMarcaEdit : 0,
      codigo : this.dataMarcaEdit ? this.dataMarcaEdit.codigo : null 
    }
  
    if(!this.idMarcaEdit){
      this.marcaService.createMarca(newMarca).subscribe((resp) => {
        if(resp){ 
          this.swal.mensajeExito('Se grabaron los datos correctamente!.');
          this.onVolver();
        }
      });
    }else{
      this.marcaService.updateMarca(newMarca).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
          this.onVolver();
        }
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
