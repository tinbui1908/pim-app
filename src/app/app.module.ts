import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { ApiConfiguration } from './swagger/api-configuration';
import { EnvironmentApiConfiguration } from './api-config';
import { AppComponent } from './app.component';
import { ProjectModule } from './Project/project.module';
import { GroupService } from './Project/services/group.service';
import { EmployeeService } from './Project/services/employee.service';
import { ProjectService } from './Project/services/project.service';
import { ErrorComponent } from './error/error.component';

@NgModule({
	declarations: [AppComponent, ErrorComponent],
	imports: [BrowserModule, AppRoutingModule, HttpClientModule, ProjectModule],
	providers: [
		{
			provide: ApiConfiguration,
			useClass: EnvironmentApiConfiguration as any
		},
		ProjectService,
		GroupService,
		EmployeeService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
