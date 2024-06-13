import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'esime-select-image',
  templateUrl: './select-image.component.html',
  styleUrls: ['./select-image.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class SelectImageComponent implements OnInit {
  @Output()
  sendImage: EventEmitter<string> = new EventEmitter<string>();

  @Input()
  imageWidth!: string;

  @Input()
  fieldWidth: string = '100%';

  @Input()
  center: boolean = true;

  selectedFile!: File;
  imagePreview: string | null = null;
  imageBlob!: Blob;

  constructor() {}

  ngOnInit() {}

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];
      const fileType = this.selectedFile.type;
      const validImageTypes = ['image/webp', 'image/jpeg', 'image/png'];

      if (!validImageTypes.includes(fileType)) {
        console.error(
          'Invalid file type. Only webp, jpg, jpeg, and png are allowed.'
        );
        this.sendImage.emit('');
        return;
      }

      // Crear una vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreview = e.target?.result as string;

        this.convertToBlob(this.selectedFile)
          .then((blob) => {
            this.imageBlob = blob;
            return this.convertBlobToBase64(this.imageBlob);
          })
          .then((base64Data: string) => {
            this.sendImage.emit(base64Data);
          })
          .catch((error) => {
            console.error('Error while processing the image:', error);
          });
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  convertToBlob(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const blob = new Blob([new Uint8Array(arrayBuffer)], {
          type: file.type,
        });
        resolve(blob);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
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
}