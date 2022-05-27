import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs'; 
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICrearVendedor } from '../interface/vendedores.interface';
import { VendedoresService } from '../servicio/vendedor.service';

@Component({
  selector: 'app-nuevo-vendedor',
  templateUrl: './nuevo-vendedor.component.html',
  styleUrls: ['./nuevo-vendedor.component.scss']
})
export class NuevoVendedorComponent implements OnInit {
  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  @Input() dataVendedor! : any;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  Form : FormGroup;
  VendedorEdit : ICrearVendedor;
  arrayEstablecimientos : ICombo[];
  tituloNuevoVendedor : string ="NUEVO VENDEDOR";
  modalBuscarUbigeo : boolean = false;
  ubigeoSeleccionado : number = 0;
  ubigeoParaMostrar : string ="";


  constructor(    
    private swal : MensajesSwalService, 
    private vendedorService : VendedoresService,
    private generalService : GeneralService
  ) {
    this.builform();
   }

   public builform(): void {
    this.Form = new FormGroup({ 
      establecimiento: new FormControl(null, Validators.required), 
      nroDocumento: new FormControl(null, Validators.required), 
      apellidos: new FormControl(null, Validators.required), 
      nombres: new FormControl(null, Validators.required),  
      direccionprincipal: new FormControl(null),  
    })
  }
  ngOnInit(): void {
    this.onCargarDropdown();

    if(this.dataVendedor){
      this.Avisar();
      this.tituloNuevoVendedor ="EDITAR VENDEDOR";
    }
  }

  onCargarDropdown(){
    const obsDatos = forkJoin(   
      this.generalService.listadoComboEstablecimientos(), 
    );
    obsDatos.subscribe((response) => { 
      this.arrayEstablecimientos = response[0];   
      this.FlgLlenaronCombo.next(true); 
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    }); 
  }

  
  Avisar(){
    this.FlgLlenaronCombo.subscribe((x) => {
      this.onObtenerVendedorPorId(this.dataVendedor.id); 
    });
  }

 
  onObtenerVendedorPorId(id){ 
    this.swal.mensajePreloader(true); 
    this.vendedorService.VendedorPorId(id).subscribe((resp) => {
      if(resp){ 
        this.VendedorEdit = resp; 
        this.generalService.listarubigeo(+this.VendedorEdit.personaData.ubigeoprincipal).subscribe((ubi)=> {
          let datosubi: any = Object.values(ubi) 
          this.ubigeoParaMostrar = datosubi[0] + ' - ' +  datosubi[1] + ' - ' + datosubi[2];
        })

        this.ubigeoSeleccionado = resp.personaData.ubigeoprincipal;

        this.Form.patchValue({
          establecimiento: this.arrayEstablecimientos.find(
            (x) => x.id === this.VendedorEdit.establecimientoid
            ),
            nroDocumento: this.VendedorEdit.personaData.nrodocumentoidentidad,
            apellidos: this.VendedorEdit.personaData.apellidos,
            nombres: this.VendedorEdit .personaData.nombres,
            direccionprincipal: this.VendedorEdit.personaData.direccionprincipal
          })
        }
        this.swal.mensajePreloader(false);
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  onBuscarPorDni(){
    let dniSearch = this.Form.controls['nroDocumento'].value;

    if(dniSearch.toString().length === 8){
      this.swal.mensajePreloader(true)
      this.generalService.consultaPorDni(dniSearch).subscribe((resp) => {
        if(resp){  
          this.Form.patchValue({
            apellidos : resp.apePaterno + ' ' + resp.apeMaterno,
            nombres : resp.nombres
          });
        } 
        this.swal.mensajePreloader(false)
      },error => { 
        this.generalService.onValidarOtraSesion(error);  
      });
    }else{
      this.swal.mensajeAdvertencia('porfavor ingrese un numero de documento valido');
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
          personaid:  this.VendedorEdit ? this.VendedorEdit.personaid :0,  
          ubigeoprincipal : this.ubigeoSeleccionado,
      },
      personaid :  this.VendedorEdit ? this.VendedorEdit.personaid:0,
      vendedorid :  this.VendedorEdit ? this.VendedorEdit.vendedorid :0,
    }
 
    if(!this.VendedorEdit){
      this.vendedorService.crearVendedor(newVendedor).subscribe((resp) => {
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito('Se grabaron los datos correctamente!.');
      },error => { 
        this.generalService.onValidarOtraSesion(error);  
      });
    }else{
      this.vendedorService.updateVendedor(newVendedor).subscribe((resp) => {
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
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
