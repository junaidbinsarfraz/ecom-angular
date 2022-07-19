import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productUrl: string = "http://localhost:8080/api/products";
  private productCategoriesUrl: string = "http://localhost:8080/api/product-categories";

  constructor(private httpClient: HttpClient) { }

  getProductCategoryList(): Observable<ProductCategory[]> {
    return this.httpClient.get(this.productCategoriesUrl).pipe(
      map((response: any) => response._embedded.productCategories)
    )
  }

  getProduct(productId: number): Observable<Product> {
    const searchUrl = `${this.productUrl}/${productId}`;

    return this.httpClient.get<Product>(searchUrl);
  }

  getProductList(categoryId: number): Observable<Product[]> {

    const searchUrl = `${this.productUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.getProducts(searchUrl);
  }

  getProductListPaginated(pageNumber: number, pageSize: number, categoryId: number): Observable<GetResponseProducts> {

    const searchUrl = `${this.productUrl}/search/findByCategoryId?id=${categoryId}&page=${pageNumber}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  searchProducts(searchKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.productUrl}/search/findByNameContaining?name=${searchKeyword}`;

    return this.getProducts(searchUrl);
  }

  searchProductsPaginated(pageNumber: number, pageSize: number, searchKeyword: string): Observable<GetResponseProducts> {

    const searchUrl = `${this.productUrl}/search/findByNameContaining?name=${searchKeyword}&page=${pageNumber}&size=${pageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get(searchUrl).pipe(
      map((response: any) => response._embedded.products)
    )
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}