export interface ICuentasMayores{
    idPlanCuenta:  number,
    nroCuenta:  string,
    nombreCuenta:   string,
    esImputable:  boolean
}

export interface ICreateCuentasMayores{
    plancuentaid: number,
    nrocuenta: string,
    periodo: number,
    escuentamayor: boolean,
    nombrecuenta: string,
    naturaleza: string,
    imputable: boolean,
    monedaid: number,
    detalle: boolean,
    centrodecosto: boolean,
    presupuesto: boolean,
    analisispatrimonioneto: boolean,
    usadocostoproduccion: boolean
}

 
 