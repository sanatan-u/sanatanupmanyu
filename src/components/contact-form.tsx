"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Submission failed");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const fieldClass =
    "w-full border-b border-rule bg-transparent py-2 outline-none focus:border-accent transition-colors text-ink placeholder:text-ink-3";
  const labelClass = "block text-sm text-ink-3 mb-1";

  return (
    <form onSubmit={onSubmit} className="grid gap-6 max-w-[48ch]">
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />
      <div>
        <label htmlFor="name" className={labelClass}>Name</label>
        <input id="name" name="name" required className={fieldClass} />
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" type="email" name="email" required className={fieldClass} />
      </div>
      <div>
        <label htmlFor="organization" className={labelClass}>Organization <span className="text-ink-3">(optional)</span></label>
        <input id="organization" name="organization" className={fieldClass} />
      </div>
      <div>
        <label htmlFor="message" className={labelClass}>Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${fieldClass} resize-y`}
        />
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="justify-self-start inline-flex items-center gap-2 bg-ink text-white rounded-full px-5 py-2.5 text-sm hover:bg-accent transition-colors disabled:opacity-50"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
        <ArrowRight size={16} strokeWidth={1.75} />
      </button>
      {status === "success" ? (
        <p className="text-accent-ink text-sm">Thanks — I&rsquo;ll be in touch shortly.</p>
      ) : null}
      {status === "error" ? (
        <p className="text-signal text-sm">
          Couldn&rsquo;t send: {errorMessage}. Please email me directly.
        </p>
      ) : null}
    </form>
  );
}
