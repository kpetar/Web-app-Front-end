import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import { ApiCategoryDto } from '../../dtos/ApiCategoryDto';
import CategoryType from '../../types/CategoryTypes';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface HomePageState{
  
  isLoggedIn:boolean;
  categories?:CategoryType[];

}


 class HomePage extends React.Component {
  
  state:HomePageState;

  constructor(props: {} | Readonly<{}>)
  {
    super(props);

    this.state={
      isLoggedIn:true,
      categories:[]
    }
  }

  
  componentDidMount(){
    this.getCategories();
  }
  
  componentDidUpdate(){
    this.getCategories();
  }

  private getCategories()
  {
    api('api/category/?filter=parentCategoryId||$isnull','get',{})
    .then((res:ApiResponse)=>{
      if(res.status==='error' || res.status==='login')
      {
        this.setLogginState(false);
        return;
      }
      this.putCategoriesInState(res.data);
    })
  }

  
  private putCategoriesInState(data?: ApiCategoryDto[])
  {
    const categories:CategoryType[]|undefined=data?.map(category=>{
      return{
        categoryId:category.categoryId,
        name:category.name,
        items:[],
      };
    });

    const newState=Object.assign(this.state,{
      categories:categories
    });

    this.setState(newState);
  } 

  private setLogginState(isLoggedIn:boolean){
    const newState=Object.assign(this.state,{
      isLoggedIn:isLoggedIn
    })

    this.setState(newState);
  }

  

  
  render()
  {
    if(this.state.isLoggedIn===false)
    {
      return (
        <Redirect to="/user/login"/>
    );
    }
    
    return (
      <Container>
        <RoledMainMenu role='user'/>
          <Col md={{span:10, offset:1}}>
          <Card>
              <Card.Body>
                  <Card.Title>
                      <FontAwesomeIcon icon={faListAlt}/> All category
                  </Card.Title>
                  <Row>
                  {this.state.categories?.map(this.singleCategory)}
                  </Row>
              </Card.Body>
          </Card>
          </Col>
      </Container>
      
    );
  }

  private singleCategory(category:CategoryType)
  {
    return(
      <Col md="4" lg="3" sm="6" xs="12">
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

  
  

}


export default HomePage;
