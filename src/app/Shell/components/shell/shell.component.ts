import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProjectService } from '../../../Project/services/project.service';
import { Project } from '../../../Project/project.model';

@Component({
	selector: 'pim-shell',
	templateUrl: './shell.component.html',
	styleUrls: ['./shell.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent implements OnInit {
	constructor(private projectService: ProjectService) {}

	ngOnInit() {
		try {
			this.projectService.fetchProjects().subscribe();
		} catch (error) {
			console.log(error.message);
		}
	}
}
