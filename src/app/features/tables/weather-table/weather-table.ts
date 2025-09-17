import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { WeatherService } from '../../../core/services/weather';
import { CityWeather } from '../../../core/models/weather.model';

@Component({
  selector: 'app-weather-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule
  ],
  templateUrl: './weather-table.html',
  styleUrl: './weather-table.scss'
})
export class WeatherTableComponent {
  private svc = inject(WeatherService);
  private snack = inject(MatSnackBar);

  displayedColumns = ['icon', 'city', 'temperature', 'condition'];
  dataSource = new MatTableDataSource<CityWeather>([]);
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() { this.fetch(); }

  fetch() {
    this.loading = true;
    this.svc.getCitiesWeather().subscribe({
      next: res => {
        this.dataSource.data = res.items;
        this.loading = false;

        queueMicrotask(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'city': return item.city?.toLowerCase() ?? '';
              case 'temperature': return item.temperature ?? 0;
              case 'condition': return item.condition?.toLowerCase() ?? '';
              default: return '';
            }
          };

          this.dataSource.filterPredicate = (data, filter) =>
            (data.city ?? '').toLowerCase().includes(filter);
        });
      },
      error: err => {
        this.loading = false;
        this.snack.open(err?.message ?? 'Error cargando clima', 'Cerrar', { duration: 4000 });
      }
    });
  }

  onFilter(value: string) {
    const v = value.trim().toLowerCase();
    this.dataSource.filter = v;
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }
}
