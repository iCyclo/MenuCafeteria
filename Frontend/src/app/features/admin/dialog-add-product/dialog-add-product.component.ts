import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
  ],
})
export class DialogAddProductComponent implements OnInit {
  name!: string;
  description!: string;
  price!: number;
  category!: Category;

  categories! : Category[]

  constructor(private dialogRef: MatDialogRef<DialogAddProductComponent>,  private clientService : ClientService) {}

  ngOnInit() {
    this.initCategories()
  }

  initCategories(){
    this.clientService.getCategories().pipe(
      tap(categories => this.categories = categories)
    ).subscribe()
  }

  close() {
    this.dialogRef.close(undefined);
  }

  save() {
    const productToSave: Product = {
      id: 0,
      nombre: this.name,
      descripcion: this.description,
      categoria: this.category,
      precio: this.price,
    };

    this.dialogRef.close(productToSave);
  }
}
