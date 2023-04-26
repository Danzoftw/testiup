import * as React from "react";
import { Checkbox, Icon } from "office-ui-fabric-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./Section.scss";
import { ISurvey } from "../../../Interfaces/ISurvey";
import { ISurveyQuestion } from "../../../Interfaces/ISurveyQuestion";
import { IQuestion } from "../../../Interfaces/IQuestion";
import { SectionDetails } from "./Details";
import { SurveyService } from "../AddSurveyServices";
import { ISurveySection } from "../../../Interfaces/ISurveySection";
import DropAddQuestionComponent from "./DropAddQuestionComponent";
import { DefaultQuestionOptions } from "../../../Assets/Constants";
import { ISurveyOption, ISurveyScoreType } from "../../../Interfaces/ISurveyOption";
import { OptionDetails } from "./OptionDetails";
import { UtilService } from "../../../Common/Services/UtilService";
import { SurveyStatus } from "../../../Assets/Enums";
import ConfirmationPopupComponent from "../../Common/ConfirmationPopup/ConfirmationPopup";
import "bootstrap/dist/css/bootstrap.min.css";
import RichTextEditor from "./RichTextEditor";
import DragContentComponent from "./DragContent/DragContentComponent";
import DropContentComponent from "./DragContent/DropContentComponent";
import { IOperationStatus } from "../../../Interfaces/IOperationStatus";
import Loader from "../../Common/Loader/Loader";
import { OverlayTrigger, Popover, Button } from "react-bootstrap";

interface IProps {
    updateSurvey: any;
    updateLastSave: any;
    scrollToBottom: any;
    survey: ISurvey;
    questionBank: Array<IQuestion>;
    scoreTypes: Array<ISurveyScoreType>;
    updateHelpTextEditorID: any;
    helpTextEditorID: number;
    setupSection: boolean;
    showError: boolean;
}

interface IState {
    survey: ISurvey;
    activeSection: ISurveySection;
    showAddNewQuestion: boolean;
    activeQuestion: ISurveyQuestion;
    questionBank: Array<IQuestion>;
    filteredQuestionBank: Array<IQuestion>;
    isLoading: boolean;
}
export class Section extends React.Component<IProps, IState> {
    _surveyService: SurveyService;
    _utilService: UtilService;
    isActiveSectionUpdated: boolean;
    survey: ISurvey = {};
    activeSection: ISurveySection = {};
    numberLimit: number = 99999;
    endOfSectionsList: any;
    setupSection: boolean = false;

    constructor(props) {
        super(props);
        this.state = {
            survey: {
                Sections: [],
            },
            activeSection: {},
            showAddNewQuestion: false,
            activeQuestion: {},
            questionBank: [],
            filteredQuestionBank: [],
            isLoading: false
        };
    }

    componentDidMount() {
        // this._surveyService = new SurveyService();
        // this._utilService = new UtilService();
    }

    componentWillReceiveProps(props: IProps) {
        // if (props && props.survey && this.state.survey != props.survey) {
        //     this.survey.Name = props.survey.Name;
        //     this.survey.StartDate = props.survey.StartDate;
        //     this.survey.EndDate = props.survey.EndDate;
        //     this.survey.Status = props.survey.Status;
        //     if (!this.isActiveSectionUpdated && props.survey.ID) {
        //         this.isActiveSectionUpdated = true;
        //         this.survey = props.survey;
        //         this.activeSection =
        //             this.state.activeSection && this.state.activeSection.ID
        //                 ? this.state.activeSection
        //                 : props.survey && props.survey.Sections && props.survey.Sections.length > 0
        //                     ? props.survey.Sections[0]
        //                     : {};
        //         this.setState({
        //             activeSection: this.activeSection,
        //             filteredQuestionBank: props.questionBank,
        //             survey: props.survey,
        //         });

        //         if (props.setupSection && !this.setupSection) {
        //             this.setupSection = true;
        //             this.setUpDefaultSection();
        //         }
        //     }
        // }

        // if (props.questionBank != this.state.questionBank) {
        //     this.setState({ questionBank: props.questionBank });
        // }
    }

    setUpDefaultSection() {
        this.setState({ isLoading: true });
        this.saveSection({}, true, true);
    }

    updateIsSaving(isSaving: boolean) {
        localStorage.setItem("issaving", `${isSaving ? "Yes" : "No"}`);
    }

    saveSection(section: ISurveySection, isNew: boolean, createdefaultQues?: boolean) {
        this.updateIsSaving(true);
        this.survey.Sections = this.survey.Sections ? this.survey.Sections : [];
        let newSection = {
            ID: isNew ? 0 : section.ID,
            Name: isNew ? `New Section ${this.state.survey && this.state.survey.Sections ? this.state.survey.Sections.length + 1 : ''}` : section.Name,
            Description: isNew ? "" : section.Description,
            SurveyID: this.survey.ID,
            Order: isNew ? Math.max(...this.survey.Sections.map((o) => o.Order), 0) + 1 : section.Order,
            IsActive: true,
            SurveyQuestions: isNew ? [] : section.SurveyQuestions,
        } as ISurveySection;
        this._surveyService.saveSection(newSection).then(
            (res) => {
                this.updateIsSaving(false);
                if (!!res) {
                    newSection.ID = res;
                    if (isNew) {
                        this.survey.Sections.push(newSection);
                        this.activeSection = newSection;
                        this.scrollSectionListToBottom();
                    } else {
                        let index = this.survey.Sections.findIndex((_) => _.ID == section.ID);
                        if (index > -1) {
                            this.survey.Sections[index] = newSection;
                            this.activeSection = newSection;
                        };
                    }

                    this.resetPopUp();
                    this.props.updateLastSave(new Date());
                    this.props.updateSurvey(this.survey);

                    setTimeout(() => {
                        if (createdefaultQues)
                            this.saveQuestion({}, 0, 0, true, true);
                    });
                }
            },
            (error) => {
                this.updateIsSaving(false);
                this.setState({ isLoading: false });
            }
        );
    }

    toggleSurveys(goNext: boolean) {
        let index = this.survey.Sections.findIndex((_) => this.state.activeSection && _.ID == this.state.activeSection.ID);
        this.activeSection = goNext
            ? !!this.survey.Sections[index + 1]
                ? this.survey.Sections[index + 1]
                : this.survey.Sections[index]
            : !!this.survey.Sections[index - 1]
                ? this.survey.Sections[index - 1]
                : this.survey.Sections[index];
        this.setState({ activeSection: this.activeSection });
    }

    saveQuestion(question: ISurveyQuestion, parentQuestion: number, optionId: number, isNew: boolean, createDefaultQue?: boolean) {
        // debugger;
        console.log("question saveQuestion", question);
        this.updateIsSaving(true);
        this.activeSection.SurveyQuestions = this.activeSection.SurveyQuestions ? this.activeSection.SurveyQuestions : [];
        let defaultOpts = [...DefaultQuestionOptions];
        defaultOpts = defaultOpts.map((option) => {
            var opt = {...option};
            opt.IsActive = true;
            opt.SectionId = this.activeSection.ID;
            opt.CommentTitle = "Comments";

            return opt;
        });
        let newQuestion = {
            ID: isNew ? 0 : question.ID,
            IsActive: true,
            Question: isNew ? (question && question.Title ? question.Title : "New Question") : question.Question,
            Notes: isNew ? (question && question.Notes ? question.Notes : "") : question.Notes,
            IsSubQuestion: !!parentQuestion,
            ParentQuestionID: !!parentQuestion ? parentQuestion : 0,
            SectionID: this.activeSection.ID,
            OptionID: isNew ? optionId : question.OptionID,
            Options: isNew ? defaultOpts : question.Options,
            Order: isNew ? Math.max(...this.activeSection.SurveyQuestions.map((o) => o.Order), 0) + 1 : question.Order,
            IsPublished: isNew ? !(this.state.survey && this.state.survey.Status == SurveyStatus.Published): question.IsPublished,
            IsCritical: question.IsCritical ?? false,
        } as ISurveyQuestion;
        newQuestion.Options.map((_) => (_.SectionId = this.activeSection.ID));
        this._surveyService.saveSurveyQuestion(newQuestion).then(
            (res: ISurveyQuestion) => {
                this.updateIsSaving(false);
                if (!!res) {
                    newQuestion.ID = res.ID;
                    newQuestion.Options = res.Options;
                    if (isNew) {
                        this.activeSection.SurveyQuestions.push(newQuestion);
                        this.props.scrollToBottom();
                    } else {
                        let index = this.activeSection.SurveyQuestions.findIndex((_) => _.ID == question.ID);
                        if (index > -1)
                            this.activeSection.SurveyQuestions[index] = newQuestion;
                    }

                    let secIndex = this.survey.Sections.findIndex(_ => _.ID == this.activeSection.ID);
                    if (secIndex > -1)
                        this.survey.Sections[secIndex] = { ...this.activeSection };

                    this.setState({
                        survey: this.survey,
                        activeSection: this.activeSection,
                    });
                    this.props.updateLastSave(new Date());
                    this.props.updateSurvey(this.survey);
                }

                this.setState({ isLoading: false });
            },
            (error) => {
                this.updateIsSaving(false);
                this.setState({ isLoading: false });
            }
        );
    }

    onQuestioninputChange = (event: any, id: number, type: string) => {
        console.log("check render in onQuestioninputChange");
        let index = this.activeSection ? this.activeSection?.SurveyQuestions?.findIndex((_) => _.ID == id) : this.state.activeSection?.SurveyQuestions?.findIndex((_) => _.ID == id);
        if (index > -1) {
            switch (type) {
                case "question":
                    this.activeSection.SurveyQuestions[index].Question = event && event.target ? event.target.value : "";
                    break;
                case "note":
                    this.activeSection.SurveyQuestions[index].Notes = event ?? "";
                    break;
                case "IsCritical":
                    this.activeSection.SurveyQuestions[index].IsCritical = event.target.checked;
                    this.saveSectionQuestion(id, 0);
                    break;
            }

            this.setState({ activeSection: this.activeSection });
        }
    };

    saveSectionQuestion(id: number, helpTextEditor: number) {
        this.props.updateHelpTextEditorID(helpTextEditor);
        let index = this.activeSection.SurveyQuestions.findIndex((_) => _.ID == id);
        if (index > -1 && !!this.activeSection.SurveyQuestions[index].Question && !!this.activeSection.SurveyQuestions[index].Question.trim()) this.saveQuestion(this.activeSection.SurveyQuestions[index], this.activeSection.SurveyQuestions[index].ParentQuestionID, 0, false);
    }

    deleteQuestion() {
        if (this.state.activeQuestion && this.state.activeQuestion.ID) {
            this.updateIsSaving(true);
            let question = { ...this.state.activeQuestion };
            question.IsActive = false;
            this._surveyService.saveSurveyQuestion(question).then(
                (res) => {
                    this.updateIsSaving(false);
                    if (!!res) {
                        this.activeSection.SurveyQuestions = this.activeSection.SurveyQuestions.filter(
                            (ques) => ques.ID != this.state.activeQuestion.ID && ques.ParentQuestionID != this.state.activeQuestion.ID
                        );

                        let index = this.survey.Sections.findIndex((_) => _.ID == this.state.activeQuestion.SectionID);
                        if (index > -1) this.survey.Sections[index] = this.activeSection;

                        this.resetPopUp();
                        this.props.updateLastSave(new Date());
                        this.props.updateSurvey(this.survey);
                    }
                },
                (error) => {
                    this.updateIsSaving(false);
                }
            );
        }
    }

    addNewOption(question: ISurveyQuestion) {
        let newOption = {
            IsEdit: true,
            SectionId: this.activeSection.ID,
            IsActive: true,
            WeightedScore: 1,
            Title: "New Option",
            ScoreType: 1
        } as ISurveyOption;
           newOption.HasComment = true;
            newOption.CommentTitle = "Comments";
            newOption.IsCommentRequired = true;
        this.saveQuestionOptionDetails(question, newOption, false);
    }

    deleteSection() {
        if (this.state.activeSection && this.state.activeSection.ID) {
            if (this.state.survey.Status == SurveyStatus.Published && this.state.survey.Sections.length == 1) return;

            let activeSection = { ...this.state.activeSection };
            activeSection.IsActive = false;
            this._surveyService.saveSection({ ...activeSection }).then((res: ISurveySection) => {
                if (!!res) {
                    let index = this.survey.Sections.findIndex((_) => _.ID == this.state.activeSection.ID);
                    if (index > -1) {
                        this.survey.Sections = this.survey.Sections.filter((_) => _.ID != this.state.activeSection.ID);
                    }
                    this.activeSection = !!this.survey.Sections[index - 1] ? this.survey.Sections[index - 1] : !!this.survey.Sections[index] ? this.survey.Sections[index] : {};
                    this.resetPopUp();
                    this.props.updateSurvey(this.survey);
                    this.props.updateLastSave(new Date());
                }
            });
        }
    }

    updateActiveSectionInSurvey() {
        let sIndex = this.survey.Sections.findIndex((_) => _.ID == this.state.activeSection.ID);
        if (sIndex > -1) {
            let activeSection = { ...this.state.activeSection };
            this.survey.Sections[sIndex] = activeSection;
        }

        this.setState({ survey: this.survey });
    }

    resetPopUp() {
        this.setState({
            activeQuestion: {},
            survey: this.survey,
            activeSection: this.activeSection,
        });
    }

    saveQuestionOptionDetails(question: ISurveyQuestion, option: ISurveyOption, isDelete: boolean) {
        if (!!option) {
            let quindex = this.activeSection.SurveyQuestions.findIndex((_) => _.ID == question.ID);
            if (isDelete) {
                if (question.Options && question.Options.length > 2) {
                    option.IsActive = false;
                    this.updateIsSaving(true);
                    this._surveyService.saveSurveyQuestionOption(option).then(
                        (res) => {
                            if (!!res) {
                                question.Options = !!question.Options ? question.Options : [];
                                question.Options = question.Options.filter((ques) => ques.ID != res);
                                if (quindex > -1) {
                                    this.activeSection.SurveyQuestions[quindex] = question;
                                }
                                this.resetPopUp();
                            }
                            this.updateActiveSectionInSurvey();
                            this.updateIsSaving(false);
                            this.props.updateLastSave(new Date());
                        },
                        (error) => {
                            this.updateIsSaving(false);
                        }
                    );
                }
            } else {
                option.SectionId = this.state.activeSection.ID;
                option.SurveyQuestionID = question.ID;
                option.IsActive = true;
                this.updateIsSaving(true);
                this._surveyService.saveSurveyQuestionOption(option).then(
                    (res) => {
                        if (!!res) {
                            question.Options = !!question.Options ? question.Options : [];
                            let index = question.Options.findIndex((_) => _.ID == option.ID);
                            if (index >= 0) {
                                question.Options[index] = option;
                            } else if (!index || index == -1) {
                                option.ID = res;
                                question.Options.push(option);
                            }

                            if (quindex > -1) {
                                this.activeSection.SurveyQuestions[quindex] = question;
                            }
                            this.resetPopUp();
                            this.props.updateLastSave(new Date());
                        }

                        this.updateActiveSectionInSurvey();
                        this.updateIsSaving(false);
                    },
                    (error) => {
                        this.updateIsSaving(false);
                    }
                );
            }
        } else {
            this.setState({ activeQuestion: {} });
        }
    }

    geneateUniqueKey() {
        return Math.floor(Math.random() * 100);
    }

    switchSurveySection(index: number) {
        console.log("check render in onQuestioninputChange");
        this.activeSection = JSON.parse(JSON.stringify(this.state.survey.Sections[index]));
        this.setState({ activeSection: JSON.parse(JSON.stringify(this.activeSection)) });
    }

    swapSection(src: any, target: any) {
        if (src && target && src.index >= -1 && target.index >= -1) {
            let survey = { ...this.survey };
            survey.Sections = this._utilService.swapContent(survey.Sections, src.index, target.index);
            survey.Sections.map((sec, index) => {
                sec.Order = index + 1;
            });
            survey.UpdateOrder = true;
            this._surveyService.saveSurveyDetails(survey).then((res: IOperationStatus) => {
                if (res.IsSuccess) {
                    this.survey = survey;
                    this.setState({ survey: this.survey, activeSection: this.survey.Sections[target.index] });
                    this.props.updateLastSave(new Date());
                }
            });
        }
    }

    swapQuestion(src: any, target: any) {
        console.log("check render in swapQuestion");
        if (src && target && src.index >= -1 && target.index >= -1) {
            let activeSection = { ...this.state.activeSection };
            activeSection.SurveyQuestions = this._utilService.swapContent(activeSection.SurveyQuestions, src.index, target.index);
            activeSection.SurveyQuestions.map((ques, index) => {
                if (!ques.OptionID) ques.Order = index + 1;
            });
            activeSection.UpdateOrder = true;
            this._surveyService.saveSection(activeSection).then((res) => {
                if (!!res) {
                    let sectionIndex = this.survey.Sections.findIndex((_) => _.ID == this.activeSection.ID);
                    if (sectionIndex > -1) this.survey.Sections[sectionIndex] = activeSection;

                    this.activeSection = activeSection;
                    this.setState({ activeSection: this.activeSection, survey: this.survey });
                    this.props.updateLastSave(new Date());
                }
            });
        }
    }

    scrollSectionListToBottom = () => {
        this.endOfSectionsList.scrollIntoView({ behavior: "smooth", block: "end" });
    };

    renderOptions(question: ISurveyQuestion, parentIndex: string) {
        return question && question.Options && question.Options.length
            ? question.Options.map((option: ISurveyOption, index: number) => {
                return (
                    <DropAddQuestionComponent saveQuestion={this.saveQuestion.bind(this)} parentQuestion={question} option={option}>
                        <OptionDetails
                            key={`opt_${question.ID}_${option.ID}_${index}`}
                            option={option}
                            saveQuestion={this.saveQuestion.bind(this)}
                            question={question}
                            index={index}
                            saveQuestionOptionDetails={this.saveQuestionOptionDetails.bind(this)}
                            scoreTypes={this.props.scoreTypes}
                            closeHelpTextEditor={() => { this.props.updateHelpTextEditorID(0); }}      
                            showError = {this.props.showError}
                        />
                        <button className="btn btn-primary m-2 add-new-question mx-3" onClick={() => this.saveQuestion({}, question.ID, option.ID, true)}>
                            <i className="fa fa-plus-circle mr-2" aria-hidden="true"></i>Add Sub Question
                          </button>

                        {this.state.activeSection.SurveyQuestions.filter((ques) => ques.OptionID == option.ID).map((que, index) => {
                            return this.renderNestedQuestions(que, `${parentIndex ? parentIndex : ""}`, index);
                        })}
                    </DropAddQuestionComponent>
                );
            })
            : null;
    }

    onCancel() {
        this.setState({ activeQuestion: {} });
    }

    renderNestedQuestions(question: ISurveyQuestion, parentindex: string, questionIndex: number) {
        console.log("question, parentindex, questionIndex", question, parentindex, questionIndex);
        // debugger;
        return (
            <div className="question-drop-box">
                <DropContentComponent dropTo={this.swapQuestion.bind(this)} targetData={{ index: questionIndex }}>
                    <div className={`questionDropContainer ${question.IsPublished ? "" : "background-yellow"}`}>
                        <DragContentComponent dropContainer={"question-drop-box"} srcData={{ index: questionIndex }}>
                            <div className={`questions-container col-12 p-0`}>
                                <div className="col-12">
                                    <div className="employee-grid col-12 row mx-0 mt-2 p-0">
                                        {
                                            <React.Fragment>
                                                <div className={`row m-0 px-0 col-12`}>
                                                    <span className="txt-question p-0 mr-2">
                                                        {`Q ${parentindex ? parentindex + "." : ""} ${questionIndex + 1}.`}
                                                        <i className="fa fa-asterisk" aria-hidden="true" title="Question Required"></i>
                                                    </span>
                                                    <input
                                                        className={`form-control col-5 ${(!question.Question || (!!question.Question && !question.Question.trim())) ? "show-error-border" : ""
                                                            }`}
                                                        value={question.Question}
                                                        type="text"
                                                        placeholder="Question"
                                                        id={`question_${question.ID}`}
                                                        onChange={(e) => this.onQuestioninputChange(e, question.ID, "question")}
                                                        autoComplete="off"
                                                        onBlur={() => this.saveSectionQuestion(question.ID, 0)}
                                                    />
                                                    <div className="mx-4 d-flex flex-row is-critical-check">
                                                        <span className="mx-2 my-auto">
                                                            <OverlayTrigger
                                                            trigger={["hover", "focus"]}
                                                            placement="auto"
                                                            rootClose
                                                            overlay={
                                                                <Popover id="popover-basic">
                                                                    <Popover.Content>
                                                                        {
                                                                            <span>On selecting this checkbox, this question is considered as critical question</span>
                                                                        }
                                                                    </Popover.Content>
                                                                </Popover>
                                                            }
                                                        >
                                                            <i className="fa fa-exclamation-triangle cursor-pointer" aria-hidden="true"></i>
                                                        </OverlayTrigger>
                                                            
                                                        </span>
                                                        <Checkbox className={`ml-2`} checked={!!question.IsCritical} onChange={(e) => this.onQuestioninputChange(e, question.ID, "IsCritical")} />
                                                    </div>
                                                    <div className="question-description my-auto">
                                                        <OverlayTrigger
                                                            trigger="click"
                                                            placement="auto"
                                                            rootClose
                                                            overlay={
                                                                <Popover id="popover-basic">
                                                                    <Popover.Content>
                                                                        {
                                                                            <span
                                                                                dangerouslySetInnerHTML={{
                                                                                    __html: decodeURIComponent(
                                                                                        decodeURIComponent(question.Notes)
                                                                                            ?.replace(/(<([^>]+)>)/gi, "")
                                                                                            ?.replace(/\s/g, "")
                                                                                            ?.replace(/&nbsp;/g, "")
                                                                                            ? question.Notes
                                                                                            : "Provide Help Text..."
                                                                                    ),
                                                                                }}
                                                                            ></span>
                                                                        }
                                                                    </Popover.Content>
                                                                </Popover>
                                                            }
                                                        >
                                                            <Icon iconName="Info" className="cursor-pointer mx-2 info-comment-icon" />
                                                        </OverlayTrigger>
                                                        <OverlayTrigger
                                                            trigger="click"
                                                            placement={"top"}
                                                            show={this.props.helpTextEditorID === question.ID}
                                                            onExit={() => this.saveSectionQuestion(question.ID, 0)}
                                                            overlay={
                                                                <Popover id="popover-basic" className="popover-basic">
                                                                    <span className="d-flex flex-row justify-content-between gray">
                                                                        <Popover.Title as="h3">Edit Help Text</Popover.Title>
                                                                        <Icon
                                                                            iconName="CheckMark"
                                                                            className="cursor-pointer mt-2 mb-2 mr-3 check-green"
                                                                            onClick={() => {this.props.updateHelpTextEditorID(0);}}
                                                                        />
                                                                    </span>
                                                                    <Popover.Content>
                                                                        <RichTextEditor
                                                                            fieldType="note"
                                                                            questionId={question.ID}
                                                                            value={question.Notes}
                                                                            handleChange={this.onQuestioninputChange}
                                                                            onBlur={() => this.saveSectionQuestion(question.ID, question.ID)}
                                                                        />
                                                                    </Popover.Content>
                                                                </Popover>
                                                            }
                                                        >
                                                            <Icon iconName="Edit" className="cursor-pointer mx-2" title={"Edit Help Text"} onClick={() => {this.props.updateHelpTextEditorID(question.ID); }} />
                                                        </OverlayTrigger>
                                                    </div>

                                                    <div className="col pr-1 p-0 text-right">
                                                        { this.state.activeSection && this.state.activeSection.SurveyQuestions && this.state.activeSection.SurveyQuestions.length == 1 ? (
                                                                <Icon iconName="Delete" title="Delete" data-toggle="modal" onClick={() => {this.props.updateHelpTextEditorID(0);}} data-target="#sectionManditory" className="ms-IconExample my-auto" />
                                                            ) : (
                                                                <Icon
                                                                    iconName="Delete"
                                                                    title="Delete"
                                                                    onClick={() => {
                                                                        this.setState({ activeQuestion: question  }, ()=>{
                                                                             this.props.updateHelpTextEditorID(0);                                                                  
                                                                        });
                                                                    }}
                                                                    data-toggle="modal"
                                                                    data-target="#question_deleteConfirmation"
                                                                    className="ms-IconExample my-auto"
                                                                />
                                                            )}
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        }
                                    </div>

                                    <div className="question-options my-2 mx-3 row col-12">
                                        {this.renderOptions(question, `${(parentindex ? parentindex + ". " : "") + (questionIndex + 1)}`)}
                                        <a className="btn add-option" onClick={() => this.addNewOption(question)}>
                                            <i className="fa fa-plus-circle mr-2" aria-hidden="true"></i>Add Option
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </DragContentComponent>
                    </div>
                </DropContentComponent>
            </div>
        );
    }

    render() {
        return (        
            <div className="row sections col-12 pr-0">
                {console.log("tester after render")}
                {this.state.isLoading && <Loader />}
                <div className={`col-2 pl-0 ${this.state.survey && this.state.survey.Sections && this.state.survey.Sections.length == 0 ? "sections-list-none" : "sections-list"}`}>
                    <div
                        className="card col-12 p-0"
                        ref={(ele) => {
                            this.endOfSectionsList = ele;
                        }}
                    >
                        {this.state.survey &&
                            this.state.survey.Sections &&
                            !!this.state.survey.Sections.length &&
                            this.state.survey.Sections.map((sec, i) => {
                                return (
                                    <DndProvider backend={HTML5Backend}>
                                        <div className="section-list-drop-box">
                                            <DropContentComponent dropTo={this.swapSection.bind(this)} targetData={{ index: i }}>
                                                <div className="sectionDropContainer">
                                                    <DragContentComponent dropContainer={"section-list-drop-box"} srcData={{ index: i }}>
                                                        <div
                                                            onClick={() => this.switchSurveySection(i)}
                                                            className={`section-title show-ellipses ${
                                                                this.state.activeSection && this.state.activeSection.ID == sec.ID ? "active-section-selected" : ""
                                                                }`}
                                                            title={`${i + 1}. ${sec.Name}`}
                                                        >
                                                            <label className="lbl-title">{`${i + 1}. ${sec.Name}`}</label>
                                                        </div>
                                                    </DragContentComponent>
                                                </div>
                                            </DropContentComponent>
                                        </div>
                                    </DndProvider>
                                );
                            })}
                    </div>
                    <div className="col-12 text-center p-0">
                        <button className="btn btn-primary col-12" onClick={() => this.saveSection({}, true, true)}>
                            <i className="fa fa-plus-circle mr-2" aria-hidden="true"></i>Add New Section
                        </button>
                    </div>
                </div>
                <DndProvider backend={HTML5Backend}>
                    <div className="col-10 p-0">
                        {this.state.survey && this.state.survey.Sections && this.state.survey.Sections.length && this.state.activeSection && this.state.activeSection.ID ? (
                            <div className="survey-section">
                                <div className="card">
                                    <SectionDetails
                                        sections={this.state.survey.Sections}
                                        activeSection={this.state.activeSection}
                                        surveyStatus={this.state.survey.Status}
                                        savesection={this.saveSection.bind(this)}
                                        survey={this.props.survey}
                                        closeHelpTextEditor={() => { this.props.updateHelpTextEditorID(0); }}        
                                        showError = {this.props.showError}
                                    />
                                    <div className="card-body question-box-shadow questions-container">
                                        <DropAddQuestionComponent saveQuestion={this.saveQuestion.bind(this)} parentQuestion={null}>
                                            {console.log("tester")}
                                            {this.state.activeSection && this.state.activeSection.SurveyQuestions && this.state.activeSection.SurveyQuestions.length ? (
                                                this.state?.activeSection?.SurveyQuestions.filter((_) => !!!_.ParentQuestionID).map((question: ISurveyQuestion, index: number) => {
                                                    // return this.renderNestedQuestions(question, null, index); //problem here
                                                })
                                            ) : (
                                                    <div className="col-12 text-center">No questions added yet..!</div>
                                                )}
                                            <button className="btn btn-primary col-12 mt-3" onClick={() => this.saveQuestion({}, 0, 0, true)}>
                                                <i className="fa fa-plus-circle mr-2" aria-hidden="true"></i>Add New Question
                                            </button>
                                        </DropAddQuestionComponent>
                                    </div>
                                    <div className="card-footer">
                                        <div className="row mx-1">
                                            <div className="form-group col-6 text-left m-0 p-0">
                                                {this.state.survey &&
                                                    this.state.survey.Sections &&
                                                    this.state.survey.Sections.findIndex((_) => this.state.activeSection && _.ID == this.state.activeSection.ID) > 0 ? (
                                                        <button className="btn btn-primary px-4" onClick={() => this.toggleSurveys(false)}>
                                                            Previous
                                                        </button>
                                                    ) : null}
                                            </div>
                                            <div className="form-group col-6 text-right m-0 p-0">
                                                {this.state.survey &&
                                                    this.state.survey.Sections &&
                                                    this.state.activeSection &&
                                                    this.state.survey.Sections.findIndex((_) => _.ID == this.state.activeSection.ID) < this.state.survey.Sections.length - 1 ? (
                                                        <button className="btn btn-primary px-4" onClick={() => this.toggleSurveys(true)}>
                                                            Next
                                                        </button>
                                                    ) : (
                                                        ""
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                                <div className="survey-no-section">No sections added yet..!</div>
                            )}
                    </div>
                </DndProvider>
                <ConfirmationPopupComponent
                    popupid="section_deleteConfirmation"
                    confirmationText="Are you sure you want to delete?"
                    onCancel={this.onCancel.bind(this)}
                    onConfirm={this.deleteSection.bind(this)}
                />
                <ConfirmationPopupComponent
                    popupid="question_deleteConfirmation"
                    confirmationText="Are you sure you want to delete?"
                    onCancel={this.onCancel.bind(this)}
                    onConfirm={this.deleteQuestion.bind(this)}
                />
            </div>
        );
    }
}
