import React from "react";
import { MainMenu, MainMenuItems } from "../MainMenu/mainmenu";

interface RoledMainMenuProperties{
    role:'user'|'administrator'|'visitor'
}

export default class RoledMainMenu extends React.Component<RoledMainMenuProperties> {
    render()
    {
        let items:MainMenuItems[]=[];

        switch(this.props.role)
        {
            case 'visitor':items=this.getVisitorItems();break;
            case 'user':items=this.getUserMenuItems();break;
            case 'administrator':items=this.getAdministratorItems();break;

        }

        let showCart=false;
        if(this.props.role==='user')
        {
            showCart=true;
        }

        return <MainMenu items={items} showCart={showCart}/>
    }

    //ocekuje se niz mainmenuitems-a
    getUserMenuItems():MainMenuItems[]
    {
        return [
            new MainMenuItems('Početna','/'),
            new MainMenuItems('Moje narudžbe', "/cart/orders/"),
            new MainMenuItems('Odjavi se','/user/logout/')
        ];
    }

    getAdministratorItems():MainMenuItems[]
    {
        return [
            new MainMenuItems('Administrator', '/administrator/dashboard/'),
            new MainMenuItems('Odjavi se','/administrator/logout/')
        ];
    }

    getVisitorItems():MainMenuItems[]
    {
        return [
            new MainMenuItems('Korisnik prijava','/user/login/'),
            new MainMenuItems('Registruj se', '/user/register/'),
            new MainMenuItems('Administrator prijava', '/administrator/login/'),
        ];
    }

}