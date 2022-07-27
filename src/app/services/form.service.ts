import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  countryUrl: string = environment.apiBaseUrl + "/countries";
  stateUrl: string = environment.apiBaseUrl + "/states";

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<any> {

    return this.httpClient.get<any>(this.countryUrl).pipe(
      map(response => {
        return response._embedded.countries
      })
    )
  }

  getStates(code: string): Observable<any> {

    return this.httpClient.get<any>(`${this.stateUrl}/search/findByCountryCode?code=${code}`).pipe(
      map(response => {
        return response._embedded.states
      })
    )
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {

    let months: number[] = [];

    for(let month = startMonth; month <= 12; month++) {
      months.push(month);
    }

    return of(months);
  }

  getCreditCardYears(): Observable<number[]> {

    let years: number[] = [];

    const startYear: number = new Date().getFullYear();

    for(let year = startYear; year <= startYear + 10; year++) {
      years.push(year);
    }

    return of(years);
  }
}
