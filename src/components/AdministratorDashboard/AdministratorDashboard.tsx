import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import {  Card, Col, Container, Image, Row} from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from '../RoledMainMenu/RoledMainMenu';
import kategorijaSlika from '../../image/kategorije.jpg';
import artikliSlika from '../../image/laptops.png';
import orderSlika from '../../image/order.png';
import administratorDashCss from './AdministratorDashboard.module.css';

interface AdministratorDashboardState{
  
  isAdministratorLoggedIn:boolean;
}


 class AdministratorDashboard extends React.Component {
  
  state:AdministratorDashboardState;

  constructor(props: {} | Readonly<{}>)
  {
    super(props);

    this.state={
      isAdministratorLoggedIn:true,
    }
  }

  //da li je korisnik ulogovan? Dopremanje podataka za administratora
  //o trenutno ulogovanom korisniku. Uzeti podatke i prikazati ih
  componentDidMount(){
    this.getAdminData()
  }
  
  componentDidUpdate(){
    this.getAdminData()
  }

  
  
  private setLogginState(isLoggedIn:boolean){
    
    this.setState(Object.assign(this.state,{
        isAdministratorLoggedIn:isLoggedIn
    }));
  }

  //podaci koji se izvlace
  private getAdminData()
  {
      api('api/administrator/','get',{}, 'administrator')
      .then((res:ApiResponse)=>{
          if(res.status==='error' || res.status==='login')
          {
              this.setLogginState(false);
              return;
          }

          
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
          <Card className={administratorDashCss.Card}>
              <Card.Body>
                  <div className={administratorDashCss.CardTitleOne}>
                      <FontAwesomeIcon icon={faHome}/> Administrator 
                  </div>
                  
                  <Row>
                    <Col lg="4">
                  <Card style={{ width: '18rem' }} className={`${administratorDashCss.CardBorder} "mb-3"`}>
                  <Image src={kategorijaSlika} fluid className={`${administratorDashCss.Image} "card-img-top"`}/>
                  <Card.Body>
                    <Card.Title className={administratorDashCss.CardTitleTwo}><h3> Kategorije</h3></Card.Title>
                    <Card.Text>
                      <p> Izmjeni kategoriju</p>
                    </Card.Text>
                    <Link className={`${administratorDashCss.Link} btn btn-block`} to="/administrator/dashboard/category/"> Kategorije</Link>
                  </Card.Body>
                </Card>
                </Col>

                <Col lg="4">
                <Card style={{ width: '18rem' }} className={`${administratorDashCss.CardBorder} "mb-3 "`}>
                <Image src={artikliSlika} fluid className={`${administratorDashCss.Image} "card-img-top"`}/>
                  <Card.Body>
                    <Card.Title className={administratorDashCss.CardTitleTwo}><h3> Artikli</h3></Card.Title>
                    <Card.Text>
                      <p> Izmjeni artikal</p>
                    </Card.Text>
                    <Link className={`${administratorDashCss.Link} btn btn-block`} to="/administrator/dashboard/article/"> Artikli</Link>
                  </Card.Body>
                </Card>
                </Col>

                <Col lg="4">
                <Card style={{ width: '18rem' }} className={`${administratorDashCss.CardBorder} "mb-3"`}>
                <Image src={orderSlika} fluid className={`${administratorDashCss.Image} "card-img-top"`}/>
                  <Card.Body>
                    <Card.Title className={administratorDashCss.CardTitleTwo}><h3> Porudžbine</h3></Card.Title>
                    <Card.Text>
                      <p> Upravljaj porudžbinama</p>
                    </Card.Text>
                    <Link className={`${administratorDashCss.Link} btn btn-block`} to="/administrator/dashboard/order/"> Porudžbine</Link>
                  </Card.Body>
                </Card>
                </Col>
                </Row>
              </Card.Body>
          </Card>
      </Container>
      
    );
  }

  

}


export default AdministratorDashboard;
