import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { EmployeeDataStorageService } from './employee-data-storage.service';
import { environment } from '../../../../environments/environment';
import { Employee } from '../../components/model/employee.model';

@Injectable()
export class EmployeeService {
	constructor(private http: HttpClient, private employeeDataStorageService: EmployeeDataStorageService) {}
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
					return throwError(errorRes);
				})
			);
	}
}
