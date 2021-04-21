import React from 'react';
import { Container, Nav } from 'react-bootstrap';

export class MainMenuItems{
    name:string='';
    link:string='#';

    constructor(name:string, link:string)
    {
        this.name=name;
        this.link=link;
    }
}

interface MainMenuProperties{
    items:MainMenuItems[]
}


export class MainMenu extends React.Component<MainMenuProperties>{
    render()
    {
        return(
            <Container>
                <Nav>
                    {this.props.items.map(this.makeNavLink)}
                </Nav>
            </Container>
            
        );
    }

    private makeNavLink(item:MainMenuItems)
    {
        return(
            <Nav.Link href={item.link}>{item.name}</Nav.Link>
            );
    }
}