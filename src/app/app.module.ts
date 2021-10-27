import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { ApiConfiguration } from './swagger/api-configuration';
import { EnvironmentApiConfiguration } from './api-config';
import { AppComponent } from './app.component';
import { ProjectModule } from './Project/project.module';
import { ProjectService } from './Project/services/project.service';
import { GroupService } from 'src/app/Group/group.service';
@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, AppRoutingModule, HttpClientModule, ProjectModule],
	providers: [
		{
			provide: ApiConfiguration,
			useClass: EnvironmentApiConfiguration as any
		},
		ProjectService,
		GroupService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
