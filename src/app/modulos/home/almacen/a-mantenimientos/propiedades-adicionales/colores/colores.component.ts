import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IColores } from '../interface/propiedadesadicionales.interface';
import { PropiedadesAdicionalesServices } from '../service/propiedadesadicionales.service';

@Component({
  selector: 'app-colores',
  templateUrl: './colores.component.html'
})
export class ColoresComponent implements OnInit {

  cols: InterfaceColumnasGrilla[] =[];
  VistaNuevoColor : boolean = false; 
  idColorEdit : number = 0; 
  listaColores : IColores[]; 
  
  constructor(
    private swal  : MensajesSwalService,
    private colorService : PropiedadesAdicionalesServices,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) { }

  ngOnInit(): void {
    
    this.onLoadColores();
    this.cols = [ 
      { field: 'codColor', header: 'Codigo', visibility: true }, 
      { field: 'nombre', header: 'Nombre', visibility: true},  
      { field: 'fechaRegistro', header: 'Fec.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];
  }

  onLoadColores(){
    this.spinner.show();
    this.colorService.listadoColores().subscribe((resp)=> {
      if(resp){
        this.listaColores = resp;   
        this.spinner.hide();
      }  
    });
  }
 
  onAdd(){
    this.idColorEdit = null,
    this.VistaNuevoColor = true;
  }

  onEdit( idColor : any){   
    this.idColorEdit = idColor
    this.VistaNuevoColor = true;
  }



  onDelete(data:any){
    this.swal.mensajePregunta("¿Seguro que desea eliminar el color " + data.nombre + " ?").then((response) => {
      if (response.isConfirmed) {
        this.colorService.deleteColor(data.id).subscribe((resp) => { 
          this.onLoadColores(); 
          this.swal.mensajeExito('El color ha sido eliminado correctamente!.'); 
        });
      }
    })  
  }

 

  onRetornar(event: any){ 
    if(event){
      this.onLoadColores();
    }
    this.VistaNuevoColor = false; 
  }


 

}
