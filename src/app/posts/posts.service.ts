import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from "../../environments/environment";


const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({ providedIn: 'root' })

export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postCount: number }>();
  private check:any;
  private creatorid:string;
  constructor(private http: HttpClient, private router: Router) { }
  private signlepost:Post;


  setCreatorId(creatorid:string){

      this.creatorid = creatorid

  }


  getCreatorId(){

   return this.creatorid

  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    //spread operator ... the three dots to take data from another array and add to this array
    //return [...this.posts];
    this.http.get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                make:post.make,
                city:post.city,
                model:post.model,
                registrationcity: post.registrationcity,
                mileage: post.mileage,
                exteriorcolor: post.exteriorcolor,
                description: post.description,
                price: post.price,
                imagePath: post.imagePath,
                id: post._id,
                enginecapacity: post.enginecapacity,
                enginetype: post.enginetype,
                transmission: post.transmission,
                assembly: post.assembly,
                features: post.features,
                mobilenumber: post.mobilenumber,
                creator: post.creator

              };
            }), maxPosts: postData.maxPosts
          };
        }))
      .subscribe((transformedPosts) => {
        // console.log(transformedPosts);
        this.posts = transformedPosts.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPosts.maxPosts
        });
      });
  }

  getPostUpdate() {
    return this.postsUpdated.asObservable();
  }

  updatePost(id: string, city: string, make: string, model: string,
    registrationcity: string, mileage: string, 
    exteriorcolor: string, description: string, price: string, 
    image: any, image1:any , image2:any, 
    enginetype: string, enginecapacity: string, transmission: string,
     assembly: string, features: string, mobilenumber: string ) {
    //below statement has imagePath :null which needs to be changed afterwards to some specific data
    //const post : Post = {id:id, title:title, content:content, imagePath:null};
    //let postData: Post | FormData;

    const postData = 
    {
      "id": id,
      "city":city,
      "make":make,
      "model":model,
      "registrationcity":registrationcity,
      "mileage":mileage,
      "exteriorcolor":exteriorcolor,
      "description":description,
      "price":price,
      "image0":image,
      "image1":image1,
      "image2":image2,
      "enginetype":enginetype,
      "enginecapacity":enginecapacity,
      "transmission":transmission,
      "assembly":assembly,
      "features":features,
      "mobilenumber":mobilenumber
    }

/*
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append("id", id);
      postData.append("city", city);
      postData.append("make", make);
      postData.append("model", model);
      postData.append("registrationcity", registrationcity);
      postData.append("mileage", mileage);
      postData.append("exteriorcolor", exteriorcolor);
      postData.append("description", description);
      postData.append("price", price);
      postData.append("image", image, make + model);
      postData.append("enginetype", enginetype);
      postData.append("enginecapacity", enginecapacity);
      postData.append("transmission", transmission);
      postData.append("assembly", assembly);
      postData.append("features", features);
      postData.append("mobilenumber", mobilenumber);

    }
    else {
      postData =
      {
        id: id,
        city: city,
        make: make,
        model: model,
        registrationcity: registrationcity,
        exteriorcolor: exteriorcolor,
        mileage: mileage,
        description: description,
        price: price,
        imagePath: image,
        enginetype: enginetype,
        enginecapacity: enginecapacity,
        transmission: transmission,
        assembly: assembly,
        features: features,
        mobilenumber: mobilenumber,
        creator:null
      };
    }*/
    this.http.put(BACKEND_URL + id, postData)
      .subscribe(response => {

        this.router.navigate(["/"]);
      });
  }

getpostobser()
{
  return this.check;
}

getsinglepost(id:string)
{
  
 return this.http.post(BACKEND_URL+"view/"+id,id) ;
}

getPost(id: string) {
  //this.getsinglepost(id);
    return this.http.get<
      {
        _id: string,
        city: string,
        make: string,
        model: string,
        registrationcity: string,
        mileage: string,
        exteriorcolor: string,
        description: string,

        //price
        price: number,

        //images
        imagePath: string,

        //additional information
        enginetype: string,
        enginecapacity: string,
        transmission: string,
        assembly: string,
        features: string,
        //contact information
        mobilenumber: number,
        creator: string
      }
    >(BACKEND_URL + id);

  }

  addPost(city: string, make: string, model: string,
     registrationcity: string, mileage: string, 
     exteriorcolor: string, description: string, price: string, 
     image: any, image1:any , image2:any, 
     enginetype: string, enginecapacity: string, transmission: string,
      assembly: string, features: string, mobilenumber: string)
  //title:string,model:string,engine:string,location:string, content:string , image:File
  {
    /*console.log("city : ",city);
    console.log("make : ",make);
    console.log("model : ",model);
    console.log("registered : ",registrationcity);
    console.log("mileage : ",mileage);
    console.log("exerior : ",exteriorcolor);
    console.log("descition : ",description);
    console.log("price : ",price);
    console.log("post serive image : "+ image);
    console.log("post serive image 1: "+image1);
    console.log("post serive image 2: "+image2);
    console.log("Engine Type : ",enginetype);
    console.log("engine Capaacity : ",enginecapacity);
    console.log("Transmission : ",transmission);
    console.log("assembly : ",assembly);
    console.log("features : ",features);
    console.log("mobile number : ",mobilenumber);
    */
    const postData = 
    {
      "city":city,
      "make":make,
      "model":model,
      "registrationcity":registrationcity,
      "mileage":mileage,
      "exteriorcolor":exteriorcolor,
      "description":description,
      "price":price,
      "image0":image,
      "image1":image1,
      "image2":image2,
      "enginetype":enginetype,
      "enginecapacity":enginecapacity,
      "transmission":transmission,
      "assembly":assembly,
      "features":features,
      "mobilenumber":mobilenumber
    }

    let q= JSON.stringify(postData);
    console.log("Post data post service': "+q);
    this.http.post<{ message: string, post: Post }>
      (BACKEND_URL, postData)
      .subscribe((responseData) => {

        this.router.navigate(["/"]);
      });
  }

  deletepost(postId: string) 
  {
    console.log("post service delete method: "+ postId);
    return this.http.delete(BACKEND_URL +"delete/"+ postId);
  }
/*
  getpostcreator()
  {
    console.log(this.creatorid);
  }*/

  //this bracket is last below



  getuserposts(userid: string)
  {
  
    //console.log("get user post post service: "+userid);
   return this.http.get(BACKEND_URL+"userposts/"+userid);
  }

  storeimage1(image1:File)
  {
    const postData =new FormData();
    postData.append("image",image1,"suzki"+"mehran");
    return this.http.post(BACKEND_URL+"image1",postData);
  }
  storeimage2(image2:File)
  {
    const postData =new FormData();
    postData.append("image",image2,"suzki"+"mehran");
    return this.http.post(BACKEND_URL+"image2",postData);
  }

  storeimage3(image3:File)
  {
    const postData =new FormData();
    postData.append("image",image3,"suzki"+"mehran");
    return this.http.post(BACKEND_URL+"image3",postData);
  }


}
