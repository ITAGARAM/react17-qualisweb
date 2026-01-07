import React, { Component } from 'react';
import Iframe from 'react-iframe';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ListWrapper } from '../../components/client-group.styles';
import rsapi, { fileViewUrl } from '../../rsapi';

class StimulsoftDesigner extends Component {
    constructor(props) {
        super(props);
    }
    //state = {  } 
    /*<p>Report</p>
            <iframe style="width: 1550px; height:740px" 
                src="http://localhost:8080/Connecting_to_Databases/index.html"
                ></iframe>*/
    /*render() { 
        return <div id="designer">
            <p>welcome to stimulsoft</p>
        </div>;
    }*/
    // http://localhost:8080/Connecting_to_Databases01/indexDesign.html
    render() {
        // console.log("Test");
        //const clanguage = Login.language;
        const clanguage = this.props.Login;
        return (
            <>
                <ListWrapper className="client-listing-wrap">
                <h1>welcome to stimulsoft 01</h1>
                <Iframe height='500' width='1200'
                    src={fileViewUrl() + "/Connecting_to_Databases01/indexDesign.html?name=" + clanguage}></Iframe>
                </ListWrapper>
            </>
        )
    }
/*
    componentDidMount(){
        //StiOptions.WebServer.url = "JSDataAdapter/";
        //StiOptions.WebServer.url = "http://localhost:8080/Connecting_to_Databases/JSDataAdapter";

        console.log('Loading Designer view');
        var options = new window.Stimulsoft.Designer.StiDesignerOptions();
        console.log('Loading Designer view' + options);
        
        console.log('Set full screen mode for the designer');
        options.appearance.fullScreenMode = false;

        console.log('Create the report designer with specified options');
        var designer = new window.Stimulsoft.Designer.StiDesigner(options, 'StiDesigner', false);

        console.log('Create a new report instance');
        var report = new window.Stimulsoft.Report.StiReport();

        console.log('Load report from url');
        //report.loadFile('reports/SimpleList.mrt');
        report.loadFile('reports/R_users.mrt');
        
        console.log('Edit report template in the designer');
        designer.report = report;  
        
        designer.renderHtml("designer");
  }
    */
}

const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
//export default StimulsoftDesigner;
export default connect(mapStateToProps, {})(injectIntl(StimulsoftDesigner));