import { NgModule } from '@angular/core';

import { PIMBaseModule } from '@base';
import { ProjectListComponent } from './components';
import { ProjectRoutingModule } from './project-routing.module';
import { NewProjectComponent } from './components/new-project/new-project.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [ProjectListComponent, NewProjectComponent],
	providers: [],
	imports: [ProjectRoutingModule, PIMBaseModule, ReactiveFormsModule]
})
export class ProjectModule {}
