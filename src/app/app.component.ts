import { GroupService } from './Group/group.service';
import { Component, OnInit } from '@angular/core';

import { ProjectService } from './Project/services/project.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(private projectService: ProjectService, private groupService: GroupService) {}

	ngOnInit() {
		try {
			this.projectService.fetchProjects().subscribe();
			this.groupService.fetchGroups().subscribe();
		} catch (error) {
			console.log(error.message);
		}
	}
}
