import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Category } from '../../../types/category.types';

@Component({
  selector: 'app-dialog-add-category',
  templateUrl: './dialog-add-category.component.html',
  styleUrls: ['./dialog-add-category.component.css'],
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule]
})
export class DialogAddCategoryComponent implements OnInit {

  name!: string

  constructor(private dialogRef: MatDialogRef<DialogAddCategoryComponent>) { }

  ngOnInit() {
  }

  selectedFile!: File;
  imagePreview: string | null = null;
  imageBlob!: Blob

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];

      // Crear una vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview = e.target?.result as string;

        this.convertToBlob(this.selectedFile)
      };
      reader.readAsDataURL(this.selectedFile);
      
    }
  }

  convertToBlob(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      this.imageBlob = new Blob([new Uint8Array(arrayBuffer)], { type: file.type });
    };
    reader.readAsArrayBuffer(file);
  }

  save(){
    if(this.name && this.imageBlob){
      this.convertBlobToBase64(this.imageBlob).then((base64Data: string) => {
        const categoryToSave: Category = {
          id: 0,
          imagen: base64Data,
          nombre: this.name,
        };
        this.dialogRef.close(categoryToSave);
      });
    }
  }
  
  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(",")[1]); // Remove the data URL prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  close(){
    this.dialogRef.close(undefined)
  }

}
