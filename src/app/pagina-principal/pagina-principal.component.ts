import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { PaginaService } from '../service/pagina-service';
import { Juego } from '../interface/juego';

@Component({
  selector: 'app-pagina-principal',
  templateUrl: './pagina-principal.component.html',
  styleUrls: ['./pagina-principal.component.css']
})
export class PaginaPrincipalComponent {
  public juegos:Juego[]=[];
  public currentPage: number = 1;
  public pageSize: number = 10;
  public totalPages: number = 0;
  public usuario: string | null = localStorage.getItem('usuario');
  private suscripcion: Subscription | null = null;
  constructor(private paginaservice: PaginaService){}
  ngOnInit() {
    this.suscripcion = this.paginaservice.juegos$.subscribe(
      juegosNuevos => {
        this.juegos = juegosNuevos;
      });
      this.paginaservice.cargarJuegos();
  }

  ngOnDestroy() {
    if (this.suscripcion !== null) {
      this.suscripcion.unsubscribe(); 
    } 
  }

  enviarId(codJuego:number){
    console.log("recibo el codJuego numero: ", codJuego)
    this.paginaservice.obtenerJuego(codJuego);
  }
  logout():void{
          this.paginaservice.logout();
  }
  enviarIdperfil(){
    const usuario=JSON.parse(this.usuario||"");
    console.log("recibo el id de mi usuario: ",usuario.data.codUsuario);
    this.paginaservice.cargarusuario(usuario.data.codUsuario);
  }

}
