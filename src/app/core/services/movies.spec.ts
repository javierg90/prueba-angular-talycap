import { TestBed } from '@angular/core/testing';

import { MoviesService } from './movies';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Movie } from '../models/movie.model';

describe('Movies', () => {
  let service: MoviesService;
  let httpMock: HttpTestingController;

  const base = environment.tmdb.apiUrl;
  const key = environment.tmdb.apiKey;
  const img = environment.tmdb.imageBase;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MoviesService]
    });
    service = TestBed.inject(MoviesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // asegura que no quedan requests colgando
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería obtener películas POPULARES (sin query) y mapear correctamente', () => {
    const page = 1;

    const mockResponse = {
      page,
      total_results: 2,
      results: [
        { id: 10, title: 'Matrix', release_date: '1999-03-31', vote_average: 8.7, poster_path: '/poster1.jpg' },
        { id: 20, title: 'Inception', release_date: '2010-07-16', vote_average: 8.3, poster_path: '/poster2.jpg' }
      ]
    };

    service.searchMovies({ page }).subscribe(res => {
      expect(res.total).toBe(2);
      expect(res.items.length).toBe(2);

      const a: Movie = res.items[0];
      expect(a.id).toBe(10);
      expect(a.title).toBe('Matrix');
      expect(a.releaseDate).toBe('1999-03-31');
      expect(a.rating).toBe(8.7);
      expect(a.posterUrl).toBe(`${img}/poster1.jpg`);
    });

    const url = `${base}/movie/popular?api_key=${key}&page=${page}&language=es-ES`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería buscar películas POR QUERY y mapear correctamente', () => {
    const page = 2;
    const query = 'Batman';

    const mockResponse = {
      page,
      total_results: 1,
      results: [
        { id: 30, title: 'Batman Begins', release_date: '2005-06-15', vote_average: 7.9, poster_path: '/poster3.jpg' }
      ]
    };

    service.searchMovies({ page, query }).subscribe(res => {
      expect(res.total).toBe(1);
      expect(res.items.length).toBe(1);
      expect(res.items[0].title).toBe('Batman Begins');
    });

    const url = `${base}/search/movie?api_key=${key}&page=${page}&query=${encodeURIComponent(query)}&include_adult=false&language=es-ES`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('debería propagar un error HTTP', () => {
    const page = 1;

    service.searchMovies({ page }).subscribe({
      next: () => fail('Debería fallar'),
      error: (err) => {
        expect(err).toBeTruthy();
        // Jasmine no siempre conserva statusText, pero al menos debe existir algún mensaje
        expect(err.message || err.statusText).toBeTruthy();
      }
    });

    const url = `${base}/movie/popular?api_key=${key}&page=${page}&language=es-ES`;
    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');

    req.flush({ status_message: 'API error' }, { status: 500, statusText: 'Server Error' });
  });
});
