import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Group } from '../../models/group.model';
import { GroupDataStorageService } from './group-data-storage.service';

@Injectable()
export class GroupService {
	constructor(private http: HttpClient, private groupDataStorageService: GroupDataStorageService) {}

	fetchGroups() {
		return this.http
			.get<Group[]>(environment.apiUrl + '/group', {
				responseType: 'json'
			})
			.pipe(
				map((responseData) => {
					const groupsArray: Group[] = [];
					responseData.forEach((item) => {
						groupsArray.push(item);
					});
					return groupsArray;
				}),
				tap((groups: Group[]) => {
					this.groupDataStorageService.setGroups(groups);
				}),
				catchError((errorRes) => {
					return throwError(errorRes);
				})
			);
	}
}
