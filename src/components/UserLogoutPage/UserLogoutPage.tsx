import React from "react";
import { Redirect } from "react-router";
import { removeTokenData } from "../../api/api";

interface UserLogoutPageState
{
    //da li je komponenta zavrsila odjavu
    done:boolean;
}

export class UserLogoutPage extends React.Component
{
    state:UserLogoutPageState;

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
                <Redirect to="/user/login/"/>
            );
        }
        return (
            <p>Odjavljivanje...</p>
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
        removeTokenData("user");
        this.finished();
    }
}