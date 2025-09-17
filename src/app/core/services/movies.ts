import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {
  private http = inject(HttpClient);
  private base = environment.tmdb.apiUrl;
  private key = environment.tmdb.apiKey;
  private img = environment.tmdb.imageBase;

  searchMovies(params: { page: number; query?: string }) {
    const url = params.query?.trim()
      ? `${this.base}/search/movie?api_key=${this.key}&page=${params.page}&query=${encodeURIComponent(params.query)}&include_adult=false&language=es-ES`
      : `${this.base}/movie/popular?api_key=${this.key}&page=${params.page}&language=es-ES`;

    return this.http.get<any>(url).pipe(
      map(res => ({
        total: res?.total_results ?? 0,
        items: (res?.results ?? []).map((r: any): Movie => ({
          id: r.id,
          title: r.title,
          releaseDate: r.release_date,
          rating: r.vote_average,
          posterUrl: r.poster_path ? `${this.img}${r.poster_path}` : ''
        }))
      }))
    );
  }
}
