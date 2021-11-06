import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Group } from '../../model/group.model';
import { GroupService } from './group.service';
import { GroupDataStorageService } from './group-data-storage.service';

@Injectable()
export class GroupResolverService implements Resolve<Group[]> {
	constructor(private groupDataStorageService: GroupDataStorageService, private groupService: GroupService) {}
	resolve(route: ActivatedRouteSnapshot, status: RouterStateSnapshot) {
		const projects = this.groupDataStorageService.getGroups();

		if (projects.length === 0) {
			return this.groupService.fetchGroups();
		}

		return projects;
	}
}
