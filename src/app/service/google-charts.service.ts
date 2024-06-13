import { Injectable } from '@angular/core';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleChartsService {
  private readonly googleScriptUrl = 'https://www.gstatic.com/charts/loader.js';
  private scriptLoaded: boolean = false;

  constructor() { }

  load(callback: () => void) {
    if (!this.scriptLoaded) {
      const script = document.createElement('script');
      script.src = this.googleScriptUrl;
      script.type = 'text/javascript';
      script.onload = () => {
        this.scriptLoaded = true;
        google.charts.load('current', { packages: ['corechart', 'bar'] });
        google.charts.setOnLoadCallback(callback);
      };
      document.head.appendChild(script);
    } else {
      google.charts.setOnLoadCallback(callback);
    }
  }
}
