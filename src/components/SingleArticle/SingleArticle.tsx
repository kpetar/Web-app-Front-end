import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import api, {ApiResponse} from "../../api/api";
import { ApiConfig } from "../../config/apiConfig";
import ArticleType from "../../types/ArticleType";

interface SingleArticleProperties{
    article:ArticleType
}

interface SingleArticleState{
    quantity:number;
}


export default class SingleArticle extends React.Component<SingleArticleProperties>{

    state:SingleArticleState;

    constructor(props: Readonly<SingleArticleProperties>)
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
            <Col md="6" lg="4" sm="6" xs="12">
            <Card className="mb-3">
                <Card.Header>
                  <img    alt={this.props.article.name}
                          src={ApiConfig.PHOTO_PATH + 'small/' + this.props.article.imageUrl}
                          className="w-100"/>
                </Card.Header>
              <Card.Body>
                  <Card.Title as="p">
                      {this.props.article.name}
                  </Card.Title>
                  <Card.Text>
                      {this.props.article.excerpt}
                  </Card.Text>
                  <Card.Text>
                      Price: {Number(this.props.article.price).toFixed(2)} KM
                  </Card.Text>
                  <Form.Group>
                      <Row>
                          <Col xs="7">
                              <Form.Control type="number" min="1"
                                              step="1" value={this.state.quantity}
                                              onChange={(event)=>this.quantityChanged(event as any)}/>
                          </Col>
                          <Col xs="5">
                              <Button variant="secondary" block
                                        onClick={()=>this.addToCart()}>Buy</Button>
                          </Col>
      
                      </Row>
                  </Form.Group>
                  <Link to={ `/article/${ this.props.article.articleId }` }
                              className="btn btn-primary btn-block btn-sm">
                            Open article page
                        </Link>
              </Card.Body>
              </Card>
            </Col>
          );
    }
}