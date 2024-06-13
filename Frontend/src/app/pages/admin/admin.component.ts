import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProductsComponent } from '../../features/admin/products/products.component';
import { CategoriesComponent } from '../../features/admin/categories/categories.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { DialogAddCategoryComponent } from '../../features/admin/dialog-add-category/dialog-add-category.component';
import { DialogAddProductComponent } from '../../features/admin/dialog-add-product/dialog-add-product.component';
import { filter, mergeMap, tap } from 'rxjs';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatSlideToggleModule,
    MatDialogModule,

    ProductsComponent,
    CategoriesComponent,
    FormsModule,
  ],
})
export default class AdminComponent implements OnInit {
  @ViewChild(ProductsComponent) products!: ProductsComponent;
  @ViewChild(CategoriesComponent) categories!: CategoriesComponent;

  isChecked: boolean = true;

  constructor(private dialog: MatDialog, private adminService: AdminService) {}

  ngOnInit() {}

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: '100px',
      left: '270px',
    };
    dialogConfig.width = '400px';
    dialogConfig.height = '400px';

    if (this.isChecked)
      this.dialog
        .open(DialogAddCategoryComponent, dialogConfig)
        .afterClosed()
        .pipe(
          filter((data) => data !== undefined),
          tap((category) => this.categories.addData(category)),
          mergeMap((category) => this.adminService.saveCategory(category))
        )
        .subscribe();
    else {
      dialogConfig.height = '550px';
      this.dialog
        .open(DialogAddProductComponent, dialogConfig)
        .afterClosed()
        .pipe(
          filter((data) => data !== undefined),
          tap(console.log),
          tap((product) => this.products.addData(product)),
          mergeMap((product) => this.adminService.saveProduct(product))
        )
        .subscribe();
    }
  }
}
