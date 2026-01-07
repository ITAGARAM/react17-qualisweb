import { process } from '@progress/kendo-data-query';
import React from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import DataGrid from '../../../components/data-grid/data-grid.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import { toast } from 'react-toastify';
import { initRequest } from '../../../actions/LoginAction';
import { DEFAULT_RETURN, UN_AUTHORIZED_ACCESS } from '../../../actions/LoginTypes';
import '../../../components/App.css';
import { constructOptionList } from '../../../components/CommonScript';
import rsapi from "../../../rsapi";
import { faChartBar, faTable } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const mapStateToProps = state => ({ Login: state.Login });

const PALETTE = ['#0d6efd', '#6c757d', '#198754', '#dc3545', '#ffc107', '#0dcaf0', '#6610f2', '#20c997', '#fd7e14', '#6f42c1'];

function niceTickStep(maxValue, maxTicks = 6) {
  if (!isFinite(maxValue) || maxValue <= 0) return 1;
  const raw = Math.ceil(maxValue / maxTicks);
  return Math.max(1, Math.round(raw));
}

// expects PALETTE and niceTickStep to exist in scope
const ColumnsSVG = ({ title, categories = [], series = [], stacked = true, intl }) => {
  // a bit taller + dynamic bottom pad for long labels
  const vbW = 960, vbH = 440;

  const maxLabelLen = Math.max(0, ...categories.map(c => String(c ?? '').length));
  // vertical footprint for ~-38° rotation; capped
  const labelFootprint = Math.min(140, Math.max(36, Math.round(maxLabelLen * 5.5)));

  const pad = { top: 24, right: 20, bottom: 48 + labelFootprint, left: 68 };
  const plotW = vbW - pad.left - pad.right;
  const plotH = vbH - pad.top - pad.bottom;

  const nCats = Math.max(1, categories.length);
  const nSer = Math.max(1, series.length);

  const totals = categories.map((_, i) =>
    series.reduce((sum, s) => sum + Number((s.data || [])[i] || 0), 0)
  );
  const maxSingle = Math.max(0, ...series.flatMap(s => (s.data || []).map(Number)));
  const maxStack = Math.max(0, ...totals);
  const yMaxRaw = stacked ? maxStack : maxSingle;

  const step = niceTickStep(yMaxRaw);
  const yMax = Math.ceil((yMaxRaw || 1) / step) * step;

  const cx = i => pad.left + plotW * (i + 0.5) / nCats;
  const y = v => pad.top + plotH - (plotH * v) / (yMax || 1);

  const catBand = Math.min(140, plotW / nCats);
  const innerGap = 0.18;
  const groupW = stacked ? Math.min(60, catBand * 0.42) : Math.min(60, catBand * (1 - innerGap));
  const barW = stacked ? groupW : groupW / nSer;
  const groupLeft = (i) => cx(i) - groupW / 2;

  const ticks = [];
  for (let t = 0; t <= yMax + 1e-9; t += step) ticks.push(+t.toFixed(10));

  const legend = series.map((s, i) => ({
    label: s.name || `Series ${i + 1}`,
    color: PALETTE[i % PALETTE.length]
  }));

  // truncate but keep full text on hover
  const trunc = (s, max = 28) => {
    const str = String(s ?? '');
    return str.length > max ? (str.slice(0, max - 1) + '…') : str;
  };

  return (
    <div className="mb-3">
      <h5 className="mb-3">{title}</h5>

      {!!legend.length && (
        <div className="d-flex flex-wrap mb-2">
          {legend.map((it, idx) => (
            <div key={idx} className="d-flex align-items-center mr-3 mb-2">
              <span style={{ display: 'inline-block', width: 14, height: 14, background: it.color, marginRight: 8, borderRadius: 3 }} />
              <small>{it.label}</small>
            </div>
          ))}
        </div>
      )}

      <div style={{ width: '100%', height: '60vh' }}>
        <svg
          width="100%" height="100%"
          viewBox={`0 0 ${vbW} ${vbH}`} preserveAspectRatio="xMidYMid meet"
          role="img" aria-label={title}
        >
          {/* Y grid + ticks */}
          {ticks.map((t, i) => (
            <g key={`tick-${i}`}>
              <line x1={pad.left} y1={y(t)} x2={vbW - pad.right} y2={y(t)} stroke="#e9ecef" strokeWidth="1" />
              <text x={pad.left - 10} y={y(t)} textAnchor="end" dominantBaseline="central" fontSize="12" fill="#6c757d">
                {t}
              </text>
            </g>
          ))}

          {/* X baseline */}
          <line x1={pad.left} y1={y(0)} x2={vbW - pad.right} y2={y(0)} stroke="#adb5bd" strokeWidth="1" />

          {/* Bars + category labels */}
          {categories.map((cat, i) => {
            const left = groupLeft(i);
            if (stacked) {
              let yTop = y(0);
              return (
                <g key={`cat-${i}`}>
                  {/* rotated, truncated label with tooltip */}
                  <g transform={`translate(${cx(i)}, ${vbH - pad.bottom + 10}) rotate(-38)`}>
                    <text textAnchor="end" fontSize="12" fill="#212529">
                      {trunc(cat)}
                      <title>{String(cat ?? '')}</title>
                    </text>
                  </g>

                  {series.map((s, si) => {
                    const val = Number((s.data || [])[i] || 0);
                    if (val <= 0) return null;
                    const h = y(0) - y(val);
                    const yy = yTop - h;
                    yTop = yy;
                    return (
                      <rect
                        key={`seg-${si}`}
                        x={left + (groupW - barW) / 2}
                        y={yy}
                        width={barW}
                        height={h}
                        fill={PALETTE[si % PALETTE.length]}
                        rx="2"
                      >
                        <title>{`${s.name || 'Series'}: ${val}`}</title>
                      </rect>
                    );
                  })}
                </g>
              );
            }
            return null; // grouped not used in this build
          })}

          {/* Axis titles (X moved below labels; Y nudged) */}
          <text x={pad.left + plotW / 2} y={vbH - 8} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#212529">
            {intl.formatMessage({ id: "IDS_BIOSAMPLETYPE" })}
          </text>
          <text transform="rotate(-90)" x={-(pad.top + plotH / 2)} y={18} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#212529">
            {intl.formatMessage({ id: "IDS_DISTINCTSUBJECTCOUNT" })}
          </text>
        </svg>
      </div>
    </div>
  );
};

class BioThirdPartyECatalogueModal extends React.Component {
  constructor(props) {
    super(props);
    const defaultTake = this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5;

    this.state = {
      activePanel: 'charts', // 'grid' | 'charts'
      selectedRecord: {},
      bioProjectList: props.bioProjectList || [],
      projectSiteList: props.projectSiteList || [],
      catalogueData: [],
      catalogueDataState: { skip: 0, take: defaultTake, sort: [], filter: null, group: [] },
      catalogueDataResult: { data: [], total: 0 },
      showViewModal: false,
      detailRows: [],
      detailDataState: { skip: 0, take: defaultTake, sort: [], filter: null, group: [] },
      detailDataResult: { data: [], total: 0 },
      chartIndex: 0, // 0 = Projects, 1 = Disease
      chartByProject: { categories: [], series: [] },
      chartByDisease: { categories: [], series: [] },
    };
  }

  componentDidMount() {
    this.ensureDefaultSelections(this.state.bioProjectList, this.state.projectSiteList);
    this.hydrateChartsFromProps(this.props);
  }

  componentDidUpdate(prevProps, prevState) {
    let stateChanged = false;
    const newState = {};

    if (this.props.Login.masterData !== prevProps.Login.masterData) {
      const lstAggregatedData = this.props.Login.masterData?.lstAggregatedData || [];
      if (lstAggregatedData !== prevProps.Login.masterData?.lstAggregatedData) {
        newState.catalogueData = lstAggregatedData;
        const stateObj = { ...this.state.catalogueDataState, skip: 0 };
        newState.catalogueDataState = stateObj;
        newState.catalogueDataResult = process(lstAggregatedData, stateObj);
        stateChanged = true;
      }
    }

    if (!prevProps.show && this.props.show) {
      newState.selectedRecord = {};
      stateChanged = true;
    }
    if (this.props.bioProjectList !== prevProps.bioProjectList) {
      newState.bioProjectList = this.props.bioProjectList || [];
      stateChanged = true;
    }
    if (this.props.projectSiteList !== prevProps.projectSiteList) {
      newState.projectSiteList = this.props.projectSiteList || [];
      stateChanged = true;
    }

    if (stateChanged) {
      this.setState(newState, () => {
        this.ensureDefaultSelections(this.state.bioProjectList, this.state.projectSiteList);
      });
    }

    if (this.props.Login.masterData !== prevProps.Login.masterData) {
      this.hydrateChartsFromProps(this.props);
    }
  }

  getIdFromOption = (opt, optionKey) => {
    if (opt === undefined || opt === null || opt === "") return -1;
    if (typeof opt === 'number') return opt;
    if (typeof opt === 'string') {
      const parsed = parseInt(opt, 10);
      return isNaN(parsed) ? -1 : parsed;
    }
    if (typeof opt === 'object') {
      if (opt.value !== undefined && opt.value !== null) {
        const parsed = parseInt(opt.value, 10);
        if (!isNaN(parsed)) return parsed;
      }
      if (optionKey && opt[optionKey] !== undefined && opt[optionKey] !== null) {
        const parsed = parseInt(opt[optionKey], 10);
        if (!isNaN(parsed)) return parsed;
      }
      const keys = ['nbioprojectcode', 'nsitecode', 'id', 'code', 'value', 'ncode'];
      for (let k of keys) {
        if (opt[k] !== undefined && opt[k] !== null) {
          const parsed = parseInt(opt[k], 10);
          if (!isNaN(parsed)) return parsed;
        }
      }
    }
    return -1;
  };

  ensureDefaultSelections = (bioProjectList, projectSiteList) => {
    const selectedRecord = { ...this.state.selectedRecord };
    let changed = false;

    const masterSelected = this.props?.Login?.masterData?.selectedBioProject;
    if (masterSelected) {
      const match = Array.isArray(bioProjectList)
        ? bioProjectList.find(opt => {
          if (!opt) return false;
          const optId = opt?.nbioprojectcode ?? opt?.value ?? opt?.id;
          const masterId = masterSelected?.nbioprojectcode ?? masterSelected?.value ?? masterSelected?.id;
          if (optId !== undefined && masterId !== undefined) return String(optId) === String(masterId);
          const optTitle = (opt?.sprojecttitle || opt?.label || "").toLowerCase();
          const masterTitle = (masterSelected?.sprojecttitle || masterSelected?.label || "").toLowerCase();
          return optTitle && masterTitle && optTitle === masterTitle;
        })
        : undefined;

      if (match) { selectedRecord.nbioprojectcode = match; changed = true; }
      else if (!selectedRecord.nbioprojectcode && Array.isArray(bioProjectList) && bioProjectList.length > 0) {
        selectedRecord.nbioprojectcode = bioProjectList[0]; changed = true;
      }
    } else if (!selectedRecord.nbioprojectcode && Array.isArray(bioProjectList) && bioProjectList.length > 0) {
      selectedRecord.nbioprojectcode = bioProjectList[0]; changed = true;
    }

    if (!selectedRecord.nsitecode && Array.isArray(projectSiteList) && projectSiteList.length > 0) {
      selectedRecord.nsitecode = projectSiteList[0]; changed = true;
    }

    if (changed) this.setState({ selectedRecord });
  };

  hydrateChartsFromProps = (props) => {
    const rowsProj = props?.Login?.masterData?.subjectCountsByProductAndProjectRows || [];
    const rowsDis = props?.Login?.masterData?.subjectCountsByProductAndDiseaseRows || [];

    const buildStack = (rows, groupKey) => {
      const cats = Array.from(new Set(rows.map(r => String(r.sproductname || r.nproductcode || ''))));
      const groups = Array.from(new Set(rows.map(r => String(r[groupKey] || ''))));
      const series = groups.map(g => ({
        name: g,
        data: cats.map(c => {
          const hit = rows.find(r =>
            String(r.sproductname || r.nproductcode || '') === c &&
            String(r[groupKey] || '') === g
          );
          return Number(hit?.ndistinctsubjects || 0);
        })
      }));
      return { categories: cats, series };
    };

    this.setState({
      chartByProject: buildStack(rowsProj, "sprojecttitle"),
      chartByDisease: buildStack(rowsDis, "sgroup"),
    });
  }

  onCatalogueSubmit = () => {
    const selectedRecord = this.state.selectedRecord || {};
    const projOption = selectedRecord.nbioprojectcode ||
      (Array.isArray(this.state.bioProjectList) && this.state.bioProjectList.length ? this.state.bioProjectList[0] : null);

    const nbioprojectcode = this.getIdFromOption(projOption, 'nbioprojectcode');
    const userinfo = this.props.Login.userInfo;

    if (nbioprojectcode <= 0) { toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTBIOPROJECT" })); return; }

    this.props.dispatch(initRequest(true));
    rsapi()
      .post("biothirdpartyecatalogue/getAggregatedDataForCatalogue", {
        nselectedprojectcode: nbioprojectcode,
        userinfo
      })
      .then(response => {
        this.props.dispatch({ type: DEFAULT_RETURN, payload: { loading: false, shouldRender: false } });
        const catalogueData = response.data['lstAggregatedData'] || [];
        const stateObj = { ...this.state.catalogueDataState, skip: 0 };
        this.setState({
          catalogueData,
          catalogueDataState: stateObj,
          catalogueDataResult: process(catalogueData, stateObj)
        });
      })
      .catch(error => {
        this.props.dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.props.dispatch({
            type: UN_AUTHORIZED_ACCESS,
            payload: { navigation: 'forbiddenaccess', loading: false, responseStatus: error.response.status }
          });
        } else if (error.response?.status === 500) {
          toast.error(error.message);
        } else {
          toast.warn(error.response?.data || "Error fetching catalogue data");
        }
      });
  };

  openView = (row) => {
    const { nbioprojectcode, nsitecode, nproductcode } = row || {};
    const userinfo = this.props.Login.userInfo;

    this.props.dispatch(initRequest(true));
    rsapi()
      .post("biothirdpartyecatalogue/getDetailedDataForCatalogue", {
        nselectedprojectcode: nbioprojectcode,
        nselectedsitecode: nsitecode,
        nselectedproductcode: nproductcode,
        userinfo
      })
      .then(response => {
        this.props.dispatch({ type: DEFAULT_RETURN, payload: { loading: false, shouldRender: false } });
        const detailRows = response.data['lstDetailedData'] || [];
        const stateObj = { ...this.state.detailDataState, skip: 0 };
        this.setState({
          detailRows,
          detailDataState: stateObj,
          detailDataResult: process(detailRows, stateObj),
          showViewModal: true
        });
      })
      .catch(error => {
        this.props.dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.props.dispatch({
            type: UN_AUTHORIZED_ACCESS,
            payload: { navigation: 'forbiddenaccess', loading: false, responseStatus: error.response.status }
          });
        } else if (error.response?.status === 500) {
          toast.error(error.message);
        } else {
          toast.warn(error.response?.data || "Error fetching detail data");
        }
      });
  };

  closeViewModal = () => this.setState({ showViewModal: false, detailRows: [] });
  closeCatalogueModal = () => { this.props.onClose && this.props.onClose(); };

  onComboChange = (comboData, fieldName) => {
    const selectedRecord = { ...this.state.selectedRecord };
    selectedRecord[fieldName] = comboData;

    this.setState({
      selectedRecord,
      catalogueData: [],
      catalogueDataResult: process([], this.state.catalogueDataState),
      chartIndex: 0
    });

    if (fieldName === "nbioprojectcode") {
      const userinfo = this.props.Login.userInfo;
      this.props.dispatch(initRequest(true));
      const selectedProjectId = this.getIdFromOption(comboData, 'nbioprojectcode');

      rsapi()
        .post("biothirdpartyecatalogue/getSiteComboForProject", {
          nselectedprojectcode: selectedProjectId,
          userinfo
        })
        .then(response => {
          this.props.dispatch({ type: DEFAULT_RETURN, payload: { loading: false, shouldRender: false } });
          const SiteListData = constructOptionList(response.data['lstSite'] || [], "nsitecode", "ssitename", "nsitecode", undefined, false);
          const projectSiteList = SiteListData.get("OptionList");
          selectedRecord["nsitecode"] = projectSiteList && projectSiteList.length > 0 ? projectSiteList[0] : "";
          this.setState({ projectSiteList, selectedRecord });
        })
        .catch(error => {
          this.props.dispatch({ type: DEFAULT_RETURN, payload: { loading: false } });
          if (error.response?.status === 401 || error.response?.status === 403) {
            this.props.dispatch({
              type: UN_AUTHORIZED_ACCESS,
              payload: { navigation: 'forbiddenaccess', loading: false, responseStatus: error.response.status }
            });
          } else if (error.response?.status === 500) {
            toast.error(error.message);
          } else {
            toast.warn(error.response?.data || "Error fetching site list");
          }
        });
    } else {
      this.setState({ selectedRecord });
    }
  };

  dataStateChangeCatalogue = (event) => {
    const newDataState = event.dataState || event;
    this.setState({
      catalogueDataState: newDataState,
      catalogueDataResult: process(this.state.catalogueData || [], newDataState)
    });
  };

  dataStateChangeDetail = (event) => {
    const newDataState = event.dataState || event;
    this.setState({
      detailDataState: newDataState,
      detailDataResult: process(this.state.detailRows || [], newDataState)
    });
  };

  prevChart = () => this.setState(prev => ({ chartIndex: (prev.chartIndex - 1 + 2) % 2 }));
  nextChart = () => this.setState(prev => ({ chartIndex: (prev.chartIndex + 1) % 2 }));

  renderChartBody = () => {
    const { chartIndex, chartByProject, chartByDisease } = this.state;

    const titleProjects = this.props.intl.formatMessage({
      id: 'IDS_SUBJECTS_BY_PRODUCT_PROJECT',
      defaultMessage: 'Distinct Subject ID by Specimen Type — Projects'
    });
    const titleDisease = this.props.intl.formatMessage({
      id: 'IDS_SUBJECTS_BY_PRODUCT_DISEASE',
      defaultMessage: 'Distinct Subject ID by Specimen Type — Disease'
    });

    const isProject = chartIndex === 0;

    return (
      <>
        <Row className="mb-2 align-items-center">
          <Col xs={2}><Button variant="light" onClick={this.prevChart} aria-label="Previous chart">&larr;</Button></Col>
          <Col xs={8} className="text-center"><strong>{this.props.intl.formatMessage({ id: 'IDS_CHART', defaultMessage: 'Chart' })} {chartIndex + 1} / 2</strong></Col>
          <Col xs={2} className="text-right"><Button variant="light" onClick={this.nextChart} aria-label="Next chart">&rarr;</Button></Col>
        </Row>

        {isProject ? (
          <ColumnsSVG title={titleProjects} categories={chartByProject.categories} series={chartByProject.series} stacked={true} intl={this.props.intl} />
        ) : (
          <ColumnsSVG title={titleDisease} categories={chartByDisease.categories} series={chartByDisease.series} stacked={true} intl={this.props.intl} />
        )}
      </>
    );
  };

  render() {
    const showCatalogueModal = !!this.props.show;

    const catalogueColumns = [
      // { idsName: 'IDS_SITE', dataField: 'ssitename', width: '180px' },
      { idsName: 'IDS_BIOPROJECT', dataField: 'sprojecttitle', width: '220px' },
      { idsName: 'IDS_BIOSAMPLETYPE', dataField: 'sproductname', width: '180px' },
      { idsName: 'IDS_SAMPLECATEGORY', dataField: 'sproductcatname', width: '180px' },
      { idsName: 'IDS_TOTALAVAILABLESAMPLECOUNT', dataField: 'ntotalsamplecount', width: '160px', filter: 'numeric' },
      { idsName: 'IDS_TOTALAVAILABLEQUANTITY', dataField: 'stotalqty', width: '160px', filter: 'numeric' }
    ];

    const detailColumns = [
      { idsName: 'IDS_REPOSITORYID', dataField: 'spositionvalue', width: '140px' },
      { idsName: 'IDS_LOCATIONCODE', dataField: 'slocationcode', width: '140px' },
      { idsName: 'IDS_QUANTITY', dataField: 'sqty', width: '120px', filter: 'numeric' },
      { idsName: 'IDS_FREEZERID', dataField: 'sinstrumentid', width: '140px' },
      { idsName: 'IDS_PARENTSAMPLECODE', dataField: 'sparentsamplecode', width: '180px' },
      { idsName: 'IDS_COHORTNO', dataField: 'ncohortno', width: '120px' },
      { idsName: 'IDS_SUBJECTID', dataField: 'ssubjectid', width: '140px' },
      { idsName: 'IDS_CASETYPE', dataField: 'scasetype', width: '140px' },
      { idsName: 'IDS_DIAGNOSTICTYPE', dataField: 'sdiagnostictypename', width: '140px' },
      { idsName: 'IDS_BIOSAMPLETYPE', dataField: 'sproductname', width: '180px' },
      { idsName: 'IDS_SAMPLECATEGORY', dataField: 'sproductcatname', width: '180px' },
      { idsName: 'IDS_DISEASENAME', dataField: 'sdiseasename', width: '180px' },
      { idsName: 'IDS_DISEASECATEGORYNAME', dataField: 'sdiseasecategoryname', width: '180px' },
      { idsName: 'IDS_BIOPROJECT', dataField: 'sprojecttitle', width: '200px' },
      { idsName: 'IDS_SITE', dataField: 'ssitename', width: '150px' }
    ];

    const actionIcons = [{
      title: 'View',
      controlname: 'faEye',
      hidden: false,
      objectName: 'rowToView',
      onClick: (row) => {
        const selected = row && row.dataItem ? row.dataItem : row;
        this.openView(selected);
      },
    }];

    return (
      <Modal
        show={showCatalogueModal}
        onHide={this.closeCatalogueModal}
        size="xl"
        backdrop="static"
        dialogClassName="modal-halfscreen"
        centered
        enforceFocus={false}
      >
        <Modal.Header closeButton style={{ borderBottom: 0 }}>
          <Modal.Title id="catalogue-modal" style={{ fontWeight: "bold", color: "#1268e3" }}>
            E-Catalogue
          </Modal.Title>
          <div className="ml-auto d-flex align-items-center">
            <style>{`
              .toggle-btn{display:inline-flex;align-items:center;justify-content:center;width:36px;height:28px;border-radius:8px;border:1px solid transparent;background:#b0b0b0;color:#fff;margin-left:8px;transition:all .15s}
              .toggle-btn.active{background:#1268e3;border-color:#1268e3}
              .toggle-btn:hover{box-shadow:0 1px 4px rgba(0,0,0,.15)}
            `}</style>

            <button
              type="button"
              className={`toggle-btn ${this.state.activePanel === 'charts' ? 'active' : ''}`}
              onClick={() => this.setState({ activePanel: 'charts' })}
              title={this.props.intl.formatMessage({ id: 'IDS_CHARTS', defaultMessage: 'Charts' })}
              aria-label="Charts"
            >
              <FontAwesomeIcon icon={faChartBar} />
            </button>

            <button
              type="button"
              className={`toggle-btn ${this.state.activePanel === 'grid' ? 'active' : ''}`}
              onClick={() => this.setState({ activePanel: 'grid' })}
              title={this.props.intl.formatMessage({ id: 'IDS_GRID', defaultMessage: 'Grid' })}
              aria-label="Grid"
            >
              <FontAwesomeIcon icon={faTable} />
            </button>
          </div>
        </Modal.Header>

        <Modal.Body>
          {this.state.activePanel !== 'charts' && (
            <Row className="mb-3">
              <Col md={4}>
                <FormSelectSearch
                  formLabel={this.props.intl.formatMessage({ id: "IDS_BIOPROJECT" })}
                  isSearchable={true}
                  name={"nbioprojectcode"}
                  isDisabled={false}
                  placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                  isMandatory={true}
                  options={this.state.bioProjectList}
                  optionId='nbioprojectcode'
                  optionValue='sprojecttitle'
                  value={this.state.selectedRecord?.nbioprojectcode || (Array.isArray(this.state.bioProjectList) && this.state.bioProjectList[0])}
                  onChange={(event) => this.onComboChange(event, 'nbioprojectcode')}
                  closeMenuOnSelect={true}
                  alphabeticalSort={true}
                />
              </Col>
              <Col md={4} style={{ marginBottom: "2rem" }} className="d-flex align-items-end">
                <Button variant="primary" onClick={this.onCatalogueSubmit}>
                  {this.props.intl.formatMessage({ id: 'IDS_SUBMIT', defaultMessage: 'Submit' })}
                </Button>
              </Col>
            </Row>
          )}

          {this.state.activePanel === 'grid' ? (
            <>
              <Row className="mb-2">
                <Col md={12}>
                  <DataGrid
                    primaryKeyField={"nproductcode"}
                    dataResult={this.state.catalogueDataResult}
                    data={this.state.catalogueData}
                    dataState={this.state.catalogueDataState}
                    dataStateChange={this.dataStateChangeCatalogue}
                    extractedColumnList={catalogueColumns}
                    pageable={true}
                    scrollable={"scrollable"}
                    isToolBarRequired={false}
                    gridHeight={'70vh'}
                    isActionRequired={false}
                    actionIcons={actionIcons}
                    userRoleControlRights={[]}
                    onRowDoubleClick={(e) => this.openView(e.dataItem)}
                  />
                </Col>
              </Row>

              {this.state.showViewModal && (
                <Modal show={this.state.showViewModal} onHide={this.closeViewModal} size="xl" backdrop="static" enforceFocus={false}>
                  <Modal.Header closeButton><Modal.Title>{this.props.intl.formatMessage({ id: 'IDS_VIEW', defaultMessage: 'View' })}</Modal.Title></Modal.Header>
                  <Modal.Body>
                    <DataGrid
                      primaryKeyField={"spositionvalue"}
                      dataResult={this.state.detailDataResult}
                      data={this.state.detailRows}
                      dataState={this.state.detailDataState}
                      dataStateChange={this.dataStateChangeDetail}
                      extractedColumnList={detailColumns}
                      pageable={true}
                      scrollable={"scrollable"}
                      isToolBarRequired={false}
                      gridHeight={'70vh'}
                    />
                  </Modal.Body>
                </Modal>
              )}
            </>
          ) : (
            this.renderChartBody()
          )}
        </Modal.Body>
      </Modal>
    );
  }
}

export default injectIntl(connect(mapStateToProps)(BioThirdPartyECatalogueModal));
