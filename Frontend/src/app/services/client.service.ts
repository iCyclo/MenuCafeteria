import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Category } from '../types/category.types';
import { Product } from '../types/product.types';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  baseUrl = 'http://localhost:8080/cafeteria'

constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]>{
    return this.http.get<Category[]>(`${this.baseUrl}/categorias`)
  }

  getProductsByCategory(categoryName: string) : Observable<Product[]>{
    return this.http.get<Product[]>(`${this.baseUrl}/filtrar-productos`, {params:{categoria: categoryName}})
  }

}
