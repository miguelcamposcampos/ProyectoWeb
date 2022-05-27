export interface IListadoStock{
    almacen : string,
    almacenId : number,
    codProducto : number,
    color: string,
    esAfectoICBPER: boolean,
    esServicio : boolean,
    linea : string,
    lote: string,
    marca : string,
    modelo: string,
    monedaPrecioId: number, 
    nombreProducto : string,
    permiteEditarDescripcion : boolean,
    precioDefault : number,
    precioIncluyeIgv : boolean,
    productoId: number,
    separacion : boolean,
    serie: string,
    stockFinal : number,
    stockUnidad: number,
    tipoAfectacionId: number,
    unidadMedidad: string,
    unidadMedidaId : number 
}

export interface IStcokPivoteado{
    Almacénprincipal: number,
    CodProducto: string,
    Color:string,
    Descripcion: string,
    Marca: string,
    Modelo: string,
}


 