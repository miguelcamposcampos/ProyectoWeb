import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';  
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Subject } from 'rxjs';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICrearChofer } from '../interface/transportista.interface';
import { TransportistaService } from '../service/transportista.service';

@Component({
  selector: 'app-nuevo-chofer',
  templateUrl: './nuevo-chofer.component.html',
  styleUrls: ['./nuevo-chofer.component.scss']
})
export class NuevoChoferComponent implements OnInit {

  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  tituloVistaChofer :string = "NUEVO CHOFER"; 
  @Output() cerrar : EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() dataChofer : any;
  EditarChofer : ICrearChofer 
  Form : FormGroup;
  listTipoPersona: any[];
  listTipoDocumento : any[];
  ubigeoParaMostrar : string =""; 
  modalBuscarUbigeo : boolean = false;
 
  minimoRequerido : number = 0;
  maximoRequerido : number = 0; 
  mostrarRazonSocial: boolean = false;

  constructor(
    private transpService: TransportistaService,
    public generalService : GeneralService,
    private swal : MensajesSwalService,
    private spinner : NgxSpinnerService
  ) { 
    this.builform();
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
  }

  ngOnInit(): void { 
    this.onCargarDropDown();  
    if(this.dataChofer.idChofer){
      this.spinner.show();
      this.Avisar();
      this.tituloVistaChofer = "EDITAR CHOFER"; 
    }
  }


  private builform(): void {
    this.Form = new FormGroup({ 
      brevete: new FormControl(null),   
      tipoPersona: new FormControl( null, Validators.required),
      tipoDocumento: new FormControl(null, Validators.required), 
      nroDocumento: new FormControl(null, Validators.required), 
      razonSocial: new FormControl(null, Validators.required),  
      apellidos: new FormControl(null, Validators.required),   
      nombres: new FormControl(null, Validators.required), 
      direccionprincipal: new FormControl(null),   
      ubigeo: new FormControl(null),   
    });
  }

  onBuscarPorNumeroDocumento(){ 
    const nroDocumento  = this.Form.controls['nroDocumento'].value;
 
    if(!nroDocumento){
      this.swal.mensajeAdvertencia('porfavor ingrese un numero de documento');
      return;
    } 
    this.spinner.show(); 
    this.generalService.consultaPorDni(nroDocumento).subscribe((resp) => {
      if(resp.dni){
        this.Form.patchValue({
          apellidos : resp.apePaterno + ' ' + resp.apeMaterno,
          nombres : resp.nombres
        }); 
      }else{
        this.swal.mensajeAdvertencia('No se encontraron datos.');
        this.limpiarForm(); 
      }
      this.spinner.hide();
    }) 
  }

  onCargarDropDown(){ 
    const obsDatos = forkJoin( 
      this.generalService.listadoPorGrupo('TipoPersona'), 
      this.generalService.listadoPorGrupo('TipoDocumento'),  
    );
    obsDatos.subscribe((response) => {
      this.listTipoPersona = response[0];
      this.listTipoDocumento = response[1];  
      this.FlgLlenaronCombo.next(true); 
    });
  } 

  Avisar() {
    this.FlgLlenaronCombo.subscribe((x) => {
      this.onObtenerDataChoferEditar(); 
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

  limpiarForm(){
    this.Form.controls['nroDocumento'].setValue(null);
    this.Form.controls['apellidos'].setValue(null);
    this.Form.controls['nombres'].setValue(null);
  }
  
 
  onObtenerDataChoferEditar(){ 
    this.spinner.show();
    this.transpService.choferporId(this.dataChofer.idChofer).subscribe((resp) => { 
      if(resp){ 
        this.EditarChofer = resp; 
        this.onObtenerTipoDocumento(this.EditarChofer.personaData.tipodocumentoid);

        if(+resp.personaData.ubigeoprincipal){
          this.generalService.listarubigeo(+resp.personaData.ubigeoprincipal).subscribe((ubi)=> {
            let datosubi: any = Object.values(ubi)  
            this.ubigeoParaMostrar = datosubi[0] + ' - ' +  datosubi[1] + ' - ' + datosubi[2]; 
          })
          this.Form.controls['ubigeo'].setValue(resp.personaData.ubigeoprincipal);  
        }
        
        this.Form.patchValue({ 
          nroDocumento: this.EditarChofer.personaData.nrodocumentoidentidad, 
          apellidos: this.EditarChofer.personaData.apellidos,   
          nombres: this.EditarChofer.personaData.nombres, 
          brevete: this.EditarChofer.brevete, 
          direccionprincipal: this.EditarChofer.personaData.direccionprincipal,
          tipoPersona: this.listTipoPersona.find(
            (x) => x.id === this.EditarChofer.personaData.tipopersonaid
            ),
            tipoDocumento: this.listTipoDocumento.find(
              (x) => x.id === this.EditarChofer.personaData.tipodocumentoid
          ),
          razonSocial: this.EditarChofer.personaData.razonsocial, 
        });
        this.spinner.hide();
      }
    });
  }

  onBuscarUbigeo(){
    this.modalBuscarUbigeo = true;
  }

  onPintarUbigeoSeleccionado( data : any){ 
    if(data){
      this.ubigeoParaMostrar = data.nombreubigeo;
      this.Form.controls['ubigeo'].setValue(data.ubigeo); 
    }
    this.modalBuscarUbigeo = false;
  }


  onGrabarChofer(){ 
    const data  = this.Form.value; 
    const newChofer : ICrearChofer = {
      brevete : data.brevete,
      personaData:{
        apellidos: data.apellidos, 
        nombres: data.nombres,
        categoriapersona : 0,
        direccionesAnexos: [],
        nrodocumentoidentidad : data.nroDocumento,
        personaid:  this.EditarChofer ? this.EditarChofer.personaData.personaid : 0,
        tipodocumentoid : data.tipoDocumento.id,
        tipopersonaid: data.tipoPersona.id,
        razonsocial :  data.razonSocial,
        ubigeoprincipal : data.ubigeo,
        direccionprincipal: data.direccionprincipal
      },
      idauditoria :  this.EditarChofer ? this.EditarChofer.idauditoria : 0,
      personaid : this.EditarChofer ? this.EditarChofer.personaData.personaid : 0,
      transportistachoferid : this.EditarChofer ? this.EditarChofer.transportistachoferid : 0,
      transportistaid : this.dataChofer.idTransportista,
   
    } 

    //SI LLEGA DATA PARA EDITAR ENTONCES SE INSERTA UN NUEVO REGISTRO DE LO CONTRARIO SE ACTUALIZA
    if (!this.EditarChofer) {
      this.transpService.grabarChofer(newChofer).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Se grabaron los datos correctamente!.');
          this.cerrar.emit(true); 
        }
      });
    }else { 
      this.transpService.updateChofer(newChofer).subscribe((resp) =>{
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
