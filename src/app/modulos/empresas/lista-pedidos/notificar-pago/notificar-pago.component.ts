import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'; 
import { forkJoin, Subject } from 'rxjs';
import { IAuth } from 'src/app/auth/interface/auth.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { DataEmpresa, IPedidoPorEmpresa, IEnviarNotificarPago, IModalConfirmar } from '../../interface/empresa.interface';
import { PlanesService } from '../../services/planes.services';
@Component({
  selector: 'app-notificar-pago',
  templateUrl: './notificar-pago.component.html',
  styleUrls: ['./notificar-pago.component.scss']
})
export class NotificarPagoComponent implements OnInit {
 
  @Output() cerrar : any = new EventEmitter<boolean>();
  @Input() tokenLS: any; 
  public FlgRetornaNuevoToken: Subject<boolean> = new Subject<boolean>();
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
  ) {  
      
  }

  ngOnInit(): void {
    let guidEmpresaLS = localStorage.getItem('guidEmpresa');
    this.guidDesencriptado = this.authService.desCifrarData(guidEmpresaLS) 
    
    if(!this.tokenLS){
      return;
    }else{
     
    //  localStorage.setItem('guidEmpresa', gruiEncryptado )
     // localStorage.setItem('guidEmpresa', this.empresasSelect.empresaGuid);   
    }  


    this.cols = [ 
      { field: 'plan', header: 'Plan', visibility: true  }, 
      { field: 'planServicio', header: 'Servicio', visibility: true}, 
      { field: 'importe', header: 'Importe', visibility: true},  
      { field: 'cantidad', header: 'Cantidad', visibility: true},   
    ];
   // this.onGenerarNuevoToken();
   // this.Avisar();  
  }

  
  onLoadPedidos(){  
    this.planesService.pedidosporEmpresa(this.guidDesencriptado).subscribe((resp) => {
      if(resp){ 
        this.swal.mensajePreloader(false);
        resp.forEach(x => {         
            if( x.importe > 0){
            this.listPedidos.push(x)
          } 
        })  
      } 
    },error => {
      this.generalService.onValidarOtraSesion(error);
   })
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
  }  


  onEliminarArchivo(event :any): void{
    if(event){ 
      if(this.PedidosSeleccionados.length > 0){
        this.mostrarEnviarNotificacion = false; 
      }else{
        this.mostrarEnviarNotificacion = false; 
        this.ImgBase64 = ""; 
        this.mostrarAdjuntar = false; 
      }
    } 
  }

 
  onModalEliminar(){ 
    this.swal.mensajePregunta("¿Seguro que desea enviar la notificación de pago ?").then((response) => {
      if (response.isConfirmed) {
        const NewNotificar : IEnviarNotificarPago = {
          fotovoucherdeposito : this.ImgBase64,
          pedidoIds : this.PedidosSeleccionados
        } 
        this.planesService.notificarPagoConVaucher(NewNotificar).subscribe((resp) => {
          this.onLoadPedidos(); 
          this.swal.mensajeExito('Se envió la notificación correctamente');
        },error => {
          this.generalService.onValidarOtraSesion(error);
       })
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
    }
  }

 





}
