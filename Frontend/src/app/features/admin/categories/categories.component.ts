import { Component, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../../../types/category.types';
import { ClientService } from '../../../services/client.service';
import { tap } from 'rxjs';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'esime-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
  standalone: true,
  imports: [
    MatFormField,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatButtonModule,
  ],
})
export class CategoriesComponent implements OnInit {
  dataSource: Category[] = [];

  displayedColumns: string[] = ['name', 'image', 'actions'];

  constructor(
    private clientService: ClientService,
    private adminService: AdminService
  ) {}

  ngOnInit() {
    this.initCategories();
  }

  initCategories() {
    this.clientService
      .getCategories()
      .pipe(
        tap((categories) => {
          this.dataSource = categories.map((category) => ({
            ...category,
          }));
        })
      )
      .subscribe();
  }

  addData(category: Category) {
    this.dataSource = [...this.dataSource, category];
  }

  delete(category: Category) {
    this.adminService.deleteCategory(category).subscribe(() => {
      this.dataSource = this.dataSource.filter((c) => c !== category);
    });
  }
}
