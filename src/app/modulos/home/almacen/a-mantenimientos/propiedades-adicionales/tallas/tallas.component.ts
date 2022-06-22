import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICrearTalla, ITallaPorId, ITallas } from '../interface/propiedadesadicionales.interface';
import { PropiedadesAdicionalesServices } from '../service/propiedadesadicionales.service';

@Component({
  selector: 'app-tallas',
  templateUrl: './tallas.component.html'
})
export class TallasComponent implements OnInit {

  cols: InterfaceColumnasGrilla[] =[];
  VistaNuevaTalla : boolean = false;  
  listaTallas : ITallas[];
  dataTalla : ITallaPorId;
  Form : FormGroup;
  mostrarCodigo: boolean = false;

  constructor(
    private swal  : MensajesSwalService,
    private tallaService : PropiedadesAdicionalesServices,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) {
    this.builform();
   }


   public builform(): void {
    this.Form = new FormGroup({ 
      tallaid: new FormControl(0),
      codigo: new FormControl(null),
      nombre: new FormControl(null, Validators.required),  
    })
  }



  ngOnInit(): void {
    this.onLoadTallas();
    this.cols = [ 
      { field: 'codigo', header: 'Codigo', visibility: true }, 
      { field: 'nombre', header: 'Nombre', visibility: true},   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];
  }


  onLoadTallas(){
    this.spinner.show();
    this.tallaService.listadoTalla().subscribe((resp)=> {
      if(resp){
        this.listaTallas = resp;  
        this.spinner.hide();
      } 
    },error => { 
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);
    });
  }
 

  onNuevo(){
    this.Form.reset();
    this.mostrarCodigo = false;
    this.dataTalla = null,
    this.VistaNuevaTalla = true;
  }

  onEditar( data : any){  
    this.dataTalla = data
    this.Form.patchValue({
      codigo: data.codigo,
      nombre: data.nombre,
      tallaid: data.id
    })
    this.mostrarCodigo = true;
    this.VistaNuevaTalla = true;
  }

  
  onEliminar(data:any){
    this.swal.mensajePregunta("¿Seguro que desea eliminar la talla " + data.nombre + " ?").then((response) => {
      if (response.isConfirmed) {
        this.tallaService.deleteTalla(data.id).subscribe((resp) => { 
          this.onLoadTallas(); 
          this.swal.mensajeExito('La talla ha sido eliminado correctamente!.'); 
        },error => { 
          this.generalService.onValidarOtraSesion(error);
        });
      }
    })  
  }

 
  onGrabar(){
    const dataForm = this.Form.value;
    const newTalla : ICrearTalla = {
      descripcion : dataForm.nombre, 
      tallaid : dataForm.tallaid,  
    }
 

    if(!this.dataTalla){
      this.tallaService.crearTalla(newTalla).subscribe((resp)=> {
        if(resp){
          this.swal.mensajeExito('Se Grabaron los datos correctamente!.');
          this.onRetornar('exito')
        }
      },error => { 
        this.generalService.onValidarOtraSesion(error);
      });
    }else{
      this.tallaService.updateTalla(newTalla).subscribe((resp)=> {
        if(resp){
          this.swal.mensajeExito('Se Actualizaron los datos correctamente!.');
          this.onRetornar('exito')
        }
      },error => { 
        this.generalService.onValidarOtraSesion(error);
      });
    }


  }


  onRetornar(event: any){ 
    if(event === 'exito'){
      this.onLoadTallas();
    }
    
    this.VistaNuevaTalla = false; 
  }


}
