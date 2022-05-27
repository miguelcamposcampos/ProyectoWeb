import { Component, OnInit } from '@angular/core'; 

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent   {

  mostrarAlmacen: boolean = true;
  mostrarVentas: boolean = false;
  mostrarCompras: boolean = false;
  mostrarConfiguracion: boolean = false;

 
  onMostrarMenu(param : string){
    this.mostrarAlmacen = false;
    this.mostrarVentas = false;
    this.mostrarCompras = false;
    this.mostrarConfiguracion = false;
    if(param === 'A'){
      this.mostrarAlmacen = true;
    }
    if(param === 'V'){
      this.mostrarVentas = true;
    }
    if(param === 'C'){
      this.mostrarCompras = true;
    }
    if(param === 'CF'){
      this.mostrarConfiguracion = true;
    }
   
 
  }
}
