import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from '../interface/usuario';
import { PaginaService } from '../service/pagina-service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  public usuario: Usuario = { email: '', password: '',foto:null,nomUsuario:'' };
  public errors: any;
  private suscripcion: Subscription | null = null;
  private usuariorespuesta: string | null = localStorage.getItem('usuario');
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
  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.usuario.foto = inputElement.files[0];
    }
  }
  registroUsuario():void{
    console.log("Desde 'agregar usuario' envio",this.usuario);
    this.paginaservice.anadirUsuario(this.usuario);
  }
}
