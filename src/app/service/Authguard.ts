import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Verificar si el usuario está autenticado
    const usuario = localStorage.getItem('usuario');
    if (usuario) {
      // Si el usuario está autenticado, permitir la activación de la ruta
      return true;
    } else {
      // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
      this.router.navigate(['/paginaprincipal']);
      return false;
    }
  }
}