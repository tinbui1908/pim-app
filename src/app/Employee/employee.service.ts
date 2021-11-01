import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { Employee } from './employee.model';

@Injectable({
	providedIn: 'root'
})
export class EmployeeService {
	employees: Employee[] = [];
	employeesChange = new Subject<Employee[]>();
	//membersID: number[] = [];

	constructor(private http: HttpClient) {}

	// fetchEmployeeByVisa(visa: string) {
	// 	return this.http
	// 		.get<Employee>(environment.apiUrl + '/employee?visa=' + visa, {
	// 			responseType: 'json'
	// 		})
	// 		.pipe(
	// 			map((responseData) => {
	// 				if (responseData) {
	// 					this.membersID.push(+responseData.id);
	// 				}
	// 				return this.membersID;
	// 			}),
	// 			catchError((errorRes) => {
	// 				return throwError(errorRes);
	// 			})
	// 		)
	// 		.subscribe();
	// }

	fetchEmployees() {
		return this.http
			.get<Employee[]>(environment.apiUrl + '/employee', {
				responseType: 'json'
			})
			.pipe(
				map((responseData) => {
					return responseData;
				}),
				tap((empoyees: Employee[]) => {
					this.employees = empoyees;
					this.employeesChange.next(this.employees.slice());
				}),
				catchError((errorRes) => {
					return throwError(errorRes);
				})
			)
			.subscribe();
	}
}
