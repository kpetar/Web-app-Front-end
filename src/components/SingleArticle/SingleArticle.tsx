import React from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import api, {ApiResponse} from "../../api/api";
import { ApiConfig } from "../../config/apiConfig";
import ArticleType from "../../types/ArticleType";
import AddToCartInput from "../AddToCartInput/AddToCartInput";

interface SingleArticleProperties{
    article:ArticleType
}



export default class SingleArticle extends React.Component<SingleArticleProperties>{


    constructor(props: Readonly<SingleArticleProperties>)
    {
        super(props);
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

                  <AddToCartInput article={this.props.article}/>
                  
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