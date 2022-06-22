import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IListadoStock} from './interface/consultastock.interface';
import { ConsultaStockService } from './service/consultastock.service';

@Component({
  selector: 'app-consulta-stock',
  templateUrl: './consulta-stock.component.html'
})
export class ConsultaStockComponent implements OnInit {

  cols : InterfaceColumnasGrilla[] =[]; 
  listaStock : IListadoStock[] = []; 
  listaStockColumnasdinamicas : any;
  criterioBusqueda = new FormControl("")
  arrayAlmacenes : any[]=[];
  fechaActual = new Date();
  periodo = this.fechaActual.getFullYear();
  listaStockPivot : any[]=[]; 
  columnas: any[] =  ['CodProducto','Descripcion','Marca','Modelo','Color' ];

  constructor(
    private consultastockService: ConsultaStockService,
    private generalService : GeneralService,
    private swal : MensajesSwalService,
    private spinner : NgxSpinnerService
  ) {
    this.onCargarComboEstablecimiento();
   }

  ngOnInit(): void { 
    this.cols = [
      { field : 'codProducto', header : 'Cod Producto', visibility : true},
      { field : 'nombreProducto', header : 'Nombre Producto', visibility : true},
      { field : 'marca', header : 'marca', visibility : true},
      { field : 'modelo', header : 'Modelo', visibility : true},
      { field : 'color', header : 'Color', visibility : true} 
    ]
  }

  /* OBTENEMOS LOS ALMACENES  llenamos el arrayAlmacenes y lo pasamos como parametro a la busqueda */
  onCargarComboEstablecimiento(){
    this.generalService.listadoAlmacenes().subscribe((resp) => { 
      if(resp){
        resp.forEach(x =>
          this.arrayAlmacenes.push(x.id)
        );
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  onBuscarStock(){
    if(!this.criterioBusqueda.value){
      this.swal.mensajePregunta("¿Desea hacer la busqueda de stock sin filtro?, esto podria tomar un tiempo!.").then((response) => {
        if(response.isConfirmed) {
          this.criterioBusqueda.setValue('');
          this.onLoadStock();
        }else{
         return;
        }
      })
    }else{
      this.onLoadStock();
    }
  }

  onLoadStock(){
    const data = {
      periodo : this.periodo,
      criteriodescripcion : this.criterioBusqueda.value,
      arrayAlmacenes : this.arrayAlmacenes,
      soloservicios: false
    }
    
    this.spinner.show();
    this.consultastockService.listadoStock(data).subscribe((resp)=> { 
      if(resp){
        // this.listaStock = resp; 
        // this.columnas = ['CodProducto','Descripcion','Marca','Modelo','Color' ] 
        // let col = [...new Set(this.listaStock.map((element) => element.almacen))];
        //   for(let i = 0; i < col.length; i++){ 
          //     this.columnas.push(col[i])  
          //   } 
          //this.listaStockPivot =  this.PivotearData(this.listaStock);   
          this.listaStockPivot =  this.PivotearData(resp);  
          this.spinner.hide();
        } 
    },error => { 
      this.spinner.hide();
      this.generalService.onValidarOtraSesion(error);  
    });
  }


  PivotearData(data){
      let uniqueKeys = [];
      let pivotedData = []; 
      //Identificamos la columnas que se repite y formamos un array con valores unicos
      for(let i = 0; i < data.length; i++){
          if(!uniqueKeys.includes(data[i].codProducto)){
            uniqueKeys.push(data[i].codProducto);
          }
      } 
       // recorremos los valores unicos y el array original para hacerlos coincidir y armar el pivot
      for(let i = 0; i < uniqueKeys.length; i++){
      let pivotedObj = {};

        for(let j = 0; j < data.length; j++){
            if(data[j].codProducto === uniqueKeys[i]){  
                  pivotedObj['codProducto'] = data[j].codProducto;  
                  pivotedObj['nombreProducto'] = data[j].nombreProducto; 
                  pivotedObj['marca'] = data[j].marca;  
                  pivotedObj['modelo'] = data[j].modelo; 
                  pivotedObj['color'] = data[j].color;
                  //recorremos la columnas fijas y si no existen se agregaran como columnas 
                  this.columnas.forEach(x => {   
                      if(x != data[j].almacen){
                        pivotedObj[data[j].almacen] = data[j].stockFinal;    
                        if(data[j].stockFinal != 0 || pivotedObj[data[j].almacen] != 0 ){
                          if(!this.columnas.includes(data[j].almacen)){
                            this.columnas.push(data[j].almacen)  
                          }
                        }
                    } 
                  }) 
            } 
          } 
            //validamos la variable COLS que vamos a pintar en el html, y validamos que si no existe lo agrege
            let ExisteAlm = this.cols.find(t => t.header === data[i].almacen && data[i].almacen != 0 )
            if(!ExisteAlm){
              this.cols.push(
                { field : data[i].almacen, header : data[i].almacen, visibility : true} 
              )
            } 

        pivotedData.push(pivotedObj);  
      }

      return pivotedData
  }



}


