import { Component, OnInit } from '@angular/core'; 
import { FormControl } from '@angular/forms'; 
import { Subscription } from 'rxjs';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';

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
  TotalCobrado: number = 0;
  totalPorCobrar:  number = 0;
  arrayRango1 = ConstantesGenerales.arrayRangos;
  DonutOptions : any;

  rangoBusqueda2 = new FormControl({id : 'Ultimomes', nombre : "Último mes"})
  DataLineal2: any;
  Grafico2: any[]= [];
  LabelGrafico2 : any[]= [];
  DataGrafico2 : any[]= [];
  DataTotalCobrado2:  any[]= [];
  DatatotalPorCobrar2:  any[]= [];
  arrayRango2 = ConstantesGenerales.arrayRangos; 
 
  rangoBusqueda3 = new FormControl({id : 'Ultimomes', nombre : "Último mes"})
  DataLineal3: any;
  Grafico3: any[]= [];
  LabelGrafico3 : any[]= [];
  DataGrafico3 : any[]= [];
  horizontalOptions : any;
  arrayRango3 = ConstantesGenerales.arrayRangos;

 
  DataEnviadosASunat : any; 
  colorAleatorio : any[] =[];
  simboloAleatorio =  "0123456789ABCDEF";
  
constructor(
  private apiService : GeneralService,
  private swal : MensajesSwalService
){}
 

ngOnInit() { 
  this.onDatosDelGrafico();
  this.onDatosDelGrafico2();
  this.onDatosDelGraficoBarrasHorizontal();
  this.onDatosDelGraficoNoEnviadosaSunat(); 
}

/* GRAFICO 1 y 2 */
  onObtenerRango(event, tipo){
    if(tipo === 'HVenta'){
      this.onDatosDelGrafico();
    }else if(tipo === 'HCobranza'){
      this.onDatosDelGrafico2();
    }else if(tipo === 'ProductoMasVendido'){
      this.onDatosDelGraficoBarrasHorizontal();
    }
  }
 
  onDatosDelGrafico(){ 
    this.onLimpiarGraficos();
    this.apiService.graficoHistoriVentaLineaDonut(this.rangoBusqueda1.value.id).subscribe((resp) => {  
      if(resp){
        this.onArmarDataParaElGrafico(resp); 
      }else{

      }
    })
  }

  onArmarDataParaElGrafico(data){ 
    if(data){
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
     //* DATOS PARA EL GRAFICO */
      this.onGrafico(); 
      this.onGraficoDonut();
    }
    
  }

  onGrafico(){ 
    this.DataLineal1 = {
      labels: this.LabelGrafico1.length ? this.LabelGrafico1 :  'No se encontró data',
      datasets: [{
        label: this.DataGrafico1.length ? 'Venta' :  'No se encontró data',
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
      labels: [ProcentTotalCobroado ? 'COBRADO' : 'No se encontró data', ProcentTotalPorCobrar ? 'POR COBRAR'  : 'No se encontró data'],
      datasets: [{ 
        label: 'HOL',
        data: [ProcentTotalCobroado ? ProcentTotalCobroado : 0.01, ProcentTotalPorCobrar ? ProcentTotalPorCobrar :  0.01],
        fill: true,
        borderColor: 'rgb(75, 192, 192)',
        color: 'rgb(75, 192, 192)',
        tension: 0.5, 
        backgroundColor: ['#14ba1a', '#b000b5']
    }] 
    }   
  }

  onLimpiarGraficos(){
    this.DataGrafico1 = [];
    this.LabelGrafico1 = [];
    this.TotalCobrado = 0; 
    this.totalPorCobrar  = 0; 
  }
   

 
  onDatosDelGrafico2(){ 
    this.onLimpiarGraficos2();
    this.apiService.graficoLineal2(this.rangoBusqueda2.value.id).subscribe((resp) => {  
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
      this.DataTotalCobrado2.push(element.importeSoles.importeCobrado); 
      this.DatatotalPorCobrar2.push(element.importeSoles.importeSinCobrar); 
    }) 
    //* DATOS PARA EL GRAFICO */
    this.DataLineal2 = {
      labels: this.LabelGrafico2,
      datasets: [
        {
          label: this.DataGrafico2 ? 'Cobrado' : 'No se encontro data',
          data: this.DataTotalCobrado2,
          fill: false,
          borderColor: 'red',
          tension: 0,  
        },
        {
          label:  this.DataGrafico2 ? 'Por Cobrar' : 'No se encontro data',  
          data: this.DatatotalPorCobrar2,
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
    this.DataTotalCobrado2 = []; 
    this.DatatotalPorCobrar2  = []; 
  }
 


  onDatosDelGraficoBarrasHorizontal(){
    this.onLimpiarGraficos3();
    this.apiService.graficobarrasProductomasVendido(this.rangoBusqueda3.value.id).subscribe((resp) => {  
      if(resp){
        this.onArmarDataParaElGrafico3(resp); 
      }
    })
  }


  onArmarDataParaElGrafico3(data){ 
    let DataOrdenada3 =  data.sort(function (a, b) {
        if (a.index > b.index) return 1;
        if (a.index < b.index) return -1;
        return 0;
      }); 
    this.Grafico3.push(DataOrdenada3);
    DataOrdenada3.forEach(element => {
      this.LabelGrafico3.push(element.nombreProducto); 
      this.DataGrafico3.push(element.cantidad); 
      let newColor = this.onColorHEX();
      this.colorAleatorio.push(newColor)
    }) 
  
    this.DataLineal3 = {
      labels: this.LabelGrafico3,
      datasets: [
        {
            label: this.DataGrafico3 ? 'Producto más vendido' : 'No se encontro data',
            backgroundColor:  this.colorAleatorio,
            data: this.DataGrafico3
        }, 
    ]
    }
 
    this.horizontalOptions = {
      indexAxis: 'y',
      plugins: {
          legend: {
              labels: {
                  color: '#495057'
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          },
          y: {
              ticks: {
                  color: '#495057'
              },
              grid: {
                  color: '#ebedef'
              }
          }
      }
  };



  }

  onLimpiarGraficos3(){
    this.DataGrafico3 = [];
    this.LabelGrafico3 = [];
    this.colorAleatorio = [];
  }
  

  onDatosDelGraficoNoEnviadosaSunat(){ 
    this.apiService.graficoNoEnviadosASunat().subscribe((resp) => {  
      if(resp){
        this.DataEnviadosASunat = resp
      }
    })
    
  }

  /** COLORES ALEATORIOS */
  onGenerarLetra(){
    var letras = ["a","b","c","d","e","f","0","1","2","3","4","5","6","7","8","9"];
    var numero = (Math.random()*15).toFixed(0);
    return letras[numero];
  }
    
  onColorHEX(){
    var coolor = "";
    for(var i=0;i<6;i++){
      coolor = coolor + this.onGenerarLetra() ;
    }
    return "#" + coolor;
  }



}
