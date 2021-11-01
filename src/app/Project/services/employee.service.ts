import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Employee } from './../../Shared/Employee/employee.model';

@Injectable()
export class EmployeeService {
	employees: Employee[] = [];
	employeesChange = new Subject<Employee[]>();

	constructor() {}
	setEmployees(employees: Employee[]) {
		this.employees = employees;
		this.employeesChange.next(this.employees.slice());
	}

	getEmployees() {
		return this.employees.slice();
	}
}
