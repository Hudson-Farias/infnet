export type Parties = [{
    id: string,
    nome: string,
    uri: string
  }];
  
export type Party = {
dados?: {
    status: {
    uriMembros: string
}}};

export type Parliamentarians = [{
nome?: string,
siglaPartido?: string,
siglaUf?: string,
urlFoto?: string
id?: number
}]