import React from "react";
import swschema from './schema/serverlessworkflowschema';
import { Jumbotron } from 'react-bootstrap';
import Form from "react-jsonschema-form";
import exportFromJSON from 'export-from-json'

class SForm extends React.Component  {

  constructor(props) {
    super(props);
    this.state = {
      show: false,
      formData: {}
    };
  }
  
log = (type) => {
  console.log(type);
}
  
handleClose = (doShow) => {
  this.setState({ show: false });
}

onFormError = (errors) => {
  this.log("I have", errors.length, "errors to fix");
}

  onFormSubmit = ({formData}, e) => {
    this.setState({formData: formData});
    this.setState({ show: true });

    exportFromJSON({ data: formData, fileName: 'workflow', exportType: exportFromJSON.types.json })

    return false;
  }

  onFormChange = ({changedFormData}) => {
    this.setState({formData: changedFormData});
  }
  
  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
    <Jumbotron>
      <h1>Generate Serverless Workflow JSON</h1>
      
        <Form schema={swschema}
          formData={this.state.formData}
          onSubmit={this.onFormSubmit}
          onError={this.onFormError}/>
    </Jumbotron>
    )
  }
}

export default SForm;