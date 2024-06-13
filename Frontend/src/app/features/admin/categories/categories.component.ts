import { Component, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../../../types/category.types';
import { ClientService } from '../../../services/client.service';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs';
import { AdminService } from '../../../services/admin.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectImageComponent } from '../../../components/select-image/select-image.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../components/confirm-dialog/confirm-dialog.component';

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
    ReactiveFormsModule,
    SelectImageComponent,
  ],
})
export class CategoriesComponent implements OnInit {
  searchField!: FormControl;
  selectedCategory!: Category;
  dataSource: Category[] = [];
  originalData: Category[] = [];

  displayedColumns: string[] = ['name', 'image', 'actions'];

  categoryForm!: FormGroup;

  constructor(
    private clientService: ClientService,
    private adminService: AdminService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.searchField = new FormControl('');
    this.initCategories();

    this.categoryForm = this.formBuilder.group({
      nombre: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)],
      ],
      imagen: ['', Validators.required],
    });
  }

  initSearch(): Observable<any> {
    return this.searchField.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap((value) => this.filter(value))
    );
  }

  filter(value: string) {
    value = value.toLowerCase();
    if (value === '') {
      this.dataSource = [...this.originalData];
    } else {
      this.dataSource = this.originalData.filter((c) =>
        c.nombre.toLowerCase().includes(value)
      );
    }
  }

  initCategories() {
    this.clientService
      .getCategories()
      .pipe(
        tap((categories) => {
          this.dataSource = categories;
          this.originalData = this.dataSource;
        }),
        switchMap(() => this.initSearch())
      )
      .subscribe();
  }

  edit(category: Category) {
    if (this.selectedCategory != undefined) return;
    console.log('editando');
    this.selectedCategory = category;
    this.categoryForm.patchValue({
      nombre: this.selectedCategory.nombre,
      imagen: this.selectedCategory.imagen,
    });
  }

  onSelectedImage(image: string) {
    this.control('imagen').patchValue(image);
  }

  saveEdit() {
    this.categoryForm.markAllAsTouched();
    if (this.categoryForm.valid) {
      this.selectedCategory.nombre = this.control('nombre').value;
      this.selectedCategory.imagen = this.control('imagen').value;

      this.adminService
        .saveCategory(this.selectedCategory)
        .pipe(tap(() => (this.selectedCategory = undefined)))
        .subscribe();
    }
  }

  cancelEdit() {
    this.selectedCategory = undefined;
    this.categoryForm.reset();
  }

  control(name: keyof Category) {
    return this.categoryForm.get(name) as FormControl;
  }

  addData(category: Category) {
    this.dataSource = [...this.dataSource, category];
  }

  delete(category: Category) {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '250px',
        data: `¿Seguro que desea eliminar la categoria ${category.nombre}?`,
      })
      .afterClosed()
      .pipe(
        filter((data) => data == true),
        switchMap(() => this.adminService.deleteCategory(category)),
        tap(
          () =>
            (this.dataSource = this.dataSource.filter((c) => c !== category))
        )
      )
      .subscribe();
  }
}
