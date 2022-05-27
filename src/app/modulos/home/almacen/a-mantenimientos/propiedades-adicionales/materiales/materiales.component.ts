import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICrearMateriales, IMateriales } from '../interface/propiedadesadicionales.interface';
import { PropiedadesAdicionalesServices } from '../service/propiedadesadicionales.service';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.scss']
})
export class MaterialesComponent implements OnInit {
 
  cols: InterfaceColumnasGrilla[] =[];
  VistaNuevoMaterial : boolean = false;  
  listaMateriales : IMateriales[];
  dataMaterial : ICrearMateriales;
  Form : FormGroup;
  mostrarCodigo: boolean = false;


  constructor(
    private swal  : MensajesSwalService,
    private materialService : PropiedadesAdicionalesServices,
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
      { field: 'codigo', header: 'Codigo', visibility: true }, 
      { field: 'nombre', header: 'Nombre', visibility: true},   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];
  }

  

  onLoadMaterial(){
    this.swal.mensajePreloader(true); 
    this.materialService.listadoMaterial().subscribe((resp)=> {
      if(resp){
        this.swal.mensajePreloader(false); 
        this.listaMateriales = resp;  
      }
    })
  }
 

  onNuevo(){
    this.dataMaterial = null,
    this.VistaNuevoMaterial = true;
  }

  onEditar( data : any){   
    this.dataMaterial = data
    this.Form.patchValue({
      codigo: data.codigo,
      nombre: data.nombre
    })
    this.mostrarCodigo = true;
    this.VistaNuevoMaterial = true;
  }

  
  onEliminar(data:any){
    this.swal.mensajePregunta("¿Seguro que desea eliminar el material " + data.nombre + " ?").then((response) => {
      if (response.isConfirmed) {
        this.materialService.deleteMaterial(data.id).subscribe((resp) => { 
          this.onLoadMaterial(); 
          this.swal.mensajeExito('El material ha sido eliminado correctamente!.'); 
        },error => { 
          this.generalService.onValidarOtraSesion(error);
        });
      }
    })  
  }

 
  onGrabar(){
    const dataForm = this.Form.value;
    const newTemporada : ICrearMateriales = {
      descripcion : dataForm.nombre, 
      materialid : this.dataMaterial ? this.dataMaterial.materialid : 0,  
      codigo: this.dataMaterial ? this.dataMaterial.codigo : '', 
      idauditoria : this.dataMaterial ? this.dataMaterial.idauditoria : 0,  
    }
    console.log(newTemporada);

    if(!this.dataMaterial){
      this.materialService.crearMaterial(newTemporada).subscribe((resp)=> {
        if(resp){
          this.onRetornar('exito')
        }
        this.swal.mensajeExito('Se Grabaron los datos correctamente!.');
      },error => { 
        this.generalService.onValidarOtraSesion(error);
      });
    }else{
      this.materialService.updateMaterial(newTemporada).subscribe((resp)=> {
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
    
    this.VistaNuevoMaterial = false; 
  }

}
