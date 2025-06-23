import React from "react";
import { DatePicker, useDatepicker } from "@navikt/ds-react";
import formatDate from "../util/date";

type Props = {
  value: string;
  label: string;
  update: (value: string) => void;
};

const DatoFelt: React.FC<Props> = ({ label, value, update }) => {
  const { datepickerProps, inputProps } = useDatepicker({
    onDateChange: (d) => {
      update(formatDate(d) || "");
    },
    defaultSelected: new Date(value),
  });
  return (
    <DatePicker {...datepickerProps}>
      <DatePicker.Input {...inputProps} label={label} />
    </DatePicker>
  );
};

export default DatoFelt;
