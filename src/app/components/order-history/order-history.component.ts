import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/models/order-history';
import { OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistories: OrderHistory[] = [];
  storage: Storage = sessionStorage;

  constructor(private orderHisotryService: OrderHistoryService) { }

  ngOnInit() {
    this.getOrderHistory();
  }

  getOrderHistory() {
    const email: string = JSON.parse(this.storage.getItem('userEmail'));
    this.orderHisotryService.getOrderHistory(email).subscribe(
      (res) => {
        this.orderHistories = res._embedded.orders;
      }
    );
  }

}
