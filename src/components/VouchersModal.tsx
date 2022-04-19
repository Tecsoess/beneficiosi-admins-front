import { Dialog } from "@material-ui/core";
import { useState, useEffect } from "react";


const VouchersModal = (props: any) => {

    const { voucherImgPath, onClose } = props

    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(voucherImgPath ? true : false);
    }, [voucherImgPath])

    return (
        <Dialog
            open={open}
            keepMounted
            onClose={onClose}
            aria-describedby="dialog-vouchers"
        >
            <img src={voucherImgPath} alt="voucher-image" />
        </Dialog>
    )
}

export default VouchersModal;