import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Employee } from '../../model/employee.model';

@Injectable()
export class EmployeeDataStorageService {
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

	getEmployee(id: number) {
		return this.employees.find((employee) => employee.ID === id);
	}
}
