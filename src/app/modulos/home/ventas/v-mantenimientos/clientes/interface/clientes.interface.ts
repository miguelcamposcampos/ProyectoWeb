export interface IListaCliente{
    hasitems : boolean,
    items : ICliente[],
    label : string,
    page : number,
    pages : number,
    total : number
}

export interface ICliente{
    apellidos : string,
    cod : string,
    fechaRegistro: string,
    idCliente : number,
    nombrecompleto : string,
    nombres: string,
    nroDocumento : number,
    tipoDocumento : string,
    tipoPersona: string,
    usuarioRegistro: string,
}

export interface ICrearCliente{
    autorizadoparalineacredito : boolean,
    codigocliente : string,
    emails : string,
    espublicogeneral :boolean,
    fechanacimiento : string,
    grupoclientesid : number,
    idauditoria : number,
    idcliente : number
    nombrecontacto : string,
    personaData : IPersonaData,
    personaid : number,
    telefonos : number,
    tipoclienteid: number,
    website : string,
}

export interface IPersonaData{
    apellidos : string,
    categoriapersona : number,
    direccionesAnexos?: number,
    direccionprincipal : string,
    nombreCompleto? : string,
    nombres: string,
    nrodocumentoidentidad : number,
    personaid : number,
    razonsocial : string,
    tipodocumentoid: number,
    tipopersonaid : number,
    ubigeoprincipal : number

}

 