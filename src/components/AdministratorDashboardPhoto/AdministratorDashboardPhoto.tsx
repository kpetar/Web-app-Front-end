import { faBackward, faImages, faMinus, faPlus,  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, Col, Container, Form, Nav, Row} from 'react-bootstrap';
import {  Link, Redirect } from 'react-router-dom';
import api, { apiFile, ApiResponse } from '../../api/api';
import { ApiConfig } from '../../config/apiConfig';
import PhotoType from '../../types/PhotoType';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';

interface AdministratorDashboardPhotoState{
  
  isAdministratorLoggedIn:boolean;
  photos:PhotoType[];
}

interface AdministratorDashboardPhotoProperties{
    //Parametri iz URL se ucitavaju u match property koji u sebi ima set parametara params
    //u tim params su pod istim imenom kao i u putanje /:aId
    match:{
        params:{
            aId:number;
        }
    }
}


 class AdministratorDashboardPhoto extends React.Component<AdministratorDashboardPhotoProperties> {
  
  state:AdministratorDashboardPhotoState;

  constructor(props: Readonly<AdministratorDashboardPhotoProperties>)
  {
    super(props);

    this.state={
      isAdministratorLoggedIn:true,
      photos:[],
    }
  }



  //da li je korisnik ulogovan? Dopremanje podataka za administratora
  //o trenutno ulogovanom korisniku. Uzeti podatke i prikazati ih
  componentDidMount(){
    this.getPhotos()
  }

  componentDidUpdate(oldProps: any)
  {
      if(this.props.match.params.aId===oldProps.match.params.aId)
      {
          return;
      }

      this.getPhotos();
  }
  
  
  private setLogginState(isLoggedIn:boolean){
    
    this.setState(Object.assign(this.state,{
        isAdministratorLoggedIn:isLoggedIn
    }));
  }

  //podaci koji se izvlace
  private getPhotos()
  {
      //nestjx@crud/handling request
      api('/api/article/' + this.props.match.params.aId + '/?join=photos','get',{}, 'administrator')
      .then((res:ApiResponse)=>{
          if(res.status==='error' || res.status==='login')
          {
              this.setLogginState(false);
              return;
          }

          this.setState(Object.assign(this.state,{
            photos:res.data.photos
        }));
          
      })
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
                      <FontAwesomeIcon icon={faImages}/> Photos
                  </Card.Title>

                    <Nav>
                        <Nav.Item>
                            <Link to="/administrator/dashboard/article"
                                className="btn btn-sm btn-info mb-3">
                                    <FontAwesomeIcon icon={faBackward}/> Go back to articles
                                </Link>
                        </Nav.Item>
                    </Nav>

                {/*Ako budu 2 fotografije omoguciti opciju brisanja, ako postoji samo 1 onemoguciti*/}
                    <Row>
                        {this.state.photos.map(this.printSinglePhoto, this)}
                    </Row>

                    <Form className="mt-5">
                        <p>
                            <strong>Add a new photo to this article</strong>
                        </p>
                        <Form.Group>
                            <Form.Label htmlFor="add-photo">New article photo</Form.Label>
                            <Form.File id="add-photo" />
                        </Form.Group>
                        <Form.Group>
                            <Button variant="primary"
                                    onClick={()=>this.doUpload()}>
                                <FontAwesomeIcon icon={faPlus}/> Upload photo
                            </Button>
                        </Form.Group>
                    </Form>
              </Card.Body>
          </Card>

            
      </Container>
      
    );
  }

  private async doUpload()
  {
    const filePicker:any =document.getElementById('add-photo');

    if(filePicker?.files.length===0)
    {
        return;
    }

    const file=filePicker.files[0];
    await this.uploadArticlePhoto(this.props.match.params.aId, file);
    filePicker.value='';

    this.getPhotos();
  }

  private async uploadArticlePhoto(articleId:number, file: File)
  {
    return await apiFile('/api/article/'+ articleId + '/uploadPhoto/','post', 'photo', file, 'administrator');
  }

  private printSinglePhoto(photo:PhotoType)
  {
      return (
          <Col xs="12" sm="6" md="4" lg="3">
              <Card>
                  <Card.Body>
                        <img alt={ "Photo" + photo.photoId}
                             src={ApiConfig.PHOTO_PATH + 'small/' + photo.imagePath}
                             className="w-100"/>
                  </Card.Body>
                  <Card.Footer>
                      {this.state.photos.length > 1 ? (
                          <Button variant="danger" block
                                onClick={()=>this.deletePhoto(photo.photoId)}>
                              <FontAwesomeIcon icon={faMinus}/> Delete photo
                          </Button>
                      ): ''}
                  </Card.Footer>
              </Card>
          </Col>
      );
  }

private deletePhoto(photoId:number)
{

    if(!window.confirm('Are you sure?'))
    {
        return;
    }
    api('/api/article/'+ this.props.match.params.aId +'/deletePhoto/' + photoId + '/', 'delete',{},'administrator')
    .then((res:ApiResponse)=>{
        if(res.status==='error' || res.status==='login')
        {
            this.setLogginState(false);
            return;
        }
        this.getPhotos();
    })
}


}


export default AdministratorDashboardPhoto;
