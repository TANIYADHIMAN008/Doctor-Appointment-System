import { QRCodeCanvas } from "qrcode.react";

function PaymentPage() {

  const doctorUPI = "doctor@upi";
  const amount = 500;

  const paymentLink = `upi://pay?pa=${doctorUPI}&pn=Doctor&am=${amount}&cu=INR`;

  return (

    <div>

      <h2>Doctor Registration Fee</h2>

      <p>Amount: ₹{amount}</p>

      <QRCodeCanvas value={paymentLink} size={200} />

      <p>Scan QR to Pay</p>

    </div>

  );
}

export default PaymentPage;