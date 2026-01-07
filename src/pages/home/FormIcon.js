import React from 'react'
import { Form, Image } from 'react-bootstrap'
import { ReactComponent as Manufacturer } from '../../assets/image/forms-icon/manufacturer.svg';
import { ReactComponent as DiscountBand } from '../../assets/image/forms-icon/discount band.svg';
import { ReactComponent as VATBand } from '../../assets/image/forms-icon/vat band.svg';
import { ReactComponent as OEM } from '../../assets/image/forms-icon/oem.svg';
import { ReactComponent as Quotation } from '../../assets/image/forms-icon/quotation.svg';
import { ReactComponent as SampleRegistration } from '../../assets/image/forms-icon/sample registration.svg';            
import { ReactComponent as JobAllocation} from '../../assets/image/forms-icon/job allocation.svg';            
import { ReactComponent as Worklist} from '../../assets/image/forms-icon/worklist.svg';             
import { ReactComponent as MyJobs} from '../../assets/image/forms-icon/my jobs.svg';             
import { ReactComponent as RunBatchCreation} from '../../assets/image/forms-icon/run batch creation.svg';             
import { ReactComponent as ResultEntry} from '../../assets/image/forms-icon/result entry.svg';             
import { ReactComponent as TestApproval} from '../../assets/image/forms-icon/test approval.svg';             
import { ReactComponent as StorageCategory} from '../../assets/image/forms-icon/storage category.svg';             
import { ReactComponent as ChainofCustody} from '../../assets/image/forms-icon/chain of custody.svg';             
import { ReactComponent as ReleaseReport} from '../../assets/image/forms-icon/release.svg';             
import { ReactComponent as Reason} from '../../assets/image/forms-icon/reason.svg';             
import { ReactComponent as UnitofMeasurement} from '../../assets/image/forms-icon/unit of measurement.svg';             
import { ReactComponent as StorageCondition} from '../../assets/image/forms-icon/storage condition.svg';              
import { ReactComponent as StorageLocation} from '../../assets/image/forms-icon/storage location.svg';              
import { ReactComponent as ContainerType} from '../../assets/image/forms-icon/container type.svg';              
import { ReactComponent as Barcode} from '../../assets/image/forms-icon/barcode.svg';              
import { ReactComponent as SampleTestComments} from '../../assets/image/forms-icon/sample test comments.svg';              
import { ReactComponent as RegistrationType} from '../../assets/image/forms-icon/registration type.svg';              
import { ReactComponent as RegistrationSubType} from '../../assets/image/forms-icon/registration sub type.svg';              
import { ReactComponent as TemplateDesign} from '../../assets/image/forms-icon/template design.svg';              
import { ReactComponent as TemplateMapping} from '../../assets/image/forms-icon/template mapping.svg';              
import { ReactComponent as UserRoleTemplate} from '../../assets/image/forms-icon/user role template.svg';              
import { ReactComponent as ApprovalConfiguration} from '../../assets/image/forms-icon/approval configuration.svg';              
import { ReactComponent as FTPConfig} from '../../assets/image/forms-icon/ftp config.svg';              
import { ReactComponent as UserMapping} from '../../assets/image/forms-icon/user mapping.svg';              
import { ReactComponent as Language} from '../../assets/image/forms-icon/language.svg';              
import { ReactComponent as Designation} from '../../assets/image/forms-icon/designation.svg';              
import { ReactComponent as PasswordPolicy} from '../../assets/image/forms-icon/password policy.svg';              
import { ReactComponent as ScreenRights} from '../../assets/image/forms-icon/screen rights.svg';              
import { ReactComponent as UserRole} from '../../assets/image/forms-icon/user role template.svg';              
import { ReactComponent as Users} from '../../assets/image/forms-icon/users.svg';              
import { ReactComponent as MISRights} from '../../assets/image/forms-icon/mis rights.svg';              
import { ReactComponent as AuditTrail} from '../../assets/image/forms-icon/audit trail.svg';              
import { ReactComponent as UserRoleConfiguration} from '../../assets/image/forms-icon/user role configuration.svg';              
import { ReactComponent as ExceptionLogs} from '../../assets/image/forms-icon/exception logs.svg';              
import { ReactComponent as LIMSELNSiteMapping} from '../../assets/image/forms-icon/lims eln sitemapping.svg';              
import { ReactComponent as LIMSELNUserMapping} from '../../assets/image/forms-icon/lims eln usermapping.svg';              
import { ReactComponent as Site} from '../../assets/image/forms-icon/site.svg';              
import { ReactComponent as Department} from '../../assets/image/forms-icon/department.svg';              
import { ReactComponent as Lab} from '../../assets/image/forms-icon/lab.svg';              
import { ReactComponent as Section} from '../../assets/image/forms-icon/section.svg';              
import { ReactComponent as Organisation} from '../../assets/image/forms-icon/organisation.svg';              
import { ReactComponent as MethodCategory} from '../../assets/image/forms-icon/method category.svg';              
import { ReactComponent as Method} from '../../assets/image/forms-icon/method.svg';              
import { ReactComponent as TestCategory} from '../../assets/image/forms-icon/test category.svg';              
import { ReactComponent as TestMaster} from '../../assets/image/forms-icon/test master.svg';              
import { ReactComponent as TestPricing} from '../../assets/image/forms-icon/test pricing.svg';              
import { ReactComponent as TemplateMaster} from '../../assets/image/forms-icon/template master.svg';              
import { ReactComponent as TestGroup} from '../../assets/image/forms-icon/test group.svg';              
import { ReactComponent as InstrumentCategory} from '../../assets/image/forms-icon/instrument category.svg';              
import { ReactComponent as Instrument} from '../../assets/image/forms-icon/instrument.svg';              
import { ReactComponent as MaterialCategory} from '../../assets/image/forms-icon/material category.svg';              
import { ReactComponent as Material} from '../../assets/image/forms-icon/material.svg';              
import { ReactComponent as MaterialInventory} from '../../assets/image/forms-icon/materialinventory.svg';              
import { ReactComponent as MaterialGrade} from '../../assets/image/forms-icon/material grade.svg';              
import { ReactComponent as QBCategory} from '../../assets/image/forms-icon/qb category.svg';              
import { ReactComponent as QB} from '../../assets/image/forms-icon/qb.svg';              
import { ReactComponent as Checklist} from '../../assets/image/forms-icon/checklist.svg';              
import { ReactComponent as Country} from '../../assets/image/forms-icon/country.svg';              
import { ReactComponent as SupplierCategory} from '../../assets/image/forms-icon/supplier category.svg';              
import { ReactComponent as Supplier} from '../../assets/image/forms-icon/supplier.svg';              
import { ReactComponent as ClientCategory} from '../../assets/image/forms-icon/client category.svg';              
import { ReactComponent as Client} from '../../assets/image/forms-icon/client.svg';              
import { ReactComponent as Courier} from '../../assets/image/forms-icon/courier.svg';              
import { ReactComponent as SampleCategory} from '../../assets/image/forms-icon/sample category.svg';              
import { ReactComponent as SampleType} from '../../assets/image/forms-icon/product.svg';              
import { ReactComponent as Component} from '../../assets/image/forms-icon/component.svg';              
import { ReactComponent as ReportDesigner} from '../../assets/image/forms-icon/report designer.svg';              
import { ReactComponent as Region} from '../../assets/image/forms-icon/region.svg';              
import { ReactComponent as District} from '../../assets/image/forms-icon/district.svg';              
import { ReactComponent as City} from '../../assets/image/forms-icon/city.svg';              
import { ReactComponent as InstitutionCategory} from '../../assets/image/forms-icon/institution category.svg';              
import { ReactComponent as Institution} from '../../assets/image/forms-icon/institution.svg';              
import { ReactComponent as InstitutionDepartment} from '../../assets/image/forms-icon/institution department.svg';              
import { ReactComponent as Submitter} from '../../assets/image/forms-icon/submitter.svg';              
import { ReactComponent as PatientMaster} from '../../assets/image/forms-icon/patient master.svg';              
import { ReactComponent as ProjectType} from '../../assets/image/forms-icon/project type.svg';           
import { ReactComponent as ProjectMaster} from '../../assets/image/forms-icon/project master.svg';             
import { ReactComponent as ProjectView} from '../../assets/image/forms-icon/project view.svg';              
import { ReactComponent as ReportingTool} from '../../assets/image/forms-icon/stimulsoft.svg';              
import { ReactComponent as Reports} from '../../assets/image/forms-icon/reports.svg';              
import { ReactComponent as SqlBuilder} from '../../assets/image/forms-icon/sql builder.svg';              
import { ReactComponent as DashboardTypes} from '../../assets/image/forms-icon/dashboard types.svg';              
import { ReactComponent as DashboardView} from '../../assets/image/forms-icon/dashboard view.svg';              
import { ReactComponent as DashboardHomeConfig} from '../../assets/image/forms-icon/dashboard home config.svg';              
import { ReactComponent as AlertView} from '../../assets/image/forms-icon/alert view.svg';              
import { ReactComponent as QueryBuilder} from '../../assets/image/forms-icon/query builder.svg';              
import { ReactComponent as Technique} from '../../assets/image/forms-icon/technique.svg';              
import { ReactComponent as TrainingCategory} from '../../assets/image/forms-icon/training category.svg';              
import { ReactComponent as TrainingCertification} from '../../assets/image/forms-icon/training & certification.svg';              
import { ReactComponent as TrainingUpdate} from '../../assets/image/forms-icon/training update.svg';              
import { ReactComponent as ReScheduleLog} from '../../assets/image/forms-icon/reschedule log.svg';              
import { ReactComponent as UserView} from '../../assets/image/forms-icon/user view.svg';              
import { ReactComponent as GoodsIn} from '../../assets/image/forms-icon/goods in.svg';              
import { ReactComponent as MailHost} from '../../assets/image/forms-icon/mail host.svg';              
import { ReactComponent as MailTemplate} from '../../assets/image/forms-icon/mail template.svg';              
import { ReactComponent as MailConfig} from '../../assets/image/forms-icon/mail config.svg';              
import { ReactComponent as MailAlertTransaction} from '../../assets/image/forms-icon/mail alert transaction.svg';              
import { ReactComponent as MailStatus} from '../../assets/image/forms-icon/mail status.svg';              
import { ReactComponent as StorageStructure} from '../../assets/image/forms-icon/sample storage structure.svg';              
import { ReactComponent as InterfacerMapping} from '../../assets/image/forms-icon/Interfacer Mapping.svg';              
import { ReactComponent as InstrumentLocation} from '../../assets/image/forms-icon/Instrument Location.svg';              
import { ReactComponent as SyncHistory} from '../../assets/image/forms-icon/Sync History.svg';              
import { ReactComponent as SampleCycle} from '../../assets/image/forms-icon/sample cycle.svg';              
import { ReactComponent as SampleCollectionType} from '../../assets/image/forms-icon/Sample Collection Type.svg';                 
import { ReactComponent as ContainerStructure} from '../../assets/image/forms-icon/Container Structure.svg';              
import { ReactComponent as MaterialRetrievalCertificate} from '../../assets/image/forms-icon/Material Retrieval Certificate.svg';              
import { ReactComponent as SampleStorageMapping} from '../../assets/image/forms-icon/Sample Storage Mapping.svg';              
import { ReactComponent as SampleStorage} from '../../assets/image/forms-icon/Sample Storage.svg';       
import { ReactComponent as SampleListPreparation} from '../../assets/image/forms-icon/Sample List preparation.svg'; 
import { ReactComponent as SampleRetrievalandDisposal} from '../../assets/image/forms-icon/Sample Retrieval and Disposal.svg'; 
import { ReactComponent as VisitNumber} from '../../assets/image/forms-icon/visit number.svg'; 
import { ReactComponent as SampleDonor} from '../../assets/image/forms-icon/Sample Donor.svg'; 
import { ReactComponent as PatientCategory} from '../../assets/image/forms-icon/Patient Category.svg'; 
import { ReactComponent as CollectionTubType} from '../../assets/image/forms-icon/Collection tube type.svg'; 
import { ReactComponent as StudyIdentity} from '../../assets/image/forms-icon/Study Identity.svg'; 
import { ReactComponent as CollectionSite} from '../../assets/image/forms-icon/Collection Site.svg'; 
import { ReactComponent as SamplePunchSite} from '../../assets/image/forms-icon/Sample Punch Site.svg'; 
import { ReactComponent as ContainerRelocation } from '../../assets/image/forms-icon/Container Relocation.svg'; 
import { ReactComponent as PlantGroup } from '../../assets/image/forms-icon/Plant Group.svg'; 
import { ReactComponent as FusionPlant  } from '../../assets/image/forms-icon/Fusion Plant.svg'; 
import { ReactComponent as FusionSite  } from '../../assets/image/forms-icon/Fusion Site.svg'; 
import { ReactComponent as FusionUsers  } from '../../assets/image/forms-icon/Fusion Users.svg'; 
import { ReactComponent as FusionPlantUser  } from '../../assets/image/forms-icon/Fusion Plant User.svg'; 
import { ReactComponent as SampleGroup  } from '../../assets/image/forms-icon/Sample Group.svg'; 
import { ReactComponent as SamplePlantMapping  } from '../../assets/image/forms-icon/Sample Plant Mapping.svg'; 


import { ReactComponent as HolidayPlanner  } from '../../assets/image/forms-icon/holiday planner.svg'; 
import { ReactComponent as BarcodeTemplate  } from '../../assets/image/forms-icon/barcode template.svg'; 
import { ReactComponent as BarcodeConfiguration   } from '../../assets/image/forms-icon/barcode configuration.svg'; 
import { ReactComponent as UnitConversion  } from '../../assets/image/forms-icon/unit conversion.svg'; 
import { ReactComponent as SampleAppearence  } from '../../assets/image/forms-icon/sample appearance.svg'; 
import { ReactComponent as ADSSettings  } from '../../assets/image/forms-icon/ads settings.svg'; 
import { ReactComponent as ADSUsers  } from '../../assets/image/forms-icon/ads users.svg'; 
import { ReactComponent as TransactionFilterConfig  } from '../../assets/image/forms-icon/transaction filter config.svg'; 
import { ReactComponent as TransactionUser  } from '../../assets/image/forms-icon/Transaactionnn user.svg'; 
import { ReactComponent as CalenderProperties  } from '../../assets/image/forms-icon/calender properties.svg';

import { ReactComponent as ThirdPartyUserMapping  } from '../../assets/image/forms-icon/third party user mapping.svg'; 
import { ReactComponent as BioProject  } from '../../assets/image/forms-icon/bio project.svg'; 
import { ReactComponent as BioSampleReceiving  } from '../../assets/image/forms-icon/biobank sample receiving.svg'; 
import { ReactComponent as DirectTransfer  } from '../../assets/image/forms-icon/direct transfer.svg'; 
import { ReactComponent as DiseaseCategory  } from '../../assets/image/forms-icon/disease category.svg'; 
import { ReactComponent as Disease  } from '../../assets/image/forms-icon/disease.svg'; 
import { ReactComponent as Hospital  } from '../../assets/image/forms-icon/hospital.svg'; 
import { ReactComponent as ParentSampleReceivingandCollection  } from '../../assets/image/forms-icon/parent sample receiving and collection.svg'; 
import { ReactComponent as ProjectSiteHierarchyMapping  } from '../../assets/image/forms-icon/project site hierarchy mapping.svg'; 
import { ReactComponent as SampleCodeCreation  } from '../../assets/image/forms-icon/sample code creation.svg';
import { ReactComponent as SiteHospitalMapping  } from '../../assets/image/forms-icon/site hospital mapping.svg'; 
import { ReactComponent as SiteType  } from '../../assets/image/forms-icon/site type.svg'; 
import { ReactComponent as SiteHierarchy  } from '../../assets/image/forms-icon/site hierarchy.svg'; 
import { ReactComponent as StorageInstrument  } from '../../assets/image/forms-icon/storage instruemnet screen.svg'; 

import { ReactComponent as BGSIEcatalogue  } from '../../assets/image/forms-icon/BGSI -E catalogue.svg'; 
import { ReactComponent as BGSIReturn  } from '../../assets/image/forms-icon/BGSI return.svg'; 
import { ReactComponent as EcatalogueRequestApproval  } from '../../assets/image/forms-icon/e catalogue request approval.svg'; 
import { ReactComponent as FormAcceptance  } from '../../assets/image/forms-icon/form acceptance.svg'; 
import { ReactComponent as NGSeCatalogue  } from '../../assets/image/forms-icon/ngs e-catalogue.svg'; 
import { ReactComponent as RequestBasedTransfer  } from '../../assets/image/forms-icon/request based transfer.svg'; 
import { ReactComponent as SampleRetrival  } from '../../assets/image/forms-icon/sample Retrival.svg'; 
import { ReactComponent as ThirdPartyEcatalogue  } from '../../assets/image/forms-icon/third party e catalogue.svg'; 
import { ReactComponent as ThirdPartyECatalogueDataAccessRequestAndApproval } from '../../assets/image/forms-icon/third party E-catalogue data access request and approval.svg'; 
import { ReactComponent as ThirdPartyFormAcceptance  } from '../../assets/image/forms-icon/third party form acceptance.svg'; 
import { ReactComponent as ThirdPartyReturn  } from '../../assets/image/forms-icon/third party return.svg'; 
import { ReactComponent as DisposalofSamplesandApproval  } from '../../assets/image/forms-icon/disposal of sample and approval.svg'; 
import { ReactComponent as LocationBarcodePrinting  } from '../../assets/image/forms-icon/Location barcode printing.svg'; 
import { ReactComponent as ParentSampleBarcodePrinting  } from '../../assets/image/forms-icon/Parent sample barcode printing.svg'; 
import { ReactComponent as RepositoryIdBarcodePrint  } from '../../assets/image/forms-icon/Repository Id Barcode Print.svg'; 
import { ReactComponent as BGSIOldTransferredRecords  } from '../../assets/image/forms-icon/BGSI old transferred records.svg'; 

const { faAd, faMagic, faUniversity, faAddressBook } = require("@fortawesome/free-solid-svg-icons")
const { FontAwesomeIcon } = require("@fortawesome/react-fontawesome")



const FormsIcon = (props) => {
    switch (props.form.nformcode) {            

  


        case 2:
            return   <Manufacturer />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 3:
            return   <Users />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 5:
            return   <Country />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 7:
            return   <GoodsIn />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 8:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 15:
            return   <Component />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 20:
            return   <ClientCategory />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 21:
            return   <MethodCategory />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 22:
            return   <Method />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 23:
            return   <MaterialCategory />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 24:
            return   <SampleCategory />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 25:
            return   <TestCategory />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 27:
            return   <InstrumentCategory />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 28:
            return   <Instrument />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 29:
            return   <Site />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 30:
            return   <Department />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 31:
            return   <Section />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 32:
            return   <Lab />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 33:
            return   <UnitofMeasurement />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 34:
            return   <StorageCondition />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 35:
            return   <StorageLocation  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 36:
            return   <Designation />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;   
        
        case 39:
            return   <SampleType />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 40:
            return   <Material />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
            
        
        case 41:
            return   <TestMaster />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 43:
            return   <SampleRegistration  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 45:
            return   <ContainerType />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 47:
            return   <SupplierCategory />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 48:
            return   <Supplier />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 49:
            return   <Courier />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 50:
            return   <Client />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 51:
            return   <PasswordPolicy />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 52:
            return   <ScreenRights />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;            

        case 54:
            return   <Organisation />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 55:
            return   <ApprovalConfiguration />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 56:
            return   <ResultEntry  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 57:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 58:
            return   <UserRoleTemplate />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;    

        case 60:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 61:
            return   <TestApproval  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 62:
            return   <TestGroup />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 63:
            return   <TemplateMaster />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

         case 64:
            return   <QBCategory />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

         case 65:
            return   <QB />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 66:
            return   <Checklist />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 67:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
            
        case 70:
            return   <UserRole />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 74:
            return   <MailHost  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 75:
            return   <MailTemplate />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 76:
            return   <MailConfig />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 77:
            return   <ReportDesigner />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 78:
            return   <AuditTrail />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 81:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 82:
            return   <DashboardTypes />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 83:
            return   <SqlBuilder />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 86:
            return   <Technique />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 87:
            return   <TrainingCategory />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;   

        case 88:
            return   <TrainingCertification />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;     

        case 89:
            return   <TrainingUpdate />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;  
            
        case 95:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
            
        case 96:
            return   <UserView />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 98:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 107:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 108:
        return   <Barcode  />
        // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
        break;

        case 110:
            return   <JobAllocation />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 111:
            return   <FTPConfig />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 112:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 113:
            return   <TestPricing/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 114:
            return   <MailAlertTransaction />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 115:
            return   <MailStatus  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 117:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        

        case 118:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 119:
            return   <UserRoleConfiguration />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 121:
            return   <Reports />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 123:
            return   <DashboardView />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 124:
            return   <DashboardHomeConfig />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 125:
            return   <AlertView />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 126:
            return   <UserMapping />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 130:
            return   <MISRights />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 131:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;        
        

        case 132:
            return   <TemplateDesign />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 133:
            return   <RegistrationType />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 134:
            return   <TemplateMapping />            
 
        case 135:
            return   <RegistrationSubType />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 136:
            return   <ReScheduleLog/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 137:
            return   <PatientMaster />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 138:
            return   <MaterialInventory />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 140:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 141:
            return   <SampleTestComments />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 142:
            return   <MyJobs />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 143:
            return   <ReleaseReport />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
                break;

        case 144:
            return   <QueryBuilder />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 145:
            return   <ExceptionLogs />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 146:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
            
        case 147:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 148:
            return   <Language />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 149:
            return   <InstitutionDepartment />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 150:
            return   <City />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 151:
            return   <InstitutionCategory />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 152:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 153:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 154:
            return   <StorageCategory />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 156:
            return   <MaterialGrade />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 158:
            return   <Institution />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 159:
            return   <Submitter />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 160:
            return   <Region />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 161:
            return   <District />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 162:
            return   <Reason />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 163:
            return   <ProjectType />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 164:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 165:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 166:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 167:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 168:
            return   <StorageStructure />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 169:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 170:
            return   <ReportingTool />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        

        case 171:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;


        case 172:
            return   <ProjectMaster />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 173:
            return   <Worklist />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 174:
            return   <RunBatchCreation />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 175:
            return   <ChainofCustody />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 176:
            return   <DiscountBand />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 177:
            return   <Quotation  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 178:
            return   <VATBand />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 179:
            return   <ProjectView />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 180:
            return   <LIMSELNUserMapping  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 181:
            return   <LIMSELNSiteMapping />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 182:
            return   <OEM  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 183:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 184:
            return   <Image src={require(`../../assets/image/forms-icon/${props.form.sformname.toLowerCase()}.svg`)} alt="sidebar" height="60"  />
            break; 

        case 185:
            return   <InstrumentLocation />            
            break; 
            
        case 187:
            return   <CollectionTubType />            
            break;

        case 188:
            return   <PatientCategory />            
            break;
        
        case 189:
            return   <SampleCycle />            
            break;

        case 190:
            return   <SampleCollectionType/>            
            break;

        case 191:
            return   <SampleDonor/>            
            break;

        case 192:
            return   <StudyIdentity/>            
            break;

        case 193:
            return   <CollectionSite />            
            break; 

        case 194:
            return   <SamplePunchSite />            
            break; 
            
        case 195:
            return   <VisitNumber />            
            break; 

        case 196:
            return   <SyncHistory />            
            break;  
            
        case 197:
            return   <SampleStorageMapping />            
            break;  
        
        case 198:
            return   <SampleListPreparation />            
            break;

        case 199:
            return   <SampleStorage/>            
            break;        
        
        case 200:
            return   <InterfacerMapping/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;      
        
        case 201:
            return   <ContainerStructure/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;  
        
        case 202:
            return   <MaterialRetrievalCertificate/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        // case 203:
        //     return   <SampleRetrievalandDisposal/>
        //     // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
        //     break;

        case 208:
            return   <ContainerRelocation  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 210:
            return   <FusionPlant  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 211:
            return   <FusionSite  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
            
        case 212:
            return   <FusionUsers  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
            
        case 213:
            return   <SampleGroup  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 215:
            return   <PlantGroup  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 209:
            return   <FusionPlantUser  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 219:
            return   <SamplePlantMapping  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;


        
        case 127:
            return   <HolidayPlanner   />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 204:
            return   <BarcodeTemplate  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 205:
            return   <BarcodeConfiguration   />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        
        case 206:
            return   <UnitConversion  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;            
        
        case 207:
            return   <SampleAppearence  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;            
        
        case 214:
            return   <ADSSettings  />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;            
        
        case 216:
            return   <ADSUsers   />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;            
        
        case 224:
            return   <TransactionFilterConfig/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;            
        
        case 225:
            return   <TransactionUser/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;            
        
        case 226:
            return   <CalenderProperties/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        case 261:
            return   <ThirdPartyUserMapping/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        case 256:
            return   <BioProject/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        case 270:
            return   <BioSampleReceiving />
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        case 253:
            return   <DiseaseCategory/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        case 254:
            return   <Disease/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        case 258:
            return   <Hospital/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        case 262:
            return   <ParentSampleReceivingandCollection/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        case 260:
            return   <ProjectSiteHierarchyMapping/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        case 268:
            return   <SampleCodeCreation/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        case 259:
            return   <SiteHospitalMapping/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        case 255:
            return   <SiteType/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        case 273:
            return   <DirectTransfer/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        case 257:
            return   <SiteHierarchy/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;
        case 272:
            return   <StorageInstrument/>
            // <Form.Check.Label className={`mr-3 label-circle ${['label-orange', 'label-green', 'label-yellow', 'label-purple'][props.index % 4]}`} htmlFor={`tm_customCheck_${props.index}`}>{props.option['sdisplayname'].substring(0, 1).toUpperCase()}</Form.Check.Label>
            break;

        case 203:
            return <SampleRetrival />
            break;

        case 278:
            return <BGSIEcatalogue />
            break;

        case 279:
            return <FormAcceptance />
            break;

        case 281:
            return <RequestBasedTransfer />
            break;

        case 282:
            return <BGSIReturn />
            break;

        case 295:
            return <ThirdPartyFormAcceptance />
            break;

        case 297:
            return <DisposalofSamplesandApproval />
            break;

        case 298:
            return <ThirdPartyReturn />
            break;

        case 299:
            return <ThirdPartyECatalogueDataAccessRequestAndApproval />
            break;

        case 303:
            return <BGSIOldTransferredRecords />
            break;

        case 304:
            return <EcatalogueRequestApproval />
            break;

        case 309:
            return <ThirdPartyEcatalogue />
            break;

        case 310:
            return <ParentSampleBarcodePrinting />
            break;

        case 311:
            return <NGSeCatalogue />
            break;
        
        case 312:
            return <RepositoryIdBarcodePrint />
            break;

        case 313:
            return <LocationBarcodePrinting />
            break;

        default:
            return   <>
                        <span className='home-default-icon'>
                            {/* <FontAwesomeIcon icon={faUniversity} size={props.size}/>  */}
                            {props.form['sdisplayname'].substring(0, 1).toUpperCase()}
                        </span>
                    </>           
            break;
    }

}

export default FormsIcon;