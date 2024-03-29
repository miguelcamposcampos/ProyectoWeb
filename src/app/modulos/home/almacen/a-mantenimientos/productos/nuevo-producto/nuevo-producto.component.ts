import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { ICombo, Unesco } from 'src/app/shared/interfaces/generales.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICreateProducto, IPreciosProducto, IUpdateProducto } from '../interface/producto.interface';
import { ProductosService } from '../service/productos.service';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.scss']
})
export class NuevoProductoComponent implements OnInit {
  
  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  @Input() idProductoEdit : number;
  @Output() cerrar : EventEmitter<any> = new EventEmitter<any>();
  tituloVistaNuevoProdcuto : string = "NUEVO PRODUCTO";

  CheckIncluyeIgv : boolean = false;
  CheckCondicionCantidad : boolean = false;
    
  mostrarcomboUnesco: boolean = false;
  esServicio : string;  

  Form : FormGroup;  
  numerotablas : number = 0; 

  arrayColores : ICombo[];
  arrayLinea : ICombo[];
  arrayTipoProducto : ICombo[];
  arrayUnidadMedida: ICombo[];
  arrayMonedas : ICombo[];
  arrayAfectaciones : ICombo[];   
  arrayUnescoData: Unesco[];

  stringBuscarenUnesco : string  ="";
  codigoProductoUnesco : string ="";
 
 
  arrayPreciosaEditar: IPreciosProducto[] = [];  
  dataProductoEditar : IUpdateProducto;  

  constructor(
    private generalService : GeneralService,
    private productoService : ProductosService,
    private fb : FormBuilder,
    private swal : MensajesSwalService, 
    private cdr: ChangeDetectorRef
  ) { 
    this.builform();
     
  }

  public builform(): void {
    this.Form =  this.fb.group({ 
      codigoParaBuscarUnesco: new FormControl(null, Validators.required),
      codigoproducto: new FormControl(null, Validators.required),
      proveedor: new FormControl(null, Validators.required), 
      codigounesco: new FormControl(null),   
      idlinea: new FormControl(null),   
      idcolor: new FormControl(null),
      // idMaterial: new FormControl(null),   
      // idTemporada: new FormControl(null),
      // idColeccion: new FormControl(null),   
      // idUnidadMedida: new FormControl(null),
      idtipoProducto: new FormControl(null, Validators.required), 
      esServiciooArticulo: new FormControl('articulo', Validators.required),   
      descripcion: new FormControl(null, Validators.required),   
      unidadMedida: new FormControl(null, Validators.required),   
      modelo: new FormControl(null),   
      activo: new FormControl(true, Validators.required),   
      incluirProveedorEnDescripcion: new FormControl(false, Validators.required),   
      requiereLote: new FormControl(false, Validators.required),   
      requiereSerie: new FormControl(false, Validators.required),   
      usadoCompras: new FormControl(true),   
      usadoVentas: new FormControl(true),   
      descripcionEditable: new FormControl(false, Validators.required),   
      afectoICBPER: new FormControl(false, Validators.required),  
      afectacionid: new FormControl(false, Validators.required),
      arrayPrecios: this.fb.array([])
    });
  }

  ngOnInit(): void { 
    this.onCargarDropDown();   
    if(this.idProductoEdit){
      this.swal.mensajePreloader(true);
      this.Avisar();
      this.tituloVistaNuevoProdcuto = "EDITAR PRODUCTO";
    }  
  }


  onCargarDropDown(){ 
    const obsDatos = forkJoin( 
      this.generalService.listadoColores(), 
      this.generalService.listadoLineas(),  
      this.generalService.listadoPorGrupo('TipoProducto'),
      this.generalService.listadoUnidadMedida(),
      this.generalService.listadoPorGrupo('Monedas'),
      this.generalService.listadoPorGrupo('AfectacionesIGV')
    );
    obsDatos.subscribe((response) => {
      this.arrayColores = response[0];
      this.arrayLinea = response[1];  
      this.arrayTipoProducto = response[2];
      this.arrayUnidadMedida = response[3];  
      this.arrayMonedas = response[4];   
      this.arrayAfectaciones = response[5];   
      this.FlgLlenaronCombo.next(true);
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
 
  } 

  //Avisa que ya se cargaron los dropdown
  Avisar() {
    this.FlgLlenaronCombo.subscribe((x) => { 
      this.onObtenerDataProducto(); 
    });
  }
 
 
  onBuscarUnesco(){ 
    this.stringBuscarenUnesco = this.Form.controls['codigoParaBuscarUnesco'].value;
    this.swal.mensajePreloader(true);
    this.productoService.listadoUnesco(this.stringBuscarenUnesco).subscribe((resp)=>{ 
      if(resp.Data.length > 0){ 
        this.mostrarcomboUnesco = true;
        this.arrayUnescoData = resp.Data
      }else{
        this.swal.mensajeInformacion('No se encontraron registros, intenta con otro producto');
        this.stringBuscarenUnesco = "";
      }
      this.swal.mensajePreloader(false);
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  }

  onSeleccionoProductoUnesco(event : any){   
    if(event){
      this.codigoProductoUnesco = event.value.Code + ' - ' +   event.value.DescriptionES
      this.Form.controls['codigounesco'].setValue(event.value.Code);
    }else{
      this.codigoProductoUnesco = ""; 
      this.Form.controls['codigounesco'].setValue(null);
    } 
  }
  
  get fa() { return this.Form.get('arrayPrecios') as FormArray; } 
  get preciosForm() { return this.fa.controls as FormGroup[]; }

  onAgregarNuevoPrecio(){    
    this.preciosForm.push(this.inciarFormNuevoPrecio());     
  }

  inciarFormNuevoPrecio(){
    return this.fb.group({ 
      cantidadparaaplicar : new  FormControl(0, Validators.required),
      cantidadunidadmedida : new FormControl(0, Validators.required), 
      maxprocentajedscto: new FormControl(0),  
      monedaid: new FormControl(null, Validators.required),
      precioincluyeigv: new FormControl(false),   
      precioventa: new FormControl(null, Validators.required),   
      productoid: new FormControl(0),  
      productopreciosid: new FormControl(0),
      tienecondicionacantidad: new FormControl(false),
    });
  }

  onEliminarPrecio(index : any, idPrecioArray: any){    
    if(idPrecioArray === 0){  
      this.fa.removeAt(index); 
      this.cdr.detectChanges(); 
    }else if(idPrecioArray != 0){
      this.swal.mensajePregunta("¿Seguro que desea eliminar el precio.?").then((response) => {
        if (response.isConfirmed) {
          this.productoService.deletePrecio(idPrecioArray).subscribe((resp) => {
            this.fa.removeAt(index); 
            this.swal.mensajeExito('El precio ha sido eliminado correctamente!.'); 
          },error => { 
            this.generalService.onValidarOtraSesion(error);
          });
        }
      })  
    } 
    this.cdr.detectChanges();
  }

  
 
 
 onObtenerDataProducto(){ 
    this.productoService.productoPorId(this.idProductoEdit).subscribe((resp)=> { 
      if(resp){   
        this.dataProductoEditar = resp;    
        this.codigoProductoUnesco = this.dataProductoEditar.codigounesco
        this.Form.patchValue({
          codigounesco :  this.dataProductoEditar.codigounesco,
          codigoproducto: this.dataProductoEditar.codigoproducto,
          proveedor: this.dataProductoEditar.codproveedor,  
          idlinea: this.arrayLinea.find(
            (x) => x.id === this.dataProductoEditar.lineaid
          ),
          idcolor: this.arrayColores.find(
            (x) => x.id === this.dataProductoEditar.colorid
          ),
          idtipoProducto: this.arrayTipoProducto.find(
            (x) => x.id === this.dataProductoEditar.tipoproducto
          ), 
          esServiciooArticulo: this.dataProductoEditar.esarticulo === true ? 'articulo' : 'servicio',
          descripcion: this.dataProductoEditar.descripcion,
          unidadMedida: this.arrayUnidadMedida.find(
            (x) => x.id === this.dataProductoEditar.unidadmedidaid
          ),
          modelo: this.dataProductoEditar.modelo,
          activo: this.dataProductoEditar.activo,
          incluirProveedorEnDescripcion: this.dataProductoEditar.unircodproveedordescripcion,
          requiereLote: this.dataProductoEditar.requierelote,
          requiereSerie: this.dataProductoEditar.requiereserie,
          usadoCompras: this.dataProductoEditar.usadoencompras,
          usadoVentas: this.dataProductoEditar.usadoenventas,
          descripcionEditable:this.dataProductoEditar.descripcioneditable,
          afectoICBPER:this.dataProductoEditar.afectodetraccion,
          afectacionid: this.arrayAfectaciones.find(
            (x) => x.id === this.dataProductoEditar.tipoafectacionid
          ) 
        }); 
      
        this.onPintarFormArray();
        this.swal.mensajePreloader(false);
      }
 
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
 }
 
 onPintarFormArray(){ 
    /* PINTAMOS EL ARRAY DE PRECIOS */
    for( let  i = 0; i < this.dataProductoEditar.precios.length; i++){ 
     this.onAgregarNuevoPrecio();
      this.preciosForm[i].patchValue({
        cantidadparaaplicar : this.dataProductoEditar.precios[i].cantidadparaaplicar,
        cantidadunidadmedida: this.dataProductoEditar.precios[i].cantidadunidadmedidaid,
        maxprocentajedscto: this.dataProductoEditar.precios[i].maxporcentajedscto, 
        monedaid: this.arrayMonedas.find(
          (x) => x.id ===  this.dataProductoEditar.precios[i].monedaid
        ), 
        precioincluyeigv : this.dataProductoEditar.precios[i].precioincluyeigv,
        precioventa : this.dataProductoEditar.precios[i].precioventa,
        productoid : this.dataProductoEditar.precios[i].productoid,
        productopreciosid : this.dataProductoEditar.precios[i].productopreciosid,
        tienecondicionacantidad :  this.dataProductoEditar.precios[i].tienecondicioncantidad 
      });
      
    }
 }


  onGrabarProducto(){
    const dataForm = this.Form.value;

    let esarticulo : boolean;
    let esServicio : boolean;
    let esBolsaPlastica : boolean = false;

    if(dataForm.unidadMedida.id === 2){
      esBolsaPlastica = true;
    }
 
    if(dataForm.esServiciooArticulo === "articulo"){ 
      esarticulo = true;
      esServicio =  false; 
    }else if(dataForm.esServiciooArticulo === "servicio"){
      esServicio =  true; 
      esarticulo = false;
    }else{
      esarticulo = false;
      esServicio =  false; 
    }
    
      this.preciosForm.forEach(element => {     
        if(!element.value.monedaid){
          this.swal.mensajeInformacion('Aquellos registros vacios no se insertaran en al registro.');
          return;
        }  
        this.arrayPreciosaEditar.push({
          cantidadparaaplicar : element.value.cantidadparaaplicar,
          cantidadunidadmedidaid: element.value.cantidadunidadmedida,
          maxporcentajedscto: element.value.maxprocentajedscto,
          monedaid : element.value.monedaid.id,
          precioincluyeigv : element.value.precioincluyeigv,
          precioventa : element.value.precioventa,
          productoid : this.dataProductoEditar ?  element.value.productoid : 0,
          productopreciosid:  this.dataProductoEditar ? element.value.productopreciosid : 0,
          tienecondicioncantidad :  element.value.tienecondicionacantidad
        });   
      });
  

    const newProducto : ICreateProducto = {
      activo : dataForm.activo,
      afectodetraccion : dataForm.afectoICBPER,
      codigoproducto : dataForm.codigoproducto,
      codigounesco :  dataForm.codigounesco,
      codproveedor : dataForm.proveedor,
      colorid: dataForm.idcolor.id,
      descripcion : dataForm.descripcion,
      descripcioneditable : dataForm.descripcionEditable,
      esarticulo : esarticulo,
      escombo : false,
      esservicio : esServicio,
      lineaid : dataForm.idlinea.id,
      modelo : dataForm.modelo, 
      precios :    this.arrayPreciosaEditar ,
      requierelote : dataForm.requiereLote,
      requiereserie: dataForm.requiereSerie,
      tipoafectacionid: dataForm.afectacionid.id,
      tipoproducto : dataForm.idtipoProducto.id,
      unidadmedidaid: dataForm.unidadMedida.id,
      usadoencompras: dataForm.usadoCompras,
      usadoenventas: dataForm.usadoVentas,
      unircodproveedordescripcion : dataForm.incluirProveedorEnDescripcion,
      esbolsaplastica : esBolsaPlastica, 
      productoid : this.dataProductoEditar ? this.dataProductoEditar.productoid : 0,
    } 
    if(!this.dataProductoEditar){
      this.productoService.crearProducto(newProducto).subscribe((resp) =>{
        if(resp){
          this.onVolver();
        }
        this.swal.mensajeExito('Se grabaron los datos correctamente!.'); 
      },error => { 
        this.generalService.onValidarOtraSesion(error);
      });
    }else{
      this.productoService.updateProducto(newProducto).subscribe((resp) =>{
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




 