import {  faBackward, faEdit, faListUl, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Alert, Button, Card, Container, Form, Modal, Table} from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import ApiFeatureDto from '../../dtos/ApiFeatureDto';
import FeatureType from '../../types/FeatureType';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import administratorDashFeature from '../AdministratorDashboard/AdministratorDashboard.module.css';


interface AdministratorDashboardFeatureState{
  
  isAdministratorLoggedIn:boolean;
  features:FeatureType[];

  addModal:{
      visible:boolean;
      name:string;
      message:string;
  };

  editModal:{
    visible:false;
    featureId?:number;
    name:string;
    message:string;
}
}

interface AdministratorDashboardFeatureProperties{
    //Parametri iz URL se ucitavaju u match property koji u sebi ima set parametara params
    //u tim params su pod istim imenom kao i u putanje /:cId
    match:{
        params:{
            cId:number;
        }
    }
}


 class AdministratorDashboardFeature extends React.Component<AdministratorDashboardFeatureProperties> {
  
  state:AdministratorDashboardFeatureState;

  constructor(props: Readonly<AdministratorDashboardFeatureProperties>)
  {
    super(props);

    this.state={
      isAdministratorLoggedIn:true,
      features:[],
      
      addModal:{
          visible:false,
          name:'',
          message:''
      },

      editModal:{
        visible:false,
        name:'',
        message:''
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
    this.getFeatures()
  }

  componentDidUpdate(oldProps: any)
  {
      if(this.props.match.params.cId===oldProps.match.params.cId)
      {
          return;
      }

      this.getFeatures();
  }
  
  
  private setLogginState(isLoggedIn:boolean){
    
    this.setState(Object.assign(this.state,{
        isAdministratorLoggedIn:isLoggedIn
    }));
  }

  //podaci koji se izvlace
  private getFeatures()
  {
      //nestjx@crud/handling request
      api('/api/feature/?filter=categoryId||$eq||' + this.props.match.params.cId,'get',{}, 'administrator')
      .then((res:ApiResponse)=>{
          if(res.status==='error' || res.status==='login')
          {
              this.setLogginState(false);
              return;
          }

          this.putFeaturesInState(res.data);
          
      })
  }

  private putFeaturesInState(data: ApiFeatureDto[])
  {
    const features:FeatureType[]=data.map(feature=>{
        return {
            featureId:feature.featureId,
            name:feature.name,
            categoryId:feature.categoryId,
        }
    });

    this.setState(Object.assign(this.state,{
        features:features
    }));
    
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
          <Card className={administratorDashFeature.CardArticle}>
              <Card.Body>
                  <Card.Title>
                      <FontAwesomeIcon icon={faListUl}/> Karakteristike
                  </Card.Title>

                <Table hover size="sm" bordered>
                    <thead>
                        <tr>
                            <th colSpan={2}>
                            <Link to="/administrator/dashboard/category/" className="btn btn-sm btn-info">
                                    <FontAwesomeIcon icon={faBackward}/> Nazad na kategorije
                                </Link>
                            </th>
                            <th className="text-center">
                                <Button variant="primary" size="sm"
                                        onClick={()=>this.ShowAddModal()}>
                                    <FontAwesomeIcon icon={faPlus}/> Dodaj
                                </Button>
                            </th>
                        </tr>
                        <tr>
                            <th className="text-right"> Redni broj</th>
                            <th> Naziv </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.features.map(feature=>(
                            <tr>
                                <td className="text-right">{feature.featureId}</td>
                                <td>{feature.name}</td>
                                <td className="text-center">
                                <Button variant="info" size="sm"
                                        onClick={()=>this.showEditModal(feature)}>
                                    <FontAwesomeIcon icon={faEdit}/> Izmjeni
                                </Button>
                                </td>
                            </tr>
                        ), this)}
                    </tbody>
                </Table>                  
              </Card.Body>
          </Card>

            <Modal size="lg" centered show={this.state.addModal.visible} onHide={()=>this.setAddModalVisibleState(false)}>
                <Modal.Header closeButton>
                    <Modal.Title> Dodaj novu karakteristiku</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label htmlFor="name"> Naziv </Form.Label>
                        <Form.Control id="name" type="text" value={this.state.addModal.name}
                                onChange={(e)=>this.setAddModalStringFieldState('name', e.target.value)}/>
                    </Form.Group>
                    
                    <Form.Group>
                        <Button variant="primary" onClick={()=>this.doAddFeature()}>
                            <FontAwesomeIcon icon={faPlus}/> Dodaj 
                        </Button>
                    </Form.Group>
                    {this.state.addModal.message ? (
                        <Alert variant="danger" value={this.state.addModal.message}/>
                    ) : ''}
                </Modal.Body>
            </Modal>

            <Modal size="lg" centered show={this.state.editModal.visible} onHide={()=>this.setEditModalVisibleState(false)}>
                <Modal.Header closeButton>
                    <Modal.Title> Izmjeni karakteristiku</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label htmlFor="name"> Naziv</Form.Label>
                        <Form.Control id="name" type="text" value={this.state.editModal.name}
                                onChange={(e)=>this.setEditModalStringFieldState('name', e.target.value)}/>
                    </Form.Group>
                    
                    <Form.Group>
                        <Button variant="primary" onClick={()=>this.doEdtFeature()}>
                            <FontAwesomeIcon icon={faEdit}/> Izmjeni
                        </Button>
                    </Form.Group>
                    {this.state.editModal.message ? (
                        <Alert variant="danger" value={this.state.editModal.message}/>
                    ) : ''}
                </Modal.Body>
            </Modal>
      </Container>
      
    );
  }

  private ShowAddModal() {
      this.setAddModalStringFieldState('name','');
      this.setAddModalStringFieldState('message','');
      this.setAddModalVisibleState(true);
  }

  //na osnovu category entity iz backend-a jer je u pitanju CRUD 
  private doAddFeature(){
      api('/api/feature/', 'post',{
        name:this.state.addModal.name,
        categoryId:this.props.match.params.cId,
      }, 'administrator')
      .then((res:ApiResponse)=>{
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

          this.setAddModalVisibleState(false);
          this.getFeatures();
      });
  }

  private doEdtFeature()
  {
    api('/api/feature/' + String(this.state.editModal.featureId) + '/', 'patch',{
        name:this.state.editModal.name,
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
          this.getFeatures();
      });
  }

  private showEditModal(feature:FeatureType) {
    this.setEditModalStringFieldState('name',String(feature.name));
    this.setEditModalNumberFieldState('featureId', feature.featureId.toString());
    this.setEditModalStringFieldState('message','');
    this.setEditModalVisibleState(true);
  }
  

}


export default AdministratorDashboardFeature;
