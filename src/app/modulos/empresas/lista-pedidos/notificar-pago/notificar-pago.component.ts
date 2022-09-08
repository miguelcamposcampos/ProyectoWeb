import { Component, EventEmitter,OnInit, Output } from '@angular/core'; 
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { IPedidoPorEmpresa, IEnviarNotificarPago, IModalConfirmar } from '../../interface/empresa.interface';
import { PlanesService } from '../../services/planes.services';
@Component({
  selector: 'app-notificar-pago',
  templateUrl: './notificar-pago.component.html',
  styleUrls: ['./notificar-pago.component.scss']
})
export class NotificarPagoComponent implements OnInit {
 
  @Output() cerrar : any = new EventEmitter<boolean>();
  public PedidosSeleccionados :any[] = [];

  cols: InterfaceColumnasGrilla[] = []; 
  mostrarAdjuntar : boolean =false;
  mostrarEnviarNotificacion : boolean =false;

  modalEnviarNotificacion : boolean = false;

  listPedidos : IPedidoPorEmpresa[] = [];
  listPedido! : IPedidoPorEmpresa;
  
  Iconfirmar! : IModalConfirmar;
  ImgBase64 : string = "";

  guidDesencriptado : any;
  
  constructor(
    private swal : MensajesSwalService,
    private planesService : PlanesService,
    private authService : AuthService,
    private generalService : GeneralService,
    private spinner : NgxSpinnerService
  ) {  
    this.generalService._hideSpinner$.subscribe(x => {
      this.spinner.hide();
    })
  }

  ngOnInit(): void {
    let guidEmpresaLS = localStorage.getItem('guidEmpresa');
    this.guidDesencriptado = this.authService.desCifrarData(guidEmpresaLS) 
    this.onLoadPedidos();
    this.cols = [ 
      { field: 'plan', header: 'Plan', visibility: true  }, 
      { field: 'planServicio', header: 'Servicio', visibility: true}, 
      { field: 'importe', header: 'Importe', visibility: true},  
      { field: 'cantidad', header: 'Cantidad', visibility: true},   
    ];  
  }

  
  onLoadPedidos(){  
    this.spinner.show();
    this.planesService.pedidosporEmpresa(this.guidDesencriptado).subscribe((resp) => {
      if(resp){  
        resp.forEach(x => {         
            if( x.importe > 0){
            this.listPedidos.push(x)
          } 
        });
        this.spinner.hide();
      } 
    });
  }

  onSeleccionarTodosLosPedidos(event : any){ 
    if(event.checked){
      this.listPedidos.forEach(x => {
        this.PedidosSeleccionados.push(x.pedidoId)
      })
      this.mostrarAdjuntar = true; 
    }else{
      this.PedidosSeleccionados = [];
      this.mostrarAdjuntar = false; 
      this.mostrarEnviarNotificacion = false;
    }
  }

 
  onSeleccionarPedidos(event : any){   
    if(event){
      let pedidoId = event.data.pedidoId;
      if(!this.PedidosSeleccionados.includes(pedidoId)){ 
        this.PedidosSeleccionados.push(event.data.pedidoId)
      }  
      this.onVerificarCasillas();

    }
  }

  onQuitarSeleccionPedidos(event : any){   
    const pedidoId = this.PedidosSeleccionados.findIndex( x => x === event.data); 
    this.PedidosSeleccionados.splice( pedidoId, 1 ); 
    this.onVerificarCasillas();
  }

  onUpload(event : any) {    
    if(event){
    this.mostrarEnviarNotificacion = true;
      const file = event.files[0];
      if (file) {
        const reader = new FileReader(); 
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file); 
      }
    }
  }
 
  handleReaderLoaded(event : any) {
    this.ImgBase64 =   btoa(event.target.result);
    this.mostrarEnviarNotificacion = true;
  }  


  onEliminarArchivo(event :any): void{
    if(event){ 
      if(this.PedidosSeleccionados.length > 0){
        this.onVerificarCasillas();
      } 
      this.mostrarEnviarNotificacion = false; 
    } 
  }

 
  onModalEnviarNotificacion(){ 
    this.swal.mensajePregunta("¿Seguro que desea enviar la notificación de pago ?").then((response) => {
      if (response.isConfirmed) {
        const NewNotificar : IEnviarNotificarPago = {
          fotovoucherdeposito : this.ImgBase64,
          pedidoIds : this.PedidosSeleccionados
        } 
        this.planesService.notificarPagoConVaucher(NewNotificar).subscribe((resp) => {
          this.onLoadPedidos(); 
          this.swal.mensajeExito('Se envió la notificación correctamente');
        });
      }
    })  
  }
  
  onRegresar(){
    this.cerrar.emit(false)
  }
 
  onVerificarCasillas(){
    if(this.PedidosSeleccionados.length >= 1){
      this.mostrarAdjuntar = true;  
    }else{
      this.mostrarAdjuntar = false; 
      this.ImgBase64 = "";  
    }
  }

 





}
