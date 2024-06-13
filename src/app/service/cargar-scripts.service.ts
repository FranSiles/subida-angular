import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CargarScriptsService {

  constructor() { }

  cargar(archivo: string) {
    let script = document.createElement('script');
    script.src = archivo;
    script.type = 'text/javascript';
    script.async = true;
    document.head.appendChild(script);
  }
}
