import React from 'react'
import { injectIntl } from 'react-intl';
import AddType2Component from '../../components/type2component/AddType2Component'
import AddType1Component from '../../components/type1component/AddType1Component'
import AddType3Component from '../../components/type3component/AddType3Component'
import DynamicSlideout from './DynamicSlideout';
import { transactionStatus } from '../../components/Enumeration';

class AddMasterRecord extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        
        if(this.props.selectedRecord && this.props.selectedRecord.nneedcurrentaddress && this.props.selectedRecord.nneedcurrentaddress === transactionStatus.YES){
                 this.props.extractedColumnList.map(item => (
                            item.isMasterAdd === true ? item.isDisabled = true : ""
                            ))
            } else {
                this.props.extractedColumnList.map(item => (
                    item.isMasterAdd === true ? item.isDisabled = false : ""
                    ))
            }
        
        switch (this.props.selectedControl.table.item.component) {
            case 'Type2Component':
                return (
                    <AddType2Component
                        {...this.props}
                    />

                )
            case 'Type1Component':
                return (
                    <AddType1Component
                        {...this.props}
                    />

                )
            case 'Type3Component':
                return (
                    <AddType3Component
                        {...this.props}
                    />

                )
            case 'Dynamic':
                return (
                    <DynamicSlideout
                        selectedRecord={this.props.selectedRecord||{}}
                        templateData={this.props.masterDesign.slideoutdesign}
                        timeZoneList={this.props.mastertimeZoneList}
                        defaultTimeZone={this.props.masterdefaultTimeZone}
                        onComboChange={this.props.onComboChangeMasterDyanmic}
                        handleDateChange={this.props.handleDateChangeMasterDynamic}
                        onInputOnChange={this.props.onInputOnChangeMasterDynamic}
                        onNumericInputChange={this.props.onNumericInputChangeMasterDynamic}
                        onNumericBlur={this.props.onNumericBlurMasterDynamic}
                        userInfo={this.props.userInfo}
                        Login={this.props.Login}
                        comboData={this.props.dataList}
                        userRoleControlRights={this.props.userRoleControlRights}
                        addMasterRecord={this.props.addMasterRecord}
                        editMasterRecord={this.props.editMasterRecord}
                    />

                )
        }
    }
}
export default injectIntl(AddMasterRecord);