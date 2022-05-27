import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { IAuth } from 'src/app/auth/interface/auth.interface';
import { AuthService } from 'src/app/auth/services/auth.service'; 
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { DataEmpresa, IEmpresa, IPlanes, } from '../../interface/empresa.interface';
import { EmpresaService } from '../../services/empresa.service';
  
@Component({
  selector: 'app-agregar-empresa',
  templateUrl: './agregar-empresa.component.html',
  styleUrls: ['./agregar-empresa.component.scss'], 
})
export class AgregarEmpresaComponent implements OnInit { 

  public FlgRetornaNuevoToken: Subject<boolean> = new Subject<boolean>();

  @Output() cerrar: any = new EventEmitter<any>();

  @Input() tokenLS : any;
  EmpresaForm! : FormGroup;
  Empresa! : IEmpresa;  
  EmpresaEdit! : IEmpresa;  
  PlanesArray! : IPlanes;
  
  agregPlanElegido : string ="";   
  idPlanElegido: number = 0;
  modalPlanes: boolean = false; 
  idEmpresa! : number;

 
  constructor( 
    private empresaService: EmpresaService,  
    private authService : AuthService,
    private formBuilder: FormBuilder,
    private swal : MensajesSwalService,
    private generalService : GeneralService

  ) { 
    this.authService.verificarAutenticacion(); 
    this.builform();
  }

  ngOnInit(): void {   
    if(!this.tokenLS){
      return;
    }else{
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
    this.empresaService.empresaPorGuid().subscribe((resp) => { 
      this.EmpresaEdit = resp;
      if(this.EmpresaEdit){
        this.swal.mensajePreloader(false);
        this.EmpresaForm.patchValue({
          Ruc: this.EmpresaEdit.ruc,
          RazonSocial: this.EmpresaEdit.razonsocial, 
          NombreComercial: this.EmpresaEdit.nombrecomercial, 
          DireccionFiscal: this.EmpresaEdit.direccionfiscal, 
          Email: this.EmpresaEdit.email, 
          WebSite: this.EmpresaEdit.website, 
          Telefono: this.EmpresaEdit.telefonos
        })
      }
    },error => {
      this.generalService.onValidarOtraSesion(error);
    })
  }
  
  onEscogerPlan(){  
    this.modalPlanes = true;
  }
 
  onPlanelegido(plan : any ){  
    this.PlanesArray = plan.plan
    this.agregPlanElegido = plan.plan.nombre;
    this.idPlanElegido = +plan.plan.planesarticulosid
    this.modalPlanes = false;
  }

  onQuitarPlan(){
    this.agregPlanElegido = ''; 
  }

  onBuscarPorRuc(){   
    let RucDigitado = this.EmpresaForm.controls['Ruc'].value;
    if(!RucDigitado ){
      this.EmpresaForm.reset(); 
      return;
    }
  
      this.swal.mensajePreloader(true)
      this.empresaService.datosporRucGet(RucDigitado).subscribe((resp)=> {  
        this.Empresa = resp.Data
          if(this.Empresa){ 
            /*Si hay data asigna valor a los campos del formulario*/
            this.EmpresaForm.patchValue({
              RazonSocial : this.Empresa.razonsocial, 
              DireccionFiscal : this.Empresa.DireccionCompleta
            });
          }else{
            /* si no hay data limpia el campos y emite un mensaje*/
            this.onLimpiarFormulario();
            this.swal.mensajeAdvertencia('no se encontraron datos... intenta con otra ruc!.')
          }
          this.swal.mensajePreloader(false)
      },error => { 
        this.generalService.onValidarOtraSesion(error);
      });
   
  }

  onAgregarEmpresa(){
    /* newEmpresa recibe todos los valores del form, se le asigna al campo idplan el id seleciconado en el modal */
    const newEmpresa : IEmpresa = this.EmpresaForm.value; 
    newEmpresa.planid = this.PlanesArray ? +this.idPlanElegido : 0;

    if(this.EmpresaEdit){ 
      newEmpresa.empresaid = this.EmpresaEdit.empresaid;
      this.empresaService.empresaUpdate(newEmpresa).subscribe((resp)=>{
        if(resp){
          this.swal.mensajeExito('Se actualizaron los datos de la empresa!.'); 
        }
      },error => {
        this.generalService.onValidarOtraSesion(error);
      })
    }else{
      this.empresaService.empresaCreate(newEmpresa).subscribe((resp)=>{
        if(resp){
          this.swal.mensajeExito('La empresa ha sido registrada'); 
        }
      },error => {
        this.generalService.onValidarOtraSesion(error);
    })
    }
    
  }
  
  onLimpiarFormulario(){
    this.EmpresaForm.controls['RazonSocial'].setValue('');
    this.EmpresaForm.controls['NombreComercial'].setValue('');
    this.EmpresaForm.controls['DireccionFiscal'].setValue(''); 
  }

  onRegresar() { 
    this.cerrar.emit(false); 
  }
 

  onValidateForm(campo: string) {
    return ( this.EmpresaForm.controls[campo].errors && this.EmpresaForm.controls[campo].touched );
  }

}
