import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup,FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-display-new-password',
  templateUrl:'./display-new-password.html',
  styleUrls: ['./display-new-password.css']
  })
  export class DisplayNewPasswordComponent
  {

  }
