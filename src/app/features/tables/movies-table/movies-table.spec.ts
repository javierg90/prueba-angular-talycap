import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesTable } from './movies-table';

describe('MoviesTable', () => {
  let component: MoviesTable;
  let fixture: ComponentFixture<MoviesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
