import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Category } from '../../../types/category.types';
import { SelectImageComponent } from '../../../components/select-image/select-image.component';

@Component({
  selector: 'app-dialog-add-category',
  templateUrl: './dialog-add-category.component.html',
  styleUrls: ['./dialog-add-category.component.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    SelectImageComponent
  ],
})
export class DialogAddCategoryComponent implements OnInit {
  categoryForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<DialogAddCategoryComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.categoryForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)]],
      imagen: ['', Validators.required],
    });
  }

  onSelectedImage(image : string){
    this.control('imagen').patchValue(image)
  }

  save() {
    console.log(this.categoryForm.valid);
    console.log(this.categoryForm.getRawValue());
    
    
    this.categoryForm.markAllAsTouched()
    if (this.categoryForm.valid) {
        const categoryToSave: Category = {
          id: 0,
          nombre: this.control('nombre').value,
          imagen: this.control('imagen').value,
        };
        this.dialogRef.close(categoryToSave);
     
    }
  }

  control(name: keyof Category): FormControl {
    return this.categoryForm.get(name) as FormControl;
  }

  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]); // Remove the data URL prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  close() {
    this.dialogRef.close(undefined);
  }
}
