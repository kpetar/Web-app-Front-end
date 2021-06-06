import { faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Redirect } from "react-router";
import api, { ApiResponse } from "../../api/api";
import { ApiConfig } from "../../config/apiConfig";
import ApiArticleDto from "../../dtos/ApiArticleDto";
import AddToCartInput from "../AddToCartInput/AddToCartInput";
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";
import articlePage from './ArticlePage.module.css';

interface ArticlePageProperties
{
    match:{
        params:
        {
            aId:number;
        }
    }
}

interface ArticlePageState
{
    isUserLoggedIn:boolean;
    message:string;
    article?:ApiArticleDto; //dok je undefined ne prikazuje se 
    features:FeatureData[]
}

interface FeatureData{
    name:string;
    value:string;
}

export default class ArticlePage extends React.Component<ArticlePageProperties>
{
    state:ArticlePageState;

    constructor(props: ArticlePageProperties | Readonly<ArticlePageProperties>)
    {
        super(props);

        this.state={
            isUserLoggedIn:true,
            message:'',
            features:[],
        }
    }

    private setLogginState(isLoggedIn:boolean)
    {
        this.setState(Object.assign(this.state,{
            isUserLoggedIn:isLoggedIn
        }));
    }

    private setMessage(message:string)
    {
        this.setState(Object.assign(this.state,{
            message:message
        }));
    }

    private setArticleData(articleData:ApiArticleDto|undefined)
    {
        this.setState(Object.assign(this.state,{
            article:articleData
        }));
    }

    private setFeatureData(featureData:FeatureData[])
    {
        this.setState(Object.assign(this.state,{
            features:featureData
        }));
    }

    componentDidMount(){
        this.getArticleData();
    }
    
    componentDidUpdate(oldProperties:ArticlePageProperties)
    {
    
        if(oldProperties.match.params.aId===this.props.match.params.aId)
        {
            return;
        }
        this.getArticleData();
    }

    private getArticleData()
    {
        api('api/article/' + this.props.match.params.aId, 'get',{})
        .then((res:ApiResponse)=>{
            if(res.status==='login')
            {
                this.setLogginState(false);
                return;
            }
            if(res.status==='error')
            {
                this.setMessage('Ovaj artikal ne postoji');
                this.setArticleData(undefined); //kako ne bi prikazivana u okviru render-a
                this.setFeatureData([]);
                return;
            }

            const data:ApiArticleDto=res.data;

            this.setMessage('');
            this.setArticleData(data);
            
            const features:FeatureData[]=[];

            for(const articleFeature of data.articleFeatures)
            {
                const value=articleFeature.value;
                let name = '';

                for(const feature of data.features)
                {
                    if(feature.featureId===articleFeature.featureId)
                    {
                        name=feature.name;
                        break;
                    }
                }

                features.push({name:name, value:value});
            }

            this.setFeatureData(features);
        })
    }

    render()
    {
        if(this.state.isUserLoggedIn===false)
    {
        return(
            <Redirect to="/user/login"/>
        );
    }

    return(
        <Container>
            <RoledMainMenu role='user'/>
            <Card className={articlePage.Card}>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={faBoxOpen}/> {this.state.article ? this.state.article?.name : 'Artikal nije pronađen'}
                    </Card.Title>

                    {this.printOptionalMessage()}

                    {
                        this.state.article ? 
                        (this.renderArticleData(this.state.article))
                        :''
                    }
                </Card.Body>
            </Card>
            </Container>
    );
    }

    private renderArticleData(article:ApiArticleDto)
    {
        return (
            <Row>
                <Col xs="12" lg="8">
                    <div className="excerpt">
                        { article.excerpt }
                    </div>

                    <hr/>

                    <div className="description">
                        {article.description}
                    </div>

                    <hr/>

                    <b>Karakteristike:</b><br/>

                    <ul className={articlePage.Li}>
                        {this.state.features.map(feature=>(
                            <li>{feature.name} : {feature.value}</li>
                        ),this)}
                    </ul>
                </Col>
                <Col xs="12" lg="4">
                    <Row>
                        <Col xs="12" className="mb-3">
                            <img alt={ 'Image' + article.photos[0].photoId }
                                    src={ ApiConfig.PHOTO_PATH + 'small/' + article.photos[0].imagePath }
                                    className="w-100" title={this.state.article?.name}
                                    />
                        </Col>
                    </Row>
                    <Row>
                        { article.photos.slice(1).map(photo =>(
                            <Col xs="12" sm="6">
                                <img alt={ 'Image' + photo.photoId }
                                    src={ ApiConfig.PHOTO_PATH + 'small/' + photo.imagePath }
                                    className="w-100 mb-3" title={this.state.article?.name}/>
                            </Col>
                        ),this)}
                    </Row>

                    <Row>
                        <Col xs="12" className="text-center mb-3"> 
                            <strong>
                            Cijena: {
                                Number(article.articlePrices[article.articlePrices.length-1].price).toFixed(2)+ ' KM'
                            }
                            </strong>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="12" className="mb-3">
                            <AddToCartInput article={article}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }

    private printOptionalMessage()
    {
        if(this.state.message==='')
        {
            return;
        }
        return (
              <Card.Text>
                {this.state.message}
              </Card.Text>
        );
    }

}