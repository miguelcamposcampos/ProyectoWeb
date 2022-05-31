import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { IAuth } from 'src/app/auth/interface/auth.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces'; 
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { DataEmpresa, IPedidoPorEmpresa, IPedioCrate } from '../interface/empresa.interface';
import { PlanesService } from '../services/planes.services';

@Component({
  selector: 'app-lista-pedidos',
  templateUrl: './lista-pedidos.component.html',
  styleUrls: ['./lista-pedidos.component.scss']
})
export class ListaPedidosComponent implements OnInit {

  public FlgRetornaNuevoToken: Subject<boolean> = new Subject<boolean>();
 
  @Input() tokenLS: any; //datos de la empresa que queremos asociar a un plan  
  @Output() cerrar : any  = new EventEmitter<boolean>();

  listPedidos : IPedidoPorEmpresa[] = [];
  cols: InterfaceColumnasGrilla[] = [];

  modalPlanes: boolean = false;   
  VistaNotificarPago : boolean = false;
  guidDesencriptado :any; 
  dataDesencryptada :any;

  constructor(
    private planesService : PlanesService,
    private swal: MensajesSwalService, 
    private authService : AuthService,
    private generalService : GeneralService,
  ) { 
    this.authService.verificarAutenticacion();
  }

  ngOnInit(): void {
    let guidEmpresaLS = localStorage.getItem('guidEmpresa');
    this.guidDesencriptado = this.authService.desCifrarData(guidEmpresaLS) 
    if(!this.tokenLS){
      return;
    }else{
      this.onNewToken();
       
    }  
 
    this.cols = [ 
      { field: 'plan', header: 'Plan', visibility: true }, 
      { field: 'planServicio', header: 'Servicio', visibility: true }, 
      { field: 'importe', header: 'Importe', visibility: true }, 
      { field: 'estado', header: 'Estado', visibility: true },  
      { field: 'fechaRegistro', header: 'Fec.Registro', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA },
      { field: 'fechaRespuesta', header: 'Fec.Respuesta', visibility: true , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA },
      { field: 'fechaExpiracion', header: 'Fec.Expiracion', visibility: true  , formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'cantidad', header: 'Cantidad', visibility: true },  
      // { field: 'acciones', header: 'Ajustes', visibility: true  }, 
 
    ]; 
  }


  
  onNewToken(){
    this.dataDesencryptada = JSON.parse(localStorage.getItem('loginEncryptado')) 
    
    const newtoken : IAuth = {
      email : this.authService.desCifrarData(this.dataDesencryptada.email),  // localStorage.getItem('email')!,
      passwordDesencriptado : this.authService.desCifrarData(this.dataDesencryptada.password), // localStorage.getItem('passwordDesencriptado')!, 
      guidEmpresa :  this.authService.desCifrarData(localStorage.getItem('guidEmpresa')) // localStorage.getItem('guidEmpresa')!
    }
    this.authService.login(newtoken).subscribe((resp)=>{
      if(resp){
       this.onLoadPedidos();
      }
    }) 
  }

  onLoadPedidos(){  
    this.planesService.pedidosporEmpresa(this.guidDesencriptado).subscribe((resp) => {
      if(resp){
        this.listPedidos = resp;
        this.swal.mensajePreloader(false);
      }
    },error => {
        this.generalService.onValidarOtraSesion(error);
    })
  }

  onRegistrarPedido(){
    this.modalPlanes = true;
  }
   
  onPlanelegido(plan : any){   
    if(plan){
      const newPedido : IPedioCrate = {
        planesarticulosid: +plan.plan.planesarticulosid,
        cantidad: plan.cantidad,
        empresaguid: this.guidDesencriptado
      } 
      this.planesService.registrarPedido(newPedido).subscribe((resp) => {
        this.swal.mensajeExito('se registró el pedido correctamente!.');
        this.onLoadPedidos();
      },error => {
        this.generalService.onValidarOtraSesion(error);
    })
    }  
    this.modalPlanes = false;
  }


  onInformarPago(){ 
    this.VistaNotificarPago = true;
  }

  onRetornar(){
    this.VistaNotificarPago = false;
  }
 
  onRegresar() { 
    this.cerrar.emit(false); 
  }

  

}
