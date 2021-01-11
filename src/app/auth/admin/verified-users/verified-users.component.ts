import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup,FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthSignupData } from '../../auth-signup-data.model';
import { PageEvent } from '@angular/material/paginator';


@Component(
  {
    selector: 'app-verified-users',
    templateUrl:'./verified-users.component.html',
    styleUrls: ['./verified-users.component.css']
  })

  export class VerifiedUsersComponent
  {
    constructor(private authService: AuthService ,public route: ActivatedRoute, private _formBuilder: FormBuilder,private router: Router){}


verifiedUsers: AuthSignupData[] = [];
isloading =false;
totalverifiedUsers = 0;
verifiedUsersPerPage = 5;
currentPage = 1;
pageSizeOptions = [1,2,5,10];
userId :string;
private postsSub: Subscription;
private authServiceSub : Subscription;
userIsAuthenticated =false;
accountStatus:string;
verified:boolean ;




ngOnInit()
  {
    this.isloading=true;
    this.verifiedUsers = this.authService.getVerifiedUsers();
    this.isloading=false;
  }


onChangedPage(pageData: PageEvent)
{
  this.currentPage = pageData.pageIndex +1;
  this.verifiedUsersPerPage = pageData.pageSize;
  this.authService.getVerifiedUsers();
}

ngOnDestroy()
{}

onDelete(cnicNumber: number)
{
  this.isloading = true;
  this.authService.deleteUser(cnicNumber);
  this.isloading=false;
  this.router.navigate(['auth/verified'])
      .then(() => {
      window.location.reload();
  });
}

ondisbale(cnicNumber:number)
{
  this.isloading=true;
  this.authService.disableUser(cnicNumber);
  this.isloading=false;
  this.router.navigate(['auth/verified'])
      .then(() => {
      window.location.reload();
  });
}
onLogout()
    {
      this.authService.logout();
    }

  }
