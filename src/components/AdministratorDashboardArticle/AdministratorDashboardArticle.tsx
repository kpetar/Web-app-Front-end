import {  faEdit, faList, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Alert, Button, Card, Col, Container, Form, Modal, Row, Table} from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import api, { apiFile, ApiResponse } from '../../api/api';
import ApiArticleDto from '../../dtos/ApiArticleDto';
import { ApiCategoryDto } from '../../dtos/ApiCategoryDto';
import ArticleType from '../../types/ArticleType';
import CategoryType from '../../types/CategoryTypes';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface AdministratorDashboardArticleState{
  
  isAdministratorLoggedIn:boolean;
  articles:ArticleType[];
  categories:CategoryType[];
  status:string[];

  addModal:{
        name:string;
        categoryId:number;
        visible:boolean;
        excerpt:string;
        description:string;
        message:string;
        price:number;
        features:{
            use:number;
            featureId:number;
            name:string;
            value:string;
        }[];
  };

  editModal:{
        articleId?:number;
        name:string;
        categoryId:number;
        visible:boolean;
        excerpt:string;
        description:string;
        isPromoted:number;
        status:string;
        message:string;
        price:number;
        features:{
            use:number;
            featureId:number;
            name:string;
            value:string;
        }[];
};
}

interface FeatureBaseType{
    featureId:number;
    name: string;
}


 class AdministratorDashboardArticle extends React.Component {
  
  state:AdministratorDashboardArticleState;

  constructor(props: {} | Readonly<{}>)
  {
    super(props);

    this.state={
      isAdministratorLoggedIn:true,
      articles:[],
      categories:[],
      status:[
        "available",
        "visible",
        "hidden"
      ],
      
      addModal:{
        name:'',
        categoryId:1,
        visible:false,
        excerpt:'',
        description:'',
        message:'',
        price:0.01,
        features:[],
      },

      editModal:{
        name:'',
        categoryId:1,
        visible:false,
        excerpt:'',
        description:'',
        isPromoted:0,
        status:'available',
        message:'',
        price:0.01,
        features:[],
    }
    }
  }

  private setAddModalVisibleState(newState:boolean)
  {
      this.setState(Object.assign(this.state,
        Object.assign(this.state.addModal,{
            visible:newState
        })));
  }

  private setAddModalStringFieldState(fieldName: string, newValue:string)
  {
    this.setState(Object.assign(this.state,
        Object.assign(this.state.addModal,{
            [fieldName]:newValue
        })));
  }

  private setAddModalNumberFieldState(fieldName: string, newValue:any)
  {
    this.setState(Object.assign(this.state,
        Object.assign(this.state.addModal,{
            [fieldName]:(newValue==='null')?null : Number(newValue)
        })));
  }

  private setAddModalFeatureUse(featureId:number, use:boolean)
  {
    const addFeatures:{featureId:number; use:number;}[] = [...this.state.addModal.features];
    for(const feature of addFeatures)
    {
        if(feature.featureId=== featureId)
        {
            feature.use= use ? 1 :0;
            break;
        }
    }

    this.setState(Object.assign(this.state,Object.assign(this.state.addModal,{
        features:addFeatures
    })));
  }

  private setAddModalFeatureValue(featureId:number, value:string)
  {
    const addFeatures:{featureId:number; value:string;}[] = [...this.state.addModal.features];
    for(const feature of addFeatures)
    {
        if(feature.featureId=== featureId)
        {
            feature.value=value;
            break;
        }
    }

    this.setState(Object.assign(this.state,Object.assign(this.state.addModal,{
        features:addFeatures
    })));
  }


  private setEditModalVisibleState(newState:boolean)
  {
      this.setState(Object.assign(this.state,
        Object.assign(this.state.editModal,{
            visible:newState
        })));
  }

  private setEditModalStringFieldState(fieldName: string, newValue:string)
  {
    this.setState(Object.assign(this.state,
        Object.assign(this.state.editModal,{
            [fieldName]:newValue
        })));
  }

  private setEditModalNumberFieldState(fieldName: string, newValue:any)
  {
    this.setState(Object.assign(this.state,
        Object.assign(this.state.editModal,{
            [fieldName]:(newValue==='null')?null : Number(newValue)
        })));
  }

  //da li je korisnik ulogovan? Dopremanje podataka za administratora
  //o trenutno ulogovanom korisniku. Uzeti podatke i prikazati ih
  componentDidMount(){
      this.getCategories();
      this.getArticles();
  }

  //funkcija koja doprema spisak svih feature-a za odabranu kategoriju
  private async getFeaturesForCategoryId(categoryId:number):Promise<FeatureBaseType[]>
  {
      return new Promise(resolve=>{
        api('/api/feature/?filter=categoryId||$eq||' + categoryId + '/', 'get', {},'administrator')
        .then((res:ApiResponse)=>{
            if(res.status==='error' || res.status==='login')
            {
                this.setLogginState(false);
                return resolve([]);
            }

            const features:FeatureBaseType[]=res.data.map((item:any)=>({
                featureId:item.featureId,
                name:item.name,
            }));

            resolve(features);
        })
      })
      
  }

  private getCategories()
  {
      api('/api/category/','get',{}, 'administrator')
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
        imagePath:category.imagePath,
        parentCategoryId:category.parentCategoryId
      };
    });

    const newState=Object.assign(this.state,{
      categories:categories
    });

    this.setState(newState);
  } 
  
  
  private setLogginState(isLoggedIn:boolean){
    
    this.setState(Object.assign(this.state,{
        isAdministratorLoggedIn:isLoggedIn
    }));
  }

  //podaci koji se izvlace
  private getArticles()
  {
      //moraju se join-ovati podaci koji ce biti prikazani u okviru rezultata
      api('/api/article/?join=articleFeatures&join=features&join=articlePrices&join=photos&join=category','get',{}, 'administrator')
      .then((res:ApiResponse)=>{
          if(res.status==='error' || res.status==='login')
          {
              this.setLogginState(false);
              return;
          }

          this.putArticlesInState(res.data);
          
      })
  }

  private putArticlesInState(data?: ApiArticleDto[])
  {
    const articles:ArticleType[]|undefined=data?.map(article=>{
      return{
        articleId:article.articleId,
        name:article.name,
        excerpt:article.excerpt,
        description:article.description,
        imageUrl:article.photos[0].imagePath,
        price:article.articlePrices[article.articlePrices.length-1].price,

        status:article.status,
        isPromoted:article.isPromoted,
        articleFeatures:article.articleFeatures,
        features:article.features,
        articlePrices:article.articlePrices,
        photos:article.photos,
        category:article.category,
      };
    });


    this.setState(Object.assign(this.state,{
        articles:articles
      }));
  } 

  private async addModalCategoryChanged(event:React.ChangeEvent<HTMLSelectElement>)
  {
        this.setAddModalNumberFieldState('categoryId', event.target.value);
        const features=await this.getFeaturesForCategoryId(this.state.addModal.categoryId);
        const stateFeatures=features.map(feature=>({
            featureId:feature.featureId,
            name:feature.name,
            value:'',
            use:0
        }));

        this.setState(Object.assign(this.state,Object.assign(this.state.addModal,{
            features:stateFeatures
        })));
  }

  
  render()
  {
    if(this.state.isAdministratorLoggedIn===false)
    {
      return (
        <Redirect to="/administrator/login"/>
    );
    }
    
    return (
      <Container>
        <RoledMainMenu role='administrator'/>
          <Card>
              <Card.Body>
                  <Card.Title>
                      <FontAwesomeIcon icon={faList}/> Categories
                  </Card.Title>

                <Table hover size="sm" bordered>
                    <thead>
                        <tr>
                            <th colSpan={6}></th>
                            <th className="text-center">
                                <Button variant="primary" size="sm"
                                        onClick={()=>this.ShowAddModal()}>
                                    <FontAwesomeIcon icon={faPlus}/>Add
                                </Button>
                            </th>
                        </tr>
                        <tr>
                            <th className="text-right">ID</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Promoted</th>
                            <th className="text-right">Price</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.articles.map(article=>(
                            <tr>
                                <td className="text-right">{article.articleId}</td>
                                <td>{article.name}</td>
                                <td>{article.category?.name}</td>
                                <td>{article.status}</td>
                                <td>{article.isPromoted ? 'Yes' : 'No'}</td>
                                <td className="text-right">{article.price}</td>
                                <td className="text-center">
                                <Button variant="info" size="sm"
                                        onClick={()=>this.showEditModal(article)}>
                                    <FontAwesomeIcon icon={faEdit}/>Edit
                                </Button>
                                </td>
                            </tr>
                        ), this)}
                    </tbody>
                </Table>                  
              </Card.Body>
          </Card>

            <Modal size="lg" centered show={this.state.addModal.visible} 
                    onHide={()=>this.setAddModalVisibleState(false)}
                    onEntered={ () => {
                        if (document.getElementById('add-photo'))
                        {
                            const filePicker:any = document.getElementById('add-photo');
                            filePicker.value='';
                        }
                    } }>
                <Modal.Header closeButton>
                    <Modal.Title>Add new article</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form.Group>
                    <Form.Label htmlFor="add-categoryId">Category</Form.Label>
                        <Form.Control id="add-categoryId" as="select" value={this.state.addModal.categoryId.toString()}
                                onChange={(e)=>this.addModalCategoryChanged(e as any)}>
                                    {this.state.categories.map(category=>(
                                        <option value={category.categoryId?.toString()}>
                                            {category.name}
                                        </option>
                                    ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label htmlFor="add-name">Name</Form.Label>
                        <Form.Control id="add-name" type="text" value={this.state.addModal.name}
                                onChange={(e)=>this.setAddModalStringFieldState('name', e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                    <Form.Label htmlFor="add-excerpt">Short text</Form.Label>
                        <Form.Control id="excerpt" type="text" value={this.state.addModal.excerpt}
                                onChange={(e)=>this.setAddModalStringFieldState('excerpt', e.target.value)}/>
                    </Form.Group>
                    <Form.Group>
                    <Form.Label htmlFor="add-description">Detailed text</Form.Label>
                        <Form.Control id="add-description" as="textarea" value={this.state.addModal.description}
                                onChange={(e)=>this.setAddModalStringFieldState('description', e.target.value)}
                                rows={10}/>
                    </Form.Group>
                   
                   {/*
                    <Form.Group>
                    <Form.Label htmlFor="add-status">Status</Form.Label>
                        <Form.Control id="add-status" as="select" value={this.state.addModal.status.toString()}
                                onChange={(e)=>this.setAddModalStringFieldState('status', e.target.value)}>
                                   <option value="available">Available</option>
                                    <option value="visible">Visible</option>
                                    <option value="hidden">Hidden</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                    <Form.Label htmlFor="add-isPromoted">Promoted</Form.Label>
                        <Form.Control id="add-isPromoted" as="select" value={this.state.addModal.isPromoted.toString()}
                                onChange={(e)=>this.setAddModalNumberFieldState('isPromoted', e.target.value)}>
                                <option value="0">Not promoted</option>
                                <option value="1">Is promoted</option>
                        </Form.Control>
                    </Form.Group>

                   */}

                    <Form.Group>
                        <Form.Label htmlFor="add-price">Price</Form.Label>
                        <Form.Control id="add-price" type="number" step={0.01} min={0.01} value={this.state.addModal.price}
                                onChange={(e)=>this.setAddModalNumberFieldState('name', e.target.value)}/>
                    </Form.Group>

                    <div>
                        {this.state.addModal.features.map(this.printAddModalFeatureInput , this)}
                    </div>

                    <Form.Group>
                        <Form.Label htmlFor="add-photo">Article photo</Form.Label>
                        <Form.File id="add-photo" />
                    </Form.Group>

                    <Form.Group>
                        <Button variant="primary" onClick={()=>this.doAddArticle()}>
                            <FontAwesomeIcon icon={faPlus}/>Add new article
                        </Button>
                    </Form.Group>
                    {this.state.addModal.message ? (
                        <Alert variant="danger" value={this.state.addModal.message}/>
                    ) : ''}
                </Modal.Body>
            </Modal>

      </Container>
      
    );
  }

  private printAddModalFeatureInput(feature:any)
  {
    return (
        <Form.Group>
            <Row>
                <Col xs="4" sm="2" className="text-center">
                <input type="checkbox" value="1" checked={feature.use === 1}
                    onChange={ (e)=> this.setAddModalFeatureUse(feature.featureId, e.target.checked)}/>
                </Col>
                <Col xs="8" sm="5">
                    {feature.name}
                </Col>
                <Col xs="12" sm="5">
                <Form.Control type="text" value={feature.value} 
                                onChange={(e)=>this.setAddModalFeatureValue(feature.featureId, e.target.value)}/>
                </Col>
            </Row>
       </Form.Group>
    );
  }

  private ShowAddModal() {
      
      this.setAddModalStringFieldState('message','');
      this.setAddModalStringFieldState('name','');
      this.setAddModalStringFieldState('excerpt','');
      this.setAddModalStringFieldState('description','');
      this.setAddModalNumberFieldState('categoryId', '1');
      this.setAddModalNumberFieldState('price', '0.01');

     

      this.setState(Object.assign(this.state,Object.assign(this.state.addModal,{
          features:[],
      })));

      this.setAddModalVisibleState(true);
  }

  //na osnovu article entity iz backend-a jer je u pitanju CRUD 
  private doAddArticle(){
    const filePicker:any =document.getElementById('add-photo');

    if(filePicker?.files.length===0)
    {
        this.setAddModalStringFieldState('message','You must select a file to upload');
        return;
    }

      api('/api/article/', 'post',{
          categoryId:this.state.addModal.categoryId,
          name:this.state.addModal.name,
          expect:this.state.addModal.excerpt,
          description:this.state.addModal.description,
          price:this.state.addModal.price,
          features:this.state.addModal.features
          .filter(feature=>feature.use===1)
          .map(feature=>({
              featureId:feature.featureId,
              value:feature.value
          }))
      }, 'administrator')
      .then(async (res:ApiResponse)=>{
          if(res.status==='login')
          {
              this.setLogginState(false);
              return;
          }

          if(res.status==='error')
          {
                this.setAddModalStringFieldState('message',JSON.stringify(res.data));
                return;
          }

          const articleId:number=res.data.articleId;

        
          const file = filePicker.files[0];
          await this.uploadArticlePhoto(articleId, file);

          this.setAddModalVisibleState(false);
          this.getArticles();
      });
  }

  private async uploadArticlePhoto(articleId:number, file: File)
  {
    return await apiFile('/api/article/'+ articleId + '/uploadPhoto/','post', 'photo', file, 'administrator');
  }

  private doEdtArticle()
  {
    api('/api/article/' + this.state.editModal.articleId, 'patch',{
      }, 'administrator')
      .then((res:ApiResponse)=>{
          if(res.status==='login')
          {
              this.setLogginState(false);
              return;
          }

          if(res.status==='error')
          {
                this.setEditModalStringFieldState('message',JSON.stringify(res.data));
                return;
          }

          this.setEditModalVisibleState(false);
          this.getArticles();
      });
  }

  private showEditModal(article:ArticleType) {
    this.setEditModalStringFieldState('name',String(article.name));
    this.setEditModalStringFieldState('message','');
    this.setEditModalNumberFieldState('articleId', article.articleId);
    this.setEditModalVisibleState(true);
  }
  

}


export default AdministratorDashboardArticle;
