import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentInfo } from '../common/models/payment-info';
import { Purchase } from '../common/models/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl: string = environment.apiBaseUrl + "/checkout/purchase";
  private paymentIntentUrl: string = environment.apiBaseUrl + "/checkout/payment-intent";

  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any> {

    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
}
