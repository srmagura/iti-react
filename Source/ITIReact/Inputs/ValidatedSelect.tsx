import * as React from "react";
import {
  withValidation,
  IWithValidationInjectedProps,
  ValidationFeedback,
  Validator,
  Validators
} from "..";
import Select from "react-select";
import { partition, flatten } from "lodash";
import * as Color from "color";

function getSelectStyles(valid: boolean, showValidation: boolean) {
  return {
    control: (base: any, state: any) => {
      // hard-coded Bootstrap primary color
      // if ValidatedSelect becomes part of iti-react, this needs to be moved to
      // a context variable
      const primaryColor = new Color("hsl(38, 30%, 53%)");
      const dangerColor = new Color("#dc3545");
      const successColor = new Color("#28a745");

      let borderColor = primaryColor.lighten(0.25);
      let boxShadowColor = primaryColor.alpha(0.25);

      if (showValidation) {
        borderColor = valid ? successColor : dangerColor;
        boxShadowColor = borderColor.alpha(0.25);
      }

      const styles: any = {
        ...base,
        backgroundColor: "white"
      };

      if (showValidation) {
        styles.borderColor = borderColor.toString();
        styles["&:hover"].borderColor = borderColor.toString();
      }

      if (state.isFocused) {
        styles.borderColor = borderColor.toString();
        styles["&:hover"].borderColor = borderColor.toString();
        styles.boxShadow = `0 0 0 0.2rem ${boxShadowColor.toString()}`;
      }

      return styles;
    }
  };
}

export type SelectValue = string | number | null;

interface IOption {
  value: string | number;
  label: string;
}

interface IGroupOption {
  label: string;
  options: IOption[];
}

interface IValidatedSelectOwnProps extends React.Props<any> {
  options: (IOption | IGroupOption)[];
  isClearable?: boolean;
  placeholder?: string;
}

type IValidatedSelectProps = IValidatedSelectOwnProps &
  IWithValidationInjectedProps<SelectValue>;

class _ValidatedSelect extends React.Component<IValidatedSelectProps> {
  onChange = (option: IOption | null) => {
    const { onChange } = this.props;
    const newValue = option ? option.value : null;

    onChange(newValue);
  };

  render() {
    const {
      options,
      value,
      valid,
      invalidFeedback,
      showValidation,
      name,
      isClearable,
      placeholder
    } = this.props;

    let [groupOptions, nonGroupOptions] = partition(
      options,
      o => typeof (o as any).value === "undefined"
    ) as [IGroupOption[], IOption[]];
    nonGroupOptions = [
      ...nonGroupOptions,
      ...flatten<IOption>(groupOptions.map(go => go.options))
    ];

    let selectValue = null;
    if (value) {
      selectValue = nonGroupOptions.find(o => o.value === value)!;
    }

    return (
      <ValidationFeedback
        valid={valid}
        invalidFeedback={invalidFeedback}
        showValidation={showValidation}
      >
        <Select
          name={name}
          options={options}
          placeholder={placeholder}
          value={selectValue}
          onChange={this.onChange}
          isClearable={isClearable}
          styles={getSelectStyles(valid, showValidation)}
        />
      </ValidationFeedback>
    );
  }
}

export const options = {
  defaultValue: null
};

export const ValidatedSelect = withValidation<
  IValidatedSelectOwnProps,
  SelectValue
>(options)(_ValidatedSelect);

function required(): Validator<SelectValue> {
  return (value: SelectValue) => ({
    valid: value !== null,
    invalidFeedback: Validators.required()("").invalidFeedback
  });
}

export const SelectValidators = {
  required
};
