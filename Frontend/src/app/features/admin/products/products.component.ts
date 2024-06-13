import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdminService } from '../../../services/admin.service';
import { MatTableModule } from '@angular/material/table';
import { Product } from '../../../types/product.types';
import { filter, switchMap, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../../../services/client.service';
import { Category } from '../../../types/category.types';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

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
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
  ],
})
export class ProductsComponent implements OnInit {
  dataSource: Product[] = [];
  filteredDataSource: Product[] = [];
  categories!: Category[];
  selectedProduct?: Product;
  displayedColumns: string[] = ['name', 'description', 'price', 'actions'];
  productForm: FormGroup;
  searchForm: FormGroup;

  constructor(
    private adminService: AdminService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.searchForm = this.fb.group({
      search: [''],
      category: [''],
    });
  }

  ngOnInit() {
    this.initProducts();
    this.initCategories();

    this.productForm = this.fb.group({
      nombre: ['' , [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
      descripcion: ['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
      precio: ['', [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
    });

    this.searchForm.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  initProducts() {
    this.adminService
      .getProducts()
      .pipe(
        tap((products) => {
          this.dataSource = products;
          this.applyFilter();
        })
      )
      .subscribe();
  }

  initCategories() {
    this.clientService
      .getCategories()
      .pipe(tap((categories) => (this.categories = categories)))
      .subscribe();
  }

  applyFilter() {
    const { search, category } = this.searchForm.value;
    this.filteredDataSource = this.dataSource
      .filter((product) => {
        const matchesSearch = search
          ? product.nombre.toLowerCase().includes(search.toLowerCase())
          : true;
        const matchesCategory = category
          ? product.categoria.id === category
          : true;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordenar alfabéticamente
  }

  addData(product: Product) {
    this.dataSource = [...this.dataSource, product];
    this.applyFilter();
  }

  edit(product: Product) {
    if (this.selectedProduct != undefined) return;
    this.selectedProduct = product;
    this.productForm.patchValue({
      nombre: this.selectedProduct.nombre,
      descripcion: this.selectedProduct.descripcion,
      precio: this.selectedProduct.precio,
    });
  }

  saveEdit() {
    this.productForm.markAllAsTouched();
    if (this.productForm.valid) {
      this.selectedProduct!.nombre = this.control('nombre').value;
      this.selectedProduct!.descripcion = this.control('descripcion').value;
      this.selectedProduct!.precio = this.control('precio').value;

      this.adminService
        .saveProduct(this.selectedProduct!)
        .pipe(
          tap(() => {
            this.selectedProduct = undefined;
            this.applyFilter();
          })
        )
        .subscribe();
    }
  }

  control(name: keyof Product) {
    return this.productForm.get(name) as FormControl;
  }

  cancelEdit() {
    this.selectedProduct = undefined;
    this.productForm.reset();
  }

  delete(product: Product): void {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '250px',
        data: `¿Seguro que desea eliminar el producto ${product.nombre}?`,
      })
      .afterClosed()
      .pipe(
        filter((data) => data == true),
        switchMap(() => this.adminService.deleteProduct(product)),
        tap(() => {
          this.dataSource = this.dataSource.filter((p) => p !== product);
          this.applyFilter();
        })
      )
      .subscribe();
  }
}
