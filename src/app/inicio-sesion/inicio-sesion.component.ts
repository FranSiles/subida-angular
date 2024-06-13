import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Usuario } from '../interface/usuario';
import { PaginaService } from '../service/pagina-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent {
  public usuario: Usuario = { email: '', password: '' };  
  public errors: any;
  private usuariorespuesta: string | null = localStorage.getItem('usuario');
  private suscripcion: Subscription | null = null;
  constructor(private paginaservice: PaginaService,private router: Router){
    if(this.usuariorespuesta){
      this.router.navigate(['/paginaprincipal']);
    }
  }
  rutaImagen1: string = 'assets/img/logo.png';
  ngOnInit() {
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

  loginUsuario():void{
    console.log("Desde 'agregar usuario' envio",this.usuario);
    this.paginaservice.verificarUsuario(this.usuario);
  }
}
