import { faRegistered, faUndoAlt, faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Container } from "react-bootstrap";

export class UserLoginPage extends React.Component{
    render(){
        return(
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faUserAlt}/> User info
                        </Card.Title>
                        <Card.Text>
                            Registered form will be soon here..
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}