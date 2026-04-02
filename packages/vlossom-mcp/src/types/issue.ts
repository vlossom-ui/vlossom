export type IssueType = "bug" | "feature" | "question";

export type IssueLanguage = "ko" | "en";

export interface IssueSection {
    heading: string;
    placeholder: string;
    required: boolean;
}

export interface IssueDraft {
    suggestedTitle: string;
    type: IssueType;
    language: IssueLanguage;
    sections: IssueSection[];
}

export interface SectionContent {
    heading: string;
    content: string;
}
