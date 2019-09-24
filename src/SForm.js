import React from "react";
import swschema from './schema/serverlessworkflowschema';
import { Jumbotron, Row, Col, Card} from 'react-bootstrap';
import Form from "react-jsonschema-form";
import exportFromJSON from 'export-from-json'
import ReactJson from 'react-json-view';

class SForm extends React.Component  {

  constructor(props) {
    super(props);
    this.state = {
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

  onFormDataChange = ({ formData }) =>
    this.setState({formData});
  
  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div>
      <Row>
        <Col md={7}>
        
              <Jumbotron>
                <h1>Generate Serverless Workflow JSON</h1>

                <Form schema={swschema}
                  formData={this.state.formData}
                  onChange={this.onFormDataChange}
                  onSubmit={this.onFormSubmit}
                  onError={this.onFormError} />
              </Jumbotron>
        
        </Col>
        <Col md={5}>
          <Card>
            <Card.Header as="h2">Workflow JSON:</Card.Header>
            <Card.Body>
              <ReactJson src={this.state.formData}
              displayObjectSize="false"
              displayDataTypes="false"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
    )
  }
}

export default SForm;