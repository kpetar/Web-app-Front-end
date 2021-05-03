import React from 'react';
import { Container, Nav } from 'react-bootstrap';
import { HashRouter, Link } from 'react-router-dom';
import Cart from '../Cart/Cart';

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
    items:MainMenuItems[];
}

interface MainMenuState{
    items: MainMenuItems[];
}


export class MainMenu extends React.Component<MainMenuProperties>{

    state:MainMenuState;

    //Da bi se implementirao state, mora da se napravi konstruktor koji uzima set odredjenih property-ja
    constructor(props:Readonly<MainMenuProperties>){
        //mora biti proslijedjen React.Component
        super(props);

        //stanja koja koristi MainMenu komponenta
        this.state={
            //struktura koja cuva odredjene elemente sa kojima stanje moze da se mijenja
            items:props.items
        };
    }

    //funkcija koja omogucava da se nad MainMenu objektom setuje novi set itema
    public setItems(items:MainMenuItems[])
    {
        this.setState({
            items:items
        })
    }
    
    render()
    {
        return(
            <Container>
                <Nav variant="tabs">
                    <HashRouter>
                        {this.state.items.map(this.makeNavLink)}
                        <Cart />
                    </HashRouter>
                </Nav>
            </Container>
            
        );
    }

    private makeNavLink(item:MainMenuItems)
    {
        return(
            <Link to={item.link} className="nav-link">{item.name}</Link>
            );
    }
}