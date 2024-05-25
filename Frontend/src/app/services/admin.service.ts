import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../types/product.types';
import { Category } from '../types/category.types';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  private baseUrl = 'http://localhost:8080/cafeteria'

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/productos`)
  }

  saveCategory(category: Category): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/guardar-categoria`, category)
  }

  saveProduct(product : Product) : Observable<void>{
    return this.http.post<void>(`${this.baseUrl}/guardar-producto`, product)
  }

  deleteProduct(product : Product) : Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/eliminar-producto/${product.id}`)
  }

  deleteCategory(category: Category) : Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/eliminar-categoria/${category.id}`)
  }

}
