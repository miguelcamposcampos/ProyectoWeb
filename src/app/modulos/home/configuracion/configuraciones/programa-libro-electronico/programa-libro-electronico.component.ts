import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConstantesGenerales } from 'src/app/shared/interfaces/shared.interfaces';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ConfiguracionService } from '../service/configuracion.service';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';   
import { IModuloReporte } from '../../../almacen/a-mantenimientos/productos/interface/producto.interface';
import { GeneralService } from 'src/app/shared/services/generales.services';


@Component({
  selector: 'app-programa-libro-electronico',
  templateUrl: './programa-libro-electronico.component.html',
  styleUrls: ['./programa-libro-electronico.component.scss']
})
export class ProgramaLibroElectronicoComponent implements OnInit {

  Form: FormGroup;
  arrayMeses : any[] = ConstantesGenerales.arrayMeses;
  arrayTipoArchivo : any[] = [
    { id: 'PLEVentas', nombre:'VENTAS' },
    { id: 'PLECompras', nombre:'COMPRAS' }
  ] 
  mostrarEnviarNotificacion : boolean =false;
  
  fechaActual = new Date(); 
  ImgBase64 : string = "";
  plantillaExcel : IModuloReporte


  constructor(
    private configService : ConfiguracionService,
    private swal : MensajesSwalService,
    private generalService : GeneralService
  ) {
    this.builform();
   }

   public builform(): void {
    this.Form = new FormGroup({
      periodo: new FormControl(this.fechaActual.getFullYear(), Validators.required),
      mes: new FormControl(null, Validators.required),  
      tipoArchivo: new FormControl(null, Validators.required),  
      rutasalida : new FormControl(null, Validators.required),  
    });
  }


  ngOnInit(): void { 
  }
 
  onGrabar(){ 
    const dataform = this.Form.value
    const data = {
      type : 'PLEVentas',
      tipoPresentacion : 'PlainText',
      year : dataform.periodo,
      month : dataform.mes.mes
    }
    this.configService.generarArchivoPLE(data).subscribe((resp)=> {
      if(resp){
        this.swal.mensajeExito('Se grabaron los datos correctamente');
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);  
    });
  }

  onDescargar(){
    const dataForm = this.Form.value
    const tipoPlantilla = {
      pletype : dataForm.tipoArchivo.id,
      tipoPresentacion: 'PlainText',
      year : this.fechaActual.getFullYear(),
      month : dataForm.mes.mes
    }
   
    this.configService.generarArchivoPLE(tipoPlantilla).subscribe((resp) => {
      if(resp){ 
        this.plantillaExcel = resp;
        var blob = new Blob([this.onBase64ToArrayBuffer(this.plantillaExcel.fileContent)], {type: "application/xlsx"}); 
        saveAs(blob, "AchivoPLE.txt");
      }
    }, error => { 
      this.generalService.onValidarOtraSesion(error);  
    })
  }

  onBase64ToArrayBuffer(base64) {
    const binary_string = window.atob(this.plantillaExcel.fileContent);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    } 
    return bytes.buffer;
  }



}
