import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { site } from "@/content/site";

export const runtime = "nodejs";

type Payload = {
  name?: string;
  email?: string;
  organization?: string;
  message?: string;
  website?: string;
};

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, message } = body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.CONTACT_TO ?? site.emails.personal;
  const from = process.env.CONTACT_FROM ?? user;

  if (!host || !user || !pass) {
    console.warn("[contact] SMTP not configured — logging submission only", {
      name,
      email,
      organization: body.organization,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"${name} via website" <${from}>`,
      to,
      replyTo: `"${name}" <${email}>`,
      subject: `New message from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Organization: ${body.organization ?? "-"}`,
        "",
        message,
      ].join("\n"),
    });
  } catch (err) {
    console.error("[contact] SMTP error", err);
    return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}
