export interface IListaTransportista {
    choferes : IListaChoferes[],
    cod : string,
    fechaRegistro: string,
    id: number,
    nombre : string,
    nroDocumento : number,
    unidades : IListaUndTransporte[]
}

export interface IListaChoferes {  
    brevete : string, 
    id: number,
    nombre : string,
    nroDocumento : number, 
}

export interface IListaUndTransporte { 
    carretaMarca  : string,
    carretaPlata : string,
    id: number,
    tractorModelo : string,
    tractorPlata : number, 
}



/* -crar tranposrtistas */
export interface ICrearTransportista { 
    personaData: IPersonaData,
    telefono : number,
    tipotransportistaid : number,
    email : string,
    fax : string,
}


export interface IPersonaData{
    personaid: number,
    //brevete? : string,
    tipodocumentoid : number,
    tipopersonaid: number, 
    nombres: string,
    apellidos: string, 
    razonsocial? : string,
    categoriapersona? : number,
    nrodocumentoidentidad : string,
    ubigeoprincipal : string,
    direccionesAnexos?: string[],
    direccionprincipal?: string,
}


/* - crear Choferes */
export interface ICrearChofer{
    personaData: IPersonaData, 
    brevete? : number,
    idauditoria?: number,
    personaid :number;
    transportistaid : number,
    transportistachoferid? : number, 
}
 


/* - crear unidad de transporte */
export interface ICrearUnidadTransporte{
    tractonroplaca : string
    tractomarca : string, 
    tractomodelo : string,
    tractocertificadomtc? : string,
    carretaplaca? : string, 
    carretamarca?  : string,
    carretacertificadomtc?: string,
    transportistaid : number,
    transportistaunidadid : number,
}

