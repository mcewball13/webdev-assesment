import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Box,
    Stack,
    TextField,
    Button,
    MenuItem,
    FormControl,
    FormHelperText,
    InputLabel,
    Select,
    OutlinedInput,
} from "@mui/material";

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const visaOptions = [
    "Student Visa",
    "Work Visa",
    "Tourist Visa",
    "Business Visa",
    "Permanent Residency",
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

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
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
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={3}>
                <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="First Name"
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                            fullWidth
                            required
                        />
                    )}
                />

                <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Last Name"
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                            fullWidth
                            required
                        />
                    )}
                />

                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            type="email"
                            label="Email"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            fullWidth
                            required
                        />
                    )}
                />

                <Controller
                    name="linkedinProfile"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="LinkedIn Profile"
                            error={!!errors.linkedinProfile}
                            helperText={errors.linkedinProfile?.message}
                            fullWidth
                            required
                            placeholder="https://linkedin.com/in/your-profile"
                        />
                    )}
                />

                <Controller
                    name="visasOfInterest"
                    control={control}
                    render={({ field }) => (
                        <FormControl error={!!errors.visasOfInterest} required fullWidth>
                            <InputLabel>Visas of Interest</InputLabel>
                            <Select
                                {...field}
                                multiple
                                input={<OutlinedInput label="Visas of Interest" />}
                            >
                                {visaOptions.map((visa) => (
                                    <MenuItem key={visa} value={visa}>
                                        {visa}
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                {errors.visasOfInterest?.message}
                            </FormHelperText>
                        </FormControl>
                    )}
                />

                <Controller
                    name="resume"
                    control={control}
                    render={({ field: { ref, ...field } }) => (
                        <FormControl error={!!errors.resume} required fullWidth>
                            <input
                                type="file"
                                onChange={(e) => field.onChange(e.target.files)}
                                accept=".pdf,.doc,.docx"
                                style={{ display: "none" }}
                                id="resume-upload"
                                ref={ref}
                            />
                            <Button
                                variant="outlined"
                                component="label"
                                htmlFor="resume-upload"
                                fullWidth
                            >
                                Upload Resume/CV
                            </Button>
                            <FormHelperText>
                                {typeof errors.resume?.message === 'string'
                                    ? errors.resume.message
                                    : "Accepted formats: PDF, DOC, DOCX (max 5MB)"}
                            </FormHelperText>
                        </FormControl>
                    )}
                />

                <Controller
                    name="additionalInfo"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Additional Information"
                            multiline
                            rows={4}
                            error={!!errors.additionalInfo}
                            helperText={errors.additionalInfo?.message}
                            fullWidth
                        />
                    )}
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
        </Box>
    );
}
