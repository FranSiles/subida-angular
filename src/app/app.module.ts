import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { RegistroComponent } from './registro/registro.component';
import { PaginanoencontradaComponent } from './paginanoencontrada/paginanoencontrada.component';
import { PaginaPrincipalComponent } from './pagina-principal/pagina-principal.component';
import { ProfileComponent } from './profile/profile.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VistaJuegoComponent } from './vista-juego/vista-juego.component';
import { RegistroJuegoComponent } from './registro-juego/registro-juego.component';
import { ModificarUsuarioComponent } from './modificar-usuario/modificar-usuario.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioSesionComponent,
    RegistroComponent,
    PaginanoencontradaComponent,
    PaginaPrincipalComponent,
    ProfileComponent,
    VistaJuegoComponent,
    RegistroJuegoComponent,
    ModificarUsuarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
