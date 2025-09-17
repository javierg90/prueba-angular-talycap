import { TestBed } from '@angular/core/testing';

import { WeatherService } from './weather';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { CityWeather } from '../models/weather.model';

describe('Weather', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  const base = environment.openWeather.apiUrl;
  const key = environment.openWeather.apiKey;
  const units = environment.openWeather.units;
  const iconBase = environment.openWeather.iconBase;

  // Debe coincidir con la lista interna del servicio (Bogotá, Medellín, Lima, Ciudad de México, Buenos Aires, Santiago)
  const expectedCities = ['Bogota', 'Medellin', 'Lima', 'Monterrey', 'Buenos Aires', 'Santiago'];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WeatherService]
    });
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener clima de múltiples ciudades y mapear correctamente', () => {
    service.getCitiesWeather().subscribe(res => {
      expect(res.total).toBe(expectedCities.length);
      expect(res.items.length).toBe(expectedCities.length);

      // Validar un ejemplo
      const bogota = res.items.find(x => x.city === 'Bogotá') as CityWeather;
      expect(bogota).toBeTruthy();
      expect(typeof bogota.temperature).toBe('number');
      expect(bogota.iconUrl).toContain(iconBase);
    });

    // Esperar N requests, una por ciudad
    const pending = expectedCities.map(city => {
      const url = `${base}/weather?q=${encodeURIComponent(city)}&appid=${key}&units=${units}&lang=es`;
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');

      // Mock de respuesta por ciudad
      const temp = Math.random() * 20 + 5; // 5..25
      const payload = {
        id: Math.floor(Math.random() * 100000),
        name: city,
        main: { temp },
        weather: [{ description: 'cielo claro', icon: '01d' }]
      };

      // Devolver respuesta simulada
      req.flush(payload);
      return req;
    });

    expect(pending.length).toBe(expectedCities.length);
  });

  it('debería propagar error si alguna ciudad falla', () => {
    service.getCitiesWeather().subscribe({
      next: () => fail('Debería fallar si una petición falla'),
      error: (err) => {
        // Jasmine puede devolver el cuerpo del forkJoin; basta con verificar que algo de error llegó
        expect(err).toBeTruthy();
      }
    });

    // Simular éxito en la primera y error en la segunda para comprobar propagación
    const firstUrl = `${base}/weather?q=${encodeURIComponent(expectedCities[0])}&appid=${key}&units=${units}&lang=es`;
    const firstReq = httpMock.expectOne(firstUrl);
    firstReq.flush({
      id: 1, name: expectedCities[0],
      main: { temp: 20 }, weather: [{ description: 'cielo claro', icon: '01d' }]
    });

    const secondUrl = `${base}/weather?q=${encodeURIComponent(expectedCities[1])}&appid=${key}&units=${units}&lang=es`;
    const secondReq = httpMock.expectOne(secondUrl);
    secondReq.flush({ message: 'rate limit' }, { status: 429, statusText: 'Too Many Requests' });

    // El resto pueden no llegar a pedirse si el forkJoin se “rompe” con el segundo error;
    // por eso NO se hace expectOne para todas las restantes en este test.
  });
});
