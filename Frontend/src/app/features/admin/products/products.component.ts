import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdminService } from '../../../services/admin.service';
import {
  MatTableModule,} from '@angular/material/table';
import { Product } from '../../../types/product.types';
import { tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../../../services/client.service';
import { Category } from '../../../types/category.types';

@Component({
  selector: 'esime-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  standalone: true,
  imports: [
    MatFormField,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule
  ],
})
export class ProductsComponent implements OnInit {
  dataSource: Product[] = [];

  categories!: Category[]

  displayedColumns: string[] = ['name', 'description', 'price', 'actions'];

  constructor(private adminService: AdminService, private clientService : ClientService) {}

  ngOnInit() {
    this.initProducts();
    this.initCategories()
  }

  initProducts() {
    this.adminService
      .getProducts()
      .pipe(tap((products) => (this.dataSource = products)))
      .subscribe();
  }

  initCategories(){
    this.clientService.getCategories().pipe(
      tap(categories => this.categories = categories)
    ).subscribe()
  }

  addData(product : Product){
    this.dataSource = [...this.dataSource, product];
  }

  delete(product: Product): void {
    this.adminService.deleteProduct(product).subscribe(() => {
      this.dataSource = this.dataSource.filter(p => p !== product);
    });
  }

  
}
