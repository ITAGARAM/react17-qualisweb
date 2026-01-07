import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { toast } from 'react-toastify';

import { process } from '@progress/kendo-data-query';

import {Row, Col, Card, Nav} from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';


class PatientTabs extends React.Component{
    constructor(props){
        super(props);  
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5,
        };       
        this.state = { 
                        selectedRecord:{},  dataResult:[],
                        dataState:dataState};

        this.chainCustodyColumnList=[
                        {"idsName":"IDS_RECEIVEDOWNER","dataField":"sreceivedowner","width":"200px"},
                        {"idsName":"IDS_NPACKAGERSQTY","dataField":"npackagersqty","width":"200px"},                       
                        ];   
                        
        this.detailedFieldList = [
                            {"idsName":"IDS_DEPARTMENT","dataField":"sdeptname"},
                            {"idsName":"IDS_RECEIVEDDATETIME","dataField":"sreceiveddate"},
                            {"idsName":"IDS_TIMEZONE","dataField":"stzreceiveddate"}, 
                            {"idsName":"IDS_COMMENTS","dataField":"scomments"},  
                                     
                        ];
                       
    } 

    ccDataStateChange = (event) => {
        this.setState({
            dataResult: process(this.props.masterData["ChainCustody"] || [], event.dataState),
            dataState: event.dataState
        });
    }

    render(){        
       return(
            <>
                <Row noGutters>
                    <Col md={12}>  
                        <Card>  
                            <Card.Header className="add-txt-btn">
                                <strong><FormattedMessage id="IDS_PATIENTHISTORY" defaultMessage="Patient History"/></strong> 
                            </Card.Header>   
                            <Card.Body>                            
                                       
                                <Row noGutters>
                                    <Col md={12}>
                                        <DataGrid
                                            primaryKeyField={"nchaincustodycode"}
                                            data={this.props.masterData["ChainCustody"]}
                                            dataResult={process(this.props.masterData["ChainCustody"] || [], this.state.dataState)}
                                            dataState={this.state.dataState}
                                            dataStateChange={this.ccDataStateChange}
                                            extractedColumnList={this.chainCustodyColumnList}
                                            controlMap={this.props.controlMap}
                                            userRoleControlRights={this.props.userRoleControlRights}
                                            inputParam={this.props.inputParam}
                                            userInfo={this.props.userInfo}
                                            methodUrl="Patient"                                                                                                                              
                                            pageable={true}
                                            scrollable={"scrollable"}
                                            isActionRequired={true}
                                            isToolBarRequired={false}
                                            selectedId={this.props.selectedId}
                                            expandField="expanded"
                                            detailedFieldList = {this.detailedFieldList}
                                        />                                                
                                    </Col>
                                </Row>        
                        </Card.Body>                 
                        
                                                                 
                        </Card>   
                    </Col>
                </Row>
               
            </>
        )
 
    }


   

    componentDidUpdate(previousProps){       
        if (this.props.masterData !== previousProps.masterData ){
            let {dataState} = this.state;
            if(this.props.dataState === undefined){
               dataState = {skip:0,take:this.props.settings ? parseInt(this.props.settings[14]) : 5};
            }
                    
            this.setState({  activeTab:'history-tab', dataState});
        }

        if (this.props.selectedRecord !== previousProps.selectedRecord ){             
            this.setState({selectedRecord:this.props.selectedRecord});
         }       
    }

}

export default injectIntl(PatientTabs);