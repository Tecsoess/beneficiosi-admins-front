import { CircularProgress, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { useEffect } from "react";

type autoCompletePropsType = {
    loading: boolean;
    options: any[];
    open?: boolean;
    onClose?: () => void;
    onOpen?: () => void;
    onChange?: (e: any, value: any) => void;
    textFieldInputProps?: {
        variant?: "outlined" | "filled" | "standard" | undefined;
        label?: string;
        name?: string;
        error?: boolean;
        helperText?: any;
        value?: any
    },
    onInputChange: (e: any) => void;
    value: any;
    getOptionSelected: ((option: any, value: any) => boolean) | undefined;
    getOptionLabel: ((option: any) => string) | undefined;
    style?: React.CSSProperties | undefined;
}

const CustomAutoComplete = (props: autoCompletePropsType) => {

    const {
        style,
        loading,
        options,
        open,
        onClose,
        onOpen,
        textFieldInputProps,
        onChange,
        value,
        getOptionSelected,
        getOptionLabel,
        onInputChange
    } = props;

    return (
        <Autocomplete
            style={style}
            open={open}
            onChange={onChange}
            value={value}
            onOpen={onOpen}
            onClose={onClose}
            getOptionSelected={getOptionSelected}
            getOptionLabel={getOptionLabel}
            options={options}
            loading={loading}
            onInputChange={onInputChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    error={textFieldInputProps?.error}
                    helperText={textFieldInputProps?.helperText}
                    name={textFieldInputProps?.name}
                    label={textFieldInputProps?.label}
                    variant={textFieldInputProps?.variant ? textFieldInputProps.variant : "outlined"}
                    value={textFieldInputProps?.value}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    )
}

export default CustomAutoComplete;