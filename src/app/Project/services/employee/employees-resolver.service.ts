import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { EmployeeDataStorageService } from './employee-data-storage.service';
import { EmployeeService } from './employee.service';
import { Employee } from './../../components/model/employee.model';

@Injectable()
export class EmployeeResolverService implements Resolve<Employee[]> {
	constructor(
		private employeeDataStorageService: EmployeeDataStorageService,
		private employeeService: EmployeeService
	) {}
	resolve(route: ActivatedRouteSnapshot, status: RouterStateSnapshot) {
		const projects = this.employeeDataStorageService.getEmployees();

		if (projects.length === 0) {
			return this.employeeService.fetchEmployees();
		}

		return projects;
	}
}
