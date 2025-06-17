import React from "react";
import { Box, Heading } from "@navikt/ds-react";
import styles from "./TemplatePage.module.css";

export const Oppdrag = () => {
  return (
    <>
      <div className={styles["template-body"]}>
        <div className={styles["template-header"]}>
          <Heading spacing level="1" size="large">
            Oppdragstester. Her kommer det mer etterhvert.
          </Heading>
        </div>

        <Box
          padding="6"
          borderRadius="xlarge"
          borderColor="border-subtle"
          borderWidth="1"
        ></Box>
      </div>
    </>
  );
};
