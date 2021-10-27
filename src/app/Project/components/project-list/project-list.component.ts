import { Subscription } from 'rxjs';
import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { Project } from '../../project.model';
import { ProjectService } from '../../services/project.service';

@Component({
	selector: 'pim-project-list',
	styleUrls: ['./project-list.component.scss'],
	templateUrl: './project-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy {
	loadedProjects: Project[];
	subscription!: Subscription;

	constructor(private projectService: ProjectService, private ref: ChangeDetectorRef) {}

	ngOnInit() {
		this.loadedProjects = this.projectService.listProjects;
		this.subscription = this.projectService.listProjectsChange.subscribe((projects: Project[]) => {
			this.loadedProjects = projects;
			this.ref.markForCheck();
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
