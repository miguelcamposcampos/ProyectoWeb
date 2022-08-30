import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';  
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IEmpresa, IPedioCrate } from '../../interface/empresa.interface';
import { EmpresaService } from '../../services/empresa.service';
import { PlanesService } from '../../services/planes.services';
  
@Component({
  selector: 'app-agregar-empresa',
  templateUrl: './agregar-empresa.component.html',
  styleUrls: ['./agregar-empresa.component.scss'], 
})
export class AgregarEmpresaComponent implements OnInit { 
 
  @Input() newEmpresa : boolean;
  @Output() cerrar: any = new EventEmitter<boolean>();
  Form : FormGroup;  
  EmpresaEdit : IEmpresa;  
  PlanesArray : any;
  
  mostrarNombrePlanelegido : string ="";    
  modalPlanes: boolean = false;  

 
  constructor( 
    private empresaService: EmpresaService,   
    private formBuilder: FormBuilder,
    private swal : MensajesSwalService,
    public generalService : GeneralService,
    private spinner : NgxSpinnerService,
    private planesService : PlanesService,
  ) {  
    this.builform();
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
  }

  ngOnInit(): void {    
    if(!this.newEmpresa){
      this.onTraerDatosParEditarEmpresa(); 
    }else{
      return;
    }
  }
 
  private builform(): void {
    this.Form = this.formBuilder.group({
      ruc: new FormControl( null, Validators.required),
      razonsocial: new FormControl(null, Validators.required), 
      nombrecomercial: new FormControl(null), 
      direccionfiscal: new FormControl(null, Validators.required), 
      email: new FormControl(null), 
      website: new FormControl(null), 
      telefonos: new FormControl(null),   
    });
  }

  onTraerDatosParEditarEmpresa(){   
    this.spinner.show();
    this.empresaService.empresaPorGuid().subscribe((resp) => {   
      if(resp){ 
        this.EmpresaEdit = resp;
        this.Form.patchValue(this.EmpresaEdit);
        this.spinner.hide();
      }
    })
  }
  
  onModalPlan(){  
    this.modalPlanes = true;
  }
 
  onPlanelegido(event : any ){  
    console.log(event);
    this.PlanesArray = event
    this.mostrarNombrePlanelegido = event.plan.nombre;
    this.modalPlanes = false;
  }

  onDeletePlan(){
    this.mostrarNombrePlanelegido = ''; 
  }

  onSearchRuc(){   
    let RucDigitado = this.Form.controls['ruc'].value;
    if(!RucDigitado ){
      this.Form.reset(); 
      return;
    } 
    this.spinner.show();
      this.empresaService.datosporRucGet(RucDigitado).subscribe((resp)=> {    
        if(resp.Data){ 
                  /****Si hay data asigna valor a los campos del formulario****/
          this.Form.patchValue({
            razonsocial :  resp.Data.razonsocial, 
            direccionfiscal :  resp.Data.DireccionCompleta
          });
        }else{ 
          this.spinner.hide();
          this.onCleanForm();          /***si no hay data limpia el campos y emite un mensaje****/
          this.swal.mensajeAdvertencia('no se encontraron datos... intenta con otra ruc!.')
        }
        this.spinner.hide();
      });
   
  }

  onAdd(){
    /* newEmpresa recibe todos los valores del form, se le asigna al campo idplan el id seleciconado en el modal */
    const newEmpresa : IEmpresa = this.Form.value; 
    newEmpresa.planid = this.PlanesArray ? this.PlanesArray.plan.planid : 0;
    
    this.spinner.show();
    
    if(this.EmpresaEdit){ 
      newEmpresa.empresaid = this.EmpresaEdit.empresaid;
      this.empresaService.empresaUpdate(newEmpresa).subscribe((resp)=>{
        if(resp){
          this.spinner.hide();
          this.swal.mensajeExito('Se actualizaron los datos de la empresa!.'); 
          this.cerrar.emit(true); 
        }
      })
    }else{
      this.empresaService.empresaCreate(newEmpresa).subscribe((resp)=>{
        if(resp){
          if(this.PlanesArray){
            this.onCreatePedido(resp); 
            this.spinner.hide();
          }else{ 
            this.swal.mensajeAdvertencia('Eliga un plan para registrar la empresa!.'); 
            this.spinner.hide();
            return;
          } 
        }
      });
    }
  }
  

  onCreatePedido(resp){
    const newPedido : IPedioCrate = {
      planesarticulosid: this.PlanesArray.plan.planesarticulosid,
      cantidad: this.PlanesArray.cantidad,
      empresaguid: resp
    }
    this.planesService.registrarPedido(newPedido).subscribe((resp) => {
      if(resp){ 
        this.spinner.hide();
        this.swal.mensajeExito('La empresa ha sido registrada'); 
        this.cerrar.emit(true); 
      }else{
        this.swal.mensajeError('No se pudo registrar la empresa'); 
        this.spinner.hide();
      }
    });
  }
  
  onCleanForm(){
    this.Form.controls['razonsocial'].setValue(null);
    this.Form.controls['nombrecomercial'].setValue(null);
    this.Form.controls['direccionfiscal'].setValue(null); 
  }

  onRegresar() { 
    this.cerrar.emit(false); 
  }
 
  
 
 
 

}
