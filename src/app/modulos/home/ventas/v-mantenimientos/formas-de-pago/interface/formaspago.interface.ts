export interface IListaFormasPago{
    documento: string,
    establecimiento: string,
    fechaRegistro : string,
    idFormaPago: number,
    titulo :string
}


export interface ICrearFormasPago{
    documentoid: number,
    documentorefid : number,
    establecimientoid: number,
    formaspagoid: number,
    idauditoria? : number,
    mediopagoid: number,
    monedaid: number,
    requieredocref: boolean,
    titulo :string
}