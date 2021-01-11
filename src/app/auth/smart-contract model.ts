export interface SmartContractData
{
  SellerName:string;
  SellerCNIC: string;
  SellerPK: string;

  BuyerName:string;
  BuyerCNIC: string;
  BuyerPK: string;

  registrationnumber:string;

  make:string;
  model:string;
  city:string;
  registrationcity:string;
  mileage:string;
  exteriorcolor: string;
  description: string;

  //price
  price: string;

  //images
  imagePath: string;

  //additional information
  enginetype:string;
  enginecapacity:string;
  transmission:string;
  assembly:string;
  features:string;

}
