import { Component } from '@angular/core';
import { PaginaService } from '../service/pagina-service';
import { Subscription } from 'rxjs';
import { Juego } from '../interface/juego';

@Component({
  selector: 'app-registro-juego',
  templateUrl: './registro-juego.component.html',
  styleUrls: ['./registro-juego.component.css']
})
export class RegistroJuegoComponent {
  public juego: Juego = { nombre: '', descripcion: '', imagen:null, pegi:'', generoPrincipal:'', generoSecundario:'', trailer:'', desarrollador:'' };
  private suscripcion: Subscription | null = null;
  public errors: any;
  constructor(private paginaservice: PaginaService){ }
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
      this.juego.imagen = inputElement.files[0];
    }
  }
  registroJuego(){
    console.log("Desde 'agregar usuario' envio",this.juego);
    this.paginaservice.anadirJuego(this.juego);
  }
  actualizarContador(event: any): void {
    const contador = document.getElementById('contador-caracteres');
    if (contador) {
      const caracteres = event.target.value.length;
      contador.textContent = caracteres + ' caracteres';
    }
  }
}
