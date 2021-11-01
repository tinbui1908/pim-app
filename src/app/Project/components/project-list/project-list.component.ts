import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Project } from '../../../Shared/Project/project.model';
import { ProjectService } from '../../services/project.service';

@Component({
	selector: 'pim-project-list',
	styleUrls: ['./project-list.component.scss'],
	templateUrl: './project-list.component.html'
})
export class ProjectListComponent implements OnInit, OnDestroy {
	projects: Project[];
	projectSubscription!: Subscription;

	constructor(private projectService: ProjectService) {}

	ngOnInit() {
		this.projects = this.projectService.getProjects();
		this.projectSubscription = this.projectService.projectsChanged.subscribe((projects: Project[]) => {
			this.projects = projects;
		});
	}

	ngOnDestroy() {
		this.projectSubscription.unsubscribe();
	}
}
