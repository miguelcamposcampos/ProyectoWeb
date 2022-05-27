import { Component, OnInit } from '@angular/core';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ILineas } from './interface/linea.interface';
import { LineaService } from './service/linea.service';

@Component({
  selector: 'app-lineas',
  templateUrl: './lineas.component.html',
  styleUrls: ['./lineas.component.scss']
})
export class LineasComponent implements OnInit {
 
  cols: InterfaceColumnasGrilla[] =[];
  colSubLinea: InterfaceColumnasGrilla[] =[];
  VistaNuevoLinea : boolean = false; 
  datalinea :any; 
  listaLineas : ILineas[];
  textoPaginado : string="";
  pagina: number = 1;
  size: number = 50;
  tituloModalLineas : string="";
  treeTable: any[] = []; 

  constructor(
    private swal  : MensajesSwalService,
    private lineaService : LineaService,
    private generalService : GeneralService
  ) { }

  ngOnInit(): void { 
    this.onLoadLineas(null); 
    this.cols = [ 
      { field: 'codLinea', header: 'Codigo', visibility: true }, 
      { field: 'nombreLinea', header: 'Nombre', visibility: true},  
      { field: 'fechaRegistro', header: 'Fec.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];

    this.colSubLinea = [ 
     // { field: 'idLinea', header: 'ID Linea', visibility: true }, 
      { field: 'codLinea', header: 'Codigo Linea', visibility: true }, 
      { field: 'nombreLinea', header: 'Nombre Linea', visibility: true},  
      { field: 'fechaRegistro', header: 'Fec.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'esAgrupador', header: 'Agrupador', visibility: true }, 
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];

  }

  onLoadLineas(event : any){
    const data = {
      paginaIndex : event ? event.first : this.pagina,
      itemsPorPagina:event ? event.rows : this.size
    }
    this.swal.mensajePreloader(true);
    this.lineaService.listadodeLineas(data).subscribe((resp)=> {
      if(resp){
        this.treeTable = resp.items;  
        let finall : any[] = [];
              
        this.treeTable.forEach((x) => { 
          /* Llenamos el tretable*/
          finall.push({
            id : x.idLinea,
            codLinea : x.codLinea,
            nombreLinea : x.nombreLinea,
            fechaRegistro : x.fechaRegistro,
            idLineaPadre : x.idLineaPadre,
            esAgrupador : x.esAgrupador,
            subLineas: x.subLineas
          })   
        })
        this.listaLineas = finall;   
        this.textoPaginado = resp.label; 
      }
      this.swal.mensajePreloader(false);
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  }

  //AGREGAR CABECERA
  onNuevoLinea(){
    const data = {
      idLinea : null,
      idSubLinea : null
    }
    this.datalinea = data,
    this.tituloModalLineas = 'NUEVA LINEA';
    this.VistaNuevoLinea = true;
  }

  onEditar( idLinea : number){ 
    const data = {
      idLinea : idLinea,
      idSubLinea : null
    }
    this.datalinea = data,
    this.tituloModalLineas = 'EDITAR LINEA';
    this.VistaNuevoLinea = true;
  }

  onModalEliminar(data:any){ 
    this.swal.mensajePregunta("¿Seguro que desea eliminar la linea " + data.nombreLinea + " ?").then((response) => {
      if (response.isConfirmed) {
        this.lineaService.deleteLinea(data.idLinea).subscribe((resp) => { 
          this.onLoadLineas(null); 
          this.swal.mensajeExito('La linea ha sido eliminado correctamente!.'); 
        },error => { 
          this.generalService.onValidarOtraSesion(error);
        });
      }
    })  
  }


//AGREGAR SUBLINEAS

  onNuevaSubLinea(idLinea: number){ 
    const data = {
      idLineaPadre : idLinea,
      idSubLinea : null
    }
    this.tituloModalLineas = 'NUEVA SUB LINEA';
    this.datalinea = data,
    this.VistaNuevoLinea = true;
  }

  onEditarSubLinea(id : number, idPadre: number){ 
    this.tituloModalLineas = 'EDITAR SUB LINEA';
    const data = {
      idSubLinea : id,
      idLineaPadre : idPadre
    }
    this.datalinea = data,
    this.VistaNuevoLinea = true;
  }


  onEliminarSubLinea(data:any){ 
    this.swal.mensajePregunta("¿Seguro que desea eliminar la Sub linea " + data.nombreLinea + " ?").then((response) => {
      if (response.isConfirmed) {
        this.lineaService.deleteSubLinea(data.idLineaPadre).subscribe((resp) => { 
          this.onLoadLineas(null); 
          this.swal.mensajeExito('La Sub linea ha sido eliminado correctamente!.'); 
        },error => { 
          this.generalService.onValidarOtraSesion(error);
        });
      }
    }) 
  }


 
  onRetornar(event: any){ 
    if(event === 'exito'){
      this.onLoadLineas(null);
    }
    
    this.VistaNuevoLinea = false; 
  }


 

}
