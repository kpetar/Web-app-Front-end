import { faList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Container } from "react-bootstrap";
import CategoryType from "../../types/CategoryTypes";

//u okviru interfejsa se nalaze osobine koje se mogu naci u okviru komponente CategoryPage
interface CategoryPageProperties{
    //Parametri iz URL se ucitavaju u match property koji u sebi ima set parametara params
    //u tim params su pod istim imenom kao i u putanje /:id
    match:{
        params:{
            id:number;
        }
    }
}

interface CategoryPageState{
    category?:CategoryType
}

export class CategoryPage extends React.Component<CategoryPageProperties>{

    state: CategoryPageState;

    constructor(props: CategoryPageProperties | Readonly<CategoryPageProperties>){
        super(props);

        this.state={};
    }

    render(){
        return(
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faList}/> {this.state.category?.name}
                        </Card.Title>
                        <Card.Text>Category should be here..</Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    componentWillMount(){
        this.getCategoryData();
    }

    private getCategoryData(){
        setTimeout(()=>{
            const data:CategoryType ={
                name: 'Category' + this.props.match.params.id,
                categoryId:this.props.match.params.id,
                items:[]
        };
        this.setState({
            category:data
        });

    }, 750);
  }

  componentWillReceiveProps(newProperties:CategoryPageProperties)
  {

      if(newProperties.match.params.id===this.props.match.params.id)
      {
          return;
      }
      this.getCategoryData();
  }
}