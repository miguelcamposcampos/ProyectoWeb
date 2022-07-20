import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Subject } from 'rxjs';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IAdminConceptoPorId } from '../interface/admin-conceptos.interface';
import { AdministracionConceptosService } from '../service/admin-conceptos.service';

@Component({
  selector: 'app-nueva-admin-concepto',
  templateUrl: './nueva-admin-concepto.component.html',
  styleUrls: ['./nueva-admin-concepto.component.scss']
})
export class NuevaAdminConceptoComponent implements OnInit, AfterViewInit {

  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  @Input() data : any;
  @Output() cerrar : EventEmitter<boolean>  = new EventEmitter<any>();
  fechaActual = new Date();
  tituloVista = "REGISTRO CONCEPTO CONTABLE";
  arrayMonedas : ICombo[];
  arrayAreas : ICombo[];
  Form : FormGroup;
  AdminConceptoDataEdit : IAdminConceptoPorId

  constructor(
    private apiService: AdministracionConceptosService,
    private swal : MensajesSwalService,
    private spinner : NgxSpinnerService,
    private generalService : GeneralService
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
      codigoconcepto : new FormControl(null, Validators.required),
      nombreconcepto : new FormControl(null, Validators.required),
      areaid : new FormControl(null, Validators.required),
      monedaid : new FormControl(null), 
      cuentaprecioventa : new FormControl(null),
      cuentaigv : new FormControl(null),
      cuentadetraccion : new FormControl(null), 
      cuentadescuento : new FormControl(null), 
    })
  }

  ngOnInit(): void {
    if(this.data){
      this.tituloVista = "ACTUALIZAR CONCEPTO CONTABLE"
      this.spinner.show(); 
      this.Avisar(); 
    } 
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

  Avisar() {
    this.FlgLlenaronCombo.subscribe(x => { 
      this.onDateEdit();
    });
  }

  onDateEdit(){
    this.apiService.listId(this.data.conceptoContableId).subscribe((resp) => {
      if(resp){
        this.spinner.hide();
        this.AdminConceptoDataEdit = resp;  
        this.Form.patchValue({  
          conceptocontableid: resp.conceptocontableid,
          codigoconcepto: resp.conceptocontableid,
          nombreconcepto: resp.nombreconcepto,
          areaid:  this.arrayAreas.find(
            (x) => x.id === resp.areaid
          ),
          cuentaprecioventa: resp.cuentaprecioventa,
          cuentaigv: resp.cuentaigv,
          cuentadetraccion: resp.cuentadetraccion,
          cuentadescuento: resp.cuentadescuento,
          periodo: resp.periodo,
          monedaid: this.arrayMonedas.find(
            (x) => x.id === resp.monedaid
          ),  
          idauditoria: resp.idauditoria
        })
      }
    })
  }

  
  onGrabar(){
    const data = this.Form.value; 

    const newAdminConcepto : IAdminConceptoPorId = { 
        conceptocontableid : this.data.data ? this.data.conceptoContableId : 0,
        codigoconcepto : data.codigoconcepto,
        nombreconcepto: data.nombreconcepto,
        areaid: data.areaid.id,
        cuentaprecioventa: data.cuentaprecioventa,
        cuentaigv: data.cuentaigv,
        cuentadetraccion: data.cuentadetraccion,
        cuentadescuento: data.cuentadescuento,
        periodo : this.fechaActual.getFullYear(), 
        monedaid:  data.monedaid ? data.monedaid.id : -1,
        idauditoria: this.AdminConceptoDataEdit ? this.AdminConceptoDataEdit.idauditoria : 0
    }
    console.log('que guardamos',newAdminConcepto);

    if(!this.AdminConceptoDataEdit){
      this.apiService.save(newAdminConcepto).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Se grabaron los datos correctamente!.');
          this.cerrar.emit(true)
        }
      });
    }else{
      this.apiService.update(newAdminConcepto).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
          this.cerrar.emit(true)
        }
      });
    } 
  }

  onRegresar(){
    this.cerrar.emit(false);
  }

  /* MODALES */

  onModalCtarecioVenta(){
    
  }
  onModalCtaPrecioIgv(){
    
  }
  onModalCtaDetraccion(){
    
  }
  onModalCtaDescuento(){
    
  }

}
