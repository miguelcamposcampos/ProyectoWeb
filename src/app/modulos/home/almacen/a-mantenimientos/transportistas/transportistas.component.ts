import { Component, OnInit } from '@angular/core'; 
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeNode } from 'primeng/api'; 
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service'; 
import { TransportistaService } from './service/transportista.service';
   

@Component({
  selector: 'app-transportistas',
  templateUrl: './transportistas.component.html',
  styleUrls: ['./transportistas.component.scss']
})
export class TransportistasComponent implements OnInit {
 
  cols: InterfaceColumnasGrilla[] = [];
  colschoferes: InterfaceColumnasGrilla[] = [];
  colsunidades: InterfaceColumnasGrilla[] = [];
  treeTable: any[] = []; 
  listTransportistas : TreeNode[] = []; 

  criterioBusqueda: FormControl = new FormControl('');
  VistaNuevoTransportista : boolean = false;
  VistaNuevoChofer : boolean = false;
  VistaNuevoUnidadTransporte : boolean = false;

  idTransportistaEdit : number = 0;   
  dataChofer : any;
  dataUnidadTransporte: any;
 

  constructor( 
    private swal : MensajesSwalService, 
    private transportistaService : TransportistaService,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) { }

  ngOnInit(): void { 

    this.cols = [ 
      { field: 'nombre', header: 'Nombre', visibility: true }, 
      { field: 'nroDocumento', header: 'Nro Documento', visibility: true},  
      { field: 'fechaRegistro', header: 'Fec.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];

    this.colschoferes = [ 
      { field: 'nombre', header: 'Nombre', visibility: true }, 
      { field: 'nroDocumento', header: 'Nro Documento', visibility: true},  
      { field: 'brevete', header: 'Brevete', visibility: true }, 
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];

    this.colsunidades = [ 
      { field: 'tractorPlaca', header: 'T. Placa', visibility: true},  
      { field: 'tractorModelo', header: 'T. Modelo', visibility: true }, 
      { field: 'carretaMarca', header: 'C. Marca', visibility: true }, 
      { field: 'carretaPlaca', header: 'C. Placa', visibility: true},  
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];
  
    this.onLoadTransportistas();
  }

  onLoadTransportistas(){
    this.spinner.show();
    this.transportistaService.listadoTransportistas(this.criterioBusqueda.value).subscribe((resp) => { 
      if(resp){  
        this.treeTable = resp;  
        let finall : any[] = [];
        
        this.treeTable.forEach((x) => { 
          /* Llenamos el tretable*/
          finall.push({
            id : x.id,
            nombre : x.nombre,
            nroDocumento : x.nroDocumento,
            fechaRegistro : x.fechaRegistro,
            choferes : x.choferes,
            unidades: x.unidades
          })   
        })
        this.listTransportistas = finall;  
        this.spinner.hide();
      }
    },error => { 
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);  
    });
    
  }
 

  /*********** TRANSPORTISTAS ************/
  onNuevoTransportista(){
    this.VistaNuevoTransportista = true;
  }
  
  onEditarTransportista(idTransportista :any){  
    this.idTransportistaEdit = idTransportista;
    this.VistaNuevoTransportista = true;
  }

  onModalEliminarTransportista(data:any){ 
    this.swal.mensajePregunta("¿Seguro que desea eliminar el transportista " + data.nombre + " ?").then((response) => {
      if (response.isConfirmed) {
        this.transportistaService.deleteTransportista(data.id).subscribe((resp) => { 
          this.onLoadTransportistas(); 
          this.swal.mensajeExito('El transportista ha sido eliminado correctamente!.'); 
        },error => { 
          this.generalService.onValidarOtraSesion(error);  
        });
      }
    })  
  }
 

/**************  CHOFERES *****************/
  onNuevoChofer(idTransportista : number){ 
    const Data = {
      idTransportista :  idTransportista
    }
    this.dataChofer  = Data;  
    this.VistaNuevoChofer = true;
  }
  
  onEditarChofer(idTransportista : number, idChofer :number){    
    const Data = {
      idTransportista : idTransportista,
      idChofer : idChofer
    }
    this.dataChofer  = Data;  
    this.VistaNuevoChofer = true;
  }
 
  onModalEliminarChofer(data:any){ 
    this.swal.mensajePregunta("¿Seguro que desea eliminar al chofer " + data.nombre + " ?").then((response) => {
      if (response.isConfirmed) {
        this.transportistaService.deleteChofer(data.id).subscribe((resp) => { 
          this.onLoadTransportistas(); 
          this.swal.mensajeExito('El chofer ha sido eliminado correctamente!.'); 
        },error => { 
          this.generalService.onValidarOtraSesion(error);  
        });
      }
    })  
  }
 

/**************  UNIDAD DE TRANSPORTES *****************/
onNuevoUnidadTransportista(idTransportista : number){  
  const Data = {
    idTransportista :  idTransportista
  }
  this.dataUnidadTransporte = Data;
  this.VistaNuevoUnidadTransporte = true;
}

onEditarUnidadTransportista(idTransportista : number,  idUnidaTransporte : number){ 
  const Data = {
    idTransportista :  idTransportista,
    idUnidaTransporte : idUnidaTransporte
  }
  this.dataUnidadTransporte = Data; 
  this.VistaNuevoUnidadTransporte = true;
}
 
onModalEliminarUnidadTransporte(data:any){ 
  this.swal.mensajePregunta("¿Seguro que desea eliminar la unidad de transporte " + data.tractorPlaca + " ?").then((response) => {
    if (response.isConfirmed) {
      this.transportistaService.deleteUnidadTransporte(data.id).subscribe((resp) => { 
        this.onLoadTransportistas(); 
        this.swal.mensajeExito('La unidad de transporte ha sido eliminado correctamente!.'); 
      },error => { 
        this.generalService.onValidarOtraSesion(error);  
      });
    }
  })  
}
 

  onRetornar(event : any){  
    if(event === 'exito'){
      this.onLoadTransportistas()
     }
     
    this.VistaNuevoChofer = false;
    this.VistaNuevoUnidadTransporte = false;   
    this.VistaNuevoTransportista = false;
    
  
    
  }
  

}
