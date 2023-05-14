import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ListUsersComponent } from './components/list-users/list-users.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './services/auth.guards';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'list', component: ListUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'new', component: CreateUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'settings', component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
