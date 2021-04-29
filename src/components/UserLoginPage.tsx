import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Col, Container, Form } from "react-bootstrap";
import { Redirect } from "react-router";
import api, { ApiResponse, saveRefreshToken, saveToken } from '../../src/api/api';

interface UserLoginPageState
{
    email:string;
    password:string;
    errorMessage:string;
    isLoggedIn:boolean;
}

export class UserLoginPage extends React.Component{

    state:UserLoginPageState;

    constructor(props: {} | Readonly<{}>)
    {
        super(props);

        this.state={
            email:'',
            password:'',
            errorMessage:'',
            isLoggedIn:false
        }
    }

    render(){

        if(this.state.isLoggedIn===true)
        {
            return (
                <Redirect to="/"/>
            );
        }

        return(
            <Container>
                <Col md={{span:6, offset:3}}>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faUserAlt}/> User info
                        </Card.Title>
                        <Form>
                            <Form.Group>
                                <Form.Label htmlFor="email">E-mail</Form.Label>
                                <Form.Control   id="email" type="email"
                                                value={this.state.email}
                                                onChange={ event=>this.formInputChange(event)}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor="password">Password</Form.Label>
                                <Form.Control   id="password" type="password"
                                                value={this.state.password}
                                                onChange={ event=>this.formInputChange(event)}/>
                            </Form.Group>
                            <Form.Group>
                                <Button variant="primary" onClick={()=>this.doLogin()}>Log in</Button>
                            </Form.Group>
                        </Form>
                        <Alert variant="danger" className={this.state.errorMessage?'':"d-none"}
                        /> {this.state.errorMessage}
                    </Card.Body>
                </Card>
                </Col>
            </Container>
        );
    }

    
private formInputChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>)
{
    const newState=Object.assign(this.state,{
        [event.target.id]:event.target.value
    })

    this.setState(newState);
}

private doLogin()
{
    api('authorization/user/login', 'POST',{
        email:this.state.email,
        password:this.state.password
    })
    .then((res:ApiResponse)=>{
        if(res.status==='error')
        {
            this.setErrorMessage('System error.. Try again!');
            return;
        }

        if(res.status==='ok')
        {
            if(res.data.statusCode!==undefined)
            {
                let message='';
                switch(res.data.statusCode)
                {
                    case -3001: message='Unknown email'; break;
                    case -3002: message='Bad password'; break;
                }
                this.setErrorMessage(message);
                return;
            }
            saveToken(res.data.token);
            saveRefreshToken(res.data.refreshToken);

            this.setLogginState();
        }
    })
}

private setErrorMessage(message:string)
{
    //objektu koji predstavlja stari this.state se pridruzuje na mjesto errorMessage novi message
    const newState=Object.assign(this.state,{
        errorMessage:message
    });

    this.setState(newState);
}

private setLogginState()
{
    const newState=Object.assign(this.state,{
        isLoggedIn:true
    })

    this.setState(newState);
}
}