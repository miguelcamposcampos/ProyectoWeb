import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { forkJoin, Subject } from 'rxjs'; 
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service'; 
import { ICrearTransportista } from '../interface/transportista.interface';
import { TransportistaService } from '../service/transportista.service';

@Component({
  selector: 'app-nuevo-transportista',
  templateUrl: './nuevo-transportista.component.html',
  styleUrls: ['./nuevo-transportista.component.scss']
})
export class NuevoTransportistaComponent implements OnInit {
  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  @Output() cerrar: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() idTransportistaEdit! : number;
  tituloVistaTransportista: string ="NUEVO TRANSPORTISTA";
  EditarTransportista : ICrearTransportista;

  items: MenuItem[];
  Form! : FormGroup;

  listTipoPersona: any[];
  listTipoDocumento: any[];
  minimoRequerido : number = 0;
  maximoRequerido : number = 0;
 
  ubigeoSeleccionado : string ="";
  ubigeoParaMostrar : string ="";
 
  modalBuscarUbigeo : boolean = false;
  mostrarRazonSocial: boolean = false;
  IngresoManual: boolean = false;

  
  constructor(
    private transpService: TransportistaService,
    public generalService: GeneralService,
    private swal : MensajesSwalService,
    private cd: ChangeDetectorRef,
    private spinner : NgxSpinnerService
  ) {
    this.builform(); 
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
   }

   private builform(): void {
    this.Form = new FormGroup({
      tipoPersona: new FormControl( null, Validators.required),
      tipoDocumento: new FormControl(null, Validators.required), 
      nroDocumento: new FormControl(null, Validators.required), 
      apellidos: new FormControl(null, Validators.required),   
      nombres: new FormControl(null, Validators.required),
      razonSocial: new FormControl(null, Validators.required),  
      telefono: new FormControl(null),   
      fax: new FormControl(null),      
      email: new FormControl(null),  
      direccionprincipal: new FormControl(null),  
    });
  }
 

  ngOnInit(): void {  
    this.onCargarDropDown();  
    if(this.idTransportistaEdit){ 
      this.spinner.show();
      this.Avisar();
      this.tituloVistaTransportista = "EDITAR TRANSPORTISTA"
    } 
  }
   
  onCargarDropDown(){
    const buscarTipPersona = "TipoPersona" 
    const buscarTipoDocumento = "TipoDocumento" 

    const obsDatos = forkJoin( 
      this.generalService.listadoPorGrupo(buscarTipPersona), 
      this.generalService.listadoPorGrupo(buscarTipoDocumento),  
    );
    obsDatos.subscribe((response) => {
      this.listTipoPersona = response[0];
      this.listTipoDocumento = response[1];  
      this.FlgLlenaronCombo.next(true); 
    });
  } 

  //Avisa que ya se cargaron los dropdown
  Avisar() {
    this.FlgLlenaronCombo.subscribe((x) => {
      this.onObtenerDataTransportistaEditar(); 
    });
  }
 
  /* TRAER DATA PARA EDITAR */
  onObtenerDataTransportistaEditar(){  
    this.transpService.transportistaporId(this.idTransportistaEdit).subscribe((resp) => { 
      if(resp){
        this.EditarTransportista = resp;
        this.onObtenerTipoDocumento(this.EditarTransportista.personaData.tipodocumentoid);
        if(+resp.personaData.ubigeoprincipal){
          this.generalService.listarubigeo(+resp.personaData.ubigeoprincipal).subscribe((ubi)=> {
            let datosubi: any = Object.values(ubi) 
            this.ubigeoParaMostrar = datosubi[0] + ' - ' +  datosubi[1] + ' - ' + datosubi[2];
          })
          this.ubigeoSeleccionado = resp.personaData.ubigeoprincipal;
        }

        this.Form.patchValue({
          tipoPersona: this.listTipoPersona.find(
            (x) => x.id === this.EditarTransportista.personaData.tipopersonaid
            ),
            tipoDocumento: this.listTipoDocumento.find(
              (x) => x.id === this.EditarTransportista.personaData.tipodocumentoid
            ),
            nroDocumento: this.EditarTransportista.personaData.nrodocumentoidentidad, 
            apellidos: this.EditarTransportista.personaData.apellidos,   
            nombres: this.EditarTransportista.personaData.nombres,
            razonSocial: this.EditarTransportista.personaData.razonsocial, 
            telefono: this.EditarTransportista.telefono,
            fax: this.EditarTransportista.fax,   
            email: this.EditarTransportista.email,
            direccionprincipal: this.EditarTransportista.personaData.direccionprincipal,
            tipotransportistaid : this.EditarTransportista.tipotransportistaid
        });
        this.spinner.hide();
      } 
    });
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
    this.Form.controls['nroDocumento'].setValue(null);
    this.Form.controls['apellidos'].setValue(null);
    this.Form.controls['nombres'].setValue(null);
    this.Form.controls['razonSocial'].setValue(null); 
    this.Form.controls['telefono'].setValue(null);
    this.Form.controls['fax'].setValue(null);
    this.Form.controls['email'].setValue(null);
    this.ubigeoSeleccionado = null,
    this.ubigeoParaMostrar = "";
  }
 
  onBuscarPorNumeroDocumento(){ 
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
          if(resp){ 
            this.Form.patchValue({
              apellidos : resp.apePaterno + ' ' + resp.apeMaterno,
              nombres : resp.nombres
            }); 
          }else{
            this.IngresoManual = true;
            this.swal.mensajeAdvertencia('No se encontraron datos.');
            this.limpiarForm(); 
          }
          this.spinner.hide();
        })
      }else{
        this.swal.mensajeAdvertencia('porfavor ingrese un numero de documento valido');
      }
    }else if(tipoDocumento.valor1 === 'RUC'){
      if(nroDocumento.toString().length === 11){
        this.spinner.show();
        this.generalService.consultarPorRuc(nroDocumento).subscribe((resp) => {
          if(resp){
            this.cd.markForCheck();
            this.Form.patchValue({
              razonSocial : resp.Data.razonsocial,
              direccionprincipal : resp.Data.DireccionCompleta, 
            })
            this.ubigeoParaMostrar =  resp.Data.UbigeoDescripcion,
            this.ubigeoSeleccionado = resp.Data.ubigeo.toString();             
          }  
          this.spinner.hide();
        });
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


  onGrabarTransportista(){  
    const data  = this.Form.value; 
    
    const newTransportista : ICrearTransportista = {
      personaData:{
        apellidos: data.apellidos, 
        direccionesAnexos: [], //this.direccionUbigeo.value
        nombres: data.nombres,
        nrodocumentoidentidad : data.nroDocumento,
        personaid:  this.EditarTransportista ? this.EditarTransportista.personaData.personaid : 0,
        razonsocial : data.razonSocial,
        tipodocumentoid : data.tipoDocumento.id,
        tipopersonaid: data.tipoPersona.id, 
        ubigeoprincipal : this.ubigeoSeleccionado,
        direccionprincipal : data.direccionprincipal,
        categoriapersona : this.EditarTransportista ? this.EditarTransportista.personaData.categoriapersona : 0, 
      },
      codtransportista: this.EditarTransportista ? this.EditarTransportista.codtransportista : null, 
      email : data.email,
      fax : data.fax,
      telefono : data.telefono,
      tipotransportistaid : this.EditarTransportista ? this.EditarTransportista.tipotransportistaid : 0,
      idauditoria: this.EditarTransportista ? this.EditarTransportista.idauditoria : 0, 
      personaid : this.EditarTransportista ? this.EditarTransportista.personaid : 0, 
      transportistaid : this.EditarTransportista ? this.EditarTransportista.transportistaid : 0, 
    } 

 
 
 

    //SI LLEGA DATA PARA EDITAR ENTONCES SE INSERTA UN NUEVO REGISTRO DE LO CONTRARIO SE ACTUALIZA
    if (!this.idTransportistaEdit) {
        this.transpService.grabarTransportista(newTransportista).subscribe((resp) => {
          if(resp){
            this.swal.mensajeExito('Se grabaron los datos correctamente!.');
            this.cerrar.emit(true); 
          }
        });
    } else { 
      this.transpService.updateTransportista(newTransportista).subscribe((resp) =>{
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
