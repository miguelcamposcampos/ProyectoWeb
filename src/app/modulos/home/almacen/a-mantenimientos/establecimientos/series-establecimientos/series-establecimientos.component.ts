import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service'; 
import { EstablecimientoService } from '../service/establecimiento.service';

@Component({
  selector: 'app-series-establecimientos',
  templateUrl: './series-establecimientos.component.html'
})
export class SeriesEstablecimientosComponent implements OnInit {

  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  @Input() idEstablecimientoEdit : number;
 
  modalNuevoSerie : boolean = false;
  arrayDocumentos : ICombo[];
  cols : InterfaceColumnasGrilla[] = [];
  listaSeries: any[]; 
  idEstablecimeinto : number = 0;
  dataEdit : any;
  idSerieEliminar : number = 0; 
   
  constructor(
    private establecimientoService : EstablecimientoService,
    private swal : MensajesSwalService, 
    private generalService: GeneralService,
    private spinner: NgxSpinnerService
  ) { }
 
  
  ngOnInit(): void {
    this.onLoadSeries();   
    this.cols = [ 
      { field: 'serie', header: 'Serie', visibility: true},
      { field: 'tipoDocumento', header: 'Tipo documento', visibility: true },  
      { field: 'esPredeterminada', header: 'Predeterminada', visibility: true, tipoFlag : 'esPredeterminada' },  
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ];  
  }
  
  onLoadSeries(){
    this.spinner.show();
    this.establecimientoService.listarSeries(this.idEstablecimientoEdit).subscribe((resp)=> {
      if(resp){ 
        this.listaSeries = resp;
        this.spinner.hide();
      }  
    });
  }
   

  onNuevaSerie(){
    const Data = {
      idEstablecimiento : this.idEstablecimientoEdit
    }
    this.dataEdit = Data
    this.modalNuevoSerie =  true;
  }

  onEditar(idSerie : number){
    const Data = {
      idSerieEditar : idSerie,
      idEstablecimiento : this.idEstablecimientoEdit
    } 
    this.dataEdit = Data;
    this.modalNuevoSerie = true;
  }

  
  onModalEliminar(data:any){ 
    this.swal.mensajePregunta("¿Seguro que desea eliminar la serie " + data.serie + " ?").then((response) => {
      if (response.isConfirmed) {
        this.establecimientoService.deleteSerie(data.id).subscribe((resp) => { 
          this.onLoadSeries(); 
          this.swal.mensajeExito('La serie ha sido eliminado correctamente!.'); 
        });
      }
    })  
  }
  
  onRetornar(event: any){ 
    if(event === 'exito'){
      this.onLoadSeries();
    } 
    this.modalNuevoSerie = false; 
  }
 

  onRegresar(){
    this.cerrar.emit(false);
  }

}
