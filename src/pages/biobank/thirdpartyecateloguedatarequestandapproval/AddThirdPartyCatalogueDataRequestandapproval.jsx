import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import { toast } from 'react-toastify';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import rsapi from '../../../rsapi';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './../../../actions/LoginTypes';
const mapStateToProps = state => ({
    Login: state.Login
});

class AddThirdPartyCatalogueDataRequestandapproval extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRecord: props.selectedRecord || {
                nbioprojectcode: '',
                sremarks: '',
                lstSampleType: [],
                selectedSampleTypes: []
            },
            lstBioProject: props.lstBioProject || [],
            lstSampleType: [],
            loading: false
        };
    }

       componentDidUpdate(prevProps, prevState) {
             if (JSON.stringify(this.props.Login.selectedRecord) !== JSON.stringify(prevProps.Login.selectedRecord)) {
                 this.setState({ selectedRecord: this.props.Login.selectedRecord })
             }
             if (JSON.stringify(this.props.Login.bioBankSiteDisable) !== JSON.stringify(prevProps.Login.bioBankSiteDisable)) {
                 this.setState({ bioBankSiteDisable: this.props.Login.bioBankSiteDisable });
             }
             if (JSON.stringify(this.props.Login.selectedChildRecord) !== JSON.stringify(prevProps.Login.selectedChildRecord)) {
                 this.setState({ selectedRecord: this.props.Login.selectedChildRecord});
             }
     
             // 🆕 reset grid when parent clears list
         if (
             this.props.Login.selectedRecord?.lstGetSampleReceivingDetails?.length === 0 &&
             prevProps.Login.selectedRecord?.lstGetSampleReceivingDetails?.length > 0
         ) {
             this.setState({
                 dataResult: [],
                 total: 0,
                 dataState: { skip: 0, take: 10, sort: [], filter: null }
             });
         }
     
         if (
             JSON.stringify(this.props.Login.selectedRecord.lstGetSampleReceivingDetails) !==
             JSON.stringify(prevProps.Login.selectedRecord.lstGetSampleReceivingDetails)
         ) {
             const processed = process(this.props.Login.selectedRecord.lstGetSampleReceivingDetails || [], {
                 skip: 0,
                 take: 10,
                 sort: [],
                 filter: null
             });
     
             this.setState({
                 dataResult: processed.data,
                 total: processed.total,
                 dataState: { skip: 0, take: 10, sort: [], filter: null }
             });
         }
         }
// ✅ Unified handler for project/sample combo
onComboChange = (selectedOptionOrEvent, fieldName) => {
  let value;

  if (fieldName === "nbioprojectcode") {
    value = selectedOptionOrEvent?.value || "";

    // reset sample type when project changes
    this.setState(
      (prevState) => ({
        selectedRecord: {
          ...prevState.selectedRecord,
          nbioprojectcode: value,
          selectedSampleTypes: [],
          nproductcode: "",
          lstSampleType: [],
        },
      }),
      () => {
        if (value) this.fetchBioProjectSampleTypes(value);
      }
    );
  } else if (fieldName === "selectedSampleTypes") {
  const value = selectedOptionOrEvent || []; // array of {value, label}

  this.setState((prevState) => {
    const updatedRecord = {
      ...prevState.selectedRecord,
      selectedSampleTypes: value,               // keep full objects
      nproductcode: value.map((v) => v.value),  // extract IDs for backend
    };

    this.props.childDataChange(updatedRecord);
    return { selectedRecord: updatedRecord };
  });
}


    
   else {
    value = selectedOptionOrEvent?.target?.value || "";
    this.setState((prevState) => ({
      selectedRecord: {
        ...prevState.selectedRecord,
        [fieldName]: value,
      },
    }));
  }
};
fetchBioProjectSampleTypes = (projectCode) => {
  const { userInfo } = this.props.Login;

  const inputPayload = {
    userinfo: userInfo,
    nbioprojectcode: projectCode,
  };

  rsapi()
    .post("/biobankrequest/getBioDataRequestSampleTypeData", inputPayload)
    .then((response) => {
      // console.log("API raw response:", response.data);

      // Handle both cases: with item{} or direct fields
   let formattedSampleTypes = (response.data?.productList || []).map(
  (entry) => {
    const product = entry.item || entry; // ✅ handle both shapes
    return {
      value: String(product.value),
      label: product.label,
    };
  }
);


      // ✅ Get used products from backend
      const usedProductList = response.data?.usedProductList || [];

      // ✅ Filter out used products
      formattedSampleTypes = formattedSampleTypes.filter(
        (sample) => !usedProductList.includes(Number(sample.value))
      );

      this.setState((prevState) => {
        const updatedRecord = {
          ...prevState.selectedRecord,
          nbioprojectcode: projectCode,
          lstSampleType: formattedSampleTypes,
        };

        return {
          lstSampleType: formattedSampleTypes,
          selectedRecord: updatedRecord,
        };
      });
    })
    .catch((error) => {
      console.error("Failed to load sample types", error);
      this.setState({ lstSampleType: [] });
    });
};

    handleDateChange = (field, value) => {
        let selectedRecord = this.state.selectedRecord
        selectedRecord[field] = value;
        this.setState({ selectedRecord });
        this.props.childDataChange(selectedRecord);
    }

    handleSubmit = () => {
        const { selectedRecord } = this.state;
        const { userInfo } = this.props.Login;

        // console.log("selectedRecord before save:", selectedRecord);

        if (!selectedRecord.nbioprojectcode) {
            toast.warn("Please select a BioProject.");
            return;
        }

        if (!selectedRecord.selectedSampleTypes || selectedRecord.selectedSampleTypes.length === 0) {
            toast.warn("Please select at least one Sample Type.");
            return;
        }

     const payload = {
    userinfo: userInfo,
    bioprojectcode: selectedRecord.nbioprojectcode,
    remarks: selectedRecord.sremarks || '',
    sampleTypes: selectedRecord.selectedSampleTypes.map(item => item.value),
    fromDate: this.props.Login.masterData.fromDate,  // assuming it's stored in selectedRecord
    toDate: this.props.Login.masterData.realToDate      // assuming it's stored in selectedRecord
};

        this.setState({ loading: true });
            let masterData = {};
        rsapi().post('/biobankrequest/createBioDataRequest', payload)
       
            .then(response => {
                   masterData = { ...this.props.Login.masterData, ...response.data };
                   let openModal = false;
                toast.success("Form submitted successfully!");
                this.setState({ loading: false, showSlideOut: false  });
                 this.closeModal();
            })
            .catch(error => {
                toast.error("Failed to save data.");
                console.error(error);
                this.setState({ loading: false });
            });
    };


     closeModal = () => {
            let openModal = this.props.Login.openModal;
            let selectedRecord = this.props.Login.selectedRecord;
            let openDirectTransfer = this.props.Login.openDirectTransfer;
           // let openValidateSlideOut = this.props.Login.openValidateSlideOut;
            let loadEsignStateHandle = this.props.Login.loadEsignStateHandle;
            let screenName = this.props.Login.screenName !== undefined && this.props.Login.screenName;
            let operation = this.props.Login.operation;
    
            if (this.props.Login.loadEsignStateHandle) {
                loadEsignStateHandle = false;
                openDirectTransfer = (screenName === "IDS_TRANSFERFORM" && operation === "update") ? true : false;
                openModal = (screenName === "IDS_TRANSFERFORM" && (operation === "update" || operation === "validate")) ? true : false;
               // openValidateSlideOut = (screenName === "IDS_TRANSFERFORM" && operation === "validate") ? true : false;
            } else {
                openModal = false;
                selectedRecord = {
                    addSelectAll: this.props.Login.selectedRecord?.addSelectAll || false,
                    addedChildBioDirectTransfer: this.props.Login.selectedRecord?.addedChildBioDirectTransfer || []
                };
                openDirectTransfer = false;
               // openValidateSlideOut = false;
            }
    
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    openModal,
                    selectedRecord,
                    selectedId: null,
                    openDirectTransfer,
                    //openValidateSlideOut,
                    loadEsignStateHandle
                }
            }
            this.props.updateStore(updateInfo);
    
        }
    handleCancel = () => {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    };

    render() {
        const { intl } = this.props;
        const { selectedRecord, lstBioProject, lstSampleType } = this.state;

        return (
   <Row className="g-3">
  {/* Bio Project */}
  <Col md={6}>
    <FormSelectSearch
      formLabel={intl.formatMessage({ id: 'IDS_BIOPROJECT' })}
      isSearchable
      name="nbioprojectcode"
      placeholder={intl.formatMessage({ id: 'IDS_SELECTRECORD' })}
      isMandatory
      options={lstBioProject}
      value={lstBioProject.find(opt => opt.value === selectedRecord.nbioprojectcode) || null}
      onChange={(selectedOption) => {
        this.onComboChange(selectedOption, 'nbioprojectcode');
        const project = lstBioProject.find(p => p.value === selectedOption.value);
        this.setState({
          lstSampleType: project?.sampleTypes || [],
        });
        this.onComboChange([], 'selectedSampleTypes');
      }}
      closeMenuOnSelect
    />
  </Col>

  {/* Bio Sample Type */}
  <Col md={6}>
    <FormSelectSearch
      formLabel={intl.formatMessage({ id: "IDS_BIOSAMPLETYPE" })}
      isSearchable
      name="selectedSampleTypes"
      placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
      isMandatory
      isMulti
      isClearable
      options={this.state.lstSampleType}
      value={selectedRecord.selectedSampleTypes || []}
      onChange={(selected) =>
        this.onComboChange(selected, "selectedSampleTypes")
      }
      closeMenuOnSelect={false}
      alphabeticalSort
    />
  </Col>

  {/* Remarks */}
  <Col md={12}>
    <FormTextarea
      label={intl.formatMessage({ id: "IDS_REMARKS" })}
      name="sremarks"
      type="text"
      value={selectedRecord.sremarks}
      onChange={(e) => this.onComboChange(e, 'sremarks')}
      placeholder={intl.formatMessage({ id: "IDS_REMARKS" })}
      maxLength="255"
    />
  </Col>
</Row>

        )
    }
}

export default connect(mapStateToProps)(injectIntl(AddThirdPartyCatalogueDataRequestandapproval));
