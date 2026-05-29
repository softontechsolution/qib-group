import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const data = event.data;

    const reference = data.reference;

    if (!reference?.startsWith("INS-NPF-")) {
      return NextResponse.json({ error: "Invalid reference" }, { status: 400 });
    }

    // ================================
    // STEP 1: VERIFY PAYMENT
    // ================================
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json({ error: "Payment not verified" }, { status: 400 });
    }

    // ================================
    // STEP 2: EXTRACT METADATA
    // ================================
    const metadata = data.metadata || {};
    const registrationId = metadata.registrationId;

    if (!registrationId) {
      return NextResponse.json({ error: "Missing registration ID" }, { status: 400 });
    }

    // ================================
    // STEP 3: GET COUNTER (Strapi)
    // ================================
    const counterRes = await fetch(
      `${process.env.STRAPI_URL}/api/system-counter/next`,
      { method: "POST" }
    );

    const counterData = await counterRes.json();
    const counter = String(counterData.value).padStart(5, "0");
    const year = new Date().getFullYear().toString().slice(-2);

    // ================================
    // STEP 4: GENERATE NUMBERS
    // ================================
    const policyNumber = `NPF/EMPT/QIB/${year}/021${counter}`;
    const certificateNumber = `WAX${year}/021${counter}`;

    // ================================
    // STEP 5: UPDATE STRAPI (STATE ONLY)
    // ================================
    await fetch(
      `${process.env.STRAPI_URL}/api/motor-insurance-registrations/${registrationId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            paymentStatus: "paid",
            policyStatus: "processing",
            paymentReference: reference,
            policyNumber,
            certificateNumber,
          },
        }),
      }
    );

    // ================================
    // STEP 6: TRIGGER BACKGROUND JOB
    // ================================
    await fetch(
      `${process.env.STRAPI_URL}/api/certificate-jobs/process`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId,
        }),
      }
    );

    return NextResponse.json({
      success: true,
      policyNumber,
      certificateNumber,
      status: "processing_started",
    });

  } catch (error) {
    console.error("Webhook error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}