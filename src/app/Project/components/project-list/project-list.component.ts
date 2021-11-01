import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Project } from '../../project.model';
import { ProjectService } from '../../services/project.service';
import { GroupDataStorageService } from './../../../Shared/Group/group-data-storage.service';

@Component({
	selector: 'pim-project-list',
	styleUrls: ['./project-list.component.scss'],
	templateUrl: './project-list.component.html'
})
export class ProjectListComponent implements OnInit, OnDestroy {
	loadedProjects: Project[];
	subscription!: Subscription;

	constructor(private projectService: ProjectService) {}

	ngOnInit() {
		this.loadedProjects = this.projectService.projects;
		this.subscription = this.projectService.projectsChange.subscribe((projects: Project[]) => {
			this.loadedProjects = projects;
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
