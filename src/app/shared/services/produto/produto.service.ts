import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from '../../model/product.model';
import { map, tap } from 'rxjs';
import { FileService } from '../file/file.service';
import { category } from '../../model/category.model';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private URL = `${environment.API_PEDIDOS}/product`
  private http = inject(HttpClient)

  private fileService = inject(FileService)
  private sanitizer = inject(DomSanitizer)

  constructor() { }

  create(product: Product) {
    return this.http.post<Product>(`${this.URL}/create`, product)
  }

  update(id: number, product: Product) {
    return this.http.put<Product>(`${this.URL}/${id}/update`, product)
  }

  getAllToCategory() {
    return this.http.get<category[]>(`${this.URL}/sortByCategory`).pipe(tap(categorys => {
      categorys.forEach(category => {
        category.products.forEach(product => {
          if (product.photoUrl) {
            this.fileService.download(product.photoUrl).subscribe(data => {
              let photo = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(data))
              product.photoObject = photo
            })
          }
        })
      })
    }))
  }

  search(s: string) {
    let params = new HttpParams().append('s', s);
    return this.http
      .get<Product[]>(`${this.URL}/search`, { params: params })
      .pipe(tap(products => {
          products.forEach(product => {
            if (product.photoUrl) {
              this.fileService.download(product.photoUrl).subscribe(blob => {
                product.photoObject = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))
              })
            }
          })
        })
      );
  }
}
