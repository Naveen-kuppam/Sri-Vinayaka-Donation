import "./Home.css";
import vinayakudu2 from "/2.jpg";
import { useState, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import API from "./api";

function Home() {
  // =====================================
  // SENDER NUMBER
  // ENTERED WHEN PROJECT OPENS
  // =====================================

  const [senderNumber, setSenderNumber] = useState("");
  const [senderConfirmed, setSenderConfirmed] = useState(false);

  // =====================================
  // DONATION FORM
  // =====================================

  const [Name, setName] = useState("");
  const [Amount, setAmount] = useState("");
  const [Phone, setPhone] = useState("");

  const [submittedData, setSubmittedData] =
    useState(null);

  const successRef = useRef(null);

  // =====================================
  // FORMAT PHONE NUMBER
  // =====================================

  const formatIndianNumber = (number) => {
    let value = String(number || "");

    value = value.replace(/\D/g, "");

    if (value.startsWith("0")) {
      value = value.substring(1);
    }

    if (value.startsWith("91") && value.length === 12) {
      return value;
    }

    if (value.length === 10) {
      return "91" + value;
    }

    return value;
  };

  // =====================================
  // CONFIRM SENDER NUMBER
  // =====================================

  const confirmSenderNumber = (e) => {
    e.preventDefault();

    const formatted =
      formatIndianNumber(senderNumber);

    if (formatted.length !== 12) {
      alert(
        "Please enter a valid 10 digit Indian mobile number"
      );
      return;
    }

    setSenderNumber(formatted);

    setSenderConfirmed(true);
  };

  // =====================================
  // SUBMIT DONATION
  // =====================================

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!senderNumber) {
      alert("Sender number is required");
      return;
    }

    const receiverNumber =
      formatIndianNumber(Phone);

    if (receiverNumber.length !== 12) {
      alert(
        "Please enter a valid 10 digit receiver number"
      );
      return;
    }

    // =================================
    // DATA SAVED TO API
    // =================================

    const Vinayaka = {
      Name: Name,
      Amount: Amount,
      Phone: Phone,
      SenderNumber: senderNumber,
    };

    try {
        const res = await axios.post(
    `${API}/Vinayaka`,
    Vinayaka
  );
      

      setSubmittedData({
        ...res.data,
        Name: Name,
        Amount: Amount,
        Phone: Phone,
        SenderNumber: senderNumber,
      });

    } catch (error) {
      console.log(error);

      alert("Data was not saved");
    }
  };

  // =====================================
  // CREATE WHATSAPP / SMS MESSAGE
  // =====================================

  const createMessage = () => {
    return `🙏 *శ్రీ వినాయకచవితి చందా* 🙏

━━━━━━━━━━━━━━━
👤 *పేరు:* ${submittedData.Name} 
💰 *చందా:* ₹${submittedData.Amount}
━━━━━━━━━━━━━━━

✅ *చందా విజయవంతంగా నమోదు చేయబడింది*

📍 *ఎగువమచిరెడ్డిగారిపల్లి*

🙏 *శ్రీ వినాయకుని ఆశీస్సులు మీపై ఉండాలని కోరుకుంటున్నాము* 🙏

✨ *ధన్యవాదాలు* 🙏`;
  };

  // =====================================
  // WHATSAPP
  // =====================================

  const sendWhatsApp = async () => {
    try {
      if (!submittedData) {
        alert("Donation data not found");
        return;
      }

      if (!successRef.current) {
        alert("Success card not found");
        return;
      }

      // =================================
      // GENERATE IMAGE
      // =================================

      const canvas = await html2canvas(
        successRef.current,
        {
          scale: 2,
          backgroundColor: "#321f1d",
          useCORS: true,
          allowTaint: false,
        }
      );

      // =================================
      // CREATE PNG
      // =================================

      const blob = await new Promise(
        (resolve) => {
          canvas.toBlob(
            resolve,
            "image/png",
            1.0
          );
        }
      );

      if (!blob) {
        alert("Image was not generated");
        return;
      }

      // =================================
      // DOWNLOAD IMAGE
      // =================================

      const imageUrl =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = imageUrl;

      link.download =
        "Vinayaka-Chanda.png";

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      // =================================
      // RECEIVER NUMBER
      // FROM FORM
      // =================================

      const receiverNumber =
        formatIndianNumber(
          submittedData.Phone
        );

      if (receiverNumber.length !== 12) {
        alert(
          "Invalid receiver number"
        );

        URL.revokeObjectURL(imageUrl);

        return;
      }

      // =================================
      // MESSAGE
      // =================================

      const message =
        createMessage();

      // =================================
      // WHATSAPP
      // =================================

      const whatsappUrl =
        `https://wa.me/${receiverNumber}?text=${encodeURIComponent(
          message
        )}`;

      window.location.href =
        whatsappUrl;

      // =================================
      // CLEAN URL
      // =================================

      setTimeout(() => {
        URL.revokeObjectURL(imageUrl);
      }, 3000);

    } catch (error) {
      console.log(error);

      alert(
        "WhatsApp could not be opened"
      );
    }
  };

  // =====================================
  // SMS
  // =====================================

  const sendSMS = () => {
    try {
      if (!submittedData) {
        alert("Donation data not found");
        return;
      }

      // =================================
      // RECEIVER NUMBER
      // =================================

      const receiverNumber =
        formatIndianNumber(
          submittedData.Phone
        );

      if (receiverNumber.length !== 12) {
        alert(
          "Invalid receiver number"
        );

        return;
      }

      // =================================
      // MESSAGE
      // =================================

      const message =
        createMessage();

      // =================================
      // SMS URL
      // =================================

      const smsUrl =
        `sms:${receiverNumber}?body=${encodeURIComponent(
          message
        )}`;

      window.location.href =
        smsUrl;

    } catch (error) {
      console.log(error);

      alert(
        "SMS could not be opened"
      );
    }
  };

  // =====================================
  // NEW DONATION
  // =====================================

  const newDonation = () => {
    setSubmittedData(null);

    setName("");
    setAmount("");
    setPhone("");

    // Sender number remains the same
    // for this project session.
  };

  // =====================================
  // CHANGE SENDER NUMBER
  // =====================================

  const changeSenderNumber = () => {
    setSenderConfirmed(false);

    setSenderNumber("");

    setSubmittedData(null);

    setName("");
    setAmount("");
    setPhone("");
  };

  // =====================================
  // RETURN
  // =====================================

  return (
    <div className="home-container">

      <div className="donation-card">

        {/* =================================
            PROJECT OPEN
            SENDER NUMBER
        ================================= */}

        {!senderConfirmed && (

          <div className="sender-box">

            <img
              src={vinayakudu2}
              alt="Vinayakudu"
              className="vinayakudu-img"
            />

            <div className="heading">

              <h1>
                శ్రీ వినాయకచవితి చందా
              </h1>

              <h2>
                ఎగువమచిరెడ్డిగారిపల్లి
              </h2>

            </div>

            <form
              onSubmit={
                confirmSenderNumber
              }
            >

              <div className="form-group">

                <label>
                  మీ WhatsApp / SMS నంబర్
                </label>

                <input
                  type="tel"
                  placeholder="మీ నంబర్ నమోదు చేయండి.."
                  value={senderNumber}
                  onChange={(e) =>
                    setSenderNumber(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

              <button type="submit">
                కొనసాగించండి
              </button>

            </form>

          </div>

        )}

        {/* =================================
            DONATION FORM
        ================================= */}

        {senderConfirmed &&
          !submittedData && (

            <>

              <img
                src={vinayakudu2}
                alt="Vinayakudu"
                className="vinayakudu-img"
              />

              <div className="heading">

                <h1>
                  శ్రీ వినాయకచవితి చందా
                </h1>

                <h2>
                  ఎగువమచిరెడ్డిగారిపల్లి
                </h2>

              </div>

              <form
                onSubmit={submitHandler}
              >

                {/* NAME */}

                <div className="form-group">

                  <label>
                    పేరు
                  </label>

                  <input
                    type="text"
                    placeholder="పేరు నమోదు చేయండి.."
                    value={Name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                {/* AMOUNT */}

                <div className="form-group">

                  <label>
                    చందా
                  </label>

                  <input
                    type="text"
                    placeholder="చందా రాయండి.."
                    value={Amount}
                    onChange={(e) =>
                      setAmount(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                {/* RECEIVER */}

                <div className="form-group">

                  <label>
                    ఫోన్ నంబర్
                  </label>

                  <input
                    type="tel"
                    placeholder="రిసీవర్ ఫోన్ నంబర్ రాయండి.."
                    value={Phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>

                <button type="submit">
                  సమర్పించండి
                </button>

              </form>

            </>

          )}

        {/* =================================
            SUCCESS CARD
        ================================= */}

        {submittedData && (

          <>

            <div
              ref={successRef}
              className="success-box"
            >

              {/* VINAYAKA IMAGE */}

              <div
                className="success-circle"
              >

                <img
                  src={vinayakudu2}
                  alt="Vinayakudu"
                />

              </div>

              {/* SUCCESS MESSAGE */}

              <h5>

                చందా
                విజయవంతంగా నమోదు
                చేయబడింది

              </h5>

              {/* DETAILS */}

              <div
                className="donation-details"
              >

                <div
                  className="detail-row"
                >

                  <span>
                    పేరు
                  </span>

                  <strong>
                    {submittedData.Name}
                    {" "}
                  </strong>

                </div>

                <div
                  className="detail-row"
                >

                  <span>
                    చందా
                  </span>

                  <strong>
                    ₹
                    {submittedData.Amount}
                  </strong>

                </div>

                <div
                  className="detail-row"
                >

                  <span>
                    ఫోన్
                  </span>

                  <strong>
                    {submittedData.Phone}
                  </strong>

                </div>

              </div>

              <h3
                className="thank-message"
              >

                🙏 శ్రీ వినాయకుని
                ఆశీస్సులు మీపై ఉండాలని
                కోరుకుంటున్నాము 🙏

              </h3>

            </div>

            {/* =================================
                WHATSAPP
            ================================= */}

            <button
              className="whatsapp-button"
              onClick={sendWhatsApp}
            >
              📱 WhatsApp కి పంపండి
            </button>

            {/* =================================
                SMS
            ================================= */}

            <button
              className="sms-button"
              onClick={sendSMS}
            >
              💬 SMS కి పంపండి
            </button>

            {/* =================================
                NEW DONATION
            ================================= */}

            <button
              className="new-button"
              onClick={newDonation}
            >
              మళ్లీ నమోదు చేయండి
            </button>

            {/* =================================
                CHANGE SENDER
            ================================= */}

            <button
              className="new-button"
              onClick={
                changeSenderNumber
              }
            >
              🔄 Sender Number మార్చండి
            </button>

          </>

        )}

      </div>

    </div>
  );
}

export default Home;