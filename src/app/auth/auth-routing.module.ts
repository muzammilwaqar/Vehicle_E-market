import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AdminComponent } from './admin/admin.component';
import { ChatInboxComponent } from './chat-inbox/chat-inbox.component';
import { CreateAdminComponent } from './admin/create-admin/create-admin.component';
import { AuthGuard } from '../auth/auth.guard';
import { AllUsersComponent } from './admin/all-users/all-users.component';
import { VerifiedUsersComponent } from './admin/verified-users/verified-users.component';
import { UnverifiedUsersComponent } from './admin/unverified-users/unverified-users.component';
const routes: Routes =[
  { path:'login',component:LoginComponent,},
  { path:'signup',component: SignupComponent},
  { path: 'admin', component: AdminComponent,canActivate: [AuthGuard] },
  { path: 'chat',component: ChatInboxComponent,canActivate: [AuthGuard]},
  {path: 'create-admin',component:CreateAdminComponent,canActivate: [AuthGuard] },
  {path:'allusers',component:AllUsersComponent,canActivate:[AuthGuard]},
  {path:'verified',component:VerifiedUsersComponent,canActivate:[AuthGuard]},
  {path:'unverified',component:UnverifiedUsersComponent,canActivate:[AuthGuard]},
]

@NgModule({
  imports:[
    RouterModule.forChild(routes),
    //RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],
  exports:[
    RouterModule
  ]
})

export class AuthRoutingModuel
{

}
