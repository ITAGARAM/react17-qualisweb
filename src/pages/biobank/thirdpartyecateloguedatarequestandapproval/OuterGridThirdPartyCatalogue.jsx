import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { process } from '@progress/kendo-data-query';
import React from 'react';
import { Card, Col, Nav, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { updateStore } from '../../../actions';
import { convertDateValuetoString, onSaveMandatoryValidation, showEsign, sortData } from '../../../components/CommonScript';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
import DataGridWithSelection from '../../../components/data-grid/DataGridWithSelection';
import { transactionStatus } from '../../../components/Enumeration';
import ModalShow from '../../../components/ModalShow';
import Preloader from '../../../components/preloader/preloader.component';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import rsapi from '../../../rsapi';
import EsignStateHandle from '../../audittrail/EsignStateHandle';
import { ContentPanel, ProductList } from '../../product/product.styled';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from './../../../actions/LoginTypes';
// Optional styling (Bootstrap)
import 'bootstrap/dist/css/bootstrap.min.css';
import AddThirdPartyCatalogueDataRequestandapproval from './AddThirdPartyCatalogueDataRequestandapproval';
import FormInput from '../../../components/form-input/form-input.component';

const mapStateToProps = state => ({
  Login: state.Login
});

class OuterGridThirdPartyCatalogue extends React.Component {
  constructor(props) {
    super(props);
    this.confirmMessage = new ConfirmMessage();

    const dataState = {
      skip: 0,
      take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
    };

    this.state = {
      loading: false,
      dataState: dataState,
      operation: props.operation,
      selectedRecord: props.selectedRecord,
      data: props.lstChildBioDataaccess,
      controlMap: props.controlMap,
      openChildModal: false,
      userRoleControlRights: props.userRoleControlRights,
      lstChildBioDataaccess: props.lstChildBioDataaccess || [],
      lstBioDataaccess: props.lstBioDataaccess,
      selectedBioDataaccess: props.selectedBioDataaccess,
      selectedChildRecord: {},
      selectedViewRecord: {}
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const updates = {};

    // ✅ Helper for deep comparison (handles circular refs)
    const isChanged = (curr, prev) => {
      try {
        return JSON.stringify(curr || {}) !== JSON.stringify(prev || {});
      } catch (e) {
        return curr !== prev; // fallback if circular structure
      }
    };

    if (isChanged(prevState?.dataResult, this.state?.dataResult)) {
      const addedChildBioDirectTransfer = (this.state?.dataResult || [])
        .filter(dr =>
          (this.state?.lstChildBioDataaccess || []).some(
            lc => lc?.nserialno === dr?.nserialno
          ) && dr?.selected === true
        )
        .map(item => ({ ...item }));

      updates.selectedRecord = {
        ...(this.state?.selectedRecord || {}),
        addedChildBioDirectTransfer
      };
    }

    // --- Props-based updates ---
    const propsToStateMap = {
      selectedRecord: "selectedRecord",
      selectedChildRecord: "selectedChildRecord",
      selectedViewRecord: "selectedViewRecord",
      loadEsignStateHandle: "loadEsignStateHandle",
      openModalShow: "openModalShow",
      openAcceptRejectDirectTransfer: "openAcceptRejectDirectTransfer",
      lstSampleCondition: "lstSampleCondition",
      lstReason: "lstReason"
    };

    for (const [propKey, stateKey] of Object.entries(propsToStateMap)) {
      if (
        isChanged(
          this.props?.Login?.[propKey],
          prevProps?.Login?.[propKey]
        )
      ) {
        updates[stateKey] = this.props?.Login?.[propKey];
      }
    }

    if (isChanged(this.props?.Login?.isGridClear, prevProps?.Login?.isGridClear)) {
        updates.selectedRecord = {};
        updates.dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
        };
        updates.dataResult = (this.props?.Login?.masterData?.lstChildBioDataaccess || []).slice(updates.dataState.skip, updates.dataState.skip + updates.dataState.take);
        updates.lstChildBioDataaccess = this.props?.Login?.masterData?.lstChildBioDataaccess;
    }

    // --- Handle masterData.lstChildBioDataaccess ---
    if (
      isChanged(
        this.props?.Login?.masterData?.lstChildBioDataaccess,
        prevProps?.Login?.masterData?.lstChildBioDataaccess
      )
    ) {
      const rawData = this.props?.Login?.masterData?.lstChildBioDataaccess || [];
      const dataState = this.props?.dataState || { skip: 0, take: 10 };

      let processed = { data: [], total: 0 };
      try {
        processed = process(rawData, dataState);
      } catch (e) {
        console.error("Kendo process error:", e);
      }

      updates.lstChildBioDataaccess = rawData;
      updates.dataResult = processed.data;
      updates.total = processed.total;
      updates.dataState = dataState;
    }

    // --- Handle lstChildBioDataaccess directly ---
    if (
      isChanged(
        this.props?.Login?.lstChildBioDataaccess,
        prevProps?.Login?.lstChildBioDataaccess
      )
    ) {
      const newList = this.props?.Login?.lstChildBioDataaccess || [];
      let dataState = this.state?.dataState || { skip: 0, take: 10 };

      if(newList.length <= dataState.skip){
        dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 10,
        };
      }

      let processed = { data: [], total: 0 };
      try {
        processed = process(newList, dataState);
      } catch (e) {
        console.error("Kendo process error:", e);
      }

      updates.lstChildBioDataaccess = newList;
      updates.dataResult = processed.data;
      updates.total = processed.total;
      updates.dataState = dataState;
    }

    // ✅ Apply all updates in one setState
    if (Object.keys(updates).length > 0) {
      this.setState(updates);
    }
  }


  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.Login.openChildModal && (this.props.Login.openChildDirectTransfer || this.state.openModalShow) && nextState.isInitialRender === false &&
      (nextState.selectedChildRecord !== this.state.selectedChildRecord)) {
      return false;
    } else {
      return true;
    }
  }

  handleCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };
  // onSaveClick = () => {
  //   const { selectedRecord } = this.state;
  //   const { userInfo, masterData } = this.props.Login;

  //   const payload = {
  //     userinfo: userInfo,
  //     nbiodataaccessrequestcode: selectedRecord?.nbiodataaccessrequestcode,
  //     bioprojectcode: selectedRecord?.nbioprojectcode ?? null,
  //     sremarks: selectedRecord?.sremarks || '',
  //     sampleTypes: (selectedRecord?.selectedSampleTypes || []).map(item => item.value),
  //     srequestdate: masterData?.selectedBioDataaccess?.drequestcreateddate
  //       ? convertDateTimetoStringDBFormat(
  //           new Date(masterData.selectedBioDataaccess.drequestcreateddate),
  //           userInfo
  //         )
  //       : '',
  //     fromDate: masterData?.fromDate ?? '',
  //     toDate: masterData?.realToDate ?? ''
  //   };

  //   this.setState({ loading: true });

  //   rsapi()
  //     .post('/biobankrequest/createBioDataRequest', payload)
  //     .then(response => {
  //       // API returns parent + child list refreshed
  //       const updatedMasterData = {
  //         ...masterData,
  //         selectedBioDataaccess: response.data.selectedBioDataaccess,
  //         lstChildBioDataaccess: response.data.lstChildBioDataaccess
  //       };

  //       const updateInfo = {
  //         typeName: DEFAULT_RETURN,
  //         data: {
  //           masterData: updatedMasterData,
  //           openChildModal: false,
  //           openDirectTransfer: false,
  //           selectedRecord: {},
  //           bioBankSiteDisable: false
  //         }
  //       };

  //       this.props.updateStore(updateInfo);

  //       this.setState({
  //         loading: false,
  //         showSlideOut: false
  //       });

  //       this.closeModal();
  //       toast.success("Form submitted successfully!");
  //     })
  //     .catch(error => {
  //       toast.error("Failed to save data.");
  //       console.error(error);
  //       this.setState({ loading: false });
  //     });
  // };

  onSaveClick = (saveType) => {
    // console.log("Parent save called, saveType:", saveType);
    const { selectedRecord } = this.state;
    const { userInfo, masterData, userRoleControlRights, ncontrolCode } = this.props.Login;
    const obj = convertDateValuetoString(masterData?.fromDate, masterData?.realToDate, userInfo);
    const payload = {
      userinfo: userInfo,
      nbiodataaccessrequestcode: selectedRecord?.nbiodataaccessrequestcode,
      bioprojectcode: selectedRecord?.nbioprojectcode ?? null,
      sampleTypes: (selectedRecord?.selectedSampleTypes || []).map(item => item.value),
      sremarks: selectedRecord?.sremarks || '',
      fromDate: obj.fromDate,
      toDate: obj.toDate
    };

    // ✅ Decide API URL
    const apiUrl = selectedRecord?.nbiodataaccessrequestcode
      ? "/biobankrequest/createChildBioDataRequest"
      : "/biobankrequest/createBioDataRequest";

    const inputParam = {
      inputData: payload,
      screenName: "IDS_THIRDPARTYCATALOG",
      operation: "save"
    };

    // ✅ Step 1: eSign check
    if (showEsign(userRoleControlRights, userInfo.nformcode, ncontrolCode)) {
      const updateInfo = {
        typeName: DEFAULT_RETURN,
        data: {
          loadEsignStateHandle: true,
          openModal: true,
          screenData: { inputParam },
          operation: "save",
          screenName: "IDS_THIRDPARTYCATALOG"
        }
      };
      this.props.updateStore(updateInfo);
      return; // wait until eSign success
    }

    // ✅ Step 2: No eSign → call API directly
    this.setState({ loading: true });

    rsapi()
      .post(apiUrl, payload)
      .then(response => {
        const updatedMasterData = {
          ...masterData,
          selectedBioDataaccess: response.data.selectedBioDataaccess,
          lstChildBioDataaccess: response.data.lstChildBioDataaccess
        };

        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            masterData: updatedMasterData,
            openDirectTransfer: false,
            selectedRecord: {},
            bioBankSiteDisable: false,
            openChildModal: false
          }
        };

        this.props.updateStore(updateInfo);
        this.setState({ loading: false, showSlideOut: false });
        this.closeModal();
        // toast.success("Saved successfully!");
      })
      .catch(error => {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
            const UnAuthorizedAccess = {
                typeName: UN_AUTHORIZED_ACCESS,
                data: {
                    navigation: "forbiddenaccess",
                    loading: false,
                    responseStatus: status
                }
            };
            this.props.updateStore(UnAuthorizedAccess);
        } else if (status === 500) {
            toast.error(error.message);
        } else {
            toast.warn(error.response?.data || "Something went wrong");
        }

        this.setState({ loading: false });
    })
  };




  handleDelete = (deleteID, operation, screenName) => {
    this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
      this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
      () => this.onDeleteEsignCheck(deleteID, operation, screenName));
  }
  onDeleteEsignCheck = (deleteID, operation, screenName) => {
    const { masterData, userRoleControlRights, userInfo } = this.props.Login;
    const { selectedBioDataaccess, lstChildBioDataaccess } = masterData;
    const { selectedRecord, dataState, esignPassword } = this.state;

    if (
      selectedBioDataaccess &&
      selectedBioDataaccess.ntransactionstatus === transactionStatus.DRAFT
    ) {
      if (
        selectedRecord?.addedChildBioDirectTransfer &&
        selectedRecord?.addedChildBioDirectTransfer.length > 0
      ) {
        let inputData = {
          userinfo: userInfo,
          dataState: dataState, // ✅ include correctly
          password: esignPassword || null, // ✅ placeholder
          nbiodataaccessrequestcode: selectedBioDataaccess?.nbiodataaccessrequestcode,
          nbiodataaccessrequestdetailscode: selectedRecord?.addedChildBioDirectTransfer
            ?.map(x => x.nbiodataaccessrequestdetailscode)
            .join(",")
        };

        let inputParam = {
          inputData,
          screenName,
          operation
        };

        if (showEsign(userRoleControlRights, userInfo.nformcode, deleteID)) {
          const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
              loadEsignStateHandle: true,
              openChildModal: true,
              screenData: { inputParam },
              screenName
            }
          };
          this.props.updateStore(updateInfo);
        } else {
          // if eSign not required → set dummy password
          this.deleteDirectTransferDetails({
            ...inputData,
            password: inputData.password || "system"
          });
        }
      } else {
        toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTODELETE" }));
        this.setState({ loading: false });
      }
    } else {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" }));
      this.setState({ loading: false });
    }
  };




  onMandatoryCheck = (saveType, formRef) => {
    let mandatoryFields = [];

    if (this.props.Login.loadEsignStateHandle) {
      mandatoryFields = [
        { idsName: "IDS_PASSWORD", dataField: "esignpassword", mandatoryLabel: "IDS_ENTER", controlType: "textbox" },
        { idsName: "IDS_REASON", dataField: "esignreason", mandatoryLabel: "IDS_SELECT", controlType: "selectbox" },
        { idsName: "IDS_COMMENTS", dataField: "esigncomments", mandatoryLabel: "IDS_ENTER", controlType: "textbox" },
      ];
    } else if (this.props.Login.openDirectTransfer && this.props.Login.operation === "create") {
      mandatoryFields = [
        { idsName: "IDS_BIOPROJECT", dataField: "nbioprojectcode", width: "150px", mandatory: true, mandatoryLabel: "IDS_ENTER", controlType: "selectbox" },
        { idsName: "IDS_BIOSAMPLETYPE", dataField: "nproductcode", width: "150px", mandatory: true, mandatoryLabel: "IDS_ENTER", controlType: "selectbox" },
      ];
    }

    onSaveMandatoryValidation(
      this.state.selectedRecord,
      mandatoryFields,
      (this.props.Login.loadEsignStateHandle
        ? this.validateEsign
        : this.props.Login.openDirectTransfer
          ? this.onSaveClick
          : this.props.Login.openValidateSlideOut
            ? this.onValidateEsignCheck
            : this.onSaveClick),   // ✅ fallback is always a function
      this.props.Login.loadEsignStateHandle,
      saveType
    );

  };

  handlePageChange = e => {
    this.setState({
      skip: e.skip,
      take: e.take
    });
  };

  validateEsign = () => {
    let ncontrolcode = this.props.Login.ncontrolcode;
    let modalName = "";
    modalName = "openModal";
    const inputParam = {
      inputData: {
        "userinfo": {
          ...this.props.Login.userInfo,
          sreason: this.state.selectedRecord["esigncomments"],
          nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
          spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,

        },
        password: this.state.selectedRecord["esignpassword"]
      },
      screenData: this.props.Login.screenData
    }
    this.validateEsignforDirectTransfer(inputParam, modalName);
  }
  validateEsignforDirectTransfer = (inputParam) => {
    rsapi().post("login/validateEsignCredential", inputParam.inputData)
      .then(response => {
        if (response.data.credentials === "Success") {
          const { operation, screenName, inputData } = inputParam["screenData"]["inputParam"];

          if (screenName === "IDS_THIRDPARTYCATALOG") {

            if (operation === "add") {
              this.addThirdECatalogueRequest(inputParam);

            } else if (operation === "delete") {
              this.deleteDirectTransferDetails(inputData); // Changed inputParam to inputData by Gowtham on 11 nov 2025 - jira.id:BGSI-182

            }
          }
        }
      })
      .catch(error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          const UnAuthorizedAccess = {
            typeName: UN_AUTHORIZED_ACCESS,
            data: {
              navigation: 'forbiddenaccess',
              loading: false,
              responseStatus: error.response.status
            }
          };
          this.props.updateStore(UnAuthorizedAccess);
          this.setState({ loading: false });
        } else if (error.response?.status === 500) {
          toast.error(error.message);
        } else {
          toast.info(error.response?.data || "Something went wrong");
        }
      });
  };

  deleteDirectTransferDetails = (inputData) => {
    this.setState({ loading: true });
    rsapi().post("biobankrequest/deleteChildBioRequest", {
      ...inputData
    })
      .then(response => {
        let lstChildGet = response.data?.lstChildGet;
        let lstChildBioDataaccess = response.data?.lstChildBioDataaccess || [];
        lstChildBioDataaccess = [...lstChildGet];
        sortData(lstChildBioDataaccess);

        let selectedRecord = this.state.selectedRecord;
        sortData(lstChildGet);
        selectedRecord['addedChildBioDirectTransfer'] = [];
        selectedRecord['addSelectAll'] = false;
        let masterData = { ...this.props.Login.masterData, ...response.data }
        masterData['lstChildBioDataaccess'] = lstChildBioDataaccess;
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: {
            masterData, lstChildBioDataaccess, lstChildGet, selectedRecord, loadEsignStateHandle: false, openModalShow: false, openChildModal: false
          }
        }
        this.props.updateStore(updateInfo);

        this.setState({ loading: false });
      })
      .catch(error => {
        if (error.response?.status === 429) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_LIMITEXCEEDED" }));
            this.props.updateStore({ typeName: DEFAULT_RETURN, data: { loading: false } });
        } else if (error.response?.status === 401 || error.response?.status === 403) {
          const UnAuthorizedAccess = {
            typeName: UN_AUTHORIZED_ACCESS,
            data: {
              navigation: 'forbiddenaccess',
              loading: false,
              responseStatus: error.response.status
            }
          }
          this.props.updateStore(UnAuthorizedAccess);
          this.setState({ loading: false });
        } else if (error.response.status === 500) {
          toast.error(error.message);
          this.setState({ loading: false });
        }
        else {
          toast.warn(error.response.data);
          this.setState({ loading: false });
        }
      })

  }
  headerSelectionChange = (event) => {
    const checked = event.syntheticEvent.target.checked;
    const eventData = event.target.props.data.hasOwnProperty('data') ? event.target.props.data.data || [] : event.target.props.data || [];
    let lstChildBioDataaccess = this.state?.dataResult || [];
    let addedChildBioDirectTransfer = this.state.selectedRecord?.addedChildBioDirectTransfer || [];
    let selectedRecord = this.state.selectedRecord;
    if (checked) {
      const data = lstChildBioDataaccess.map(item => {
        const matchingData = eventData.find(dataItem => dataItem.nserialno === item.nserialno);
        if (matchingData) {
          const existingIndex = addedChildBioDirectTransfer.findIndex(
            x => x.nserialno === item.nserialno
          );

          if (existingIndex === -1) {
            const newItem = {
              ...item,
              selected: true,
            };
            addedChildBioDirectTransfer.push(newItem);
          }
          return { ...item, selected: true };
        } else {
          return { ...item, selected: item.selected ? true : false };
        }
      });
      selectedRecord['addedChildBioDirectTransfer'] = addedChildBioDirectTransfer;
      selectedRecord['addSelectAll'] = checked;
      this.setState({
        selectedRecord,
        //lstChildBioDirectTransfer: data,
        dataResult: data
      });
      this.props.childDataChange(selectedRecord);
    } else {
      let addedChildBioDirectTransfer = this.state.selectedRecord?.addedChildBioDirectTransfer || [];
      const data = lstChildBioDataaccess.map(x => {
        const matchedItem = eventData.find(item => x.nserialno === item.nserialno);
        if (matchedItem) {
          addedChildBioDirectTransfer = addedChildBioDirectTransfer.filter(item1 => item1.nserialno !== matchedItem.nserialno);
          matchedItem.selected = false;
          return matchedItem;
        }
        return x;
      });
      selectedRecord['addedChildBioDirectTransfer'] = addedChildBioDirectTransfer;
      selectedRecord['addSelectAll'] = checked;
      this.setState({
        selectedRecord,
        //lstChildBioDirectTransfer: data,
        dataResult: data
      });
      this.props.childDataChange(selectedRecord);
    }
  }
  selectionChange = (event) => {
    let addedChildBioDirectTransfer = this.state.selectedRecord?.addedChildBioDirectTransfer || [];
    let selectedRecord = this.state.selectedRecord;
    const lstChildBioDataaccess = this.state?.dataResult.map(item => {
      if (item.nserialno === event.dataItem.nserialno) {
        item.selected = !event.dataItem.selected;
        if (item.selected) {
          const newItem = JSON.parse(JSON.stringify(item));
          delete newItem['selected']
          newItem.selected = true;
          addedChildBioDirectTransfer.push(newItem);
        } else {
          addedChildBioDirectTransfer = addedChildBioDirectTransfer.filter(item1 => item1.nserialno !== item.nserialno)
        }
      }
      return item;
    })
    selectedRecord['addedChildBioDirectTransfer'] = addedChildBioDirectTransfer;
    selectedRecord['addSelectAll'] = this.validateCheckAll(process(lstChildBioDataaccess || [], this.state.dataState).data);
    this.setState({
      selectedRecord,
      //lstChildBioDirectTransfer,
      dataResult: lstChildBioDataaccess
    });
    this.props.childDataChange(selectedRecord);
  }

  validateCheckAll(data) {
    let selectAll = true;
    if (data && data.length > 0) {
      data.forEach(dataItem => {
        if (dataItem.selected) {
          if (dataItem.selected === false) {
            selectAll = false;
          }
        } else {
          selectAll = false;
        }
      })
    } else {
      selectAll = false;
    }
    return selectAll;
  }
  dataStateChange = (event) => {
    const { lstChildBioDataaccess, selectedRecord } = this.state;

    // Always filter from full list
    let dataSource = lstChildBioDataaccess || [];

    // Reapply selection from addedChildBioDirectTransfer
    const addedChildBioDirectTransfer = selectedRecord?.addedChildBioDirectTransfer || [];
    const selectedMap = new Map(addedChildBioDirectTransfer.map(item => [item.nserialno, item]));

    dataSource = dataSource.map(item =>
      selectedMap.has(item.nserialno)
        ? { ...item, selected: true }
        : { ...item, selected: item.selected || false }
    );

    // Apply filter/sort/page
    const processed = process(dataSource, event.dataState);

    // Check if all visible rows are selected
    const allSelected = processed.data.length > 0 && processed.data.every(item => item.selected === true);

    this.setState({
      lstChildBioDataaccess: dataSource, // keep selection persisted
      dataResult: processed.data,
      total: processed.total,
      dataState: event.dataState,
      selectedRecord: {
        ...selectedRecord,
        addSelectAll: allSelected,
        addedChildBioDirectTransfer: Array.from(selectedMap.values())
      }
    });
  };
  childDataChange = (selectedRecord) => {
    let isInitialRender = false;
    this.setState({
      selectedRecord: {
        ...selectedRecord
      },
      isInitialRender
    });
  }

  closeModal = () => {
    let openChildModal = this.props.Login.openChildModal;
    let selectedRecord = this.props.Login.selectedRecord;
    let openDirectTransfer = this.props.Login.openDirectTransfer;
    //let openValidateSlideOut = this.props.Login.openValidateSlideOut;
    let loadEsignStateHandle = this.props.Login.loadEsignStateHandle;
    let screenName = this.props.Login.screenName !== undefined && this.props.Login.screenName;
    let operation = this.props.Login.operation;

    if (this.props.Login.loadEsignStateHandle) {
      loadEsignStateHandle = false;
    //openDirectTransfer = (screenName === "IDS_TRANSFERFORM" && operation === "update") ? true : false;
    // openModal = (screenName === "IDS_TRANSFERFORM" && (operation === "update" || operation === "validate")) ? true : false;
    // openValidateSlideOut = (screenName === "IDS_TRANSFERFORM" && operation === "validate") ? true : false;
    }
    //  else {
    openChildModal = false;
    selectedRecord = {
      addSelectAll: this.props.Login.selectedRecord?.addSelectAll || false,
      addedChildBioDirectTransfer: this.props.Login.selectedRecord?.addedChildBioDirectTransfer || []
    };


    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: {
        openChildModal: false,
        selectedRecord,
        selectedId: null,
        openDirectTransfer,
        //openValidateSlideOut,
        loadEsignStateHandle
      }
    }
    this.props.updateStore(updateInfo);

  }
  viewDirectTransferDetails = (paramData) => {
    let selectedViewRecord = paramData.treeView;
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: {
        openChildModal: true,
        viewDirectTransferDetails: true,
        selectedViewRecord, operation: 'view', screenName: 'IDS_THIRDPARTYCATALOG'
      }
    }
    this.props.updateStore(updateInfo);
  }
  render() {
    this.extractedFields = [
      { idsName: "IDS_BIOPROJECTNAME", dataField: "sprojecttitle", width: "100px" },
      { idsName: "IDS_BIOSAMPLETYPE", dataField: "sproductname", width: "100px" },
      { idsName: "IDS_SAMPLESTATUS", dataField: "stransdisplaystatus", width: "100px" },
    ];

    const addChildID = this.props.addChildID;
    const deleteID = this.props.deleteChildID;

    return (
      <>
        <Preloader loading={this.state.loading} />

        <ContentPanel className="panel-main-content">
          <Card className="border-0">
            <Card.Header>
              <Card.Subtitle>
                <ProductList className="d-flex product-category float-right icon-group-wrap">
                  <Nav.Link
                    className="btn btn-circle outline-grey ml-2"
                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_ADD" })}
                    data-place="left"
                    hidden={this.props.userRoleControlRights.indexOf(addChildID) === -1}
                    onClick={() =>
                      this.addChildThirdPartyCatalogue(addChildID, "create", "Sample")
                    }
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </Nav.Link>

                  <Nav.Link
                    className="btn btn-circle outline-grey ml-2"
                    data-tooltip-id="my-tooltip" data-tooltip-content={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                    data-place="left"
                    hidden={this.props.userRoleControlRights.indexOf(deleteID) === -1}
                    onClick={() =>
                      this.handleDelete(deleteID, "delete", "IDS_THIRDPARTYCATALOG")
                    }
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </Nav.Link>
                </ProductList>
              </Card.Subtitle>
            </Card.Header>
          </Card>
        </ContentPanel>

        <Row>
          <Col md={12} className="side-padding">
            <DataGridWithSelection
              primaryKeyField={"nserialno"}
              total={this.state.total || 0}
              selectAll={this.state.selectedRecord?.addSelectAll}
              userInfo={this.props.Login.userInfo}
              title={this.props.intl.formatMessage({ id: "IDS_SELECTTODELETE" })}
              headerSelectionChange={this.headerSelectionChange}
              selectionChange={this.selectionChange}
              dataStateChange={this.dataStateChange}
              extractedColumnList={this.extractedFields}
              dataState={this.state.dataState}
              dataResult={this.state.dataResult || []}
              scrollable="scrollable"
              pageable={true}
              removeNotRequired={true}
              controlMap={this.props.controlMap}
              userRoleControlRights={this.props.userRoleControlRights}
              fetchRecord={this.viewDirectTransferDetails}
              gridHeight={this.props.gridHeight}
            />
          </Col>
        </Row>

        <SlideOutModal
          show={this.props.Login.openChildModal}
          //closeModal={this.closeChildModal}
          operation={
            this.props.Login.loadEsignStateHandle ? undefined : this.props.Login.operation
          }
          inputParam={this.props.Login.inputParam}
          screenName={
            this.props.Login.loadEsignStateHandle
              ? this.props.intl.formatMessage({ id: "IDS_ESIGN" })
              : this.props.Login.screenName
          }
          esign={false}
          needClose={this.props.Login.operation === "view"}
          onSaveClick={this.onMandatoryCheck}
          closeModal={this.closeModal}
          validateEsign={this.validateEsign}
          handlePageChange={this.handlePageChange}
          masterStatus={this.props.Login.masterStatus}
          updateStore={this.props.updateStore}
          skip={this.state.skip}
          take={this.state.take}
          //showSaveContinue={!this.props.Login.loadEsignStateHandle}
          showSave={!this.props.Login.viewDirectTransferDetails}
          hideSave={this.props.Login.operation === "view"}
          mandatoryFields={[]}
          selectedRecord={this.props.Login.openChildModal ? this.state.selectedChildRecord || {} :
            this.props.Login.loadEsignStateHandle ? {
              ...this.state.selectedChildRecord,
              'esignpassword': this.state.selectedChildRecord['esignpassword'],
              'esigncomments': this.state.selectedChildRecord['esigncomments'],
              'esignreason': this.state.selectedChildRecord['esignreason']
            } : this.state.selectedChildRecord || {}
          }
          addComponent={
            this.props.Login.loadEsignStateHandle ? (
              <EsignStateHandle
                operation={this.props.Login.operation}
                inputParam={this.props.Login.inputParam}
                selectedRecord={this.props.Login.selectedRecord}
                childDataChange={this.childDataChange}
              />
            ) : (
              <>
                {/* Read-only parent info */}
                <Row>
                  <Col md={6}>
                    <FormInput
                      label={this.props.intl.formatMessage({ id: "IDS_FORMNUMBER" })}
                      name={"sformnumber"}
                      type="text"
                      // onChange={(event) => props.onInputOnChange(event)}
                      placeholder={this.props.intl.formatMessage({ id: "IDS_FORMNUMBER" })}
                      value={this.props.Login.selectedRecord?.sformnumber || ""}
                      isMandatory={true}
                      required={true}
                      maxLength={100}
                      readOnly={true}
                      isDisabled={true}
                    />
                  </Col>
                  <Col md={6}>
                    <FormInput
                      label={this.props.intl.formatMessage({ id: "IDS_RECEIVERSITE" })}
                      name={"sreceiversitename"}
                      type="text"
                      // onChange={(event) => props.onInputOnChange(event)}
                      placeholder={this.props.intl.formatMessage({ id: "IDS_FORMNUMBER" })}
                      value={this.props.Login.selectedRecord?.sreceiversitename || ""}
                      isMandatory={true}
                      required={true}
                      maxLength={100}
                      readOnly={true}
                      isDisabled={true}
                    />
                  </Col>
                </Row>

                {/* Child form */}
                <AddThirdPartyCatalogueDataRequestandapproval
                  controlMap={this.props.controlMap}
                  userRoleControlRights={this.props.userRoleControlRights}
                  operation={this.props.Login.operation}
                  selectedRecord={this.props.Login.selectedRecord}
                  isChildSlideOut={true}
                  lstBioProject={this.props.Login.masterData.lstBioProject}
                  lstSampleType={this.props.Login.masterData.lstSampleType}
                  childDataChange={this.childDataChange}// ✅ fixed
                />
              </>
            )
          }
        />

        {this.state.openModalShow && (
          <ModalShow
            modalShow={this.state.openModalShow}
            closeModal={this.closeModal}
            onSaveClick={this.onMandatoryCheck}
            validateEsign={this.validateEsign}
            masterStatus={this.props.Login.masterStatus}
            mandatoryFields=""
            updateStore={this.props.updateStore}
            selectedRecord={this.state.selectedChildRecord || {}}
            modalBody={
              this.state.loadEsignStateHandle ? (
                <EsignStateHandle
                  operation={this.props.Login.operation}
                  inputParam={this.props.Login.inputParam}
                  selectedRecord={this.state.selectedChildRecord || {}}
                  childDataChange={this.subModalChildDataChange}
                />
              ) : null
            }
          />
        )}
      </>
    );
  }
  // addChildThirdPartyCatalogue = (addChildID, operation, screenName) => {
  //   let selectedParent = this.props?.selectedBioDataaccess;

  //   if (operation === "create" && selectedParent) {
  //     this.setState({ loading: true });

  //     rsapi()
  //       .post("biobankrequest/findStatusrequest", {
  //         nbiodataaccessrequestcode: selectedParent.nbiodataaccessrequestcode,
  //         userinfo: this.props.Login.userInfo,
  //       })
  //       .then((response) => {
  //         if (
  //           response.data === transactionStatus.DRAFT ||
  //           response.data === transactionStatus.VALIDATION
  //         ) {
  //           // ✅ Single API call for project + sample types
  //           rsapi()
  //             .post("biobankrequest/getChildBioData", {
  //               userinfo: this.props.Login.userInfo,
  //               nbiodataaccessrequestcode: selectedParent.nbiodataaccessrequestcode,
  //             })
  //             .then((res) => {
  //               const projectList = res.data?.projectList || [];

  //               // Transform projects for dropdown
  //               const lstBioProject = projectList.map((p) => ({
  //                 value: p.nbioprojectcode,
  //                 label: p.sprojecttitle,
  //                 sampleTypes: (p.sampleTypes || []).map((st) => ({
  //                   value: st.nproductcode,
  //                   label: st.sproductname,
  //                   nbioprojectcode: p.nbioprojectcode,
  //                 })),
  //               }));

  //               // Flat list of all sampleTypes across projects
  //               const allSamples = projectList.flatMap((p) =>
  //                 (p.sampleTypes || []).map((st) => ({
  //                   value: st.nproductcode,
  //                   label: st.sproductname,
  //                   nbioprojectcode: p.nbioprojectcode,
  //                   sprojecttitle: p.sprojecttitle,
  //                 }))
  //               );

  //               // ✅ Use transformed data here
  //               const masterData = {
  //                 ...this.props.Login.masterData,
  //                 lstBioProject: lstBioProject,
  //                 lstSampleType: allSamples,
  //               };

  //               const updateInfo = {
  //                 typeName: DEFAULT_RETURN,
  //                 data: {
  //                   masterData,
  //                   screenName,
  //                   operation,
  //                   openChildModal: true,
  //                   isChild: true,
  //                   lstBioProject: lstBioProject, // ✅ fixed
  //                   selectedRecord: {
  //                     nbiodataaccessrequestcode:
  //                       selectedParent.nbiodataaccessrequestcode,
  //                     sformnumber: selectedParent.sformnumber,
  //                     sreceiversitename: selectedParent.sreceiversitename,
  //                     sremarks: "",
  //                     lstSampleType: allSamples,
  //                     selectedSampleTypes: [],
  //                   },
  //                 },
  //               };

  //               this.props.updateStore(updateInfo);
  //               this.setState({ loading: false });
  //             });
  //         }
  //       });
  //   }
  // };


  // addThirdPartyCatalogue = (addID, operation, screenName) => {
  //     if (operation === "create") {
  //         this.setState({ loading: true });

  //         // API request to fetch bio projects
  //         const getSiteBasedOnTransferType = rsapi().post(
  //             "biobankrequest/getBioProject",
  //             { 'userinfo': this.props.Login.userInfo }
  //         );

  //         getSiteBasedOnTransferType
  //             .then((bioProjectRes) => {
  //                 const projectList = bioProjectRes.data.projectList || [];

  //                 const masterData = {
  //                     ...this.props.Login.masterData,
  //                     lstBioProject: projectList
  //                 };

  //                 const updateInfo = {
  //                     typeName: DEFAULT_RETURN,
  //                     data: {
  //                         masterData,
  //                         screenName,
  //                         operation,
  //                         openModal: true, // ✅ controls modal
  //                         lstBioProject: projectList,
  //                         selectedRecord: {
  //                             nbioprojectcode: '',
  //                             sremarks: ''
  //                         }
  //                     }
  //                 };

  //                 this.props.updateStore(updateInfo);
  //                 this.setState({ loading: false });
  //             })
  //             .catch(error => {
  //                 const status = error?.response?.status;

  //                 if (status === 401 || status === 403) {
  //                     const UnAuthorizedAccess = {
  //                         typeName: UN_AUTHORIZED_ACCESS,
  //                         data: {
  //                             navigation: 'forbiddenaccess',
  //                             loading: false,
  //                             responseStatus: status
  //                         }
  //                     };
  //                     this.props.updateStore(UnAuthorizedAccess);
  //                 } else if (status === 500) {
  //                     toast.error(error.message);
  //                 } else {
  //                     toast.warn(error?.response?.data || "Error fetching data");
  //                 }

  //                 this.setState({ loading: false });
  //             });
  //     }
  // };
  // addChildThirdPartyCatalogue = (addChildID, operation, screenName) => {
  //   let selectedParent = this.props?.selectedBioDataaccess;

  //   if (operation === "create") {
  //     if (selectedParent) {
  //       this.setState({ loading: true });

  //       // 1. Check parent record status
  //       rsapi()
  //         .post("biobankrequest/findStatusrequest", {
  //           nbiodataaccessrequestcode: selectedParent.nbiodataaccessrequestcode,
  //           userinfo: this.props.Login.userInfo,
  //         })
  //         .then((response) => {
  //           if (
  //             response.data === transactionStatus.DRAFT ||
  //             response.data === transactionStatus.VALIDATION
  //           ) {
  //             // 2. Fetch BioProjects and SampleTypes in parallel
  //           const getProjects = rsapi().post("biobankrequest/getChildBioData", {
  //                 userinfo: this.props.Login.userInfo,
  //                 nbiodataaccessrequestcode: selectedParent.nbiodataaccessrequestcode,
  //                 });


  //             const getSampleTypes = rsapi().post(
  //               "biobankrequest/getChildBioDataRequestSampleTypeData",
  //               {
  //                 'userinfo': this.props.Login.userInfo,
  //                 'nbiodataaccessrequestcode': selectedParent.nbiodataaccessrequestcode,
  //               }
  //             );
  // Axios.all([getProjects, getSampleTypes])
  //   .then(([projectsRes, sampleRes]) => {
  //     const projectList = projectsRes.data?.projectList || [];
  //     const availableSamples = sampleRes.data?.productList || [];

  //     // Already used (project + sample) pairs
  //     const usedPairs = (
  //       this.props.Login.masterData.lstChildBioDataaccess || []
  //     ).map((child) => ({
  //       project: child.nbioprojectcode,
  //       product: child.nproductcode,
  //     }));

  //     // Filter unused samples per project
  //     const filteredSamples = availableSamples.filter(sample => {
  //       return !usedPairs.some(
  //         used =>
  //           used.project === sample.nbioprojectcode &&
  //           used.product === sample.value
  //       );
  //     });

  //     const masterData = {
  //       ...this.props.Login.masterData,
  //       lstBioProject: projectList,
  //       lstSampleType: filteredSamples,
  //     };

  //     const updateInfo = {
  //       typeName: DEFAULT_RETURN,
  //       data: {
  //         masterData,
  //         screenName,
  //         operation,
  //         openChildModal: true,
  //         isChild: true,
  //         lstBioProject: projectList,
  //         selectedRecord: {
  //           nbiodataaccessrequestcode: selectedParent.nbiodataaccessrequestcode,
  //           sformnumber: selectedParent.sformnumber,
  //           sreceiversitename: selectedParent.sreceiversitename,
  //           sremarks: "",
  //           lstSampleType: filteredSamples,
  //           selectedSampleTypes: [],
  //         },
  //       },
  //     };

  //     this.props.updateStore(updateInfo);
  //     this.setState({ loading: false });
  //   })


  //             //  const updateInfo = {
  //             //                     typeName: DEFAULT_RETURN,
  //             //                     data: {
  //             //                         masterData,
  //             //                         screenName,
  //             //                         operation,
  //             //                         openModal: true, // ✅ controls modal
  //             //                         lstBioProject: projectList,
  //             //                         selectedRecord: {
  //             //                             nbioprojectcode: '',
  //             //                             sremarks: ''
  //             //                         }
  //             //                     }
  //             //                 };

  //             //                 this.props.updateStore(updateInfo);
  //             //                 this.setState({ loading: false });
  //             //             })
  //               .catch((error) => {
  //                 toast.error(
  //                   error.message || "Error fetching project/sample type data"
  //                 );
  //                 this.setState({ loading: false });
  //               });
  //           } else {
  //             toast.warn(
  //               this.props.intl.formatMessage({
  //                 id: "IDS_SELECTDRAFTVALIDATEDRECORD",
  //               })
  //             );
  //             this.setState({ loading: false });
  //           }
  //         })
  //         .catch((error) => {
  //           toast.error(error.message || "Error checking status");
  //           this.setState({ loading: false });
  //         });
  //     } else {
  //       toast.warn(
  //         this.props.intl.formatMessage({ id: "IDS_SELECTSAMPLESTOADD" })
  //       );
  //       this.setState({ loading: false });
  //     }
  //   }
  // };

  //  addThirdPartyCatalogue = (operation, screenName) => {
  //   const { Login } = this.props;

  //   //if (operation === "create") {
  //     //this.setState({ loading: true });

  //     rsapi().post("biobankrequest/getBioProject", { userinfo: Login.userInfo })
  //       .then((bioProjectRes) => {
  //         const allProjects = bioProjectRes.data.projectList || [];
  //         const usedProjectCodes = (Login.masterData.lstBioDataaccess || []).map(
  //           (item) => item.nbioprojectcode
  //         );

  //         // ✅ filter unused
  //         const filteredProjects = allProjects.filter(
  //           (project) => !usedProjectCodes.includes(project.nbioprojectcode)
  //         );

  //         const masterData = {
  //           ...Login.masterData,
  //           lstBioProject: filteredProjects
  //         };

  //         this.props.updateStore({
  //           typeName: DEFAULT_RETURN,
  //           data: {
  //             masterData,
  //             screenName,
  //             operation,
  //             openModal: true,
  //             isChild: false, // main add
  //             selectedRecord: {
  //               nbioprojectcode: "",
  //               sremarks: ""
  //             }
  //           }
  //         });

  //         this.setState({ loading: false });
  //       })
  //       .catch((error) => {
  //         this.setState({ loading: false });
  //         toast.error(error.message || "Error fetching Bio Projects");
  //       });
  //   //}
  // };

  addChildThirdPartyCatalogue = (addChildID, operation, screenName) => {
    let selectedParent = this.props?.selectedBioDataaccess;
    let addSelectAll = this.state?.selectedRecord?.addSelectAll || false;
    let addedChildBioDirectTransfer = this.state?.selectedRecord?.addedChildBioDirectTransfer || [];

    if (operation === "create" && selectedParent) {
      if (selectedParent.ntransactionstatus !== transactionStatus.DRAFT) {
        toast.warn(
          this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORD" })
        );
        return;
      }

      this.setState({ loading: true });

      rsapi()
        .post("biobankrequest/getChildBioData", {
          userinfo: this.props.Login.userInfo,
          nbiodataaccessrequestcode: selectedParent.nbiodataaccessrequestcode,
        })
        .then((res) => {
          const projectList = res.data?.projectList || [];

          const lstBioProject = projectList.map((p) => ({
            value: p.nbioprojectcode,
            label: p.sprojecttitle,
            sampleTypes: (p.sampleTypes || []).map((st) => ({
              value: st.nproductcode,
              label: st.sproductname,
              nbioprojectcode: p.nbioprojectcode,
            })),
          }));

          const usedPairs =
            this.props.Login.masterData.lstChildBioDataaccess?.map((child) => ({
              project: child.nbioprojectcode,
              product: child.nproductcode,
            })) || [];

          lstBioProject.forEach((proj) => {
            proj.sampleTypes = proj.sampleTypes.filter(
              (st) =>
                !usedPairs.some(
                  (u) => u.project === proj.value && u.product === st.value
                )
            );
          });

          const masterData = {
            ...this.props.Login.masterData,
            lstBioProject: lstBioProject,
          };

          const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
              masterData,
              screenName,
              operation,
              openChildModal: true,
              openDirectTransfer: true,
              isChild: true,
              lstBioProject: lstBioProject,
              selectedRecord: {
                nbiodataaccessrequestcode:
                  selectedParent.nbiodataaccessrequestcode,
                sformnumber: selectedParent.sformnumber,
                sreceiversitename: selectedParent.sreceiversitename,
                sremarks: "",
                lstSampleType: [],
                selectedSampleTypes: [],
                addSelectAll,
                addedChildBioDirectTransfer
              },
            },
          };

          this.props.updateStore(updateInfo);
          this.setState({ loading: false });
        })
        .catch(error => {
          if (error.response.status === 401 || error.response.status === 403) {
              const UnAuthorizedAccess = {
                  typeName: UN_AUTHORIZED_ACCESS,
                  data: {
                      navigation: 'forbiddenaccess',
                      loading: false,
                      responseStatus: error.response.status
                  }
              }
              this.props.updateStore(UnAuthorizedAccess);
              this.setState({ loading: false });
          } else if (error.response.status === 500) {
              toast.error(error.message);
              this.setState({ loading: false });
          }
          else {
              toast.warn(error.response.data);
              this.setState({ loading: false });
          }
      })
    }
  };




}
export default connect(mapStateToProps, { updateStore })(injectIntl(OuterGridThirdPartyCatalogue));
