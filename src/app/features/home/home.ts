import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MoviesTableComponent } from '../tables/movies-table/movies-table';
import { WeatherTableComponent } from '../tables/weather-table/weather-table';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    MoviesTableComponent,
    WeatherTableComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  view = signal<'movies' | 'weather'>('movies');
}
