import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { forkJoin, Subject } from 'rxjs';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICreatePlanCuenta, IDetalleDestinos, IListPlanCuenta } from '../interface/plan-cuentas.interface';
import { PlanCuentaService } from '../service/plan-cuenta.service';

@Component({
  selector: 'app-nueva-plan-cuenta',
  templateUrl: './nueva-plan-cuenta.component.html',
  styleUrls: ['./nueva-plan-cuenta.component.scss']
})
export class NuevaPlanCuentaComponent implements OnInit, AfterViewInit{

  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  @Input() data : any;
  @Output() cerrar : EventEmitter<boolean>  = new EventEmitter<any>();
  Form : FormGroup;
  bloquearData : boolean = true;
  DatosForm : boolean = true;
  DestinoForm : boolean = false;
  activeItem: MenuItem;
  items: MenuItem[];
  fechaActual = new Date();
  PlanEdit: ICreatePlanCuenta; 
  arrayMonedas : ICombo[];
  maskInput : any;
  arrayDetalleGrabar : IDetalleDestinos[]; 
  arrayDetallesEliminados : any[]=[]; 
  modalCuentas: boolean = false;
  tipoCuenta :any;
  claseCuenta :any;

  constructor(
    private apiService: PlanCuentaService,
    private swal : MensajesSwalService,
    private spinner : NgxSpinnerService,
    private generalService : GeneralService,
    private fb : FormBuilder,
    private cdr: ChangeDetectorRef
  ) { 
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
    this.onForm();
  }

  ngAfterViewInit(): void {
    this.onCargarDropDown();
  }
 
  onForm(){
    this.Form = new FormGroup({
      nrocuenta : new FormControl(null, Validators.required),
      nombrecuenta : new FormControl(null, Validators.required),
      naturaleza : new FormControl('D', Validators.required),
      requieredetalle : new FormControl(false),
      requierecentrocosto : new FormControl(false),
      presupuesto : new FormControl(false),
      analisispatrimonioneto : new FormControl(false),
      usadocostroproduccion : new FormControl(false),
      imputable : new FormControl(false),
      monedaid : new FormControl(null),
      arrayDetalle: new FormArray([]),
    })
  }


  ngOnInit(): void { 
    this.maskInput = this.data.ctaMayor; 

    if(this.data.data){
      this.spinner.show(); 
      this.Avisar(); 
    }
    this.onTabsForm(); 
  }

  Avisar() {
    this.FlgLlenaronCombo.subscribe(x => { 
      this.onDateEdit('editar');
    });
  }

  onCargarDropDown(){ 
    const obsDatos = forkJoin(
      this.generalService.listadoPorGrupo('Monedas')
    );
    obsDatos.subscribe((response) => { 
      this.arrayMonedas = response[0];    
      this.FlgLlenaronCombo.next(true);
    }); 
  }

  onTabsForm(){
    this.items = [
      {
        id: '1',
        label: 'DATOS',
        icon: 'pi pi-fw pi-info-circle',
        command: event => {
          this.activateMenu(event.item.id);
        }
      },
      {
        id: '2',
        label: 'DESTINO',
        icon: 'pi pi-fw pi-file',
        command: event => {
          this.activateMenu(event.item.id);
        }
      }, 
    ]; 
    this.activeItem = this.items[0];

  }
 
  activateMenu(event) {      
    if(event ===  "2" ){
      this.DestinoForm = true;
      this.DatosForm = false; 
    }else{
      this.DestinoForm = false;
      this.DatosForm = true; 
    }

  }
  

  get fa() { return this.Form.get('arrayDetalle') as FormArray; } 
  get detallesForm() { return this.fa.controls as FormGroup[]; }

  onAgregarDetalles(){
  //   const dataForm = this.Form.value;
  //   if(!dataForm.tipocambio){
  //     this.swal.mensajeAdvertencia("Ingresa un tipo de cambio");
  //     return;
  //   }
    this.detallesForm.push(this.AddDetalle());  
  }

  AddDetalle(){
    return this.fb.group({ 
      asientodetalleid: new FormControl(0),
      plancuentasdestinoid: new FormControl(0),
      nrocuentadestino :  new FormControl(0),
      nrocuentatransferencia : new FormControl(0),
      porcentaje: new FormControl(0),
      periodo: new FormControl(0),
      plancuentaid: new FormControl(0),
      idauditoria: new FormControl(0)
    });
  }

  onEliminarDetalle(index : any, plancuentasdestinoid : any){ 
    if(!plancuentasdestinoid){
      this.fa.removeAt(index);
      this.cdr.detectChanges();  
    } else{
      this.swal.mensajePregunta("¿Seguro que desea eliminar el detalle.?").then((response) => {
        if (response.isConfirmed) {
          this.arrayDetallesEliminados.push(plancuentasdestinoid);
          this.fa.removeAt(index); 
          this.swal.mensajeExito('El detalle ha sido eliminado correctamente!.');
        }
      })
    }
  }

  onValidarInputMask(event : any){ 
    if(event){ 
      this.onBloquearDatos(event.target.value); 
    }
  }

  onBloquearDatos(num){ 
    if(num.length > 2){
      let Num2  = num.replace(/ /g, "");  
      Num2  = Num2.replace(/-/g, "");   
      if(Num2.length >= 7){
        this.bloquearData = false; 
        this.Form.controls['imputable'].setValue(true);
      }else{
        this.bloquearData = true;
        this.Form.controls['imputable'].setValue(false);
      } 
    } 
  }

  onDateEdit(estado){
    this.apiService.plancuentaId(this.data.data.idPlanCuenta).subscribe((resp) => {
      if(resp){
        
        this.PlanEdit = resp; 
        if(resp.nrocuenta.length > 6){
            this.bloquearData = false
        }
        this.Form.patchValue({ 
          nrocuenta :  resp.nrocuenta,
          periodo : resp.periodo,
          escuentamayor : resp.escuentamayor,
          nombrecuenta : resp.nombrecuenta,
          naturaleza : resp.naturaleza,
          imputable : resp.imputable, 
          monedaid: this.arrayMonedas.find(
            (x) => x.id === resp.monedaid
          ),
          requieredetalle : resp.detalle,
          requierecentrocosto : resp.centrodecosto,
          presupuesto : resp.presupuesto,
          analisispatrimonioneto : resp.analisispatrimonioneto,
          usadocostroproduccion : resp.usadocostoproduccion,
          idauditoria: resp.idauditoria 
        })

        for( let  i = 0; i < resp.destinos.length; i++){
          if(estado === 'editar'){
            this.onAgregarDetalles();  
          }
  
          this.detallesForm[i].patchValue({  
            plancuentasdestinoid: resp.destinos[i].plancuentasdestinoid,
            nrocuentadestino :resp.destinos[i].nrocuentadestino,
            nrocuentatransferencia :resp.destinos[i].nrocuentatransferencia,
            porcentaje:resp.destinos[i].porcentaje,
            periodo:resp.destinos[i].periodo,
            plancuentaid:resp.destinos[i].plancuentaid,
            idauditoria:resp.destinos[i].idauditoria
          });
        }

      this.spinner.hide(); 
      }
    })
  }

  onGrabar(){
    const data = this.Form.value;
    let ArrayDestinos = this.onArrayDestinos();
    let NumCuentaGrabar  =  data.nrocuenta.replace(/ /g, "");  
    NumCuentaGrabar  = NumCuentaGrabar.replace(/-/g, "");  

    let EsImputable =  this.Form.controls['imputable'].value
    const NewPlanCuenta : ICreatePlanCuenta = { 
        plancuentaid : this.data.data ? this.data.data.idPlanCuenta : 0,
        nrocuenta : NumCuentaGrabar,
        periodo : this.fechaActual.getFullYear(),
        escuentamayor : false,
        nombrecuenta : data.nombrecuenta,
        naturaleza : data.naturaleza,
        imputable : data.imputable,
        monedaid : data.monedaid ?  data.monedaid.id : -1, 
        detalle :  EsImputable ? data.requieredetalle : false,
        centrodecosto :  EsImputable ? data.requierecentrocosto : false,
        presupuesto : EsImputable ?  data.presupuesto : false,
        analisispatrimonioneto : EsImputable ? data.analisispatrimonioneto : false,
        usadocostoproduccion :  EsImputable ? data.usadocostroproduccion : false, 
        idauditoria: this.PlanEdit ? this.PlanEdit.idauditoria : 0,
        destinos : ArrayDestinos
    }
    console.log('que guardamos',NewPlanCuenta);

    if(!this.PlanEdit){
      this.apiService.save(NewPlanCuenta).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Se grabaron los datos correctamente!.');
          this.cerrar.emit(true)
        }
      });
    }else{
      this.apiService.update(NewPlanCuenta).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
          this.cerrar.emit(true)
        }
      });
    } 
  }


  onArrayDestinos(){
    this.arrayDetalleGrabar = [];
    this.detallesForm.forEach(element => { 
        this.arrayDetalleGrabar.push({  
          plancuentasdestinoid: element.value.plancuentasdestinoid,
          nrocuentadestino :  element.value.nrocuentadestino,
          nrocuentatransferencia : element.value.nrocuentatransferencia,
          porcentaje: element.value.porcentaje,
          periodo: this.fechaActual.getFullYear(),
          plancuentaid: element.value.plancuentaid,
          idauditoria: element.value.idauditoria

        }); 
    })
    return this.arrayDetalleGrabar;
  }


  
  onModalBuscarCuenta(data :any, clase : string){ 
    this.claseCuenta = clase
    this.tipoCuenta = data
    this.modalCuentas = true;
  }

  onPintarcuenta(data:any){ 
    if(this.claseCuenta === 'Cuenta'){
      this.detallesForm[data.posicion].patchValue({
        nrocuentadestino: data.data.nroCuenta
      }); 
    }else{
      this.detallesForm[data.posicion].patchValue({
        nrocuentatransferencia: data.data.nroCuenta
      }); 
    }
  
    this.modalCuentas = false;
    this.claseCuenta = null
  }

 
  onRegresar(){
    this.cerrar.emit(false);
  }
}
