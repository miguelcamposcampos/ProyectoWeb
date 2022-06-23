import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { TreeNode } from 'primeng/api';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { TransportistaService } from '../../home/almacen/a-mantenimientos/transportistas/service/transportista.service';

@Component({
  selector: 'app-buscar-transportista',
  templateUrl: './buscar-transportista.component.html'
})
export class BuscarTransportistaComponent implements OnInit {

  @Output() TransportistaSelect : EventEmitter<any> = new EventEmitter<any>();
  cols: InterfaceColumnasGrilla[] = [];
  colschoferes: InterfaceColumnasGrilla[] = [];
  colsunidades: InterfaceColumnasGrilla[] = [];
  //  [formControl]="criterioBusqueda"
  criterioBusqueda: FormControl = new FormControl('');
  treeTable: any[] = []; 
  listTransportistas : TreeNode[] = []; 

  constructor(
    private swal : MensajesSwalService, 
    private transportistaService : TransportistaService,
    private spinner : NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.cols = [ 
      { field: 'cod', header: 'Codigo', visibility: true }, 
      { field: 'nombre', header: 'Nombre', visibility: true }, 
      { field: 'nroDocumento', header: 'Nro Documento', visibility: true},  
      { field: 'fechaRegistro', header: 'Fec.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
    ];

    this.colschoferes = [ 
      { field: 'nombre', header: 'Nombre', visibility: true }, 
      { field: 'nroDocumento', header: 'Nro Documento', visibility: true},  
      { field: 'brevete', header: 'Brevete', visibility: true },  
    ];

    this.colsunidades = [ 
      { field: 'tractorPlaca', header: 'T. Placa', visibility: true},  
      { field: 'tractorModelo', header: 'T. Modelo', visibility: true }, 
      { field: 'carretaMarca', header: 'C. Marca', visibility: true }, 
      { field: 'carretaPlaca', header: 'C. Placa', visibility: true},   
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
          finall.push({
            id : x.id,
            cod : x.cod,
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
    })
    
  }

  onSeleccionarTransportista(event : any){
    this.swal.mensajePregunta("Seguro de seleccionar a: " + event.data.nombre + " ?").then((response) => {
      if (response.isConfirmed) {  
        this.TransportistaSelect.emit(event.data); 
      }
    })  
  }


}
