import { EmployeeService } from './../../../Employee/employee.service';
import { Component, OnInit } from '@angular/core';
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
export class NewProjectComponent implements OnInit {
	projectForm: FormGroup;
	groupList: Group[];

	constructor(
		private projectService: ProjectService,
		private route: ActivatedRoute,
		private router: Router,
		private groupService: GroupService,
		private employeeService: EmployeeService
	) {}

	ngOnInit(): void {
		this.initForm();
		this.groupList = this.groupService.listGroups;
	}

	checkMembers(members: string[]) {
		members.map((member) => this.employeeService.fetchEmployeeByVisa(member));
	}
	onSubmit() {
		try {
			const members = this.projectForm.get('members').value.split(',');
			const membersID: number[] = [];

			this.checkMembers(members);
			console.log(this.employeeService.membersID);

			if (membersID.length === members.length) {
				this.projectForm.get('members').setValue(membersID);
				console.log(this.projectForm.get('members').value);
			}

			this.projectForm.get('GROUP_ID').setValue(+this.projectForm.value.GROUP_ID);
			console.log(this.projectForm.get('members').value);
			this.projectForm.get('GROUP_ID').setValue(+this.projectForm.value.GROUP_ID);
			this.projectService.createNewProject(this.projectForm.value).subscribe();
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
		//return { existNumber: true };
		return null;
	}

	private initForm() {
		const today = new Date();
		this.projectForm = new FormGroup({
			PROJECT_NUMBER: new FormControl(null, [Validators.required, this.existNumber.bind(this)]),
			NAME: new FormControl('', Validators.required),
			CUSTOMER: new FormControl('', Validators.required),
			GROUP_ID: new FormControl(1, Validators.required),
			members: new FormControl(''),
			STATUS: new FormControl('new', Validators.required),
			START_DATE: new FormControl(today, Validators.required),
			END_DATE: new FormControl(null)
		});
	}
}
