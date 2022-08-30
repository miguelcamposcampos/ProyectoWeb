import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';   
import { IAuth } from 'src/app/auth/interface/auth.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LoginService } from 'src/app/auth/services/login.service';
import { InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';  
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { DataEmpresa, IEmpresa, IPedioCrate } from '../interface/empresa.interface';
import { EmpresaService, } from '../services/empresa.service';
import { PlanesService } from '../services/planes.services';

@Component({
  selector: 'app-lista-empresas',
  templateUrl: './lista-empresas.component.html',
  styleUrls: ['./lista-empresas.component.scss']
})
export class ListaEmpresasComponent implements OnInit {
 
  VistaEditarEmpresa: boolean = false;
  VistaPlanes: boolean = false;
  VistaRoles: boolean = false;
  VistaUsuarios: boolean = false; 
  VistaListaPlanes: boolean = false;
 
  empresasAsociadas : IEmpresa[] = [];
  ColsEmpresa: InterfaceColumnasGrilla[] = [];
  itemsEmpresa! : MenuItem[];   
  newEmpresa : boolean; 
  empresasAcceder! : DataEmpresa; 
  mostrarHeader : boolean = true;
  dataDesencryptada = JSON.parse(localStorage.getItem('loginEncryptado')) 
  
  constructor(
    private router : Router,
    private loginService : LoginService, 
    private empresaService: EmpresaService, 
    private swal: MensajesSwalService, 
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
    this.ColsEmpresa = [ 
      { field: 'ruc', header: 'Ruc', visibility: true }, 
      { field: 'razonSocial', header: 'Razón Social', visibility: true },  
      { field: 'acciones', header: 'Ajustes', visibility: true  }, 
    ]; 
    this.onItemsEmpresas();
    this.onLoadEmpresas(); 
   
  }
 
    
  onItemsEmpresas(){
    this.itemsEmpresa = [ 
      {
        label:'Roles',
        icon:'pi pi-fw pi-key', 
        command:()=>{ 
          this.onNuevoTokenItems('rol'); 
        }
      },
      {
        label:'Usuarios',
        icon:'pi pi-fw pi-users',
        command:()=>{
          this.onNuevoTokenItems('usuario');
        }
      },
      {
        label:'Editar Empresa',
        icon:'pi pi-fw pi-pencil',
        command:()=>{
          this.onNuevoTokenItems('editarempresa');
        }
      }, 
      {
        label:'Planes',
        icon:'pi pi-fw pi-clone',
        command:()=>{
          this.onNuevoTokenItems('planes');
        }
    },
    ];
  }

  onSelectItems(data: DataEmpresa){    
   const DatoUsuarioEncryptado : any = {
    usuariologin: this.authService.cifrarData(data.razonSocial),
    rolUsuario : this.authService.cifrarData(data.rol)
   }
   localStorage.setItem('DatosUsuario', JSON.stringify(DatoUsuarioEncryptado));   

    let gruiEncryptado = this.authService.cifrarData(data.empresaGuid)
    localStorage.setItem('guidEmpresa', gruiEncryptado )
   
  }

  onLoadEmpresas(){
    this.spinner.show();

    this.empresaService.empresasGet().subscribe((resp) =>{ 
      if(resp.length > 0){ 
        this.empresasAsociadas = resp;   
      }else{ 
        this.swal.mensajeRegistrarEmpresa().then((response) => { 
          if (response.isConfirmed) { 
            this.newEmpresa = true
            this.VistaEditarEmpresa = true;
          }
        });  
      } 
      this.spinner.hide();
    });
  }
 
  onAcceder(empresa : DataEmpresa){  
    this.empresasAcceder = empresa  

    const DatoUsuarioEncryptado : any = {
      usuariologin: this.authService.cifrarData(empresa.razonSocial),
      rolUsuario : this.authService.cifrarData(empresa.rol)
    }

    this.planesService.planesPorEmpresaGet(empresa.empresaGuid).subscribe((resp) => {
      if(resp.planId){   
        let gruiEncryptado = this.authService.cifrarData(empresa.empresaGuid)
        localStorage.setItem('guidEmpresa', gruiEncryptado ) 
        localStorage.setItem('DatosUsuario', JSON.stringify(DatoUsuarioEncryptado));  
        this.onNewToken(); 
      }else{ 
        this.swal.mensajeElegirunPlan().then((response) => { 
          if (response.isConfirmed) { 
            this.onVistaPlanes();
          }
        });
      }
    }) 
  }

  onNewToken(){ 
    const newtoken : IAuth = {
      email : this.authService.desCifrarData(this.dataDesencryptada.email),  // localStorage.getItem('email')!,
      passwordDesencriptado : this.authService.desCifrarData(this.dataDesencryptada.passwordDesencriptado), // localStorage.getItem('passwordDesencriptado')!, 
      guidEmpresa :  this.authService.desCifrarData(localStorage.getItem('guidEmpresa')) // localStorage.getItem('guidEmpresa')!
    }
    this.authService.login(newtoken).subscribe((resp)=>{
      if(resp){
        this.router.navigate(["/modulos/home/landing"]) 
      }
    }) 
  }

  onNuevoTokenItems(vista :string){
    const newtoken : IAuth = {
      email : this.authService.desCifrarData(this.dataDesencryptada.email),  // localStorage.getItem('email')!,
      passwordDesencriptado : this.authService.desCifrarData(this.dataDesencryptada.passwordDesencriptado), // localStorage.getItem('passwordDesencriptado')!, 
      guidEmpresa :  this.authService.desCifrarData(localStorage.getItem('guidEmpresa')) // localStorage.getItem('guidEmpresa')!
    }
    this.authService.login(newtoken).subscribe((resp)=>{
      if(resp){
        if(vista === 'rol'){
          this.VistaRoles = true;
        }else if (vista === 'usuario'){
          this.VistaUsuarios = true;
        }else if(vista === 'editarempresa'){
          this.newEmpresa = false;
          this.VistaEditarEmpresa = true;
        }else if(vista === 'planes'){
          this.VistaListaPlanes = true;
        }
      }
    }) 
  }

  onRegistrarEmpresa(){  
    this.newEmpresa = true
    this.VistaEditarEmpresa = true;
  }


  //Vistas
  onVistaPlanes(){
    this.mostrarHeader =  this.mostrarHeader
    this.VistaPlanes = true;
  }

  
  //CerrarVistas
  onRetornar(event){
    if(event){
      this.onLoadEmpresas();
    }
    this.VistaEditarEmpresa = false;
    this.VistaPlanes = false;
    this.VistaRoles = false;
    this.VistaUsuarios = false;
    this.VistaListaPlanes = false;
  }

  onLogout(){
    this.swal.mensajePregunta("¿Seguro que desea cerrar la sesión?").then((response) => {
      if (response.isConfirmed) {
        this.loginService.logout();
        this.router.navigate(['/auth/login']);
      }
    })
  }
  
  onPlanelegido(event :any){
    if(event){
      const newPedido : IPedioCrate = {
        planesarticulosid: event.plan.planesarticulosid,
        cantidad: +event.cantidad,
        empresaguid: this.empresasAcceder.empresaGuid
      }
      this.planesService.registrarPedido(newPedido).subscribe((resp) => {
        if(resp){
          this.swal.mensajeExito('Se registro el pedido correctamente!.');
          this.VistaPlanes = false;
        }
      })
    }
  }


}
