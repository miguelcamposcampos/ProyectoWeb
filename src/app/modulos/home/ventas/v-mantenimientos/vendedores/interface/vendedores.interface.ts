export interface IListarVendedores{
    hasitems : boolean,
    items : IVendedor[],
    label : string,
    page : number,
    pages : number,
    total : number
}

export interface IVendedor{
    codigo : string,
    establecimiento : string,
    fechaRegistro: string,
    id: number,
    nombre : string,
    nroDocumento : number,
}


export interface ICrearVendedor{
    establecimientoid : number, 
    codigovendedor : string,
    idauditoria : number,
    personaData : IPersonaData, 
    personaid : number,
    vendedorid : number,
}

export interface IPersonaData{
    apellidos : string,
    categoriapersona? : number,
    direccionesAnexos?: number,
    direccionprincipal : string,
    nombreCompleto? : string,
    nombres: string,
    nrodocumentoidentidad : number,
    personaid : number,
    reazonsocial? : string,
    tipodocumentoid?: number,
    tipopersonaid? : number,
    ubigeoprincipal? : number

}

 