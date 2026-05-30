"use client";

import { useState } from "react";

export default function VerifyPage() {
  const [certificateNumber, setCertificateNumber] =
    useState("");

  const [result, setResult] = useState<any>(null);

  const verify = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/certificate/verify/${certificateNumber}`
    );

    const data = await res.json();

    setResult(data);
  };

  return (
    <div>
      <h1>Verify Insurance Certificate</h1>

      <input
        value={certificateNumber}
        onChange={(e) =>
          setCertificateNumber(e.target.value)
        }
      />

      <button onClick={verify}>
        Verify
      </button>

      {result?.valid && (
        <div>
          <h2>VALID CERTIFICATE</h2>

          <p>
            {result.insuredName}
          </p>

          <p>
            {result.policyNumber}
          </p>
        </div>
      )}
    </div>
  );
}