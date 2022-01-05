import { OverlayTrigger, Popover, Button } from "react-bootstrap"


const Confirm = ({ onConfirm, onDiscard, children, confirmBtnText,
  discardButtonText, content, title }) => {

  const close = () => document.body.click();

  const confirm = () => {
    onConfirm();
    close();
  }

  const discard = () => {
    onDiscard();
    close();
  }

  const popover = (
    <Popover id="popover-basic" className="bg-first shadowed">
      <Popover.Header as="h3" className="bg-second">{title}</Popover.Header>
      <Popover.Body className="txt-bright">
        {content}
        <div style={{ "textAlign": "center" }}>
          <Button
            variant="light"
            className="btn-xs mr-2"
            onClick={discard}
          >
            {discardButtonText}
          </Button>

          <Button
            className="bg-first btn-xs"
            onClick={confirm}
          >
            {confirmBtnText}
          </Button>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <OverlayTrigger rootClose trigger="click" placement="bottom" overlay={popover}>
        {children}
      </OverlayTrigger>
    </>
  )

}

Confirm.defaultProps = {
  onConfirm: () => null,
  onDiscard: () => null,
  confirmBtnText: "OK",
  discardButtonText: "Anuluj",
  children: <Button>press</Button>,
  content: <p>Czy jesteś pewien?</p>,
  title: "Potwierdź akcję",
}

export default Confirm;