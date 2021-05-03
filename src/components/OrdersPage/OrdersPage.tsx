import { faBox, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Container, Modal, Table } from "react-bootstrap";
import { Redirect } from "react-router";
import api, { ApiResponse } from "../../api/api";
import ArticleType from "../../types/ArticleType";
import CartType from "../../types/CartType";
import OrderType from "../../types/OrderType";

//indikator da li je korisnik ulogovan
interface OrdersPageState{
    isUserLoggedIn:boolean;
    orders:OrderType[];
    cartVisible:boolean;
    cart?:CartType;
}

//sta se ocekuje da se sadrzi u okviru DTO
interface OrderDto{
    orderId:number;
    createdAt:string;
    status:"rejected"|"accepted"|"shipped"|"pending";
    cart:{
        cartId:number;
        createdAt:string;
        cartArticles:{
            quantity:number;
            article:{
                articleId:number;
                name:string;
                excerpt:string;
                status:"available"|"visible"|"hidden";
                isPromoted:number;
                category:{
                    categoryId:number;
                    name:string;
                };
                articlePrices:{
                    createdAt:string;
                    price:number;
                }[];
                photos:{
                    imagePath:string;
                }[];
            };
        }[];
    };
}


export default class OrderPage extends React.Component{

    state:OrdersPageState;

    constructor(props: Readonly<{}>)
    {
        super(props);

        this.state={
            isUserLoggedIn:true, //pretpostavka je da je ulogovan
            orders:[], //Buduci da jos nisu dopremljeni
            cartVisible:false,
        }
    }

    private setLogginState(isLoggedIn:boolean)
    {
        const newState=Object.assign(this.state,{
            isUserLoggedIn:isLoggedIn
        });

        this.setState(newState);
    }

    private setOrdersState(orders:OrderType[])
    {
        const newState=Object.assign(this.state,{
            orders:orders
        });

        this.setState(newState);
    }

    private setCartVisibleState(visible:boolean)
    {
        const newState=Object.assign(this.state,{
            cartVisible:visible
        });

        this.setState(newState);
    }

    private setCartState(cart:CartType)
    {
        const newState=Object.assign(this.state,{
            cart:cart
        });

        this.setState(newState);
    }

    //kada se ucita komponenta treba inicijalizovati proces koji doprema
    //sve ordere

    componentDidMount()
    {
        this.getOrders();
    }

    componentDidUpdate()
    {
        this.getOrders();
    }

    //Funkcija treba da izvrsi request prema API-ju
    private getOrders() {
        api('/api/cart/orders/', 'get',{})
        .then((res:ApiResponse)=>{
            if(res.status==='error' || res.status==='login')
            {
                return this.setLogginState(false);
            }
            const data:OrderDto[]=res.data;

            const orders:OrderType[]=data.map(order=>({
                orderId:order.orderId,
                status:order.status,
                createdAt:order.createdAt,
                cart:{
                    cartId:order.cart.cartId,
                    user:null,
                    userId:0,
                    createdAt:order.cart.createdAt,
                    cartArticles:order.cart.cartArticles.map(ca=>({
                        cartArticleId:0,
                        articleId:ca.article.articleId,
                        quantity:ca.quantity,
                        article:{
                            articleId:ca.article.articleId,
                            name:ca.article.name,
                            category:{
                                categoryId:ca.article.category.categoryId,
                                name:ca.article.category.name,
                            },
                            articlePrices:ca.article.articlePrices.map(ap=>({
                                articlePriceId:0,
                                createdAt:ap.createdAt,
                                price:ap.price
                            }))
                        }
                    }))
                }
            }));

            this.setOrdersState(orders);
        });
    }

    render()
    {
        if(this.state.isUserLoggedIn===false)
        {
            return(
            <Redirect to="/user/login"/>
                );
        }

        const sum=this.calculateSum();

        return(
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faBox}/> My Orders
                        </Card.Title>

                        <Table hover size="sm">
                        <thead>
                            <tr>
                                <th>Created at</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.orders.map(this.printOrderRow, this)}
                        </tbody>
                    </Table>
                    </Card.Body>
                </Card>

                <Modal size="lg" centered show={this.state.cartVisible} onHide={()=>this.hideCart()}>
                <Modal.Header closeButton>
                    <Modal.Title>Your shopping cart</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table hover size="sm">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Article</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.cart?.cartArticles.map(item=>{
                                const articlePrice=this.getLatestPriceBeforeDate(item.article, this.state.cart?.createdAt);
                                const price=Number(articlePrice.price).toFixed(2);
                                const total=Number(articlePrice.price*item.quantity).toFixed(2);
                                return(
                                    <tr>
                                        <td>{item.article.category.name}</td>
                                        <td>{item.article.name}</td>
                                        <td className="text-right">{item.quantity}</td>
                                        <td className="text-right">{price}KM</td>
                                        <td className="text-right">{total}KM</td>
                                    
                                    </tr>
                                )
                            }, this)}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td></td>
                                <td>Total</td>
                                <td>{Number(sum).toFixed(0)}</td>
                            </tr>
                        </tfoot>
                    </Table>
                </Modal.Body>
            </Modal>
            </Container>
        );
    }

    private setAndShowCart(cart:CartType)
    {
        this.setCartState(cart);
        this.showCart();
    }

    private printOrderRow(order:OrderType)
    {
        return (
            <tr key={order.orderId}>
                <td>{order.createdAt}</td>
                <td>{order.status}</td>
                <td className="text-right">
                    <Button size="sm" block variant="primary"
                        onClick={()=>this.setAndShowCart(order.cart)}>
                            <FontAwesomeIcon icon={faBoxOpen}/>
                    </Button>
                </td>

            </tr>
        )
    }

    private hideCart()
    {
        this.setCartVisibleState(false);
    }

    private showCart()
    {
        this.setCartVisibleState(true);
    }

    private getLatestPriceBeforeDate(article:any, latestDate:any)
    {
        const cartTimeStamp=new Date(latestDate).getTime();


        let price=article.articlePrices[0];

            for(let ap of article.articlePrices)
                {
                    const articlePriceTimeStamp=new Date(ap.createdAt).getTime();

                    if(articlePriceTimeStamp<cartTimeStamp)
                    {
                        price=ap;
                    }
                    else{
                         break;
                    }
                }
                return price;
    }

    private calculateSum():number
    {
        //uzima se cijena kada je napravljena korpa, nece uzimati poslednju cijenu
        let sum:number=0;

        if(this.state.cart===undefined)
        {
            return sum;
        }
        else
        {
            for(const item of this.state.cart?.cartArticles)
            {
                let price= this.getLatestPriceBeforeDate(item.article, this.state.cart.createdAt);
                sum+=price.price*item.quantity;
            }
        }

        return sum;
    }
}