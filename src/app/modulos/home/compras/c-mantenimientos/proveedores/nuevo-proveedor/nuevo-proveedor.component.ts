import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Subject } from 'rxjs';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICrearProveedor, IProveedorPorId } from '../interface/proveedor.interface';
import { ProveedorService } from '../service/proveedor.service';

@Component({
  selector: 'app-nuevo-proveedor',
  templateUrl: './nuevo-proveedor.component.html',
  styleUrls: ['./nuevo-proveedor.component.scss']
})
export class NuevoProveedorComponent implements OnInit {

  
  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  @Input() dataProveedor! : any;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  Form : FormGroup;
  ProveedorEdit : IProveedorPorId;
 
  tituloNuevoProveedor : string ="NUEVO PROVEEDOR";
  modalBuscarUbigeo : boolean = false;
  mostrarRazonSocial: boolean = false;
  ubigeoSeleccionado : number = 0;
  ubigeoParaMostrar : string ="";
  minimoRequerido : number = 0;
  maximoRequerido : number = 0;
  arraytipoPersona : ICombo[];
  arraytipoDocumento : ICombo[];

  constructor(
    private swal : MensajesSwalService, 
    private proveedorService : ProveedorService,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) {  
    this.builform();
    }
 
  public builform(): void {
    this.Form = new FormGroup({ 
      tipoPersona: new FormControl(null, Validators.required), 
      tipoDocumento: new FormControl(null, Validators.required), 
      nroDocumento: new FormControl(null, Validators.required), 
      apellidos: new FormControl(null, Validators.required),  
      nombres: new FormControl(null, Validators.required),  
      razonSocial: new FormControl(null, Validators.required), 
      email: new FormControl(null), 
      telefonos: new FormControl(null), 
      website: new FormControl(null),  
      contacto: new FormControl(null),  
      direccionprincipal: new FormControl(null),  
    })
  }
 
  ngOnInit(): void {
    this.onCargarDropdown();
  
    if(this.dataProveedor){
      this.spinner.show();
      this.Avisar();
      this.tituloNuevoProveedor ="EDITAR PROVEEDOR"; 
    }
  }

  onCargarDropdown(){
    const obsDatos = forkJoin(   
      this.generalService.listadoPorGrupo('TipoPersona'), 
      this.generalService.listadoPorGrupo('TipoDocumento'), 
    );
    obsDatos.subscribe((response) => { 
      this.arraytipoPersona = response[0];   
      this.arraytipoDocumento = response[1];   
      this.FlgLlenaronCombo.next(true); 
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }
 
  Avisar(){
    this.FlgLlenaronCombo.subscribe((x) => {
      this.onObtenerProveedorPorId(this.dataProveedor.idProveedor); 
    });
  }

  
  onObtenerProveedorPorId(id : number){ 
    this.proveedorService.proveedorPorId(id).subscribe((resp) => {
      if(resp){  
        this.ProveedorEdit = resp;
        this.onObtenerTipoDocumento(this.ProveedorEdit.personaData.tipodocumentoid);
        this.generalService.listarubigeo(resp.personaData.ubigeoprincipal).subscribe((ubi)=> {
          let datosubi: any = Object.values(ubi) 
          this.ubigeoParaMostrar = datosubi[0] + ' - ' +  datosubi[1] + ' - ' + datosubi[2];
        })
        this.ubigeoSeleccionado = resp.personaData.ubigeoprincipal;

        this.Form.patchValue({
            tipoPersona: this.arraytipoPersona.find(
            (x) => x.id === this.ProveedorEdit.personaData.tipopersonaid
            ),
            tipoDocumento: this.arraytipoDocumento.find(
              (x) => x.id === this.ProveedorEdit.personaData.tipodocumentoid
            ), 
            nroDocumento: this.ProveedorEdit.personaData.nrodocumentoidentidad,
            apellidos: this.ProveedorEdit.personaData.apellidos,
            nombres: this.ProveedorEdit.personaData.nombres,
            razonSocial: this.ProveedorEdit.personaData.razonsocial,
            email: this.ProveedorEdit.emails,
            telefonos: this.ProveedorEdit.telefonos,
            website: this.ProveedorEdit.website,
            contacto: this.ProveedorEdit.nombrecontacto, 
            direccionprincipal: this.ProveedorEdit.personaData.direccionprincipal
        })
        this.spinner.hide();
      } 
    },error => { 
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);  
    });
  }
  
  onObtenerTipoDocumento(event : any){
    let evento = this.arraytipoDocumento.filter(x => x.id === event) 
    let hizoclick = event.valor1
    if(hizoclick){
      this.limpiarForm();
      this.onValidacionRequired(hizoclick);
    }else{
      this.onValidacionRequired(evento[0].valor1);
    } 
  }

  onValidacionRequired(event : any){  
    const apellidos = this.Form.get("apellidos");
    const nombres = this.Form.get("nombres");
    const razonSocial = this.Form.get("razonSocial"); 
     
    if (event === 'DNI') { 
      apellidos.setValidators([Validators.required]);
      nombres.setValidators([Validators.required]); 
      razonSocial.setValidators(null);  
      this.mostrarRazonSocial = false;
      this.minimoRequerido = 8;
      this.maximoRequerido = 8;
    } else{ 
      apellidos.setValidators(null);
      nombres.setValidators(null); 
      razonSocial.setValidators([Validators.required]);  
      this.mostrarRazonSocial = true;
      this.minimoRequerido = 11;
      this.maximoRequerido = 15;
    }

    apellidos.updateValueAndValidity();
    nombres.updateValueAndValidity();
    razonSocial.updateValueAndValidity();  
 
  }
 
  limpiarForm(){
    this.Form.controls['nroDocumento'].setValue('');
    this.Form.controls['apellidos'].setValue('');
    this.Form.controls['nombres'].setValue('');
    this.Form.controls['razonSocial'].setValue(''); 
    this.Form.controls['email'].setValue('');
    this.Form.controls['telefonos'].setValue('');
    this.Form.controls['website'].setValue('');
    this.Form.controls['contacto'].setValue('');
    this.ubigeoSeleccionado = null,
    this.ubigeoParaMostrar = "";
  }

   
  onBuscarPorDocumento(){ 
    const tipoDocumento  = this.Form.controls['tipoDocumento'].value;
    const nroDocumento  = this.Form.controls['nroDocumento'].value;
    if(!tipoDocumento){
      this.swal.mensajeAdvertencia('seleccione un tipo de documento');
      return;
    }

    if(!nroDocumento){
      this.swal.mensajeAdvertencia('porfavor ingrese un numero de documento');
      return;
    } 

    if(tipoDocumento.valor1 === 'DNI'){ 
      if(nroDocumento.toString().length === 8){
       this.spinner.show();
        this.generalService.consultaPorDni(nroDocumento).subscribe((resp) => {
          if(resp.dni){
            this.Form.patchValue({
              apellidos : resp.apePaterno + ' ' + resp.apeMaterno,
              nombres : resp.nombres
            }); 
          }else{
            this.swal.mensajeError('No se encontraron datos.');
            this.limpiarForm();
            return;
          }
          this.spinner.hide();
        },error => {
          this.spinner.hide();
          this.generalService.onValidarOtraSesion(error);  
        })
      }else{
        this.swal.mensajeAdvertencia('porfavor ingrese un numero de documento valido');
      }
    }else if(tipoDocumento.valor1 === 'RUC'){
      if(nroDocumento.toString().length === 11){
       this.spinner.show();
        this.generalService.consultarPorRuc(nroDocumento).subscribe((resp) => {
          if(resp){  
            console.log(resp);
            this.Form.patchValue({
              razonSocial : resp.Data.razonsocial,
              direccionprincipal : resp.Data.DireccionCompleta, 
            });
            this.ubigeoParaMostrar =  resp.Data.UbigeoDescripcion,
            this.ubigeoSeleccionado = resp.Data.ubigeo 
          } 
          this.spinner.hide();
        },error => {
          this.spinner.hide();
          this.generalService.onValidarOtraSesion(error);  
        })
      }else{
        this.swal.mensajeAdvertencia('porfavor ingrese un numero de ruc valido');
      }
    } 

  }


  onBuscarUbigeo(){
    this.modalBuscarUbigeo = true;
  }

  onPintarUbigeoSeleccionado( data : any){ 
    if(data){
      this.ubigeoParaMostrar = data.nombreubigeo;
      this.ubigeoSeleccionado = data.ubigeo; 
    }
    this.modalBuscarUbigeo = false;
  }



  onGrabar(){
    const data = this.Form.value;
  
    const newCliente : ICrearProveedor = { 
      emails : data.email, 
      telefonos : data.telefonos, 
      website : data.website,  
      nombrecontacto : data.contacto,
      personaid : this.ProveedorEdit ? this.ProveedorEdit.personaData.personaid : 0,
      idproveedor : this.ProveedorEdit ? this.ProveedorEdit.idproveedor : 0,
      codigoproveedor :  this.ProveedorEdit ? this.ProveedorEdit.codigoproveedor : null,
      idauditoria : this.ProveedorEdit ? this.ProveedorEdit.idauditoria : 0 , 
      personaData : { 
        personaid : this.ProveedorEdit ? this.ProveedorEdit.personaid : 0,
        tipopersonaid : data.tipoPersona.id ? data.tipoPersona.id : 0,
        tipodocumentoid: data.tipoDocumento.id ? data.tipoDocumento.id : 0, 
        nombres : data.nombres,
        apellidos : data.apellidos,
        razonsocial : data.razonSocial,
        categoriapersona : this.ProveedorEdit ? this.ProveedorEdit.personaData.categoriapersona : 0, 
        nrodocumentoidentidad : data.nroDocumento,
        direccionesAnexos : [],
        nombreCompleto : null,
        ubigeoprincipal : this.ubigeoSeleccionado, 
        direccionprincipal: data.direccionprincipal, 
      }, 
  }
 
    if(!this.ProveedorEdit){
      this.proveedorService.crearProveedor(newCliente).subscribe((resp) => {
        if(resp){
          this.swal.mensajePregunta("¿Quiere editar el registro?").then((response) => {
            if (response.isConfirmed) {
              this.onObtenerProveedorPorId(+resp);
            }else{
              this.swal.mensajeExito('Se grabaron los datos correctamente!.');
              this.onVolver();
            }
          })   
        }
      },error => { 
        this.generalService.onValidarOtraSesion(error);  
      });
    }else{
      this.proveedorService.updateProveedor(newCliente).subscribe((resp) => { 
        this.swal.mensajePregunta("¿Quiere seguir editando el registro?").then((response) => {
          if (response.isConfirmed) {
            this.onObtenerProveedorPorId(newCliente.idproveedor);
          }else{
            this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
            this.onVolver();
          }
        })    
      },error => { 
        this.generalService.onValidarOtraSesion(error);  
      });
    }  
  }

  onVolver(){
    this.cerrar.emit('exito')
  }

  onRegresar(){
    this.cerrar.emit(false)
  }
}
