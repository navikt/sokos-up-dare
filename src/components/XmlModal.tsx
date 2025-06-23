import React, { RefObject } from "react";
import { BodyLong, Modal } from "@navikt/ds-react";

type Props = {
  content: string;
};

const XmlModal: React.FC<Props & { ref: RefObject<HTMLDialogElement> }> = ({
  content,
  ref,
}) => {
  return (
    <Modal ref={ref} header={{ heading: "XML" }}>
      <Modal.Body>
        <BodyLong>{content}</BodyLong>
      </Modal.Body>
    </Modal>
  );
};

export default XmlModal;
