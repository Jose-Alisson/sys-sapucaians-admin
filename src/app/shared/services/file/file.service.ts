import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private http = inject(HttpClient)
  private URL = `${environment.API_MAIN}`

  constructor() { }


  upload(file: File){
    const fd = new FormData();
    fd.append('file', file, file.name);
    return this.http.post<any>(`${this.URL}/upload`, fd)
  }

  download(fileName: string){
    return this.http.get(`${this.URL}/download/${fileName}`, {responseType : 'blob'})
  }
}
