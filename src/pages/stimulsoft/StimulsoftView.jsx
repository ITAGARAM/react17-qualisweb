import React, { Component } from 'react';
import Iframe from 'react-iframe';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ListWrapper } from '../../components/client-group.styles';
import rsapi, { fileViewUrl, reportUrl,serverUrl } from '../../rsapi';
//import { Stimulsoft } from 'stimulsoft-reports-js/Scripts/stimulsoft.blockly.editor';
//import 'stimulsoft-reports-js/Css/stimulsoft.designer.office2013.whiteblue.css';
//import 'stimulsoft-reports-js/Css/stimulsoft.viewer.office2013.whiteblue.css';
// import './App.css';
class StimulsoftView extends Component {
   
    render() {
        // console.log("view");
        return (
            //src={fileViewUrl() + "/Connecting_to_Databases01/indexDesign.html?name=" + this.props.Login.userInfo.sreportingtoolfilename}></Iframe>
            <>
            {/* <div id="designer"></div>; */}
                <ListWrapper className="client-listing-wrap">
                <h1>welcome to stimulsoft 01</h1>
                {/* below code is commented for security vulnerability - by rukshana */}
                {/* <Iframe height='660' width='100%'
                    src={reportUrl() +  "indexDesign.html?name=" + this.props.Login.userInfo.sreportingtoolfilename+"&slanguagetypecode=" 
                    + this.props.Login.userInfo.sreportlanguagecode+"&sconnectionstring=" + this.props.Login.userInfo.sconnectionString}>
                    </Iframe> */}

                {/* SWSM-121 Start - added the below code for security vulnerability - by rukshana */}
                <Iframe height='660' width='100%'
                    src={reportUrl() + "indexDesign.html?name=" + this.props.Login.userInfo.sreportingtoolfilename + "&slanguagetypecode=" + this.props.Login.userInfo.sreportlanguagecode + "&sconnectionstring=" + this.props.Login.userInfo.sconnectionString + "&sapi=" + serverUrl() + "/reststimulsoft/urljson"}></Iframe>
                    {/* End */}

                    {/* //src={reportUrl() +  "indexDesign.html?name=" + "ru.xml"}></Iframe> */}
                    {/* Stimulsoft.Base.StiLicense.loadFromFile("license.key");
                    StiOptions.WebServer.url = "JSDataAdapter/";
                   var report = Stimulsoft.Report.StiReport.createNewReport();
                   var dbMySQL = report.dictionary.databases.getByName("Connection");
			      dbMySQL.connectionString = "Server=agl92; Database=LIMSDB20230420;User=postgres; Pwd=admin@123;";
                  var options = new Stimulsoft.Designer.StiDesignerOptions();
            options.appearance.fullScreenMode = true;

            
            var designer = new Stimulsoft.Designer.StiDesigner(options, "StiDesigner", false);
            designer.report = report; */}
            {/* designer.renderHtml("designerContent"); */}
                </ListWrapper>
            </>
        )
    }

    componentDidMount(){
        // console.log('Loading Designer view');

        // console.log('Set full screen mode for the designer');
        // var options = new window.Stimulsoft.Designer.StiDesignerOptions();
        // options.appearance.fullScreenMode = false;

        // //console.log('Create the report designer with specified options');
        // var designer = new window.Stimulsoft.Designer.StiDesigner(options, 'StiDesigner', false);

        // //console.log('Create a new report instance');
        // var report = new window.Stimulsoft.Report.StiReport();

        // var dbMySQL = report.dictionary.databases.getByName("Connection");
        // dbMySQL.connectionString = "Server=agl92; Database=LIMSDB20230420;User=postgres; Pwd=admin@123;";

        // //console.log('Load report from url');
        // report.loadFile('reports/SimpleList.mrt');

        // //console.log('Edit report template in the designer');
        // designer.report = report;  
            
        // designer.renderHtml("designer");

        // var report = new window.Stimulsoft.Report.StiReport();

        //  var dbMySQL = report.dictionary.databases.getByName("Connection");
        //  dbMySQL.connectionString = "Server=agl92; Database=LIMSDB20230420;User=postgres; Pwd=admin@123;";

    }

}
const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}
export default connect(mapStateToProps, {})(injectIntl(StimulsoftView));
