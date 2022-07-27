import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/models/order-history';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  
  private baseUrl: string = "http://localhost:8080/api/orders/";
  constructor(private httpClient: HttpClient) { }

  getOrderHistory(email: String): Observable<OrderHistoryResponse> {
    const url = `${this.baseUrl}search/findByCustomerEmailOrderByDateCreatedDesc?email=${email}`;

    return this.httpClient.get<OrderHistoryResponse>(url);
  }

}

interface OrderHistoryResponse {
  _embedded: {
    orders: OrderHistory[];
  }
}