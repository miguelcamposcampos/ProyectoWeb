import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service'; 
import { CentroCostoService } from './service/centrocosto.service';
import { IListarCentroCosto,ICrearCentroCosto } from './interface/centrocosto.interface';
import { GeneralService } from 'src/app/shared/services/generales.services';

@Component({
  selector: 'app-centro-costo',
  templateUrl: './centro-costo.component.html',
  styleUrls: ['./centro-costo.component.scss']
})
export class CentroCostoComponent implements OnInit {

  cols: InterfaceColumnasGrilla[] =[];
  VistaNuevoCentroCosto : boolean = false;  
  listaCentroCosto : IListarCentroCosto[];
  dataCentroCosto: any;
  Form : FormGroup;
  criterio = new FormControl('')
  CentroCostoEditar : ICrearCentroCosto

  constructor(
    private swal  : MensajesSwalService,
    private centrocostoService : CentroCostoService,
    private generalService : GeneralService,
  ) { 
    this.builform();
   }

  public builform(): void {
    this.Form = new FormGroup({ 
      codigo: new FormControl(null, Validators.required), 
      descripcion: new FormControl(null, Validators.required), 
    })
  }

  ngOnInit(): void {
    this.onLoadCentroCosto();
    this.cols = [ 
      { field: 'codigo', header: 'Codigo', visibility: true }, 
      { field: 'nombre', header: 'Nombre', visibility: true},   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ]; 
  }

  onLoadCentroCosto(){
    this.swal.mensajePreloader(true);
    this.centrocostoService.listadoCentroCosto(this.criterio.value).subscribe((resp)=> {
      if(resp){
        this.listaCentroCosto = resp
      }
      this.swal.mensajePreloader(false);
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }
 
  onNuevo(){
    this.dataCentroCosto = null,
    this.VistaNuevoCentroCosto = true;
  }

  onEditar( data : any){    
    this.onObtenerCentroCostoPorId(data.idCentroCosto);
  }

  onObtenerCentroCostoPorId(id : number){
    this.swal.mensajePreloader(true);
    this.centrocostoService.centroCostoPorId(id).subscribe((resp) => {
      if(resp){ 
        this.VistaNuevoCentroCosto = true;
        this.CentroCostoEditar = resp 
        this.Form.patchValue({
          codigo : this.CentroCostoEditar.codigocc,
          descripcion : this.CentroCostoEditar.nombrecc
        })
      }
      this.swal.mensajePreloader(false);
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }


  onEliminar(data:any){ 
    this.swal.mensajePregunta("¿Seguro que desea eliminar el cnetro de costo " + data.nombre + " ?").then((response) => {
      if (response.isConfirmed) {
        this.centrocostoService.deletCentroCosto(data.idCentroCosto).subscribe((resp) => { 
          this.onLoadCentroCosto(); 
          this.swal.mensajeExito('El centro costo ha sido eliminado correctamente!.'); 
        },error => { 
          this.generalService.onValidarOtraSesion(error);  
        });
      }
    })  
  }


 onGrabar(){
  const dataform = this.Form.value;
  const NewCentroCosto = {
    centrocostoid : this.CentroCostoEditar ? this.CentroCostoEditar.centrocostoid : 0,
    codigocc : dataform.codigo,
    nombrecc : dataform.descripcion, 
    idauditoria : 0
  } 
    this.centrocostoService.crearCentroCosto(NewCentroCosto).subscribe((resp)=> {
      if(resp){
        this.onRetornar('exito');
      }
      if(!this.CentroCostoEditar){
        this.swal.mensajeExito('Los datos se grabaron correctamente!.');
      }else{
        this.swal.mensajeExito('Los datos se actualziaron correctamente!.');
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }
 

  onRetornar(event: any){ 
    if(event === 'exito'){
      this.onLoadCentroCosto();
    } 
    this.VistaNuevoCentroCosto = false; 
  }

}
