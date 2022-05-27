import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, MinLengthValidator, MinValidator, Validators } from '@angular/forms';
import { IPorRuc, IUbicaciones } from 'src/app/shared/interfaces/generales.interfaces';
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
  ImgBase64 : string = ""; 

  departamento: FormControl = new FormControl('');
  provincia: FormControl = new FormControl('');
  distrito: FormControl = new FormControl('');
  direccionUbigeo: FormControl = new FormControl('');
  bloqueardropdownProvincias : boolean = false;
  bloqueardropdownDistritos : boolean = false;
  arrayDepartamentos: any[] = [];
  arrayProvincias: any[] = [];
  arrayDistritos: any[] = [];
  ubigeoSelect : number = 0;

  RucaBuscar : number = 0;
  datosPorRuc : IPorRuc;

  dataEstablecimientoEdit : IEstablecimientoPorId;
  imgParaEditar: string = "";
 
  constructor(
    private generalService: GeneralService,
    private establecimientoService: EstablecimientoService,
    private swal : MensajesSwalService
  ) { 
    this.builform();
  }

  public builform(): void{
    this.Form = new FormGroup({
      codigosunat: new FormControl( null),
      razonSocial: new FormControl(null, Validators.required), 
      nombreComercial: new FormControl(null, Validators.required),  
      direccion:  new FormControl(null, Validators.required),  
    });
  }

  ngOnInit(): void {   
    if(this.idEstablecimientoEdit){
      this.tituloEstablecimiento = "EDITAR ESTEBLECIMIENTO";
      this.onBuscarEstablecimientoPorId();
    }
    this.onCargarDepartamentos();
  }

  onCargarDepartamentos(){
    this.generalService.listaDepartamento().subscribe((resp) => { 
      resp.forEach(element => {
        this.arrayDepartamentos.push({nombre : element})
      }); 
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  }

  onObtenerRucIngresado(event : any){
    let newruc = event.target.value;
    if(newruc.length === 11){
      this.RucaBuscar = newruc;
      this.onBuscarRuc();
    }
  } 

  onBuscarRuc(){ 
    this.swal.mensajePreloader(true);
    this.generalService.consultarPorRuc(this.RucaBuscar).subscribe((resp) => {
      if(resp){ 
        this.datosPorRuc = resp;  
        this.Form.patchValue({  
          nombreComercial : this.datosPorRuc.Data.razonsocial,
          direccion:  this.datosPorRuc.Data.DireccionCompleta  
        })
      }
      this.swal.mensajePreloader(false);
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  }

  onBuscarEstablecimientoPorId(){
    this.swal.mensajePreloader(true);
    this.establecimientoService.establecimeintoPorId(this.idEstablecimientoEdit).subscribe((resp) => { 
      if(resp){ 
        this.dataEstablecimientoEdit = resp;  
        this.imgParaEditar  = ConstantesGenerales._FORMATO_IMAGEN_PNG_DESDE_BASE_64 + this.dataEstablecimientoEdit.logoestablecimiento
 
        this.Form.patchValue({
          codigosunat: this.dataEstablecimientoEdit.codigosunat,
          razonSocial : this.dataEstablecimientoEdit.nombreestablecimiento,
          nombreComercial : this.dataEstablecimientoEdit.nombrecomercial,
          direccion: this.dataEstablecimientoEdit.direccion,  
        });
      }
      this.swal.mensajePreloader(false);
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  }

  onCambiarLogo(){
    this.imgParaEditar = "";
  }

  onObtenerDepartamentoSeleccionado(event: any){
    if(event){  
      this.bloqueardropdownProvincias = true;
      this.bloqueardropdownDistritos = true;
      this.distrito.setValue('');
    }
      const ubigeoSerach : IUbicaciones = {
        departamento : event.nombre
      } 
      this.arrayProvincias = [];
      this.generalService.listaProvincias(ubigeoSerach).subscribe((resp) => {  
        if(resp){
          this.bloqueardropdownProvincias = false;
          resp.forEach(element => {
            this.arrayProvincias.push({nombre : element})
          });   
        }
      },error => { 
        this.generalService.onValidarOtraSesion(error);
      });
  }

  onObtenerProvinciaSeleccionado(event: any){ 
    if(event){   
      this.bloqueardropdownDistritos = true;
    }

      let depaselecionado = this.departamento.value
      const ubigeoSerach : IUbicaciones = {
        departamento :depaselecionado.nombre,
        provincia :  event.nombre
      }  
      this.arrayDistritos = []
      this.generalService.listaDistritos(ubigeoSerach).subscribe((resp) => { 
        if(resp){
          this.bloqueardropdownDistritos = false;
          resp.forEach(element => {
            this.arrayDistritos.push({nombre : element})
          }); 
        } 
      },error => { 
        this.generalService.onValidarOtraSesion(error);
      });
   
  }

  onObtenerDistritoSeleccionado(event: any){  
      let depaselecionado = this.departamento.value
      let provselecionado = this.provincia.value
      const ubigeoSerach : IUbicaciones = {
        departamento : depaselecionado.nombre,
        provincia : provselecionado.nombre,
        distrito : event.nombre
      } 
      this.ubigeoSelect = null;
      this.generalService.listaUbigeo(ubigeoSerach).subscribe((resp) => {  
        this.ubigeoSelect = resp 
      },error => { 
        this.generalService.onValidarOtraSesion(error);
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
  }  

  onEliminarArchivo(event :any): void{
    if(event){ 
        this.ImgBase64 = "";    
    }
  }


  onGrabarEstablecimiento(){
    const data = this.Form.value
    const NewEstablecimiento : ICreateEstablecimiento = {
      codigosunat : data.codigosunat,
      direccion : data.direccion,
      establecimientoid: this.idEstablecimientoEdit ? this.idEstablecimientoEdit : 0,
      nombrecomercial: data.nombreComercial,
      logoestablecimiento : this.ImgBase64 ? this.ImgBase64 : this.dataEstablecimientoEdit.logoestablecimiento, 
      nombreestablecimiento : data.razonSocial, //raazon social
      ubigeo: this.ubigeoSelect,
    }
    if(!this.idEstablecimientoEdit){
      this.establecimientoService.crearEstablecimiento(NewEstablecimiento).subscribe((resp)=>{
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito('Se grabaron los datos correctamente!.');
      },error => { 
        this.generalService.onValidarOtraSesion(error);
      });
    }else{
      this.establecimientoService.updateEstablecimiento(NewEstablecimiento).subscribe((resp)=>{
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
      },error => { 
        this.generalService.onValidarOtraSesion(error);
      });
    } 
  }


  onRegresar() {   
    this.cerrar.emit(false); 
  }


  onVolver() {   
    this.cerrar.emit('exito'); 
  }

}
