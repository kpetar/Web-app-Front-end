import { faList, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Card, Col, Container, Form, Row  } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import api, { ApiResponse } from "../../api/api";
import { ApiConfig } from "../../config/apiConfig";
import ArticleType from "../../types/ArticleType";
import CategoryType from "../../types/CategoryTypes";

//u okviru interfejsa se nalaze osobine koje se mogu naci u okviru komponente CategoryPage
interface CategoryPageProperties{
    //Parametri iz URL se ucitavaju u match property koji u sebi ima set parametara params
    //u tim params su pod istim imenom kao i u putanje /:cId
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
    message?:string,
    filters:{
        keywords:string;
        minPrice:number;
        maxPrice:number;
        order:"name asc"|"name desc"|"price asc"|"price desc";
    }
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
            isUserLoggedIn:true,
            filters:{
                keywords:'',
                minPrice:0.01,
                maxPrice:100000.00,
                order:"price asc"
            }
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


        const order=this.state.filters.order.split(' ');
        const orderBy=order[0];
        const orderDirection=order[1].toUpperCase();

        //implementacija dodavanja artikala
        //api/article/search
        api('api/article/searchArticle/','post',{
            categoryId:Number(this.props.match.params.cId),
            keywords:this.state.filters.keywords,
            priceMin:this.state.filters.minPrice,
            priceMax:this.state.filters.maxPrice,
            features:[ ],
            orderBy:orderBy,
            orderDirection:orderDirection
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

  private printFilters()
  {
      return(
          <>
            <Form.Group>
                <Form.Label     htmlFor="keywords">Keywords:</Form.Label>
                    <Form.Control   type="text" id="keywords" value={this.state.filters.keywords}
                                     onChange={(event)=>this.setKeywordsFilter(event as any)}
                    />
            </Form.Group>
            
            <Form.Group>
            <Row>
                <Col xs="12" sm="6">
                <Form.Label     htmlFor="minPrice">Min price:</Form.Label>
                    <Form.Control   type="text" id="minPrice" value={this.state.filters.minPrice}
                                    step="0.01" min="0.01" max="9999.99"
                                     onChange={(event)=>this.setMinPriceFilter(event as any)}
                    />
                </Col>

                <Col xs="12" sm="6">
                <Form.Label     htmlFor="maxPrice">Max price:</Form.Label>
                    <Form.Control   type="text" id="maxPrice" value={this.state.filters.maxPrice}
                                     step="0.01" min="0.02" max="100000"
                                     onChange={(event)=>this.setMaxPriceFilter(event as any)}
                    />
                    
                </Col>
            </Row>
            </Form.Group>

            <Form.Group>
                    <Form.Control   as="select" id="order" value={this.state.filters.order} 
                                    onChange={(event)=>this.setChangeSortOrder(event as any)}
                                    >
                    <option value="name asc">   Sort by name    -ascending</option>
                    <option value="name desc">  Sort by name    -descending</option>
                    <option value="price asc">  Sort by price   -ascending</option>
                    <option value="price desc"> Sort by price   -descending</option>
                    </Form.Control>
            </Form.Group>
            <Form.Group>
                <Button variant="primary" block onClick={()=>this.applyFilters()}>
                    <FontAwesomeIcon icon={faSearch}/>Search
                </Button>
            </Form.Group>
          </>
      );
  }

  private setKeywordsFilter(event: React.ChangeEvent<HTMLInputElement>)
  {
        const newFilter=Object.assign(this.state.filters,{
            keywords:event.target.value
        });
        this.setNewFilter(newFilter);
  } 
  private setMinPriceFilter(event:React.ChangeEvent<HTMLInputElement>)
  {
    this.setNewFilter(Object.assign(this.state.filters,{
        minPrice:Number(event.target.value)
    }));
  }
  private setMaxPriceFilter(event:React.ChangeEvent<HTMLInputElement>)
  {
    this.setNewFilter(Object.assign(this.state.filters,{
        maxPrice:Number(event.target.value)
    }));
  }
  private setChangeSortOrder(event:React.ChangeEvent<HTMLInputElement>)
  {
    this.setNewFilter(Object.assign(this.state.filters,{
        order:event.target.value
    }));
  }
  private applyFilters()
  {
      console.log(this.state.filters);
      this.getCategoryData();
  }
  private setNewFilter(newFilter:any)
  {
     this.setState(Object.assign(this.state,{
         filter:newFilter
     }));
     this.setState(newFilter);
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
                    <Row>
                        <Col md="4" lg="3" xs="12">
                            {this.printFilters()}
                        </Col>
                        <Col md="8" lg="9" xs="12">
                            {this.showArticles()}
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}

}