import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IColeccion, IColeccionPorId, ICrearColeccion } from '../interface/propiedadesadicionales.interface';
import { PropiedadesAdicionalesServices } from '../service/propiedadesadicionales.service';

@Component({
  selector: 'app-coleccion',
  templateUrl: './coleccion.component.html',
  styleUrls: ['./coleccion.component.scss']
})
export class ColeccionComponent implements OnInit {

  cols: InterfaceColumnasGrilla[] =[];
  VistaNuevaColeccion : boolean = false;  
  listaColecciones : IColeccion[];
  dataColeccion : IColeccionPorId;
  Form : FormGroup;
  mostrarCodigo: boolean = false;



  constructor(
    private swal  : MensajesSwalService,
    private coleccionService : PropiedadesAdicionalesServices,
    private generalService : GeneralService,
  ) {
    this.builform();
   }


   public builform(): void {
    this.Form = new FormGroup({ 
      codigo: new FormControl(null),
      nombre: new FormControl(null, Validators.required),  
    })
  }

  ngOnInit(): void {
    this.onLoadMaterial();
    this.cols = [ 
      { field: 'cod', header: 'Codigo', visibility: true }, 
      { field: 'nombre', header: 'Nombre', visibility: true}, 
      { field: 'fechaRegistro', header: 'Fec.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA },   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];
  }

  

  onLoadMaterial(){
    this.swal.mensajePreloader(true); 
    this.coleccionService.listadoColeccion().subscribe((resp)=> {
      if(resp){
        this.listaColecciones = resp;  
      }
      this.swal.mensajePreloader(false); 
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  }
 

  onNuevo(){
    this.dataColeccion = null,
    this.VistaNuevaColeccion = true;
  }

  onEditar( data : any){   
    this.dataColeccion = data
    this.Form.patchValue({
      codigo: data.cod,
      nombre: data.nombre
    })
    this.mostrarCodigo = true;
    this.VistaNuevaColeccion = true;
  }

  
  onEliminar(data:any){
    this.swal.mensajePregunta("¿Seguro que desea eliminar la coleccion " + data.nombre + " ?").then((response) => {
      if (response.isConfirmed) {
        this.coleccionService.deleteColeccion(data.id).subscribe((resp) => { 
          this.onLoadMaterial(); 
          this.swal.mensajeExito('La coleccion ha sido eliminado correctamente!.'); 
        },error => { 
          this.generalService.onValidarOtraSesion(error);
        });
      }
    })  
  }

 
  onGrabar(){
    const dataForm = this.Form.value;
    const newColeccion : ICrearColeccion = {
      descripcion : dataForm.nombre, 
      coleccionid : this.dataColeccion ? this.dataColeccion.coleccionid : 0,     
    }
    console.log(newColeccion);

    if(!this.dataColeccion){
      this.coleccionService.crearColeccion(newColeccion).subscribe((resp)=> {
        if(resp){
          this.onRetornar('exito')
        }
        this.swal.mensajeExito('Se Grabaron los datos correctamente!.');
      },error => { 
        this.generalService.onValidarOtraSesion(error);
      });
    }else{
      this.coleccionService.updateColeccion(newColeccion).subscribe((resp)=> {
        if(resp){
          this.onRetornar('exito')
        }
        this.swal.mensajeExito('Se Actualizaron los datos correctamente!.');
      },error => { 
        this.generalService.onValidarOtraSesion(error);
      });
    }


  }


  onRetornar(event: any){ 
    if(event === 'exito'){
      this.onLoadMaterial();
    }
    
    this.VistaNuevaColeccion = false; 
  }

}
