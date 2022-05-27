import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IUbicaciones } from 'src/app/shared/interfaces/generales.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';

@Component({
  selector: 'app-buscar-ubigeo',
  templateUrl: './buscar-ubigeo.component.html',
  styleUrls: ['./buscar-ubigeo.component.scss']
})
export class BuscarUbigeoComponent implements OnInit {

  @Input() dataUbigeo : string;
  @Output() ubigeoSelect: EventEmitter<any> = new EventEmitter<any>();

  departamento: FormControl = new FormControl('', Validators.required);
  provincia: FormControl = new FormControl('', Validators.required);
  distrito: FormControl = new FormControl('', Validators.required);
  direccionUbigeo: FormControl = new FormControl('', Validators.required);

  bloqueardropdownProvincias : boolean = false;
  bloqueardropdownDistritos : boolean = false;
 
  arrayDepartamentos: any[] = [];
  arrayProvincias: any[] = [];
  arrayDistritos: any[] = [];
  ubigeo : number = 0;

  constructor(
    private generalService: GeneralService,
    private swal : MensajesSwalService,
  ) { }

  ngOnInit(): void {
    this.onCargarDepartamentos();
  }

  onCargarDepartamentos(){
    this.generalService.listaDepartamento().subscribe((resp) => { 
      resp.forEach(element => {
        this.arrayDepartamentos.push({nombre : element})
      }); 
    })
  }


  
  onObtenerDepartamentoSeleccionado(event: any){
    if(event){  
      this.bloqueardropdownProvincias = true;
      this.bloqueardropdownDistritos = true;
      this.distrito.setValue('');
    }
      const ubigeoSerach : IUbicaciones = {
        departamento : event.nombre
      } 
      this.arrayProvincias = [];
      this.generalService.listaProvincias(ubigeoSerach).subscribe((resp) => {  
        if(resp){
          this.bloqueardropdownProvincias = false;
          resp.forEach(element => {
            this.arrayProvincias.push({nombre : element})
          });   
        }
      })
 
  }

  onObtenerProvinciaSeleccionado(event: any){ 
    if(event){   
      this.bloqueardropdownDistritos = true;
    } 
      const ubigeoSerach : IUbicaciones = {
        departamento : this.departamento.value.nombre,
        provincia :  event.nombre
      }  
      this.arrayDistritos = []
      this.generalService.listaDistritos(ubigeoSerach).subscribe((resp) => { 
        if(resp){
          this.bloqueardropdownDistritos = false;
          resp.forEach(element => {
            this.arrayDistritos.push({nombre : element})
          }); 
        } 
      })
   
  }

  onObtenerDistritoSeleccionado(event: any){   
      const ubigeoSerach : IUbicaciones = {
        departamento : this.departamento.value.nombre,
        provincia : this.provincia.value.nombre,
        distrito : event.nombre
      } 
      this.ubigeo = null;
      this.generalService.listaUbigeo(ubigeoSerach).subscribe((resp) => {  
        this.ubigeo = resp 
      }) 
  }
 

  onRegresar() {   
    this.ubigeoSelect.emit(false); 
  }

  onGrabar(){
    if(!this.distrito.value.nombre){
      this.swal.mensajeAdvertencia('completa el ubigeo');
      return;
    }

    this.swal.mensajePregunta("El ubigeo: " + this.departamento.value.nombre + ' - ' + this.provincia.value.nombre +  ' - ' + this.distrito.value.nombre + ", es correcto?").then((response) => {
      if (response.isConfirmed) {  
        const data ={
          punto : this.dataUbigeo,
          ubigeo : this.ubigeo,
          nombreubigeo :  (this.departamento.value.nombre + ' - ' + this.provincia.value.nombre +  ' - ' + this.distrito.value.nombre)
        }
        this.ubigeoSelect.emit(data); 
      }
    })  

   
  }

}
