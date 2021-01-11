import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AngularMaterialModule } from './angular-material.module';

import { PostModule } from './posts/posts.module';

import { AppComponent } from './app.component';
import { ErrorComponent } from './error/error.component';
import { HeaderComponent } from './header/header.component';
import { FotterComponent } from './fotter/fotter.component';
import { SideBarComponent } from './sidebar/sidebar.component';
import { UserProfileComponent } from '../app/auth/user-profile/user-profile.component';
import { HomeComponent } from './home/home.component';
import { SmartContractComponent } from './auth/smart-contract/smart-contract.component';
import { SearchComponent } from './search/search.component';
import { SinglePostComponent } from './posts/single-post/single-post.component';
import { ChatInboxComponent } from '../app/auth/chat-inbox/chat-inbox.component';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { DisplayNewPasswordComponent } from './auth/forgot-password/display-new-password/display-new-password';
import { BlogComponent } from './blog/blog.component.ts';
import { AboutUsComponent } from './About-us/About-us.component';
import { FAQComponent } from './FAQ/FAQ.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SingleBlogComponent } from './blog/single-blog/single-blog.component';
import { EditUserProfileComponent } from './auth/user-profile/edit-details/edit-details.component';
import { InboxComponent } from './auth/inbox/inbox.component';
import { SellerContractComponent } from './auth/seller-contract/seller-contract.component';
import { UserProfilePicComponent } from './auth/user-profile/edit-profilepic.component/edit-profilepic.component';
import { ReviewComponent } from './auth/review/review.component';
import { OtherUserProfileComponent } from './auth/Other-UserProfile/Other-UserProfile.component';
//import { RatingModule } from 'ng-starrating';
import { ChartsModule } from 'ng2-charts';
import { UnAuthorizedComponent } from './unauthorized/unauthorized.component';
import { NgImageSliderModule } from 'ng-image-slider';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent,
    FotterComponent,
    SideBarComponent,
    UserProfileComponent,
    SmartContractComponent,
    SellerContractComponent,
    HomeComponent,
    SearchComponent,
    SinglePostComponent,
    ChatInboxComponent,
    ForgotPasswordComponent,
    DisplayNewPasswordComponent,
    BlogComponent,
    AboutUsComponent,
    FAQComponent,
    ContactUsComponent,
    SingleBlogComponent,
    EditUserProfileComponent,
    InboxComponent,
    UserProfilePicComponent,
    ReviewComponent,
    OtherUserProfileComponent,
    UnAuthorizedComponent
    
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    PostModule,
    NgImageSliderModule,
    //RatingModule,
    FormsModule,
    ChartsModule

  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }

