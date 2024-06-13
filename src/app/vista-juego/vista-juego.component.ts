import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Juego } from '../interface/juego';
import { Subscription } from 'rxjs';
import { PaginaService } from '../service/pagina-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Comentarios } from '../interface/comentario';
import { Valoracion } from '../interface/valoracion';
import { forkJoin } from 'rxjs';
import { GoogleChartsService } from '../service/google-charts.service';
import { Usuario } from '../interface/usuario';
declare var google: any;

@Component({
  selector: 'app-vista-juego',
  templateUrl: './vista-juego.component.html',
  styleUrls: ['./css/main.css']
})
export class VistaJuegoComponent implements OnInit, OnDestroy {
  rutaImagen1: string = 'assets/img/pegi3.png';
  rutaImagen2: string = 'assets/img/pegi7.png';
  rutaImagen3: string = 'assets/img/pegi12.png';
  rutaImagen4: string = 'assets/img/pegi16.png';
  rutaImagen5: string = 'assets/img/pegi18.png';
  public juegos:Juego[]=[];
  public usuario: string | null = localStorage.getItem('usuario');
  public nomusuario: Usuario={nomUsuario:''};
  public juego: Juego = { nombre: '', descripcion: '', imagen: '', pegi: 0, generoPrincipal: '', generoSecundario: '', trailer: '', desarrollador: '' };
  public comentarios: Comentarios = { texto: '', codUsuario: 0, codJuego: 0 }
  public comentariousuario:Comentarios={texto: '', codUsuario: 0, codJuego: 0}
  public valoracion: Valoracion = { puntuacion: 0, codUsuario: 0, codJuego: 0 }
  private suscripcion: Subscription | null = null;
  public safeTrailerUrl: SafeResourceUrl | null = null;
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.drawChart();
  }
  public comments: any[] = [];
  public ratings: any[] = [];

  public mediaValoracion: number = 0;

  public stars = [1, 2, 3, 4, 5];
  public reversedStars: number[] = [];
  
  public successMessage: string = '';
  public errorMessage: string = '';
  public nocomentarios: string='';


  constructor(private paginaservice: PaginaService, private sanitizer: DomSanitizer, private router: Router, private googleChartsService: GoogleChartsService) {
    this.suscripcion = this.paginaservice.juego$.subscribe(juego => {
      this.juego = juego;
      console.log("juego enviado: ", juego)
      if (this.juego !== undefined && this.juego.nombre != '') {
        localStorage.setItem('juego', JSON.stringify(this.juego));
      }
    });
    if (!localStorage.getItem('juego')) {
      this.router.navigate(['/pagina-principal']); /* Ahi hay que volver cuando se cierre sesion para eliminar todas las claves de localstorage*/
    }
  }

  ngOnInit() {
    this.reversedStars = this.stars.slice().reverse();
    const juego = localStorage.getItem('juego');
    const array= JSON.parse(juego || "");
    console.log("juego:",juego);
    this.juego=array.juego;
    this.nomusuario=array.usuario
    console.log("nombre:",this.nomusuario);
    console.log("usuario",this.usuario);
    console.log('ID del juego guardado en localStorage: ', localStorage.getItem('juego'));
    if (this.juego.trailer) {
      this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.juego.trailer || '');
    } else {
      this.safeTrailerUrl = null;
    }
    if (this.juego.codJuego) {
      this.cargarComentariosYValoraciones(this.juego.codJuego);
      this.paginaservice.cargarJuegosAleatorios(this.juego.codJuego);
    } else {
      console.error('No codJuego found in the juego object.');
    }
    this.cargarGrafica();
    console.log('Contenido de comments:', this.comments);
    console.log('Contenido de ratings:', this.ratings);
    this.suscripcion = this.paginaservice.juegosaleatorios$.subscribe(
      juegosNuevos => {
        this.juegos = juegosNuevos;
      });
      console.log("mis juegos aleatorios",this.juegos);
      if (this.juego && this.juego.codJuego) {
      this.paginaservice.obtenerMedia(this.juego.codJuego).subscribe(
        media => {
          this.mediaValoracion = media;
        },
        error => {
          console.error('Error al obtener la media de valoraciones:', error);
          this.mediaValoracion = 0; // Valor por defecto en caso de error
        }
      );
    }
  }

  ngOnDestroy() {
    if (this.suscripcion !== null) {
      this.suscripcion.unsubscribe();
    }
  }

  cargarComentariosYValoraciones(codJuego: number): void {
    forkJoin({
      comentarios: this.paginaservice.obtenerComentarios(codJuego),
      valoraciones: this.paginaservice.obtenerRating(codJuego)
    }).subscribe(
      ({ comentarios, valoraciones }) => {
        this.comments = comentarios;
        this.ratings = valoraciones;

        // Asociar valoraciones a los comentarios
        this.comments.forEach(comment => {
          const valoracion = this.ratings.find(rating => rating.codUsuario === comment.codUsuario);
          comment.valoracion = valoracion ? valoracion.puntuacion : 'Sin valoración';
        });

        console.log('Comentarios obtenidos:', this.comments);
        console.log('Valoraciones obtenidas:', this.ratings);

        // Actualizar el gráfico después de cargar las valoraciones
        this.drawChart();
      },
      error => {
        console.error('Error al obtener comentarios y valoraciones:', error);
        this.nocomentarios = 'Todavia no hay comentarios realizados en este juego';
      }
    );
  }


  cargarGrafica() {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawChart.bind(this));
  }

  drawChart() {
    const data = google.visualization.arrayToDataTable([
      ['Stars', 'Cantidad de estrellas'],
      ['1 estrella', this.ratings.filter(rating => rating.puntuacion === 1).length],
      ['2 estrellas', this.ratings.filter(rating => rating.puntuacion === 2).length],
      ['3 estrellas', this.ratings.filter(rating => rating.puntuacion === 3).length],
      ['4 estrellas', this.ratings.filter(rating => rating.puntuacion === 4).length],
      ['5 estrellas', this.ratings.filter(rating => rating.puntuacion === 5).length]
    ]);

    const options = {
      title: '',
      hAxis: {
        title: '',
        minValue: 0,
        gridlines: {
          count: 5
        }
      },
      vAxis: {
        title: 'Cantidad de estrellas',
        minValue: 0
      }
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));

    chart.draw(data, options);
  }

  selectRating(rating: number) {
    this.valoracion.puntuacion = rating;
  }

  enviarComentario(): void {
    const usuario = localStorage.getItem('usuario');
    const usuarioRespuesta = JSON.parse(usuario || "");
    console.log('mi usuario', usuario);
    console.log('ID del usuario guardado en el localstorage es: ', usuarioRespuesta.data.codUsuario);
  
    this.comentarios.codUsuario = usuarioRespuesta.data.codUsuario;
    this.comentarios.codJuego = this.juego.codJuego || 0;
    this.valoracion.codJuego = this.juego.codJuego || 0;
    this.valoracion.codUsuario = usuarioRespuesta.data.codUsuario;
  
    // Validaciones
    if (this.comentarios.texto.trim() === '' || this.valoracion.puntuacion === 0) {
      this.errorMessage = 'Debe proporcionar una valoración y un comentario.';
      return;
    }
  
    this.errorMessage = '';
  
    const conComentario = this.comentarios.texto.trim() !== '';
  
    this.paginaservice.anadirComentario(
      conComentario,
      this.comentarios,
      this.valoracion,
      () => {
        this.successMessage = 'Comentario y valoración enviados correctamente.';
        this.errorMessage = '';
      },
      (error: any) => {
        if (error.status === 400 && error.error && error.error.error) {
          this.errorMessage = error.error.error;
        } else {
          this.errorMessage = 'Error al enviar el comentario y la valoración.';
        }
      }
    );
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
