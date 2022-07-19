import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Unesco } from 'src/app/shared/interfaces/generales.interfaces';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ProductosService } from '../../productos/service/productos.service';
import { ICrearLinea } from '../interface/linea.interface';
import { LineaService } from '../service/linea.service';

@Component({
  selector: 'app-nuevo-linea',
  templateUrl: './nuevo-linea.component.html'
})
export class NuevoLineaComponent implements OnInit {

  @Input() datalinea : any;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  Form : FormGroup; 
  arrayUnescoData: Unesco[];
  ImgBase64 : string = ""; 
  stringBuscarenUnesco : string  ="";
  codigoProductoUnesco :string ="";
  LineaEdit : ICrearLinea;
  imgParaEditar: string = "";
  mostrarcomboUnesco : boolean = false;


  constructor(
    private lineaService: LineaService,
    private swal : MensajesSwalService,
    private productoService : ProductosService, 
    private spinner : NgxSpinnerService
  ) {   
     this.builform();  
  }

  public builform(): void{
    this.Form = new FormGroup({
      nombreLinea: new FormControl(null, Validators.required),
      codigoUnesco: new FormControl(null),  
      cuentaventas : new FormControl(null),  
      cuentacompras  : new FormControl(null),  
      imgLinea: new FormControl(null),  
    });
  }

  ngOnInit(): void {   
    if(this.datalinea.idLinea){  
      this.onBuscarLineaPorId(this.datalinea.idLinea);
    }else if(this.datalinea.idSubLinea){  
      this.onBuscarLineaPorId(this.datalinea.idSubLinea);
    }
  }

  onBuscarLineaPorId(id : number){ 
    this.spinner.show(); 

    this.lineaService.lineaPorId(id).subscribe((resp) => {
      if(resp){
        this.LineaEdit  = resp;
        if(this.LineaEdit.imagenlinea){
          this.imgParaEditar  = ConstantesGenerales._FORMATO_IMAGEN_PNG_DESDE_BASE_64 + this.LineaEdit.imagenlinea
        }
        if(this.LineaEdit.codigounesco){
          this.codigoProductoUnesco = this.LineaEdit.codigounesco.toString();
        }

        this.Form.patchValue({
          nombreLinea: this.LineaEdit.nombrelinea,  
          codigoUnesco : this.LineaEdit.codigounesco,
          imgLinea :  this.LineaEdit.imagenlinea,
          cuentaventas :  this.LineaEdit.cuentaventas,
          cuentacompras :  this.LineaEdit.cuentacompras,
        })
        this.spinner.hide();
      } 
    });
  }

  onCambiarLogo(){
    this.imgParaEditar = "";
  //  this.ImgBase64 = "";  
  }

  onObtenerCriterioBuscarUnesco(event : any){  
    if(event){
      this.stringBuscarenUnesco = event.target.value; 
    }
  }

  onBuscarUnesco(){ 
    if(!this.stringBuscarenUnesco){
      this.swal.mensajeInformacion('Ingrese el nombre de un producto para hacer la busqueda.');
      return;
    }
    this.spinner.show();
    this.productoService.listadoUnesco(this.stringBuscarenUnesco).subscribe((resp)=>{ 
      if(resp.Data.length > 0){ 
        this.mostrarcomboUnesco = true;
        this.arrayUnescoData = resp.Data
      }else{
        this.swal.mensajeInformacion('No se encontraron registros, intenta con otro producto');
        this.stringBuscarenUnesco = "";
      }
      this.spinner.hide();
    });
  }
 
  onSeleccionoProductoUnesco(event : any){   
    if(event){
      this.codigoProductoUnesco = event.value.Code + ' - ' +   event.value.DescriptionES 
    }else{
      this.codigoProductoUnesco = ""; 
    } 
  }

  onEliminarArchivo(event :any): void{
    if(event){  
      this.ImgBase64 = "";  
      this.Form.controls['imgLinea'].setValue(null);
    } 
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
    this.Form.controls['imgLinea'].setValue(this.ImgBase64);
  }  

  
  onGrabar(){
    const data = this.Form.value;
    const newLinea : ICrearLinea = {
      codigolinea : this.LineaEdit ? this.LineaEdit.codigolinea : null,
      codigounesco : this.LineaEdit ? this.LineaEdit.codigounesco :  ( data.codigoUnesco ? data.codigoUnesco.Code : null ),
      imagenlinea : data.imgLinea,
      nombrelinea: data.nombreLinea,
      parentid: this.datalinea.idLineaPadre ? this.datalinea.idLineaPadre : 0,
      lineaid: this.LineaEdit ? this.LineaEdit.lineaid : 0,
      esagrupador : this.LineaEdit ? this.LineaEdit.esagrupador : false,
      cuentaventas: data.cuentaventas,
      cuentacompras: data.cuentacompras,
    }
    if(!this.LineaEdit){
      this.lineaService.createLinea(newLinea).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Se grabaron los datos correctamente!.');
          this.onVolver();
        }
      });
    }else{
      this.lineaService.updateLinea(newLinea).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
          this.onVolver();
        }
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
