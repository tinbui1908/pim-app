import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectRoutingModule } from './project-routing.module';
import { NewProjectComponent } from './components/new-project/new-project.component';

@NgModule({
	declarations: [ProjectListComponent, NewProjectComponent],
	providers: [],
	imports: [CommonModule, ProjectRoutingModule, ReactiveFormsModule]
})
export class ProjectModule {}
