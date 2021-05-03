import CartType from "./CartType";

export default interface OrderType{
    orderId:number;
    status:string;
    createdAt:string;
    cart:CartType;
}