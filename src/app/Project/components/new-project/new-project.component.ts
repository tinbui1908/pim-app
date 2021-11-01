import { ProjectDataStorageService } from './../../../Shared/Project/project-data-storage.service';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Group } from '../../../Shared/Group/group.model';
import { Employee } from '../../../Shared/Employee/employee.model';
import { ProjectService } from '../../services/project.service';
import { GroupService } from '../../services/group.service';
import { EmployeeService } from '../../services/employee.service';

@Component({
	selector: 'app-new-project',
	templateUrl: './new-project.component.html',
	styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit, OnDestroy {
	projectForm: FormGroup;
	groups: Group[];
	employees: Employee[];
	memberIDs: number[] = [];
	notExistMembers: string = '';

	groupsSubscription!: Subscription;
	employeesSubscription!: Subscription;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private groupService: GroupService,
		private employeeService: EmployeeService,
		private projectService: ProjectService,
		private projectDataStorageService: ProjectDataStorageService
	) {}

	ngOnInit(): void {
		this.initForm();

		this.groups = this.groupService.getGroups();
		this.groupsSubscription = this.groupService.groupsChanged.subscribe((groups: Group[]) => {
			this.groups = groups;
		});

		this.employees = this.employeeService.getEmployees();
		this.employeesSubscription = this.employeeService.employeesChange.subscribe((employees: Employee[]) => {
			this.employees = employees;
		});
	}

	onSubmit() {
		try {
			this.projectForm.get('members').setValue(this.memberIDs);
			this.projectForm.get('groupId').setValue(+this.projectForm.value.groupId);
			this.projectDataStorageService.createNewProject(this.projectForm.value);
			this.projectForm.reset();
			this.onCancel();
		} catch (error) {
			console.log(error.message);
		}
	}
	onCancel() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}

	existNumber(control: FormControl): { [s: string]: boolean } {
		if (this.projectService.getProjects().find((project) => project.projectNumber === control.value)) {
			return { existNumber: true };
		}
		return null;
	}

	checkMembers(visaList: string[]): number[] {
		const memberIDs: number[] = [];
		const employees = this.employees;

		for (let member of visaList) {
			const existEmployee = employees.find((employee) => employee.visa === member);

			if (existEmployee) {
				memberIDs.push(existEmployee.id);
			} else {
				memberIDs.push(0);
			}
		}

		return memberIDs;
	}

	notExistVisa(control: FormControl): Promise<any> | Observable<any> {
		const promise = new Promise<any>((resolve, reject) => {
			setTimeout(() => {
				if (control.value === '') {
					resolve(null);
				}
				const visaList = control.value.split(', ');

				const memberIDs = this.checkMembers(visaList);
				this.notExistMembers = '';

				if (memberIDs.includes(0)) {
					for (let i = 0; i < memberIDs.length; i++) {
						if (memberIDs[i] === 0) {
							this.notExistMembers = this.notExistMembers + visaList[i] + ' ';
						}
					}

					resolve({ notExistVisa: true });
				} else {
					this.memberIDs = memberIDs.slice();
					resolve(null);
				}
			}, 1500);
		});
		return promise;
	}

	private initForm() {
		const today = new Date();
		this.projectForm = new FormGroup({
			projectNumber: new FormControl(null, [Validators.required, this.existNumber.bind(this)]),
			name: new FormControl('', Validators.required),
			customer: new FormControl('', Validators.required),
			groupId: new FormControl(1, Validators.required),
			members: new FormControl('', [], this.notExistVisa.bind(this)),
			status: new FormControl('new', Validators.required),
			startDate: new FormControl(today, Validators.required),
			endDate: new FormControl(null)
		});
	}

	ngOnDestroy() {
		this.employeesSubscription.unsubscribe();
		this.groupsSubscription.unsubscribe();
	}
}
