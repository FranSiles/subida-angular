import { Component,OnInit } from '@angular/core';
import { CargarScriptsService } from '../service/cargar-scripts.service'; // Ajusta la ruta según sea necesario

@Component({
  selector: 'app-paginanoencontrada',
  templateUrl: './paginanoencontrada.component.html',
  styleUrls: ['./paginanoencontrada.component.css']
})
export class PaginanoencontradaComponent implements OnInit {

  rutaScript: string = 'assets/javascript/script.js';

  constructor(private cargarScriptsService: CargarScriptsService) { }

  ngOnInit(): void {
    this.cargarScriptsService.cargar(this.rutaScript); // Ajusta la ruta según sea necesario
  }
}
