import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';

const AddFilteredPatient = (props) => {
    
    return (
        <Row>
                <Col md={12}>
                        <DataGrid
                            pageable={true}
                            scrollable={"scrollable"}
                            gridHeight={'600px'}
                            //gridWidth={'600px'}
                            data={props.slideResult || []}
                            dataResult={process(props.slideResult || [], props.dataState)}
                            dataState={props.dataState}
                            dataStateChange={props.dataStateChange}
                            extractedColumnList={props.slideList || []}
                            detailedFieldList={[]}
                            hideDetailBand={true}
                            controlMap={props.controlMap}
                            methodUrl="PatientMaster"
                            isActionRequired={false}
                            isToolBarRequired={false}
                            isAddRequired={false}
                            isRefreshRequired={false}
                            selectedId = {null}
                        />
                </Col>
        </Row>
    )
}
export default (injectIntl(AddFilteredPatient));
