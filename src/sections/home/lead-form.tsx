import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Stack,
    Button,
    FormControl,
    FormHelperText,
    Typography,
} from "@mui/material";

// components
import FormProvider from "../../components/hook-form/form-provider";
import RHFTextField from "../../components/hook-form/rhf-text-field";
import { RHFMultiCheckbox } from "../../components/hook-form/rhf-checkbox";
import { useFormContext, Controller } from 'react-hook-form';

// ----------------------------------------------------------------------

interface RHFUploadProps {
    name: string;
    accept?: string;
    helperText?: string;
}

function RHFUpload({ name, accept, helperText }: RHFUploadProps) {
    const { control, setValue } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ fieldState: { error } }) => (
                <FormControl error={!!error} required fullWidth>
                    <input
                        type="file"
                        onChange={(e) => setValue(name, e.target.files)}
                        accept={accept}
                        style={{ display: "none" }}
                        id={`${name}-upload`}
                    />
                    <Button
                        variant="outlined"
                        component="label"
                        htmlFor={`${name}-upload`}
                        fullWidth
                    >
                        Upload Resume/CV
                    </Button>
                    <FormHelperText>
                        {(!!error || helperText) && (
                            error ? error?.message : helperText
                        )}
                    </FormHelperText>
                </FormControl>
            )}
        />
    );
}

const MAX_FILE_SIZE = 5000000; // 5MB
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
    additionalInfo: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function LeadForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const onSubmit = async (data: FormData) => {
        try {
            setIsSubmitting(true);
            // Here you would typically send the data to your backend
            console.log(data);
            // Reset form or show success message
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
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
        </FormProvider>
    );
}
