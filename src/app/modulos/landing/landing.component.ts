import { Component, OnInit } from '@angular/core'; 
import { FormControl } from '@angular/forms'; 
import { Subscription } from 'rxjs';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent  implements OnInit {
  // mostrarAlmacen: boolean = true;
  // mostrarVentas: boolean = false;
  // mostrarCompras: boolean = false;
  // mostrarConfiguracion: boolean = false;
  rangoBusqueda1 = new FormControl({id : 'Ultimasemana', nombre : "Última semana"})
  DataLineal1: any;
  DataGraficoDunat: any;
  Grafico1: any[]= []; 
  subscription: Subscription; 
  LabelGrafico1 : any[]= [];
  DataGrafico1 : any[]= [];
  TotalCobrado: any;
  totalPorCobrar: any;
  arrayRango1 = ConstantesGenerales.arrayRangos;


  rangoBusqueda2 = new FormControl({id : 'Ultimomes', nombre : "Último mes"})
  DataLineal2: any;
  Grafico2: any[]= [];
  LabelGrafico2 : any[]= [];
  DataGrafico2 : any[]= [];
  TotalCobrado2: any;
  totalPorCobrar2: any;
  arrayRango2 = ConstantesGenerales.arrayRangos;

 

constructor(
  private apiService : GeneralService
){}
 

ngOnInit() {
 this.onDatosDelGrafico();
 this.onDatosDelGrafico2();
}

/* GRAFICO 1 y 2 */
  onObtenerRango(event){
    this.onDatosDelGrafico();
  }
 
  onDatosDelGrafico(){ 
    this.onLimpiarGraficos();
    this.apiService.graficoLineaDonut(this.rangoBusqueda1.value.id).subscribe((resp) => {  
      if(resp){
        this.onArmarDataParaElGrafico(resp); 
      }
    })
  }

  onArmarDataParaElGrafico(data){
    console.log('armar data',data);

    let DaraOrdenada =  data.sort(function (a, b) {
        if (a.index > b.index) return 1;
        if (a.index < b.index) return -1;
        return 0;
      }); 
    this.Grafico1.push(DaraOrdenada);
    DaraOrdenada.forEach(element => {
      this.LabelGrafico1.push(element.periodo);
      this.DataGrafico1.push(element.importeSoles.importeConImpuestos); 
    })
    this.TotalCobrado =  DaraOrdenada.reduce((sum, value)=> (sum + value.importeSoles.importeCobrado ?? 0 ), 0);
    this.totalPorCobrar =  DaraOrdenada.reduce((sum, value)=> (sum + value.importeSoles.importeSinCobrar ?? 0 ), 0);

    this.onGrafico();
    this.onGraficoDonut();
  }

  onGrafico(){ 
    this.DataLineal1 = {
      labels: this.LabelGrafico1,
      datasets: [{
        label: 'xxx',
        data: this.DataGrafico1,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        color: 'rgb(75, 192, 192)',
        tension: 0, 
     }] 
    }    
  }

  onGraficoDonut(){  
    let ProcentTotalCobroado = +parseFloat(this.TotalCobrado.toFixed(2));
    let ProcentTotalPorCobrar = +parseFloat(this.totalPorCobrar.toFixed(2));
    this.DataGraficoDunat = {
      labels: ['COBRADO', 'POR COBRAR'],
      datasets: [{ 
        label: '',
        data: [ProcentTotalCobroado  , ProcentTotalPorCobrar],
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        color: 'rgb(75, 192, 192)',
        tension: 0.5, 
    }] 
  }   
  }

  onLimpiarGraficos(){
    this.DataGrafico1 = [];
    this.LabelGrafico1 = [];
    this.TotalCobrado = 0; 
    this.totalPorCobrar  = 0; 
  }
   



  /** GRAFICOS 3 */
  onObtenerRango2(event){
    this.onDatosDelGrafico2();
  }
 
  onDatosDelGrafico2(){ 
    this.onLimpiarGraficos2();
    this.apiService.graficoLine(this.rangoBusqueda2.value.id).subscribe((resp) => {  
      if(resp){
        this.onArmarDataParaElGrafico2(resp); 
      }
    })
  }
  onArmarDataParaElGrafico2(data){ 
    let DataOrdenada2 =  data.sort(function (a, b) {
        if (a.index > b.index) return 1;
        if (a.index < b.index) return -1;
        return 0;
      }); 
    this.Grafico2.push(DataOrdenada2);
    DataOrdenada2.forEach(element => {
      this.LabelGrafico2.push(element.periodo);
      this.DataGrafico2.push(element.importeSoles.importeCobrado); 
    })
    this.TotalCobrado2 =  DataOrdenada2.reduce((sum, value)=> (sum + value.importeSoles.importeCobrado ?? 0 ), 0);
    this.totalPorCobrar2 =  DataOrdenada2.reduce((sum, value)=> (sum + value.importeSoles.importeSinCobrar ?? 0 ), 0);
 
    this.onGraficoLineal();
  }


  onGraficoLineal(){
    this.DataLineal2 = {
      labels: this.LabelGrafico2,
      datasets: [
        {
          label: 'Cobrado',
          data: this.DataGrafico2,
          fill: false,
          borderColor: 'red',
          tension: 0,  
        },
        {
          label: 'Por Cobrar',
          data: this.DataGrafico1,
          fill: false,
          borderColor: 'blue',
          tension: 0,   
        }
     ] 
    }
  }    
 

  onLimpiarGraficos2(){
    this.DataGrafico2 = [];
    this.LabelGrafico2 = [];
    this.TotalCobrado2 = 0; 
    this.totalPorCobrar2  = 0; 
  }
 

}
