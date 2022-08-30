import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Subject } from 'rxjs'; 
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICrearVendedor } from '../interface/vendedores.interface';
import { VendedoresService } from '../servicio/vendedor.service';

@Component({
  selector: 'app-nuevo-vendedor',
  templateUrl: './nuevo-vendedor.component.html'
})
export class NuevoVendedorComponent implements OnInit {
  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  @Input() dataVendedor! : any;
  @Output() cerrar : EventEmitter<boolean> = new EventEmitter<boolean>();
  Form : FormGroup;
  VendedorEdit : ICrearVendedor;
  arrayEstablecimientos : ICombo[];
  tituloNuevoVendedor : string ="NUEVO VENDEDOR";
  modalBuscarUbigeo : boolean = false;
  ubigeoSeleccionado : number = 0;
  ubigeoParaMostrar : string ="";

  listTipoPersona: any[];
  listTipoDocumento : any[];
  minimoRequerido : number = 0;
  maximoRequerido : number = 0; 
  mostrarRazonSocial: boolean = false;

  dataPredeterminadosDesencryptada = JSON.parse(localStorage.getItem('Predeterminados')); 

  constructor(    
    private swal : MensajesSwalService, 
    private vendedorService : VendedoresService,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) {
    this.builform();

    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
   }

   public builform(): void {
    this.Form = new FormGroup({ 
      establecimiento: new FormControl(null, Validators.required), 
      tipoPersona: new FormControl(null, Validators.required), 
      tipoDocumento: new FormControl(null, Validators.required), 
      nroDocumento: new FormControl(null, Validators.required), 
      apellidos: new FormControl(null, Validators.required), 
      nombres: new FormControl(null, Validators.required),  
      razonSocial: new FormControl(null), 
      direccionprincipal: new FormControl(null),  
    })
  }
  ngOnInit(): void {
    this.onCargarDropdown(); 
    if(this.dataVendedor){
      this.spinner.show();
      this.Avisar();
      this.tituloNuevoVendedor ="EDITAR VENDEDOR";
    }
  }

  onCargarDropdown(){
    const obsDatos = forkJoin(   
      this.generalService.listadoComboEstablecimientos(), 
      this.generalService.listadoPorGrupo('TipoPersona'), 
      this.generalService.listadoPorGrupo('TipoDocumento'),  
    );
    obsDatos.subscribe((response) => { 
      this.arrayEstablecimientos = response[0];  
      this.listTipoPersona = response[1];
      this.listTipoDocumento = response[2];  
      this.FlgLlenaronCombo.next(true); 
      if(!this.VendedorEdit ){
        if(this.dataPredeterminadosDesencryptada){
          this.Form.patchValue({
            establecimiento: this.arrayEstablecimientos.find(
              (x) => x.id === +this.dataPredeterminadosDesencryptada.idEstablecimiento
            )
          })
        }
      }
    }); 
  }

  
  Avisar(){
    this.FlgLlenaronCombo.subscribe((x) => {
      this.onObtenerVendedorPorId(this.dataVendedor.id); 
    });
  }

 
  onObtenerVendedorPorId(id){  
    this.vendedorService.VendedorPorId(id).subscribe((resp) => {
      if(resp){ 
        this.VendedorEdit = resp; 
        this.onObtenerTipoDocumento(this.VendedorEdit.personaData.tipodocumentoid);
        if(resp.personaData.ubigeoprincipal){
          this.generalService.listarubigeo(this.VendedorEdit.personaData.ubigeoprincipal).subscribe((ubi)=> {
            let datosubi: any = Object.values(ubi) 
            this.ubigeoParaMostrar = datosubi[0] + ' - ' +  datosubi[1] + ' - ' + datosubi[2];
          });
          this.ubigeoSeleccionado = resp.personaData.ubigeoprincipal;
        }
        this.Form.patchValue({
            establecimiento: this.arrayEstablecimientos.find(
              (x) => x.id === this.VendedorEdit.establecimientoid
            ),
            nroDocumento: this.VendedorEdit.personaData.nrodocumentoidentidad,
            apellidos: this.VendedorEdit.personaData.apellidos,
            nombres: this.VendedorEdit .personaData.nombres,
            direccionprincipal: this.VendedorEdit.personaData.direccionprincipal, 
            razonSocial: this.VendedorEdit.personaData.reazonsocial,  
            tipoPersona: this.listTipoPersona.find(
              (x) => x.id === this.VendedorEdit.personaData.tipopersonaid
              ),
            tipoDocumento: this.listTipoDocumento.find(
              (x) => x.id === this.VendedorEdit.personaData.tipodocumentoid
            ), 
            
          });
          this.spinner.hide();
        } 
    });
  }

  onBuscarPorDni(){
    let dniSearch = this.Form.controls['nroDocumento'].value; 
    if(dniSearch.toString().length === 8){
      this.spinner.show();
      this.generalService.consultaPorDni(dniSearch).subscribe((resp) => {
        if(resp.nombre != "No encontrado"){  
          this.Form.patchValue({
            apellidos : resp.apePaterno + ' ' + resp.apeMaterno,
            nombres : resp.nombres
          });
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.swal.mensajeAdvertencia('Datos no encontrados.');
          return;
        }
      });
    }else{
      this.swal.mensajeAdvertencia('porfavor ingrese un numero de documento valido');
    }

  }


  onObtenerTipoDocumento(event: any){  
    let evento = this.listTipoDocumento.filter(x => x.id === event) 
    let hizoclick = event.valor1
    if(hizoclick){
      this.limpiarForm();
      this.onValidacionRequired(hizoclick);
    }else{
      this.onValidacionRequired(evento[0].valor1);
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
  
    const newVendedor : ICrearVendedor = {
      establecimientoid : data.establecimiento.id, 
      codigovendedor :  this.VendedorEdit ? this.VendedorEdit.codigovendedor : null,
      idauditoria : this.VendedorEdit ? this.VendedorEdit.idauditoria :  0,
      personaData : {
          apellidos: data.apellidos,  
          direccionprincipal: data.direccionprincipal,
          nombres: data.nombres,
          nrodocumentoidentidad : data.nroDocumento,
          tipodocumentoid : data.tipoDocumento.id,
          tipopersonaid: data.tipoPersona.id,
          reazonsocial :  data.razonSocial,
          personaid:  this.VendedorEdit ? this.VendedorEdit.personaid :0,  
          ubigeoprincipal : this.ubigeoSeleccionado,
      },
      personaid :  this.VendedorEdit ? this.VendedorEdit.personaid:0,
      vendedorid :  this.VendedorEdit ? this.VendedorEdit.vendedorid :0,
    }
 
    if(!this.VendedorEdit){
      this.vendedorService.crearVendedor(newVendedor).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Se grabaron los datos correctamente!.');
           this.cerrar.emit(true);
        }
      });
    }else{
      this.vendedorService.updateVendedor(newVendedor).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
           this.cerrar.emit(true);
        }
      });
    }  
  }

 

  onRegresar(){
    this.cerrar.emit(false)
  }

  
  limpiarForm(){
    this.Form.controls['nroDocumento'].setValue(null);
    this.Form.controls['apellidos'].setValue(null);
    this.Form.controls['nombres'].setValue(null);
  }
  
  onValidacionRequired(event : any){ 
    const apellidos = this.Form.get("apellidos");
    const nombres = this.Form.get("nombres");
    const razonSocial = this.Form.get("razonSocial"); 
    
    if(event === 'DNI') { 
      apellidos.setValidators([Validators.required]);
      nombres.setValidators([Validators.required]); 
      razonSocial.setValidators(null); 
      this.mostrarRazonSocial = false;
      this.minimoRequerido = 8;
      this.maximoRequerido = 8;
    }else if(event === 'RUC') { 
      apellidos.setValidators(null);
      nombres.setValidators(null); 
      razonSocial.setValidators([Validators.required]); 
      this.mostrarRazonSocial = true;
      this.minimoRequerido = 11;
      this.maximoRequerido = 11;
    }else{
      apellidos.setValidators([Validators.required]);
      nombres.setValidators([Validators.required]); 
      razonSocial.setValidators(null); 
      this.mostrarRazonSocial = false;
      this.minimoRequerido = 15;
      this.maximoRequerido = 15;
    }

    apellidos.updateValueAndValidity();
    nombres.updateValueAndValidity(); 
    razonSocial.updateValueAndValidity(); 
  }

}
