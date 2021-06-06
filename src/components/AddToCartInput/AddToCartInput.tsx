import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import api, {ApiResponse} from "../../api/api";
import ArticleType from "../../types/ArticleType";
import  './AddToCart.css';

interface AddToCartInputProperties{
    article:ArticleType
}

interface AddToCartInputState{
    quantity:number;
}


export default class AddToCartInput extends React.Component<AddToCartInputProperties>{

    state:AddToCartInputState;

    constructor(props: Readonly<AddToCartInputProperties>)
    {
        super(props);
        
        this.state={
            quantity:1
        }
    }

    private quantityChanged(event:React.ChangeEvent<HTMLInputElement>)
    {
        this.setState({
            quantity:Number(event.target.value)
        });
    }

    private addToCart(){
        const data={
            articleId:this.props.article.articleId,
            quantity:this.state.quantity
        };

        api('api/cart/addToCart/', 'post',data)
        .then((res:ApiResponse)=>{
            if(res.status==='error' || res.status==='login')
            {
                return;
            }

            window.dispatchEvent(new CustomEvent('cart.update'));
        })
    }

    render(){
        return(
            
                  <Form.Group>
                      <Row>
                          <Col xs="4">
                              <Form.Control type="number" min="1"
                                              step="1" value={this.state.quantity} size="sm"
                                              onChange={(event)=>this.quantityChanged(event as any)}/>
                          </Col>
                          <Col xs="8">
                                <Button variant="success" block size="sm"
                                        onClick={()=>this.addToCart()}> Dodaj u korpu <FontAwesomeIcon icon={faCartPlus}/>
                                </Button>
                          </Col>
      
                      </Row>
                  </Form.Group>
                  
          );
    }
}