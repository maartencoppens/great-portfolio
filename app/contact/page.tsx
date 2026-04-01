"use client";

import React, { FormEvent, useState } from "react";
import SmallInfoCard from "../components/cards/SmallInfoCard";
import Button from "../components/Button";
import Text from "../components/typography/Text";

type SubmitState = {
  type: "idle" | "success" | "error";
  message: string;
};

const Contact = () => {
  const minimumMessageLength = 20;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageLength, setMessageLength] = useState(0);
  const [submitState, setSubmitState] = useState<SubmitState>({
    type: "idle",
    message: "",
  });
  const remainingCharacters = Math.max(minimumMessageLength - messageLength, 0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitState({ type: "idle", message: "" });

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseBody = (await response.json().catch(() => null)) as {
        message?: string;
        error?: string;
      } | null;

      if (!response.ok) {
        throw new Error(
          responseBody?.error ??
            "Could not send your message right now. Please try again.",
        );
      }

      form.reset();
      setMessageLength(0);
      setSubmitState({
        type: "success",
        message:
          responseBody?.message ??
          "Thanks, your message has been sent successfully.",
      });
    } catch (error) {
      const fallbackMessage =
        "Could not send your message right now. Please try again.";
      setSubmitState({
        type: "error",
        message: error instanceof Error ? error.message : fallbackMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container flex flex-col gap-xl pt-xl pb-xl">
      <div className="flex justify-center items-center flex-col gap-s">
        <SmallInfoCard content="Get in touch" />
        <Text.Header as="h1" className="pt-s">
          <span className="text-accent-primary text-center">Let&apos;s </span>
          create something amazing
        </Text.Header>
      </div>
      <div className="flex justify-center items-center">
        <form
          method="POST"
          onSubmit={handleSubmit}
          className="flex flex-col gap-l w-full md:w-3/4 lg:w-1/2 bg-bg-tertiary p-l sm:p-xl rounded-xl border border-black/5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-m">
            <div className="flex flex-col gap-xs">
              <label htmlFor="name">
                <Text.Label className="text-sm font-medium">
                  Name <span className="text-red-500">*</span>
                </Text.Label>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="John Doe"
                className="bg-bg-primary px-m py-s rounded-md border border-black/10 focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label htmlFor="email">
                <Text.Label className="text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </Text.Label>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="john.doe@example.com"
                className="bg-bg-primary px-m py-s rounded-md border border-black/10 focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-xs">
            <label htmlFor="subject">
              <Text.Label className="text-sm font-medium">Subject</Text.Label>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              autoComplete="off"
              placeholder="Portfolio, landing page, webshop..."
              className="bg-bg-primary px-m py-s rounded-md border border-black/10 focus:outline-none focus:ring-2 focus:ring-accent-primary/50"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label htmlFor="message">
              <Text.Label className="text-sm font-medium">
                Message <span className="text-red-500">*</span>
              </Text.Label>
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              minLength={minimumMessageLength}
              required
              onChange={(event) => setMessageLength(event.target.value.length)}
              placeholder="Tell me about your project goals, timeline, and budget range."
              className="bg-bg-primary px-m py-s rounded-md border border-black/10 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 resize-y"
            ></textarea>
            <Text.Small
              as="p"
              aria-live="polite"
              className={`text-sm ${messageLength >= minimumMessageLength ? "text-green-700" : "text-text-tertiary"}`}
            >
              {messageLength === 0
                ? `Minimum ${minimumMessageLength} characters`
                : messageLength < minimumMessageLength
                  ? `${remainingCharacters} characters left`
                  : "Looks good"}
            </Text.Small>
          </div>

          <div className="flex flex-col gap-s pt-xs border-t border-black/10 justify-center items-center">
            <Text.Small className="text-sm text-text-tertiary leading-relaxed">
              By sending this form, you agree to be contacted about your
              request.
            </Text.Small>
            {submitState.type !== "idle" && (
              <Text.Small
                className={`text-sm ${
                  submitState.type === "success"
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {submitState.message}
              </Text.Small>
            )}
            <div className="w-fit">
              <Button
                label={isSubmitting ? "Sending..." : "Send Message"}
                type="submit"
              />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Contact;
