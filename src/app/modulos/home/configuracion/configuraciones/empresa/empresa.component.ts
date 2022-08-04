import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { forkJoin, Subject } from 'rxjs';
import { ICombo } from 'src/app/shared/interfaces/generales.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IConfiguracionEmpresa } from '../interface/configuracion.interface';
import { ConfiguracionService } from '../service/configuracion.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html'
})
export class EmpresaComponent implements OnInit {

  public FlgLlenaronCombo: Subject<boolean> = new Subject<boolean>();
  titulo : string = "VENTAS";
  Form: FormGroup;
  datosVentas : boolean = true;
  datosCompras : boolean = false; 
  datosIntegracion : boolean = false;
  datosEmpresa : boolean = false; 
  dataConfiguracion : IConfiguracionEmpresa;

  items: MenuItem[];
  activeItem: MenuItem;

  arrayMonedasVenta : ICombo[];
  arrayCondicionPagoVenta : ICombo[];
  arrayMonedasCompra : ICombo[];
  arrayCondicionPagoCompra : ICombo[];
  arrayTipoOperacion : ICombo[];
  arrayRegimenEmpresa: ICombo[];
  arrayConceptos : ICombo[];

  constructor(
    private configService: ConfiguracionService,
    private generalService : GeneralService,
    private swal :  MensajesSwalService
    ) { 
      this.builform();
    }
  
  public builform(): void{
    this.Form = new FormGroup({
      ventamonedadefaultid: new FormControl(null, Validators.required),
      ventacondicionpagodefaultid : new FormControl(null,Validators.required),
      ventatipooperaciondefault: new FormControl(null),
      ventaglosadefault : new FormControl(null, Validators.required),
      conceptocontabledefaultid : new FormControl(null, Validators.required), 
      porcentajebolsaplastica : new FormControl(null),
      compramonedadefault: new FormControl(null, Validators.required),
      compracondicionpagodefault : new FormControl(null, Validators.required),
      compraglosadefault : new FormControl(null, Validators.required),
      tokenintegracion: new FormControl(null),
      rucempresa : new FormControl(null, Validators.required),
      regimenempresarialid : new FormControl(null)
    })
  }


  ngOnInit(): void {
    this.onCargarDropdown(); 
    this.Avisar();
    this.onTabsForm();
  }


  onCargarDropdown(){
    const obsDatos = forkJoin(  
      this.generalService.listadoPorGrupo('Monedas'), 
      this.generalService.listadoPorGrupo('Monedas'),  
      this.generalService.listadoCondicionPagoParaCombo(),
      this.generalService.listadoCondicionPagoParaCombo(),
      this.generalService.listadoPorGrupo('TipoOperacionVenta'),
      this.generalService.listadoPorGrupo('RegimenesEmpresariales'),
      this.generalService.onComboConceptos('Venta'),

    );
    obsDatos.subscribe((response) => {
      this.arrayMonedasVenta = response[0];
      this.arrayMonedasCompra = response[1];  
      this.arrayCondicionPagoVenta = response[2]; 
      this.arrayCondicionPagoCompra = response[3];
      this.arrayTipoOperacion = response[4];  
      this.arrayRegimenEmpresa = response[5];  
      this.arrayConceptos = response[6];  
      this.FlgLlenaronCombo.next(true); 
    }); 
  }

  Avisar(){
    this.FlgLlenaronCombo.subscribe((x) => { 
      this.onCargarValores(); 
    })
  }


  onTabsForm(){
    this.items = [
      {
        id: '1',
        label: 'VENTAS', 
        icon: 'pi fa-cart-arrow-up', 
        command: event => {
          this.activateMenu(event);
        }
      },
      {
        id: '2',
        label: 'COMPRAS', 
        icon: 'fas fa-cart-arrow-down',  
        command: event => {
          this.activateMenu(event);
        }
      },
      {
        id: '3',
        label: 'INTEGRACION', 
        icon: 'fas fa-rotate', 
        command: event => {
          this.activateMenu(event);
        }
      },
      {
        id: '4',
        label: 'EMPRESA', 
        icon: 'fas fa-city', 
        command: event => {
          this.activateMenu(event);
        }
      }
    ]; 
    this.activeItem = this.items[0];
  }
  
  activateMenu(event) {
    this.datosVentas = false;
    this.datosCompras = false; 
    this.datosIntegracion = false;
    this.datosEmpresa = false; 
  
    this.titulo = event.item.label;

    if(event.item.id ===  "2" ){ 
       this.datosCompras = true;
    }else if(event.item.id ===  "3" ){ 
      this.datosIntegracion = true;
    }else if(event.item.id ===  "4" ){ 
      this.datosEmpresa = true;
    }else{ 
      this.datosVentas = true;
    } 
  

  }

  onCargarValores(){
    this.configService.listadoConfiguraciones().subscribe((resp) => {
      if(resp){
        this.dataConfiguracion = resp 
        let TipoOperacionEditar  = this.arrayTipoOperacion.filter((x) => x.valor2 === this.dataConfiguracion.ventatipooperaciondefault)
         
        this.Form.patchValue({ 
          ventamonedadefaultid: this.arrayMonedasVenta.find(
            (x) => x.id === this.dataConfiguracion.ventamonedadefaultid
          ),   
          ventacondicionpagodefaultid: this.arrayCondicionPagoVenta.find(
            (x) => x.id === this.dataConfiguracion.ventacondicionpagodefaultid
          ), 
          ventatipooperaciondefault: this.arrayTipoOperacion.find(
            (x) => x.id === TipoOperacionEditar[0].id
          ),
          conceptocontabledefaultid: this.arrayConceptos.find(
            (x) => x.id === this.dataConfiguracion.conceptocontabledefaultid
          ),
         
          ventaglosadefault :this.dataConfiguracion.ventaglosadefault,
          porcentajebolsaplastica :this.dataConfiguracion.porcentajebolsaplastica,

          compramonedadefault: this.arrayMonedasVenta.find(
            (x) => x.id === this.dataConfiguracion.compramonedadefault
          ),   
          compracondicionpagodefault: this.arrayCondicionPagoVenta.find(
            (x) => x.id === this.dataConfiguracion.compracondicionpagodefault
          ), 
          compraglosadefault :this.dataConfiguracion.compraglosadefault,
          tokenintegracion:this.dataConfiguracion.tokenintegracion,
          rucempresa :this.dataConfiguracion.rucempresa, 
          regimenempresarialid: this.arrayRegimenEmpresa.find(
            (x) => x.id === this.dataConfiguracion.regimenempresarialid
          ), 
        })
      }
    });
  }

  onGrabar(){ 
    const dataform = this.Form.value 
    const newConfiguracion : IConfiguracionEmpresa = {
      configuracionempresaid: this.dataConfiguracion ? this.dataConfiguracion.configuracionempresaid : 0,
      ventamonedadefaultid: dataform.ventamonedadefaultid.id,
      ventacondicionpagodefaultid:  dataform.ventacondicionpagodefaultid.id,
      conceptocontabledefaultid:  dataform.conceptocontabledefaultid.id,
      inicializada: this.dataConfiguracion ? this.dataConfiguracion.inicializada : false,
      ventatipooperaciondefault: dataform.ventatipooperaciondefault.valor2,
      compramonedadefault:  dataform.compramonedadefault.id,
      compracondicionpagodefault: dataform.compracondicionpagodefault.id,
      ventaglosadefault: dataform.ventaglosadefault,
      compraglosadefault: dataform.compraglosadefault,
      porcentajebolsaplastica: dataform.porcentajebolsaplastica,
      tokenintegracion: dataform.tokenintegracion,
      rucempresa: dataform.rucempresa,
      cuentadetraccion: this.dataConfiguracion ? this.dataConfiguracion.cuentadetraccion : 0,
      textoinformativodetraccion: this.dataConfiguracion ? this.dataConfiguracion.textoinformativodetraccion : '',
      regimenempresarialid: dataform.regimenempresarialid.id,
    }
    this.configService.createConfiguracion(newConfiguracion).subscribe((resp) => { 
      if(!this.dataConfiguracion){
        this.onCargarValores();
        this.swal.mensajeExito('Se actualizaron los datos correctamente!.');
      }else{
        this.onCargarValores();
        this.swal.mensajeExito('Se grabaron los datos correctamente!.');
      } 
      this.onCargarDropdown();
    });
  }

  

}
