import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

import { Group } from '../../Shared/Group/group.model';

@Injectable()
export class GroupService {
	private groups: Group[] = [];
	groupsChanged = new Subject<Group[]>();

	getGroups() {
		return this.groups.slice();
	}

	setGroups(groups: Group[]) {
		this.groups = groups;
		this.groupsChanged.next(this.groups.slice());
	}
}
