
export interface IListaProductos {
    hasItems : boolean,
    items : IItemsProductos[],
    label : string,
    page : number,
    pages : number,
    total : number,
}


export interface IItemsProductos {
    codigo : number,
    codigoProveedor: string,
    color : string,
    descripcion : string,
    estado : boolean,
    fechaRegistro: string,
    id : number,
    linea : string,
    modelo : string,
}

export interface ICreateProducto {
    codigoproducto : string,
    codigounesco : string,
    lineaid : number,
    colorid: number,
    unidadmedidaid: number,
    modelo : string,
    tipoafectacionid: number,
    tipoproducto : number,
    descripcion : string,
    esservicio : boolean,
    esarticulo : boolean,
    escombo : boolean,
    activo : boolean,
    afectodetraccion : boolean,
    requierelote : boolean,
    requiereserie: boolean,
    descripcioneditable : boolean,
    codproveedor : string,
    unircodproveedordescripcion : boolean
    usadoencompras: boolean,
    esbolsaplastica : boolean,
    usadoenventas: boolean,
    marcaid?: number,
    productoid : number,
    precios : IPreciosProducto[],
}
 

export interface IPreciosProducto{
    productopreciosid : number,
    productoid : number,
    monedaid : number,
    precioventa : number,
    precioincluyeigv : boolean,
    tienecondicioncantidad : number,
    cantidadparaaplicar : number,
    cantidadunidadmedidaid: number,
    maxporcentajedscto: number,
}



export interface IUpdateProducto {
    activo : boolean,
    afectodetraccion : boolean,
    codigodetraccion : number,
    codigoproducto : string,
    codigounesco : string,
    codproveedor : string,
    colorid: number,
    descripcion : string,
    descripcioneditable : boolean,
    esarticulo : boolean,
    esbolsaplastica : boolean,
    escombo : boolean, 
    esservicio : boolean,
    idauditoria : number,
    lineaid : number,
    marcaid: number,
    modelo : string,
    porcentajedetraccion : number,
    precios : IPreciosProducto[],
    productoid: number,
    requierelote : boolean,
    requiereserie: boolean,
    tipoafectacionid: number,
    tipoproducto : number,
    unidadmedidaid: number,
    unircodproveedordescripcion : boolean
    usadoencompras: boolean,
    usadoenventas: boolean,
}
  

export interface IReporte{
    contentBytes : string,
    error : string,
    fileName : string,
    fileType : string,
    success : boolean
}

export interface ISubirProductos {
    codigoProducto : string,
    codUnesco: number,
    codProveedor : string,
    codUnidadMedida : string,
    esArticulo : string,
    esServicio : string,
    nombre : string,
}


export interface IPlantillaExcel {
    fileName: string,
    content : string,
}


export interface IModuloReporte{
    fileContent : string,
    filefullName : string,
    fileName : string,
    tipo : string, 
}

export interface IReporteExcel{
    code: number,
    data : string,
    msg : string
}