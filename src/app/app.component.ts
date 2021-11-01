import { Component, OnInit } from '@angular/core';

import { ProjectService } from './Project/services/project.service';
import { EmployeeDataStorageService } from './Shared/Employee/employee-data-storage.service';
import { GroupDataStorageService } from './Shared/Group/group-data-storage.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(
		private projectService: ProjectService,
		private employeeDataStorageService: EmployeeDataStorageService,
		private groupDataStorageService: GroupDataStorageService
	) {}

	ngOnInit() {
		try {
			this.groupDataStorageService.fetchGroups();
			this.employeeDataStorageService.fetchEmployees();
			this.projectService.fetchProjects();
		} catch (error) {
			console.log(error.message);
		}
	}
}
