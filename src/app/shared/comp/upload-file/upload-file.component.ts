import { Component, inject, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FileService } from '../../services/file/file.service';

@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.scss'
})
export class UploadFileComponent {

  private sanitizer = inject(DomSanitizer)
  private fileService = inject(FileService)

  file?: File

  @Input()
  img?: SafeUrl

  @Input()
  path?: string

  constructor() {
    if (this.path) {
      this.fileService.download(this.path).subscribe(data => {
        this.img = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data))
      })
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.img = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.file))
    }
  }

  onDragLeave(event: DragEvent): void {
    const dropArea = event.currentTarget as HTMLElement;
    dropArea.classList.remove('dragover');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const dropArea = event.currentTarget as HTMLElement;
    dropArea.classList.remove('dragover');
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.file = event.dataTransfer.files[0];
      this.img = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.file))
    }
  }

  upload() {
    if (this.file) {
      return this.fileService.upload(this.file)
    }
    return null
  }

  isSelected(){
    return this.file != undefined && this.file != null
  }
}
