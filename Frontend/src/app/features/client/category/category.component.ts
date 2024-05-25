import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { filter, switchMap, tap } from 'rxjs';
import { Product } from '../../../types/product.types';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  standalone: true,
})
export default class CategoryComponent implements OnInit {
  products!: Product[];
  category!: string;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      tap(p => {this.category = p['categoryName'];}),
      switchMap(()=> this.clientService.getProductsByCategory(this.category)),
      tap(products=> this.products = products),
      tap(console.log)
    ).subscribe()
  }
}
