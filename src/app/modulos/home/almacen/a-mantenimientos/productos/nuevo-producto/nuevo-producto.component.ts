import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
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
  @Output() cerrar : EventEmitter<boolean> = new EventEmitter<boolean>();
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
 
  estadoForm : string ="";
  arrayPreciosaEditar: IPreciosProducto[] = [];  
  dataProductoEditar : IUpdateProducto;  

  constructor(
    public generalService : GeneralService,
    private productoService : ProductosService,
    private fb : FormBuilder,
    private swal : MensajesSwalService, 
    private cdr: ChangeDetectorRef,
    private spinner : NgxSpinnerService
  ) { 
    this.builform();
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
     
  }

  public builform(): void {
    this.Form =  this.fb.group({ 
      codigoParaBuscarUnesco: new FormControl(null),
      codigoproducto: new FormControl(null, Validators.required),
      proveedor: new FormControl(null), 
      codigounesco: new FormControl(null),   
      idlinea: new FormControl(null),   
      idcolor: new FormControl(null),
      // idMaterial: new FormControl(null),   
      // idTemporada: new FormControl(null),
      // idColeccion: new FormControl(null),   
      // idUnidadMedida: new FormControl(null),
      idtipoProducto: new FormControl(null, Validators.required), 
      esServiciooArticulo: new FormControl('articulo'),   
      descripcion: new FormControl(null, Validators.required),   
      unidadMedida: new FormControl(null, Validators.required),   
      modelo: new FormControl(null),   
      activo: new FormControl(true),   
      incluirProveedorEnDescripcion: new FormControl(false),   
      requiereLote: new FormControl(false),   
      requiereSerie: new FormControl(false),   
      usadoCompras: new FormControl(true),   
      usadoVentas: new FormControl(true),   
      descripcionEditable: new FormControl(false),   
      afectoICBPER: new FormControl(false),  
      afectacionid: new FormControl(false),
      arrayPrecios: this.fb.array([])
    });
  }

  ngOnInit(): void { 
    this.onCargarDropDown();   
    if(this.idProductoEdit){
      this.spinner.show();
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
    this.spinner.show();
    this.productoService.listadoUnesco(this.stringBuscarenUnesco).subscribe((resp)=>{ 
      if(resp.Data.length > 0){ 
        this.mostrarcomboUnesco = true;
        this.arrayUnescoData = resp.Data
      }else{
        this.swal.mensajeInformacion('No se encontraron registros, intenta con otro producto');
        this.stringBuscarenUnesco = "";
      }
      this.spinner.hide();
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
      cantidadparaaplicar : new  FormControl(0),
      cantidadunidadmedida : new FormControl(0), 
      maxprocentajedscto: new FormControl(0),  
      monedaid: new FormControl(null),
      precioincluyeigv: new FormControl(false),   
      precioventa: new FormControl(null),   
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
        this.estadoForm = 'editar'
        this.codigoProductoUnesco = this.dataProductoEditar.codigounesco
        this.Form.patchValue({
          codigounesco :  this.dataProductoEditar.codigounesco,
          codigoproducto: this.dataProductoEditar.codigoproducto,
          proveedor: this.dataProductoEditar.codproveedor,  
          idlinea: this.arrayLinea.find(
            (x) => x.id === this.dataProductoEditar.lineaid ?? 0
          ),
          idcolor: this.arrayColores.find(
            (x) => x.id === this.dataProductoEditar.colorid ?? 0
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
        this.spinner.hide();
      }
 
    });
 }
 
 onPintarFormArray(){ 
    /* PINTAMOS EL ARRAY DE PRECIOS */
    for( let  i = 0; i < this.dataProductoEditar.precios.length; i++){ 
      if(this.estadoForm === 'editar'){
        this.onAgregarNuevoPrecio();
      }
      this.preciosForm[i].patchValue({
        cantidadparaaplicar : this.dataProductoEditar.precios[i].cantidadparaaplicar,
        cantidadunidadmedida: this.dataProductoEditar.precios[i].cantidadunidadmedidaid,
        maxprocentajedscto: this.dataProductoEditar.precios[i].maxporcentajedscto, 
        monedaid: this.arrayMonedas.find(
          (x) => x.id ===  this.dataProductoEditar.precios[i].monedaid
        ), 
        precioincluyeigv : this.dataProductoEditar.precios[i].precioincluyeigv,
        precioventa : +this.dataProductoEditar.precios[i].precioventa,
        productoid : this.dataProductoEditar.precios[i].productoid,
        productopreciosid : this.dataProductoEditar.precios[i].productopreciosid,
        tienecondicionacantidad :  this.dataProductoEditar.precios[i].tienecondicioncantidad 
      });
      
    }
 }


  onAdd(){
    const dataForm = this.Form.value; 
    let esarticulo : boolean = dataForm.esServiciooArticulo === "articulo" ? true :  false;
    let esServicio : boolean = dataForm.esServiciooArticulo === "servicio" ? true :  false;
    let esBolsaPlastica : boolean = dataForm.unidadMedida.id === 2 ? true : false;
  
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
          precioventa : +element.value.precioventa,
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
      colorid: dataForm.idcolor ? dataForm.idcolor.id : null,
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
          this.swal.mensajeExito('Se grabaron los datos correctamente!.'); 
          this.cerrar.emit(true)
        }
      });
    }else{
      this.productoService.updateProducto(newProducto).subscribe((resp) =>{
        if(resp){
          this.swal.mensajeExito('Se actualizaron los datos correctamente!.'); 
          this.cerrar.emit(true)
        }
      });
    }
    
  }
 
  onRegresar(){
    this.cerrar.emit(false)
  }

  
 
}




 