import { Component} from '@angular/core';
import { PaginaService } from '../service/pagina-service';
import { Usuario } from '../interface/usuario';
import { Juego } from '../interface/juego';
import { Comentariosvaloracion } from '../interface/comentariovaloracion';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  public juegos:Juego[]=[];
  public comenatirosvaloraciones:Comentariosvaloracion[]=[];
  public usuario:Usuario={codUsuario:0, nomUsuario:'', email: '', foto:null};
  public foto:File|null=null;
  public errors:any;
  private suscripcion: Subscription | null = null;
  constructor(private paginaservice: PaginaService,private router: Router){}
  ngOnInit() {
    const usuariorecibido=localStorage.getItem('usuarioperfil');
    if(usuariorecibido){
      if(this.usuario.nomUsuario==""){
      this.usuario=JSON.parse(usuariorecibido ||"");
    console.log("mi usuario en perfil es: ",this.usuario);
    }
    }
    this.suscripcion = this.paginaservice.juegosusuario$.subscribe(
      juegosNuevos => {
        this.juegos = juegosNuevos;
      });
      this.suscripcion = this.paginaservice.comenatirosvaloraciones$.subscribe(
        comentariosvaolracionesnuevos => {
          this.comenatirosvaloraciones = comentariosvaolracionesnuevos;
        });
      this.paginaservice.cargarJuegosusuario(this.usuario.codUsuario||0);
      this.paginaservice.cargarcomentariosvaloraciones(this.usuario.codUsuario!);
      this.suscripcion = this.paginaservice.errors$.subscribe((error: any) => {
        this.errors = error;
        console.log('Errores recibidos:', this.errors);
      });
  }

  ngOnDestroy() {
    if (this.suscripcion !== null) {
      this.suscripcion.unsubscribe(); // Evita fugas de memoria al destruir el componente
    }
    this.paginaservice.limpiarErrores();
  }
  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.foto = inputElement.files[0];
    }
  }
  cambiarfoto(){
    if(this.foto){
      console.log("mi foto en profile",this.foto)
      this.errors=null;
      this.paginaservice.cambiarfoto(this.foto);
    }else{
      this.errors=("Debe introducir una foto para subirla");
    }
    
  }
  volver(){
    localStorage.removeItem('usuarioperfil');
    this.router.navigate(['/paginaprincipal']);
  }
  eliminarId(codUsuario:number){
    this.paginaservice.eliminarUsuario(codUsuario);
  }
  eliminarjuego(codJuego:number){
    this.paginaservice.eliminarjuego(codJuego);
  }
  enviarId(codJuego:number){
    console.log("recibo el codJuego numero: ", codJuego)
    this.paginaservice.obtenerJuego(codJuego);
  }
  logout():void{
    this.paginaservice.logout();
}
}

