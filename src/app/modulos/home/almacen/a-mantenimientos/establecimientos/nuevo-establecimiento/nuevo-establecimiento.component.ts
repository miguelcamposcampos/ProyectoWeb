import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { switchMap, tap } from 'rxjs/operators';
import { IPorRuc } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICreateEstablecimiento, IEstablecimientoPorId } from '../interface/establecimiento.interface';
import { EstablecimientoService } from '../service/establecimiento.service';

@Component({
  selector: 'app-nuevo-establecimiento',
  templateUrl: './nuevo-establecimiento.component.html',
  styleUrls: ['./nuevo-establecimiento.component.scss']
})
export class NuevoEstablecimientoComponent implements OnInit {

  @Input() idEstablecimientoEdit : number;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  Form : FormGroup;
  tituloEstablecimiento : string ="NUEVO ESTABLECIMIENTO"
  ImgBase64 : string = null; 
 
 
  direccionUbigeo: FormControl = new FormControl('');
  bloqueardropdownProvincias : boolean = false;
  bloqueardropdownDistritos : boolean = false;

  arrayDepartamentos: any[] = [];
  arrayProvincias: any[] = [];
  arrayDistritos: any[] = [];

 
  datosPorRuc : IPorRuc;
  dataEstablecimientoEdit : IEstablecimientoPorId;
  imgParaEditar: string = "";
 
 
  constructor(
    private generalService: GeneralService,
    private establecimientoService: EstablecimientoService,
    private swal : MensajesSwalService,
    private spinner: NgxSpinnerService
  ) {  
    this.builform();
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
    this.onCargarDepartamentos();
  }

  public builform(): void{
    this.Form = new FormGroup({ 
      codigosunat: new FormControl( null),
      nombreestablecimiento: new FormControl(null, Validators.required), 
      nombrecomercial: new FormControl(null, Validators.required),  
      direccion:  new FormControl(null, Validators.required),  
      departamento:  new FormControl(''),
      provincia:  new FormControl(''),
      distrito:  new FormControl(''),
      logoestablecimiento : new FormControl(null),
      ubigeo : new FormControl(0)
    });
  }

  ngOnInit(): void {   
    if(this.idEstablecimientoEdit){
      this.spinner.show();
      this.tituloEstablecimiento = "EDITAR ESTEBLECIMIENTO";
      this.onFormEdit();
    }

    this.onchangeDepartamentos();
  }

  onCargarDepartamentos(){
    this.generalService.listaDepartamento().subscribe((resp) => { 
      resp.forEach(element => {
        this.arrayDepartamentos.push({nombre : element})
      }); 
    });
  }

  onFormEdit(){  
    this.establecimientoService.establecimeintoPorId(this.idEstablecimientoEdit).subscribe((resp) => { 
      if(resp){ 
        this.dataEstablecimientoEdit = resp;  
        this.imgParaEditar  = ConstantesGenerales._FORMATO_IMAGEN_PNG_DESDE_BASE_64 + this.dataEstablecimientoEdit.logoestablecimiento
        this.Form.patchValue(this.dataEstablecimientoEdit);
        this.spinner.hide(); 
      }
    });
  }

  onCambiarLogo(){
    this.imgParaEditar = "";
    this.Form.controls['logoestablecimiento'].setValue(null);
  }
  
  onchangeDepartamentos(){ 
    this.Form.get('departamento')?.valueChanges.pipe(
      tap(()=>{ 
          this.arrayProvincias = [];
          this.bloqueardropdownProvincias = true;
          this.arrayDistritos = []
          this.bloqueardropdownDistritos = true;
          this.Form.controls['ubigeo'].setValue(null); 
        }),
        switchMap( resp => this.generalService.listaProvincias(resp.nombre))
    ).subscribe( provincias => {
      provincias.forEach(element => {
        this.bloqueardropdownProvincias = false; 
        this.arrayProvincias.push({nombre : element})
      });    
      this.onchangeProvincia();
    });
  }

  onchangeProvincia(){
    this.Form.get('provincia')?.valueChanges.pipe(
      tap(()=>{  
          this.arrayDistritos = []
          this.bloqueardropdownDistritos = true;
          this.Form.controls['ubigeo'].setValue(null); 
        }), 
        switchMap( resp =>  
          this.generalService.listaDistritos(this.Form.get('departamento')?.value.nombre, resp.nombre)
        )
    ).subscribe( distritos => {
      distritos.forEach(element => {
        this.bloqueardropdownDistritos = false;
        this.arrayDistritos.push({nombre : element})
      });    
      this.onchangeDistrito();
    });
  }
  
  onchangeDistrito(){
    this.Form.get('distrito')?.valueChanges.pipe(
      tap(()=>{   
        this.Form.controls['ubigeo'].setValue(null); 
        }), 
        switchMap( resp =>  
          this.generalService.listaUbigeo(this.Form.get('departamento')?.value.nombre, this.Form.get('provincia')?.value.nombre, resp.nombre)
        )
    ).subscribe( ubi => {
      this.Form.controls['ubigeo'].setValue(ubi); 
    });
  }
 
  onUpload(event : any) {    
    if(event){  
      const file = event.files[0];
      if (file) {  
        const reader = new FileReader(); 
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file); 
      }
    }
  }
  
  handleReaderLoaded(event : any) {  
    this.ImgBase64 = btoa(event.target.result);
    this.Form.controls['logoestablecimiento'].setValue(this.ImgBase64)
  }  

  onEliminarArchivo(event :any): void{
    if(event){ 
      this.ImgBase64 = "";    
      this.Form.controls['logoestablecimiento'].setValue(null);
    }
  }
 
  onGrabarEstablecimiento(){ 
    const NewEstablecimiento : ICreateEstablecimiento = this.Form.getRawValue();
    NewEstablecimiento.establecimientoid = this.dataEstablecimientoEdit ? this.dataEstablecimientoEdit.establecimientoid : 0;
  
    if(!this.idEstablecimientoEdit){
      this.establecimientoService.crearEstablecimiento(NewEstablecimiento).subscribe((resp)=>{
        if(resp){
          this.swal.mensajeExito('Se grabaron los datos correctamente!.');
          this.cerrar.emit(true); 
        }
      });
    }else{
      this.establecimientoService.updateEstablecimiento(NewEstablecimiento).subscribe((resp)=>{
        if(resp){
          this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
          this.cerrar.emit(true); 
        }
      });
    } 
  }


  onRegresar() {   
    this.cerrar.emit(false); 
  }
 

}
