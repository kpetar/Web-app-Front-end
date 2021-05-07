import React from "react";
import { Redirect } from "react-router";
import { removeTokenData } from "../../api/api";

interface AdministratorLogoutPageState
{
    //da li je komponenta zavrsila odjavu
    done:boolean;
}

export class AdministratorLogoutPage extends React.Component
{
    state:AdministratorLogoutPageState;

    constructor(props: {} | Readonly<{}>)
    {
        super(props);

        this.state={
            done:false,
        }
    }

    private finished()
    {
        this.setState({done:true});
    }

    render()
    {
        if(this.state.done)
        {
            return (
                <Redirect to="/administrator/login/"/>
            );
        }
        return (
            <p>Logging out...</p>
        );
    }

    //kada se komponenta montira i update-uje
    componentDidMount()
    {
        this.doLogout();
    }

    componentDidUpdate()
    {
        this.doLogout();
    }

    doLogout(){
        removeTokenData("administrator");
        this.finished();
    }
}