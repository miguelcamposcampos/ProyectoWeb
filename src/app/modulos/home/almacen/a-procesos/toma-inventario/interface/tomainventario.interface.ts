export interface ITomaInventario {
    codProducto : string,
    producto : string,
    cantidad : number,
    almacen : string,
    fechaRegistro : string,
    linea :string,
}

export interface ICrearTomaInventario{
    almacenid : number,
    codProducto : string,
    cantidad : number
}