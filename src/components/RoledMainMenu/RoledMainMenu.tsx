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

        return <MainMenu items={items}/>
    }

    //ocekuje se niz mainmenuitems-a
    getUserMenuItems():MainMenuItems[]
    {
        return [
            new MainMenuItems('Home','/'),
            new MainMenuItems('Contact','/contact/'),
            new MainMenuItems('My Orders', "/cart/orders/"),
            new MainMenuItems('Log out','/user/logout')
        ];
    }

    getAdministratorItems():MainMenuItems[]
    {
        return [
            new MainMenuItems('Dashboard', '/administrator/dashboard/'),
            new MainMenuItems('Log out','/administrator/logout/')
        ];
    }

    getVisitorItems():MainMenuItems[]
    {
        return [
            new MainMenuItems('Log in','/user/login/'),
            new MainMenuItems('Register', '/user/register/'),
            new MainMenuItems('Administrator login', '/administrator/login'),
        ];
    }

}