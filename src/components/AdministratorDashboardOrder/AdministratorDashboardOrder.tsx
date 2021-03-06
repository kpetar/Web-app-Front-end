import { faBoxOpen, faCartArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, Container, Modal, Tab, Table, Tabs } from 'react-bootstrap';
import { Redirect } from 'react-router';
import api, { ApiResponse } from '../../api/api';
import ApiOrderDto from '../../dtos/ApiOrderDto';
import CartType from '../../types/CartType';
import OrderType from '../../types/OrderType';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import administratorDashOrder from '../AdministratorDashboard/AdministratorDashboard.module.css';

interface AdministratorDashboardOrderState
{
    //popis svih order-a sa kojim se radi
    orders: ApiOrderDto[];
    //da li je administrator ulogovan
    isAdministratorLoggedIn:boolean;
    cartVisible:boolean;
    cart?:CartType;
}

export default class AdministratorDashboardOrder extends React.Component
{
    state:AdministratorDashboardOrderState;
    
    constructor(props: Readonly<{}>)
    {
        super(props);

        this.state={
            orders:[],
            isAdministratorLoggedIn:true,
            cartVisible:false,
        }
    }

    private setOrders(orders:ApiOrderDto[])
    {
        this.setState(Object.assign(this.state,{
            orders:orders
        }))
    }

    private setLoggedInState(isLoggedIn:boolean)
    {
        this.setState(Object.assign(this.state,{
            isAdministratorLoggedIn:isLoggedIn
        }))
    }

    private setCartVisibleState(visible:boolean)
    {
        const newState=Object.assign(this.state,{
            cartVisible:visible
        });

        this.setState(newState);
    }

    private hideCart()
    {
        this.setCartVisibleState(false);
    }

    private showCart()
    {
        this.setCartVisibleState(true);
    }

    private setCartState(cart:CartType)
    {
        const newState=Object.assign(this.state,{
            cart:cart
        });

        this.setState(newState);
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

    //kada se komponenta ucita uspotavlja se api request
    componentDidMount()
    {
        this.reloadOrders();
    }

    reloadOrders()
    {
        api('/api/order/','get',{},'administrator')
        .then((res:ApiResponse)=>{
            if(res.status==='error' || res.status==='login')
            {
                this.setLoggedInState(false);
                return;
            }
            //tada se uzima res.data i znamo da ce biti niz objekata koji odgovaraju ApiOrderDto
            const data:ApiOrderDto[]=res.data;

            //sada se setuje
            this.setOrders(data);
        });
    }

    changeStatus(orderId:number, newStatus:"pending"|"accepted"|"rejected"|"shipped")
    {
        api('/api/order/' + orderId, 'patch',{newStatus}, 'administrator')
        .then((res:ApiResponse)=>{
            if(res.status==='error' || res.status==='login')
            {
                this.setLoggedInState(false);
                return;
            }
            //ako stignu podaci, reload podataka 
            this.reloadOrders();
        });
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

    private renderOrders(withStatus:"pending"|"accepted"|"rejected"|"shipped")
    {
        return (
            <Table hover size="sm" bordered>
                    <thead>
                        <tr>
                            <th className="text-center pr-2"> Redni broj</th>
                            <th> Datum</th>
                            <th> Korpa</th>
                            <th> Opcije</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.orders.filter(order=>order.status===withStatus).map(order=>(
                            <tr>
                                <td className="text-right pr-2">{order.orderId}</td>
                                <td>{order.createdAt.substr(0, 10)}</td>
                                <td>
                                <Button size="sm" block variant="primary"
                                    onClick={()=>this.setAndShowCart(order.cart)}>
                                        <FontAwesomeIcon icon={faBoxOpen}/>
                                </Button>
                                </td>
                                <td>
                                    {this.printStatusChangeButtons(order)}
                                </td>
                            </tr>
                        ), this)}
                    </tbody>
                </Table>   
        );
    }

    render()
    {
        if(this.state.isAdministratorLoggedIn===false)
    {
      return (
        <Redirect to="/administrator/login"/>
    );
    }

    const sum=this.calculateSum();

    return (
      <Container>
        <RoledMainMenu role='administrator'/>
          <Card className={administratorDashOrder.CardArticle}>
              <Card.Body>
                  <Card.Title>
                      <FontAwesomeIcon icon={faCartArrowDown}/> Porud??bine
                  </Card.Title>

                  <Tabs defaultActiveKey="pending" className="ml-0 mb-0">
                      <Tab eventKey="pending" title=" Na ??ekanju">
                          {this.renderOrders("pending")}
                      </Tab>

                      <Tab eventKey="accepted" title=" Prihva??eno">
                        {this.renderOrders("accepted")}
                      </Tab>

                      <Tab eventKey="shipped" title=" Poslato">
                         {this.renderOrders("shipped")}
                      </Tab>

                      <Tab eventKey="rejected" title=" Odbijeno">
                         {this.renderOrders("rejected")}
                      </Tab>
                  </Tabs>

                      
             </Card.Body>
            </Card>
            <Modal size="lg" centered show={this.state.cartVisible} onHide={()=>this.hideCart()}>
                <Modal.Header closeButton>
                    <Modal.Title> Sadr??aj porud??bine</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table hover size="sm">
                        <thead>
                            <tr>
                                <th> Kategorija</th>
                                <th> Artikal</th>
                                <th className="text-right"> Koli??ina</th>
                                <th className="text-right"> Cijena</th>
                                <th className="text-right"> Ukupno</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.cart?.cartArticles.map(item=>{
                                const articlePrice=this.getLatestPriceBeforeDate(item.article, this.state.cart?.createdAt);
                                const price=Number(articlePrice.price).toFixed(2);
                                const total=Number(articlePrice.price*item.quantity).toFixed(2);
                                return(
                                    <tr>
                                        <td> {item.article.category.name}</td>
                                        <td> {item.article.name}</td>
                                        <td className="text-right"> {item.quantity}</td>
                                        <td className="text-right"> {price} KM</td>
                                        <td className="text-right"> {total} KM</td>
                                    
                                    </tr>
                                )
                            }, this)}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="text-right"> 
                                <strong><i> Ukupno:</i></strong></td>
                                <td className="text-right"><strong><i> {Number(sum).toFixed(2)} KM</i></strong></td>
                            </tr>
                        </tfoot>
                    </Table>
                </Modal.Body>
            </Modal>
            </Container>
    );
    }

    private printStatusChangeButtons(order:OrderType)
    {
        if(order.status === 'pending')
        {
            return (
                <>
                <Button type="button" variant="primary" size="sm" className="mr-1"
                        onClick={()=>this.changeStatus(order.orderId, 'accepted')}> Prihva??eno</Button>
                <Button type="button" variant="danger" size="sm"
                        onClick={()=>this.changeStatus(order.orderId, 'rejected')}> Odbijeno</Button>
                </>
            );
        }

        if(order.status === 'accepted')
        {
            return (
                <>
                <Button type="button" variant="primary" size="sm" className="mr-1"
                        onClick={()=>this.changeStatus(order.orderId, 'shipped')}> Poslato</Button>
                <Button type="button" variant="secondary" size="sm"
                        onClick={()=>this.changeStatus(order.orderId, 'pending')}> Na ??ekanju</Button>
                </>
            );
        }

        if(order.status === '')
        {
            return (
                <>
                </>
            );
        }

        if(order.status === 'rejected')
        {
            return (
                <>
                 <Button type="button" variant="secondary" size="sm"
                        onClick={()=>this.changeStatus(order.orderId, 'pending')}>Vrati na ??ekanju</Button>
                </>
            );
        }
    }
}