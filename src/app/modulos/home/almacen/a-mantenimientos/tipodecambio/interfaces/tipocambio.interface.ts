export interface IListaTipoCambio {
    fecha : string,
    fechaEdicion : string,
    fechaRegsitro : string,
    id : number,
    valorVenta : number,
    valorCompra : number
}


export interface ICreateTipoCambio {
    fechatc : string,
    tipodecambioid : number,
    valorcompra: number,
    valorventa : number,
}

export interface ITipoCambioPorId{
    fechatc : string,
    idauditoria: number,
    obtenidossunat : boolean,
    tipodecambioid : number,
    valorcompra: number,
    valorventa : number,
}

export interface IMesesTipoCambio{
    mes : number,
    nombre : string,
}