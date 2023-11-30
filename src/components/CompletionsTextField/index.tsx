import {
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItem,
  OutlinedInput,
  OutlinedInputProps,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { CompletionsList, Container } from './CompletionsTextField.styled';

interface GenericTypeConstraint {
  id: number | string;
}

interface Props<T extends GenericTypeConstraint> extends OutlinedInputProps {
  value: string;
  onClear?: () => void;
  completions?: T[];
  helperText?: string;
  loading?: boolean;
  completionsListElementRenderer: (element: T) => React.ReactNode;
  showNoCompletionsHint?: boolean;
  noCompletionsHintRenderer?: () => React.ReactNode;
}

export const CompletionsTextField = <T extends GenericTypeConstraint>({
  onClear,
  completions = [],
  helperText,
  loading,
  completionsListElementRenderer,
  showNoCompletionsHint,
  noCompletionsHintRenderer,
  ...inputProps
}: Props<T>) => {
  const {
    id,
    label,
    value,
    onChange,
    name,
    fullWidth,
    placeholder,
    error,
    autoFocus,
  } = inputProps;

  return (
    <Container>
      <FormControl fullWidth={fullWidth} error={error}>
        {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
        <OutlinedInput
          id={id}
          value={value}
          onChange={onChange}
          label={label}
          name={name}
          autoFocus={autoFocus}
          placeholder={placeholder}
          endAdornment={
            loading ? (
              <InputAdornment position='end'>
                <CircularProgress size={24} />
              </InputAdornment>
            ) : (
              onClear && (
                <InputAdornment position='end'>
                  <IconButton onClick={onClear} edge='end'>
                    {!!value && value.length > 0 && <ClearIcon />}
                  </IconButton>
                </InputAdornment>
              )
            )
          }
        />
        {error && helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
      {(completions.length > 0 ||
        (showNoCompletionsHint && noCompletionsHintRenderer)) && (
        <CompletionsList>
          {completions.map((completion) => (
            <ListItem disablePadding key={completion.id}>
              {completionsListElementRenderer(completion)}
            </ListItem>
          ))}
          {showNoCompletionsHint && noCompletionsHintRenderer && (
            <ListItem disablePadding>{noCompletionsHintRenderer()}</ListItem>
          )}
        </CompletionsList>
      )}
    </Container>
  );
};
