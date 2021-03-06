import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { EnvironmentApiConfiguration } from './api-config';
import { AppComponent } from './app.component';
import { ProjectModule } from './Project/project.module';
import { ErrorComponent } from './error/error.component';
import { ApiConfiguration } from './swagger/api-configuration';

@NgModule({
	declarations: [AppComponent, ErrorComponent],
	imports: [BrowserModule, AppRoutingModule, HttpClientModule, ProjectModule],
	providers: [
		{
			provide: ApiConfiguration,
			useClass: EnvironmentApiConfiguration as any
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
