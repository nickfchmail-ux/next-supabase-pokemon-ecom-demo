"use client";

import Button from "@mui/material/Button";
import Logo from "../_component/Logo";
import { Modal, Open, Window } from "../_component/Modal";
import RegistrationForm from "../_component/RegistrationForm";

export default function Page() {
  return (
    <div className="">
      <h1 className="">something here...</h1>
      <Modal>
        <Open name={"test"}>
          <Button variant="text">Text</Button>
        </Open>
        <Window name={"test"}>
          <RegistrationForm />
        </Window>

        <Open name={"logo"}>
          <Button variant="text">Text</Button>
        </Open>
        <Window name={"logo"}>
          <Logo />
        </Window>
      </Modal>
    </div>
  );
}
