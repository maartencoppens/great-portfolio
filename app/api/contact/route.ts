import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactRequestBody = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const resendApiKey = process.env.RESEND_API_KEY;
const contactToEmail = process.env.CONTACT_TO_EMAIL;
const contactFromEmail =
  process.env.CONTACT_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(request: Request) {
  let body: ContactRequestBody;

  try {
    body = (await request.json()) as ContactRequestBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const subject = (body.subject ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 },
    );
  }

  if (message.length < 20) {
    return NextResponse.json(
      { error: "Message must be at least 20 characters." },
      { status: 400 },
    );
  }

  const submission = {
    name,
    email,
    subject,
    message,
    submittedAt: new Date().toISOString(),
  };

  if (!resend || !contactToEmail) {
    console.error("Missing email configuration.", {
      hasResendApiKey: Boolean(resendApiKey),
      hasContactToEmail: Boolean(contactToEmail),
    });

    return NextResponse.json(
      {
        error:
          "Contact form is not configured yet. Please try again later or email me directly.",
      },
      { status: 500 },
    );
  }

  try {
    const subjectLine = subject
      ? `New contact form message: ${subject}`
      : "New contact form message";

    await resend.emails.send({
      from: contactFromEmail,
      to: contactToEmail,
      replyTo: email,
      subject: subjectLine,
      text: [
        "You received a new message from your portfolio contact form.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Project type: ${subject || "Not provided"}`,
        "",
        "Message:",
        message,
        "",
        `Submitted at: ${submission.submittedAt}`,
      ].join("\n"),
    });
  } catch (error) {
    console.error("Failed to send contact email", error);

    return NextResponse.json(
      { error: "Could not send your message right now. Please try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Thanks! I received your message and will reply soon.",
  });
}
