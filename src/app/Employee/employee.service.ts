import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { throwError, Subject, Observable, of } from 'rxjs';

import { environment } from '../environments/environment';
import { Employee } from './employee.model';

@Injectable()
export class EmployeeService {
	membersID: number[];
	constructor(private http: HttpClient) {}

	fetchEmployeeByVisa(visa: string) {
		return this.http
			.get<Employee>(environment.apiUrl + '/employee?visa=' + visa, {
				responseType: 'json'
			})
			.pipe(
				map((responseData) => {
					if (responseData) {
						this.membersID.push(+responseData.ID);
					}
					return this.membersID;
				}),
				catchError((errorRes) => {
					return throwError(errorRes);
				})
			)
			.subscribe();
	}
}
