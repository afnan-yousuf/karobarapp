import Link from 'next/link'
import ContactForm from '../components/ContactForm'

const MAP_LINK = 'https://maps.app.goo.gl/x1rqm121F38JEpWx9'

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 uppercase">
          Contact Us
        </span>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Contact US
        </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            {"We'll be happy to hare from you"}
          </p>
      </section>

      {/* Two divisions: Contact Form | Map */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Contact Form</h2>
            <ContactForm />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Our Location</h2>
            <p className="text-slate-600 mb-4 text-sm">
              Visit us at our office location.
            </p>
            <iframe
              src={MAP_LINK}
              className="w-full h-64 rounded-xl border-0 shadow-sm"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Our location on Google Maps"
            />
            <div className="mt-3">
              <Link
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 text-sm font-medium hover:underline"
              >
                Open in Google Maps ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact row */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm sm:text-base">
            Call: 0300-9090909 &nbsp;|&nbsp; WhatsApp: 0322-8989889 &nbsp;|&nbsp;
            Email: admin@inno.com
          </p>
        </div>
      </section>
    </main>
  )
}
