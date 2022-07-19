import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICreateCuentasMayores } from '../interface/cuentas-mayores.interface';
import { CuentasMayoresService } from '../service/cuentas-mayores.service';

@Component({
  selector: 'app-nueva-cuenta',
  templateUrl: './nueva-cuenta.component.html',
  styleUrls: ['./nueva-cuenta.component.scss']
})
export class NuevaCuentaComponent implements OnInit {
 
  @Input() data : any;
  @Output() cerrar : EventEmitter<boolean>  = new EventEmitter<any>();
  Form : FormGroup;
  fechaActual = new Date();

  constructor(
    private apiService : CuentasMayoresService,
    private swal : MensajesSwalService,
    private spinner: NgxSpinnerService
  ) { 
      this.onForm();
  }

  onForm(){
    this.Form = new FormGroup({
      nrocuenta : new FormControl(null, Validators.required),
      nombrecuenta : new FormControl(null, Validators.required),
      naturaleza : new FormControl('D', Validators.required)
    })
  }

  ngOnInit(): void {
    if(this.data){
      this.spinner.show();
      this.onDataEdit();
    }
  }

  onDataEdit(){
    this.apiService.listId(this.data.idPlanCuenta).subscribe((resp) =>{
      if(resp){
        this.spinner.hide();
        console.log('que data vamos a editar',resp);
          this.Form.patchValue({
            nrocuenta : resp.nrocuenta,
            nombrecuenta : resp.nombrecuenta,
            naturaleza : resp.naturaleza
          });
      }
    })

  }



  onGrabar(){
    const data = this.Form.value;
    const newCuenta : ICreateCuentasMayores = {
      plancuentaid: this.data ? this.data.idPlanCuenta : 0,
      nrocuenta: data.nrocuenta,
      periodo: this.fechaActual.getFullYear(),
      escuentamayor: false,
      nombrecuenta: data.nombrecuenta,
      naturaleza: data.naturaleza,
      imputable: false,
      monedaid: 0,
      detalle: false,
      centrodecosto: false,
      presupuesto: false,
      analisispatrimonioneto: false,
      usadocostoproduccion: false
    }
    console.log('nueva cuenta', newCuenta);
    if(!this.data){
      this.apiService.save(newCuenta).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Los datos de grabaron correctamente!.')
          this.cerrar.emit(true);
        }
      })
    }else{
      this.apiService.update(newCuenta).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Los datos de actualizaron correctamente!.')
          this.cerrar.emit(true);
        }
      })
    }
  }

  onRegresar(){
    this.cerrar.emit(false);
  }

  
}
 
