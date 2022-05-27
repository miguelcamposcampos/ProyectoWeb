export interface IListaProveedores{
    hasItems : boolean,
    items : IProveedor[],
    label : string,
    page : number,
    pages : number,
    total : number
}

export interface IProveedor{
    idProveedor:  number,
    cod: string,
    tipoPersona: string,
    tipoDocumento: string,
    nroDocumento: string,
    nombres: string,
    apellidos: string,
    razonSocial: string,
    fechaRegistro: string,
    usuarioRegistro: string,
    nombrecompleto: string,
}

export interface ICrearProveedor{
    personaData : IPersonData,
    emails : string,
    telefonos : string,
    website : string,
    nombrecontacto : string,
    personaid: number,
    idproveedor: number,
    codigoproveedor: string,
    idauditoria: number, 
}

export interface IPersonData{
    personaid : number,
    tipopersonaid : number,
    tipodocumentoid : number,
    nombres : string,
    apellidos : string,
    razonsocial :string,
    categoriapersona : number,
    nrodocumentoidentidad :string,
    direccionesAnexos : string[],
    nombreCompleto : string,
    ubigeoprincipal: number,
    direccionprincipal:string,
}

export interface IProveedorPorId{
    personaData : IPersonData, 
    idproveedor :  number,
    personaid :  number,
    codigoproveedor : string,
    emails :string,
    telefonos : string,
    website : string,
    nombrecontacto : string,
    nrodocumentoopcional : string,
    aliasnombrecomercial : string,
    nrocuentadetraccion : string,
    procedenciapasaporteid : string,
    esprestadorservicios : string,
    nombreservicio : string,
    afectotraccion : string,
    convenioparaevitardobletributacion : string,
    idauditoria :  number,
}