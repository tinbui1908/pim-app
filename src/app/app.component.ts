import { Component, OnInit } from '@angular/core';

import { EmployeeDataStorageService } from './Shared/Employee/employee-data-storage.service';
import { GroupDataStorageService } from './Shared/Group/group-data-storage.service';
import { ProjectDataStorageService } from './Shared/Project/project-data-storage.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(
		private projectDataStorageService: ProjectDataStorageService,
		private employeeDataStorageService: EmployeeDataStorageService,
		private groupDataStorageService: GroupDataStorageService
	) {}

	ngOnInit() {
		try {
			this.groupDataStorageService.fetchGroups();
			this.employeeDataStorageService.fetchEmployees();
			this.projectDataStorageService.fetchProjects();
		} catch (error) {
			console.log(error.message);
		}
	}
}
