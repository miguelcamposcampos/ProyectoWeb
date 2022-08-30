 import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { PlanCuentaService } from '../service/plan-cuenta.service';
import { IPlantillaEXcelPlancuenta, ISubirPlanescuenta } from '../interface/plan-cuentas.interface';

@Component({
  selector: 'app-subir-plan-cuenta',
  templateUrl: './subir-plan-cuenta.component.html',
  styleUrls: ['./subir-plan-cuenta.component.scss']
})
export class SubirPlanCuentaComponent implements OnInit {


  @Output() cerrar : EventEmitter<boolean> = new EventEmitter<boolean>();
  cols: InterfaceColumnasGrilla[] = [];
  arrayplanescuenta : ISubirPlanescuenta[]=[];
  armarTabla : any[]=[];
  plantillaExcel : IPlantillaEXcelPlancuenta;
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  DataImportada : IPlantillaEXcelPlancuenta[] = [];
  data :any[]= [];
  mostrarBotonCargar : boolean = true;


  constructor(
    private apiService : PlanCuentaService,
    private swal : MensajesSwalService,
  ) { }

  ngOnInit(): void {

    this.cols = [
      { field: 'nroCuenta', header: 'Nro Cuenta', visibility: true },
      { field: 'nombreCuenta', header: 'Nombre Cuenta', visibility: true },
      { field: 'esImputable', header: 'Es Imputable', visibility: true },
      { field: 'tieneDetalle', header: 'Tiene Detalle', visibility: true },
      { field: 'moneda', header: 'Moneda', visibility: true },
      { field: 'tieneDestino', header: 'Tiene Destino', visibility: true },
      { field: 'naturaleza', header: 'Naturaleza', visibility: true },
    ]; 
  }

 

  onDescargarPlantilla(){
    this.apiService.plantillaexcel().subscribe((resp) => {
        if(resp){
          this.plantillaExcel = resp;
          var blob = new Blob([this.onBase64ToArrayBuffer(this.plantillaExcel.content)], {type: "application/xlsx"});
          saveAs(blob, "Plantilla Subir Planes Cuenta.xlsx");
        }
      });
  }

  onBase64ToArrayBuffer(base64) {
    const binary_string = window.atob(this.plantillaExcel.content);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }



  onUpload(event : any) {
    let data;
    const target: DataTransfer = <DataTransfer>(event);
    if (target.files){
      const reader: FileReader = new FileReader();
        reader.onload = (e: any) => {
          const bstr: string = e.target.result;
          const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
          const wsname: string = wb.SheetNames[0];
          const ws: XLSX.WorkSheet = wb.Sheets[wsname];

          data = XLSX.utils.sheet_to_json(ws);
          let arrayData = data;
          arrayData.forEach(element => { 
            console.log('element',element);
            this.mostrarBotonCargar = false;
            this.arrayplanescuenta.push({
              nroCuenta: element.CUENTA,
              nombreCuenta: element.DESCRIPCION,
              esImputable: element.ES_IMPUTABLE,
              tieneDetalle: element.TIENE_DETALLE,
              moneda: element.MONEDA,
              tieneDestino: element.TIENE_DESTINO,
              naturaleza: element.NATURALEZA
            })
          });
        };
         reader.readAsBinaryString(target.files[0]);
    }
  }


  onLimpiarTabla(){
    this.arrayplanescuenta = [];
    this.mostrarBotonCargar = true;
  }


  onGrabar(){ 
    this.apiService.savePlantilla(this.arrayplanescuenta).subscribe((resp) =>{
      if(resp){
        this.swal.mensajeExito('Se cargo la lista de planes correctamente!.');
        this.cerrar.emit(true)
      }
    });
  }



  onRegresar(){
    this.cerrar.emit(false);
  }



}
