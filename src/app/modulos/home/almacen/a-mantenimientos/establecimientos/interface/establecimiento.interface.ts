export interface IListaEstablecimientos {
    hasItems: boolean,
    items : IEstablecimientos[],
    label : string,
    page : number,
    pages : number,
    total : number,
}

export interface IEstablecimientos{
    almacenes : IAlmacenes[],
    codSunat : number,
    direccion : string,
    fechaRegistro : string,
    idEstablecimiento: number,
    nombre: string,
    nombreComercial : string,
    ubigeo : number,
}

export interface IAlmacenes{
    fechaRegistro : string,
    idAlmacen : number,
    nombreAlmacen : string
}

/*AL EDITAR */
export interface IEstablecimientoPorId{
    almacenes : IAlmacenPorId[],
    codigosunat : number,
    direccion : string,
    establecimientoid: number,
    idauditoria : number,
    logoestablecimiento: string,
    nombrecomercial : string,
    nombreestablecimiento : string,
    ubigeo : number,
}

/* Reutilizamos para Crear almacen */
export interface IAlmacenPorId{
    activo : boolean,
    almacenid: number,
    establecimientoid?: number,
    idauditoria? : number,
    nombrealmacen : string,
    tipoproductosid: number,
    validarstock : boolean
}

/*PARA CREAR */
export interface ICreateEstablecimiento{
    codigosunat : string,
    direccion : string,
    establecimientoid: number,
    logoestablecimiento : string,
    nombrecomercial: string,
    nombreestablecimiento : string, //raazon social
    ubigeo: number,

}

/*SERIES */

export interface IEstablecimientoSeries{
    esPredeterminada : boolean,
    id : number,
    serie : string,
    tipoDocumento : string
}

export interface IEstablecimientoCrearSerie{
    documentoid : number,
    espredeterminada : boolean,
    establecimientoid : number,
    establecimientoserieid? : number,
    serie : string
}

 