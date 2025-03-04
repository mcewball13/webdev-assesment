import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Stack,
    Button,
    Typography,
} from "@mui/material";

// components
import LeadFormSuccess from "./lead-form-success";
import { RHFUpload } from "../../components/hook-form";
import FormProvider from "../../components/hook-form/form-provider";
import RHFTextField from "../../components/hook-form/rhf-text-field";
import { RHFMultiCheckbox } from "../../components/hook-form/rhf-checkbox";
import { postLead } from "../../api/leads";
import { ILead } from "../../types/types";

// ----------------------------------------------------------------------

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const visaOptions = [
    { label: "Student Visa", value: "Student Visa" },
    { label: "Work Visa", value: "Work Visa" },
    { label: "Tourist Visa", value: "Tourist Visa" },
    { label: "Business Visa", value: "Business Visa" },
    { label: "Permanent Residency", value: "Permanent Residency" },
];

const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    linkedinProfile: z
        .string()
        .url("Invalid URL")
        .regex(/linkedin\.com/, { message: "Must be a LinkedIn URL" }),
    visasOfInterest: z
        .array(z.string())
        .min(1, "Please select at least one visa type"),
    resume: z
        .any()
        .refine((files) => files?.length === 1, "Resume is required")
        .refine(
            (files) => files?.[0]?.size <= MAX_FILE_SIZE,
            "Max file size is 5MB"
        )
        .refine(
            (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
            "Only .pdf, .doc, and .docx files are accepted"
        ),
    additionalInfo: z.string(),
});

type FormData = z.infer<typeof schema>;

export function LeadForm() {
    const [showSuccess, setShowSuccess] = useState(false);

    const methods = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onBlur",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            linkedinProfile: "",
            visasOfInterest: [],
            additionalInfo: "",
        },
    });

    const { reset, formState: { isSubmitting }, handleSubmit } = methods;

    const onSubmit = async (data: FormData) => {
        try {
            console.log(data);
            const response = await postLead(data);
            console.log('submitted: ', response);
            setShowSuccess(true);
            reset();
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            {showSuccess ? (<LeadFormSuccess />) : (
                <Stack spacing={3} maxWidth="sm" padding={5}>
                    <RHFTextField
                        name="firstName"
                        label="First Name"
                        required
                    />

                    <RHFTextField
                        name="lastName"
                        label="Last Name"
                        required
                    />

                    <RHFTextField
                        name="email"
                        label="Email"
                        required
                    />

                    <RHFTextField
                        name="linkedinProfile"
                        label="LinkedIn Profile"
                        required
                        placeholder="https://linkedin.com/in/your-profile"
                    />

                    <Typography textAlign={"center"} variant="h5">Visas Categories of Interest</Typography>

                    <RHFMultiCheckbox
                        name="visasOfInterest"
                        options={visaOptions}
                        row
                    />

                    <RHFUpload
                        name="resume"
                        accept=".pdf,.doc,.docx"
                        helperText="Accepted formats: PDF, DOC, DOCX (max 5MB)"
                    />

                    <Typography textAlign={"center"} variant="h5">How can we help you?</Typography>

                    <RHFTextField
                        name="additionalInfo"
                        label="Additional Information"
                        multiline
                        rows={4}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </Stack>
            )}
        </FormProvider>
    );
}
