import { faListAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import api, { ApiResponse } from '../api/api';
import CategoryType from '../types/CategoryTypes';

interface HomePageState{
  
  isPremision:false;
  categories:CategoryType[];

}

interface ApiCategoryDto{
  categoryId:number;
  name:string;
}

export class HomePage extends React.Component {
  
  state:HomePageState;

  constructor(props: {} | Readonly<{}>)
  {
    super(props);

    this.state={
      isPremision:false,
      categories:[]
    }
  }

  render()
  {
    if(this.state.isPremision===false)
    {
      return (
        <Redirect to="/user/login"/>
    );
    }
    
    return (
      <Container>
          <Col md={{span:10, offset:1}}>
          <Card>
              <Card.Body>
                  <Card.Title>
                      <FontAwesomeIcon icon={faListAlt}/> All category
                  </Card.Title>
                  <Row>
                  {this.state.categories.map(this.singleCategory)}
                  </Row>
              </Card.Body>
          </Card>
          </Col>
      </Container>
      
    );
  }

  componentWillMount(){
    this.getCategories();
  }

  private singleCategory(category:CategoryType)
  {
    return(
      <Col md="3" lg="4" sm="6" xs="12">
      <Card>
        <Card.Body>
            <Card.Title>
                {category.name}
            </Card.Title>
            <Link to={`/category/${category.categoryId}`} className="btn btn-primary">Open category
            </Link>
        </Card.Body>
        </Card>
      </Col>
    );
  }

  private getCategories()
  {
    api('api/category','GET',{})
    .then((res:ApiResponse)=>{
      if(res.status==='error' || res.status==='login')
      {
        this.setPremissionState(false);
        return;
      }
      this.putCategoriesInState(res.data);
    })
  }

  private setPremissionState(isPremission:boolean){
    const newState=Object.assign(this.state,{
      isPremission:isPremission
    })

    this.setState(newState);
  }

  private putCategoriesInState(data: ApiCategoryDto[])
  {
    const categories:CategoryType[]=data.map(category=>{
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
}


export default HomePage;
