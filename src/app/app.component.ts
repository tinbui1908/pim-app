import { Component, OnInit } from '@angular/core';

import { EmployeeService } from './Employee/employee.service';
import { GroupService } from './Group/group.service';
import { ProjectService } from './Project/services/project.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(
		private projectService: ProjectService,
		private groupService: GroupService,
		private employeeService: EmployeeService
	) {}

	ngOnInit() {
		try {
			this.projectService.fetchProjects();
			this.groupService.fetchGroups();
			this.employeeService.fetchEmployees();
		} catch (error) {
			console.log(error.message);
		}
	}
}
