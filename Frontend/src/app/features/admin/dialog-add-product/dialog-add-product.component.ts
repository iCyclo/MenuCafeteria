import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Category } from '../../../types/category.types';
import { DialogRef } from '@angular/cdk/dialog';
import { Product } from '../../../types/product.types';
import { MatSelectModule } from '@angular/material/select';
import { ClientService } from '../../../services/client.service';
import { tap } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-product',
  templateUrl: './dialog-add-product.component.html',
  styleUrls: ['./dialog-add-product.component.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
})
export class DialogAddProductComponent implements OnInit {
 

  categories!: Category[];

  productForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DialogAddProductComponent>,
    private clientService: ClientService, 
    private fb : FormBuilder
  ) {}

  ngOnInit() {

    this.productForm = this.fb.group({
      nombre: ['' , [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
      descripcion: ['',[Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
      categoria: ['', Validators.required],
      precio: ['', [Validators.required, Validators.pattern(/^\d*\.?\d+$/)]],
    })
    this.initCategories();
  }

  initCategories() {
    this.clientService
      .getCategories()
      .pipe(tap((categories) => (this.categories = categories)))
      .subscribe();
  }

  close() {
    this.dialogRef.close(undefined);
  }

  control(name: keyof Product) : FormControl{
    return this.productForm.get(name) as FormControl
  }

  save() {
    this.productForm.markAllAsTouched()
    if(this.productForm.valid){
      const productToSave: Product = {
        id: 0,
        nombre: this.control('nombre').value,
        descripcion: this.control('descripcion').value,
        categoria: this.control('categoria').value,
        precio: this.control('precio').value,
      };
      this.dialogRef.close(productToSave);
    }

  }
}
