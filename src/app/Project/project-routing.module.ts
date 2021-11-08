import { EmployeeResolverService } from './services/employee/employees-resolver.service';
import { GroupResolverService } from './services/group/groups-resolver.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProjectByIdResolverService } from './services/project/projectById-resolver.service';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { FormProjectComponent } from './components/form-project/form-project.component';
import { ProjectResolverService } from './services/project/projects-resolver.service';

const routes: Routes = [
	{ path: '', component: ProjectListComponent, resolve: [ProjectResolverService] },
	{
		path: 'new',
		component: FormProjectComponent,
		resolve: [ProjectResolverService, GroupResolverService, EmployeeResolverService]
	},
	{
		path: ':projectNumber',
		component: FormProjectComponent,
		resolve: [ProjectResolverService, GroupResolverService, EmployeeResolverService, ProjectByIdResolverService]
	},
	{ path: '**', redirectTo: '../../not-found' }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ProjectRoutingModule {}
