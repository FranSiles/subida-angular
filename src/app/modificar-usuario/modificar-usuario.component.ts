import { Component } from '@angular/core';
import { Usuario } from '../interface/usuario';
import { PaginaService } from '../service/pagina-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
  styleUrls: ['./modificar-usuario.component.css']
})
export class ModificarUsuarioComponent {
  public usuario: Usuario = { email: '',nomUsuario:'',password:''};
  public errors:any;
  private suscripcion: Subscription | null = null;
  constructor(private paginaservice: PaginaService){}
  ngOnInit() {
    const usuariorecibido=localStorage.getItem('usuarioperfil');
    if(usuariorecibido){
      if(this.usuario.nomUsuario==""){
      this.usuario=JSON.parse(usuariorecibido ||"");
    console.log("mi usuario en modificar-perfil es: ",this.usuario);
    }
    }
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
  cambiousuario(codUsuario:number){
    console.log("Desde 'mi modificar usuario' envio",this.usuario);
    console.log("existe mi codusuario",codUsuario);
    this.paginaservice.modificarusuario(this.usuario,codUsuario);
  }
}
