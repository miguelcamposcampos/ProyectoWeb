import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { forkJoin, Subject } from 'rxjs';
import { IAuth } from 'src/app/auth/interface/auth.interface';
import { AuthService } from 'src/app/auth/services/auth.service'; 
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { DataEmpresa, ICambiarRol, IModalConfirmar, IRolPorEmpresa, IUsuarioInvitado, IUsuarios } from '../interface/empresa.interface'; 
import { RolesService } from '../services/roles.services';
import { UsuariosService } from '../services/usuarios.services';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss']
})
export class ListaUsuariosComponent implements OnInit {

  public FlgRetornaNuevoToken: Subject<boolean> = new Subject<boolean>();   
  @Input() tokenLS: any; //datos de la empresa que queremos asociar a un plan 
  @Output() cerrar : any  = new EventEmitter<boolean>();

  usuariosporEmpresa : IUsuarios[] = [];
  selectUsuario! : IUsuarios;
  selectUsuarioSplit! : IUsuarios;
  cols : InterfaceColumnasGrilla[] = [];
  ListadeRoles! : IRolPorEmpresa[];
  itemsOperario! : MenuItem[]; 
  Iconfirmar! : IModalConfirmar;

  modalChangeRol: boolean = false;
  modalInvitarUsuario: boolean = false;
  modalConfirmacion: boolean = false;
  InvitarForm! : FormGroup
  
  dataDesencryptada:any;

  iconPorEstadoUsuario : string = "";
  labelPorEstdoUsuario : string = "";

  constructor(
    private usuarioService: UsuariosService,  
    private rolesService : RolesService,
    private swal : MensajesSwalService,
    private authService : AuthService,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
  ) { 
    this.authService.verificarAutenticacion();
    this.builform();
  }

  private builform(): void {
    this.InvitarForm = this.formBuilder.group({
      Email: new FormControl(null, Validators.required),
      Rol: new FormControl(null, Validators.required),  
    });
  }


  ngOnInit(): void {
    
    if(!this.tokenLS){
      return;
    }else{
      this.onNewToken();  
    }  
 
    this.cols = [ 
      { field: 'emailUsuario', header: 'Email', visibility: true}, 
      { field: 'nombreUsuario', header: 'Nombres', visibility: true}, 
      { field: 'rol', header: 'Rol', visibility: true}, 
      { field: 'estado', header: 'Estado', visibility: true}, 
      { field: 'ultimaInteraccion', header: 'Fecha Interaccion', visibility: true, formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'acciones', header: 'Ajustes', visibility: true  },
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
        this.onListarUsuarios();
        this.onListaRoles(); 
      }
    }) 
  }


  onItemsOperario(){
    this.itemsOperario = [ 
      {
        label:'Cambiar Rol',
        icon:'pi pi-fw pi-key', 
        command:()=>{
           this.onOpenModalChangeRol();
        }
      },
      {
        label: this.labelPorEstdoUsuario,
        icon: this.iconPorEstadoUsuario,
        command:()=>{
          this.onModalSuspenderActivarInvitacion();
        }
      },
      {
        label:'Eliminar Invitación',
        icon:'pi pi-fw pi-trash',
        command:()=>{
          this.onModalEliminarInvitacion();
      }
     }
    ];
  }

  onSelectItems(data:  any){  
    this.selectUsuarioSplit = data;
  }

  onListarUsuarios(){  
    this.usuarioService.usuariosPorEmpresa().subscribe((resp) => { 
      if(resp){
        this.swal.mensajePreloader(false)
        this.usuariosporEmpresa = resp;     
        this.usuariosporEmpresa.forEach(x => {
          if(x.estado === 'Denegado' ){
            this.iconPorEstadoUsuario = 'pi pi-fw pi-check-circle',
            this.labelPorEstdoUsuario = 'Activar Invitación'
          }else{
            this.iconPorEstadoUsuario = 'pi pi-fw pi-ban',
            this.labelPorEstdoUsuario = 'Suspender Invitación'
          }
        })

        this.onItemsOperario()
      }
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  }
 
  onListaRoles(){   
    this.rolesService.rolesPorEmpresa().subscribe((resp) => { 
      this.ListadeRoles = resp;   
    },error => { 
      this.generalService.onValidarOtraSesion(error);
    });
  }

  /* cambio desde el split */
  onOpenModalChangeRol(){
    this.InvitarForm.controls['Rol'].setValue(null)
    this.selectUsuario = this.selectUsuarioSplit; 
    this.modalChangeRol = true; 
  }

  /* cambio Directo del boton */
  onModalChangeRol(usuario : any){  
    this.InvitarForm.controls['Rol'].setValue(null)
    this.selectUsuario = usuario; 
    this.modalChangeRol = true; 
  }


  onChangeRol(selectUsuario : any){  
    const data = this.InvitarForm.value 
    if(!data.Rol){ 
      this.swal.mensajeAdvertencia('Debe seleccionar un nuevo Rol');
      return;
    }
 
    const newRol : ICambiarRol = {
      email : selectUsuario.emailUsuario,
      nuevoRolId :  data.Rol.rolid
    }
      this.rolesService.changeRol(newRol).subscribe((resp) => {
        this.onListarUsuarios();
        this.modalChangeRol = false;
        this.swal.mensajeExito('Se cambió el rol del usuario!.')
      },error =>{
        this.generalService.onValidarOtraSesion(error);
        this.swal.mensajeError(error)
      })
  
  }

  onModalInvitarUsuario(){
    this.InvitarForm.reset();
    this.modalInvitarUsuario = true;
  }

  onEnviarInvitacion(){
    const data = this.InvitarForm.value 
    const newUserInvitado : IUsuarioInvitado = {
      emailUsuarioInvitado : data.Email,
      rolId :  data.Rol.rolid
    }
    this.usuarioService.registrarUsuarioInvitado(newUserInvitado).subscribe((resp) => {
      if(resp){
        this.swal.mensajeExito('Se realizó el registro corerctamente!,')
      }
    },error=>{
      this.generalService.onValidarOtraSesion(error); 
    })
 
  }

  // onGenerarNuevoToken(){ 
  //   this.dataDesencryptada = JSON.parse(localStorage.getItem('loginEncryptado')) 

  //   const newtoken : IAuth = {
  //     email : this.authService.desCifrarData(this.dataDesencryptada.email),  // localStorage.getItem('email')!,
  //     passwordDesencriptado : this.authService.desCifrarData(this.dataDesencryptada.password), // localStorage.getItem('passwordDesencriptado')!, 
  //     guidEmpresa :  this.authService.desCifrarData(localStorage.getItem('guidEmpresa')) // localStorage.getItem('guidEmpresa')!
  //   }
 
  //   const obsDatos = forkJoin( 
  //     this.authService.login(newtoken),    
  //   );
  //   this.swal.mensajePreloader(true)
  //   obsDatos.subscribe((response) => { 
  //     if(response){
  //       this.FlgRetornaNuevoToken.next(true);
  //     }
  //   }); 
  // }

  // Avisar() {
  //   this.FlgRetornaNuevoToken.subscribe((x) => {
  //     this.onListarUsuarios();
  //     this.onListaRoles(); 
  //   });
  // }
  
 
  onModalSuspenderActivarInvitacion(){
    let condicion  = this.selectUsuarioSplit.estado === 'Denegado';
    let texto = condicion ? 'ACTIVAR' : 'SUSPENDER';
    let textoExito = condicion ? 'activada' : 'suspendida';
 
    this.swal.mensajePregunta('Seguro de ' +texto+ ' la invitación?.').then((response) => {
      if (response.isConfirmed) {
        this.usuarioService.suspenderActivarUsuarioEmpresa(this.selectUsuarioSplit.usuarioEmpresaId).subscribe((resp) => { 
          this.onListarUsuarios(); 
          this.swal.mensajeExito('La invitación ha sido ' +textoExito+ ' correctamente!.'); 
        },error => { 
          this.generalService.onValidarOtraSesion(error);
        });
      }
    })  
  }
 
  
  onModalEliminarInvitacion(){
    this.swal.mensajePregunta("¿Seguro que desea eliminar la invitación?").then((response) => {
      if (response.isConfirmed) {
        this.usuarioService.eliminarUsuarioEmpresa(this.selectUsuarioSplit.usuarioEmpresaId).subscribe((resp) => { 
          this.onListarUsuarios(); 
          this.swal.mensajeExito('La invitación ha sido eliminado correctamente!.'); 
        },error => { 
          this.generalService.onValidarOtraSesion(error);
        });
      }
    })  
  }
  

  onRegresar() { 
    this.cerrar.emit(false); 
  }


  onValidateForm(campo: string) {
    return ( this.InvitarForm.controls[campo].errors && this.InvitarForm.controls[campo].touched );
  }

}
