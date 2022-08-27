export interface IListaColores{
    hasitems : boolean,
    items : IColores[],
    label : string,
    page : number,
    pages : number,
    total : number
}

export interface IColores{
    codColor: string,
    fechaRegistro : string,
    id : number,
    nombre : string
}

export interface ICrearColor {
    nombrecolor : string,
    rgb : string
    colorid : number,
    codigocolor? : string,
}

export interface IColorPorId{
    codigocolor : string,
    colorid: number,
    idauditoria : number,
    nombrecolor : string,
    rgb : string,

}


/* TALLAS */

export interface ITallas{
    id: number,
    codigo : string,
    nombre: string,
}

export interface ICrearTalla {
    descripcion : string,
    tallaid: number
}

export interface ITallaPorId{
    codigo: string,
    descripcion : string
    idauditoria : string,
    tallaid : number,
}

 
/* Temporada */

export interface ITemporadas{
    id: number,
    codigo : string,
    nombre: string,
}

export interface ICrearTemporada {
    codigo: string,
    descripcion : string
    idauditoria : number,
    temporadaid : number,
}
 

 
/* Materiales */

export interface IMateriales{
    id: number,
    codigo : string,
    nombre: string,
}

export interface ICrearMateriales {
    codigo: string,
    descripcion : string
    idauditoria : number,
    materialid : number,
}

 

 
/* Coleccion */

export interface IColeccion{
    cod : string,
    fechaRegistro : string,
    id: number,
    nombre: string,
}

export interface ICrearColeccion { 
    descripcion : string,
    coleccionid : number
}

export interface IColeccionPorId{
    codigo: string,
    descripcion : string
    idauditoria : number,
    coleccionid : number,
}