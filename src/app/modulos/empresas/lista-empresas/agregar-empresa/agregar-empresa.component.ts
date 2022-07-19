import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';  
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IDatosPlan, IEmpresa, IPedioCrate, IPlanes, } from '../../interface/empresa.interface';
import { EmpresaService } from '../../services/empresa.service';
import { PlanesService } from '../../services/planes.services';
  
@Component({
  selector: 'app-agregar-empresa',
  templateUrl: './agregar-empresa.component.html',
  styleUrls: ['./agregar-empresa.component.scss'], 
})
export class AgregarEmpresaComponent implements OnInit { 
 
  @Input() newEmpresa : boolean;
  @Output() cerrar: any = new EventEmitter<any>();
  EmpresaForm : FormGroup;
  Empresa : IEmpresa;  
  EmpresaEdit : IEmpresa;  
  PlanesArray : any;
  
  mostrarNombrePlanelegido : string ="";   
  idPlanElegido: number = 0;
  modalPlanes: boolean = false; 
  idEmpresa! : number;

 
  constructor( 
    private empresaService: EmpresaService,   
    private formBuilder: FormBuilder,
    private swal : MensajesSwalService,
    private generalService : GeneralService,
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
    }
  }
 
  private builform(): void {
    this.EmpresaForm = this.formBuilder.group({
      Ruc: new FormControl( null, Validators.required),
      RazonSocial: new FormControl(null, Validators.required), 
      NombreComercial: new FormControl(null), 
      DireccionFiscal: new FormControl(null, Validators.required), 
      Email: new FormControl(null), 
      WebSite: new FormControl(null), 
      Telefono: new FormControl(null),   
    });
  }

  onTraerDatosParEditarEmpresa(){   
    this.spinner.show();
    this.empresaService.empresaPorGuid().subscribe((resp) => {   
      if(resp){ 
        this.EmpresaEdit = resp;
        this.EmpresaForm.patchValue({
          Ruc: this.EmpresaEdit.ruc,
          RazonSocial: this.EmpresaEdit.razonsocial, 
          NombreComercial: this.EmpresaEdit.nombrecomercial, 
          DireccionFiscal: this.EmpresaEdit.direccionfiscal, 
          Email: this.EmpresaEdit.email, 
          WebSite: this.EmpresaEdit.website, 
          Telefono: this.EmpresaEdit.telefonos
        })
        this.spinner.hide();
      }
    })
  }
  
  onEscogerPlan(){  
    this.modalPlanes = true;
  }
 
  onPlanelegido(event : any ){  
    console.log(event);
    this.PlanesArray = event
    this.mostrarNombrePlanelegido = event.plan.nombre;
 //   this.idPlanElegido = +plan.plan.planesarticulosid
    this.modalPlanes = false;
  }

  onQuitarPlan(){
    this.mostrarNombrePlanelegido = ''; 
  }

  onBuscarPorRuc(){   
    let RucDigitado = this.EmpresaForm.controls['Ruc'].value;
    if(!RucDigitado ){
      this.EmpresaForm.reset(); 
      return;
    } 
    this.spinner.show();
      this.empresaService.datosporRucGet(RucDigitado).subscribe((resp)=> {    
        if(resp.Data){ 
          this.Empresa = resp.Data            /****Si hay data asigna valor a los campos del formulario****/
          this.EmpresaForm.patchValue({
            RazonSocial : this.Empresa.razonsocial, 
            DireccionFiscal : this.Empresa.DireccionCompleta
          });
        }else{ 
          this.spinner.hide();
          this.onLimpiarFormulario();          /***si no hay data limpia el campos y emite un mensaje****/
          this.swal.mensajeAdvertencia('no se encontraron datos... intenta con otra ruc!.')
        }
        this.spinner.hide();
      });
   
  }

  onAgregarEmpresa(){
    /* newEmpresa recibe todos los valores del form, se le asigna al campo idplan el id seleciconado en el modal */
    const newEmpresa : IEmpresa = this.EmpresaForm.value; 
    newEmpresa.planid = this.PlanesArray ? this.PlanesArray.plan.planid : 0;
    this.spinner.show();
    if(this.EmpresaEdit){ 
      newEmpresa.empresaid = this.EmpresaEdit.empresaid;
      this.empresaService.empresaUpdate(newEmpresa).subscribe((resp)=>{
        if(resp){
          this.spinner.hide();
          this.swal.mensajeExito('Se actualizaron los datos de la empresa!.'); 
          this.onVolver('exito');
        }
      })
    }else{
      this.empresaService.empresaCreate(newEmpresa).subscribe((resp)=>{
        if(resp){
          if(this.PlanesArray){
            this.onCreatePedido(resp); 
          }else{
            this.spinner.hide();
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
        this.onVolver('exito');
      }else{
        this.swal.mensajeError('No se pudo registrar la empresa'); 
        this.spinner.hide();
      }
    });
  }
  
  onLimpiarFormulario(){
    this.EmpresaForm.controls['RazonSocial'].setValue(null);
    this.EmpresaForm.controls['NombreComercial'].setValue(null);
    this.EmpresaForm.controls['DireccionFiscal'].setValue(null); 
  }

  onRegresar() { 
    this.cerrar.emit(false); 
  }
 
  onVolver(event) { 
    this.cerrar.emit(event); 
  }
 
 
  onSoloNumeros(event) {
    let key;
    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain');
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key);
    }
    const regex = /[0-9]|\./;
     if (!regex.test(key)) {
      event.returnValue = false;
       if (event.preventDefault) {
        event.preventDefault();
       }
     }
  }

}
