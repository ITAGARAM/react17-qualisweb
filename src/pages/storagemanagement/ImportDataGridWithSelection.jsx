
import { injectIntl } from 'react-intl';
import {  Col} from 'react-bootstrap';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import DataGridWithSelection from '../../components/data-grid/DataGridWithSelection';

class ImportDataGridWithSelection extends Component{
    constructor(props){
        super(props);
        this.state = ({
            selectedRecord: this.props.selectedRecord,
        });
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.isInitialRender === false ){
                // console.log("1",false);
                return false;
        }
        else {
            // console.log("2",true);
            return true;
        }
    }
    render(){
        return(
							<>
										<Col md={12}>
                                            <DataGridWithSelection
                                                userInfo={this.props.Login.userInfo}
                                                data={(this.props.Login.masterData && this.props.Login.masterData.selectedBulkBarcodeGeneration && this.props.Login.masterData.bulkbarcodedatagen !== null) || (this.props.Login.masterData && this.props.Login.masterData.selectedBulkBarcodeGeneration && this.props.Login.masterData.bulkbarcodedatagen.length > 0) ? this.props.Login.masterData.bulkbarcodedatagen : [] || []}
                                                selectAll={this.props.selectAll}
                                                title={this.props.intl.formatMessage({ id: "IDS_SELECTTODELETE" })}
                                                selectionChange={this.props.selectionChange}
                                                headerSelectionChange={this.props.headerSelectionChange}
                                                extractedColumnList={this.props.extractedColumnList}

                                            />
                                        </Col>
							</>
        );
    }
}
const mapStateToProps = state => {
    return ({ Login: state.Login })
}

export default connect(mapStateToProps, {
})(injectIntl(ImportDataGridWithSelection));