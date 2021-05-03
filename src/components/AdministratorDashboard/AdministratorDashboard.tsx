import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Card, Container} from 'react-bootstrap';
import {  Redirect } from 'react-router-dom';
import api, { ApiResponse, getIdentity } from '../../api/api';

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
          <Card>
              <Card.Body>
                  <Card.Title>
                      <FontAwesomeIcon icon={faHome}/> Administrator Dashboard
                  </Card.Title>
                  ..
              </Card.Body>
          </Card>
      </Container>
      
    );
  }

  

}


export default AdministratorDashboard;
