import { useFormContext } from "react-hook-form";

import { FormHelperText } from "@mui/material";

import { Button } from "@mui/material";

import { FormControl } from "@mui/material";
import { Controller } from "react-hook-form";

interface RHFUploadProps {
  name: string;
  accept: string;
  helperText: string;
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
