import Navindex from "@/components/Navindex";
import { Button, Input, Form } from "@heroui/react";
import React from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser";
import { EMAILJS_SERVICE_ID, EMAILJS_PUBLIC_KEY } from "@/lib/emailjs";

// ============================================================
// 📧 Add your Contact Form EmailJS Template ID here
// ============================================================
const CONTACT_TEMPLATE_ID = "YOUR_CONTACT_TEMPLATE_ID";
// ============================================================

export default function Contact() {
  const [message, setMessage] = React.useState("");
  const [messageError, setMessageError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim()) {
      setMessageError("Message is required");
      return;
    }

    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;

    setLoading(true);
    setSubmitError("");
    setMessageError("");

    try {
      // Save to Firebase
      await addDoc(collection(db, "contact_messages"), {
        name: data.name,
        email: data.email,
        message,
        date: new Date().toISOString(),
      });

      // Send email via EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        CONTACT_TEMPLATE_ID,
        {
          name: data.name,
          email: data.email,
          message,
          date: new Date().toLocaleDateString(),
        },
        EMAILJS_PUBLIC_KEY
      );

      setSuccess(true);
      setMessage("");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setSubmitError("Something went wrong. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Navindex />
      <div className="flex flex-col items-center justify-center text-center px-4 gap-8 py-10">

        {/* Header */}
        <div>
          <h1 className="text-5xl font-bold text-black mb-4">Get in <span className="text-blue-700">Touch</span></h1>
          <p className="text-black text-lg max-w-2xl mx-auto">
            Have a question, suggestion or just want to say hi? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Form */}
        <div className="flex flex-wrap justify-center gap-10 max-w-4xl w-full">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl border border-gray-100 p-8 w-full max-w-md text-left shadow-sm">
            <h2 className="text-2xl font-bold text-black mb-6">Send a Message</h2>

            <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <Input
                isRequired
                label="Your Name"
                labelPlacement="outside"
                name="name"
                placeholder="Oluwaferanmi Ojebuyi"
                type="text"
                errorMessage="Please enter your name"
              />
              <Input
                isRequired
                label="Your Email"
                labelPlacement="outside"
                name="email"
                placeholder="michael@example.com"
                type="email"
                errorMessage="Please enter a valid email"
              />
              <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-black">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your message here..."
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); setMessageError(""); }}
                  className={`w-full rounded-xl border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white/80 ${messageError ? "border-red-500" : "border-gray-300"}`}
                />
                {messageError && <p className="text-red-500 text-xs mt-1">{messageError}</p>}
              </div>

              {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
              {success && <p className="text-green-600 text-sm font-semibold">Message sent successfully! ✅</p>}

              <Button
                type="submit"
                className="bg-blue-700 text-white w-full"
                size="lg"
                isLoading={loading}
              >
                Send Message
              </Button>
            </Form>

          </div>
        </div>

      </div>
    </div>
  );
}
