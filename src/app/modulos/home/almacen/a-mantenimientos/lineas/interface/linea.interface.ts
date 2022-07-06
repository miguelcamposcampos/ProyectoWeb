export interface IListarLineas{
    hasItems : boolean,
    items : ILineas[],
    label : string,
    page : number,
    pages : number,
    total : number
}

export interface ILineas{
    // codLinea : string,
    // fechaRegsitro : string,
    // idLinea: number,
    // nombreLinea : string

    idLinea: number,
    codLinea: string,
    nombreLinea: string,
    fechaRegistro: string,
    idLineaPadre: number,
    esAgrupador: boolean,
    subLineas : ISubLinea

}

export interface ISubLinea {
    idLinea: number,
    codLinea: string,
    nombreLinea: string,
    fechaRegistro: string,
    idLineaPadre: number,
    esAgrupador: boolean,
    subLineas : ISubLinea
}

export interface ICrearLinea{
    codigolinea : string,
    codigounesco : number,
    imagenlinea : string,
    idauditoria?: number,
    nombrelinea: string,
    lineaid: number,
    parentid: number,
    esagrupador: boolean,
    cuentaventas: string,
    cuentacompras : string
}

  