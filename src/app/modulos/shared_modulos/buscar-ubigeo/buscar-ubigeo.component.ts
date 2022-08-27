import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';

@Component({
  selector: 'app-buscar-ubigeo',
  templateUrl: './buscar-ubigeo.component.html'
})
export class BuscarUbigeoComponent implements OnInit {

  @Input() dataUbigeo : string;
  @Output() ubigeoSelect: EventEmitter<any> = new EventEmitter<any>();

  Form : FormGroup  = this.fb.group({
    departamento:['', Validators.required],
    provincia:['', Validators.required],
    distrito:['', Validators.required],
    ubigeo:['', Validators.required],
  }) 
  direccionUbigeo: FormControl = new FormControl('', Validators.required);

  bloqueardropdownProvincias : boolean = true;
  bloqueardropdownDistritos : boolean = true;
 
  arrayDepartamentos: any[] = [];
  arrayProvincias: any[] = [];
  arrayDistritos: any[] = [];
 

  constructor(
    private generalService: GeneralService,
    private swal : MensajesSwalService,
    private fb: FormBuilder,
  ) { 
    this.onCargarDepartamentos();
  }

 
  ngOnInit(): void {
    this.onchangeDepartamentos();   
  }

  onCargarDepartamentos(){
    this.generalService.listaDepartamento().subscribe((resp) => { 
      resp.forEach(element => {
        this.arrayDepartamentos.push({nombre : element})
      }); 
    })
  }

 
  onchangeDepartamentos(){ 
    this.Form.get('departamento')?.valueChanges.pipe(
      tap(()=>{ 
          this.arrayProvincias = [];
          this.bloqueardropdownProvincias = true; 
          this.arrayDistritos = []
          this.bloqueardropdownDistritos = true; 
          this.Form.get('ubigeo').setValue(null);           
        }),
        switchMap( resp => this.generalService.listaProvincias(resp.nombre))
    ).subscribe( provincias => {
      provincias.forEach(element => {
        this.bloqueardropdownProvincias = false;
        this.arrayProvincias.push({nombre : element})
      });   
      this.onchangeProvincia();  
    });
  }

  onchangeProvincia(){
      this.Form.get('provincia')?.valueChanges.pipe(
        tap(()=>{  
            this.arrayDistritos = []
            this.bloqueardropdownDistritos = true; 
            this.Form.get('ubigeo').setValue(null);    
          }), 
          switchMap( resp => this.generalService.listaDistritos(this.Form.get('departamento')?.value.nombre, resp.nombre) )
      ).subscribe( distritos => {
        distritos.forEach(element => {
          this.bloqueardropdownDistritos = false;
          this.arrayDistritos.push({nombre : element})
        });     
        this.onchangeDistrito();  
      });
  }
  
  onchangeDistrito(){
    this.Form.get('distrito')?.valueChanges.pipe(
      tap(()=>{   
        this.Form.get('ubigeo').setValue(null);    
        }), 
        switchMap( resp =>  
          this.generalService.listaUbigeo(this.Form.get('departamento')?.value.nombre, this.Form.get('provincia')?.value.nombre, resp.nombre)
        )
    ).subscribe( ubi => {
      this.Form.get('ubigeo').setValue(ubi);   
    });
  }
 

  onRegresar() {   
    this.ubigeoSelect.emit(false); 
  }

  onGrabar(){ 
    if(!this.Form.get('distrito').value){
      this.swal.mensajeAdvertencia('completa el ubigeo');
      return;
    }

    this.swal.mensajePregunta("El ubigeo: " + this.Form.get('departamento').value.nombre + ' - ' + this.Form.get('provincia').value.nombre +  ' - ' +  this.Form.get('distrito').value.nombre + ", es correcto?").then((response) => {
      if (response.isConfirmed) {  
        const data ={
          punto : this.dataUbigeo,
          ubigeo : this.Form.get('ubigeo').value,
          nombreubigeo :  (this.Form.get('departamento').value.nombre + ' - ' + this.Form.get('provincia').value.nombre  +  ' - ' + this.Form.get('distrito').value.nombre)
        }
        this.ubigeoSelect.emit(data); 
      }
    })  

   
  }

}
