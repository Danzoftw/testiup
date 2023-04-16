import "bootstrap/dist/css/bootstrap.min.css";
import { Dialog, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { IModalProps } from 'office-ui-fabric-react/lib/Modal';
import * as React from 'react';
import { NotificationManager } from 'react-notifications';
import "../../../../node_modules/office-ui-fabric-react/dist/css/fabric.min.css";
import { Checkbox } from '../../../../node_modules/office-ui-fabric-react/lib/Checkbox';
import { iocContainer } from '../../../inversify.config';
import { aecsTooltip, ApproverTypes, BudgetedDCOpsApprovalStages, BudgetedEnergyApprovalStages, BudgetedPropOpsApprovalStages, CacheKeys, DCOpsAndEnergyStage2Roles, DCOpsRoles, DCOpsSelfFundedDirectorRoles, DCOpsSelfFundedPropertyRoles, DefaultCurrency, DefaultICapitalRequest, EmployeeRoles, EnergyNotifierRoles, EnergySavings, EnergyStage1Roles, fileExtentions, FileMaxLimit, FundingSourceList, MarketTypes, MonthOptions, paybackperiodTooltip, PriorityTypes, projectDescrptionTooltip, projectJustificationTooltip, ProjectManagementList, ProjectTypeToolTip, PropertyUserRoles, PropOpsAdditionalFundingRoles, PropOpsSelfFundedDirectorRoles, PropOpsSelfFundedPropertyRoles, PUENOIHelpText, Regions, RequestingGroupList, Requestor, roiTooltip, Status, UnbudgetedNotifierRoles, UnitsOfMeasureOptions, VendorManagement, projectManagementTooltip, BudgetUsdTootip, BudgetTooltip, DcOpsRiskQuestionOptions, PropOpsRiskQuestionOptions, RiskProfileCombs, EnvironmentalImpact, EnvironmentalImpactApplicable, OperationalImpactApplicable, OperationalImpact, ProjectTypes, SecondLevelPropOpsSelfFundedProperty, ThirdLevelPropOpsSelfFundedProperty, SecondLevelDCOpsSelfFundedProperty, ThirdLevelDcOpsSelfFundedProperty, SecondLevelPropOpsSelfFundedDirector, SecondLevelDCOpsSelfFundedDirector, DisplayDateOptionTypes, FundingList } from '../../Assets/Constants';
import { CallToActions, FieldTypes, IUPActions, IUPFieldLabels, IUPFields, IUPStatus, OfficeUIAttachmentIcons, RiskProfile, ServiceSymbols, NotificationType } from '../../Assets/Enums/Enum';
import '../../Assets/Extensions/Index';
import { IAttachmentService } from '../../Common/Services/AttachmentService';
import { ICacheService } from "../../Common/Services/CacheService";
import { ICapitalRequestService } from '../../Common/Services/IUPRequestService';
import { IUtility } from '../../Common/Services/Utility';
import '../../Common/Styles/CTAButtons.scss';
import "../../Common/Styles/Tab.scss";
import "../../Common/Styles/Utility.scss";
import { ICurrency } from '../../Interfaces/Common/ICurrency';
import { IApprover } from '../../Interfaces/Common/IIUPUser';
import { IIUPYear } from "../../Interfaces/Common/IIUPYear";
import { IOperationStatus } from '../../Interfaces/Common/IOperationStatus';
import ISelectOption from "../../Interfaces/Common/ISelectOptions";
import { IFilterValues } from '../../Interfaces/Dashboard/IFilterValues';
import { IAllocatedProject } from '../../Interfaces/Form/IAllocatedProject';
import { IStageRole } from "../../Interfaces/Form/IApprovalStage";
import { IIUPApprover, IEuropeApprover } from "../../Interfaces/Form/IEuropeApprover";
import { IEuropeInputter } from "../../Interfaces/Form/IEuropeInputter";
import { IIUPFormViewResources, IIUPRequestResources } from '../../Interfaces/Form/IIUPFormResources';
import { IAttachment, ICapitalRequest } from '../../Interfaces/Form/IIUPRequest';
import { IProjectType } from '../../Interfaces/Form/IProjectType';
import { IProperty, IRoleLevel } from '../../Interfaces/Form/IProperty';
import { IPropertyUserRole } from '../../Interfaces/Form/IPropertyUserRole';
import { IRequestResource, IRMBudget } from "../../Interfaces/Form/IUserPermissions";
import { IImpact, ISustainability, IUPImpactTypes } from "../../Interfaces/Form/Sustainability/ISustainability";
import ApproverComponent from "../ApproverComponent/index";
import { CallOut } from '../Common/Callout/CallOut';
import CurrencyComponent from '../Common/CurrencyBox';
import RichTextEditor from "../Common/RichTextEditor/RichTextEditorComponent";
import { SelectDropDownComponent as DLRSelct } from '../Common/SelectDropdown/SelectDropDown';
import TextBoxComponent from '../Common/TextBox';
import "..//DashBoard/IUPrequests.scss";
import '../DashBoard/PopUp.scss';
import Loader from '../Loader/Loader';
import TestLoader from '../Loader/TestLoader';
import IUPTopNavigation from "../TopNavigation/TopNavigation";
import UnBudgeted from '../Unbudgeted/UnBudgeted';
import RequestCTASectionComponent from './CTASection';
import "./Request Form.scss";
import IUPAttachments from '../SustainabilityAttachments/IUPAttachments';
import { ISustainabilityResource } from "../../Interfaces/Form/Sustainability/ISustainabilityResource";
import { IUPImpactAttachment } from "../../Interfaces/Form/IUserPermissions";
import { RiskProfileQuestions } from "../../Assets/Constants"
import { IRequestURL } from "../../Interfaces/Common/IRequestURL";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';


interface IRequestFormComponentProps {
    projectId: number;
    history: any;
    filters: IFilterValues;
}

interface IRequestFormComponentState {
    isEdit: boolean;
    updatedRequest: ICapitalRequest;
    showLoader: boolean;
    activeTab: string;
    isError: boolean;
    isApproversError?: boolean;
    isValuesChanged?: boolean;
    isTitleTyping?: boolean;
    showReturnPopup: boolean;
    showRMPopup: boolean;
    showDeferPopup: boolean;
    showDeletePopup: boolean;
    showMoveToPlanningPopup: boolean;
    isSaveError: boolean;
    isAdmin: boolean;
    isColoUser: boolean;
    isUserHasPermission: boolean;
    IsCommentsEmpty?: boolean;
    IsReturnLevelEmpty?: boolean;
    canSubmit: boolean;
    isAttachmentsLoading: boolean;
    isEuropeAdmin: boolean;
    Sustainability: ISustainability;
    showAttachmentsPopup: boolean;
    impactType: string;
    index: number;
    fileUploadId: string;
    ImpactMapping: IUPImpactTypes[];
    ImpactName: string;
    ImpactTitle: string;
    requestURL: IRequestURL;
    IsriskProfilePopup: boolean;
    dataFromChild: any;
    togglerData: any;
}

class RequestFormComponent extends React.Component<IRequestFormComponentProps, IRequestFormComponentState>{

    properties: IProperty[] = [];
    selectedProjectType: IProjectType = {};
    selectedCostType: string;
    projectTypes: Array<IProjectType> = [];
    allocatedProjects: IAllocatedProject[] = [];
    titleMaxLength: number = 75;
    coloUsers: Array<IApprover> = [];
    coloApprovers: Array<IApprover> = [];
    managementApprovers: Array<IApprover> = [];
    allApprovers: Array<IApprover> = [];
    allApproversWithoutSiteCode: Array<IApprover> = [];
    propertyUserRoles: Array<IPropertyUserRole> = [];
    projectCost: any;
    callToAction: string;
    areAllocationsUpdated: boolean = false;
    areApproversUpdated: boolean = false;
    isProjectAdded: boolean = true;
    modalProps: IModalProps = {
        isBlocking: true
    };
    updatedApprovers: Array<IApprover> = [];
    isNotificationShowing: boolean = false;
    unbudgetedBudgetYear: number = 0;
    defaultBudgetYear: number = 0;
    tempAllocatedProject: IAllocatedProject = { AvailableAllocation: 0 };
    startMonth: number = 0;
    startYear: number = 0;
    endMonth: number = 0;
    endYear: number = 0;
    currentUserEmail: string = "";
    currentUserTitle: string = "";
    defaultCurrency: ICurrency = DefaultCurrency;
    currencies: ICurrency[] = [];
    isEquipmentProject: boolean = false;
    isRiskProfileProject: boolean = false;
    isEnergyProject: boolean = false;
    isPrjManagementByOthers: boolean = false;
    exchangeRate: number = 1;
    isUnbudgeted: boolean = false;
    updateNotifiers: boolean = false;
    allnotifiers: IApprover[] = [];
    isCostType: boolean = false;
    RMBudget: IRMBudget = null;
    DirBudget: IRMBudget = null;
    EuropeInputters: IEuropeInputter[] = [];
    EuropeAllApprovers: IEuropeApprover[] = [];
    EnergyProjectApprovers: Array<IIUPApprover> = [];
    EuropeApprovers: IEuropeApprover[] = [];
    /* Dependent Services */
    private _Utility: IUtility;
    private _CapitalRequestService: ICapitalRequestService;
    private _AttachmentService: IAttachmentService;
    private _cacheService: ICacheService;
    /* End of Dependent Services */

    /* Sources */
    regionSelectOptions: ISelectOption[] = [];
    siteCodeSelectOptions: ISelectOption[] = [];
    siteAddressSelectOptions: ISelectOption[] = [];
    projectTypeOptions: ISelectOption[] = [];
    pCodeSelectOptions: ISelectOption[] = [];
    countrySelectOptions: ISelectOption[] = [];
    marketSelectOptions: ISelectOption[] = [];
    dcOpsOptions: ISelectOption[] = DcOpsRiskQuestionOptions;
    propOpsOptions: ISelectOption[] = PropOpsRiskQuestionOptions;
    yearConfig: string[] = [];
    yearSelectOptions: ISelectOption[] = [];
    energySavingsOptions: ISelectOption[] = EnergySavings;
    martketTypesOptions: ISelectOption[] = MarketTypes;
    priorityOptions: ISelectOption[] = PriorityTypes;
    returnLevelOptions: ISelectOption[] = [];
    Comments: string = "";
    requestingGroupOptions: ISelectOption[] = [];
    iupYears: IIUPYear[] = [];
    riskProfile: string = "";
    tempCapitalRequest: ICapitalRequest = {};
    isEuropeRequest: boolean = false;
    /* End Of Sources */

    constructor(props: IRequestFormComponentProps) {
        super(props);

        this._Utility = iocContainer.get<IUtility>(Symbol.for(ServiceSymbols.Utility));
        this._CapitalRequestService = iocContainer.get<ICapitalRequestService>(Symbol.for(ServiceSymbols.CapitalRequestService));
        this._AttachmentService = iocContainer.get<IAttachmentService>(Symbol.for(ServiceSymbols.AttachmentService));
        this._cacheService = iocContainer.get<ICacheService>(Symbol.for(ServiceSymbols.CacheService));

        this.currentUserEmail = document!.getElementById("IUPRoot")!.getAttribute("data-currentuseremail") as string;
        this.currentUserTitle = document!.getElementById("IUPRoot")!.getAttribute("data-currentuser") as string;
        this.tempAllocatedProject = this.setDefaultAllocation();
        this.state = {
            isValuesChanged: false,
            showLoader: true,
            activeTab: "Property Info",
            isEdit: false,
            isColoUser: false,
            isUserHasPermission: true,
            IsriskProfilePopup: false,
            canSubmit: false,
            updatedRequest: DefaultICapitalRequest,
            isError: false, showReturnPopup: false, showRMPopup: false, showDeferPopup: false, showDeletePopup: false, showMoveToPlanningPopup: false, isSaveError: false, isAdmin: false,
            isAttachmentsLoading: false,
            isEuropeAdmin: false,
            Sustainability: [] as any as ISustainability,
            showAttachmentsPopup: false,
            impactType: "",
            index: 0,
            fileUploadId: "",
            ImpactMapping: [],
            ImpactName: "",
            ImpactTitle: "",
            requestURL: { SPSite: '', FileUploader: '', SPRelSite: '' } as IRequestURL,
            dataFromChild: '',
            togglerData: false
        }

        this.sortApprovers = this.sortApprovers.bind(this);
        this.addNotifier = this.addNotifier.bind(this);
        this.removeNotifier = this.removeNotifier.bind(this);
        this.getSelectOptions = this.getSelectOptions.bind(this);
        this.onChangeRegion = this.onChangeRegion.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.moveProjectToPlanning = this.moveProjectToPlanning.bind(this);
        this.approveOrReturnProject = this.approveOrReturnProject.bind(this);
        this.formLink = this.formLink.bind(this);
        this.handleDataFromChild = this.handleDataFromChild.bind(this);
        this.handleDeleteProjects = this.handleDeleteProjects.bind(this);
    }

    componentWillMount() {
        this.loadMeta();
    }

    componentDidUpdate(prevProps: Readonly<IRequestFormComponentProps>, prevState: Readonly<IRequestFormComponentState>, snapshot?: any): void {
        console.log("this.state.togglerData", this.state.togglerData)
    }

    loadMeta() {
        this.setState({ showLoader: true });
        this._CapitalRequestService.getAttachmentURL().then((res: IRequestURL) => {
            if (!!res) {
                this.setState({ requestURL: res }, () => {
                    this.getIUPRequestResources();
                });
            }
        });
    }

    getIUPRequestResources() {
        this._CapitalRequestService.getCapitalRequestById(this.props.projectId).then((res: IRequestResource) => {
            if (res && !!res.UserPermissions) {
                this.projectTypes = res.ProjectTypes as IProjectType[];
                this.EuropeInputters = res.EuropeInputters as IEuropeInputter[];
                this.EuropeAllApprovers = res.EuropeApprovers as IEuropeApprover[];
                this.EnergyProjectApprovers = !!res.EnergyProjectApprovers ? res.EnergyProjectApprovers : [];
                if (res.Currencies && res.Currencies.length) {
                    let defaultCur = res.Currencies.find(_ => !!_.IsDefault);
                    this.defaultCurrency = defaultCur ? defaultCur : DefaultCurrency;
                    this.currencies = res.Currencies as ICurrency[];

                    this._cacheService.setItem({ key: CacheKeys.Currencies, value: JSON.stringify(res.Currencies) });
                    this._cacheService.setItem({ key: CacheKeys.DefaultCurrency, value: JSON.stringify(this.defaultCurrency) });
                }

                let tempRequest = res.CapitalRequest;
                this.isEuropeRequest = tempRequest.Region == Regions.Europe;
                if (tempRequest.Attachments && tempRequest.Attachments.length) {
                    tempRequest.Attachments = tempRequest.Attachments.map((file: IAttachment) => {
                        file.URL = this.formLink(file.Name, tempRequest.RequestID);
                        file.DecodedName = decodeURIComponent(file.Name);
                        file.IsUploaded = true;
                        file.IsActive = true;
                        return file;
                    });
                }

                if (tempRequest.Approvers && tempRequest.Approvers.length > 0 && tempRequest.RequestStatus == Status.ApprovalPending) {
                    this.RMBudget = res.RMBudget;
                }
                if (tempRequest.Approvers && tempRequest.Approvers.length > 0 && tempRequest.RequestStatus == Status.ApprovalPending) {
                    this.DirBudget = res.DirBudget;
                }

                this.setState({
                    isUserHasPermission: (res.UserPermissions.HavePermissions),
                    isAdmin: res.UserPermissions.IsIUPAdmin,
                    isColoUser: res.UserPermissions.IsColoUser && !res.UserPermissions.IsIUPAdmin,
                    isEuropeAdmin: res.UserPermissions.IsEuropeAdmin,
                    Sustainability: this._Utility.buildSustainability(res.IUPImpactTypes, res.IUPImpactAttachments, res.Impacts, this.props.projectId) as ISustainability,
                    ImpactMapping: res.IUPImpactTypes,
                }, () => {
                    if (res.UserPermissions && !!this.props.projectId) {
                        this.tempCapitalRequest = JSON.parse(JSON.stringify(tempRequest));
                        this.loadRequest(tempRequest);

                    } else {
                        this.allocatedProjects = [];
                        this.exchangeRate = 1;

                        let defaultReq = { ...this.state.updatedRequest };
                        defaultReq.LocalCurrency = this.defaultCurrency.Currency;
                        defaultReq.ProjectManagementCost = res.CapitalRequest.ProjectManagementCost;
                        this.setState({
                            ...this.state,
                            updatedRequest: defaultReq,
                            isEdit: true
                        });

                        this.getRequestResources();
                    }
                });
            }


            this.setState({ showLoader: false });
        }, (error: any) => {
            this.setState({
                showLoader: false,
                isEdit: false,
                updatedRequest: {}
            });
        });
    }

    populateAllDropdowns = () => {
        /* Prepare Utility dropdown Options */

        // Year
        this.yearSelectOptions = [];
        if (this.isUnbudgeted) {
            this.iupYears.forEach((y) => {
                if (y.IsActive && y.IsUnbudgetedYear) {
                    this.yearSelectOptions.push({ value: y.Year, label: y.Year });
                }
            });
        }
        else {
            this.iupYears.forEach((year) => {
                if (year.IsActive && year.IsActiveInNewRequest) {
                    this.yearSelectOptions.push({ value: year.Year, label: year.Year });
                }
            });
        }

        this.yearSelectOptions = this.yearSelectOptions ? this.yearSelectOptions : [];
        if (this.yearSelectOptions.filter(_ => _.value == this.startYear).length == 0 && !!this.startYear)
            this.yearSelectOptions.push({ label: this.startYear, value: this.startYear });
        if (this.yearSelectOptions.filter(_ => _.value == this.endYear).length == 0 && !!this.endYear)
            this.yearSelectOptions.push({ label: this.endYear, value: this.endYear });

        this.yearSelectOptions = this._Utility.sortArrayByProperty(this.yearSelectOptions, 'value', false, 'number');

        // Project Type
        this.projectTypeOptions = this.getSelectOptions(this.projectTypes, "ProjectType", "ProjectType");
        if (this.state.updatedRequest && !!this.state.updatedRequest.RequestingGroup && this.projectTypes)
            this.getProjectTypesByRequestingGroupSelected(this.state.updatedRequest.RequestingGroup);

        // Region
        this.requestingGroupOptions = this.getSelectOptions(this.projectTypes, "MappedToGroup", "MappedToGroup");
        this.regionSelectOptions = this.getSelectOptions(this.properties, "Region", "Region");
        this.sortArray(this.regionSelectOptions);

        this.pCodeSelectOptions = []
        this.pCodeSelectOptions = this.getSelectOptions(this.properties, "PCode", "PCode");
        this.sortArray(this.pCodeSelectOptions);

        this.countrySelectOptions = []
        this.countrySelectOptions = this.getSelectOptions(this.properties, "Country", "Country");
        this.sortArray(this.countrySelectOptions);

        this.marketSelectOptions = [];
        this.marketSelectOptions = this.getSelectOptions(this.properties, "Market", "Market");
        this.sortArray(this.marketSelectOptions);

        this.siteCodeSelectOptions = [];
        this.siteCodeSelectOptions = this.getSelectOptions(this.properties, "AirportCode", "AirportCode");
        this.sortArray(this.siteCodeSelectOptions);

        this.siteAddressSelectOptions = [];
        this.siteAddressSelectOptions = this.getSelectOptions(this.properties, "PropertyAddress", "PropertyAddress");
        this.sortArray(this.siteAddressSelectOptions);
    }

    sortArray(data: any) {
        if (data && data.length > 0) {
            data.sort((a, b) => (a.value.toLowerCase() > b.value.toLowerCase()) ? 1 : ((b.value.toLowerCase() > a.value.toLowerCase()) ? -1 : 0));
        }
        return data;
    }

    preFormLoad = (request: ICapitalRequest): ICapitalRequest => {
        try {
            let tempRequest = Object.assign(request, {});
            if (this.callToAction == CallToActions.Duplicate) {
                this.startMonth = 0;
                this.startYear = 0;
                this.endMonth = 0;
                this.endYear = 0;
                this.loadIUPSustainability(0);
                tempRequest.ProjectEstimateStartDate = ``;
                tempRequest.ProjectEstimateEndDate = ``;
            }
            else {
                if (!this._Utility.isEmptyObject(tempRequest.ProjectEstimateStartDate)) {
                    this.startMonth = Number(tempRequest.ProjectEstimateStartDate.split("-")[0]);
                    this.startYear = Number(tempRequest.ProjectEstimateStartDate.split("-")[1]);
                }
                if (!this._Utility.isEmptyObject(tempRequest.ProjectEstimateEndDate)) {
                    this.endMonth = Number(tempRequest.ProjectEstimateEndDate.split("-")[0]);
                    this.endYear = Number(tempRequest.ProjectEstimateEndDate.split("-")[1]);
                }
            }
            /* Populating Dependecnies */

            // Project Management Dependencies
            this.isPrjManagementByOthers = VendorManagement.includes(tempRequest.ProjectManagement);
            if (!this.isPrjManagementByOthers)
                tempRequest.ProjectManagementCost = 0;

            // Project Type Dependencies
            this.onProjectTypeChange(tempRequest.ProjectType);

            // Currency Dependecies
            tempRequest.LocalCurrency = this._Utility.isEmptyObject(tempRequest.LocalCurrency) ? this.defaultCurrency.Currency : tempRequest.LocalCurrency;
            this.exchangeRate = tempRequest.ExchangeRate;
            /* End of Populating Dependencies */
            /* End Of Files Retrieval */

            return tempRequest;
        }
        catch (err) {
            return request;
        }
    }

    public toggleAttachmentsPopup = () => {
        this.setState({
            showAttachmentsPopup: !this.state.showAttachmentsPopup
        });
    }

    public deleteAttachment = (index: number, fileId: number, impactType: string, file: IAttachment) => {
        let sustainability: ISustainability = { ...this.state.Sustainability };
        let existingFiles = !!sustainability[`${impactType}`][index].Attachments ? [...sustainability[`${impactType}`][index].Attachments] : [];
        let ind = existingFiles.findIndex(_ => _.Name == file.Name && _.DecodedName == file.DecodedName && file.ID == _.ID);
        if (ind > -1) {
            if (!!existingFiles[ind].ID)
                existingFiles[ind].IsActive = false;
            else
                existingFiles.splice(ind, 1);
        }
        sustainability[`${impactType}`][index].Attachments = existingFiles
        this.setState({ isValuesChanged: true, Sustainability: sustainability });
    }


    loadRequest = (data: ICapitalRequest) => {
        let tempRequest = data;
        tempRequest = this.preFormLoad(tempRequest);
        this.isEquipmentProject = tempRequest.IsEquipmentProject ? tempRequest.IsEquipmentProject : false;
        this.isRiskProfileProject = tempRequest.IsRiskProfileProject ? tempRequest.IsRiskProfileProject : false;
        this.isEnergyProject = tempRequest.RequestingGroup == "Energy Projects";
        this.allocatedProjects = tempRequest.AllocatedProjects ? tempRequest.AllocatedProjects : [];
        this.riskProfile = tempRequest.IsRiskProfileProject ? tempRequest.RiskProfile : "";

        if (tempRequest && tempRequest.Attachments && tempRequest.Attachments.length > 0) {
            tempRequest.Attachments.map((attachment) => {
                attachment.IsActive = true;
            });
        }

        this.areAllocationsUpdated = false;
        if (tempRequest.IsUnbudgeted) {
            this.projectCost = tempRequest.Budget;
            this.isUnbudgeted = tempRequest.IsUnbudgeted;
        }

        if (tempRequest.RequestStatus == Status.Planning) {
            let pCode = tempRequest.PCode && tempRequest.PCode.length > 0 ? tempRequest.PCode : "p";
            this._CapitalRequestService.getIUPFormViewResources(pCode).then((resources: IIUPFormViewResources) => {
                this.managementApprovers = resources.Approvers as IApprover[];
                let requestor: IPropertyUserRole = { Order: 0, Role: Requestor };
                this.propertyUserRoles = [...PropertyUserRoles];
                this.propertyUserRoles.push(requestor);
                this.propertyUserRoles = this.propertyUserRoles.sort((a, b) => a.Order - b.Order) as IPropertyUserRole[];
                let doesGLCodeExist = this.projectTypes.map(_ => _.GLCode).find(_ => _ == data.GLAccount);
                tempRequest.GLAccount = !!data.GLAccount ? data.GLAccount : undefined;
                if (!doesGLCodeExist) tempRequest.RequestingGroup = tempRequest.CostType = tempRequest.ProjectType = undefined;
                tempRequest.Approvers = this.updateApproversIfSLTUpdated(tempRequest.Approvers as IApprover[]);
                tempRequest.ProjectManagementCost = data.ProjectManagementCost;
                tempRequest = this.updateApprovers(tempRequest);
                this.iupYears = resources.Years;
                this.updatedApprovers = tempRequest.Approvers;
                this.isUnbudgeted = new Date().getFullYear() == Number(tempRequest.ProjectEstimateStartDate?.split("-")[1]);

                this.setState({
                    ...this.state,
                    canSubmit: this.iupYears.length > 0 ? this.iupYears.some(y => tempRequest.ProjectEstimateStartDate && y.Year == Number(tempRequest.ProjectEstimateStartDate.split("-")[1]) && ((!tempRequest.IsUnbudgeted && y.CanSubmit) || (tempRequest.IsUnbudgeted && y.CanSubmitUnbudget))) : false,
                    ...this.state.updatedRequest,
                    updatedRequest: tempRequest,
                    isEdit: false,
                    showLoader: false
                }, () => {
                    tempRequest.IsUnbudgeted = new Date().getFullYear() == Number(tempRequest.ProjectEstimateStartDate?.split("-")[1]);
                    this.setState({ updatedRequest: tempRequest }, () => {
                        tempRequest.IsUnbudgeted = new Date().getFullYear() == Number(tempRequest.ProjectEstimateStartDate?.split("-")[1]);
                        this.setState({ updatedRequest: tempRequest });
                    });
                });
            });
        }
        else {
            this.updatedApprovers = tempRequest.Approvers;
            tempRequest.IsUnbudgeted = !tempRequest.IsUnbudgeted;
            this.setState({
                ...this.state,
                ...this.state.updatedRequest,
                updatedRequest: tempRequest,
                isEdit: false,
                showLoader: false
            }, () => {
                tempRequest.IsUnbudgeted = !tempRequest.IsUnbudgeted;
                this.setState({ updatedRequest: tempRequest });
            });
        }

        if (!!tempRequest.CurrentLevel && tempRequest.CurrentLevel >= 1) {
            let approvers = tempRequest.Approvers.filter(approver => !!approver.Level && approver.Level < tempRequest.CurrentLevel);
            approvers = this.sortApproversWithRoles(approvers, "Level");
            this.returnLevelOptions = [{ label: `Planning`, value: 0 } as ISelectOption].concat(approvers.map(approver => ({ label: `${approver.Title} ${approver.Role ? `(${approver.Role})` : ''}`, value: approver.Level } as ISelectOption)));
        }
    }

    updateApproversIfSLTUpdated = (approvers: IApprover[]) => {
        let newApproverList = approvers?.filter(approver => approver.Role == 'SVP' || approver.Role === 'Requestor' || approver.Type === ApproverTypes[0]);

        approvers?.map(approver => {
            if (approver.Type == ApproverTypes[0])
                return;

            let sltApprover = this.managementApprovers?.find(a => a.Role === approver.Role)
            if (sltApprover) {
                if (sltApprover.Email?.toLowerCase() === approver.Email?.toLowerCase() && sltApprover.Title?.toLowerCase() === approver.Title?.toLowerCase()) {
                    newApproverList.push(approver)
                }
                else if (approver.IsAdditionalNotifier) {
                    newApproverList.push(sltApprover)
                    newApproverList.push(approver)
                }
                else if (!sltApprover.Type) {
                    newApproverList.push(sltApprover)
                    if (this.managementApprovers?.find(m => m.Email?.toLowerCase() === approver.Email?.toLowerCase() && m.Title?.toLowerCase() === approver.Title?.toLowerCase()))
                        newApproverList.push(approver)
                }
                else {
                    newApproverList.push(sltApprover)
                }
            } else if (approver.IsAdditionalNotifier) {
                newApproverList.push(approver)
            }

        })

        this.managementApprovers?.map(approver => {
            const isApproverNewlyAdded = !approver.Type;
            const isNotExistInNewList = !newApproverList?.find(na => na.Email === approver.Email && na.Title === approver.Title && na.Role === approver.Role);
            if ((isApproverNewlyAdded || ApproverTypes?.find(type => approver.Type === type)) && isNotExistInNewList) {
                newApproverList.push(approver)
            }
        })

        return newApproverList;
    }


    removeColorCodes(employees: IApprover[]) {
        return employees.map(employee => {
            employee.ColorCodeClass = "";
            return employee;
        });
    }

    setDefaultAllocation = (): IAllocatedProject => {
        return {
            ProjectId: 0,
            Currency: "USD",
            ExchangeRate: 1,
            MaxAmount: 0,
            Offset: 0,
            PCode: "",
            SiteCode: ""
        } as IAllocatedProject;
    }

    checkifStatusIsInProgress(reqStatus: string) {
        return reqStatus == Status.ApprovalPending;
    }

    canDisableField(reqStatus: string) {
        return reqStatus == Status.ApprovalPending || reqStatus == Status.Deferred || reqStatus == Status.RMProject;
    }

    loadIUPFiles(id: number) {
        this.setState({ isAttachmentsLoading: true });
        this._AttachmentService.getIUPFilesById(id).then((res: Array<IAttachment>) => {
            if (!!res) {
                let updatedRequest = { ...this.state.updatedRequest };
                let selectedFiles: Array<IAttachment> = res && res.length ? res : [];
                selectedFiles.map(async (file: IAttachment) => {
                    file.URL = this.formLink(file.Name, this.state.updatedRequest.RequestID);
                    file.DecodedName = decodeURIComponent(file.Name);
                    file.IsUploaded = true;
                    file.IsActive = true;
                });
                updatedRequest.Attachments = selectedFiles;

                this.setState({ isAttachmentsLoading: false, updatedRequest: updatedRequest });
            }
        }, (error) => {
            this.setState({ isAttachmentsLoading: false });
        });
    }

    loadIUPSustainability(id: number) {
        this.setState({ isAttachmentsLoading: true });
        this._CapitalRequestService.getSustainabilityDataByProjectID(id).then((res: ISustainabilityResource) => {
            this.setState({
                Sustainability: this._Utility.buildSustainability(res.IUPImpactTypes, res.IUPImpactAttachments, res.Impacts, this.props.projectId) as ISustainability,
                isAttachmentsLoading: false
            })
        })
    }

    getNextLevelApprover = (approvers: IApprover[], currentLevel: number, totalLevels: number) => {
        approvers.sort((a, b) => a.Level - b.Level);

        if (totalLevels == approvers.length) {
            return approvers.filter(a => a.Level == (currentLevel + 1)).length > 0 ? approvers.filter(a => a.Level == (currentLevel + 1))[0] : null;
        }
        else {
            var nextApprover: IApprover = null;
            var newLevel = currentLevel;
            do {
                newLevel++;
                nextApprover = approvers.filter(a => a.Level == newLevel).length > 0 ? approvers.filter(a => a.Level == newLevel)[0] : null;
            } while (nextApprover == null && (newLevel < totalLevels));
            return nextApprover;
        }
    }

    onCTA = (action: string) => {
        let submitPromise;
        let validatePromise;
        let isError = false;
        this.callToAction = action;
        if (action == CallToActions.Edit) {
            let tempRequest = this.preFormLoad(this.state.updatedRequest);
            this.isEquipmentProject = tempRequest.IsEquipmentProject ? tempRequest.IsEquipmentProject : false;
            this.isRiskProfileProject = tempRequest.IsRiskProfileProject ? tempRequest.IsRiskProfileProject : false;
            this.isEnergyProject = tempRequest.RequestingGroup == "Energy Projects";
            this.isUnbudgeted = new Date().getFullYear() == Number(tempRequest.ProjectEstimateStartDate?.split("-")[1]);
            this.riskProfile = tempRequest.IsRiskProfileProject ? tempRequest.RiskProfile : "";
            tempRequest.Approvers = this.removeColorCodes(tempRequest.Approvers);
            tempRequest.ProjectManagementCost = tempRequest.ProjectManagementCost;
            this.setState({
                ...this.state, updatedRequest: tempRequest,
                isEdit: true,
                showLoader: true
            }, () => {
                this.getRequestResources();
            });
        }
        else if (action == CallToActions.Duplicate) {
            let tempRequest = { ...this.state.updatedRequest };
            tempRequest.ProjectDescription = "";
            tempRequest.ProjectJustification = "";
            tempRequest.Attachments = [];
            tempRequest.RequestID = 0;
            tempRequest.CurrentApproverRole = "";
            tempRequest.IsPreApproved = false;
            tempRequest.RequestStatus = Status.Planning;
            tempRequest.CurrentLevel = 0;
            tempRequest.IsUnbudgeted = false;
            tempRequest.Approvers = this.removeColorCodes(tempRequest.Approvers);
            tempRequest.AllocatedProjects = [];
            this.selectedProjectType = this.projectTypes && this.projectTypes.length > 0 ? (!this.projectTypes.filter(it => it.ProjectType && tempRequest.ProjectType && it.ProjectType.toLowerCase() == tempRequest.ProjectType.toLowerCase())[0]) ? { ProjectType: tempRequest.ProjectType, CostType: tempRequest.CostType, MappedToGroup: tempRequest.RequestingGroup } as IProjectType : {} : {};
            tempRequest.RequestingGroup = this.selectedProjectType == undefined ? undefined : this.selectedProjectType.MappedToGroup;
            this.isUnbudgeted = false;
            this.isEquipmentProject = tempRequest.IsEquipmentProject ? tempRequest.IsEquipmentProject : false;
            this.isRiskProfileProject = tempRequest.IsRiskProfileProject ? tempRequest.IsRiskProfileProject : false;
            this.isEnergyProject = tempRequest.RequestingGroup == "Energy Projects";
            this.riskProfile = tempRequest.IsRiskProfileProject ? tempRequest.RiskProfile : "";
            this.getRequestResources();
            tempRequest = this.preFormLoad(tempRequest);
            tempRequest.PUE = (tempRequest.PUE && !tempRequest.NOI);
            tempRequest.NOI = (!tempRequest.PUE && tempRequest.NOI) || (tempRequest.PUE && tempRequest.NOI);
            this.props.history.push("/request/new");
            this.onChangeTab("Property Info");
            this.allocatedProjects = [];
            this.areAllocationsUpdated = tempRequest.IsUnbudgeted && tempRequest.AllocatedProjects.length > 0;
            this.areApproversUpdated = true;
            this.setState({
                ...this.state, updatedRequest: tempRequest,
                isEdit: true,
                showLoader: true
            });
        }
        else if (action == CallToActions.Cancel) {
            this.setState({ showLoader: true });
            let duplicatetempCapitalRequest = { ...this.tempCapitalRequest, RequestID: this.props.projectId } as ICapitalRequest
            this.loadRequest(JSON.parse(JSON.stringify(duplicatetempCapitalRequest)));
            this.loadIUPSustainability(this.props.projectId);
            this.setState({ isEdit: false, showLoader: false });
            this.tempAllocatedProject = this.setDefaultAllocation();
        }
        else if (action == CallToActions.Submit || action == CallToActions.Save) {
          
                let promise = Promise.resolve();
                console.log("promise", promise);
                if (action == CallToActions.Submit) {
                    promise = this.getAllocatableProjectsForSubmit().then(() => {
                        console.log("getAllocatableProjectsForSubmit data_+2");
                        isError = this.validateProject(action, this.state.togglerData);
                        if (isError) {
                            this.setState({
                            isError: true,
                            isSaveError: false,
                            isApproversError: !this.hasValidApprovers(action),
                            });
                            return;
                    }
                    // handle successful submit here
                    });
                }
                else if (action == CallToActions.Save) {
                isError = this.validateProject(action);
                    if (isError) {
                        this.setState({
                        isSaveError: true,
                        isError: this.state.updatedRequest.RequestStatus == Status.Planning ? true : isError 
                    });
                        return;
                    }
                }
                promise.then(() => {
                    // handle successful completion of the async operation here
                    console.log("handled successful completion of the async operation here")
                }).catch((error) => {
                console.error("Error occurred while fetching data:", error);
                });
            

            this.setState({ showLoader: true })
            let updatedRequest = { ...this.state.updatedRequest };
            updatedRequest.IsActive = true;
            updatedRequest.ExchangeRate = this.exchangeRate;
            updatedRequest.IsEquipmentProject = this.isEquipmentProject;
            updatedRequest.IsRiskProfileProject = this.isRiskProfileProject;
            updatedRequest.RiskProfile = this.isRiskProfileProject ? this.riskProfile : RiskProfile.NotApplicable;
            updatedRequest.RiskProfile1 = this.isRiskProfileProject ? updatedRequest.RiskProfile1 : null;
            updatedRequest.RiskProfile2 = this.isRiskProfileProject ? updatedRequest.RiskProfile2 : null;
            updatedRequest.ReturnOnInvestment = !!updatedRequest.ReturnOnInvestment ? updatedRequest.ReturnOnInvestment : 0;
            updatedRequest.PaybackPeriod = !!updatedRequest.PaybackPeriod ? updatedRequest.PaybackPeriod : 0;
            updatedRequest.AnnualizedEnergyCostSavings = !!updatedRequest.AnnualizedEnergyCostSavings ? updatedRequest.AnnualizedEnergyCostSavings : 0;
            if (updatedRequest.Region == Regions.Europe) {
                updatedRequest.RequestingGroup = undefined;
            }

            if (updatedRequest.IsUnbudgeted) {
                updatedRequest.Budget = this.projectCost;
                updatedRequest.ProjectEstimateUSD = Math.round((this.projectCost ? this.projectCost : 0) * this.exchangeRate);
                updatedRequest.AllocatedProjects = this.allocatedProjects;
                updatedRequest.IncrementalFunding = this.projectCost ? this.getIncrementalFunding() : 0;
            } else {
                updatedRequest.AllocatedProjects = [];
                updatedRequest.FundingSource = "";
                updatedRequest.IncrementalFunding = 0;
                this.projectCost = 0;
                this.allocatedProjects = [];
            }

            if ((updatedRequest.RequestID == 0 || updatedRequest.RequestStatus == Status.Planning) && (action == CallToActions.Save)) {
                updatedRequest.Approvers = updatedRequest.Approvers.filter(n => n.Type == ApproverTypes[1]);
            }
            else if ((updatedRequest.RequestStatus != undefined && this.checkifStatusIsInProgress(updatedRequest.RequestStatus) && updatedRequest.areApproversUpdated) || (action == CallToActions.Save && (updatedRequest.RequestStatus == Status.Planning)))
                updatedRequest.Approvers = this.updatedApprovers;

            if (updatedRequest.Approvers && updatedRequest.Approvers.length == 0)
                this.areApproversUpdated = false;
            else {
                updatedRequest.Approvers = updatedRequest.Approvers.map(approve => {
                    if (approve && approve.Type == ApproverTypes[1])
                        approve.Level = 0;
                    approve.IsActive = true;
                    return approve;
                });
                this.areApproversUpdated = true;
            }
            if (updatedRequest.RequestID == 0) {
                updatedRequest.CreatedBy = this.currentUserEmail;
                updatedRequest.RequestorName = this.currentUserTitle;
            }
            if (action == CallToActions.Save && (updatedRequest.RequestStatus == Status.Planning || updatedRequest.RequestID == 0)) {
                updatedRequest.RequestStatus = Status.Planning;
            }
            updatedRequest.ModifiedBy = this.currentUserEmail;
            let formData = new FormData();
            updatedRequest.Impacts = !!this.state.Sustainability && !!this.state.Sustainability.EnvironmentalImpact && !!this.state.Sustainability.OperationalImpact && Object.values(this.state.Sustainability).flatMap(impact => impact);
            formData.append("IUPRequest", JSON.stringify(updatedRequest));
            formData.append("Action", action == CallToActions.Submit ? IUPActions.Submit.toString() : IUPActions.Save.toString());
            formData.append("AreAllocationsUpdated", JSON.stringify(this.areAllocationsUpdated));
            formData.append("AreApproverUpdated", JSON.stringify(this.areApproversUpdated));
            this._CapitalRequestService.processRequest(formData).then((data: IOperationStatus) => {
                if (data.IsSuccess && !!data.Id) {
                    this.loadIUPFiles(data.Id);
                    this.tempCapitalRequest = JSON.parse(JSON.stringify(updatedRequest));
                    this.loadIUPSustainability(data.Id);
                }
                let hasAllApproverApproved = updatedRequest.Approvers.filter(a => a.Type === ApproverTypes[0] && a.IsApproved).length === updatedRequest.TotalLevels;
                if ((data.IsSuccess && data.ActionPerformed == CallToActions.Approve) && ((hasAllApproverApproved && updatedRequest.CurrentLevel === updatedRequest.TotalLevels) || (updatedRequest.IsUnbudgeted))) {
                    NotificationManager.success(data.Message, '', 5000);
                    this.props.history.push({ pathname: '/', state: { filters: this.props.filters } });
                    return;
                }

                if (data.IsSuccess && data.ActionPerformed == CallToActions.PreApprove) {
                    NotificationManager.success(`Request #${updatedRequest.RequestID} ${action == CallToActions.Save ? 'Saved' : 'Pre - Approved'} has been Successfully.`, '', 5000);
                    this.props.history.push({ pathname: '/', state: { filters: this.props.filters } });
                    return;
                }

                if (data.IsSuccess) {
                    if (action == CallToActions.Save) {
                        NotificationManager.success(data.Message, '', 5000);
                        updatedRequest.RequestStatus = ((action == CallToActions.Save && updatedRequest.RequestStatus == Status.Planning)) ? Status.Planning : (!this.checkifStatusIsInProgress(updatedRequest.RequestStatus) && updatedRequest.RequestStatus != Status.Deferred ? Status.Planning : updatedRequest.RequestStatus);
                        if (updatedRequest.RequestID == 0) {
                            updatedRequest.RequestID = data.Id;
                            this.props.history.push("/request/" + data.Id);
                        }
                        if ((updatedRequest.RequestID == 0 || updatedRequest.RequestStatus == Status.Planning) && (action == CallToActions.Save || action == CallToActions.Planning))
                            updatedRequest.Approvers = [...this.state.updatedRequest.Approvers];

                        this.onChangeTab("Property Info");
                        if (!updatedRequest.IsUnbudgeted && updatedRequest.areApproversUpdated && this.checkifStatusIsInProgress(updatedRequest.RequestStatus)) {
                            this.props.history.push({ pathname: '/', state: { filters: this.props.filters } });
                            return;
                        }
                        if (updatedRequest && updatedRequest.Attachments && updatedRequest.Attachments.length > 0) {
                            updatedRequest.Attachments = updatedRequest.Attachments.filter(a => a.IsActive);
                            if (updatedRequest.Attachments && updatedRequest.Attachments.length) {
                                updatedRequest.Attachments.map(async (file: IAttachment) => {
                                    file.URL = await this.formLink(file.Name, updatedRequest.RequestID);
                                    file.DecodedName = decodeURIComponent(file.Name);
                                    file.IsUploaded = true;
                                    file.IsActive = true;
                                });
                            }
                        }

                        let sustainability = { ...this.state.Sustainability };
                        sustainability.EnvironmentalImpact.map((impact: IImpact) => { if (!impact.Applicable) { impact.Amount = 0; impact.Attachments = []; impact.SelectedUnit = ''; } });
                        sustainability.OperationalImpact.map((impact: IImpact) => { if (!impact.Applicable) { impact.Amount = 0; impact.Attachments = []; impact.SelectedUnit = ''; } });
                        this.setState({
                            ...this.state,
                            updatedRequest: updatedRequest,
                            canSubmit: this.iupYears.length > 0 ? this.iupYears.some(y => updatedRequest.ProjectEstimateStartDate && y.Year == Number(updatedRequest.ProjectEstimateStartDate.split("-")[1]) && ((!updatedRequest.IsUnbudgeted && y.CanSubmit) || (updatedRequest.IsUnbudgeted && y.CanSubmitUnbudget))) : false,
                            isEdit: false,
                            showLoader: false,
                            isValuesChanged: false, isError: false,
                            Sustainability: sustainability
                        });
                    }
                    else {
                        NotificationManager.success(data.Message, '', 5000);
                        if (action == CallToActions.Submit
                            && !!this.currentUserEmail
                            && updatedRequest.Approvers && !!updatedRequest.Approvers.length!! && updatedRequest.Approvers[0].Email
                            && this.currentUserEmail.toLowerCase() == updatedRequest.Approvers[0].Email.toLowerCase()
                            && (((updatedRequest.RequestingGroup == RequestingGroupList.DCOps || updatedRequest.RequestingGroup == RequestingGroupList.PropOps) && (updatedRequest.Approvers[0].Role == EmployeeRoles.DCM || updatedRequest.Approvers[0].Role == EmployeeRoles.REM))
                                || (updatedRequest.RequestingGroup == RequestingGroupList.EnergyProjects && (updatedRequest.Region == Regions.East || updatedRequest.Region == Regions.West || updatedRequest.Region == Regions.Central || updatedRequest.Region == Regions.Canada) && updatedRequest.Approvers[0].Role == EmployeeRoles.DCM))) {
                            updatedRequest.CurrentLevel = 1;
                            updatedRequest.TotalLevels = updatedRequest.Approvers.filter(_ => _.Type == ApproverTypes[0]).length;
                            updatedRequest.Approvers[0].IsApproved = true;
                            this.setState({ updatedRequest: updatedRequest }, () => {
                                setTimeout(() => {
                                    this.approveOrReturnProject(IUPActions.Approve.toString(), true);
                                }, 0);
                            });
                            return;
                        } else
                            this.props.history.push({ pathname: '/', state: { filters: this.props.filters } });
                    }
                }
                else {
                    NotificationManager.error(data.Message, '', 5000);
                    this.setState({ showLoader: false });
                }
            }, (error) => {
                this.setState({ showLoader: false });
            });
        }
        else if (action == CallToActions.Approve) {
            let approver = this.state.updatedRequest.Approvers.find(a => a.Level == this.state.updatedRequest.CurrentLevel) as IApprover;
            if (!approver) {
                approver = this.getNextLevelApprover(this.state.updatedRequest.Approvers.filter(a => a.Level != 0), this.state.updatedRequest.CurrentLevel, this.state.updatedRequest.TotalLevels) as IApprover;
            }

            if (this.state.updatedRequest.RequestStatus == Status.ApprovalPending && !this.state.updatedRequest.IsUnbudgeted) {
                if (!!this.RMBudget && this.state.updatedRequest && (approver.Role == EmployeeRoles.RMPropOps || approver.Role == EmployeeRoles.RMDCOps) && (this.RMBudget.ApprovedBudget + this.state.updatedRequest.ProjectEstimateUSD) > this.RMBudget.AllocatedBudget) {
                    NotificationManager.error(`Please check the budget once again. Only ${this.RMBudget.AllocatedBudget - this.RMBudget.ApprovedBudget} dollars left in the allocated budget`, '', 5000);
                    return;
                }
                if (!!this.DirBudget && this.state.updatedRequest && (approver.Role == EmployeeRoles.DirectorPropOps || approver.Role == EmployeeRoles.DirectorDCOps) && (this.DirBudget.ApprovedBudget + this.state.updatedRequest.ProjectEstimateUSD) > this.DirBudget.AllocatedBudget) {
                    NotificationManager.error(`Please check the budget once again. Only ${this.DirBudget.AllocatedBudget - this.DirBudget.ApprovedBudget} dollars left in the allocated budget`, '', 5000);
                    return;
                }
            }

            if (this.state.updatedRequest.ProjectType == ProjectTypes.Sustainability && !this.isSustainabilityValid()) {
                isError = true;
                return;
            }

            isError = this.validateProject(action);
            if (isError) {
                this.setState({ isError: true });
                return;
            }
            this.approveOrReturnProject(IUPActions.Approve.toString());
        }
        else if (action == CallToActions.Budget) {
            isError = this.validateProject(action);
            if (isError) {
                this.setState({ isError: true });
                return;
            }
            this.approveOrReturnProject(IUPActions.Budget.toString());
        }
        else if (action == CallToActions.Return) {
            this.toggleShowReturnPopup();
        }
        else if (action == CallToActions.Delete) {
            this.toggleShowDeletePopup();
        }
        else if (action == CallToActions.Defer || action == CallToActions.ConvertRM) {
            isError = this.validateProject(action);
            if (isError) {
                this.setState({ isError: true });
                return;
            }
            if (action == CallToActions.Defer) {
                this.toggleShowDeferPopup();
            } else {
                this.toggleShowRMPopup();
            }
        }
        else if (action == CallToActions.MoveToPlanning) {
            this.toggleShowMovetoPlanningPopup();
        }
    }

    toggleShowRMPopup = () => {
        this.setState({ showRMPopup: !this.state.showRMPopup });
    }

    toggleShowDeferPopup = () => {
        this.setState({ showDeferPopup: !this.state.showDeferPopup });
    }

    deleteProject() {
        this.setState({ showLoader: true, showDeletePopup: false })
        let updatedRequest = { ...this.state.updatedRequest };
        let capitalRequests: ICapitalRequest[] = [];
        capitalRequests.push(updatedRequest);
        let formData = new FormData();
        formData.append("requests", JSON.stringify(capitalRequests));
        this._CapitalRequestService.deleteCapitalRequest(formData).then((data: IOperationStatus[]) => {
            if (data[0].IsSuccess) {
                NotificationManager.success("Capital Request #" + updatedRequest.RequestID.toString() + " has been deleted successfully", '', 5000);
                this.props.history.push({ pathname: '/', state: { filters: this.props.filters } });
            }
            else {
                NotificationManager.error(data[0].Message, '', 5000);
                this.setState({ showLoader: false });
            }
        }, (error) => {
            NotificationManager.error(error, '', 5000);
            this.setState({ showLoader: false });
        });
    }

    moveProjectToPlanning() {
        this.setState({ showLoader: true, showMoveToPlanningPopup: false });

        var requests: Array<number> = [];
        requests.push(this.state.updatedRequest.RequestID);

        this._CapitalRequestService.moveToPlanning(requests).then((res: any) => {
            if (res) {
                NotificationManager.success("Capital Request #" + this.state.updatedRequest.RequestID.toString() + " has been moved to Planning successfully", '', 5000);
                this.props.history.push({ pathname: '/', state: { filters: this.props.filters } });
            }
            else {
                this.setState({ showLoader: false });
            }
        }, (error) => {
            NotificationManager.error(error, '', 5000);
            this.setState({ showLoader: false });
        });
    }

    public RMorDeferProject(actionType: string) {
        this.approveOrReturnProject(actionType);
    }

    approveOrReturnProject(action: string, isSubmit?: boolean) {
        this.setState({ showLoader: true, showReturnPopup: false })
        let formData = new FormData();
        let updatedRequest = { ...this.state.updatedRequest };
        formData.append("requestfiles", JSON.stringify(updatedRequest.Attachments));
        updatedRequest.ExchangeRate = this.exchangeRate;
        updatedRequest.Comments = this.Comments ? this.Comments : (this.state.updatedRequest.Comments != null && this.state.updatedRequest.Comments != undefined ? this.state.updatedRequest.Comments : "");
        updatedRequest.IsEquipmentProject = this.isEquipmentProject;
        updatedRequest.IsRiskProfileProject = this.isRiskProfileProject;
        updatedRequest.RiskProfile = this.riskProfile;
        if (updatedRequest.IsUnbudgeted) {
            updatedRequest.Budget = this.projectCost;
            updatedRequest.ProjectEstimateUSD = Math.round((this.projectCost ? this.projectCost : 0) * this.exchangeRate);
            updatedRequest.AllocatedProjects = this.allocatedProjects;
            updatedRequest.IncrementalFunding = this.projectCost ? this.getIncrementalFunding() : 0;
        }
        formData.append("IUPRequest", JSON.stringify(updatedRequest));
        formData.append("Action", action.toString());
        formData.append("AreAllocationsUpdated", JSON.stringify(this.areAllocationsUpdated));
        formData.append("AreApproverUpdated", JSON.stringify(this.areApproversUpdated));
        this._CapitalRequestService.processRequest(formData).then((data: IOperationStatus) => {
            if (data.IsSuccess) {
                this.loadIUPFiles(data.Id);

                if (!isSubmit)
                    NotificationManager.success(data.Message, '', 5000);

                this.props.history.push({ pathname: '/', state: { filters: this.props.filters } });
            }
            else {
                if (!isSubmit)
                    NotificationManager.error(data.Message, '', 5000);

                this.setState({ showLoader: false });
            }
        }, (error) => {
            NotificationManager.error(error, '', 5000);
            this.setState({ showLoader: false });
        });
    }

    validateProject(action: string, data?: any): boolean {
        console.log("validateProject reached latest data", data);
        let isError = false;
        let projectType = this.projectTypes && this.projectTypes.length > 0 ? this.projectTypes.filter(it => it.ProjectType && this.state.updatedRequest.ProjectType && it.ProjectType.toLowerCase() == this.state.updatedRequest.ProjectType.toLowerCase())[0] : {};
        if (action != CallToActions.Save || this.checkifStatusIsInProgress(this.state.updatedRequest.RequestStatus)) {
            if (!this.validateUpdateRequest(action)) {
                this.onChangeTab("Property Info");
                isError = true;
            }
            else if (!this.validateAllocatedProjects()) {
                this.onChangeTab("Property Info");
                isError = true;
            }
            else if (this.state.updatedRequest.IsUnbudgeted && !!this.allocatedProjects && this.allocatedProjects.filter(_ => _.Country != this.state.updatedRequest.Country).length > 0) {
                this._Utility.showNotification("All budget impact projects must be from the same country", NotificationType.Failure);
                isError = true;
            }
            else if (this.state.updatedRequest.IsUnbudgeted && !!this.allocatedProjects && this.allocatedProjects.filter(_ => _.BudgetYear != this.state.updatedRequest.BudgetYear).length > 0) {
                this._Utility.showNotification("All budget impact projects must be from the same budget year", NotificationType.Failure);
                isError = true;
            }
            else if (this.state.updatedRequest.IsUnbudgeted && this.state.updatedRequest.FundingSource == FundingSourceList.SelfFundedProperty && this.allocatedProjects && this.allocatedProjects.filter(_ => (_.PCode != this.state.updatedRequest.PCode || _.SiteCode != this.state.updatedRequest.AirportCode)).length > 0) {
                this._Utility.showNotification("All budget impact projects must be from the same property", NotificationType.Failure);
                isError = true;
            }
            else if (!this.validateProjectEstimateDates()) {
                this.onChangeTab("Property Info");
                isError = true;
            }
            else if ((action == CallToActions.Submit && !(!!this.state.updatedRequest && !!this.state.updatedRequest.Attachments && this.state.updatedRequest.Attachments.length > 0 && this.state.updatedRequest.Attachments.filter(file => !!file.IsProposal && !!file.IsActive).length > 0))
                || (action == CallToActions.Save && !(!!this.state.updatedRequest && this.checkifStatusIsInProgress(this.state.updatedRequest.RequestStatus) && !!this.state.updatedRequest.Attachments && this.state.updatedRequest.Attachments.length > 0 && this.state.updatedRequest.Attachments.filter(file => !!file.IsProposal && !!file.IsActive).length > 0))) {
                this._Utility.showNotification("Proposal document is required for submission", NotificationType.Failure);
                this.onChangeTab("Property Info");
                isError = true;
            }
            else if ((action == CallToActions.Submit || action == CallToActions.Planning || (action == CallToActions.Save && this.state.updatedRequest.RequestStatus == Status.Planning)) && projectType == undefined) {
                this._Utility.showNotification("Please select active project type", NotificationType.Failure);
                this.onChangeTab("Property Info");
                isError = true;
            }
            else if (this.state.updatedRequest.IsUnbudgeted && (this.state.updatedRequest.FundingSource == FundingSourceList.SelfFundedDirector || this.state.updatedRequest.FundingSource == FundingSourceList.SelfFundedProperty) && !!Number(this.getIncrementalFunding().toFixed())) {
                this._Utility.showNotification("Budget Impact must equal $0.00.", NotificationType.Failure);
                isError = true;
            }
            else if (this.state.updatedRequest.IsUnbudgeted && (this.state.updatedRequest.FundingSource == FundingSourceList.RepurposeBudget || this.state.updatedRequest.UnbudgetedFunding == FundingList.Unbudgeted) && !Number(this.getIncrementalFunding().toFixed())) {
                this._Utility.showNotification("Budget Impact = $0.00, Select a different funding strategy.", NotificationType.Failure);
                isError = true;
            }
            else if (action != CallToActions.Planning && this.state.updatedRequest.Region != Regions.Europe && !this.hasValidApprovers(action)) {
                this.onChangeTab("Approvers");
                isError = true;
            }
            else if (((action == CallToActions.Save && this.checkifStatusIsInProgress(this.state.updatedRequest.RequestStatus)) || action == CallToActions.Submit) && this.state.updatedRequest.ProjectType == ProjectTypes.Sustainability) {
                isError = !this.isSustainabilityValid();
            }
            else if(data === true) {
                console.log("project already used. data true");
                this._Utility.showNotification("Project already exists. Please select different project", NotificationType.Failure);
                isError = true;
            }
        }
        else if (action == CallToActions.Save) {
            if (!(this.state.updatedRequest.ProjectTitle && this.state.updatedRequest.ProjectTitle.length > 0 && this.state.updatedRequest.ProjectTitle.length <= 75)) {
                this._Utility.showNotification("Please enter Project Title", NotificationType.Failure);
                isError = true;
            }
            else if (!this.validateAllocatedProjects()) {
                isError = true;
            }
            else if (!this.validateProjectEstimateDates()) {
                this._Utility.showNotification('Estimate End Date should be greater than or equals to Estimate Start Date', NotificationType.Failure);
                isError = true;
            }
        }
        return isError;
    }

    handleDataFromChild(data) {
        this.setState({ dataFromChild: data });
    }

    getAllocatableProjectsForSubmit = async () => {
        console.log("reached getAllocatableProjectsForSubmit after submit");
        this.setState({ showLoader: true })
        try {
          const data = await this._CapitalRequestService.getAllocatableProjects();
          if (data && data.length > 0) {
            let findProject = data.find(project => project.ProjectId === this.state?.dataFromChild?.ProjectId);
            console.log("findProject", findProject)
            if (findProject === undefined) {
              this.setState({
                togglerData: true
              });
            } else {
              this.setState({
                togglerData: false
              });
            }
          }
        } catch (error) {
          console.error("Error occurred while fetching data:", error);
        } finally {
          this.setState({ showLoader: false });
        }
    }

    handleDeleteProjects = async (id) => {
        try {
          const data = await this._CapitalRequestService.getAllocatableProjects();
          data;
          if (data && data.length > 0) {
            let findProject = data.find(project => project.ProjectId === id);
            if (findProject === undefined) {
              this.setState({
                togglerData: false
              });
            }
          }
        } catch (error) {
          console.error("Error occurred while fetching data:", error);
        } finally {
        }
    }

    isSustainabilityValid() {
        let isValid = true;
        if (!this.validateAtleastOneEnvironmentalImpactIsFilled()) {
            this._Utility.showNotification('Please fill atleast one parameter in environmental impact', NotificationType.Failure);
            isValid = false;
        } else if (!this.validateSustainabilityAmountExists()) {
            this._Utility.showNotification(`Sustainability amount and atleast one attachment's is required for submission`, NotificationType.Failure);
            isValid = false;
        }

        return isValid;
    }

    hasValidApprovers(action): boolean {
        let isValid: boolean = true;
        if (!(action == CallToActions.Save && this.state.updatedRequest.RequestStatus == Status.Planning)) {
            let tempUpdRequest = { ...this.state.updatedRequest };
            let approvers = tempUpdRequest.RequestID == 0 || tempUpdRequest.RequestStatus == Status.Planning
                ? [...tempUpdRequest.Approvers]
                : this.updatedApprovers;

            let requiredRoles: string[] = [];
            if (tempUpdRequest.IsUnbudgeted && !!this.state.updatedRequest.UnbudgetedFunding && (this.state.updatedRequest.UnbudgetedFunding == FundingList.Unbudgeted ? true : !!this.state.updatedRequest.FundingSource) && !!tempUpdRequest.RequestingGroup) {
                let rolesByRequest: Array<string> = [];
                let secondLevelDefault: Array<IRoleLevel> = [];
                let thirdLevelDefault: Array<IRoleLevel> = [];
                if (this.state.updatedRequest.FundingSource == FundingSourceList.SelfFundedProperty) {
                    if (tempUpdRequest.RequestingGroup == RequestingGroupList.PropOps) {
                        rolesByRequest = PropOpsSelfFundedPropertyRoles;

                        secondLevelDefault = SecondLevelPropOpsSelfFundedProperty;
                        thirdLevelDefault = ThirdLevelPropOpsSelfFundedProperty;
                    } else if (tempUpdRequest.RequestingGroup == RequestingGroupList.DCOps || tempUpdRequest.RequestingGroup == RequestingGroupList.EnergyProjects) {
                        rolesByRequest = DCOpsSelfFundedPropertyRoles;

                        secondLevelDefault = SecondLevelDCOpsSelfFundedProperty;
                        thirdLevelDefault = ThirdLevelDcOpsSelfFundedProperty;
                    }
                }
                else if (this.state.updatedRequest.FundingSource == FundingSourceList.SelfFundedDirector) {
                    if (tempUpdRequest.RequestingGroup == RequestingGroupList.PropOps) {
                        rolesByRequest = PropOpsSelfFundedDirectorRoles;

                        secondLevelDefault = SecondLevelPropOpsSelfFundedDirector;
                    } else if (tempUpdRequest.RequestingGroup == RequestingGroupList.DCOps || tempUpdRequest.RequestingGroup == RequestingGroupList.EnergyProjects) {
                        rolesByRequest = DCOpsSelfFundedDirectorRoles;

                        secondLevelDefault = SecondLevelDCOpsSelfFundedDirector;
                    }
                }
                else if (this.state.updatedRequest.FundingSource == FundingSourceList.RepurposeBudget || this.state.updatedRequest.UnbudgetedFunding == FundingList.Unbudgeted) {
                    if (tempUpdRequest.RequestingGroup == RequestingGroupList.PropOps) {
                        rolesByRequest = PropOpsAdditionalFundingRoles;
                    } else if (tempUpdRequest.RequestingGroup == RequestingGroupList.DCOps || tempUpdRequest.RequestingGroup == RequestingGroupList.EnergyProjects) {
                        rolesByRequest = DCOpsRoles;
                    }
                }

                rolesByRequest.forEach((role, index) => {
                    if (approvers.filter(approver => role === approver.Role && approver.Type == ApproverTypes[0]).length == 0) {
                        let secAppr = secondLevelDefault.find(tl => tl.Index == index);
                        if (!secAppr || (secAppr && approvers.filter(appr1 => secAppr.Role == appr1.Role && appr1.Type == ApproverTypes[0]).length == 0)) {
                            let thrAppr = thirdLevelDefault.find(tl => tl.Index == index);
                            if (!thrAppr || (thrAppr && approvers.filter(appr1 => thrAppr.Role == appr1.Role && appr1.Type == ApproverTypes[0]).length == 0)) {
                                rolesByRequest.push(role);
                            }
                        }
                    }
                });

                if (requiredRoles.length > 0) {
                    this._Utility.showNotification(`Please add ${requiredRoles.join(", ")} in Approvers section`, NotificationType.Failure);
                    isValid = false;
                }
            }
            else if ((tempUpdRequest.Region != Regions.Europe) && !this.isEnergyProject && !approvers.filter(approver => approver.Type == ApproverTypes[0] && (approver.Role == EmployeeRoles.VPPropOps)).length) {
                this._Utility.showNotification(`Please add ${EmployeeRoles.VPPropOps} in Approvers section`, NotificationType.Failure);
                isValid = false;
            }
        }

        return isValid;
    }

    isHtmlEncodedStringContainsText = (encodedText: string) => {
        const checksHtmlTags = /(<([^>]+)>)/ig;
        return (
            encodedText &&
            decodeURIComponent(encodedText)
                ?.replace(checksHtmlTags, "")
                ?.replace(/\s/g, "")
                ?.replace(/&nbsp;/g, "")?.length > 0
        );
    }

    validateUpdateRequest(action: string): boolean {
        let updatedRequest = { ...this.state.updatedRequest };
        if (updatedRequest.Region && updatedRequest.Division && updatedRequest.AirportCode && updatedRequest.PCode && updatedRequest.PropertyAddress && updatedRequest.ProjectTitle && updatedRequest.ProjectTitle.length > 0
            && updatedRequest.ProjectTitle.length <= 75
            && (this.projectTypes.findIndex(_ => _.ProjectType == updatedRequest.ProjectType) > -1)
            && (!!updatedRequest.Region && updatedRequest.Region == Regions.Europe ? true : updatedRequest.RequestingGroup)
            && (updatedRequest.IsUnbudgeted ? this.projectCost : updatedRequest.Budget)
            && this.validDateString(updatedRequest.ProjectEstimateStartDate)
            && this.validDateString(updatedRequest.ProjectEstimateEndDate) && (updatedRequest.EnergySavingsType != undefined && updatedRequest.EnergySavingsType != null) && this.isHtmlEncodedStringContainsText(updatedRequest.ProjectJustification) && this.isHtmlEncodedStringContainsText(updatedRequest.ProjectDescription) &&
            (this.isEquipmentProject ? updatedRequest.QuantityPerUnits && updatedRequest.EquipmentCapacityPerSize && updatedRequest.UnitsOfMeasure && updatedRequest.EquipmentManufacturer : true) &&
            (!!this.isRiskProfileProject ? (!!this.riskProfile && !!updatedRequest.RiskProfile1 && !!updatedRequest.RiskProfile2) : true)) {
            if ((action == CallToActions.Save && updatedRequest.RequestStatus != Status.Planning) || action == CallToActions.Next || action == "") {
                return true;
            }
            else {
                if (this.state.updatedRequest.IsUnbudgeted) {
                    let offset = 0, isExceededAvailableCredit = false;
                    this.allocatedProjects.map(project => {
                        offset += (project.Offset * project.ExchangeRate).toFormatNumber(this.defaultCurrency.Currency);
                        isExceededAvailableCredit = !isExceededAvailableCredit ? Math.round(project.Offset * project.ExchangeRate) > project.AvailableAllocation : isExceededAvailableCredit;
                    });
                    if (Number((this.projectCost * this.exchangeRate).toFixed()) >= Number((offset).toFixed()) && (!!this.state.updatedRequest.UnbudgetedFunding && (this.state.updatedRequest.UnbudgetedFunding == FundingList.Unbudgeted ? true : !!this.state.updatedRequest.FundingSource))) {
                        return true;
                    }
                    if (isExceededAvailableCredit)
                        this._Utility.showNotification("Budget Impact amount exceeds project available amount, reduce budget impact amount", NotificationType.Failure);
                    else
                        this._Utility.showNotification("Budget Impact amount exceeds Project cost, reduce budget impact amount", NotificationType.Failure);

                    return false;
                }

                return true;
            }
        }
        else {
            this._Utility.showNotification("Please fill all the required fields", NotificationType.Failure);
            return false;
        }
    }

    validateAllocatedProjects(): boolean {
        let isValid = true;
        if (this.state.updatedRequest.IsUnbudgeted) {
            let allocatedProjects = this.allocatedProjects ? [...this.allocatedProjects] : [];
            if ((!(allocatedProjects?.filter(project => project.IsEditing)?.length == 0) && this.isProjectAdded)) {
                this._Utility.showNotification("Please click check mark or select 'Add'", NotificationType.Failure);
                isValid = false;
            }
            else if (allocatedProjects.filter(project => project.AvailableAllocation < Math.round(project.Offset * project.ExchangeRate)).length > 0) {
                this._Utility.showNotification("Funding strategy amount exceeds available credit, reduce funding strategy amount", NotificationType.Failure);
                isValid = false;
            }
        }

        return isValid;
    }

    validateProjectEstimateDates(): boolean {
        if (this.startMonth && this.startYear && this.endMonth && this.endYear && ((new Date(this.endYear, this.endMonth - 1)) < (new Date(this.startYear, this.startMonth - 1)))) {
            this._Utility.showNotification("Estimate End Date should be greater than or equals to Estimate Start Date", NotificationType.Failure);
            return false;
        }
        else if (this.startYear != this.endYear) {
            this._Utility.showNotification("Please make sure End Year and Start Year are same", NotificationType.Failure);
            return false;
        }
        return true;
    }

    validateAtleastOneEnvironmentalImpactIsFilled(): boolean {
        return this.state.Sustainability.EnvironmentalImpact.some(_ => !!_.Applicable);
    }

    validateSustainabilityAmountExists(): boolean {
        return ((this.state.Sustainability.EnvironmentalImpact.filter(_ => !!_.Applicable && !!_.Amount && !!_.Attachments && _.Attachments.some(x => !!x.IsActive)).length == this.state.Sustainability.EnvironmentalImpact.filter(_ => !!_.Applicable).length)
            && (this.state.Sustainability.OperationalImpact.filter(_ => !!_.Applicable && !!_.Amount && !!_.Attachments && _.Attachments.some(x => !!x.IsActive)).length == this.state.Sustainability.OperationalImpact.filter(_ => !!_.Applicable).length))
    }

    getRequestResources = () => {
        this._CapitalRequestService.getRequestResources().then((data: IIUPRequestResources) => {
            this.properties = (data.Properties ? data.Properties.filter(_ => !!_.Country) : data.Properties) as IProperty[];;
            this.defaultBudgetYear = data.DefaultBudgetYear as number;
            this.unbudgetedBudgetYear = data.UnbudgetedBudgetYear as number;
            this.allApprovers = data.ManagementEmployees as IApprover[];
            if (this.allApprovers && this.allApprovers.length > 0) {
                this.allApprovers.map(approver => {
                    if (this.allApproversWithoutSiteCode.filter(a => a.Email && approver.Email && a.Email.toLowerCase() == approver.Email.toLowerCase() && a.Role == approver.Role).length == 0)
                        this.allApproversWithoutSiteCode.push({ ...approver })
                });
            }
            let requestor: IPropertyUserRole = { Order: 0, Role: Requestor };
            this.propertyUserRoles = [...PropertyUserRoles];
            this.propertyUserRoles.push(requestor);
            this.propertyUserRoles = this.propertyUserRoles.sort((a, b) => a.Order - b.Order) as IPropertyUserRole[];
            this.iupYears = data.Years;
            this.yearConfig = data.Years.map(year => {
                if (year.IsActive) {
                    return year.Year.toString();
                }
            });
            this.populateAllDropdowns();
            let tempRequest = { ...this.state.updatedRequest };
            this.allnotifiers = [...tempRequest.Approvers.filter(a => a.Type == ApproverTypes[1])];
            tempRequest = this.onChangeRegion(tempRequest, tempRequest.Region);
            tempRequest = this.onSiteDetailChange(IUPFields.PCode, this.state.updatedRequest.PCode);
            if (!this._Utility.isEmptyObject(tempRequest.ProjectType)) {
                this.onProjectTypeChange(tempRequest.ProjectType);
                this.selectedProjectType = this.projectTypes && this.projectTypes.length > 0 ? this.projectTypes.filter(it => it.ProjectType && tempRequest.ProjectType && it.ProjectType.toLowerCase() == tempRequest.ProjectType.toLowerCase())[0] : {};
                this.isCostType = true;
                this.selectedCostType = this.selectedProjectType == undefined ? undefined : this.selectedProjectType.CostType;
                if (this.selectedProjectType != undefined && this.selectedProjectType.ProjectTypeModel && tempRequest.ProjectTypeCategoryMapping)
                    tempRequest.ProjectCategory = `${this.selectedProjectType.ProjectTypeModel} - ${tempRequest.ProjectTypeCategoryMapping}`;
                tempRequest.RequestingGroup = this.selectedProjectType == undefined ? undefined : this.selectedProjectType.MappedToGroup;
                tempRequest.CostType = this.selectedProjectType == undefined ? undefined : this.selectedProjectType.CostType;
                tempRequest.ProjectType = this.selectedProjectType == undefined ? undefined : this.selectedProjectType.ProjectType;
            }
            if (this.state.updatedRequest.RequestID == 0) {
                tempRequest.BudgetYear = this.defaultBudgetYear;
                if (this.defaultCurrency.Currency.toUpperCase() == tempRequest.LocalCurrency.toUpperCase())
                    this.exchangeRate = 1;
                else
                    this.exchangeRate = this.currencies.filter(it => !it.IsDefault && it.Currency.toUpperCase() == tempRequest.LocalCurrency.toUpperCase())[0].ExchangeRate;
                tempRequest.ExchangeRate = this.exchangeRate;
            }
            else {
                this.exchangeRate = this._Utility.isEmptyObject(this.state.updatedRequest.ExchangeRate) ? this.exchangeRate : this.state.updatedRequest.ExchangeRate;
            }
            if (tempRequest.RequestStatus == Status.Planning) {
                this.isEnergyProject = tempRequest.RequestingGroup == "Energy Projects";
                this.managementApprovers = this.allApprovers.filter(approver => approver.DefaultSiteCode == tempRequest.AirportCode && approver.PCode == tempRequest.PCode);
                tempRequest = this.updateApprovers(tempRequest);
            }
            this.setState({
                ...this.state,
                showLoader: false,
                isAdmin: data.IsAdmin,

                updatedRequest: {
                    ...tempRequest,
                },
                isEuropeAdmin: data.IsEuropeAdmin
            }, () => {
            })
        }, () => {
            this.setState({
                showLoader: false
            });
        });
    }

    /* Start of Approver Section Updates */
    updateApprovers(tempUpdRequest: ICapitalRequest): ICapitalRequest {
        if (tempUpdRequest.RequestID == 0 || tempUpdRequest.RequestStatus == Status.Planning) {
            let approvers = [], notifiers: Array<IApprover> = [];

            //Update notifiers start
            if (!this.updateNotifiers && !tempUpdRequest.IsUnbudgeted) {
                tempUpdRequest.Approvers?.map(a => {
                    let approver: IApprover = { ...a }
                    if (!this.managementApprovers?.find(m => m.Email?.toLowerCase() === approver.Email?.toLowerCase() && m.Role?.toLowerCase() === approver.Role?.toLowerCase()) && !approver.IsAdditionalNotifier) {
                        return;
                    }

                    // Energy Projects
                    if ((this.isEnergyProject || tempUpdRequest.RequestingGroup === RequestingGroupList.EnergyProjects) && (!approver.Type || approver.Type === "")) {
                        approver.Type = (!approver.Type || approver.Type === "") && EnergyNotifierRoles.find(role => role === approver.Role) ? ApproverTypes[1] : EnergyStage1Roles.concat(DCOpsAndEnergyStage2Roles).find(role => role === approver.Role) ? ApproverTypes[0] : "";

                        if (approver.Type == ApproverTypes[1] && (EnergyNotifierRoles.find(role => role === approver.Role) || approver.IsAdditionalNotifier))
                            notifiers.push(approver)
                    }

                    // DC or Prop ops projects
                    else if ((tempUpdRequest.RequestingGroup === RequestingGroupList.DCOps || tempUpdRequest.RequestingGroup === RequestingGroupList.PropOps) && approver.IsAdditionalNotifier)
                        notifiers.push(approver)
                    else if (approver.Type == ApproverTypes[1] && !(tempUpdRequest.RequestingGroup === RequestingGroupList.DCOps || tempUpdRequest.RequestingGroup === RequestingGroupList.PropOps)) {
                        notifiers.push(approver)
                    }
                })
            }
            else if (!tempUpdRequest.IsUnbudgeted) {
                notifiers = [...this.allnotifiers.filter(a => {
                    if (tempUpdRequest.RequestingGroup === RequestingGroupList.DCOps || tempUpdRequest.RequestingGroup === RequestingGroupList.PropOps)
                        return a.Type == ApproverTypes[1] && a.IsAdditionalNotifier;
                    return a.Type == ApproverTypes[1]
                })];
            }
            else {
                tempUpdRequest.Approvers?.map(a => {
                    let approver: IApprover = { ...a };
                    if (!this.managementApprovers?.find(m => m.Email?.toLowerCase() === approver.Email?.toLowerCase() && m.Role?.toLowerCase() === approver.Role?.toLowerCase()) && !approver.IsAdditionalNotifier) {
                        return;
                    }
                    if (approver.Type == ApproverTypes[1])
                        notifiers.push(approver)
                    else if ((!approver.Type || approver.Type === "") && (UnbudgetedNotifierRoles.find(role => role === approver.Role) || approver.IsAdditionalNotifier)) {
                        approver.Type = ApproverTypes[1];
                        notifiers.push(approver)
                    }
                })
            }
            //Update notifiers end

            this.managementApprovers = this.managementApprovers.map(a => { a.Type = ""; return a; });

            // Update approvers start
            if (tempUpdRequest.Region == Regions.Europe) {
                let tempEuropeApprovers = this.EuropeAllApprovers.filter(apr => !!tempUpdRequest.PCode && !!apr && apr.PCode == tempUpdRequest.PCode);
                approvers = tempEuropeApprovers.map((approver) => ({
                    UserId: approver.EmployeeID,
                    PCode: approver.PCode,
                    FunctionalJobTitle: approver.FunctionJobTitle,
                    FunctionalTitle: approver.FunctionJobTitle,
                    Role: approver.FunctionJobTitle,
                    Title: approver.EmployeeName,
                    Email: approver.Email,
                    UserName: approver.EmployeeName,
                    DefaultSiteCode: approver.SiteCode,
                    IsActive: true,
                    Level: approver.Level
                } as IApprover));

                this.sortApproversWithRoles(approvers, "Level");

                approvers = approvers.map((approver, index) => {
                    approver.Type = ApproverTypes[0];
                    approver.Level = index + 1;
                    return { ...approver };
                });
                this.EuropeApprovers = approvers;
                tempUpdRequest.Approvers = approvers;
                this.areApproversUpdated = true;
                this.updatedApprovers = tempUpdRequest.Approvers;
                return tempUpdRequest;
            }
            else if (this.isEnergyProject && !this.isUnbudgeted) {
                BudgetedEnergyApprovalStages.forEach((stage, index) => {
                    if (stage.IsEmployee) {
                        let emp = this.allApprovers.find(_ => !!_.Email && _.Email.toLowerCase() == stage.Email.toLowerCase());
                        if (!!emp)
                            approvers.push(emp);
                        else
                            approvers.push({ Email: stage.Email, IsActive: true, Level: index + 1, Title: stage.Title } as IApprover);
                    } else {
                        let aprs = this.managementApprovers.filter(approver => approver.Role && stage.Role === approver.Role);
                        aprs.forEach(_ => { approvers.push(_); });
                    }
                });

                approvers.forEach((approver, index) => {
                    approver.Level = index + 1;
                    approver.Type = ApproverTypes[0];
                });
                approvers = this.sortApproversWithRoles(approvers, "Level");

                if (this.updateNotifiers || this.callToAction == CallToActions.Duplicate || (tempUpdRequest.Approvers && tempUpdRequest.Approvers.filter(a => a.Type == ApproverTypes[0]).length == 0 && tempUpdRequest.Approvers.filter(a => a.Type == ApproverTypes[1]).length == 0)) {
                    notifiers = notifiers.filter(n => n.IsAdditionalNotifier);
                    let notifies = JSON.parse(JSON.stringify(this.managementApprovers.filter(approver => EnergyNotifierRoles.filter(role => role === approver.Role).length > 0)));
                    notifies.map(notifier => {
                        if (notifiers.filter(n => n.Email && notifier.Email && n.Email.toLowerCase() == notifier.Email.toLowerCase()).length == 0) {
                            notifier.Type = ApproverTypes[1];
                            notifier.Level = 0;
                            notifier.Stage = "";
                            notifiers.push(notifier);
                        }
                    });
                }
                notifiers = this.sortNotifiers([...notifiers]);

                this.areApproversUpdated = true;
                tempUpdRequest.Approvers = [...approvers, ...notifiers];
                this.updatedApprovers = tempUpdRequest.Approvers;

                return tempUpdRequest;
            }
            else if (this.isUnbudgeted && !!tempUpdRequest.UnbudgetedFunding && (tempUpdRequest.UnbudgetedFunding == FundingList.Unbudgeted ? true : !!tempUpdRequest.FundingSource) && tempUpdRequest.RequestingGroup) {
                let firstLevelDefaulf: Array<string> = [];
                let secondLevelDefault: Array<string> = [];
                let thirdLevelDefault: Array<string> = [];
                let approverRoles = [];

                if (tempUpdRequest.FundingSource == FundingSourceList.SelfFundedProperty) {
                    if (tempUpdRequest.RequestingGroup == RequestingGroupList.PropOps) {
                        approverRoles = PropOpsSelfFundedPropertyRoles;

                        firstLevelDefaulf = firstLevelDefaulf.concat([EmployeeRoles.RMPropOps]);
                        secondLevelDefault = secondLevelDefault.concat([EmployeeRoles.DirectorPropOps]);
                        thirdLevelDefault = thirdLevelDefault.concat([EmployeeRoles.VPPropOps]);

                    } else if (tempUpdRequest.RequestingGroup == RequestingGroupList.DCOps || tempUpdRequest.RequestingGroup == RequestingGroupList.EnergyProjects) {
                        approverRoles = DCOpsSelfFundedPropertyRoles;

                        firstLevelDefaulf = firstLevelDefaulf.concat([EmployeeRoles.RMDCOps, EmployeeRoles.RMPropOps]);
                        secondLevelDefault = secondLevelDefault.concat([EmployeeRoles.VPDCOps, EmployeeRoles.DirectorPropOps]);
                        thirdLevelDefault = thirdLevelDefault.concat([EmployeeRoles.VPPropOps, EmployeeRoles.VPPropOps]);
                    }
                }
                else if (tempUpdRequest.FundingSource == FundingSourceList.SelfFundedDirector) {
                    if (tempUpdRequest.RequestingGroup == RequestingGroupList.PropOps) {
                        approverRoles = PropOpsSelfFundedDirectorRoles;

                        firstLevelDefaulf = firstLevelDefaulf.concat([EmployeeRoles.DirectorPropOps]);
                        secondLevelDefault = secondLevelDefault.concat([EmployeeRoles.VPPropOps]);
                    } else if (tempUpdRequest.RequestingGroup == RequestingGroupList.DCOps || tempUpdRequest.RequestingGroup == RequestingGroupList.EnergyProjects) {
                        approverRoles = DCOpsSelfFundedDirectorRoles;

                        firstLevelDefaulf = firstLevelDefaulf.concat([EmployeeRoles.DirectorDCOps, EmployeeRoles.DirectorPropOps]);
                        secondLevelDefault = secondLevelDefault.concat([EmployeeRoles.VPDCOps, EmployeeRoles.VPPropOps]);
                    }
                }
                else if (tempUpdRequest.FundingSource == FundingSourceList.RepurposeBudget || tempUpdRequest.UnbudgetedFunding == FundingList.Unbudgeted) {
                    if (tempUpdRequest.RequestingGroup == RequestingGroupList.PropOps) {
                        approverRoles = PropOpsAdditionalFundingRoles;
                    } else if (tempUpdRequest.RequestingGroup == RequestingGroupList.DCOps || tempUpdRequest.RequestingGroup == RequestingGroupList.EnergyProjects) {
                        approverRoles = DCOpsRoles;
                    }
                }

                approverRoles = approverRoles ? approverRoles : [];
                approvers = ([...this.managementApprovers.filter(approver => approverRoles.filter(role => role === approver.Role).length > 0)]);

                firstLevelDefaulf.forEach((role, index) => {
                    if (approvers.filter(approver => approver.Role == role && approver.Role != secondLevelDefault[index]).length == 0 && approvers.filter(approver => approver.Role == secondLevelDefault[index] || approver.Role == thirdLevelDefault[index]).length == 0) {
                        if (this.managementApprovers.filter(approver => secondLevelDefault[index] == approver.Role).length > 0)
                            approvers.push(this.managementApprovers.filter(approver => secondLevelDefault[index] == approver.Role)[0]);
                        else if (this.managementApprovers.filter(approver => thirdLevelDefault[index] == approver.Role).length > 0)
                            approvers.push(this.managementApprovers.filter(approver => thirdLevelDefault[index] == approver.Role)[0]);
                    }
                });

                let approverCount = 1;
                approvers = approvers.map(approver => {
                    approver.Type = ApproverTypes[0];
                    approver.Level = approverCount++;
                    return approver;
                });
                if (this.updateNotifiers || this.callToAction == CallToActions.Duplicate || (tempUpdRequest.Approvers && tempUpdRequest.Approvers.filter(a => a.Type == ApproverTypes[0]).length == 0 && tempUpdRequest.Approvers.filter(a => a.Type == ApproverTypes[1]).length == 0)) {
                    let notifies = ([...this.managementApprovers.filter(approver => UnbudgetedNotifierRoles.filter(role => role === approver.Role).length > 0)]);
                    notifies.map(notifier => {
                        if (notifiers.filter(n => notifier.Email && n.Email && n.Email.toLowerCase() == notifier.Email.toLowerCase()).length == 0)
                            notifiers.push({ ...notifier });
                    });
                }

                approvers = this.sortApprovers(approvers, this.isUnbudgeted, tempUpdRequest)
                notifiers = this.sortNotifiers(notifiers)
            }
            else if (!this.isUnbudgeted && !this.isEnergyProject && tempUpdRequest.RequestingGroup) {
                if (tempUpdRequest.RequestingGroup == RequestingGroupList.DCOps) {
                    approvers = this.getAllStagesApprovers(BudgetedDCOpsApprovalStages, tempUpdRequest);
                }
                else if (tempUpdRequest.RequestingGroup == RequestingGroupList.PropOps) {
                    approvers = this.getAllStagesApprovers(BudgetedPropOpsApprovalStages, tempUpdRequest);
                }
            }
            // Update approvers end

            notifiers = notifiers.map(notifier => { notifier.Type = ApproverTypes[1]; notifier.Level = 0; notifier.Stage = ""; return notifier; });

            this.areApproversUpdated = true;
            tempUpdRequest.Approvers = [...approvers, ...notifiers];
            this.updatedApprovers = tempUpdRequest.Approvers;
        }

        return tempUpdRequest;
    }

    getAllStagesApprovers(stages: Array<IStageRole>, tempUpdRequest: ICapitalRequest) {
        let tempApprovers: IApprover[] = [];
        stages.forEach(stage => {
            let approvers = this.managementApprovers.filter(approver => approver.Role && !stage.IsEmployee && stage.Role === approver.Role);
            tempApprovers = tempApprovers.concat(approvers);
        });

        return this.sortApprovers([...tempApprovers], this.isUnbudgeted, tempUpdRequest);
    }

    sortApproversWithRoles(data: any, key: any) {
        if (data && data.length > 0) {
            data.sort((a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0));
        }
        return data;
    }

    sortApprovers(approvers: IApprover[], isUnbudgeted: boolean, tempUpdRequest: ICapitalRequest) {
        let approverCount = 1;
        if (isUnbudgeted && !!tempUpdRequest.UnbudgetedFunding && (tempUpdRequest.UnbudgetedFunding == FundingList.Unbudgeted ? true : !!tempUpdRequest.FundingSource)) {
            let sortedApprovers = [];
            this.propertyUserRoles.map(role => {
                if (this.checkifStatusIsInProgress(tempUpdRequest.RequestStatus)) {
                    let appr = [...approvers.filter(approver => approver.Role == role.Role)];
                    sortedApprovers = sortedApprovers.concat(this.sortApproversWithRoles(appr, "Level"));
                }
                else {
                    let appr = [...approvers.filter(approver => approver.Role == role.Role)];
                    sortedApprovers = sortedApprovers.concat(this.sortApproversWithRoles(appr, "Title"));
                }
            });

            sortedApprovers = sortedApprovers.map((approver, index) => {
                approver.Type = ApproverTypes[0];
                approver.Level = approverCount++;
                return { ...approver };
            });
            return sortedApprovers;
        }
        else if (!isUnbudgeted) {
            let sortedApprovers = [];
            this.propertyUserRoles.map(role => {
                if (this.checkifStatusIsInProgress(tempUpdRequest.RequestStatus)) {
                    let appr = [...approvers.filter(approver => approver.Role == role.Role)];
                    sortedApprovers = sortedApprovers.concat(this.sortApproversWithRoles(appr, "Level"));
                }
                else {
                    let appr = [...approvers.filter(approver => approver.Role == role.Role)];
                    sortedApprovers = sortedApprovers.concat(this.sortApproversWithRoles(appr, "Title"));
                }
            });

            sortedApprovers = sortedApprovers.map((approver, index) => {
                approver.Type = ApproverTypes[0]
                approver.Level = approverCount++;
                return { ...approver };
            });
            return sortedApprovers;
        }
    }

    sortNotifiers = (notifiers: IApprover[]) => {
        let sortedNotifiers = [];
        if (this.isEnergyProject) {
            EnergyNotifierRoles.map(role => {
                let appr = [...notifiers.filter(approver => approver.Role == role)];
                sortedNotifiers = sortedNotifiers.concat(appr);
            });

            sortedNotifiers = sortedNotifiers.concat(notifiers?.filter(n => !EnergyNotifierRoles.find(role => role === n.Role) && n.IsAdditionalNotifier))
        }
        else if (this.isUnbudgeted) {
            UnbudgetedNotifierRoles.map(role => {
                let appr = [...notifiers.filter(approver => approver.Role == role)];
                sortedNotifiers = sortedNotifiers.concat(appr);
            });
            sortedNotifiers = sortedNotifiers.concat(notifiers?.filter(n => !UnbudgetedNotifierRoles.find(role => role === n.Role) && n.IsAdditionalNotifier))
        }
        return this.isEnergyProject || this.isUnbudgeted ? this.removeDuplicateNotifier(sortedNotifiers) : notifiers;
    }

    removeDuplicateNotifier = (notifiers: IApprover[]) => {
        let uniqueNotifiers: IApprover[] = [];
        notifiers?.map(n => {
            if (!uniqueNotifiers?.find(u => u.Email?.toLowerCase() === n.Email?.toLowerCase() && u.Title?.toLowerCase() === n.Title?.toLowerCase())) {
                uniqueNotifiers.push(n)
            }
        })

        return uniqueNotifiers;
    }

    addNotifier(notifier: IApprover) {
        let approvers = [];
        let updatedRequest = { ...this.state.updatedRequest };
        if (updatedRequest.RequestID == 0 || updatedRequest.RequestStatus == Status.Planning) {
            notifier.IsAdditionalNotifier = true;
            if (this.state.updatedRequest && this.state.updatedRequest.Approvers && this.state.updatedRequest.Approvers.length) {
                if (this.state.updatedRequest.Approvers.filter(n => n.Email && notifier.Email && n.Email.toLowerCase() == notifier.Email.toLowerCase() && n.Type == ApproverTypes[1]).length == 0) {
                    notifier.Type = ApproverTypes[1];
                    notifier.Level = 0;
                    approvers = [...this.state.updatedRequest.Approvers, notifier];
                }
                else
                    approvers = [...this.state.updatedRequest.Approvers];
            } else {
                notifier.Type = ApproverTypes[1];
                notifier.Level = 0;
                approvers.push(notifier);
            }
            this.allnotifiers = [...approvers.filter(a => a.Type == ApproverTypes[1])];
        }
        else {
            if (this.updatedApprovers && this.updatedApprovers.length) {
                if (this.updatedApprovers.filter(n => n.Email && notifier.Email && n.Email.toLowerCase() == notifier.Email.toLowerCase() && n.Type == ApproverTypes[1]).length == 0) {
                    notifier.Type = ApproverTypes[1];
                    notifier.Level = 0;
                    approvers = [...this.updatedApprovers, notifier];
                }
                else
                    approvers = [...this.updatedApprovers];
            } else {
                notifier.Type = ApproverTypes[1];
                notifier.Level = 0;
                approvers.push(notifier);
            }
        }

        if (updatedRequest.RequestID == 0 || updatedRequest.RequestStatus == Status.Planning)
            updatedRequest.Approvers = approvers;
        else
            this.updatedApprovers = approvers;

        updatedRequest.areApproversUpdated = true;
        this.setState({
            updatedRequest: updatedRequest,
            isValuesChanged: true
        }, () => {
            this.areApproversUpdated = true;
        });
    }

    removeNotifier(notifier: IApprover) {
        let updatedRequest = { ...this.state.updatedRequest };
        if (updatedRequest.RequestID == 0 || updatedRequest.RequestStatus == Status.Planning) {
            let approvers: IApprover[] = [...this.state.updatedRequest.Approvers.filter(n => notifier.Email && n.Email && n.Email.toLowerCase() != notifier.Email.toLowerCase() || n.Type == ApproverTypes[0])];
            updatedRequest.Approvers = approvers;
            this.allnotifiers = [...approvers.filter(a => a.Type == ApproverTypes[1])];
        }
        else {
            let approvers: IApprover[] = [...this.updatedApprovers.filter(n => notifier.Email && n.Email && n.Email.toLowerCase() != notifier.Email.toLowerCase() || n.Type == ApproverTypes[0])];
            this.updatedApprovers = approvers;
        }
        updatedRequest.areApproversUpdated = true;
        this.setState({
            updatedRequest: updatedRequest,
            isValuesChanged: true
        }, () => {
            this.areApproversUpdated = true;
        });
    }
    /* End of Approver Section Updates */

    // Start of Attachments section events
    async blobToBase64(selectedFile: any) {
        let file = {} as IAttachment;
        file.Extension = selectedFile.name.split(".").pop().toLowerCase();
        file.Name = selectedFile.name;
        file.Type = selectedFile.type;
        file.IsActive = true;
        return new Promise<IAttachment>((resolve, reject) => {
            let reader = new FileReader();

            reader.onload = (event: any) => {
                let dataUrl = reader.result.toString();
                file.Data = dataUrl ? dataUrl.split(",")[1] : "";
                resolve(file);
            };
            reader.readAsDataURL(selectedFile);
        });
    }

    async blobToBase64IUPImpact(selectedFile: any) {
        let file = {} as IUPImpactAttachment;
        file.Extension = selectedFile.name.split(".").pop().toLowerCase();
        file.Name = selectedFile.name;
        file.Type = selectedFile.type;
        file.IsActive = true;
        return new Promise<IUPImpactAttachment>((resolve, reject) => {
            let reader = new FileReader();

            reader.onload = (event: any) => {
                let dataUrl = reader.result.toString();
                file.Data = dataUrl ? dataUrl.split(",")[1] : "";
                resolve(file);
            };
            reader.readAsDataURL(selectedFile);
        });
    }

    public async checkFileType(files: FileList, isProposal: boolean) {
        let existingFiles: IAttachment[] = !!this.state.updatedRequest.Attachments ? [...this.state.updatedRequest.Attachments] : [];

        let existingFilesSize = existingFiles.map((file) => file["size"]).reduce((prev, curr) => prev + curr, 0);
        if (!(existingFilesSize))
            existingFilesSize = 0;

        let newFilesSize: number = 0;
        let isEmpty: boolean, isDuplicate: boolean, isMoreSize: boolean, isNotallow: boolean, isSAPSpecialcharError: boolean;

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let fileType = files[i].name.replace(/^.*\./, "").toLowerCase();
                if (files[i].name.indexOf(',') > -1) {
                    if (!isSAPSpecialcharError) {
                        NotificationManager.error("File name shouldn't contain special characters", '', 3000);
                    }
                    isSAPSpecialcharError = true;
                    continue;
                }
                if (fileType != null && fileExtentions.indexOf(fileType) > -1) {
                    let fileName = files[i].name;
                    if (files[i].size == 0) {
                        if (!isEmpty) {
                            NotificationManager.error('File should not be empty', '', 3000);
                        }
                        isEmpty = true;
                        continue;
                    }
                    else if (existingFiles.filter(file => !!file.IsActive && (file.DecodedName == fileName || file.Name == files[i].name)).length == 0) {
                        newFilesSize += files[i].size;
                        if ((existingFilesSize as number) + newFilesSize > FileMaxLimit) {
                            if (!isMoreSize) {
                                NotificationManager.error('The attachment size exceeded the allowable size of 14MB', '', 5000);
                            }
                            isMoreSize = true;
                        }
                        else {
                            let loadedFile = await this.blobToBase64(files[i]);
                            loadedFile.DecodedName = `_${fileName}_${loadedFile.Name}`;
                            loadedFile.IsProposal = isProposal;
                            existingFiles.push(loadedFile);
                        }
                    }
                    else {
                        if (!isDuplicate) {
                            NotificationManager.error('File already exist', '', 3000);
                        }

                        isDuplicate = true;
                        continue;
                    }
                }
                else {
                    if (!isNotallow) {
                        NotificationManager.error('Add Attachments supports xls, xlsx, doc, docx, pdf, ppt, pptx, msg, eml files only', '', 4000);
                    }
                    isNotallow = true;
                    continue;
                }
            }
        } else {
            if (existingFiles.length <= 0)
                existingFiles = [];
        }

        let updatedRequest = { ...this.state.updatedRequest }
        updatedRequest.Attachments = existingFiles;

        this.setState({
            updatedRequest: updatedRequest,
            isValuesChanged: true,
        });

        let fileUploader: any = document.getElementById("fileuploader");
        !!fileUploader ? (fileUploader.value = null) : "";

        let propsalfileuploader: any = document.getElementById("propsalfileuploader");
        !!propsalfileuploader ? (propsalfileuploader.value = null) : "";
    }

    onDeleteFile(file: IAttachment) {
        let existingFiles = !!this.state.updatedRequest.Attachments ? [...this.state.updatedRequest.Attachments] : [];
        let index = existingFiles.findIndex(_ => _.Name == file.Name && _.DecodedName == file.DecodedName && file.ID == _.ID);
        if (index > -1) {
            if (!!existingFiles[index].ID)
                existingFiles[index].IsActive = false;
            else
                existingFiles.splice(index, 1);
        }

        let updatedRequest = { ...this.state.updatedRequest }
        updatedRequest.Attachments = existingFiles;

        this.setState({ isValuesChanged: true, updatedRequest: updatedRequest });
    }

    formLink(fileName: string, ID: number): string {
        let strDocUrl: string = "";
        let folderRelativeUrl: string = `${this.state.requestURL.SPSite}/${this.state.requestURL.FileUploader}/${ID.toString()}/`;
        let strDocExt = fileName.split('.').pop().toLowerCase();
        let enfileName = encodeURIComponent(fileName);
        if (strDocExt == "pdf" || strDocExt == "msg" || strDocExt == "eml") {
            strDocUrl = `${folderRelativeUrl}${enfileName}`;
        }
        else if (fileExtentions.indexOf(strDocExt) > -1) {
            strDocUrl = `${this.state.requestURL.SPSite}/_layouts/15/WopiFrame.aspx?sourcedoc=${folderRelativeUrl}${enfileName}&action=default`;
        }
        return strDocUrl;
    }
    // End of Attachments section events

    // Start of Unbudgeted events
    getIncrementalFunding = (): number => {
        let allocatedBudget: number = 0;
        this.allocatedProjects.forEach((item) => {
            allocatedBudget += (item.Offset * item.ExchangeRate).toFormatNumber(this.defaultCurrency.Currency);
        });
        return Math.round((this.projectCost * this.exchangeRate).toFormatNumber(this.defaultCurrency.Currency) - allocatedBudget);
    }

    updateIsProjectAdded = (value: boolean) => {
        this.isProjectAdded = value;
    }

    onChangeAllocatedProject = (item: IAllocatedProject, isDelete: boolean) => {
        if (isDelete) {
            this.allocatedProjects = this.allocatedProjects.filter(project => project.ProjectId != item.ProjectId);
            this.areAllocationsUpdated = true;
        }
        else {
            this.allocatedProjects = this.allocatedProjects.map(project => {
                if (project.ProjectId === item.ProjectId) {
                    project = item;
                }
                return { ...project }
            })
            this.areAllocationsUpdated = true;
        }
    }

    onChangeBudget = (value: any) => {
        this.projectCost = value;
    }

    onChangeFundingSource = (type: string, value: any) => {
        let tempUpdRequest = { ...this.state.updatedRequest };
        switch (type) {
            case IUPFields.FundingSource:
                tempUpdRequest.FundingSource = value;
                this.updateNotifiers = true;
                tempUpdRequest = this.updateApprovers(tempUpdRequest);

                break;

            case IUPFields.UnbudgetedFunding:
                tempUpdRequest.FundingSource = tempUpdRequest.UnbudgetedFunding != value ? '' : tempUpdRequest.FundingSource;
                tempUpdRequest.UnbudgetedFunding = value;
                this.updateNotifiers = true;
                tempUpdRequest = this.updateApprovers(tempUpdRequest);

                break;
        }

        this.setState({ updatedRequest: tempUpdRequest });
    }

    onAddAllocatedProject = (item: IAllocatedProject) => {
        this.allocatedProjects.push(item);
        this.areAllocationsUpdated = true;
        this.tempAllocatedProject = this.setDefaultAllocation();
    }

    updateTempAllocatedProject = (item: IAllocatedProject) => {
        this.tempAllocatedProject = item;
    }
    //End of unbudgeted section events

    validDateString(dateString: string): string {
        try {
            let temp = dateString.split('-');
            if (this._Utility.isEmptyArray(temp) || temp.length != 2)
                return "";
            let month = temp[0];
            let year = temp[1];
            if (isNaN(Number(month)) || isNaN(Number(year)) || Number(month) > 12 || Number(month) < 1 || !(year.length == 4 || year.length == 2))
                return "";
            return dateString;
        }
        catch (err) { return ""; }
    }

    getSelectOptions = (data: any[], valProperty: string, labelProperty: string) => {
        if (data == undefined)
            return [];
        let options: Array<ISelectOption> = [];
        try {
            data.forEach((value) => {
                if (!!value[valProperty] && (options.length == 0 || options.filter(it => it.value == value[labelProperty]).length == 0))
                    options.push({ value: value[valProperty], label: value[labelProperty] });
            });
        }
        catch (err) {
        }
        return options;
    }

    onChangeRegion = (tempUpdRequest: ICapitalRequest, selectedRegion: string): ICapitalRequest => {
        if (selectedRegion && selectedRegion.length > 0) {
            let selectedRegionProperties = this.properties.filter(r => r.Region === selectedRegion);
            let propertyCodeOptions: ISelectOption[] = [];
            let airportCodeOptions: ISelectOption[] = [];
            let propertyAddressOptions: ISelectOption[] = [];
            let countryOptions: ISelectOption[] = [];
            let marketOptions: ISelectOption[] = [];
            selectedRegionProperties.forEach((property: IProperty) => {
                try {
                    if (propertyCodeOptions.length == 0 || propertyCodeOptions.filter(it => it.value == property.PCode).length == 0)
                        propertyCodeOptions.push({ value: property.PCode, label: property.PCode });
                    if (airportCodeOptions.length == 0 || airportCodeOptions.filter(it => it.value == property.AirportCode).length == 0)
                        airportCodeOptions.push({ value: property.AirportCode, label: property.AirportCode });
                    if (propertyAddressOptions.length == 0 || propertyAddressOptions.filter(it => it.value == property.PropertyAddress).length == 0)
                        propertyAddressOptions.push({ value: property.PropertyAddress, label: property.PropertyAddress });
                    if (countryOptions.length == 0 || countryOptions.filter(it => it.value == property.Country).length == 0)
                        countryOptions.push({ value: property.Country, label: property.Country });
                    if (marketOptions.length == 0 || marketOptions.filter(it => it.value == property.Market).length == 0)
                        marketOptions.push({ value: property.Market, label: property.Market });
                }
                catch (err) {

                }
            });
            this.siteCodeSelectOptions = airportCodeOptions;
            this.pCodeSelectOptions = propertyCodeOptions;
            this.siteAddressSelectOptions = propertyAddressOptions;
            this.countrySelectOptions = countryOptions;
            this.marketSelectOptions = marketOptions;
            tempUpdRequest.PCode = undefined;
            tempUpdRequest.AirportCode = undefined;
            tempUpdRequest.PropertyAddress = undefined;
            tempUpdRequest.Division = undefined;
            tempUpdRequest.Market = undefined;
            tempUpdRequest.Country = undefined;
            tempUpdRequest.LocalCurrency = this.defaultCurrency.Currency;
            if (selectedRegion == Regions.Europe) {
                tempUpdRequest.RequestingGroup = undefined;
                this.projectTypeOptions = this.getSelectOptions(this.projectTypes, "ProjectType", "ProjectType");
            }

            return tempUpdRequest;
        }
    }

    onChangePrimaryField = (tempUpdRequest: ICapitalRequest, selectedRegionProperties: Array<IProperty>): ICapitalRequest => {
        let propertyCodeOptions: ISelectOption[] = [];
        let airportCodeOptions: ISelectOption[] = [];
        let propertyAddressOptions: ISelectOption[] = [];
        selectedRegionProperties.forEach((property: IProperty) => {
            try {
                if (propertyCodeOptions.length == 0 || propertyCodeOptions.filter(it => it.value == property.PCode).length == 0)
                    propertyCodeOptions.push({ value: property.PCode, label: property.PCode });
                if (airportCodeOptions.length == 0 || airportCodeOptions.filter(it => it.value == property.PCode).length == 0)
                    airportCodeOptions.push({ value: property.AirportCode, label: property.AirportCode });
                if (propertyAddressOptions.length == 0 || propertyAddressOptions.filter(it => it.value == property.PCode).length == 0)
                    propertyAddressOptions.push({ value: property.PropertyAddress, label: property.PropertyAddress });
            }
            catch (err) {

            }
        });
        this.siteCodeSelectOptions = airportCodeOptions;
        this.pCodeSelectOptions = propertyCodeOptions;
        this.siteAddressSelectOptions = propertyAddressOptions;
        tempUpdRequest.PCode = undefined;
        tempUpdRequest.AirportCode = undefined;
        tempUpdRequest.PropertyAddress = undefined;
        tempUpdRequest.Division = undefined;
        tempUpdRequest.Market = undefined;
        tempUpdRequest.LocalCurrency = this.defaultCurrency.Currency;
        return tempUpdRequest;
    }

    onSiteDetailChange(change: string, changedValue: string): ICapitalRequest {
        let tempUpdRequest: ICapitalRequest;
        let temp;
        try {
            temp = this.properties.filter(
                r => r[change] == changedValue);
            let selectedProperty = (temp != null && temp.length > 0) ? temp[0] : null;
            let localCurrency = this._Utility.isEmptyObject(selectedProperty.FunctionalCurrency) ? this.defaultCurrency.Currency.toUpperCase() : selectedProperty.FunctionalCurrency.toUpperCase();
            if (selectedProperty != undefined) {
                tempUpdRequest = Object.assign(this.state.updatedRequest, {
                    PCode: selectedProperty.PCode,
                    AirportCode: selectedProperty.AirportCode,
                    PropertyAddress: selectedProperty.PropertyAddress,
                    Division: selectedProperty.Division,
                    Market: selectedProperty.Market,
                    Country: selectedProperty.Country,
                    LocalCurrency: localCurrency,
                    Region: selectedProperty.Region
                });
                this.managementApprovers = this.allApprovers.filter(approver => approver.DefaultSiteCode == selectedProperty.AirportCode && approver.PCode == selectedProperty.PCode);
                let sortedApprovers = [];
                this.propertyUserRoles.map(role => {
                    sortedApprovers = sortedApprovers.concat([...this.managementApprovers.filter(approver => approver.Role == role.Role)]);
                });
                this.managementApprovers = sortedApprovers;
                if (this.defaultCurrency.Currency.toUpperCase() == localCurrency)
                    this.exchangeRate = 1;
                else
                    this.exchangeRate = this.currencies.filter(it => !it.IsDefault && it.Currency.toUpperCase() == tempUpdRequest.LocalCurrency.toUpperCase())[0].ExchangeRate;
            }
            else {
                tempUpdRequest = Object.assign(this.state.updatedRequest, { LocalCurrecy: this.defaultCurrency.Currency.toUpperCase() });
                this.exchangeRate = 1;
            }
        }
        catch (err) {
            tempUpdRequest = Object.assign(this.state.updatedRequest, { LocalCurrency: this.defaultCurrency.Currency.toUpperCase() });
            this.exchangeRate = 1;
        }
        return tempUpdRequest;
    }

    onProjectTypeChange(projectType: string) {
        let selectedProjectType = [];
        if (this.isEuropeRequest) {
            selectedProjectType = this.projectTypes;
        } else {
            selectedProjectType = this.projectTypes.filter(r => r.MappedToGroup == this.state.updatedRequest.RequestingGroup);
        }
        this.isEquipmentProject = selectedProjectType.filter(pType => pType.IsEquipmentProject && pType.ProjectType == projectType).length > 0;
        this.isRiskProfileProject = selectedProjectType.filter(pType => pType.IsRiskProfileProject && pType.ProjectType == projectType).length > 0;
        this.isEnergyProject = this.state.updatedRequest.RequestingGroup == "Energy Projects";
    }

    onBlurField = (e: any, field: string) => {
        if (field == IUPFields.Title) {
            this.setState({
                isTitleTyping: false
            })
        }
    }

    onDateChangeField = (value: any, field: any) => {
        this.setState({ isValuesChanged: true });
        let tempUpdRequest: ICapitalRequest = { ...this.state.updatedRequest };

        tempUpdRequest.UPSLastBatteryTest = value
        this.setState({
            updatedRequest: tempUpdRequest
        });
    }

    onChangeField = (event: any, field: string, type: string, formattedValue?: any) => {
        this.setState({ isValuesChanged: true });
        let tempUpdRequest: ICapitalRequest = this.state.updatedRequest;
        let fieldValue: any;
        if (formattedValue != undefined)
            fieldValue = formattedValue;
        else {
            switch (type) {
                case "text":
                    fieldValue = event.target.value;
                    break;
                case "dropdown":
                    fieldValue = event;
                    break;
                case "checkbox":
                    fieldValue = event.target.checked;
                default:
                    break;
            }
        }
        if (field == IUPFields.Title && (fieldValue as string).length > this.titleMaxLength) // Projet Title Validation
        {
            return event.preventDefault();
        }
        else {
            if (field == IUPFields.IsUnbudgeted) {
                tempUpdRequest = Object.assign(this.state.updatedRequest, {
                    Budget: (this.projectCost), ProjectEstimateUSD: 0, BudgetYear: (this.endYear > 0 ? this.endYear : this.defaultBudgetYear), IsUnbudgeted: fieldValue
                });
                this.isUnbudgeted = fieldValue;
                this.updateNotifiers = true;
                tempUpdRequest = this.updateApprovers(tempUpdRequest);
                this.yearSelectOptions = [];
                if (this.isUnbudgeted) {
                    tempUpdRequest.Approvers = tempUpdRequest.Approvers?.filter(a => {
                        if (a.Type == ApproverTypes[0])
                            return true;
                        return UnbudgetedNotifierRoles.find(role => role === a.Role) || a.IsAdditionalNotifier ? true : false;
                    })
                }

                if (!this.isUnbudgeted && !this.isEnergyProject && tempUpdRequest.RequestingGroup) {
                    if ((tempUpdRequest.RequestingGroup == RequestingGroupList.DCOps) || (tempUpdRequest.RequestingGroup == RequestingGroupList.PropOps)) {
                        tempUpdRequest.Approvers = tempUpdRequest.Approvers?.filter(approver => approver.Type === ApproverTypes[0] || approver.IsAdditionalNotifier)
                    }
                }

                if (tempUpdRequest && tempUpdRequest.Budget != 0 && tempUpdRequest.AnnualizedEnergyCostSavings != 0) {
                    tempUpdRequest["ReturnOnInvestment"] = Math.round((tempUpdRequest.AnnualizedEnergyCostSavings / tempUpdRequest.Budget) * 100);
                    tempUpdRequest["PaybackPeriod"] = Math.round((tempUpdRequest.Budget / tempUpdRequest.AnnualizedEnergyCostSavings) * 12);
                }
                else {
                    tempUpdRequest["ReturnOnInvestment"] = 0;
                    tempUpdRequest["PaybackPeriod"] = 0;
                }
            }
            else if (field == IUPFields.ROI) {
                var formattedValue = fieldValue.replace(/[^0-9.]/g, '');
                if (formattedValue == "" || formattedValue == undefined) {
                    formattedValue = "0";
                }
                var deformattedValue: number = Number(formattedValue);
                if (deformattedValue == undefined || isNaN(deformattedValue) || deformattedValue > 100)
                    return event.preventDefault();
                fieldValue = deformattedValue;
            }
            else if ((field == IUPFields.EquipmentCapacityPerSize) && !isNaN(fieldValue)) {
                let formattedValue = fieldValue.replace(/[^0-9.]/g, '');
                if (formattedValue == "" || formattedValue == undefined) {
                    formattedValue = "0";
                }
                let deformattedValue: number = Number(formattedValue);
                if (deformattedValue == undefined || isNaN(deformattedValue))
                    return event.preventDefault();
                fieldValue = deformattedValue;
            }
            else if (field == IUPFields.Budget || field == IUPFields.AECostSavings) {
                tempUpdRequest[field] = fieldValue;
                if (field == IUPFields.Budget) {
                    tempUpdRequest.ProjectEstimateUSD = Math.round(tempUpdRequest.Budget * this.exchangeRate);
                }

                if (tempUpdRequest && tempUpdRequest.Budget != 0 && tempUpdRequest.AnnualizedEnergyCostSavings != 0) {
                    tempUpdRequest["ReturnOnInvestment"] = Math.round((tempUpdRequest.AnnualizedEnergyCostSavings / tempUpdRequest.Budget) * 100);
                    tempUpdRequest["PaybackPeriod"] = Math.round((tempUpdRequest.Budget / tempUpdRequest.AnnualizedEnergyCostSavings) * 12);
                }
                else {
                    tempUpdRequest["ReturnOnInvestment"] = 0;
                    tempUpdRequest["PaybackPeriod"] = 0;
                }
            }
            else if (field == IUPFields.UPSFailedBatteries || field == IUPFields.UPSUnits || field == IUPFields.UPSBatteryStringUPS || field == IUPFields.UPSBatteriesString) {
                fieldValue = isNaN(fieldValue) ? tempUpdRequest[field] : Number(fieldValue);
            }

            this.setState({
                ...this.state,
                canSubmit: this.iupYears.length > 0 ? this.iupYears.some(y => tempUpdRequest.ProjectEstimateStartDate && y.Year == Number(tempUpdRequest.ProjectEstimateStartDate.split("-")[1]) && ((!tempUpdRequest.IsUnbudgeted && y.CanSubmit) || (tempUpdRequest.IsUnbudgeted && y.CanSubmitUnbudget))) : false,
                updatedRequest: { ...tempUpdRequest, [field]: field == IUPFields.Title ? (fieldValue as string).trimStart() : fieldValue },
                isValuesChanged: true,
                isTitleTyping: field == IUPFields.Title
            });
        }
    }

    //Start of SustainableProject Document Attachments File Upload Handlers

    public async UploadFilesHandler(files: FileList, index: number, type: string, fileuploaderIdentifier: string, impactId: number) {
        let existingFiles: IUPImpactAttachment[] = !!this.state.Sustainability[`${type}`][index].Attachments ? [...this.state.Sustainability[`${type}`][index].Attachments] : [];

        let existingFilesSize = existingFiles.map((file) => file["size"]).reduce((prev, curr) => prev + curr, 0);
        if (!(existingFilesSize))
            existingFilesSize = 0;

        let newFilesSize: number = 0;
        let isEmpty: boolean, isDuplicate: boolean, isMoreSize: boolean, isNotallow: boolean, isSAPSpecialcharError: boolean;

        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                let fileType = files[i].name.replace(/^.*\./, "").toLowerCase();
                if (files[i].name.indexOf(',') > -1) {
                    if (!isSAPSpecialcharError) {
                        NotificationManager.error("File name shouldn't contain special characters", '', 3000);
                    }
                    isSAPSpecialcharError = true;
                    continue;
                }
                if (fileType != null && fileExtentions.indexOf(fileType) > -1) {
                    let fileName = files[i].name;
                    if (files[i].size == 0) {
                        if (!isEmpty) {
                            NotificationManager.error('File should not be empty', '', 3000);
                        }
                        isEmpty = true;
                        continue;
                    }
                    else if (existingFiles.filter(file => !!file.IsActive && (file.DecodedName == fileName || file.Name == files[i].name)).length == 0) {
                        newFilesSize += files[i].size;
                        if ((existingFilesSize as number) + newFilesSize > FileMaxLimit) {
                            if (!isMoreSize) {
                                NotificationManager.error('The attachment size exceeded the allowable size of 14MB', '', 5000);
                            }
                            isMoreSize = true;
                        }
                        else {
                            let loadedFile = await this.blobToBase64IUPImpact(files[i]);
                            loadedFile.DecodedName = `_${fileName}_${loadedFile.Name}`;
                            loadedFile.IsActive = true;
                            loadedFile.IsUploaded = false;
                            loadedFile.ImpactId = impactId;
                            existingFiles.push(loadedFile);
                        }
                    }
                    else {
                        if (!isDuplicate) {
                            NotificationManager.error('File already exist', '', 3000);
                        }

                        isDuplicate = true;
                        continue;
                    }
                }
                else {
                    if (!isNotallow) {
                        NotificationManager.error('Add Attachments supports xls, xlsx, doc, docx, pdf, ppt, pptx, msg, eml files only', '', 4000);
                    }
                    isNotallow = true;
                    continue;
                }
            }
        } else {
            if (existingFiles.length <= 0)
                existingFiles = [];
        }
        let sustainability = { ...this.state.Sustainability };
        let impact = sustainability[`${type}`][index];
        impact.Attachments = existingFiles;
        this.setState({
            Sustainability: sustainability,
            isValuesChanged: true,
        });
        let fileUploader: any = document.getElementById(`${fileuploaderIdentifier}${index}`);
        !!fileUploader ? (fileUploader.value = null) : "";
    }

    //End of Sustainable Project Document Attachments File Upload Handlers

    onChangeSustainability = (event: any, field: string, type: string, id: number) => {
        this.setState({ isValuesChanged: true });
        let sustainability: ISustainability = { ...this.state.Sustainability };
        let impact: IImpact = sustainability[type][id];
        let fieldValue: any;

        if (!!impact) {
            switch (field) {
                case "checkbox":
                    impact.Applicable = !impact.Applicable
                    if (!impact.Applicable) {
                        impact.Attachments.map((_) => _.IsActive = false);
                        impact.Amount = 0;
                        impact.SelectedUnit = '';
                    }
                    break;
                case "unit":
                    impact.SelectedUnit = event;
                    break;
                case "amount":
                    if (Number.isNaN(event.target.value)) { return event.preventDefault() };
                    var formattedValue = event.target.value.replace(/[^0-9.]/g, '');
                    if (formattedValue == "" || formattedValue == undefined) {
                        formattedValue = "0";
                    }
                    var deformattedValue: number = Number(formattedValue);
                    if (deformattedValue == undefined || isNaN(deformattedValue))
                        return event.preventDefault();
                    formattedValue = deformattedValue;
                    fieldValue = formattedValue;
                    {
                        if (impact != null) {
                            var regex = /^[0-9]+$/;
                            if (event.target.value.match(regex) || event.target.value === "")
                                impact.Amount = fieldValue;
                            break;
                        }
                    }
                default:
                    break;
            }
        }
    }


    onChangeDropDown = (value: any, field: string) => {
        let tempUpdRequest: ICapitalRequest = this.state.updatedRequest;
        let IsriskProfilePopup = this.state.IsriskProfilePopup;
        switch (field) {
            case IUPFields.Region:
                tempUpdRequest = this.onChangeRegion(tempUpdRequest, value);
                this.isEuropeRequest = value == Regions.Europe;
                break;

            case IUPFields.Country:
                if (value != tempUpdRequest.Country) {
                    let properties = this.properties.filter(r => r.Country == value);
                    tempUpdRequest = this.onChangePrimaryField(tempUpdRequest, properties);
                    tempUpdRequest.Market = undefined;
                    tempUpdRequest.Region = (tempUpdRequest.Region != undefined && tempUpdRequest.Region != null && tempUpdRequest.Region != "") ? tempUpdRequest.Region : properties && properties.length > 0 ? properties[0].Region : undefined;
                    properties = properties.filter(r => r.Region == tempUpdRequest.Region);
                    let propertyValues = this.properties.filter(r => r.Region == tempUpdRequest.Region);
                    this.marketSelectOptions = this.getSelectOptions(properties, "Market", "Market");
                    this.countrySelectOptions = this.getSelectOptions(propertyValues, "Country", "Country");
                    this.sortArray(this.marketSelectOptions);
                    this.isEuropeRequest = tempUpdRequest.Region == Regions.Europe;
                }
                break;

            case IUPFields.Market:
                if (value != tempUpdRequest.Market) {
                    let properties = this.properties.filter(r => r.Market == value);
                    tempUpdRequest = this.onChangePrimaryField(tempUpdRequest, properties);
                    tempUpdRequest.Country = properties && !!properties.length ? properties[0].Country : undefined;
                    tempUpdRequest.Market = properties && !!properties.length ? properties[0].Market : undefined;
                    tempUpdRequest.Region = properties && properties.length > 0 ? properties[0].Region : undefined;
                    let propertyValues = this.properties.filter(r => r.Region == tempUpdRequest.Region);
                    this.countrySelectOptions = this.getSelectOptions(propertyValues, "Country", "Country");
                    this.isEuropeRequest = tempUpdRequest.Region == Regions.Europe;
                }
                break;

            case IUPFields.SiteCode:
            case IUPFields.PCode:
            case IUPFields.PropertyAddress:
                tempUpdRequest = this.onSiteDetailChange(field, value);
                tempUpdRequest.ProjectEstimateUSD = Math.round(tempUpdRequest.Budget * this.exchangeRate);
                this.updateNotifiers = true;
                this.isEuropeRequest = tempUpdRequest.Region == Regions.Europe;
                let propertyValues = this.properties.filter(r => r.Region == tempUpdRequest.Region);
                this.marketSelectOptions = this.getSelectOptions(propertyValues, "Market", "Market");
                this.countrySelectOptions = this.getSelectOptions(propertyValues, "Country", "Country");
                if (this.isEuropeRequest)
                    this.projectTypeOptions = this.getSelectOptions(this.projectTypes, "ProjectType", "ProjectType");

                tempUpdRequest = this.updateApprovers(tempUpdRequest);
                break;

            case IUPFields.RequestingGroup:
                tempUpdRequest[field] = value;
                this.selectedProjectType = [] as IProjectType
                this.getProjectTypesByRequestingGroupSelected(value);
                if (this.projectTypeOptions.length == 1) {
                    this.isCostType = true;
                    let selectedProjectTypes = this.projectTypes?.filter(r => r.ProjectType == this.projectTypeOptions[0].value);
                    this.selectedProjectType = selectedProjectTypes[0];
                    this.selectedCostType = this.selectedProjectType.CostType;
                    tempUpdRequest = Object.assign(this.state.updatedRequest, {
                        ProjectType: this.selectedProjectType == undefined ? undefined : this.selectedProjectType.ProjectType,
                        GLAccount: this.selectedProjectType == undefined ? undefined : this.projectTypes.map(_ => _.GLCode).find(_ => _ == this.state.updatedRequest.GLAccount) ? this.selectedProjectType.GLCode : undefined,
                        RequestingGroup: this.selectedProjectType == undefined ? undefined : this.selectedProjectType.MappedToGroup,
                        EnergySavingsType: this.selectedProjectType != undefined && this.selectedProjectType.MappedToGroup && this.selectedProjectType.MappedToGroup.toLowerCase().indexOf("energy") >= 0 ? 1 : this.state.updatedRequest.EnergySavingsType,
                        CostType: this.selectedProjectType == undefined ? undefined : this.selectedProjectType.CostType
                    });
                    this.updateNotifiers = true;
                    this.onProjectTypeChange(this.selectedProjectType.ProjectType);
                    tempUpdRequest = this.updateApprovers(tempUpdRequest);
                } else {
                    this.selectedCostType = '';
                    tempUpdRequest = Object.assign(this.state.updatedRequest, {
                        ProjectType: !!this.selectedProjectType && this.selectedProjectType.MappedToGroup != value ? undefined : this.selectedProjectType.ProjectType,
                        GLAccount: undefined,
                        CostType: undefined,
                        RequestingGroup: value,
                        EnergySavingsType: 1
                    });
                    this.onProjectTypeChange(tempUpdRequest.ProjectType);
                    tempUpdRequest = this.updateApprovers(tempUpdRequest);
                }

                tempUpdRequest.RiskProfile1 = '';
                tempUpdRequest.RiskProfile2 = '';
                tempUpdRequest.RiskProfile = '';
                this.riskProfile = '';
                IsriskProfilePopup = false;
                break;

            case IUPFields.ProjectType:
                let selectedProjectTypes = this.projectTypes?.filter(r => r.ProjectType === value);
                this.selectedProjectType = selectedProjectTypes[0];

                tempUpdRequest = Object.assign(this.state.updatedRequest, {
                    GLAccount: this.selectedProjectType == undefined ? undefined : this.selectedProjectType.GLCode,
                    CostType: undefined,
                    RequestingGroup: this.selectedProjectType == undefined ? undefined : this.selectedProjectType.MappedToGroup,
                    EnergySavingsType: this.selectedProjectType != undefined && this.selectedProjectType.MappedToGroup && this.selectedProjectType.MappedToGroup.toLowerCase().indexOf("energy") >= 0 ? 1 : this.state.updatedRequest.EnergySavingsType
                });

                this.onProjectTypeChange(value);
                tempUpdRequest.RiskProfile1 = '';
                tempUpdRequest.RiskProfile2 = '';
                tempUpdRequest.RiskProfile = '';
                this.riskProfile = '';
                IsriskProfilePopup = false;
                this.updateNotifiers = true;
                tempUpdRequest = this.updateApprovers(tempUpdRequest);
                break;

            case IUPFields.RiskProfile1:
            case IUPFields.RiskProfile2:
                tempUpdRequest[field] = value;
                if (tempUpdRequest.RiskProfile1 && tempUpdRequest.RiskProfile2) {
                    this.isRiskProfileProject = true;
                    let profileindex = RiskProfileCombs.findIndex(_ => _.R1 == tempUpdRequest.RiskProfile1 && _.R2 == tempUpdRequest.RiskProfile2);
                    this.riskProfile = profileindex > -1 ? RiskProfileCombs[profileindex].Value : '';
                    IsriskProfilePopup = false;
                }
                break;

            case IUPFields.ProjectManagement:
                this.isPrjManagementByOthers = value == "Yes";
                if (!this.isPrjManagementByOthers)
                    tempUpdRequest = Object.assign(this.state.updatedRequest, { ProjectManagementCost: 0 });
                break;

            case IUPFields.StartMonth:
            case IUPFields.StartYear:
            case IUPFields.EndMonth:
            case IUPFields.EndYear:
                this[field] = Number(value);

                if (field == IUPFields.EndYear.toString() || field == IUPFields.StartYear.toString()) {
                    this.startYear = Number(value);
                    this.endYear = Number(value);
                    let isUnbudgetSelect = new Date().getFullYear() == Number(value);
                    if (this.isUnbudgeted != isUnbudgetSelect) {
                        this.projectCost = new Date().getFullYear() == Number(value) ? this.state.updatedRequest.Budget : this.projectCost;

                        tempUpdRequest = Object.assign(this.state.updatedRequest, {
                            Budget: new Date().getFullYear() != Number(value) ? this.projectCost : 0,
                            ProjectEstimateUSD: Math.round((this.projectCost ? this.projectCost : 0) * this.exchangeRate),
                            BudgetYear: (this.endYear > 0 ? this.endYear : this.defaultBudgetYear),
                            IsUnbudgeted: isUnbudgetSelect,
                        });
                        this.isUnbudgeted = isUnbudgetSelect;
                        this.updateNotifiers = true;
                        tempUpdRequest = this.updateApprovers(tempUpdRequest);

                        if (this.isUnbudgeted) {
                            tempUpdRequest.Approvers = tempUpdRequest.Approvers?.filter(a => {
                                if (a.Type == ApproverTypes[0])
                                    return true;
                                return UnbudgetedNotifierRoles.find(role => role === a.Role) || a.IsAdditionalNotifier ? true : false;
                            })
                        }

                        if (!this.isUnbudgeted && !this.isEnergyProject && tempUpdRequest.RequestingGroup) {
                            if ((tempUpdRequest.RequestingGroup == RequestingGroupList.DCOps) || (tempUpdRequest.RequestingGroup == RequestingGroupList.PropOps)) {
                                tempUpdRequest.Approvers = tempUpdRequest.Approvers?.filter(approver => approver.Type === ApproverTypes[0] || approver.IsAdditionalNotifier)
                            }
                        }

                        if (tempUpdRequest && tempUpdRequest.Budget != 0 && tempUpdRequest.AnnualizedEnergyCostSavings != 0) {
                            tempUpdRequest["ReturnOnInvestment"] = Math.round((tempUpdRequest.AnnualizedEnergyCostSavings / tempUpdRequest.Budget) * 100);
                            tempUpdRequest["PaybackPeriod"] = Math.round((tempUpdRequest.Budget / tempUpdRequest.AnnualizedEnergyCostSavings) * 12);
                        }
                        else {
                            tempUpdRequest["ReturnOnInvestment"] = 0;
                            tempUpdRequest["PaybackPeriod"] = 0;
                        }
                    }
                }

                tempUpdRequest.ProjectEstimateStartDate = `${this.startMonth}-${this.startYear}`;
                tempUpdRequest.ProjectEstimateEndDate = `${this.endMonth}-${this.endYear}`;
                tempUpdRequest.BudgetYear = (field == IUPFields.EndYear.toString() || field == IUPFields.StartYear.toString()) ? this.endYear : this.state.updatedRequest.BudgetYear;

                break;

            case IUPFields.MarketType:
            case IUPFields.EnergySavingsType:
                tempUpdRequest[field] = value;
                break;

            case IUPFields.ProjectTypeCategoryMapping:
                tempUpdRequest.ProjectCategory = this.selectedProjectType && this.selectedProjectType.ProjectTypeModel == undefined ? "" : `${this.selectedProjectType.ProjectTypeModel} - ${value}`;
                tempUpdRequest[field] = value;
                break;

            case IUPFields.ReturnNewLevel:
                tempUpdRequest.ReturnNewLevel = value;
                break;
        }

        this.setState({
            ...this.state,
            IsriskProfilePopup: IsriskProfilePopup,
            updatedRequest: { ...tempUpdRequest, [field]: value },
            isValuesChanged: true,
            IsReturnLevelEmpty: !this.state.updatedRequest.IsUnbudgeted && (this.state.updatedRequest.RequestingGroup == RequestingGroupList.DCOps || this.state.updatedRequest.RequestingGroup == RequestingGroupList.PropOps || this.state.updatedRequest.Region == Regions.Europe) && !(this.state.updatedRequest.ReturnNewLevel >= 0)
        });
    }

    onChangeRichText = (value: any, field: string) => {
        let tempUpdRequest: ICapitalRequest = this.state.updatedRequest;
        this.setState({
            ...this.state,
            updatedRequest: { ...tempUpdRequest, [field]: value },
            isValuesChanged: true
        });
    }

    onChangeTab = (tab: string) => {
        if (this.state.activeTab != tab) {
            if (tab == "Approvers" && this.state.isEdit) {
                this.setState({
                    updatedRequest: { ...this.state.updatedRequest, AllocatedProjects: this.allocatedProjects },
                    activeTab: tab
                });
            }
            else {
                this.setState({
                    activeTab: tab
                });
            }
        }
    }

    toggleShowDeletePopup = () => {
        this.setState({ showDeletePopup: !this.state.showDeletePopup });
    }

    toggleShowMovetoPlanningPopup = () => {
        this.setState({ showMoveToPlanningPopup: !this.state.showMoveToPlanningPopup });
    }

    toggleShowReturnPopup = () => {
        this.Comments = "";
        this.setState({
            showReturnPopup: !this.state.showReturnPopup,
            updatedRequest: { ...this.state.updatedRequest, ReturnNewLevel: undefined }
        });
    }

    getCurrencyInfoHelpText = () => {
        let currencyRows = "";
        this.currencies.filter(_ => !_.IsDefault).forEach((currency: ICurrency) => {
            try {
                currencyRows += `<tr><td><p><b>${currency.Symbol}1 ${currency.Currency}</b> = ${this.defaultCurrency.Symbol}${currency.ExchangeRate} ${this.defaultCurrency.Currency}</p></td></tr>`;
            }
            catch { }
        });
        return `<div class='year-plus1-budget-tooltip i-width budget-tooltip-format'>
                                <table class='budget-format'><tbody>
                                    <tr class='first-row'><td><p>The USD amount is based on currency exchange rates provided by Finance (see below), but are subject to change.</p></td></tr>
                                    ${currencyRows}
                                </tbody></table>
                </div>`;
    }

    public returnProject(actionType: string) {
        this.validateError("IsCommentsEmpty", "comments");
        this.setState({
            IsReturnLevelEmpty: !this.state.updatedRequest.IsUnbudgeted && (this.state.updatedRequest.RequestingGroup == RequestingGroupList.DCOps || this.state.updatedRequest.RequestingGroup == RequestingGroupList.PropOps || this.state.updatedRequest.Region == Regions.Europe) && !(this.state.updatedRequest.ReturnNewLevel >= 0)
        });
        if (this.Comments.trim() != "" && (!this.state.updatedRequest.IsUnbudgeted && (this.state.updatedRequest.RequestingGroup == RequestingGroupList.DCOps || this.state.updatedRequest.RequestingGroup == RequestingGroupList.PropOps || this.state.updatedRequest.Region == Regions.Europe) ? this.state.updatedRequest.ReturnNewLevel >= 0 : true)) {
            this.approveOrReturnProject(actionType);
        }
    }

    public validateError = (stateVar: string, htmlElement: string) => {
        let editElement = document.getElementById(htmlElement) as HTMLTextAreaElement;
        this.setState({
            ...this.state,
            [stateVar]: (editElement != null && editElement != undefined && editElement.value == "")
        });
        this.Comments = editElement != null && editElement != undefined && editElement.value != "" ? editElement.value : "";
    }

    getProjectTypesByRequestingGroupSelected(requestingGrp: string) {
        let projectTypes = this.projectTypes?.filter(r => r.MappedToGroup == requestingGrp);
        this.projectTypeOptions = this.getSelectOptions(projectTypes, "ProjectType", "ProjectType");
    }

    onSiteChanged = (event: any) => {
        var tempUpdRequest: ICapitalRequest = this.state.updatedRequest;
        if (event.currentTarget.value == "PUE") {
            tempUpdRequest["PUE"] = true;
            tempUpdRequest["NOI"] = false;
        }
        else if (event.currentTarget.value == "NOI") {
            tempUpdRequest["NOI"] = true;
            tempUpdRequest["PUE"] = false;
        }
        else {
            tempUpdRequest["PUE"] = false;
            tempUpdRequest["NOI"] = false;
        }
        this.setState({
            ...this.state,
            updatedRequest: { ...tempUpdRequest },
            isValuesChanged: true,
        });
    }

    render() {
        const { isEdit, updatedRequest, isError, isTitleTyping, isSaveError, isColoUser, canSubmit } = this.state;
        let iscurrentApprover = updatedRequest.Approvers.filter(_ => _.Level == updatedRequest.CurrentLevel && !!this.currentUserEmail && !!_.Email && _.Email == this.currentUserEmail).length > 0
        return (
            <React.Fragment>
                <IUPTopNavigation />
                {
                    this.state.isUserHasPermission ?
                        <div className="request-page flex-container">
                            <div className="tabs-section flex-container">
                                <div className="tabs-header">
                                    <div className="col-4 tabs">
                                        <div className={`tab pb-2 pt-2 pr-3 mr-2 ${this.state.activeTab == 'Property Info' ? 'active-tab' : 'inactive-tab'}`} onClick={e => this.onChangeTab("Property Info")} >Project Information</div>
                                        <div className={`tab pb-2 pt-2 pl-2 pr-2 pr-3 ${this.state.activeTab == 'Approvers' ? 'active-tab' : 'inactive-tab'}`} onClick={e => this.onChangeTab("Approvers")}>Approval Workflow/Status</div>
                                    </div>
                                    <div className="col-8 flex-row-reverse p-0 pt-2 cta-section">
                                        <RequestCTASectionComponent isUnbudgeted={this.isUnbudgeted} canSubmit={canSubmit} history={this.props.history} sltUsers={this.managementApprovers} currentUser={this.currentUserEmail} currentTab={this.state.activeTab} isView={!isEdit}
                                            isColoUser={isColoUser} request={updatedRequest} onAction={this.onCTA.bind(this)} filters={this.props.filters} isValuesChanged={this.state.isValuesChanged} isAdmin={this.state.isAdmin} isEuropeAdmin={this.state.isEuropeAdmin} />
                                    </div>
                                </div>
                                <div className="tab-container">
                                    {
                                        this.state.showLoader && <Loader />
                                    }
                                    {
                                        !this.state.showLoader &&
                                        <React.Fragment>
                                            {
                                                this.state.activeTab == "Property Info" &&
                                                <div className="iup-request-form">
                                                    {updatedRequest.RequestID > 0 &&
                                                        <div className="request-head">
                                                            <div className="pr-3 pl-3 request-Id">Request ID: {updatedRequest.RequestID}</div>
                                                            <div className="mb-1 pr-3 pl-3 request-status">Status:
                                                                <span className="ml-1">{!updatedRequest.IsActive ?
                                                                    ((updatedRequest.RequestStatus == Status.Planning || (updatedRequest.RequestStatus == Status.ApprovalPending && (updatedRequest.CurrentApproverRole == EmployeeRoles.REM || updatedRequest.CurrentApproverRole == EmployeeRoles.DCM))) ? IUPStatus.Deleted : IUPStatus.NotApproved)
                                                                    : (updatedRequest.RequestStatus && (updatedRequest.RequestStatus == IUPStatus.Draft || updatedRequest.RequestStatus == IUPStatus.Planning || updatedRequest.RequestStatus == IUPStatus.Approved || updatedRequest.RequestStatus == IUPStatus.Deferred || updatedRequest.RequestStatus == IUPStatus.RMProject) ? updatedRequest.RequestStatus : (iscurrentApprover ? IUPStatus.AwaitingApproval.toString() : IUPStatus.ApprovalPending.toString()))}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    }
                                                    <div className="row mb-3">
                                                        <div className="dropdown-group col-2">
                                                            <label>
                                                                {IUPFieldLabels.Region}
                                                                {isEdit && <span className="required-field ml-1">*</span>}
                                                            </label>
                                                            <DLRSelct options={this.sortArray(this.regionSelectOptions)} selected={updatedRequest.Region} toggleOption={this.onChangeDropDown} fieldName={IUPFields.Region} placeholder={IUPFieldLabels.Region} disabled={(!isEdit || this.checkifStatusIsInProgress(updatedRequest.RequestStatus))} class={`${((isError) && !(updatedRequest.Region && updatedRequest.Region.length > 0)) ? "show-error" : ""}`} />
                                                        </div>
                                                        <div className="dropdown-group col-2">
                                                            <label>
                                                                {IUPFieldLabels.Country}
                                                                {isEdit && <span className="required-field ml-1">*</span>}
                                                            </label>
                                                            <DLRSelct options={this.sortArray(this.countrySelectOptions)} selected={updatedRequest.Country} toggleOption={this.onChangeDropDown} fieldName={IUPFields.Country} placeholder={IUPFieldLabels.Country} disabled={(!isEdit || this.checkifStatusIsInProgress(updatedRequest.RequestStatus))} class={`${((isError) && !(updatedRequest.Country && updatedRequest.Country.length > 0)) ? "show-error" : ""}`} />
                                                        </div>
                                                        <div className="dropdown-group col-2">
                                                            <label>
                                                                {IUPFieldLabels.Market}
                                                                {isEdit && <span className="required-field ml-1">*</span>}
                                                            </label>
                                                            <DLRSelct options={this.sortArray(this.marketSelectOptions)} selected={updatedRequest.Market} toggleOption={this.onChangeDropDown} fieldName={IUPFields.Market} placeholder={IUPFieldLabels.Market} disabled={(!isEdit || this.checkifStatusIsInProgress(updatedRequest.RequestStatus))} class={`${((isError) && !(updatedRequest.Market && updatedRequest.Market.length > 0)) ? "show-error" : ""}`} />
                                                        </div>
                                                        <div className="dropdown-group col-2">
                                                            <label>
                                                                {IUPFieldLabels.AirportCode}
                                                                {isEdit && <span className="required-field ml-1">*</span>}
                                                            </label>
                                                            <DLRSelct options={this.sortArray(this.siteCodeSelectOptions)} selected={updatedRequest.AirportCode} toggleOption={this.onChangeDropDown} fieldName={IUPFields.SiteCode} placeholder={IUPFieldLabels.AirportCode} disabled={(!isEdit || this.checkifStatusIsInProgress(updatedRequest.RequestStatus))} class={`${((isError) && !(updatedRequest.AirportCode && updatedRequest.AirportCode.length > 0)) ? "show-error" : ""}`} />
                                                        </div>
                                                        <div className="dropdown-group col-2">
                                                            <label >
                                                                {IUPFieldLabels.pCode}
                                                                {isEdit && <span className="required-field ml-1">*</span>}
                                                            </label>
                                                            <DLRSelct options={this.sortArray(this.pCodeSelectOptions)} selected={updatedRequest.PCode} toggleOption={this.onChangeDropDown} fieldName={IUPFields.PCode} placeholder={IUPFieldLabels.pCode} disabled={(!isEdit || this.checkifStatusIsInProgress(updatedRequest.RequestStatus))} class={`${(isError && !(updatedRequest.PCode && updatedRequest.PCode.length > 0)) ? "show-error" : ""}`} />
                                                        </div>
                                                        <div className="dropdown-group col-2">
                                                            <label >
                                                                {IUPFieldLabels.propertyAddress}
                                                                {isEdit && <span className="required-field  ml-1">*</span>}
                                                            </label>
                                                            <DLRSelct options={this.sortArray(this.siteAddressSelectOptions)} selected={updatedRequest.PropertyAddress} toggleOption={this.onChangeDropDown} fieldName={IUPFields.PropertyAddress} placeholder={IUPFieldLabels.propertyAddress} disabled={(!isEdit || this.checkifStatusIsInProgress(updatedRequest.RequestStatus))} class={`${(isError && !(updatedRequest.PropertyAddress && updatedRequest.PropertyAddress.length > 0)) ? "show-error" : ""}`} />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="text-group col-4 mb-0">
                                                            <label className="control-label">
                                                                {IUPFieldLabels.Title}
                                                                {isEdit && <span className="required-field  ml-1">*</span>}
                                                                {
                                                                    isEdit && <small className="font-x-small"> (Project Title can't exceed 75 characters)</small>
                                                                }
                                                            </label>
                                                            <TextBoxComponent id="projectTitle" className={`${((isError || isSaveError) && !(updatedRequest.ProjectTitle && updatedRequest.ProjectTitle.trim().length > 0 && updatedRequest.ProjectTitle.trim().length <= this.titleMaxLength)) ? "show-error" : ""} text-control input-sm pl-2 pr-2`} fieldName={IUPFields.Title} placeHolder={IUPFieldLabels.Title} value={updatedRequest.ProjectTitle}
                                                                onChange={this.onChangeField} isRead={!isEdit as boolean} onBlur={this.onBlurField} />
                                                            {isTitleTyping && updatedRequest.ProjectTitle && updatedRequest.ProjectTitle.length > 0 && isEdit && <small className="required-field">{(this.titleMaxLength - updatedRequest.ProjectTitle.length) + " characters remaining"}</small>}
                                                        </div>
                                                        <div className="currency-group col-2">
                                                            <label>
                                                                Budget {<React.Fragment> {isEdit && <span className="required-field">*</span>}
                                                                    <CallOut id="budgetTooltip"
                                                                        helpText={BudgetTooltip} helptextClass="reports-tooltip budget-tooltip" />
                                                                </React.Fragment>
                                                                }
                                                            </label>
                                                            <CurrencyComponent showCurrency={true} isInput={true as boolean} disabled={updatedRequest.IsUnbudgeted || !isEdit || (!!updatedRequest.CurrentApproverRole && updatedRequest.CurrentApproverRole != EmployeeRoles.RMDCOps && updatedRequest.CurrentApproverRole != EmployeeRoles.RMPropOps)} key="convertedBudget" name={IUPFields.Budget} value={updatedRequest.IsUnbudgeted ? 0 : updatedRequest.Budget}
                                                                currency={updatedRequest.LocalCurrency} onChange={this.onChangeField} onBlur={() => { return false; }} className={`${(isError && !updatedRequest.IsUnbudgeted && !updatedRequest.Budget) ? "show-error" : ""}`} defaultCurrency={this.defaultCurrency.Currency}
                                                            />
                                                        </div>
                                                        <div className="col-1 pr-0 m-0">
                                                            <label className="control-label">
                                                                {IUPFieldLabels.StartMonth}{isEdit && <span className="required-field">*</span>}
                                                            </label>
                                                            {!isEdit ? <div className={`p-2 disable-input disabled-height ${(!isEdit && isError && (this.startMonth == 0 || this.startYear == 0)) ? 'show-error' : ''}`}>{updatedRequest.ProjectEstimateStartDate}</div> :
                                                                <div className="dropdown-group col-12 p-0">
                                                                    <div className="dropdown-group col-12 p-0">
                                                                        <DLRSelct options={MonthOptions} selected={isEdit ? this.startMonth : this._Utility.getMonthFormat(this.startMonth)} toggleOption={this.onChangeDropDown} fieldName={IUPFields.StartMonth} placeholder={IUPFieldLabels.StartMonth} disabled={!isEdit || this.canDisableField(updatedRequest.RequestStatus)} class={`${(isError && !this.startMonth) ? "show-error" : ""}`} />
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="col-1">
                                                            <label className="m-0 control-label">
                                                                {IUPFieldLabels.EndMonth}{isEdit && <span className="required-field">*</span>}
                                                            </label>
                                                            {!isEdit ? <div className={`p-2 disable-input disabled-height ${(!isEdit && isError && (this.endMonth == 0 || this.endYear == 0)) ? 'show-error' : ''}`}>{updatedRequest.ProjectEstimateEndDate}</div> :
                                                                <div className="row col-12 p-0 m-0">
                                                                    <div className="dropdown-group col-12 p-0">
                                                                        <DLRSelct options={MonthOptions} selected={isEdit ? this.endMonth : this._Utility.getMonthFormat(this.endMonth)} toggleOption={this.onChangeDropDown} fieldName={IUPFields.EndMonth} placeholder={IUPFieldLabels.EndMonth} disabled={!isEdit || this.canDisableField(updatedRequest.RequestStatus)} class={`${(isError && !this.endMonth) ? "show-error" : ""}`} />
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div className="col-1 pr-0 m-0 ">
                                                            <label className="control-label">
                                                                {IUPFieldLabels.Year}{isEdit && <span className="required-field">*</span>}
                                                            </label>
                                                            <div className="row col-12 p-0 m-0">
                                                                <div className="dropdown-group col-12 p-0">
                                                                    <DLRSelct options={this.yearSelectOptions} selected={this.startYear} toggleOption={this.onChangeDropDown} fieldName={IUPFields.StartYear} placeholder={IUPFieldLabels.StartYear} disabled={!isEdit || this.canDisableField(updatedRequest.RequestStatus)} class={`${(isError && !this.startYear) ? "show-error" : ""}`} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-1"></div>
                                                        <div className="form-group col-2">
                                                            <label className="m-0 control-label">{IUPFieldLabels.GLCode}</label>
                                                            <div className="p-2 disable-input disabled-height">{updatedRequest.GLAccount}</div>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-3">
                                                        <div className="dropdown-group col-2">
                                                            <label>
                                                                {IUPFieldLabels.RequestingGroup}
                                                                {isEdit && <span className="required-field">*</span>}
                                                            </label>
                                                            <DLRSelct options={this.requestingGroupOptions} selected={updatedRequest.RequestingGroup} toggleOption={this.onChangeDropDown} fieldName={IUPFields.RequestingGroup} placeholder={IUPFieldLabels.RequestingGroup} disabled={(!isEdit || this.checkifStatusIsInProgress(updatedRequest.RequestStatus)) || this.isEuropeRequest} class={`${((isError) && !(updatedRequest.RequestingGroup && updatedRequest.RequestingGroup.length > 0)) ? "show-error" : ""}`} />
                                                        </div>
                                                        <div className="dropdown-group col-2">
                                                            <label >
                                                                {IUPFieldLabels.ProjectType}{isEdit && <span className="required-field">*</span>}
                                                                {<React.Fragment>
                                                                    <CallOut id="ptypeTooltip"
                                                                        helpText={ProjectTypeToolTip} helptextClass="reports-tooltip project-type-tooltip" />
                                                                </React.Fragment>
                                                                }
                                                            </label>
                                                            <DLRSelct options={this.sortArray(this.projectTypeOptions)} selected={updatedRequest.ProjectType ? updatedRequest.ProjectType : ''} toggleOption={this.onChangeDropDown} fieldName={IUPFields.ProjectType} placeholder={IUPFieldLabels.ProjectType} disabled={!isEdit} class={`${((isError) && ((!updatedRequest.ProjectType || (updatedRequest.ProjectType && !updatedRequest.ProjectType.length) || (this.projectTypes.findIndex(_ => _.ProjectType == updatedRequest.ProjectType) == -1)))) ? "show-error" : ""}`} />
                                                        </div>
                                                        <div className="dropdown-group col-2">
                                                            <label>
                                                                {IUPFieldLabels.RiskProfile}
                                                                {isEdit && !!this.isRiskProfileProject && <span className="required-field">*</span>}
                                                            </label>
                                                            <button className={`btn col-12 row risk-profilebtn m-0 p-0 ${!this.riskProfile ? 'border' : ''} ${!this.isRiskProfileProject || !isEdit ? 'button-disable' : ''} ${(!!isError && !!this.isRiskProfileProject && (!updatedRequest.RiskProfile1 || !updatedRequest.RiskProfile2)) ? 'show-error' : ''}`} onClick={() => isEdit && this.setState({ IsriskProfilePopup: !this.state.IsriskProfilePopup })} disabled={!this.isRiskProfileProject}>
                                                                <div className={`risk-profile-label text-center ${this.riskProfile == RiskProfile.High ? 'risk-profile-danger' : this.riskProfile == RiskProfile.Medium ? 'risk-profile-warning' : this.riskProfile == RiskProfile.Low ? 'risk-profile-success' : ''}`}>
                                                                    {!!this.riskProfile ? this.riskProfile : 'Risk Profile'}
                                                                </div>
                                                            </button>
                                                            {(!!this.state.IsriskProfilePopup) && <div className="risk-profile mt-3">
                                                                <div className="row cancel-icon m-0">
                                                                    <i title="Cancel" className="font-size-20 ms-Icon ms-Icon--ChromeClose cursor-pointer" onClick={() => this.setState({ IsriskProfilePopup: false })}></i>
                                                                </div>
                                                                <div className="row m-0 mb-3 mt-1">
                                                                    <span className="col-9 question">{updatedRequest.RequestingGroup == RequestingGroupList.PropOps ? RiskProfileQuestions.PropOps.Question1 : RiskProfileQuestions.DCOps.Question1}</span>
                                                                    <div className="col-3 pl-0" title={updatedRequest.RiskProfile1 ? updatedRequest.RiskProfile1 : ''}>
                                                                        <DLRSelct options={updatedRequest.RequestingGroup == RequestingGroupList.DCOps ? this.dcOpsOptions : this.propOpsOptions} selected={updatedRequest && updatedRequest.RiskProfile1 ? updatedRequest.RiskProfile1 : ''} toggleOption={this.onChangeDropDown} fieldName={IUPFields.RiskProfile1} placeholder={IUPFields.RiskProfile1} disabled={!isEdit} class={`${(!!isError && !updatedRequest.RiskProfile1) ? "show-error" : ""}`} />
                                                                    </div>
                                                                </div>
                                                                <div className="row m-0 my-2">
                                                                    <span className="col-9 question">{updatedRequest.RequestingGroup == RequestingGroupList.PropOps ? RiskProfileQuestions.PropOps.Question2 : RiskProfileQuestions.DCOps.Question2}</span>
                                                                    <div className="col-3 pl-0" title={updatedRequest.RiskProfile2 ? updatedRequest.RiskProfile2 : ''}>
                                                                        <DLRSelct options={updatedRequest.RequestingGroup == RequestingGroupList.DCOps ? this.dcOpsOptions : this.propOpsOptions} selected={updatedRequest && updatedRequest.RiskProfile2 ? updatedRequest.RiskProfile2 : ''} toggleOption={this.onChangeDropDown} fieldName={IUPFields.RiskProfile2} placeholder={IUPFields.RiskProfile2} disabled={!isEdit} class={`${(!!isError && !updatedRequest.RiskProfile2) ? "show-error" : ""}`} />
                                                                    </div>
                                                                </div>
                                                            </div>}
                                                        </div>
                                                        <div className="dropdown-group col-2">
                                                            <label>
                                                                Energy Savings {isEdit && < span className="required-field">*</span>}
                                                            </label>
                                                            <DLRSelct options={this.energySavingsOptions} selected={updatedRequest.EnergySavingsType} toggleOption={this.onChangeDropDown} fieldName={IUPFields.EnergySavingsType} placeholder={IUPFieldLabels.EnergySavings} disabled={!isEdit} class={`${(isError && (updatedRequest.EnergySavingsType == null || updatedRequest.EnergySavingsType == undefined)) ? "show-error" : ""}`} />
                                                        </div>
                                                    </div>
                                                    {
                                                        (this.state.updatedRequest.IsUnbudgeted) && <UnBudgeted currencies={this.currencies} isRead={(!isEdit) as boolean} isinProgress={(this.checkifStatusIsInProgress(updatedRequest.RequestStatus)) as boolean} exchangeRate={this.exchangeRate} LocalCurrency={updatedRequest.LocalCurrency}
                                                            convertedBudget={this.projectCost} allocatedProjects={...this.allocatedProjects}
                                                            defaultCurrency={this.defaultCurrency} onAddAllocatedProject={this.onAddAllocatedProject}
                                                            onChangeAllocatedProject={this.onChangeAllocatedProject} onChangeBudget={this.onChangeBudget} fundingSource={updatedRequest.FundingSource} unbudgetedFunding={updatedRequest.UnbudgetedFunding} requestingGroup={this.state.updatedRequest.RequestingGroup}
                                                            onChangeFundingSource={this.onChangeFundingSource} isError={this.state.isError} callToAction={this.callToAction} updateIsProjectAdded={this.updateIsProjectAdded} tempAllocatedProject={this.tempAllocatedProject} updateTempAllocatedProject={this.updateTempAllocatedProject} pcode={updatedRequest.PCode}
                                                            country={updatedRequest.Country} budgetYear={updatedRequest.BudgetYear} onGetData={this.handleDataFromChild} handleDeleteProjects={this.handleDeleteProjects} />
                                                    }
                                                    {
                                                        this.isEquipmentProject &&
                                                        <React.Fragment>
                                                            <div className="projecttype row m-0 mb-4 pt-3 pb-3">
                                                                <div className="col-12 row">
                                                                    <h5 className="pl-3 pr-2">Equipment Specification</h5>
                                                                </div>
                                                                <div className="row mb-3 col-12 mt-3">
                                                                    <div className="currency-group col-2">
                                                                        <label >
                                                                            {IUPFieldLabels.Quantity}{isEdit && <span className="required-field">*</span>}
                                                                        </label>
                                                                        <CurrencyComponent disabled={!isEdit} isInput={true} name={IUPFields.QuantityPerUnits} value={!!updatedRequest.QuantityPerUnits ? updatedRequest.QuantityPerUnits : 0}
                                                                            className={`${(isError && !(updatedRequest.QuantityPerUnits && updatedRequest.QuantityPerUnits > 0)) ? "show-error" : ""}`} currency={updatedRequest.LocalCurrency} onChange={this.onChangeField} onBlur={() => { return false; }} defaultCurrency={this.defaultCurrency.Currency}
                                                                        />
                                                                    </div>
                                                                    <div className="text-group col-3">
                                                                        <label >
                                                                            {IUPFieldLabels.EquipmentManufacturer}{isEdit && <span className="required-field">*</span>}
                                                                        </label>
                                                                        <TextBoxComponent id="equipmentManufacturer" fieldName={IUPFields.EquipmentManufacturer} placeHolder={IUPFieldLabels.EquipmentManufacturer} className={`text-control pr-2 pl-2 ${(isError && !(updatedRequest.EquipmentManufacturer && updatedRequest.EquipmentManufacturer.trim().length > 0)) ? "show-error" : ""}`} value={updatedRequest.EquipmentManufacturer}
                                                                            onChange={this.onChangeField} isRead={!isEdit as boolean} />
                                                                    </div>
                                                                    <div className="text-group col-3">
                                                                        <label >
                                                                            {IUPFieldLabels.EquipmentModel}
                                                                        </label>
                                                                        <TextBoxComponent id="equipmentModel" fieldName={IUPFields.EquipmentModel} placeHolder={IUPFieldLabels.EquipmentModel} className="text-control pr-2 pl-2" value={updatedRequest.EquipmentModel}
                                                                            onChange={this.onChangeField} onBlur={() => { return false; }} isRead={!isEdit as boolean} />
                                                                    </div>

                                                                    <div className="text-group col-2">
                                                                        <label title="Equipment Capacity/size" >
                                                                            {IUPFieldLabels.EquipmentCapacity}{isEdit && <span className="required-field">*</span>}
                                                                        </label>
                                                                        <TextBoxComponent id="equipmentCapacityPerSize" fieldName={IUPFields.EquipmentCapacityPerSize} placeHolder={IUPFieldLabels.EquipmentCapacity} className={`${(isError && !(Number(updatedRequest.EquipmentCapacityPerSize))) ? "show-error" : ""} text-control pr-2 pl-2`} value={!updatedRequest.EquipmentCapacityPerSize ? "" : updatedRequest.EquipmentCapacityPerSize.toString()}
                                                                            onChange={this.onChangeField} onBlur={() => { return false; }} isRead={!isEdit as boolean} />
                                                                    </div>
                                                                    <div className="text-group col-2">
                                                                        <label title="Equipment Capacity/size (Amps, HP, KVA, KW, Tons, # of units)" className="white-space-nowrap col-12 p-0">
                                                                            Unit of measure{isEdit && <span className="required-field">*</span>} (Amps, HP, KVA, KW, Tons, # of units)
                                                                        </label>
                                                                        <DLRSelct options={UnitsOfMeasureOptions} selected={updatedRequest.UnitsOfMeasure} toggleOption={this.onChangeDropDown} fieldName={IUPFields.UnitOfMeasure} placeholder={IUPFieldLabels.UnitOfMeasure} disabled={!isEdit} class={`${(isError && !(updatedRequest.UnitsOfMeasure && updatedRequest.UnitsOfMeasure.length > 0)) ? "show-error" : ""}`} />
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </React.Fragment>
                                                    }
                                                    {
                                                        (!!this.state.updatedRequest.ProjectType) && (this.state.updatedRequest.ProjectType === ProjectTypes.UPSBattery) &&
                                                        <React.Fragment>
                                                            <div className="projecttype row m-0 mb-4 pt-3 pb-3">
                                                                <div className="col-12 row">
                                                                    <h5 className="pl-3 pr-2">UPS Battery ONLY</h5>
                                                                </div>
                                                                <div className="row mb-3 col-12 mt-3">
                                                                    <div className="text-group col-2">
                                                                        <label >
                                                                            {IUPFieldLabels.Condition}{isEdit && <span className="required-field">*</span>}
                                                                        </label>
                                                                        <TextBoxComponent id="condition" fieldName={IUPFields.UPSCondition} placeHolder={IUPFieldLabels.Condition} className={`${(isError && !updatedRequest.UPSCondition) ? "show-error" : ""} text-control pr-2 pl-2`}
                                                                            value={!updatedRequest.UPSCondition ? "" : updatedRequest.UPSCondition?.toString()}
                                                                            onChange={this.onChangeField} onBlur={() => { return false; }} isRead={!isEdit as boolean} />
                                                                    </div>
                                                                    <div className="text-group col-2 last-battery-test">
                                                                        <label >
                                                                            {IUPFieldLabels.LastBatteryTest}{isEdit && <span className="required-field">*</span>}
                                                                        </label>
                                                                        <DatePicker
                                                                            selected={(!!updatedRequest.UPSLastBatteryTest ? (new Date(updatedRequest.UPSLastBatteryTest)) : null) as unknown as Date}
                                                                            onChange={(date) => this.onDateChangeField(date, "UPSLastBatteryTest")}
                                                                            dateFormat='MM/dd/yyy'
                                                                            minDate={new Date('1-01-1970')}
                                                                            className={`form-control px-2 ${!!isError && !updatedRequest.UPSLastBatteryTest ? 'show-error' : ''}`}
                                                                            placeholderText="MM/DD/YYYY"
                                                                            disabled={!isEdit}
                                                                        />

                                                                    </div>
                                                                    <div className="currency-group col-2">
                                                                        <label >
                                                                            {IUPFieldLabels.FailedBatteries}{isEdit && <span className="required-field">*</span>}
                                                                        </label>
                                                                        <CurrencyComponent disabled={!isEdit} isInput={true} name={IUPFields.UPSFailedBatteries} value={!!updatedRequest.UPSFailedBatteries ? updatedRequest.UPSFailedBatteries : 0}
                                                                            className={`${!!isError && !updatedRequest.UPSFailedBatteries ? 'show-error' : ''}`} currency={updatedRequest.LocalCurrency} onChange={this.onChangeField} onBlur={() => { return false; }} defaultCurrency={this.defaultCurrency.Currency}
                                                                        />
                                                                    </div>
                                                                    <div className="currency-group col-2">
                                                                        <label title="UPS Units" >
                                                                            {IUPFieldLabels.UPSUnits}{isEdit && <span className="required-field">*</span>}
                                                                        </label>
                                                                        <CurrencyComponent disabled={!isEdit} isInput={true} name={IUPFields.UPSUnits} value={!!updatedRequest.UPSUnits ? updatedRequest.UPSUnits : 0} className={`${!!isError && !updatedRequest.UPSUnits ? 'show-error' : ''}`} currency={updatedRequest.LocalCurrency} onChange={this.onChangeField} onBlur={() => { return false; }} defaultCurrency={this.defaultCurrency.Currency}
                                                                        />
                                                                    </div>
                                                                    <div className="currency-group col-2">
                                                                        <label className="white-space-nowrap col-12 p-0">
                                                                            {IUPFieldLabels.BatteryString}{isEdit && <span className="required-field">*</span>}
                                                                        </label>
                                                                        <CurrencyComponent disabled={!isEdit} isInput={true} name={IUPFields.UPSBatteryStringUPS} value={!!updatedRequest.UPSBatteryStringUPS ? updatedRequest.UPSBatteryStringUPS : 0} className={`${!!isError && !updatedRequest.UPSBatteryStringUPS ? 'show-error' : ''}`} currency={updatedRequest.LocalCurrency} onChange={this.onChangeField} onBlur={() => { return false; }} defaultCurrency={this.defaultCurrency.Currency}
                                                                        />
                                                                    </div>
                                                                    <div className="currency-group col-2">
                                                                        <label className="white-space-nowrap col-12 p-0">
                                                                            {IUPFieldLabels.Batteries}{isEdit && <span className="required-field">*</span>}
                                                                        </label>
                                                                        <CurrencyComponent disabled={!isEdit} isInput={true} name={IUPFields.UPSBatteriesString} value={!!updatedRequest.UPSBatteriesString ? updatedRequest.UPSBatteriesString : 0} className={`${!!isError && !updatedRequest.UPSBatteriesString ? 'show-error' : ''}`} currency={updatedRequest.LocalCurrency} onChange={this.onChangeField} onBlur={() => { return false; }} defaultCurrency={this.defaultCurrency.Currency}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </React.Fragment>
                                                    }
                                                    {
                                                        !!this.state.updatedRequest && !!this.state.updatedRequest.ProjectType && this.state.updatedRequest.ProjectType === ProjectTypes.Sustainability &&

                                                        <div className="projecttype row m-0 mb-4 pt-3 pb-3">
                                                            <div className="col-12 row">
                                                                <h5 className="pl-3 pr-2">Sustainability</h5>
                                                            </div>

                                                            <div className="row mb-3 col-12">
                                                                <div className="col-lg-6" style={{ width: "100%" }}>
                                                                    <table className={`table table-layout-fixed gen-tab table-borderless ${isError && !(this.state.Sustainability.EnvironmentalImpact.filter(_ => _.Applicable && !!_.Amount && _.Attachments && _.Attachments.length).length) ? 'show-error' : ''}`}>
                                                                        <thead>
                                                                            <tr>
                                                                                <th scope="col" className="row-description text-color">Environmental Impact{<span className="required-field ml-0">*<CallOut id="environmentalImpact"
                                                                                    helpText={EnvironmentalImpact} helptextClass="reports-tooltip" /></span>}</th>
                                                                                <th scope="col" className="row-checkbox text-color text-center">Applicable{<span className="required-field"><CallOut id="environmentalImpactApplicable"
                                                                                    helpText={EnvironmentalImpactApplicable} helptextClass="reports-tooltip" /></span>}</th>
                                                                                <th scope="col" className="row-amount-input text-color">Amount</th>
                                                                                <th scope="col" className="row-unit text-color">Unit of Measure</th>
                                                                                <th scope="col" className="row-supporting-documents text-color text-nowrap text-center">Supporting Documents</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {this.state.Sustainability?.EnvironmentalImpact && this.state.Sustainability.EnvironmentalImpact.map((item, index) => {
                                                                                return (
                                                                                    <tr className="padding" >
                                                                                        <td className="mx-auto cell-font-size p-0" align="left" scope="row"><div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{this.state.ImpactMapping && this.state.ImpactMapping.find(_ => _.Id == item.Title)?.ImpactName}</div></td>
                                                                                        <td className="mx-auto px-2 text-center p-0 justify-content-right"  >
                                                                                            <div className="justify-content-center p-left ">
                                                                                                <Checkbox className="chk-control w-amount pl-0" checked={item.Applicable == true ? true : false} onChange={e => this.onChangeSustainability(e, "checkbox", "EnvironmentalImpact", index)} disabled={!isEdit} />
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="py-0 sustainability-amount">
                                                                                            <input className="input-amount" disabled={!isEdit} autoComplete="off" onChange={e => this.onChangeSustainability(e, "amount", "EnvironmentalImpact", index)} type="text" inputMode="numeric" id="name" name="name" required maxLength={9} value={item.Amount} />
                                                                                        </td>
                                                                                        <td className="mx-auto px-2 w-10 cell-font-size p-0 sustainability-unit" >
                                                                                            <DLRSelct options={item.UnitOptions} selected={item.SelectedUnit} toggleOption={(value, type) => { this.onChangeSustainability(value, "unit", "EnvironmentalImpact", index) }} fieldName={IUPFieldLabels.SustainabilityUnit} placeholder={IUPFieldLabels.SustainabilityUnit} disabled={!isEdit} class={""} />
                                                                                        </td>
                                                                                        <td className="mx-auto px-2 w-header p-0" align="center" >
                                                                                            {item.Applicable == true &&
                                                                                                <>
                                                                                                    <input id={`fileuploader${index}`} type="file" onChange={(e) => this.UploadFilesHandler(e.target.files, index, "EnvironmentalImpact", "fileuploader", item.Id)} multiple className="d-none" />
                                                                                                    {<button className="btn border-color cta-button  pl-4 pr-4 ml-auto" onClick={() => this.setState({ ImpactTitle: this.state.ImpactMapping.find(_ => _.Id == item.Title)?.ImpactName, showAttachmentsPopup: true, index: index, impactType: "EnvironmentalImpact", fileUploadId: "fileuploader", ImpactName: "Environmental Impact" })}>{this.state.isEdit ? "Upload" : "View Files"}</button>}
                                                                                                    {this.state.showAttachmentsPopup && !!this.state.requestURL && !!this.state.requestURL.SPSite && <IUPAttachments canAddDelete={this.state.updatedRequest.RequestStatus != IUPStatus.Approved && (this.state.updatedRequest.Approvers.some(_ => _.Email == this.currentUserEmail) || this.currentUserEmail == this.state.updatedRequest.CreatedBy || this.currentUserEmail == this.state.updatedRequest.SubmittedBy || this.state.isAdmin)} impactTitle={this.state.ImpactTitle} toggleAttachmentsPopup={this.toggleAttachmentsPopup} attachments={this.state.Sustainability[`${this.state.impactType}`][this.state.index]["Attachments"]} index={this.state.index} RequestId={this.props.projectId} fileUploader={this.state.fileUploadId} Impact={this.state.ImpactName} deleteFunction={this.deleteAttachment} type={this.state.impactType} isEdit={this.state.isEdit} requestURL={this.state.requestURL} />}
                                                                                                </>
                                                                                            }
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            })}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                                <div className="col-lg-6" style={{ width: "100%" }} >
                                                                    <table className="table table-layout-fixed gen-tab table-borderless">
                                                                        <thead>
                                                                            <tr>
                                                                                <th scope="col" className="row-description text-color">Operational Impact{<span className="required-field"><CallOut id="operationalImpact"
                                                                                    helpText={OperationalImpact} helptextClass="reports-tooltip" /></span>}</th>
                                                                                <th scope="col" className="row-checkbox text-color text-center">Applicable{<span className="required-field"><CallOut id="operationalImpactId"
                                                                                    helpText={OperationalImpactApplicable} helptextClass="reports-tooltip" /></span>}</th>
                                                                                <th scope="col" className="row-amount-input text-color">Amount</th>
                                                                                <th scope="col" className="row-unit text-color">Unit of Measure</th>
                                                                                <th scope="col" className="row-supporting-documents text-color text-nowrap text-center">Supporting Documents</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {this.state.Sustainability?.OperationalImpact && this.state.Sustainability.OperationalImpact.map((item, index) => {
                                                                                return (
                                                                                    <tr className="padding" >
                                                                                        <td className="mx-auto cell-font-size p-0" align="left" scope="row">
                                                                                            <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{this.state.ImpactMapping && this.state.ImpactMapping.find(_ => _.Id == item.Title)?.ImpactName}</div>
                                                                                        </td>
                                                                                        <td className="mx-auto px-2 text-center p-0 justify-content-right"  >
                                                                                            <div className="justify-content-center p-left ">
                                                                                                <Checkbox className="chk-control w-amount pl-0" checked={item.Applicable == true ? true : false} onChange={e => this.onChangeSustainability(e, "checkbox", "OperationalImpact", index)} disabled={!isEdit} />
                                                                                            </div>
                                                                                        </td>
                                                                                        <td className="py-0 sustainability-amount">
                                                                                            <input className="input-amount" disabled={!isEdit} autoComplete="off" onChange={e => this.onChangeSustainability(e, "amount", "OperationalImpact", index)} type="text" inputMode="numeric" id="name" name="name" required maxLength={9} value={item.Amount} />
                                                                                        </td>
                                                                                        <td className="mx-auto px-2 w-10 cell-font-size p-0 sustainability-unit" >
                                                                                            <DLRSelct options={item.UnitOptions} selected={item.SelectedUnit} toggleOption={(value, type) => { this.onChangeSustainability(value, "unit", "OperationalImpact", index) }} fieldName={IUPFieldLabels.SustainabilityUnit} placeholder={IUPFieldLabels.SustainabilityUnit} disabled={!isEdit} class={""} />
                                                                                        </td>
                                                                                        <td className="mx-auto px-2 w-header p-0" align="center" >
                                                                                            {item.Applicable == true &&
                                                                                                <>
                                                                                                    <input id={`Opfileuploader${index}`} type="file" onChange={(e) => this.UploadFilesHandler(e.target.files, index, "OperationalImpact", "Opfileuploader", item.Id)} multiple className="d-none" />
                                                                                                    {<button className="btn border-color cta-button  pl-4 pr-4 ml-auto" onClick={() => this.setState({ ImpactTitle: this.state.ImpactMapping.find(_ => _.Id == item.Title)?.ImpactName, showAttachmentsPopup: true, index: index, impactType: "OperationalImpact", fileUploadId: "Opfileuploader", ImpactName: "Operational Impact" })}>{this.state.isEdit ? "Upload" : "View Files"}</button>}
                                                                                                    {this.state.showAttachmentsPopup && !!this.state.requestURL && !!this.state.requestURL.SPSite && <IUPAttachments canAddDelete={this.state.updatedRequest.RequestStatus != IUPStatus.Approved && (this.state.updatedRequest.Approvers.some(_ => _.Email == this.currentUserEmail) || this.currentUserEmail == this.state.updatedRequest.CreatedBy || this.currentUserEmail == this.state.updatedRequest.SubmittedBy || this.state.isAdmin)} impactTitle={this.state.ImpactTitle} toggleAttachmentsPopup={this.toggleAttachmentsPopup} attachments={this.state.Sustainability[`${this.state.impactType}`][this.state.index]["Attachments"]} index={this.state.index} RequestId={this.props.projectId} fileUploader={this.state.fileUploadId} Impact={this.state.ImpactName} deleteFunction={this.deleteAttachment} type={this.state.impactType} isEdit={this.state.isEdit} requestURL={this.state.requestURL} />}
                                                                                                </>
                                                                                            }
                                                                                        </td>
                                                                                    </tr>
                                                                                )
                                                                            })}

                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <div className="row mb-3">
                                                                <div className={`${(isError && !this.isHtmlEncodedStringContainsText(updatedRequest.ProjectDescription)) ? "show-richText-error" : ""} textarea-group col-4 `}>
                                                                    <label>
                                                                        {IUPFieldLabels.ProjectDescription}
                                                                        {<React.Fragment>
                                                                            {isEdit && <span className="required-field">*</span>} <small className="font-x-small">(Maximum 300 characters)</small>
                                                                            <CallOut id="projectDescrptionTooltip"
                                                                                helpText={projectDescrptionTooltip} helptextClass="reports-tooltip" />
                                                                        </React.Fragment>}

                                                                    </label>
                                                                    <RichTextEditor
                                                                        handleChange={this.onChangeRichText}
                                                                        value={updatedRequest.ProjectDescription}
                                                                        disable={!isEdit as boolean}
                                                                        className="show"
                                                                        fieldName={IUPFields.ProjectDescription} maxLength={300} />
                                                                </div>
                                                                <div className={`${(isError && !this.isHtmlEncodedStringContainsText(updatedRequest.ProjectJustification)) ? "show-richText-error" : ""} textarea-group col-4 `}>
                                                                    <label>
                                                                        {IUPFieldLabels.ProjectJustification}
                                                                        {<React.Fragment>
                                                                            {isEdit && <span className="required-field">*</span>} <small className="font-x-small">(Maximum 500 characters)</small>
                                                                            <CallOut id="projectJustificationTooltip"
                                                                                helpText={projectJustificationTooltip} helptextClass="reports-tooltip" />
                                                                        </React.Fragment>}
                                                                    </label>
                                                                    <RichTextEditor
                                                                        handleChange={this.onChangeRichText}
                                                                        value={updatedRequest.ProjectJustification}
                                                                        disable={!isEdit as boolean}
                                                                        height={105}
                                                                        className="show"
                                                                        fieldName={IUPFields.ProjectJustification} maxLength={500}
                                                                    />
                                                                </div>
                                                                <div className="col-4">
                                                                    <div className="d-flex justify-space-between">
                                                                        <label className="col-12 p-0 m-0 control-label " title="File Uploader (xls,xlsx,doc,docx,pdf,ppt,pptx, msg, eml)">
                                                                            File Uploader (xls,xlsx,doc,docx,pdf,ppt,pptx,msg,eml)
                                                                        </label>
                                                                        <input id="fileuploader" type="file" onChange={(e) => this.checkFileType(e.target.files, false)} multiple className="d-none" />
                                                                        <input id="propsalfileuploader" type="file" onChange={(e) => this.checkFileType(e.target.files, true)} multiple className="d-none" />
                                                                    </div>
                                                                    {this.state.isEdit && (
                                                                        <div className="row col-12 pr-0 mt-2">
                                                                            <button className="btn ml-2 cta-button pt-1 pb-1 pl-4 pr-4 btn-proposal" onClick={() => document.getElementById("propsalfileuploader").click()}>Add Proposal</button>{isEdit && <span className="required-field">*</span>}
                                                                            <button className="btn cta-button pt-1 pb-1 pl-4 pr-4 ml-auto" onClick={() => document.getElementById("fileuploader").click()}>Add Attachment</button>
                                                                        </div>
                                                                    )}
                                                                    <table className="col-12 file-upload-table">
                                                                        <thead>
                                                                            <tr className="col-12 pl-0 pr-0 row m-0 control-label">
                                                                                <th className="col-1 pt-1">{<i className={`${OfficeUIAttachmentIcons.Default}`}></i>}</th>
                                                                                <th className="col-6">File Name</th>
                                                                                <th className="col-3 p-0 my-auto text-center"></th>
                                                                                <th className="col-2 action-text">Action</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className={`sap-file-attachments ${!!updatedRequest.Attachments && updatedRequest.Attachments.length > 2 ? "files-max-height" : "files-height"}`}>
                                                                            {
                                                                                !!this.state.isAttachmentsLoading
                                                                                    ? <TestLoader />
                                                                                    : (updatedRequest.Attachments && !!updatedRequest.Attachments.filter(file => !!file.IsActive).length
                                                                                        ? <React.Fragment>
                                                                                            {
                                                                                                updatedRequest.Attachments.filter(file => !!file.IsActive).map((selectedFile, index) => {
                                                                                                    return (
                                                                                                        <tr className="col-12 pl-0 pr-0 row m-0">
                                                                                                            <td className="col-1">{<i className={`${this._Utility.getFileIcon(selectedFile.Name)}`}></i>}</td>
                                                                                                            <td className="col-6 white-space-nowrap" title={selectedFile.Name}>
                                                                                                                {
                                                                                                                    selectedFile.IsUploaded
                                                                                                                        ? <a href={selectedFile.URL} target="_blank" title={selectedFile.DecodedName}>
                                                                                                                            {selectedFile.DecodedName?.length > 32 ? `${selectedFile.DecodedName.substring(0, 33)}...` : selectedFile.DecodedName}
                                                                                                                        </a>
                                                                                                                        : selectedFile.Name.length > 32 ? `${selectedFile.Name.substring(0, 33)}...` : selectedFile.Name
                                                                                                                }
                                                                                                            </td>
                                                                                                            <td className="col-3 text-center my-auto proposal-doc">{!!selectedFile.IsProposal ? 'Proposal' : ''}</td>
                                                                                                            <td className="col-2 ">
                                                                                                                {this.state.isEdit && (
                                                                                                                    <i className="ms-Icon ms-Icon--Cancel color-red" onClick={() => this.onDeleteFile(selectedFile)}></i>
                                                                                                                )}
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    );
                                                                                                })
                                                                                            }
                                                                                        </React.Fragment>
                                                                                        : <span className="m-2 p-2">No files uploaded</span>)
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                            {
                                                this.state.activeTab == "Approvers" &&
                                                <ApproverComponent capitalRequest={updatedRequest}
                                                    addNotifier={this.addNotifier}
                                                    removeNotifier={this.removeNotifier}
                                                    isEdit={isEdit as boolean}
                                                    isError={this.state.isError}
                                                    isApproversError={this.state.isApproversError}
                                                    allApprovers={this.isEuropeRequest ? this.EuropeAllApprovers : this.allApproversWithoutSiteCode}
                                                    managementApprovers={this.isEuropeRequest ? this.EuropeApprovers : this.managementApprovers}
                                                    updatedApprovers={this.updatedApprovers}
                                                />
                                            }
                                        </React.Fragment>
                                    }
                                </div>
                            </div>
                            <Dialog
                                hidden={!this.state.showDeletePopup}
                                onDismiss={this.toggleShowDeletePopup}
                                modalProps={this.modalProps}
                            >
                                Are you sure you want to delete the project?
                                <DialogFooter>
                                    {
                                        <React.Fragment>
                                            <button className={"btn cta-button pt-1 pb-1 pl-4 pr-4"} onClick={this.deleteProject} >Yes</button>
                                            <button className={"btn cta-button pt-1 pb-1 pl-4 pr-4 ml-2"} onClick={this.toggleShowDeletePopup} >No</button>
                                        </React.Fragment>
                                    }
                                </DialogFooter>
                            </Dialog>
                            <Dialog
                                hidden={!this.state.showMoveToPlanningPopup}
                                onDismiss={this.toggleShowMovetoPlanningPopup}
                                modalProps={this.modalProps}
                            >
                                Are you sure you want to Move the project to Planning?
                                <DialogFooter>
                                    {
                                        <React.Fragment>
                                            <button className={"btn cta-button pt-1 pb-1 pl-4 pr-4"} onClick={this.moveProjectToPlanning} >Yes</button>
                                            <button className={"btn cta-button pt-1 pb-1 pl-4 pr-4 ml-2"} onClick={this.toggleShowMovetoPlanningPopup}>No</button>
                                        </React.Fragment>
                                    }
                                </DialogFooter>
                            </Dialog>
                            <Dialog
                                hidden={!this.state.showReturnPopup}
                                onDismiss={this.toggleShowReturnPopup}
                                modalProps={this.modalProps}
                                containerClassName="ms-dialogMainOverride return-pop-up return-content">
                                Are you sure you want to return the project?
                                <div className="mail-body col-12 mt-3 pl-0">
                                    <label className="col-2 d-inline-block align-top pl-0">Level</label>
                                    <div className="col-10 vertical-align-bottom d-inline-block p-0">
                                        <DLRSelct options={this.returnLevelOptions} selected={updatedRequest.ReturnNewLevel} toggleOption={this.onChangeDropDown} fieldName={IUPFields.ReturnNewLevel} placeholder={IUPFieldLabels.ReturnNewLevel} disabled={false} class={`${this.state.IsReturnLevelEmpty ? " error" : ""}`} />
                                    </div>
                                </div>
                                <div className="mail-body col-12 mt-3 pl-0">
                                    <label className="col-2 d-inline-block align-top pl-0">Comments</label>
                                    <textarea id="comments" className={`col-10 vertical-align-bottom d-inline-block form-control ${this.state.IsCommentsEmpty ? " error" : ""}`} placeholder="Enter Comments" rows={3} onChange={() => this.validateError("IsCommentsEmpty", "comments")}>{this.Comments}</textarea>
                                </div>
                                <DialogFooter>
                                    <button className="btn cta-button pt-1 pb-1 pl-4 pr-4" onClick={() => { this.returnProject(IUPActions.Return.toString()) }} >Yes</button>
                                    <button className="btn cta-button pt-1 pb-1 pl-4 pr-4 ml-2" onClick={this.toggleShowReturnPopup} >No</button>
                                </DialogFooter>
                            </Dialog>
                            <Dialog
                                hidden={!this.state.showRMPopup}
                                onDismiss={this.toggleShowRMPopup}
                                modalProps={this.modalProps}
                                containerClassName="ms-dialogMainOverride return-pop-up">
                                Are you sure you want to convert the project to R&M?
                                <DialogFooter>
                                    <button className="btn cta-button pt-1 pb-1 pl-4 pr-4" onClick={() => { this.RMorDeferProject(IUPActions.ConvertToRM.toString()) }} >Yes</button>
                                    <button className="btn cta-button pt-1 pb-1 pl-4 pr-4 ml-2" onClick={this.toggleShowRMPopup} >No</button>
                                </DialogFooter>
                            </Dialog>
                            <Dialog
                                hidden={!this.state.showDeferPopup}
                                onDismiss={this.toggleShowDeferPopup}
                                modalProps={this.modalProps}
                                containerClassName="ms-dialogMainOverride return-pop-up">
                                Are you sure you want to defer the project?
                                <div className="mail-body col-12 mt-3 pl-0">
                                    <label className="col-2 d-inline-block align-top pl-0">Comments</label>
                                    <textarea id="comments" className={`col-10 vertical-align-bottom d-inline-block form-control ${this.state.IsCommentsEmpty ? " error" : ""}`} placeholder="Enter Comments" rows={3} onChange={() => this.validateError("IsCommentsEmpty", "comments")}>{this.Comments}</textarea>
                                </div>
                                <DialogFooter>
                                    <button className="btn cta-button pt-1 pb-1 pl-4 pr-4" onClick={() => { this.RMorDeferProject(IUPActions.Defer.toString()) }} >Yes</button>
                                    <button className="btn cta-button pt-1 pb-1 pl-4 pr-4 ml-2" onClick={this.toggleShowDeferPopup} >No</button>
                                </DialogFooter>
                            </Dialog>
                        </div> :
                        <div className="error-dashboard">
                            <div className="error-symbol">
                                <i className="ms-Icon ms-Icon--ban"></i>
                            </div>
                            <div className="error-text">
                                <span>Access Denied ! </span>
                                <span>You don't have Permissions to Access this Page !!!</span>
                            </div>
                        </div>
                }
            </React.Fragment>
        );
    }
}
export default RequestFormComponent;
