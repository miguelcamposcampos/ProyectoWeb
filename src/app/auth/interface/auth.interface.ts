export interface IAuth{
    email: string,
    guidEmpresa? : string,
    passwordDesencriptado : string,
    token? : string
    rememberMe? : boolean
}

export interface IUsuario {
    nombreusuario: string,
    contrasena: string,
    email: string,
    nombreapellidos: string,
    nombreorganizacion: string
}

export interface IActivarCuentaUsuario { 
    email: string,
    codigoActivacion: number, 
}

