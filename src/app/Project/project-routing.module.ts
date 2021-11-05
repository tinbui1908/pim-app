import { EmployeeResolverService } from './services/employee/employees-resolver.service';
import { GroupResolverService } from './services/group/groups-resolver.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProjectListComponent } from './components/project-list/project-list.component';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { ProjectResolverService } from './services/project/projects-resolver.service';

const routes: Routes = [
	{ path: '', component: ProjectListComponent, resolve: [ProjectResolverService] },
	{ path: 'new', component: NewProjectComponent, resolve: [GroupResolverService, EmployeeResolverService] },
	{
		path: ':projectNumber',
		component: NewProjectComponent,
		resolve: [ProjectResolverService, GroupResolverService, EmployeeResolverService]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ProjectRoutingModule {}
