import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Button, FormControl, FormHelperText } from '@mui/material';

// ----------------------------------------------------------------------

interface RHFUploadProps {
  name: string;
  accept?: string;
  helperText?: React.ReactNode;
}

export function RHFUpload({ name, accept, helperText }: RHFUploadProps) {
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
            style={{ display: 'none' }}
            id={`${name}-upload`}
          />
          <Button
            variant="outlined"
            component="label"
            htmlFor={`${name}-upload`}
            fullWidth
          >
            Upload File
          </Button>
          {(!!error || helperText) && (
            <FormHelperText error={!!error}>
              {error ? error?.message : helperText}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}
