import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
//import { SSL_OP_NO_TLSv1_1 } from 'constants';
import { Subscription } from 'rxjs';
import { PostsService } from 'src/app/posts/posts.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-sellercontract',
  templateUrl:'./seller-contract.component.html',
  styleUrls: ['./seller-contract.component.css']
})

export class SellerContractComponent
{
  isloading =false;
  private authStatusSub: Subscription;
  submitform : FormGroup;
  contractId : string;
  contract:any;
  constructor(public authService: AuthService,public route: ActivatedRoute, public postsService: PostsService,public router: Router)
  {
    this.contractId =  this.route.snapshot.paramMap.get('id');
    console.log("contractid:" +this.contractId);
    this.authService.getcontractdetails(this.contractId).subscribe(result =>
      {
        this.contract = result;
        let q= Object.entries(result);
        //console.log("this.contract: "+q);
      })
  }

  ngOnInit()
  {


  this.authStatusSub =  this.authService.getAuthStatusListener().
  subscribe(() => {
    this.isloading = false;
  });
  this.submitform = new FormGroup({SellerPK : new FormControl(null, {validators:[Validators.required]}),})
  }


  onfinalizecontract()
  {
    if(this.submitform.invalid)
    {
      //console.log("creation contract failed");
      return;
    }
    else
    {
      //check if the key is authentic
      this.authService.checkKey(this.submitform.value.SellerPK).subscribe(result =>
        {

          if(result == true)
          {
            console.log("inside "+result);
            this.isloading = true;
            this.authService.finalizeContract
            (
              this.contractId,
              this.contract.SellerName,
              this.contract.SellerCNIC ,
              this.submitform.value.SellerPK ,
              this.contract.BuyerName,
              this.contract.BuyerCNIC ,
              this.contract.BuyerPK ,
              this.contract.registrationnumber,
              this.contract.price,
              this.contract.make,
              this.contract.model,
              this.contract.registrationcity,
              this.contract.enginetype,
              this.contract.enginecapacity ,
              this.contract.transmission,
              this.contract.exteriorcolor ,
              this.contract.imagePath

             
              
              
              );

              this.postsService.deletepost(this.contract.postID).subscribe(result => 
                {
                  alert("contract Added in Blockchain")
                  
                }
                );
              this.authService.deletecontact(this.contractId);
              
                
                //this.router.navigate(["/review",this.contract.sellerid]);
          }
          else
          {
            alert("Secret Key Error Try Again");
            console.log("inside: "+result);
          }
          this.isloading =false;
          this.submitform.reset();
          //post delete here

          localStorage.removeItem('sellerid');
          localStorage.removeItem('sellerpostid');
        });

    }
  }
  ngOnDestroy()
  {
    this.authStatusSub.unsubscribe();
  }



}
