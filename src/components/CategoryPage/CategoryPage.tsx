import { faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Col, Container, Row  } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import api, { ApiResponse } from "../../api/api";
import { ApiConfig } from "../../config/apiConfig";
import ArticleType from "../../types/ArticleType";
import CategoryType from "../../types/CategoryTypes";

//u okviru interfejsa se nalaze osobine koje se mogu naci u okviru komponente CategoryPage
interface CategoryPageProperties{
    //Parametri iz URL se ucitavaju u match property koji u sebi ima set parametara params
    //u tim params su pod istim imenom kao i u putanje /:id
    match:{
        params:{
            cId:number;
        }
    }
}

interface CategoryPageState{
    category?:CategoryType,
    articles?:ArticleType[],
    subcategories?:CategoryType[],
    isUserLoggedIn:boolean,
    message?:string
}

interface CategoryDto{
    categoryId:number;
    name:string;
}

interface ArticleDto{
    articleId:number;
    name:string;
    excerpt?:string;
    description?:string;
    articlePrices?:{
        price:number;
        createdAt:string;
    }[],
    photos?:{
        imagePath:string;
    }[]
}


export default class CategoryPage extends React.Component<CategoryPageProperties>{

    state: CategoryPageState;

    constructor(props:Readonly<CategoryPageProperties>){
        super(props);

        this.state={
            isUserLoggedIn:true
        };
    }

    
    componentDidMount(){
        this.getCategoryData();
    }

    componentDidUpdate(newProperties:CategoryPageProperties)
    {

        if(newProperties.match.params.cId===this.props.match.params.cId)
        {
            return;
        }
        this.getCategoryData();
    }

    
  private showSubcategories()
  {
    if(this.state.subcategories?.length===0)
    {
      return;
    }
    return (
      <Row>
        {this.state.subcategories?.map(this.singleCategory)}
      </Row>
    )
  }

  private showArticles()
  {
    if(this.state.articles?.length===0)
    {
      return(
          <div>There are no articles to show</div>
      )
    }
    return (
      <Row>
        {this.state.articles?.map(this.singleArticle)}
      </Row>
    )
  }

  private singleCategory(category:CategoryType)
  {
    return(
      <Col md="3" lg="4" sm="6" xs="12">
      <Card className="mb-3">
        <Card.Body>
            <Card.Title as="p">
                {category.name}
            </Card.Title>
            <Link to={`/category/${category.categoryId}`} className="btn btn-primary btn-block btn-sm">Open category
            </Link>
        </Card.Body>
        </Card>
      </Col>
    );
  }

  private singleArticle(article:ArticleType)
  {
    return(
      <Col md="6" lg="4" sm="6" xs="12">
      <Card className="mb-3">
          <Card.Header>
            <img    alt={article.name}
                    src={ApiConfig.PHOTO_PATH + 'small/' + article.imageUrl}
                    className="w-100"/>
          </Card.Header>
        <Card.Body>
            <Card.Title as="p">
                {article.name}
            </Card.Title>
            <Card.Text>
                {article.excerpt}
            </Card.Text>
            <Card.Text>
                Price: {Number(article.price).toFixed(2)} KM
            </Card.Text>
            <Link to={`/article/${article.articleId}`} className="btn btn-primary btn-block btn-sm">Open article
            </Link>
        </Card.Body>
        </Card>
      </Col>
    );
  }

    


    private getCategoryData(){
        api('api/category/' + this.props.match.params.cId, 'get',{})
        .then((res:ApiResponse)=>{
            if(res.status==='login')
            {
                return this.setLogginState(false);
            }
            if(res.status==='error')
            {
                return this.setMessageError('Request error. Please reload the page!');
            }

            const categoryData:CategoryType={
                categoryId:res.data.categoryId,
                name:res.data.name
            };

            this.setCategoryData(categoryData);

            const subcategories:CategoryType[]=
            res.data.categories.map((category:CategoryDto)=>{
                return {
                    categoryId:category.categoryId,
                    name:category.name
                }
            });

            this.setSubcategories(subcategories);
        });

        //implementacija dodavanja artikala
        //api/article/search
        api('api/article/search/','post',{
            categoryId:Number(this.props.match.params.cId),
            keywords:"",
            priceMin:0.01,
            priceMax:Number.MAX_SAFE_INTEGER,
            features:[ ],
            orderBy:"price",
            orderDirection:"ASC"
        })
        .then((res:ApiResponse)=>{
            if(res.status==='login')
            {
                return this.setLogginState(false);
            }
            if(res.status==='error')
            {
                return this.setMessageError('Request error. Please reload the page!');
            }

            if(res.data.statusCode===0)
            {
                this.setMessageError('');
                this.setArticles([]);
                return;
            }

            const articles:ArticleType[]=
            res.data.map((article:ArticleDto)=>{
             
                const object:ArticleType={
                articleId:article.articleId,
                name:article.name,
                excerpt:article.excerpt,
                description:article.description,
                imageUrl:'',
                price:0
                }

                //ako postoji bar jedna fotografija
                if(article.photos!==undefined && article.photos?.length>0)
                {
                    object.imageUrl=article.photos[article.photos?.length-1].imagePath;
                }
                if(article.articlePrices!==undefined && article.articlePrices?.length>0)
                {
                    object.price=article.articlePrices[article.articlePrices?.length-1].price;
                }

                return object;
            });

            //setovanje novo dobijenih artikala
            this.setArticles(articles);
        })
  }

  private setCategoryData(category:CategoryType)
  {
      const newState=Object.assign(this.state,{
          category:category
      });

      this.setState(newState);
  }
  
  private setSubcategories(subcategories:CategoryType[])
  {
      const newState=Object.assign(this.state,{
        subcategories:subcategories
      });

      this.setState(newState);
  }

  private setArticles(articles:ArticleType[])
  {
      const newState=Object.assign(this.state,{
        articles:articles
      });

      this.setState(newState);
  }

  private setLogginState(isLoggedIn:boolean){
    const newState=Object.assign(this.state,{
      isLoggedIn:isLoggedIn
    })

    this.setState(newState);
  }

  private printOptionalMessage()
  {
      if(this.state.message==='')
      {
          return;
      }
      return (
          <Card.Text>{}</Card.Text>
      )
  }

  private setMessageError(message:string){
    const newState=Object.assign(this.state,{
        message:message
    })

    this.setState(newState);
  }
  

  render(){

    if(this.state.isUserLoggedIn===false)
    {
        return(
            <Redirect to="/user/login"/>
        );
    }

    return(
        <Container>
            <Card>
                <Card.Body>
                    <Card.Title>
                        <FontAwesomeIcon icon={faList}/> {this.state.category?.name}
                    </Card.Title>
                    {this.printOptionalMessage()}

                    {this.showSubcategories()}
                    
                    {this.showArticles()}
                </Card.Body>
            </Card>
        </Container>
    );
}

}