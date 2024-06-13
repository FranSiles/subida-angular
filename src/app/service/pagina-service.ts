import { Injectable } from '@angular/core';
import { Usuario } from '../interface/usuario';
import { Juego } from '../interface/juego';
import { BehaviorSubject, Subject } from 'rxjs';
import {LaravelService} from './laravel.service'
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Comentarios } from '../interface/comentario';
import { Valoracion } from '../interface/valoracion';
import { Comentariosvaloracion } from '../interface/comentariovaloracion';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Observable, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaginaService {
    private _juegos: BehaviorSubject<Juego[]> = new BehaviorSubject<Juego[]>([]);
    private _juegosaleatorios: BehaviorSubject<Juego[]> = new BehaviorSubject<Juego[]>([]);
    private _juegosusuario: BehaviorSubject<Juego[]> = new BehaviorSubject<Juego[]>([]);
    private _comenatirosvaloraciones: BehaviorSubject<Comentariosvaloracion[]> = new BehaviorSubject<Comentariosvaloracion[]>([]);
    private _juego = new BehaviorSubject<Juego>({nombre: '', descripcion: '', imagen: '', pegi: 0, generoPrincipal: '', generoSecundario: '', trailer: '', desarrollador: ''});
    private _comentario=new BehaviorSubject<Comentarios>({texto: '',codUsuario: 0,codJuego: 0});
    private _errors= new BehaviorSubject<any>(null);
    private _usuario = new Subject<Usuario>();
    usuario$=this._usuario.asObservable();
    juegos$ = this._juegos.asObservable();
    juego$=this._juego.asObservable();
    juegosaleatorios$=this._juegosaleatorios.asObservable();
    juegosusuario$=this._juegosusuario.asObservable();
    comenatirosvaloraciones$=this._comenatirosvaloraciones.asObservable();
    errors$=this._errors.asObservable();
    comentario$=this._comentario.asObservable();
    public totalItems: number = 0;
    public totalPages: number = 0;
    constructor(private router: Router,private laravelservice:LaravelService){}
    verificarUsuario(usuario:Usuario){
      console.log("hola recibo: ",usuario)
      this.laravelservice.login(usuario).subscribe({
        next: (usuarioLogueado: Usuario)=>{
          console.log("Usuario logueado:", usuarioLogueado);
          localStorage.setItem('usuario',JSON.stringify(usuarioLogueado));
          this._errors.next(null);
          this.router.navigate(['/paginaprincipal']);
        },
        error: (error: any) => {
          console.error("Error al registro de usuario:", error);
          this._errors.next(error);
        }
      })
    }
    anadirUsuario(usuario:Usuario){
      console.log("añado: ",usuario)
      this.laravelservice.registro(usuario).subscribe({
        next: ()=>{
          this.router.navigate(['/iniciosesion']);
        },
        error: (error: any) => {
          console.error("Error al registro de usuario:", error);
          this._errors.next(error);
        }
      })
    }
    cargarJuegos(){
      this.laravelservice.obtenerJuegos().pipe(
        tap((juegos: Juego[]) => {
          this._juegos.next(juegos);
          console.log("La Consulta a la BD devuelve: ", this._juegos);
        })
      ).subscribe();
      
    }
    obtenerJuego(codJuego:number){
      this.laravelservice.obtenerJuego(codJuego).subscribe({
        next:(juego:Juego)=>{
          this._juego.next(juego);
          console.log("el juego recibido es ",this._juego);
          console.log("el juego recibido es ",juego);
          this.router.navigate(['/juego']); 
        },
        error: (error: any)=>{
          console.error("Error al obtener juego:", error);
        }
      })
    }
    anadirJuego(juego:Juego){
      this.laravelservice.anadirJuego(juego).subscribe({
        next: ()=>{
          this.router.navigate(['/paginaprincipal']);
        },
        error: (error: any) => {
          console.error("error registro juego:", error);
          this._errors.next(error);
        }
      })
    }
    logout(){
      this.laravelservice.logout().subscribe({
        next: ()=>{
          localStorage.removeItem('usuario');
          localStorage.removeItem('juego');
          localStorage.removeItem('usuarioperfil');
          this.router.navigateByUrl('/paginaprincipal').then(() => {
            window.location.reload();
          });
        },
        error: (error: any) => {
          console.error("error al cerrar sesion:", error);
        }
      });
    }
    cargarusuario(codUsuario:number){
      this.laravelservice.obtenerusuario(codUsuario).subscribe({
        next:(usuario:Usuario)=>{
          localStorage.setItem('usuarioperfil',JSON.stringify(usuario));
            this.router.navigate(['/perfil']);
        },
        error: (error: any) => {
          console.error("error al cargar usuario:", error);
        }
      });
    }
    eliminarUsuario(codUsuario:number){
      console.log("El codigo que llega a pagina servcie es: ",codUsuario);
      this.laravelservice.eliminarUsuario(codUsuario).subscribe({
        next:()=>{
          localStorage.removeItem('usuario');
          localStorage.removeItem('juego');
          localStorage.removeItem('usuarioperfil');
          this.router.navigateByUrl('/paginaprincipal').then(() => {
            window.location.reload();
          });
        },error: (error: any) => {
          console.error("error al cargar usuario:", error);
        }
      });
    }
    anadirComentario(conComentario: boolean, comentario: Comentarios, valoracion: Valoracion, onSuccess: () => void, onError: (error: any) => void) {
      if (conComentario) {
        this.laravelservice.submitComment(comentario).subscribe({
          next: () => {
            this.laravelservice.submitRating(valoracion).subscribe({
              next: () => {
                onSuccess();
                this.router.navigateByUrl('/juego').then(() => {
                  window.location.reload();
                });
              },
              error: (error: any) => {
                console.error("Error al registrar la valoración:", error);
                onError(error);
              }
            });
          },
          error: (error: any) => {
            console.error("Error al registrar el comentario:", error);
            onError(error);
          }
        });
      } else {
        this.laravelservice.submitRating(valoracion).subscribe({
          next: () => {
            onSuccess();
            this.router.navigate(['/juego']);
          },
          error: (error: any) => {
            console.error("Error al registrar la valoración:", error);
            onError(error);
          }
        });
      }
    }

    obtenerComentarios(codJuego:number){//¿Es mejor usar observable?
      return this.laravelservice.obtenerComentarios(codJuego);
    }
    obtenerRating(codJuego:number){//¿Es mejor usar observable?
      return this.laravelservice.obtenerValoraciones(codJuego);
    }
    modificarusuario(usuario:Usuario,codUsuario:number){
      console.log("hola recibo usuario",usuario);
      console.log("Hola este es mi codUsuario",codUsuario);
      this.laravelservice.cambiarusuario(usuario,codUsuario).subscribe({
        next:()=>{
          localStorage.removeItem('usuario');
          localStorage.removeItem('juego');
          localStorage.removeItem('usuarioperfil');
          this.router.navigate(['/iniciosesion']);
        },error: (error: any) => {
          console.error("error al cargar usuario:", error);
          this._errors.next(error);
        }
      })
    }
    cambiarfoto(foto:File){
      console.log("mi foto nueva es: ",foto);
      this.laravelservice.cambiarfoto(foto).subscribe({
        next:()=>{
          localStorage.removeItem('usuario');
          localStorage.removeItem('juego');
          localStorage.removeItem('usuarioperfil');
          this.router.navigate(['/iniciosesion']);
        },error: (error: any)=>{
          console.error("error al subir la foto",error);
          this._errors.next(error);
        }
      })
    }
    cargarJuegosAleatorios(codJuego:number){
      this.laravelservice.cargarJuegosAleatorios(codJuego).pipe(
        tap((juegos: Juego[]) => {
          this._juegosaleatorios.next(juegos);
          console.log("La Consulta a la BD devuelve: ", this._juegosaleatorios);
        })
      ).subscribe();
    }
    cargarJuegosusuario(codUsuario:number){
      this.laravelservice.cargarJuegosusuario(codUsuario).pipe(
        tap((juegos: Juego[]) => {
          this._juegosusuario.next(juegos);
          console.log("La Consulta a la BD devuelve: ", this._juegosaleatorios);
        })
      ).subscribe();
    }
    eliminarjuego(codJuego:number){
      this.laravelservice.eliminarjuego(codJuego).subscribe({
        next:()=>{
          this.router.navigate(['/paginaprincipal']);
        },error: (error:any)=>{
          console.error("error al borrar el juego",error)
        }
      })
    }
    cargarcomentariosvaloraciones(codUsuario:number){
      this.laravelservice.cargarcomentariosvaloraciones(codUsuario).pipe(
        tap((comentariovaloracion: Comentariosvaloracion[]) => {
          this._comenatirosvaloraciones.next(comentariovaloracion);
          console.log("La Consulta a la BD devuelve: ", this._comenatirosvaloraciones);
        })
      ).subscribe();
    }
    limpiarErrores(): void {
      this._errors.next(null);
    }
    obtenerMedia(codJuego: number) {
      return this.laravelservice.obtenerMediaValoraciones(codJuego).pipe(
        map(response => response.media),
        catchError(error => {
          console.error('Error al obtener la media de valoraciones:', error);
          return of(0);
        })
      );
    }
}