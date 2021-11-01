import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { EmployeeService } from './../../Project/services/employee.service';
import { environment } from '../../../environments/environment';
import { Employee } from '../Employee/employee.model';

@Injectable({
	providedIn: 'root'
})
export class EmployeeDataStorageService {
	constructor(private http: HttpClient, private employeeService: EmployeeService) {}
	fetchEmployees() {
		return this.http
			.get<Employee[]>(environment.apiUrl + '/employee', {
				responseType: 'json'
			})
			.pipe(
				map((responseData) => {
					return responseData;
				}),
				tap((employees) => {
					this.employeeService.setEmployees(employees);
				}),
				catchError((errorRes) => {
					return throwError(errorRes);
				})
			)
			.subscribe();
	}
}
