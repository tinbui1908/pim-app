import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ProjectService } from '../../services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../project.model';

@Component({
	selector: 'app-new-project',
	templateUrl: './new-project.component.html',
	styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {
	projectForm: FormGroup;

	constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router) {}

	ngOnInit(): void {
		this.initForm();
	}

	onSubmit() {
		try {
			this.projectForm.get('GROUP_ID').setValue(+this.projectForm.value.GROUP_ID);
			this.projectService.createNewProject(this.projectForm.value).subscribe((reponse) => {
				this.projectService.listProjects.push(reponse.body);
				this.projectService.listProjectsChange.next(this.projectService.listProjects.slice());
			});
			this.projectForm.reset();
			this.onCancel();
		} catch (error) {
			console.log(error.message);
		}
	}

	onCancel() {
		this.router.navigate(['../'], { relativeTo: this.route });
	}

	private initForm() {
		const today = new Date();
		this.projectForm = new FormGroup({
			PROJECT_NUMBER: new FormControl(null, Validators.required),
			NAME: new FormControl('', Validators.required),
			CUSTOMER: new FormControl('', Validators.required),
			GROUP_ID: new FormControl(1, Validators.required),
			//members: new FormControl([]),
			STATUS: new FormControl('new', Validators.required),
			START_DATE: new FormControl(today, Validators.required),
			END_DATE: new FormControl(null)
		});
	}
}
