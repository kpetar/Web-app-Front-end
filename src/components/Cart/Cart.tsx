import { faCartArrowDown, faMinusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Form, Modal, Nav, Table } from "react-bootstrap";
import api, { ApiResponse } from "../../api/api";
import CartType from "../../types/CartType";

interface CartState{
    count:number;
    cart?:CartType;
    visible:boolean;
    message:string;
    cartMenuColor:string;
}



export default class Cart extends React.Component{

    state:CartState;

    constructor(props: Readonly<{}>)
    {
        super(props);

        this.state={
            count:0,
            visible:false,
            message:'',
            cartMenuColor:'#000000'
        }
    }

    componentDidMount()
    {
        this.updateCart();
        window.addEventListener("cart.update",() => this.updateCart());
    }

    componentWillUnmount()
    {
        window.removeEventListener("cart.update",() => this.updateCart());
    }

    
    private setStateCount(newCount:number)
    {
        this.setState(Object.assign(this.state,{
            count:newCount
        }));
    }
    private setStateCart(newCart?:CartType)
    {
        this.setState(Object.assign(this.state,{
            cart:newCart
        }));
    }
    private setStateVisible(newVisible:boolean)
    {
        this.setState(Object.assign(this.state,{
            visible:newVisible
        }));
    }

    private setMessageState(newMessage:string)
    {
        this.setState(Object.assign(this.state,{
            message:newMessage
        }));
    }

    private setStateMenuColor(newColor:string)
    {
        this.setState(Object.assign(this.state,{
            cartMenuColor:newColor
        }));
    }

    private updateCart()
    {
        api('/api/cart/', 'get',{})
        .then((res:ApiResponse)=>{
            if(res.status === 'error' || res.status === 'login')
            {
                this.setStateCount(0);
                this.setStateCart(undefined);
                return;
            }

            this.setStateCart(res.data);
            this.setStateCount(res.data.cartArticles.length);

            this.setStateMenuColor('#FF0000');
            setTimeout(() => this.setStateMenuColor('#000000'), 2000);
        });


    }

    private calculateSum():number
    {
        let sum:number=0;
        if(this.state.cart === undefined)
        {
            return sum;
        }
        else
        {
            for(const item of this.state.cart?.cartArticles)
            {
                sum += item.article.articlePrices[item.article.articlePrices.length-1].price * item.quantity;
            }
        }
        return sum;
    }

    private sendCartUpdate(data:any)
    {
        api('/api/cart/', 'patch', data)
        .then((res:ApiResponse)=>{
            if(res.status === 'error'|| res.status === 'login')
            {
                this.setStateCount(0);
                this.setStateCart(undefined);
                return;
            }
            this.setStateCart(res.data);
            this.setStateCount(res.data.cartArticles.length);
        });
    }

    private updateQuantity(event:React.ChangeEvent<HTMLInputElement>)
    {
        const articleId=event.target.dataset.articleId;
        const newQuantity=event.target.value;

        this.sendCartUpdate({
            articleId:Number(articleId),
            quantity:Number(newQuantity),
        });
    }

    private removeFromCart(articleId:number)
    {
        this.sendCartUpdate({
            articleId:Number(articleId),
            quantity:0
        });
    }

    private makeOrder()
    {
        api('/api/cart/makeAnOrder/','post',{})
        .then((res:ApiResponse)=>{
            if(res.status ==='error' || res.status==='login')
            {
                this.setStateCount(0);
                this.setStateCart(undefined);
                return;
            }

            this.setMessageState('Vaša narudžba je uspješno izvršena.');

            this.setStateCart(undefined);
            this.setStateCount(0);
        });
    }

    private hideCart()
    {
        this.setMessageState('');
        this.setStateVisible(false);
    }

   

    render()
    {

        const sum=this.calculateSum();

        return(
            <>
            <Nav.Item>
                <Nav.Link active={false} onClick={()=>this.setStateVisible(true)} style={{color:this.state.cartMenuColor}}>
                <FontAwesomeIcon icon={faCartArrowDown}/> ({this.state.count})
                </Nav.Link>
            </Nav.Item>

            <Modal size="lg" centered show={this.state.visible} onHide={()=>this.hideCart()}>
                <Modal.Header closeButton>
                    <Modal.Title>Vaša korpa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table hover size="sm">
                        <thead>
                            <tr>
                                <th>Kategorija</th>
                                <th>Artikal</th>
                                <th className="text-right">Količina</th>
                                <th className="text-right">Cijena</th>
                                <th className="text-right">Ukupno</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.cart?.cartArticles.map(item=>{
                                
                                const price = Number(item.article.articlePrices[item.article.articlePrices.length-1].price).toFixed(2);
                                const total = Number(item.article.articlePrices[item.article.articlePrices.length-1].price * item.quantity).toFixed(2);
                                return(
                                    <tr>
                                        <td>{item.article.category.name}</td>
                                        <td>{item.article.name}</td>
                                        <td className="text-right">
                                        <Form.Control type="number" step="1" min="1" value={item.quantity}
                                                        data-article-id={item.article.articleId}
                                                        onChange={(e)=>this.updateQuantity(e as any)}/>
                                        </td>
                                        <td className="text-right">{price} KM</td>
                                        <td className="text-right">{total} KM</td>
                                        <td>
                                            <FontAwesomeIcon icon={faMinusSquare} onClick={()=>this.removeFromCart(item.article.articleId)}/>
                                        </td>
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
                                    <strong>Ukupno</strong>
                                    </td>
                                <td className="text-right">{Number(sum).toFixed(2)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </Table>
                    <Alert variant="success" className={ this.state.message ? '' : 'd-none' }> { this.state.message}
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" disabled={ this.state.cart?.cartArticles.length === 0} onClick={()=> this.makeOrder()} >
                        Poruči
                    </Button>
                </Modal.Footer>
            </Modal>
            </>
        )
    }

}

