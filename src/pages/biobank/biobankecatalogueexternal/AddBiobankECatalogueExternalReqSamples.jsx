import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import FormInput from '../../../components/form-input/form-input.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';

import { fetchBioSampleAvailabilityForBiobankECatalogueExternal, fetchParentSamplesForBiobankECatalogueExternal } from '../../../actions';
import { toast } from 'react-toastify';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';


const mapStateToProps = (state) => ({ Login: state.Login });

class AddBiobankECatalogueExternalReqSamples extends React.Component {
  constructor(props) {
    super(props);

    const sr = props.selectedRecord || {};
    this._lastEmittedKey = '';
    this.state = {
      suppressHydrateParentSamples: false,
      // local working copy of the row
      currentRow: {
        nproductcode: sr.nproductcode ?? sr.nselectedproductcode ?? '',
        sreqminvolume: sr.sreqminvolume ?? '',
        nreqnoofsamples: sr.nreqnoofsamples ?? '',
        sparentsamplecode: sr.sparentsamplecode ?? sr.sparentSampleCode ?? null,
        nbiobankecatreqexternaldetailcode: sr.nbiobankecatreqexternaldetailcode ?? null,
      },

      // derived data from filter API responses
      availablecount: props.availablecount ?? 0,
      parentSamples: props.parentSamples ?? [],
      errors: {},
    };

    // Ensure selected Parent Sample code is present in list when editing
    if ((sr.nbiobankecatreqexternaldetailcode || sr.isEdit) && sr.sparentsamplecode) {
      const code = sr.sparentsamplecode;
      const exists = (props.parentSamples ?? []).some(p =>
        (p.sparentsamplecode || p.sParentSampleCode || p.parentsamplecode) === code
      );
      if (!exists) {
        // Add current parent sample code to parentSamples for display in dropdown
        this.state.parentSamples = [
          { sparentsamplecode: code, availablecount: 0 },
          ...this.state.parentSamples,
        ];
      }
    }
  }

  // ---- helpers -------------------------------------------------------------

  isEditMode = () => {
    const sr = this.props.selectedRecord || {};
    return Boolean(sr.nbiobankecatreqexternaldetailcode || sr.isEdit);
  };

  // normalize + push snapshot up to parent
  pushSnapshotUp = () => {
    const { currentRow, availablecount, parentSamples } = this.state;

    let nproductcode = currentRow.nproductcode;
    if (nproductcode && typeof nproductcode === 'object') {
      nproductcode = nproductcode.value ?? nproductcode.id ?? '';
    }

    // Build a stable key to avoid redundant emits (prevents update loops)
    const key = JSON.stringify({
      nproductcode,
      sreqminvolume: currentRow.sreqminvolume ?? '',
      nreqnoofsamples: currentRow.nreqnoofsamples ?? '',
      sparentsamplecode: currentRow.sparentsamplecode ?? null,
      availablecount: availablecount ?? 0,
      parentLen: Array.isArray(parentSamples) ? parentSamples.length : 0
    });

    if (this._lastEmittedKey === key) return;
    this._lastEmittedKey = key;

    const snapshot = { ...currentRow, nproductcode, availablecount, parentSamples };
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(snapshot);
    }
  };

  sanitizeMinVolume = (raw, decOp = '.') => {
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
        v = `${intPart}${op}${decPart}`
      } else {
        // no decimals yet -> KEEP the trailing operator so user can continue typing
        v = `${intPart}${op}`
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

  handleChange = (field, value) => {
    this.setState(
      (prev) => {
        const decOp = this.props.Login?.userInfo?.sdecimaloperator || '.';
        const next = { ...prev.currentRow };

        if (field === 'sreqminvolume') {
          next.sreqminvolume = this.sanitizeMinVolume(value, decOp);
          // also clear downstream for parent mode UX consistency
          return {
            currentRow: next,
            parentSamples: [],
            availablecount: 0,
            suppressHydrateParentSamples: true,
            errors: { ...prev.errors, sparentsamplecode: undefined, nreqnoofsamples: undefined }
          };
        }

        if (field === 'nreqnoofsamples') {
          next.nreqnoofsamples = String(value || '').replace(/\D/g, '');
          return { currentRow: next };
        }

        if (field === 'nproductcode') {
          // When Bio Sample Type changes:
          // - clear Parent Sample combo options
          // - clear selected Parent Sample code
          // - clear Available Count
          // - clear Requested No. of Samples
          next.nproductcode = value || '';
          next.sparentsamplecode = null;
          next.nreqnoofsamples = '';

          return {
            currentRow: next,
            parentSamples: [],
            availablecount: 0,
            suppressHydrateParentSamples: true,
            errors: { ...prev.errors, sparentsamplecode: undefined, nreqnoofsamples: undefined },
          };
        }

        // default field set
        next[field] = value;
        return { currentRow: next };
      },
      () => this.pushSnapshotUp()
    );
  };

  // Build payload with robust fallbacks for selected IDs
  buildFilterPayload = () => {
    const { currentRow } = this.state;
    const { selectedRecord = {}, selectedBiobankECatalogueExternalRequest = {}, Login } = this.props;
    const mode = (this.props.mode || '').toLowerCase();


    const isEditOperation = this.isEditMode() ? 3 : 4;
    const nbiobankecatreqexternaldetailcode = (this.state.currentRow?.nbiobankecatreqexternaldetailcode ?? this.props.selectedRecord?.nbiobankecatreqexternaldetailcode ?? -1);
    const nproductcode =
      typeof currentRow.nproductcode === 'object'
        ? currentRow.nproductcode.value ?? currentRow.nproductcode.id
        : currentRow.nproductcode;

    // resolve site from various inputs
    const resolvedSiteCode =
      selectedRecord?.nreceivingsitecode ??
      selectedRecord?.nselectedreceivingsitecode ??
      selectedBiobankECatalogueExternalRequest?.nreceiversitecode ??
      null;

    return {
      isEditOperation,
      nbiobankecatreqexternaldetailcode,
      userinfo: Login?.userInfo,
      nbiobankecatreqexternalcode:
        selectedBiobankECatalogueExternalRequest?.nbiobankecatreqexternalcode ??
        selectedRecord?.nbiobankecatreqexternalcode ??
        -1,
      nbioprojectcode:
        selectedRecord?.nbioprojectcode ??
        selectedRecord?.nselectedbioprojectcode ??
        selectedBiobankECatalogueExternalRequest?.nbioprojectcode,
      nsitecode: resolvedSiteCode,
      nproductcode,
      sreqminvolume: this.state.currentRow.sreqminvolume,
      sparentsamplecode: mode === 'parent' ? this.state.currentRow.sparentsamplecode : null,
    };
  };

  onFilter = () => {
    const payload = this.buildFilterPayload();
    const mode = (this.props.mode || '').toLowerCase();
    if (!payload.nproductcode) { toast.info(this.props.formatMessage({ id: 'IDS_SELECT' }) + ' ' + this.props.formatMessage({ id: 'IDS_BIOSAMPLETYPE' })); return; }
    if (payload.sreqminvolume == null || payload.sreqminvolume === '') { toast.info(this.props.formatMessage({ id: 'IDS_ENTER' }) + ' ' + this.props.formatMessage({ id: 'IDS_REQUESTEDMINVOLUMEPERTUBEµL' })); return; }
    if (mode === 'parent') {
      // Parent mode → get parent samples
      this.setState({ suppressHydrateParentSamples: false });
      this.props.dispatch(fetchParentSamplesForBiobankECatalogueExternal(payload));
    } else {
      // Bio mode → get availability
      this.setState({ suppressHydrateParentSamples: true });
      this.props.dispatch(fetchBioSampleAvailabilityForBiobankECatalogueExternal(payload));
    }
  };

  // Build options with raw so we can update availablecount on select
  buildParentSampleOptions = () => {
    const list = Array.isArray(this.state.parentSamples) ? this.state.parentSamples : [];
    return list.map((p) => {
      const code = p.sParentSampleCode || p.parentsamplecode || p.sparentsamplecode;
      const count = p.availablecount ?? p.count ?? 0;
      return {
        value: code,
        label: `${code} (${count})`,
        raw: p,
      };
    });
  };

  // Find selected option object by current code
  getSelectedParentOption = () => {
    const code = this.state.currentRow?.sparentsamplecode;
    if (!code) return null;
    const opts = this.buildParentSampleOptions();
    return opts.find(o => o.value === code) || null;
  };

  // When user picks a parent sample, set code and CLEAR availability + requested count
  handleParentSelect = (opt) => {
    const code = opt ? opt.value : null;
    const availablecount = opt?.raw?.availablecount ?? 0;
    this.setState(
      (prev) => ({
        currentRow: { ...prev.currentRow, sparentsamplecode: code, nreqnoofsamples: '' },
        availablecount: availablecount,
        errors: { ...prev.errors, nreqnoofsamples: undefined },
      }),
      this.pushSnapshotUp
    );
  };

  componentDidUpdate(prevProps, prevState) {
    const md = this.props.Login?.masterData || {};
    const isParentMode = (this.props.mode || '').toLowerCase() === 'parent';

    // Only sync from Redux in BIO mode. In Parent mode, the count comes from the selected option.
    if (!isParentMode && md.availablecount !== undefined && md.availablecount !== prevState.availablecount) {
      this.setState({ availablecount: md.availablecount });
    }

    // keep redux parentSamples in sync (list used for the dropdown)
    if (Array.isArray(md.parentSamples) && md.parentSamples !== prevState.parentSamples && this.state.suppressHydrateParentSamples !== true) {
      this.setState({ parentSamples: md.parentSamples });
    }

    // props.selectedRecord -> state sync (edit)
    if (prevProps.selectedRecord !== this.props.selectedRecord) {
      const sr = this.props.selectedRecord || {};
      const hasMeaning = Boolean(
        sr.nbiobankecatreqexternaldetailcode || sr.isEdit ||
        sr.nproductcode || sr.nselectedproductcode || sr.sparentsamplecode ||
        sr.sreqminvolume || sr.nreqnoofsamples
      );
      if (hasMeaning) {
        const sr = this.props.selectedRecord || {};

        const nextRow = {
          nproductcode:
            sr.nproductcode ??
            sr.nselectedproductcode ??
            (typeof sr.nproductcode === 'object' ? sr.nproductcode : ''),
          sreqminvolume: (sr.sreqminvolume ?? sr.srequestedvolume ?? '').toString(),
          nreqnoofsamples: sr.nreqnoofsamples ?? '',
          sparentsamplecode: sr.sparentsamplecode ?? null,
          nbiobankecatreqexternaldetailcode: sr.nbiobankecatreqexternaldetailcode ?? null,
        };

        let parentSamples = this.state.parentSamples || [];
        if (
          (sr.nbiobankecatreqexternaldetailcode || sr.isEdit) &&
          nextRow.sparentsamplecode &&
          !parentSamples.some(
            p =>
              (p.sparentsamplecode || p.parentsamplecode || p.sParentSampleCode) ===
              nextRow.sparentsamplecode
          )
        ) {
          parentSamples = [
            { sparentsamplecode: nextRow.sparentsamplecode, availablecount: 0 },
            ...parentSamples,
          ];
        }

        this.setState({ currentRow: nextRow, parentSamples, errors: {} });
      }
    }

    // If decimal operator changes, normalize current volume (optional)
    const prevDec = prevProps.Login?.userInfo?.sdecimaloperator || prevProps.Login?.userInfo?.Sdecimaloperator;
    const currDec = this.props.Login?.userInfo?.sdecimaloperator || this.props.Login?.userInfo?.Sdecimaloperator;
    if (prevDec !== currDec) {
      const curVal = this.state.currentRow?.sreqminvolume ?? '';
      const normalized = curVal; // could call a normalizeVolume if you have one
      if (normalized !== curVal) {
        this.setState(
          prev => ({ currentRow: { ...prev.currentRow, sreqminvolume: normalized } })
        );
      }
    }

    // If exactly one parent sample is returned, auto-select it
    if (this.state.parentSamples !== prevState.parentSamples) {
      const opts = this.buildParentSampleOptions();
      if (opts.length === 1) {
        this.handleParentSelect(opts[0]);
      }
    }

    // --- Save & Continue detection: if details list in Redux changed and modal is still open, reset fields
    try {
      const prevList = (prevProps.Login && prevProps.Login.masterData && prevProps.Login.masterData.lstBiobankECatalogueExternalDetails) || [];
      const currList = (this.props.Login && this.props.Login.masterData && this.props.Login.masterData.lstBiobankECatalogueExternalDetails) || [];
      const modalOpen = !!(this.props.Login && this.props.Login.addExternalSampleModal);
      if (modalOpen && prevList !== currList && (Array.isArray(currList) && currList.length >= (Array.isArray(prevList) ? prevList.length : 0))) {
        // a save likely happened -> reset per mode
        this._resetAfterSaveContinue();
      }
    } catch (e) { /* no-op */ }
  }

  // Reset UI after Save & Continue based on mode
  _resetAfterSaveContinue = () => {
    const mode = (this.props.mode || '').toLowerCase();
    const isParentMode = mode === 'parent';
    const prevCode = this.state.currentRow?.sparentsamplecode;

    if (isParentMode) {
      this.setState(prev => {
        const list = Array.isArray(prev.parentSamples) ? prev.parentSamples : [];
        const filtered = list.filter(p => {
          const code = p.sParentSampleCode || p.parentsamplecode || p.sparentsamplecode;
          return String(code).trim().toUpperCase() !== String(prevCode || '').trim().toUpperCase();
        });

        // --- Rebuild nproductcode as proper { value, label } object ---
        let keepProduct = prev.currentRow.nproductcode;
        if (keepProduct) {
          const codeVal =
            typeof keepProduct === 'object'
              ? keepProduct.value ?? keepProduct.id ?? keepProduct
              : keepProduct;

          const opt =
            (this.props.sampleTypeList || []).find(
              o => o.value === codeVal || o.id === codeVal
            ) ||
            // fallback synthetic label if sampleTypeList is not ready yet
            {
              value: codeVal, label: String(this.props.formatMessage
                ? this.props.formatMessage({ id: 'IDS_BIOSAMPLETYPE' })
                : 'Bio Sample') + ' #' + codeVal
            };

          keepProduct = { value: opt.value, label: opt.label };
        }

        // update Redux copy too
        const md = this.props.Login?.masterData || {};
        this.props.dispatch({
          type: DEFAULT_RETURN,
          payload: { masterData: { ...md, parentSamples: filtered }, shouldRender: true }
        });

        return {
          parentSamples: filtered,
          availablecount: 0,
          currentRow: {
            ...prev.currentRow,
            sparentsamplecode: null,
            nreqnoofsamples: '',
            nproductcode: keepProduct,
          },
          suppressHydrateParentSamples: true,
        };
      }, this.pushSnapshotUp);
    } else {
      // Bio Sample Based behavior unchanged
      this.setState(prev => ({
        availablecount: 0,
        currentRow: {
          ...prev.currentRow,
          nproductcode: null,
          sreqminvolume: '',
          nreqnoofsamples: '',
        },
        suppressHydrateParentSamples: true,
      }), this.pushSnapshotUp);
    }
  };


  // ---- render --------------------------------------------------------------

  render() {
    const {
      mode,
      disableTypeSelect,
      sampleTypeList = [],
      selectedBiobankECatalogueExternalRequest = {},
    } = this.props;

    const { currentRow, availablecount, parentSamples, errors } = this.state;

    const isEdit = this.isEditMode();
    const isParentMode = (mode || '').toLowerCase() === 'parent';

    // Build sample type options + normalize current value to option object
    let sampleTypeOptions = [...sampleTypeList];
    var selectedTypeOption = null;
    if (currentRow.nproductcode) {
      var sel = currentRow.nproductcode;
      var codeVal = typeof sel === 'object' ? (sel.value || sel.id || sel) : sel;
      var opt = (sampleTypeList || []).find(function (o) {
        return String(o.value) === String(codeVal) || String(o.id) === String(codeVal);
      });
      selectedTypeOption = opt ? opt : null;
      selectedTypeOption =
        sampleTypeOptions.find(o => o.value === codeVal) || (typeof sel === 'object' ? sel : null);
    }

    
    // Build parent sample options & selected option object
    const parentOptions = (parentSamples || []).length ? this.buildParentSampleOptions() : [];
    const selectedParent = this.getSelectedParentOption();

    return (
      <div>
        {/* Read-only header context */}
        <Row className="mb-2">
          <Col md={4}>
            <FormInput
              label={this.props.formatMessage({ id: 'IDS_REQUESTFORMTYPE' })}
              name="requestFormType"
              value={selectedBiobankECatalogueExternalRequest?.sreqformtypename || ''}
              readOnly
            />
          </Col>
          <Col md={4}>
            <FormInput
              label={this.props.formatMessage({ id: 'IDS_BIOPROJECT' })}
              name="project"
              value={selectedBiobankECatalogueExternalRequest?.sprojecttitles || ''}
              readOnly
            />
          </Col>
          <Col md={4}>
            <FormInput
              label={this.props.formatMessage({ id: 'IDS_RECEIVINGSITE' })}
              name="site"
              value={selectedBiobankECatalogueExternalRequest?.sreceivingsitename || ''}
              readOnly
            />
          </Col>
        </Row>

        {/* Bio Sample Type + Min Volume */}
        <Row className="mb-2">
          <Col md={5}>
            <FormSelectSearch
              formLabel={this.props.formatMessage({ id: 'IDS_BIOSAMPLETYPE' })}
              name="nproductcode"
              options={sampleTypeOptions}
              optionId="value"
              optionValue="label"
              value={selectedTypeOption}
              isDisabled={isEdit || disableTypeSelect === true}
              onChange={(opt) => this.handleChange('nproductcode', opt || '')}
              isMandatory={true}
            />
            {errors.nproductcode && (
              <div className="text-danger small">{errors.nproductcode}</div>
            )}
          </Col>

          <Col md={5}>
            <FormInput
              label={this.props.formatMessage({ id: 'IDS_REQUESTEDMINVOLUMEPERTUBEµL' })}
              name="sreqminvolume"
              value={currentRow.sreqminvolume}
              inputMode="decimal"
              pattern="\d*"
              onChange={(e) => this.handleChange('sreqminvolume', e.target.value)}
              readOnly={false}
              isMandatory={true}
            />
            {errors.sreqminvolume && (
              <div className="text-danger small">{errors.sreqminvolume}</div>
            )}
          </Col>

          <Col md={2} style={{ "width": "3rem", "height": "2.3rem" }} className="d-flex justify-content-end">
            <Button variant="primary" onClick={this.onFilter}>
              {this.props.formatMessage({ id: 'IDS_FILTER' })}
            </Button>
          </Col>
        </Row>
        {/* Parent Sample Code */}
        {isParentMode && (
          <Row className="mb-2">
            <Col md={6}>
              <FormSelectSearch
                formLabel={this.props.formatMessage({ id: 'IDS_PARENTSAMPLECODE' })}
                name="sparentsamplecode"
                options={parentOptions}
                optionId="value"
                optionValue="label"
                value={selectedParent}
                onChange={this.handleParentSelect}
                isMandatory={true}
              />
              {errors.sparentsamplecode && (
                <div className="text-danger small">{errors.sparentsamplecode}</div>
              )}
            </Col>
          </Row>
        )}

        {/* Counts */}
        <Row className="mb-2">
          <Col md={6}>
            <FormInput
              label={this.props.formatMessage({ id: 'IDS_AVAILABLENOOFSAMPLES' })}
              name="availablecount"
              value={String(availablecount || 0)}
              readOnly
            />
          </Col>
          <Col md={6}>
            <FormInput
              label={this.props.formatMessage({ id: 'IDS_REQUESTEDNOOFSAMPLES' })}
              name="nreqnoofsamples"
              value={currentRow.nreqnoofsamples}
              onChange={(e) => this.handleChange('nreqnoofsamples', e.target.value)}
              inputMode="numeric"
              pattern="\d*"
              isMandatory={true}
            />
            {errors.nreqnoofsamples && (
              <div className="text-danger small">{errors.nreqnoofsamples}</div>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(mapStateToProps)(AddBiobankECatalogueExternalReqSamples);
