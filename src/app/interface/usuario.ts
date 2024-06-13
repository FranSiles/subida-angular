export interface Usuario {
    codUsuario?: number;
    nomUsuario?: string;
    token?: string;
    email?: string;
    administrador?:string;
    password?: string;
    foto?: File|null;

}
