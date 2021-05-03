import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Alert, Button, Card, Col, Container, Form } from "react-bootstrap";
import { Redirect } from "react-router";
import api, { ApiResponse, saveIdentity, saveRefreshToken, saveToken } from '../../api/api';
import RoledMainMenu from "../RoledMainMenu/RoledMainMenu";

interface AdministratorLoginPageState
{
    username:string;
    password:string;
    errorMessage:string;
    isLoggedIn:boolean;
}

export default class AdministratorLoginPage extends React.Component{

    state:AdministratorLoginPageState;

    constructor(props: {} | Readonly<{}>)
    {
        super(props);

        this.state={
            username:'',
            password:'',
            errorMessage:'',
            isLoggedIn:false
        }
    }

    render(){

        if(this.state.isLoggedIn===true)
        {
            return (
                <Redirect to="/administrator/dashboard/"/>
            );
        }

        return(
            <Container>
                <RoledMainMenu role='visitor'/>
                <Col md={{span:6, offset:3}}>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faUserAlt}/> Administrator info
                        </Card.Title>
                        <Form>
                            <Form.Group>
                                <Form.Label htmlFor="username">Username</Form.Label>
                                <Form.Control   id="username" type="username"
                                                value={this.state.username}
                                                onChange={ event=>this.formInputChange(event as any)}/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label htmlFor="password">Password</Form.Label>
                                <Form.Control   id="password" type="password"
                                                value={this.state.password}
                                                onChange={ event=>this.formInputChange(event as any)}/>
                            </Form.Group>
                            <Form.Group>
                                <Button variant="primary" onClick={()=>this.doLogin()}>Log in</Button>
                            </Form.Group>
                        </Form>
                        <Alert variant="danger"  className={this.state.errorMessage ? '' : 'd-none'}
                        /> {this.state.errorMessage}
                    </Card.Body>
                </Card>
                </Col>
            </Container>
        );
    }

    
private formInputChange(event: React.ChangeEvent<HTMLInputElement>)
{
    const newState=Object.assign(this.state,{
        [event.target.id]:event.target.value
    })

    this.setState(newState);
}

private doLogin()
{
    api('authorization/administrator/login/', 'post',{
        username:this.state.username,
        password:this.state.password
    })
    .then((res:ApiResponse)=>{
        if(res.status==='error')
        {
            return;
        }

        if(res.status==='ok')
        {
            if(res.data.statusCode!==undefined)
            {
                let message='';
                switch(res.data.statusCode)
                {
                    case -3001: message='Unknown username'; break;
                    case -3002: message='Bad password'; break;
                }
                this.setErrorMessage(message);
                return;
            }
            saveToken('administrator',res.data.token);
            saveRefreshToken('administrator',res.data.refreshToken);
            saveIdentity('administrator', res.data.identity);
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