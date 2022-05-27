import { Component, OnInit } from '@angular/core';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IListarMarcas } from './interface/marca.interface';
import { MarcaService } from './service/marca.service';

@Component({
  selector: 'app-marcas',
  templateUrl: './marcas.component.html'
})
export class MarcasComponent implements OnInit {

  
  cols: InterfaceColumnasGrilla[] =[];
  VistaNuevoMarca : boolean = false; 
  idMarcaEdit : number = 0; 
  listaMarcas : IListarMarcas[];

  constructor(
    private swal  : MensajesSwalService,
    private marcaservice : MarcaService,
    private generalService : GeneralService
  ){ }

  ngOnInit(): void {

    this.onLoadMarcas();
    this.cols = [ 
      { field: 'codigo', header: 'Codigo', visibility: true }, 
      { field: 'nombre', header: 'Nombre', visibility: true},   
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ]; 
  }
 

  onLoadMarcas(){
    this.swal.mensajePreloader(true);
    this.marcaservice.listadodeMarcas().subscribe((resp)=> {
      if(resp){
        this.listaMarcas= resp
      }
      this.swal.mensajePreloader(false);
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  }


  onNuevoMarca(){
    this.idMarcaEdit = null,
    this.VistaNuevoMarca = true;
  }

  onEditar( idMarca : any){   
    this.idMarcaEdit = idMarca
    this.VistaNuevoMarca = true;
  }

  onModalEliminar(data:any){ 
    this.swal.mensajePregunta("¿Seguro que desea eliminar la marca " + data.nombre + " ?").then((response) => {
      if (response.isConfirmed) {
        this.marcaservice.deleteMarca(data.id).subscribe((resp) => { 
          this.onLoadMarcas(); 
          this.swal.mensajeExito('La marca ha sido eliminado correctamente!.'); 
        },error => { 
          this.generalService.onValidarOtraSesion(error);
        });
      }
    })  
  }


 
  onRetornar(event: any){ 
    if(event === 'exito'){
      this.onLoadMarcas();
    }
    
    this.VistaNuevoMarca = false; 
  }

  
}
