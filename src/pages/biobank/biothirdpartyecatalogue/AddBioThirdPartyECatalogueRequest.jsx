import React from 'react';
import { Button, Col, Modal, Row, Table } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchBioThirdPartyECatalogueSampleAvailability, fetchThirdPartyECatalogueParentSamples } from '../../../actions';
import { initRequest } from '../../../actions/LoginAction';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { RequestFormType } from '../../../components/Enumeration';
import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import rsapi from '../../../rsapi';

const mapStateToProps = state => ({ Login: state.Login });

const escapeRegExp = (s = '') => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const sanitizeMinVolume = (raw, decOp = '.') => {
  const op = String(decOp || '.').slice(0, 1);

  // Keep only digits and decimal marks, normalize '.' and ',' to chosen op
  let v = String(raw ?? '').replace(/[^\d.,]/g, '').replace(/[.,]/g, op);

  // If the first char is the operator, prefix leading zero (",5" -> "0,5")
  if (v.startsWith(op)) v = '0' + v;

  // Keep only one operator
  const firstIdx = v.indexOf(op);
  if (firstIdx !== -1) {
    const before = v.slice(0, firstIdx);
    const after = v.slice(firstIdx + 1).replace(new RegExp('\\' + op, 'g'), '');

    // 3 digits before, 2 after (Aliquot behavior)
    const intPart = before.slice(0, 3);

    if (after.length > 0) {
      // has decimals typed -> keep operator + up to 2 decimals
      const decPart = after.slice(0, 2);
      v = `${intPart}${op}${decPart}`;
    } else {
      // no decimals yet -> KEEP the trailing operator so user can continue typing
      v = `${intPart}${op}`;
    }
  } else {
    // no operator -> only up to 3 digits
    v = v.slice(0, 3);
  }

  // Length guard: 3 + 1 (+ 2 if present). If trailing op only, allow length 4; otherwise cap at 6.
  if (v.endsWith(op)) {
    if (v.length > 4) v = v.slice(0, 4);
  } else {
    if (v.length > 6) v = v.slice(0, 6);
  }

  return v;
};

const makeMinVolRegex = (decOp = '.') =>
  new RegExp(`^(?:\\d{1,7})(?:${escapeRegExp(decOp)}\\d{1,2})?$`);

class AddBioThirdPartyECatalogueRequest extends React.Component {
  emitUp = () => {
    try {
      if (this.props && typeof this.props.onChange === 'function') {
        const req = this.state.request || {};
        const details = (req.details || []);
        this.props.onChange(req, details);
      }
    } catch (e) { /* no-op */ }
  };

  constructor(props) {
    super(props);
    const selectedRequest = props.selectedRecord || {};
    this.state = {
      suppressHydrateParentSamples: false,
      request: {
        ...selectedRequest,
        details: Array.isArray(selectedRequest?.details) ? selectedRequest.details : []
      },
      selectedRecord: {
        nrequestformtypecode: selectedRequest.nrequestformtypecode || null,
        nbioprojectcode: selectedRequest.nbioprojectcode || null,
        nsitecode: selectedRequest.nsitecode || null,
        nproductcode: selectedRequest.nproductcode || null,
        sremarks: selectedRequest.sremarks || ''
      },
      currentRow: {
        sreqminvolume: '',
        nproductcode: null,
        sparentsamplecode: null,
        nreqnoofsamples: ''
      },
      availablecount: 0,
      parentSamplesList: [],
      projectSiteList: props.projectSiteList || [],
      sampleTypeList: props.sampleTypeList || [],
      requestFormList: props.requestFormList || [],
      bioProjectList: props.bioProjectList || [],
      isExistingRequest: !!(selectedRequest && selectedRequest.nthirdpartyecatrequestcode),
      showConfirmModal: false,
      pendingChange: null
    };
  }

  componentDidUpdate(prevProps) {
    const md = this.props.Login?.masterData || {};
    const rf = this.state.selectedRecord?.nrequestformtypecode;
    const reqType = this.getReqTypeValue(rf);
    const isBio = reqType === RequestFormType.BIO_SAMPLE_BASED;
    const isParent = reqType === RequestFormType.PARENT_SAMPLE_BASED;

    if (isBio && md.availablecount !== undefined && md.availablecount !== this.state.availablecount) {
      this.setState({ availablecount: md.availablecount });
      this.emitUp();
    }

    if (isParent && md.parentSamples !== undefined && md.parentSamples !== this.state.parentSamplesList && !this.state.suppressHydrateParentSamples) {
      this.setState({ parentSamplesList: md.parentSamples }, () => {
        const list = this.state.parentSamplesList || [];
        const selectedCode = String(this.state.currentRow?.sparentsamplecode || '').trim();
        if (selectedCode) {
          const match = list.find(p => {
            const code = String(p.parentsamplecode || p.sparentsamplecode || '').trim();
            return code.toUpperCase() === selectedCode.toUpperCase();
          });
          const avail = Number(match?.availablecount ?? match?.availablecount ?? match?.count ?? 0);
          this.setState({ availablecount: Number.isFinite(avail) ? avail : 0 });
        } else {
          this.setState({ availablecount: 0 });
        }
      });
    }

    if (this.props.sampleTypeList !== prevProps.sampleTypeList) {
      this.setState({ sampleTypeList: this.props.sampleTypeList || [] });
    }
    if (this.props.projectSiteList !== prevProps.projectSiteList) {
      this.setState({ projectSiteList: this.props.projectSiteList || [] });
    }
  }

  resetAvailableCountRedux = () => {
    const md = (this.props.Login && this.props.Login.masterData) || {};
    this.props.dispatch({
      type: DEFAULT_RETURN,
      payload: { masterData: { ...md, availablecount: 0 } }
    });
  };

  // Clears selected Parent Sample Code and its options, plus dependent counters
  clearParentSampleSelection = () => {
    this.setState(prev => ({
      suppressHydrateParentSamples: true,
      parentSamplesList: [],
      availablecount: 0,
      currentRow: { ...prev.currentRow, sparentsamplecode: null, nreqnoofsamples: '' }
    }));
  };

  normalizeComboData = (comboData) => {
    if (comboData && comboData.target) return comboData.target.value ?? comboData.target;
    return comboData;
  };

  getValueFromOption = (opt) => {
    if (opt === null || opt === undefined) return null;
    if (typeof opt === 'object') return opt.value !== undefined ? opt.value : opt.label !== undefined ? opt.label : opt;
    return opt;
  };

  getReqTypeValue = (rf) => {
    if (rf == null) return undefined;
    if (typeof rf === 'object') return (rf.value ?? rf.nreqformtypecode ?? rf.id);
    return rf;
  };

  onComboChange = (rawComboData, fieldName) => {
    const comboData = this.normalizeComboData(rawComboData);
    const hasRows = (this.state.request?.details?.length || 0) > 0;

    if ((fieldName === 'nrequestformtypecode' || fieldName === 'nbioprojectcode' || fieldName === 'nsitecode') && hasRows) {
      const prevSelected = this.state.selectedRecord[fieldName];
      const prevId = this.getIdFromOption(prevSelected, fieldName === 'nbioprojectcode' ? 'nbioprojectcode'
        : fieldName === 'nsitecode' ? 'nsitecode'
          : 'value');
      const newId = this.getIdFromOption(comboData, fieldName === 'nbioprojectcode' ? 'nbioprojectcode'
        : fieldName === 'nsitecode' ? 'nsitecode'
          : 'value');
      if (`${prevId}` !== `${newId}`) {
        this.setState({ showConfirmModal: true, pendingChange: { fieldName, comboData } });
        return;
      }
    }

    this.applyComboChange(comboData, fieldName, true);
  };

  applyComboChange = (comboData, fieldName, forceClearDependents = false) => {
    const selectedRecord = { ...this.state.selectedRecord, [fieldName]: comboData };

    if (fieldName === 'sremarks') {
      selectedRecord.sremarks = comboData ?? '';
      this.setState({ selectedRecord }, () => {
        const newRequest = { ...this.state.request, sremarks: selectedRecord.sremarks };
        this.setState({ request: newRequest }, () => {
          this.props.onChange && this.props.onChange(newRequest, newRequest.details || []);
        });
      });
      return;
    }

    if (fieldName === 'nbioprojectcode') {
      const fetchProducts = () => {
        const nproject = this.getIdFromOption(comboData, 'nbioprojectcode');
        if (nproject > 0) {
          const userinfo = this.props.Login.userInfo;
          this.props.dispatch(initRequest(true));
          rsapi()
            .post('biothirdpartyecatalogue/getBioSampleTypeCombo', {
              nselectedprojectcode: nproject,
              userinfo
            })
            .then(response => {
              this.props.dispatch({ type: DEFAULT_RETURN, payload: { loading: false, shouldRender: false } });
              const lst = response?.data || [];
              const productList = lst.map(p => ({ label: p.sproductname, value: p.nproductcode, ...p }));

              this.setState(prev => ({
                suppressHydrateParentSamples: true,
                selectedRecord: { ...prev.selectedRecord, nproductcode: null },
                sampleTypeList: productList,
                parentSamplesList: [],
                availablecount: 0,
                currentRow: { ...prev.currentRow, sparentsamplecode: null, nreqnoofsamples: '' },
                request: { ...(prev.request || {}), details: [] }
              }), () => {
                this.props.onChange && this.props.onChange(this.state.request, this.state.request.details || []);
              });
            })
            .catch(() => this.props.dispatch({ type: DEFAULT_RETURN, payload: { loading: false } }));
        } else {
          this.setState({
            suppressHydrateParentSamples: true,
            sampleTypeList: [],
            parentSamplesList: [],
            availablecount: 0,
            currentRow: { sreqminvolume: '', nproductcode: null, sparentsamplecode: null, nreqnoofsamples: '' },
            request: { ...(this.state.request || {}), details: [] }
          });
        }
      };

      if (forceClearDependents) {
        this.setState({
          suppressHydrateParentSamples: true,
          selectedRecord,
          parentSamplesList: [],
          availablecount: 0,
          currentRow: { sreqminvolume: '', nproductcode: null, sparentsamplecode: null, nreqnoofsamples: '' },
          request: {
            ...(this.state.request || {}),
            nbioprojectcode: this.getIdFromOption(comboData, 'nbioprojectcode'),
            projectType: comboData || null,
            sremarks: selectedRecord.sremarks ?? (this.state.request && this.state.request.sremarks),
            details: []
          }
        }, fetchProducts);
        this.resetAvailableCountRedux();
      } else {
        this.setState({ selectedRecord }, fetchProducts);
      }
      return;
    }

    if (fieldName === 'nproductcode') {
      selectedRecord["nthirdpartycode"] = comboData.nthirdpartycode || -1;
      this.setState(prev => ({
        suppressHydrateParentSamples: true,
        selectedRecord,
        parentSamplesList: [],
        availablecount: 0,
        currentRow: { ...prev.currentRow, sparentsamplecode: null, nreqnoofsamples: '' }
      }), () => this.resetAvailableCountRedux());
      return;
    }

    if (fieldName === 'nrequestformtypecode') {
      const clearedSelected = {
        ...selectedRecord,
        // nbioprojectcode: null,
        // nsitecode: null,
        nproductcode: null
      };
      this.setState(prev => ({
        suppressHydrateParentSamples: true,
        selectedRecord: clearedSelected,
        sampleTypeList: [],
        parentSamplesList: [],
        availablecount: 0,
        currentRow: { sreqminvolume: '', nproductcode: null, sparentsamplecode: null, nreqnoofsamples: '' },
        request: {
          ...(prev.request || {}),
          nrequestformtypecode: comboData,
          nreqformtypecode: undefined,
          details: []
        }
      }), () => {
        this.props.onChange && this.props.onChange(this.state.request, this.state.request.details || []);
        this.resetAvailableCountRedux();
      });
      return;
    }

    this.setState({ selectedRecord }, () => {
      const newRequest = {
        ...this.state.request,
        nbioprojectcode: this.getIdFromOption(selectedRecord.nbioprojectcode, 'nbioprojectcode'),
        nsitecode: this.getIdFromOption(selectedRecord.nsitecode, 'nsitecode'),
        projectType: selectedRecord.nbioprojectcode || null,
        receivingSite: selectedRecord.nsitecode || null,
        sremarks: selectedRecord.sremarks ?? this.state.request.sremarks
      };
      this.setState({ request: newRequest }, () => {
        this.props.onChange && this.props.onChange(newRequest, newRequest.details || []);
      });
    });
  };

  applyPendingChange = () => {
    const { pendingChange } = this.state;
    if (pendingChange) {
      const { fieldName, comboData } = pendingChange;

      const clearedBase = {
        currentRow: { sreqminvolume: '', nproductcode: null, sparentsamplecode: null, nreqnoofsamples: '' },
        availablecount: 0,
        parentSamplesList: [],
        sampleTypeList: [],
        request: { ...(this.state.request || {}), details: [] }
      };

      if (fieldName === 'nrequestformtypecode') {
        this.setState(clearedBase, () => this.applyComboChange(comboData, fieldName, true));
        this.resetAvailableCountRedux();
      } else if (fieldName === 'nbioprojectcode') {
        const selectedRecord = { ...this.state.selectedRecord, nsitecode: null, nproductcode: null };
        this.setState({ ...clearedBase, selectedRecord }, () => this.applyComboChange(comboData, fieldName, true));
        this.resetAvailableCountRedux();
      } else if (fieldName === 'nsitecode') {
        const selectedRecord = { ...this.state.selectedRecord, nproductcode: null };
        this.setState({ ...clearedBase, selectedRecord }, () => this.applyComboChange(comboData, fieldName, true));
        this.resetAvailableCountRedux();
      }

      this.setState({ showConfirmModal: false, pendingChange: null });
    }
  };

  cancelPendingChange = () => {
    this.setState({ showConfirmModal: false, pendingChange: null });
  };

  onFilterAvailability = () => {
    const { selectedRecord, currentRow } = this.state;
    const userinfo = this.props.Login.userInfo;
    const formTypeVal = this.getValueFromOption(selectedRecord.nrequestformtypecode);

    if (!formTypeVal) { toast.info(this.props.intl.formatMessage({ id: 'IDS_SELECT' }) + " " + this.props.intl.formatMessage({ id: 'IDS_REQUESTFORMTYPE' })); return; }
    if (!selectedRecord.nbioprojectcode) { toast.info(this.props.intl.formatMessage({ id: 'IDS_SELECT' }) + " " + this.props.intl.formatMessage({ id: 'IDS_BIOPROJECT' })); return; }
    if (!selectedRecord.nproductcode) { toast.info(this.props.intl.formatMessage({ id: 'IDS_SELECT' }) + " " + this.props.intl.formatMessage({ id: 'IDS_BIOSAMPLETYPE' })); return; }
    if (currentRow.sreqminvolume == null || currentRow.sreqminvolume === '') { toast.info(this.props.intl.formatMessage({ id: 'IDS_ENTER' }) + " " + this.props.intl.formatMessage({ id: 'IDS_REQUESTEDMINVOLUMEPERTUBEµL' })); return; }
    this.setState({ availablecount: 0 });
    this.resetAvailableCountRedux();

    const payload = {
      userinfo,
      nbioprojectcode: this.getIdFromOption(selectedRecord.nbioprojectcode, 'nbioprojectcode'),
      nproductcode: this.getIdFromOption(selectedRecord.nproductcode, 'nproductcode'),
      sreqminvolume: (currentRow.sreqminvolume || '').toString()
    };

    const rf = selectedRecord.nrequestformtypecode;
    const reqType = this.getReqTypeValue(rf);
    if (reqType === RequestFormType.BIO_SAMPLE_BASED) {
      this.setState({ suppressHydrateParentSamples: true });
      this.props.dispatch(fetchBioThirdPartyECatalogueSampleAvailability(payload));
    } else if (reqType === RequestFormType.PARENT_SAMPLE_BASED) {
      this.setState({ suppressHydrateParentSamples: false });
      this.props.dispatch(fetchThirdPartyECatalogueParentSamples(payload));
    }
  };

  handleSelectParentSample = (optOrValue) => {
    const { parentSamplesList = [] } = this.state;

    const raw = typeof optOrValue === 'string'
      ? optOrValue
      : (optOrValue?.value ??
        optOrValue?.label ??
        optOrValue?.item?.parentsamplecode ??
        optOrValue?.item?.sparentsamplecode ??
        '');

    const selectedCode = String(raw || '').trim();
    const match = parentSamplesList.find(p => {
      const code = String(p.parentsamplecode || p.sparentsamplecode || '').trim();
      return code.toUpperCase() === selectedCode.toUpperCase();
    }) || {};

    const avail = Number(match.availablecount ?? match.availablecount ?? match.count ?? 0);

    this.setState(prev => ({
      currentRow: { ...prev.currentRow, sparentsamplecode: selectedCode || null, nreqnoofsamples: '' },
      availablecount: Number.isFinite(avail) ? avail : 0
    }));
  };

  onAddSample = () => {
    const { currentRow, selectedRecord, request, availablecount } = this.state;

    const formTypeVal = this.getValueFromOption(selectedRecord.nrequestformtypecode);
    if (!formTypeVal) { toast.info(this.props.intl.formatMessage({ id: 'IDS_SELECT' }) + " " + this.props.intl.formatMessage({ id: 'IDS_REQUESTFORMTYPE' })); return; }
    if (!selectedRecord.nbioprojectcode) { toast.info(this.props.intl.formatMessage({ id: 'IDS_SELECT' }) + " " + this.props.intl.formatMessage({ id: 'IDS_BIOPROJECT' })); return; }
    if (!selectedRecord.nproductcode) { toast.info(this.props.intl.formatMessage({ id: 'IDS_SELECT' }) + " " + this.props.intl.formatMessage({ id: 'IDS_BIOSAMPLETYPE' })); return; }

    const reqTypeFlags = (() => {
      const rfC = selectedRecord.nrequestformtypecode;
      const reqTypeC = this.getReqTypeValue(rfC);
      return {
        isBio: reqTypeC === RequestFormType.BIO_SAMPLE_BASED,
        isParent: reqTypeC === RequestFormType.PARENT_SAMPLE_BASED
      };
    })();

    const decOp = this.props.Login?.userInfo?.sdecimaloperator || '.';
    const MINVOL_REX = makeMinVolRegex(decOp);
    if (!currentRow.sreqminvolume) { toast.info(this.props.intl.formatMessage({ id: 'IDS_ENTER' }) + " " + this.props.intl.formatMessage({ id: 'IDS_REQUESTEDMINVOLUMEPERTUBEµL' })); return; }
    if (!MINVOL_REX.test(String(currentRow.sreqminvolume))) {
      toast.info(this.props.intl.formatMessage({ id: 'IDS_ENTER' }) + " " + this.props.intl.formatMessage({ id: 'IDS_VALID' }) + " " + this.props.intl.formatMessage({ id: 'IDS_REQUESTEDMINVOLUMEPERTUBEµL' })); return;
    }

    const requestedCount = Number(currentRow.nreqnoofsamples);
    if (!Number.isInteger(requestedCount) || requestedCount <= 0) {
      toast.info(this.props.intl.formatMessage({ id: 'IDS_REQUESTEDNOOFSAMPLESCANNOTBEZERO' })); return;
    }
    if (requestedCount > Number(availablecount || 0)) {
      toast.info(this.props.intl.formatMessage({ id: 'IDS_REQUESTEDNOOFSAMPLES' }) + ` (${requestedCount}) ` + this.props.intl.formatMessage({ id: 'IDS_EXCEEDS' }) + " " + this.props.intl.formatMessage({ id: 'IDS_AVAILABLENOOFSAMPLES' }) + ` (${availablecount})`); return;
    }

    if (reqTypeFlags.isParent && !currentRow.sparentsamplecode) {
      toast.info(this.props.intl.formatMessage({ id: 'IDS_SELECT' }) + " " + this.props.intl.formatMessage({ id: 'IDS_PARENTSAMPLECODE' })); return;
    }

    const existing = (request.details || []);
    const curProdId =
      (selectedRecord.nproductcode && typeof selectedRecord.nproductcode === 'object'
        ? (('value' in selectedRecord.nproductcode) ? selectedRecord.nproductcode.value : selectedRecord.nproductcode.nproductcode)
        : selectedRecord.nproductcode);

    const duplicate = existing.find(d => {
      const pid = (d?.nproductcode && typeof d.nproductcode === 'object'
        ? (('value' in d.nproductcode) ? d.nproductcode.value : d.nproductcode.nproductcode)
        : d?.nproductcode);
      if (reqTypeFlags.isBio) {
        return pid === curProdId;
      } else {
        const existingParent = d.sparentSampleCode || d.sparentsamplecode || d.sParentSampleCode;
        return pid === curProdId && (existingParent || '') === (currentRow.sparentsamplecode || '');
      }
    });
    if (duplicate) { toast.info(this.props.intl.formatMessage({ id: 'IDS_RECORDALREADYEXISTS' })); return; }

    const detail = {
      nthirdpartyecatreqdetailcode: -1,
      nproductcode: selectedRecord.nproductcode,
      sparentSampleCode: currentRow.sparentsamplecode || null,
      sreqminvolume: String(currentRow.sreqminvolume),
      nreqnoofsamples: requestedCount,
      nthirdpartycode: selectedRecord?.nproductcode?.nthirdpartycode || -1
    };

    if (reqTypeFlags.isParent) {
      this.setState(prev => ({
        request: {
          ...prev.request,
          nbioprojectcode: selectedRecord.nbioprojectcode,
          // nsitecode: selectedRecord.nsitecode,
          details: [...(prev.request.details || []), detail]
        },
        selectedRecord: { ...prev.selectedRecord },
        currentRow: {
          ...prev.currentRow,
          sparentsamplecode: null,
          nreqnoofsamples: ''
        },
        availablecount: 0
      }), () => {
        if (this.props.onChange) this.props.onChange(this.state.request, this.state.request.details || []);
        this.resetAvailableCountRedux();
      });
    } else {
      this.setState(prev => ({
        request: {
          ...prev.request,
          nbioprojectcode: selectedRecord.nbioprojectcode,
          // nsitecode: selectedRecord.nsitecode,
          details: [...(prev.request.details || []), detail]
        },
        selectedRecord: { ...prev.selectedRecord, nproductcode: null },
        currentRow: { sreqminvolume: '', nproductcode: null, sparentsamplecode: null, nreqnoofsamples: '' },
        availablecount: 0,
        parentSamplesList: []
      }), () => {
        if (this.props.onChange) this.props.onChange(this.state.request, this.state.request.details || []);
        this.resetAvailableCountRedux();
      });
    }
    this.resetAvailableCountRedux();
  };

  onDeleteDetail = (idx) => {
    const { request } = this.state;
    const newDetails = (request.details || []).filter((_, i) => i !== idx);
    const updatedRequest = { ...request, details: newDetails };
    this.setState({ request: updatedRequest }, () => {
      if (this.props.onChange) this.props.onChange(updatedRequest, updatedRequest.details || []);
    });
  };

  render() {
    const { bioProjectList = [], sampleTypeList = [] } = this.props;
    const { selectedRecord, currentRow, request, availablecount, parentSamplesList, isExistingRequest, projectSiteList } = this.state;

    const rfR = selectedRecord.nrequestformtypecode;
    const reqTypeR = this.getReqTypeValue(rfR);
    const isBio = reqTypeR === RequestFormType.BIO_SAMPLE_BASED;
    const isParent = reqTypeR === RequestFormType.PARENT_SAMPLE_BASED;

    const usedProductIds = new Set(
      (request.details || []).map(d => {
        if (d?.nproductcode && typeof d.nproductcode === 'object' && 'value' in d.nproductcode) return d.nproductcode.value;
        if (d?.nproductcode && typeof d.nproductcode === 'object' && 'nproductcode' in d.nproductcode) return d.nproductcode.nproductcode;
        return d?.nproductcode;
      }).filter(Boolean)
    );
    const allProducts = (this.state.sampleTypeList.length ? this.state.sampleTypeList : []);
    const filteredProducts = isBio
      ? allProducts.filter(p => !usedProductIds.has(p.value ?? p.nproductcode))
      : allProducts;

    const currentProductId = this.getIdFromOption(selectedRecord.nproductcode, 'nproductcode');
    const usedParentCodesForProduct = new Set(
      (request.details || [])
        .filter(d => {
          const pid = (d?.nproductcode && typeof d.nproductcode === 'object'
            ? (('value' in d.nproductcode) ? d.nproductcode.value : d.nproductcode.nproductcode)
            : d?.nproductcode);
          return pid === currentProductId;
        })
        .map(d => d.sparentSampleCode || d.sparentsamplecode || d.sParentSampleCode)
        .filter(Boolean)
    );
    const parentOptions = (parentSamplesList || [])
      .filter(p => {
        const code = p.parentsamplecode || p.sparentsamplecode || p.sParentSampleCode;
        return !usedParentCodesForProduct.has(code);
      })
      .map(p => {
        const code = (p.parentsamplecode || p.sparentsamplecode || p.sParentSampleCode || '').trim();
        return { label: code, value: code, item: p };
      });

    const decOp = this.props.Login?.userInfo?.sdecimaloperator || '.';

    return (
      <div>
        <Row>
          <Col md={4}>
            <FormSelectSearch
              formLabel={this.props.intl.formatMessage({ id: 'IDS_BIOPROJECT' })}
              isSearchable
              isDisabled={isExistingRequest}
              isMandatory={true}
              name={'nbioprojectcode'}
              options={bioProjectList}
              optionId={'nbioprojectcode'}
              optionValue={'sprojecttitle'}
              value={selectedRecord.nbioprojectcode}
              onChange={(opt) => this.onComboChange(opt, 'nbioprojectcode')}
            />
          </Col>
        </Row>

        <Row className="mt-2">
          <Col md={5}>
            <FormSelectSearch
              formLabel={this.props.intl.formatMessage({ id: 'IDS_BIOSAMPLETYPE' })}
              name={'nproductcode'}
              options={filteredProducts}
              optionId={'nproductcode'}
              optionValue={'sproductname'}
              value={selectedRecord.nproductcode}
              onChange={(opt) => this.onComboChange(opt, 'nproductcode')}
              isMandatory={true}
            />
          </Col>
          <Col md={5}>
            <FormInput
              type="text"
              label={this.props.intl.formatMessage({ id: 'IDS_REQUESTEDMINVOLUMEPERTUBEµL' })}
              name={'sreqminvolume'}
              value={this.state.currentRow.sreqminvolume}
              onChange={(e) => {
                const v = sanitizeMinVolume(e?.target?.value ?? '', decOp);
                // this.setState(prev => ({ currentRow: { ...prev.currentRow, sreqminvolume: v } }));
                this.setState(prev => ({
                  suppressHydrateParentSamples: true, currentRow: { ...prev.currentRow, sreqminvolume: v, sparentsamplecode: null, nreqnoofsamples: '' },
                  parentSamplesList: [],
                  availablecount: 0
                }), () => this.resetAvailableCountRedux());
              }}
              placeholder={`e.g., 123${decOp}45`}
              isMandatory={true}
            />
          </Col>
          <Col md={2} style={{ marginBottom: "2rem" }} className="d-flex align-items-end justify-content-end">
            <Button onClick={this.onFilterAvailability}>{this.props.intl.formatMessage({ id: 'IDS_FILTER' })}</Button>
          </Col>
        </Row>

        {reqTypeR === RequestFormType.PARENT_SAMPLE_BASED && (
          <Row className="mt-2">
            <Col md={6}>
              <FormSelectSearch
                formLabel={this.props.intl.formatMessage({ id: 'IDS_PARENTSAMPLECODE' })}
                name={'sparentsamplecode'}
                options={parentOptions}
                value={
                  currentRow.sparentsamplecode
                    ? { label: String(currentRow.sparentsamplecode), value: currentRow.sparentsamplecode }
                    : null
                }
                onChange={this.handleSelectParentSample}
                isMandatory={true}
              />
            </Col>

          </Row>
        )}

        <Row className="mt-2 align-items-center">
          <Col md={6}>
            <FormInput
              label={this.props.intl.formatMessage({ id: 'IDS_AVAILABLENOOFSAMPLES' })}
              name={'availablecount'}
              value={availablecount}
              readOnly
            />
          </Col>
          <Col md={6} className="d-flex justify-content-end">
            <FormInput
              type="text"
              inputMode="numeric"
              pattern="^\\d*$"
              label={this.props.intl.formatMessage({ id: 'IDS_REQUESTEDNOOFSAMPLES' })}
              name={'nreqnoofsamples'}
              value={currentRow.nreqnoofsamples}
              onChange={(e) => {
                const digits = String(e && e.target ? e.target.value : e || '').replace(/\D/g, '');
                this.setState(prev => ({ currentRow: { ...prev.currentRow, nreqnoofsamples: digits } }));
              }}
              placeholder="whole number > 0"
              isMandatory={true}
            />
            <Button className="ml-2" style={{ width: "3rem", height: "2.3rem" }} onClick={this.onAddSample}>Add</Button>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={12}>
            <FormTextarea
              label={this.props.intl.formatMessage({ id: 'IDS_REMARKS' })}
              name={'sremarks'}
              value={this.state.request.sremarks || ''}
              onChange={(e) => this.applyComboChange(e.target.value, 'sremarks')}
              maxLength={"255"}   // added by sujatha ATE_274 for length issue bgsi-208
            />
          </Col>
        </Row>

        <Row className="mt-3">
          <Col md={12}>
            <Table bordered>
              <thead>
                <tr>
                  <th>{this.props.intl.formatMessage({ id: 'IDS_BIOSAMPLETYPE' })}</th>
                  <th>{this.props.intl.formatMessage({ id: 'IDS_REQUESTEDMINVOLUMEPERTUBEµL' })}</th>
                  <th>{this.props.intl.formatMessage({ id: 'IDS_REQUESTEDNOOFSAMPLES' })}</th>
                  <th>{this.props.intl.formatMessage({ id: 'IDS_ACTION' })}</th>
                </tr>
              </thead>
              <tbody>
                {this.state.request.details && this.state.request.details.length > 0 ? (
                  this.state.request.details.map((d, i) => (
                    <tr key={i}>
                      <td>
                        {(d.nproductcode && (d.nproductcode.label || d.nproductcode.sproductname || d.nproductcode))
                          || (typeof d.nproductcode === 'number'
                            ? this.props.sampleTypeList.find(s => s.nproductcode === d.nproductcode)?.sproductname
                            : '')}
                      </td>
                      <td>{d.sreqminvolume}</td>
                      <td>{d.nreqnoofsamples}</td>
                      <td>
                        <Button variant="link" onClick={() => this.onDeleteDetail(i)}>
                          <i className="fa fa-trash" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">No samples added</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Modal show={this.state.showConfirmModal} onHide={this.cancelPendingChange} backdrop="static" centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm change</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Changing form/project/site will clear added samples. Continue?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.cancelPendingChange}>Cancel</Button>
            <Button variant="primary" onClick={this.applyPendingChange}>Yes, continue</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  componentDidMount() {
    try { this.hydrateDefaultsFromMasterData(); } catch (e) { }
  }

  getIdFromOption = (opt, key) => {
    if (opt === undefined || opt === null || opt === "") return -1;
    if (typeof opt === "number") return opt;
    if (typeof opt === "string") {
      const n = parseInt(opt, 10);
      return isNaN(n) ? -1 : n;
    }
    if (typeof opt === "object") {
      if (opt.value != null) {
        const n = parseInt(opt.value, 10);
        if (!isNaN(n)) return n;
      }
      if (key && opt[key] != null) {
        const n = parseInt(opt[key], 10);
        if (!isNaN(n)) return n;
      }
      const keys = ["nreqformtypecode", "nbioprojectcode"
        , "value", "id", "code"];
      for (const k of keys) {
        if (opt[k] != null) {
          const n = parseInt(opt[k], 10);
          if (!isNaN(n)) return n;
        }
      }
    }
    return -1;
  };

  hydrateDefaultsFromMasterData = () => {
    const md = this.props?.Login?.masterData || {};
    const requestFormList = this.state.requestFormList || [];
    const bioProjectList = this.state.bioProjectList || [];
    const projectSiteList = this.state.projectSiteList || [];

    const selRft = md.selectedReqFormType;
    const selProj = md.selectedBioProject;

    const rftOpt = selRft ? requestFormList.find(o => this.getIdFromOption(o, "nreqformtypecode") === selRft.nreqformtypecode) : null;
    const projOpt = selProj ? bioProjectList.find(o => this.getIdFromOption(o, "nbioprojectcode") === selProj.nbioprojectcode) : null;

    const selectedRecord = { ...(this.state.selectedRecord || {}) };

    if (!selectedRecord.nrequestformtypecode && (rftOpt || selRft)) selectedRecord.nrequestformtypecode = rftOpt || selRft;
    if (!selectedRecord.nbioprojectcode && (projOpt || selProj)) selectedRecord.nbioprojectcode = projOpt || selProj;

    this.setState({ selectedRecord });
  };

}

export default connect(mapStateToProps)(injectIntl(AddBioThirdPartyECatalogueRequest));