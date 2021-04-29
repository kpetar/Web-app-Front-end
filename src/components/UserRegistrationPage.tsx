import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import api, { ApiResponse } from '../../src/api/api';

interface UserRegistrationState{
    formData:{
        email:string;
        password:string;
        forename:string;
        surname:string;
        phoneNumber:string;
        postalAddress:string;
    },
    message?:string,
    isRegistratonComplete:boolean;

}

export class UserRegistrationPage extends React.Component{

    state:UserRegistrationState;

    constructor(props: {} | Readonly<{}>)
    {
        super(props);

        this.state={
            formData:{
                email:'',
                password:'',
                forename:'',
                surname:'',
                phoneNumber:'',
                postalAddress:''
            },
            message:'',
            isRegistratonComplete:false
        }
    }

    render()
    {
        return(
            <Container>
                <Col md={{span:8, offset:2}}>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faUserPlus}/> User registration
                        </Card.Title>
                        {  
                        (this.state.isRegistratonComplete===false)?
                            this.renderForm():
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
                        <Form.Label htmlFor="email">E-mail</Form.Label>
                        <Form.Control type="email" id="email"
                                    value={this.state.formData?.email}
                                    onChange={event=>this.formInputChange(event)}  
                                        />
                    </Form.Group>
                </Col>
                <Col md="6">
                    <Form.Group>
                        <Form.Label htmlFor="password">Password</Form.Label>
                        <Form.Control   id="password" type="password"
                                                    value={this.state.formData?.password}
                                                    onChange={ event=>this.formInputChange(event)}/>
                    </Form.Group>
                </Col>
                </Row>
                <Row> 
                <Col md="6">
                <Form.Group>
                    <Form.Label htmlFor="forename">Forename</Form.Label>
                    <Form.Control   id="forename" type="forename"
                                                value={this.state.formData?.forename}
                                                onChange={ event=>this.formInputChange(event)}/>
                </Form.Group>
                </Col>
                
                <Col md="6">
                <Form.Group>
                    <Form.Label htmlFor="surname">Surname</Form.Label>
                    <Form.Control   id="surname" type="surname"
                                                value={this.state.formData?.surname}
                                                onChange={ event=>this.formInputChange(event)}/>
                </Form.Group>
                </Col>
                </Row>
                <Form.Group>
                    <Form.Label htmlFor="phone">Phone</Form.Label>
                    <Form.Control   id="phone" type="phone"
                                                value={this.state.formData?.phoneNumber}
                                                onChange={ event=>this.formInputChange(event)}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label htmlFor="address">Postall Address</Form.Label>
                    <Form.Control as="textarea" rows={4} id="address"
                                 value={this.state.formData?.postalAddress}
                                 onChange={ event=>this.formInputChange(event)}/>
                </Form.Group>
                <Form.Group>
                    <Button variant="primary" onClick={()=>this.doRegister()}>Registered</Button>
                 </Form.Group>
            </Form>
            </>
        )
    }

    private renderCompleteRegistrationMessage()
    {
        return(
            <p>The account has been registered<br/>
            <Link to="/user/login">Click here </Link>to go to the login page</p>
        )
    }

    private formInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>)
    {
        const newFormData=Object.assign(this.state.formData, {
            [event.target.id]:event.target.value
        });

        const newState=Object.assign(this.state,{
            formDat:newFormData
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
            phoneNumber:this.state.formData?.phoneNumber,
            postalAddress:this.state.formData?.postalAddress
        }
        api('authorization/user/register', 'POST',data)
        .then((res:ApiResponse)=>{
            if(res.status==='error')
            {
                this.setErrorMessage('System error..Try again!');
                return;
            }

            if(res.status==='ok')
            {
                if(res.data.statusCode!==undefined)
                {
                    let message='';
                    switch(res.data.statusCode)
                    {
                        case -6001: message='Account has not been created'; break;
                    }
                    this.setErrorMessage(message);
                    return;
                }
            }

            this.registrationComplete();
        })
    }

    private setErrorMessage(message:string)
    {
        //objektu koji predstavlja stari this.state se pridruzuje na mjesto errorMessage novi message
        const newState=Object.assign(this.state,{
            message:message
        });

        this.setState(newState);
    }

    private registrationComplete()
    {
        const newState=Object.assign(this.state,{
            isRegistratonComplete:true
        })

        this.setState(newState);
    }
}