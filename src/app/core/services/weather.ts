import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CityWeather } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private base = environment.openWeather.apiUrl;
  private key = environment.openWeather.apiKey;
  private units = environment.openWeather.units;
  private iconBase = environment.openWeather.iconBase;

  // Lista breve pensada para la demo
  private cities = ['Bogota', 'Medellin', 'Lima', 'Monterrey', 'Buenos Aires', 'Santiago'];

  getCitiesWeather() {
    const calls = this.cities.map(city =>
      this.http.get<any>(`${this.base}/weather?q=${encodeURIComponent(city)}&APPID=${this.key}`)
    );
    return forkJoin(calls).pipe(
      map(results => ({
        total: results.length,
        items: results.map((r: any): CityWeather => ({
          id: String(r.id),
          city: r.name,
          temperature: Math.round(r.main?.temp ?? 0),
          condition: r.weather?.[0]?.description ?? 'N/A',
          iconUrl: r.weather?.[0]?.icon ? `${this.iconBase}/${r.weather[0].icon}@2x.png` : ''
        }))
      }))
    );
  }
}
