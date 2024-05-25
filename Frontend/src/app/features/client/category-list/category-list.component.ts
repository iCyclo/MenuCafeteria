import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClientService } from '../../../services/client.service';
import { Category } from '../../../types/category.types';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'esime-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
})
export class CategoryListComponent implements OnInit {

  categories : Category[] = []

  constructor(private clientService : ClientService, private router: Router) {}

  ngOnInit() {
    this.initCategories()
  }

  initCategories(){
    this.clientService.getCategories().pipe(
      tap(categories => this.categories = categories)
    ).subscribe()
  }

  goToCategory(category : Category){
    this.router.navigate(['/categoria', category.nombre])
  }
}
