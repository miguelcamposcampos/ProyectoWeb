import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICrearMateriales, IMateriales } from '../interface/propiedadesadicionales.interface';
import { PropiedadesAdicionalesServices } from '../service/propiedadesadicionales.service';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html'
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
    private spinner : NgxSpinnerService
  ) {
    this.builform();
   }


   public builform(): void {
    this.Form = new FormGroup({ 
      materialid: new FormControl(0),
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
    this.spinner.show(); 
    this.materialService.listadoMaterial().subscribe((resp)=> {
      if(resp){ 
        this.listaMateriales = resp;  
        this.spinner.hide();
      }
    })
  }
 

  onNuevo(){
    this.Form.reset();
    this.mostrarCodigo = false;
    this.dataMaterial = null,
    this.VistaNuevoMaterial = true;
  }

  onEditar( data : any){    
    this.dataMaterial = data
    this.Form.patchValue({
      codigo: data.codigo,
      nombre: data.nombre,
      materialid : data.id
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
      materialid :  dataForm.materialid,  
      codigo: dataForm.codigo, 
      idauditoria : this.dataMaterial ? this.dataMaterial.idauditoria : 0,  
    } 
    if(!this.dataMaterial){
      this.materialService.crearMaterial(newTemporada).subscribe((resp)=> {
        if(resp){
          this.swal.mensajeExito('Se Grabaron los datos correctamente!.');
          this.onRetornar('exito')
        }
      },error => { 
        this.generalService.onValidarOtraSesion(error);
      });
    }else{
      this.materialService.updateMaterial(newTemporada).subscribe((resp)=> {
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
      this.onLoadMaterial();
    }
    
    this.VistaNuevoMaterial = false; 
  }

}
