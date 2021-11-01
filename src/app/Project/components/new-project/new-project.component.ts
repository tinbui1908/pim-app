import { Subscription } from 'rxjs';
import { Employee } from './../../../Employee/employee.model';
import { EmployeeService } from './../../../Employee/employee.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ProjectService } from '../../services/project.service';
import { Group } from './../../../Group/group.model';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from 'src/app/Group/group.service';

@Component({
	selector: 'app-new-project',
	templateUrl: './new-project.component.html',
	styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit, OnDestroy {
	projectForm: FormGroup;
	groupsLoaded: Group[];
	employeesLoaded: Employee[];

	groupsSubscription!: Subscription;
	employeesSubscription!: Subscription;

	constructor(
		private projectService: ProjectService,
		private route: ActivatedRoute,
		private router: Router,
		private groupService: GroupService,
		private employeeService: EmployeeService
	) {}

	ngOnInit(): void {
		this.initForm();
		this.groupsLoaded = this.groupService.groups;
		this.employeesLoaded = this.employeeService.employees;
		this.groupsSubscription = this.groupService.groupsChange.subscribe((groups: Group[]) => {
			this.groupsLoaded = groups;
		});
		this.employeesSubscription = this.employeeService.employeesChange.subscribe((employees: Employee[]) => {
			this.employeesLoaded = employees;
		});
	}

	checkMembers(members: string[]): number[] {
		const membersID: number[] = [];
		for (let member of members) {
			const existEmployee = this.employeesLoaded.find((employee) => employee.visa === member);
			if (existEmployee) {
				membersID.push(existEmployee.id);
			}
		}
		return membersID;
	}

	onSubmit() {
		try {
			const members = this.projectForm.get('members').value.split(', ');

			const membersID = this.checkMembers(members);

			if (membersID.length === members.length) {
				this.projectForm.get('members').setValue(membersID);
			}

			this.projectForm.get('groupId').setValue(+this.projectForm.value.groupId);
			this.projectService.createNewProject(this.projectForm.value);
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
		if (this.projectService.projects.find((project) => project.projectNumber === control.value)) {
			return { existNumber: true };
		}
		return null;
	}

	// existVisa(control: FormControl): { [s: string]: boolean } {
	// 	const members = control.value.split(', ');
	// 	const notExistMembers = [];
	// 	for (let member of members) {
	// 		if (this.employeesLoaded.find((employee) => employee.visa === member)) {
	// 			notExistMembers.push(member);
	// 		}
	// 	}
	// 	if (notExistMembers) {
	// 		this.notExistMembers = notExistMembers;
	// 		return { existMembers: true };
	// 	}
	// 	return null;
	// }

	private initForm() {
		const today = new Date();
		this.projectForm = new FormGroup({
			projectNumber: new FormControl(null, [Validators.required, this.existNumber.bind(this)]),
			name: new FormControl('', Validators.required),
			customer: new FormControl('', Validators.required),
			groupId: new FormControl(1, Validators.required),
			members: new FormControl(''),
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
