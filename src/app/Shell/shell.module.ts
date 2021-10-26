import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PIMBaseModule } from '@base';
import { ShellComponent } from './components/shell/shell.component';

@NgModule({
	declarations: [ShellComponent],
	imports: [RouterModule, PIMBaseModule]
})
export class ShellModule {}
