import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Category } from '../interfaces/category';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/transaction_categories';

  // internal state holder
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  // observable for components to subscribe to
  categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCategories();
  }

  /** initial load */
  private loadCategories(): void {
    this.http.get<Category[]>(this.apiUrl).subscribe(data => {
      this.categoriesSubject.next(data);
    });
  }

  /** get all categories */
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  /** add */
  addCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      tap(() => {
        this.loadCategories(); // Reload categories after adding
      })
    );
  }

  /** update */
  updateCategory(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${category.id}`, category).pipe(
      tap(() => {
        this.loadCategories(); // Reload categories after updating
      })
    );
  }

  /** delete */
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.loadCategories(); // Reload categories after deleting
      })
    );
  }
}
