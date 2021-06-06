import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import api, { ApiResponse } from '../../api/api';
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";
import userLoginCss from '../UserLoginPage/UserLoginPage.module.css';

interface UserRegistrationState{
    formData:{
        email:string;
        password:string;
        forename:string;
        surname:string;
        phone:string;
        address:string;
    };
    message?:string;
    isRegistrationComplete:boolean;

}

export  class UserRegistrationPage extends React.Component{

    state:UserRegistrationState;

    constructor(props: Readonly<{}>)
    {
        super(props);

        this.state={
            isRegistrationComplete:false,
            formData:{
                email:'',
                password:'',
                forename:'',
                surname:'',
                phone:'',
                address:''
            }
        };
    }

    

    private renderCompleteRegistrationMessage()
    {
        return(
            <p>Nalog je uspješno kreiran!<br/>
            <Link to="/user/login">Klikni ovdje </Link>za odlazak na prijavu korisnika</p>
        );
    }

    private formInputChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        const newFormData=Object.assign(this.state.formData, {
            [event.target.id]: event.target.value
        });

        const newState=Object.assign(this.state,{
            formData:newFormData
        });

        this.setState(newState);
    }

    private doRegister()
    {
        const data={
            email:this.state.formData?.email,
            password:this.state.formData?.password,
            forename:this.state.formData?.forename,
            surname:this.state.formData?.surname,
            phoneNumber:this.state.formData?.phone,
            postalAddress:this.state.formData?.address
        };
        api('authorization/user/register/', 'post', data)
        .then((res:ApiResponse)=>{
            
            if(res.status==='error')
            {
                this.setErrorMessage('Sistemska greška..Pokušaj ponovo!');
                return;
            }

            
            if(res.data.statusCode!==undefined)
            {
                this.handleErrors(res.data);
                return;
            }
            

            this.registrationComplete(true);
        })
    }

    private handleErrors(data: any)
    {
        let message='';
        switch(data.statusCode)
        {
            case -6001: message='Nalog već postoji!'; break;
        }

        this.setErrorMessage(message);
    }

    private setErrorMessage(message:string)
    {
        //objektu koji predstavlja stari this.state se pridruzuje na mjesto errorMessage novi message
        const newState=Object.assign(this.state,{
            message:message
        });

        this.setState(newState);
    }

    private registrationComplete(isRegComplete:boolean)
    {
        const newState=Object.assign(this.state,{
            isRegistrationComplete:isRegComplete
        })

        this.setState(newState);
    }

    render()
    {
        return(
            <Container >
                <RoledMainMenu role='visitor'/>
                <Col md={{span:8, offset:2}}>
                <Card className={userLoginCss.CardBody}>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faUserPlus}/> Korisnik - registracija
                        </Card.Title>
                        {  
                            (this.state.isRegistrationComplete===false)?
                            this.renderForm() :
                            this.renderCompleteRegistrationMessage()
                         }
                    </Card.Body>
                   
                </Card>
                </Col>
            </Container>
        );
    }

    private renderForm()
    {
        return(
            <>
            <Form>
                <Row>
                <Col md="6">
                    <Form.Group>
                        <Form.Label htmlFor="email"> E-mail</Form.Label>
                        <Form.Control type="email" id="email"
                                    value={this.state.formData.email}
                                    onChange={event=>this.formInputChange(event as any)}  
                                        />
                    </Form.Group>
                </Col>
                <Col md="6">
                    <Form.Group>
                        <Form.Label htmlFor="password"> Lozinka</Form.Label>
                        <Form.Control   type="password" id="password" 
                                        value={this.state.formData.password}
                                        onChange={ event=>this.formInputChange(event as any)}/>
                    </Form.Group>
                </Col>
                </Row>

                <Row> 
                <Col md="6">
                <Form.Group>
                    <Form.Label htmlFor="forename"> Ime</Form.Label>
                    <Form.Control     type="text"  id="forename"
                                      value={this.state.formData.forename}
                                      onChange={ event=>this.formInputChange(event as any)}/>
                </Form.Group>
                </Col>
                
                <Col md="6">
                <Form.Group>
                    <Form.Label htmlFor="surname"> Prezime</Form.Label>
                    <Form.Control   type="text" id="surname" 
                                    value={this.state.formData.surname}
                                    onChange={ event=>this.formInputChange(event as any)}/>
                </Form.Group>
                </Col>
                </Row>
                <Form.Group>
                    <Form.Label htmlFor="phone"> Broj telefona </Form.Label>
                    <Form.Control   id="phone" type="phone"
                                                value={this.state.formData.phone}
                                                onChange={ event=>this.formInputChange(event as any)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="address"> Poštanska adresa</Form.Label>
                    <Form.Control  id="address" as="textarea" rows={4}
                                 value={this.state.formData.address}
                                 onChange={ event=>this.formInputChange(event as any)}/>
                </Form.Group>
                <Form.Group>
                    <Button variant="primary" onClick={()=>this.doRegister()}> Registruj se</Button>
                 </Form.Group>
            </Form>
            <Alert variant="danger" 
            className={this.state.message ? '' : 'd-none'}>
                {this.state.message}
            </Alert>
            </>
        )
    }
}