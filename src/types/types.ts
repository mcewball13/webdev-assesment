import { LeadStatus } from "./enums";

export type ILead = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    linkedinProfile: string;
    visasOfInterest: string[];
    resume?: any;
    additionalInfo: string;
    status: LeadStatus;
    createdAt: string;
    updatedAt: string;
}
