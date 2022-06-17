import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Subject } from 'rxjs';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IAlmacenPorId } from '../interface/establecimiento.interface';
import { EstablecimientoService } from '../service/establecimiento.service';


@Component({
  selector: 'app-nuevo-almacen',
  templateUrl: './nuevo-almacen.component.html',
  styleUrls: ['./nuevo-almacen.component.scss']
})
export class NuevoAlmacenComponent implements OnInit {

  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  @Input() dataAlmacenEdit : any;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();

  Form : FormGroup;
  AlmacenEditar : IAlmacenPorId;
  listaTipoProducto : ICombo[];
  AlmacenEdit : IAlmacenPorId;

  constructor(
    private establecimientoService : EstablecimientoService,
    private swal : MensajesSwalService, 
    private generalService: GeneralService,
    private spinner : NgxSpinnerService
  ) { 
    this.builform();
  }

  public builform(){
    this.Form = new FormGroup({
      nombreAlmacen : new FormControl(null, Validators.required),
      tipoProducto : new FormControl(null, Validators.required),
      validarStock : new FormControl(false, Validators.required),
      activo : new FormControl(false, Validators.required),
    })
  }
  ngOnInit(): void { 
    this.onCargarCombos(); 
    if(this.dataAlmacenEdit.idAlmacenEdit){
      this.spinner.show();
      this.Avisar();  
    }
  }



  onCargarCombos(){
    const obsDatos = forkJoin( 
      this.generalService.listadoPorGrupo('TipoProducto'), 
    );
  
    obsDatos.subscribe((response) => {
      this.listaTipoProducto = response[0];   
      this.FlgLlenaronCombo.next(true);  
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  }

   
  Avisar() {
    this.FlgLlenaronCombo.subscribe((x) => {   
      this.onObtenerAlmacenPorId();  
    });
  }
 
 
 
  onObtenerAlmacenPorId(){ 
    this.establecimientoService.almacenPorid(this.dataAlmacenEdit.idAlmacenEdit ).subscribe((resp)=>{
      if(resp){
        this.AlmacenEdit = resp;
        this.Form.patchValue({
          nombreAlmacen :this.AlmacenEdit.nombrealmacen , 
          validarStock : this.AlmacenEdit.validarstock ,
          activo :  this.AlmacenEdit.activo ,
          tipoProducto : this.listaTipoProducto.find((x) => 
            x.id === this.AlmacenEdit.tipoproductosid
          )
        })
        this.spinner.hide();
      } 
    },error => { 
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);
    });
  }

  onGrabar(){
    const data = this.Form.value;
    const newAlmacen : IAlmacenPorId = {
      activo : data.activo,
      almacenid: this.AlmacenEdit ? this.AlmacenEdit.almacenid : 0,
      establecimientoid : this.dataAlmacenEdit.idEstablecimiento,
      nombrealmacen : data.nombreAlmacen,
      tipoproductosid: data.tipoProducto.id,
      validarstock : data.validarStock
    }
    if(!this.dataAlmacenEdit.idAlmacenEdit){
      this.establecimientoService.crearAlmacen(newAlmacen).subscribe((resp)=> {
        if(resp){
          this.swal.mensajeExito('Los datos se grabaron correctamente!.')
          this.onVolver();
        }
      },error => { 
        this.generalService.onValidarOtraSesion(error);
      });
    }else{
      this.establecimientoService.updateAlmacen(newAlmacen).subscribe((resp)=> {
        if(resp){
          this.swal.mensajeExito('Los datos se actualizaron correctamente!.')
          this.onVolver();
        }
      },error => { 
        this.generalService.onValidarOtraSesion(error);
      });
    }
    

  }

  onVolver(){
    this.cerrar.emit('exito');
  }
  onRegresar(){
    this.cerrar.emit(false);
  }



}
