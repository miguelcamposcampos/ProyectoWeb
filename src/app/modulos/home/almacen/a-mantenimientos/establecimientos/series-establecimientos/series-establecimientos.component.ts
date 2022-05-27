import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IModalConfirmar } from 'src/app/modulos/empresas/interface/empresa.interface';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IEstablecimientoCrearSerie, IEstablecimientoSeries } from '../interface/establecimiento.interface';
import { EstablecimientoService } from '../service/establecimiento.service';

@Component({
  selector: 'app-series-establecimientos',
  templateUrl: './series-establecimientos.component.html',
  styleUrls: ['./series-establecimientos.component.scss']
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
    private generalService: GeneralService
  ) {
    
  }
 
  
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
    this.swal.mensajePreloader(true);
    this.establecimientoService.listarSeries(this.idEstablecimientoEdit).subscribe((resp)=> {
      if(resp){ 
        this.listaSeries = resp;
      } 
      this.swal.mensajePreloader(false);
    },error => { 
      this.generalService.onValidarOtraSesion(error);
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
        },error => { 
          this.generalService.onValidarOtraSesion(error);
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
