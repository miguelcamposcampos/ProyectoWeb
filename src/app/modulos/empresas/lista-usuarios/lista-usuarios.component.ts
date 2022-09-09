import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/auth/services/auth.service'; 
import { ConstantesGenerales, InterfaceColumnasGrilla } from 'src/app/shared/interfaces/shared.interfaces';
import { GeneralService } from 'src/app/shared/services/generales.services';
import { MensajesSwalService } from 'src/app/utilities/swal-Service/swal.service';
import { ICambiarRol, IModalConfirmar, IRolPorEmpresa, IUsuarioInvitado, IUsuarios } from '../interface/empresa.interface'; 
import { RolesService } from '../services/roles.services';
import { UsuariosService } from '../services/usuarios.services';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.scss']
})
export class ListaUsuariosComponent implements OnInit { 
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

  filterCols : any[];

  constructor(
    private usuarioService: UsuariosService,  
    private rolesService : RolesService,
    private swal : MensajesSwalService,
    private authService : AuthService,
    private formBuilder: FormBuilder,
    private generalService: GeneralService,
    private spinner : NgxSpinnerService
  ) { 
    this.authService.verificarAutenticacion();
    this.builform();
    this.generalService._hideSpinner$.subscribe(x=>{
      this.spinner.hide();
    })
  }

  private builform(): void {
    this.InvitarForm = this.formBuilder.group({
      Email: new FormControl(null, Validators.required),
      Rol: new FormControl(null, Validators.required),  
    });
  }


  ngOnInit(): void { 
    this.onListarUsuarios();
    this.onListaRoles(); 
 
    this.cols = [ 
      { field: 'emailUsuario', header: 'Email', visibility: true}, 
      { field: 'nombreUsuario', header: 'Nombres', visibility: true}, 
      { field: 'rol', header: 'Rol', visibility: true}, 
      { field: 'estado', header: 'Estado', visibility: true}, 
      { field: 'ultimaInteraccion', header: 'Fecha Interaccion', visibility: true, formatoFecha: ConstantesGenerales._FORMATO_FECHA_VISTA }, 
      { field: 'acciones', header: 'Ajustes', visibility: true  },
    ]; 
    this.filterCols = this.cols;
  }
  
  /** FILTRAR COLUMNAS EN LA TABLA */
  @Input() get selectedColumns(): any[] {
    return this.filterCols;
  }

  set selectedColumns(val: any[]) { 
    this.filterCols = this.cols.filter(col => val.includes(col));
  }


  onItemsOperario(){
    this.itemsOperario = [ 
      {
        label:'Cambiar Rol',
        icon:'pi pi-fw pi-key', 
        command:()=>{
           this.onModalChangeRol(null);
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
    this.spinner.show();
    this.usuarioService.usuariosPorEmpresa().subscribe((resp) => { 
      if(resp){ 
        this.usuariosporEmpresa = resp;     
        this.usuariosporEmpresa.forEach(x => { 
          this.iconPorEstadoUsuario = x.estado === 'Denegado'  ?  'pi pi-fw pi-check-circle' : 'pi pi-fw pi-ban';
          this.labelPorEstdoUsuario = x.estado === 'Denegado'  ?  'Activar Invitación' : 'Suspender Invitación';   
        }) 
        this.onItemsOperario();
        this.spinner.hide();
      }
    });
  }
 
  onListaRoles(){   
    this.rolesService.rolesPorEmpresa().subscribe((resp) => { 
      this.ListadeRoles = resp;   
    });
  }

  /* cambio Directo del boton */
  onModalChangeRol(usuario : any){  
    this.InvitarForm.controls['Rol'].setValue(null)
    this.selectUsuario = usuario ?? this.selectUsuarioSplit; 
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
      });
  
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
    this.spinner.show();
    this.usuarioService.registrarUsuarioInvitado(newUserInvitado).subscribe((resp) => {
      if(resp){
        this.spinner.hide();
        this.swal.mensajeExito('Se realizó la invitación corerctamente!,')
      }else{
        this.spinner.hide();
        this.swal.mensajeError('No se envio la invitación!,') 
      }
    });
  }
 
 
  onModalSuspenderActivarInvitacion(){ 
    let texto = this.selectUsuarioSplit.estado === 'Denegado' ? 'ACTIVAR' : 'SUSPENDER';
    let textoExito = this.selectUsuarioSplit.estado === 'Denegado' ? 'activada' : 'suspendida'; 
    this.swal.mensajePregunta('Seguro de ' +texto+ ' la invitación?.').then((response) => {
      if (response.isConfirmed) {
        this.usuarioService.suspenderActivarUsuarioEmpresa(this.selectUsuarioSplit.usuarioEmpresaId).subscribe((resp) => { 
          this.swal.mensajeExito('La invitación ha sido ' +textoExito+ ' correctamente!.');  
          this.onListarUsuarios(); 
        });
      }
    })  
  }
 
  
  onModalEliminarInvitacion(){
    this.swal.mensajePregunta("¿Seguro que desea eliminar la invitación?").then((response) => {
      if (response.isConfirmed) {
        this.usuarioService.eliminarUsuarioEmpresa(this.selectUsuarioSplit.usuarioEmpresaId).subscribe((resp) => { 
          this.swal.mensajeExito('La invitación ha sido eliminado correctamente!.'); 
          this.onListarUsuarios(); 
        });
      }
    })  
  }
  

  onRegresar() { 
    this.cerrar.emit(false); 
  }
 
}
