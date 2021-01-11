import { Component, OnInit, OnDestroy } from '@angular/core';
import { templateJitUrl } from '@angular/compiler';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';


@Component(
{
  selector: 'app-fotter',
  templateUrl: './fotter.component.html',
  styleUrls: ['./fotter.component.css']
})

export class FotterComponent
{
  userIsAuthenticated = false;
  private authListenerSubs: Subscription;
  constructor(private authService: AuthService){}
}
