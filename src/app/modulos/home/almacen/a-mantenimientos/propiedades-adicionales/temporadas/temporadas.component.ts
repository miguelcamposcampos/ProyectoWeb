import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICrearTemporada, ITemporadas } from '../interface/propiedadesadicionales.interface';
import { PropiedadesAdicionalesServices } from '../service/propiedadesadicionales.service';

@Component({
  selector: 'app-temporadas',
  templateUrl: './temporadas.component.html'
})
export class TemporadasComponent implements OnInit {

  cols: InterfaceColumnasGrilla[] =[];
  VistaNuevaTemporada : boolean = false;  
  listaTemporadas : ITemporadas[];
  dataTemporada : ICrearTemporada;
  Form : FormGroup;
  mostrarCodigo: boolean = false;

  constructor(
    private swal  : MensajesSwalService,
    private temporadaService : PropiedadesAdicionalesServices,
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
      temporadaid: new FormControl(0),
      codigo: new FormControl(null),
      nombre: new FormControl(null, Validators.required),  
    })
  }

  ngOnInit(): void {
    this.onLoadTemporada();
    this.cols = [ 
      { field: 'codigo', header: 'Codigo', visibility: true }, 
      { field: 'nombre', header: 'Nombre', visibility: true},   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];
  }

  

  onLoadTemporada(){
    this.spinner.show();
    this.temporadaService.listadoTemporada().subscribe((resp)=> {
      if(resp){
        this.listaTemporadas = resp;   
        this.spinner.hide();
      } 
    });
  }
 

  onNuevo(){
    this.Form.reset();
    this.mostrarCodigo = false;
    this.dataTemporada = null,
    this.VistaNuevaTemporada = true;
  }

  onEditar( data : any){   
    console.log(data);
    this.dataTemporada = data
    this.Form.patchValue({
      codigo: data.codigo,
      nombre: data.nombre,
      temporadaid: data.id,
    })
    this.mostrarCodigo = true;
    this.VistaNuevaTemporada = true;
  }

  
  onEliminar(data:any){
    this.swal.mensajePregunta("¿Seguro que desea eliminar la temporada " + data.nombre + " ?").then((response) => {
      if (response.isConfirmed) {
        this.temporadaService.deleteTemporada(data.id).subscribe((resp) => { 
          this.onLoadTemporada(); 
          this.swal.mensajeExito('La temporada ha sido eliminado correctamente!.'); 
        });
      }
    })  
  }

 
  onGrabar(){
    const dataForm = this.Form.value;
    const newTemporada : ICrearTemporada = {
      descripcion : dataForm.nombre, 
      temporadaid : dataForm.temporadaid,  
      codigo: dataForm.codigo, 
      idauditoria : this.dataTemporada ? this.dataTemporada.idauditoria : 0,  
    }
    console.log(newTemporada);

    if(!this.dataTemporada){
      this.temporadaService.crearTemporada(newTemporada).subscribe((resp)=> {
        if(resp){
          this.swal.mensajeExito('Se Grabaron los datos correctamente!.');
          this.onRetornar('exito')
        }
      });
    }else{
      this.temporadaService.updateTemporada(newTemporada).subscribe((resp)=> {
        if(resp){
          this.swal.mensajeExito('Se Actualizaron los datos correctamente!.');
          this.onRetornar('exito')
        }
      });
    }


  }


  onRetornar(event: any){ 
    if(event ){
      this.onLoadTemporada();
    }
    
    this.VistaNuevaTemporada = false; 
  }

}
