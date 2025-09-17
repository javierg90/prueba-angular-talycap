import { Component, computed, effect, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MoviesService } from '../../../core/services/movies';
import { Movie } from '../../../core/models/movie.model';

type SortKey = 'title' | 'releaseDate' | 'rating';

@Component({
  selector: 'app-movies-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './movies-table.html',
  styleUrl: './movies-table.scss'
})
export class MoviesTableComponent {
  private moviesSvc = inject(MoviesService);
  private snack = inject(MatSnackBar);

  displayedColumns = ['poster', 'title', 'releaseDate', 'rating'];

  // Estado
  raw = signal<Movie[]>([]);           // datos de la página actual
  total = signal<number>(0);           // total global para el paginator
  loading = signal<boolean>(false);
  query = signal<string>('');          // filtro server-side
  pageIndex = signal<number>(0);       // 0-based
  sortState = signal<Sort>({ active: '', direction: '' }); // sort local (página)

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Derivado: aplica sort local a los datos de la página actual
  data = computed(() => {
    const items = [...this.raw()];
    const { active, direction } = this.sortState();
    if (!active || !direction) return items;

    const key = active as SortKey;
    const factor = direction === 'asc' ? 1 : -1;

    return items.sort((a, b) => {
      const av = (a as any)[key!];
      const bv = (b as any)[key!];

      if (key === 'title' || key === 'releaseDate') {
        return String(av).localeCompare(String(bv)) * factor;
      }
      if (key === 'rating') {
        return ((av ?? 0) - (bv ?? 0)) * factor;
      }
      return 0;
    });
  });

  constructor() {
    effect(() => { this.fetch(); });
  }

  fetch() {
    const page = this.pageIndex() + 1;
    const q = this.query().trim() || undefined;

    this.loading.set(true);
    this.moviesSvc.searchMovies({ page, query: q }).subscribe({
      next: (res) => {
        this.raw.set(res.items);
        this.total.set(res.total);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.snack.open(err?.message ?? 'Error cargando películas', 'Cerrar', { duration: 4000 });
      }
    });
  }

  onFilter(value: string) {
    this.query.set(value);
    this.pageIndex.set(0);
    this.fetch();
  }

  onPageChange(event: any) {
    this.pageIndex.set(event.pageIndex);
    this.fetch();
  }

  onSortChange(sort: Sort) {
    this.sortState.set(sort);
  }
}
