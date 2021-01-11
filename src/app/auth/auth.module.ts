import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AdminComponent } from './admin/admin.component';
import { AngularMaterialModule } from '../angular-material.module';
import { AuthRoutingModuel } from './auth-routing.module';
import { SmartContractComponent } from './smart-contract/smart-contract.component';
import { CreateAdminComponent } from './admin/create-admin/create-admin.component';
import { AllUsersComponent } from './admin/all-users/all-users.component';
import { VerifiedUsersComponent } from './admin/verified-users/verified-users.component';
import { UnverifiedUsersComponent } from './admin/unverified-users/unverified-users.component';

//import { UserProfileComponent } from '../user-profile/user-profile.component';

@NgModule({
  declarations:
    [
      LoginComponent,
      SignupComponent,
      AdminComponent,
      CreateAdminComponent,
      AllUsersComponent,
      VerifiedUsersComponent,
      UnverifiedUsersComponent
    ],
  imports:
    [
      CommonModule,
      AngularMaterialModule,
      FormsModule,
      ReactiveFormsModule,
      AuthRoutingModuel,

    ]
})

export class AuthModule
{

}
