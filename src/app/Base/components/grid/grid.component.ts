import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Project } from '../../../Project/project.model';
import { ProjectService } from '../../../Project/services/project.service';

@Component({
	selector: 'pim-grid',
	templateUrl: './grid.component.html',
	styleUrls: ['./grid.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit, OnDestroy {
	loadedProjects: Project[];
	subscription!: Subscription;

	constructor(private projectService: ProjectService) {}

	ngOnInit() {
		this.loadedProjects = this.projectService.listProjects;
		this.subscription = this.projectService.listProjectsChange.subscribe((projects: Project[]) => {
			this.loadedProjects = projects;
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
