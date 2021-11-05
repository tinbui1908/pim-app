import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectRoutingModule } from './project-routing.module';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { ProjectDataStorageService } from './services/project/project-data-storage.service';
import { ProjectResolverService } from './services/project/projects-resolver.service';
import { ProjectService } from './services/project/project.service';
import { GroupResolverService } from './services/group/groups-resolver.service';
import { GroupDataStorageService } from './services/group/group-data-storage.service';
import { GroupService } from './services/group/group.service';
import { EmployeeResolverService } from './services/employee/employees-resolver.service';
import { EmployeeDataStorageService } from './services/employee/employee-data-storage.service';
import { EmployeeService } from './services/employee/employee.service';

@NgModule({
	declarations: [ProjectListComponent, NewProjectComponent],
	providers: [
		EmployeeService,
		EmployeeDataStorageService,
		EmployeeResolverService,
		GroupService,
		GroupDataStorageService,
		GroupResolverService,
		ProjectService,
		ProjectDataStorageService,
		ProjectResolverService
	],
	imports: [CommonModule, ProjectRoutingModule, ReactiveFormsModule]
})
export class ProjectModule {}
