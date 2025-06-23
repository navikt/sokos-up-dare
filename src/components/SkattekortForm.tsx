import React from "react";
import {
  Box,
  HStack,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@navikt/ds-react";
import { skattetabeller } from "../types/Oppdragsbeskrivelse";
import { Skattetrekk } from "../types/Skattetrekk";

type Props = {
  skattekort: Skattetrekk;
  update: (skattekort: Skattetrekk) => void;
};

const SkattekortForm: React.FC<Props> = ({ skattekort, update }) => {
  const setVal = (value: string) => {
    update({
      ...skattekort,
      skattetrekkType: value as "tabelltrekk" | "prosenttrekk",
    });
  };

  return (
    <HStack gap={"10"} justify={"space-between"} align={"start"}>
      <RadioGroup
        legend="Trekktype"
        value={skattekort.skattetrekkType}
        onChange={setVal}
      >
        <Radio value="tabelltrekk">Tabell</Radio>
        <Radio value="prosenttrekk">Prosent</Radio>
      </RadioGroup>
      <Box width={"120px"} height={"100px"}>
        {skattekort.skattetrekkType === "tabelltrekk" ? (
          <Select
            label={"Tabell"}
            value={skattekort.tabellNummer}
            onChange={(e) =>
              update({ ...skattekort, tabellNummer: e.target.value })
            }
          >
            {skattetabeller.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        ) : (
          <TextField
            label="Prosentsats"
            type={"number"}
            value={skattekort.prosentSats}
            onChange={(e) =>
              update({ ...skattekort, prosentSats: e.target.value })
            }
          ></TextField>
        )}
      </Box>
    </HStack>
  );
};

export default SkattekortForm;
