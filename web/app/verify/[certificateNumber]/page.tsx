"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function VerifyCertificate() {
  const { certificateNumber } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        `http://localhost:1337/api/certificate/verify/${certificateNumber}`
      );

      const result = await res.json();
      setData(result);
    }

    fetchData();
  }, [certificateNumber]);

  if (!data) return <p>Loading...</p>;

  if (data.status === 404)
    return <p>Certificate not found</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Certificate Verification</h2>

      <p>
        <strong>Status:</strong> {data.policyStatus}
      </p>

      <p>
        <strong>Policy Number:</strong> {data.policyNumber}
      </p>

      <p>
        <strong>Certificate Number:</strong>{" "}
        {data.certificateNumber}
      </p>

      <p>
        <strong>Insured Name:</strong>{" "}
        {data.insuredName}
      </p>

      <p>
        <strong>Vehicle:</strong>{" "}
        {data.vehicleMake} {data.vehicleModel}
      </p>

      <p>
        <strong>Plate Number:</strong>{" "}
        {data.registrationNumber}
      </p>

      <p>
        <strong>Issued On:</strong>{" "}
        {data.issuedOn}
      </p>
    </div>
  );
}