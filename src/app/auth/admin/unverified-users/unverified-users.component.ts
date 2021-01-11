import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup,FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { AuthSignupData } from '../../auth-signup-data.model';
@Component(
  {
    selector: 'app-',
    templateUrl:'./unverified-users.component.html',
    styleUrls: ['./unverified-users.component.css']
  })

export class UnverifiedUsersComponent
{
    constructor(private authService: AuthService ,public route: ActivatedRoute, private _formBuilder: FormBuilder,private router: Router){}

  unverifiedUsers: AuthSignupData[] = [];
  isloading =false;
  totalUnverifiedUsers = 0;
  unverifiedUsersPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];
  userId :string;
  private postsSub: Subscription;
  private authServiceSub : Subscription;
  userIsAuthenticated =false;
  accountStatus:string;
  verified:boolean ;


  ngOnInit()
    {this.isloading=true;
      this.unverifiedUsers = this.authService.getUnverifiedUsers();
      this.isloading=false;
    }


  onChangedPage(pageData: PageEvent)
  {
    this.currentPage = pageData.pageIndex +1;
    this.unverifiedUsersPerPage = pageData.pageSize;
    this.authService.getUnverifiedUsers();
  }

  ngOnDestroy()
  {}

  onDelete(cnicNumber: number)
  {
    this.isloading = true;
    this.authService.deleteUser(cnicNumber);
    this.isloading=false;
    this.router.navigate(['auth/unverified'])
      .then(() => {
        this.unverifiedUsers = this.authService.getUnverifiedUsers();
      window.location.reload();

  });
  }

  onApprove(cnicNumber:number)
  {
    this.isloading=true;
    this.authService.approveUser(cnicNumber);
    this.isloading=false;
    //this.router.navigate(["auth/unverified"]);
    this.router.navigate(['auth/unverified'])
      .then(() => {
        this.unverifiedUsers = this.authService.getUnverifiedUsers();
      window.location.reload();

  });
  }

  onLogout()
    {
      this.authService.logout();
    }
}
