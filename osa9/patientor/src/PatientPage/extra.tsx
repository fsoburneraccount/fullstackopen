import React from "react";
import { Field } from "formik";
import { Form } from "semantic-ui-react";

import { HealthCheckRating } from "../types";

export type HealthCheckOption = {
    value: HealthCheckRating;
    label: string;
};

type SelectFieldProps = {
    name: string;
    label: string;
    options: HealthCheckOption[];
};
  
export const SelectField: React.FC<SelectFieldProps> = ({
    name,
    label,
    options
  }: SelectFieldProps) => (
    <Form.Field>
      <label>{label}</label>
      <Field as="select" name={name} className="ui dropdown">
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label || option.value}
          </option>
        ))}
      </Field>
    </Form.Field>
);