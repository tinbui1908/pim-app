import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { EmployeeDataStorageService } from './employee-data-storage.service';
import { environment } from '../../../../environments/environment';
import { Employee } from '../../models/employee.model';

@Injectable()
export class EmployeeService {
	constructor(
		private http: HttpClient,
		private employeeDataStorageService: EmployeeDataStorageService,
		private router: Router
	) {}
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
					this.employeeDataStorageService.setEmployees(employees);
				}),
				catchError((errorRes) => {
					let route = this.router.config.find((r) => r.path === 'not-found');
					route.data = { message: errorRes.message };
					this.router.navigate(['/not-found']);

					return throwError(errorRes);
				})
			);
	}
}
