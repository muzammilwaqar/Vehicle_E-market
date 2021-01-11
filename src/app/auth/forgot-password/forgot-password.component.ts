import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup,FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-forgot-password',
  templateUrl:'./forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
  })


  export class ForgotPasswordComponent
  {
    isloading =false;
    resetform : FormGroup;
    private authStatusSub: Subscription;

    constructor(public authService: AuthService,public route: ActivatedRoute, private _formBuilder: FormBuilder){}


    ngOnInit()
    {
      this.authStatusSub =  this.authService.getAuthStatusListener().
      subscribe(authStatus => {
        this.isloading = false;
      });
      this.resetform = new FormGroup(
        {
          cnicNumber: new FormControl(null, {validators:[Validators.required, Validators.minLength(13), Validators.maxLength(13)]}),
          privatekey: new FormControl(null, {validators:[Validators.required]})
        });
    }

    onreset()
    {
      if(this.resetform.invalid)
      {
        return;
      }
      else
      {
        this.isloading=true;
        this.authService.forgotpassword
        (
          this.resetform.value.cnicNumber,
          this.resetform.value.privatekey
        );
        this.isloading=false;
      }

    }

  }
