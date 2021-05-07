import CartType from "../types/CartType";

//sta sadrzi lista order-a u backendu 
export default interface ApiOrderDto
{
    orderId:number;
    createdAt:string;
    cartId:number;
    status:"rejected" | "accepted" | "shipped" | "pending";
    cart: CartType;
}