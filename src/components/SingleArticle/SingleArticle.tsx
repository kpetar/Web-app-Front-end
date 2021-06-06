import React from "react";
import {  Card, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ApiConfig } from "../../config/apiConfig";
import ArticleType from "../../types/ArticleType";
import AddToCartInput from "../AddToCartInput/AddToCartInput";
import singleArticle from './SingleArticle.module.css';

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
            <Card className={`${singleArticle.Card} mb-3`}>
                <Card.Header >
                  <img    alt={this.props.article.name}
                          src={ApiConfig.PHOTO_PATH + 'small/' + this.props.article.imageUrl}
                          className="w-100"/>
                </Card.Header>
              <Card.Body className={singleArticle.CardBody}>
                  <Card.Title as="p" className={singleArticle.CardTitle}>
                     {this.props.article.name}
                  </Card.Title>
                  <Card.Text>
                      <strong> Cijena: {Number(this.props.article.price).toFixed(2)} KM</strong>
                  </Card.Text>

                  <AddToCartInput article={this.props.article}/>
                  
                  <Link to={ `/article/${ this.props.article.articleId }` }
                              className={`${singleArticle.btn} btn`}>
                            Stranica o artiklu
                        </Link>
              </Card.Body>
              </Card>
            </Col>
          );
    }
}