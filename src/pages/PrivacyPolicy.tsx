import { Layout } from '@/components/layout/Layout';

const sections = [
  {
    title: '1. Information We Collect',
    content: (
      <>
        <p>We collect information you provide when you create or use a VerifyID account, including your name, email address, password credentials, and account preferences.</p>
        <p>Institutions may add student or member records containing identification numbers, names, organizations, issue and expiry dates, status, metadata, and identity photos. Verification activity may include the identification number searched, the result, the account that performed the verification, browser information, and the date and time.</p>
        <p>VerifyID does not currently collect or process student fingerprints, voiceprints, facial biometric templates, or other biometric identifiers.</p>
      </>
    ),
  },
  {
    title: '2. How We Use Information',
    content: (
      <>
        <p>We use information to provide and secure the service, authenticate accounts, manage institution memberships and permissions, maintain identity records, perform verification searches, process bulk uploads, provide support, prevent misuse, maintain audit logs, and comply with legal obligations.</p>
        <p>Verification information is used to return the result requested by an authorized user. Institution administrators control the records and members associated with their institution.</p>
      </>
    ),
  },
  {
    title: '3. How We Share Information',
    content: (
      <>
        <p>We do not sell personal information. We may share or process information with service providers that operate infrastructure necessary for VerifyID, including Supabase for authentication, database, storage, and server functions, and Google or GitHub when a user chooses to authenticate or link an account through those providers.</p>
        <p>We may disclose information when required by law, to protect users or the service, investigate abuse, or support a business transfer. Institutions are responsible for ensuring that they have an appropriate legal basis and authorization to upload and manage student or member information.</p>
      </>
    ),
  },
  {
    title: '4. Authentication and Social Logins',
    content: (
      <p>Users may register and sign in using email and password. Google and GitHub authentication may also be available. When you use a social login, we receive account information made available by that provider, such as your name, email address, and provider identity. The provider's own privacy policy also applies to its processing.</p>
    ),
  },
  {
    title: '5. Data Retention and Security',
    content: (
      <>
        <p>We retain information for as long as needed to provide VerifyID, maintain account and institutional records, support verification and audit requirements, resolve disputes, prevent abuse, and comply with law. Retention periods may vary by institution and applicable requirements.</p>
        <p>VerifyID uses authentication, role-based access control, institution-level row security, private storage for identity photos, signed photo URLs, and audit logging. No online service can guarantee absolute security, so users should protect their credentials and use the service from a secure device.</p>
      </>
    ),
  },
  {
    title: '6. Your Rights and Choices',
    content: (
      <p>Depending on your location, you may have rights to access, correct, delete, restrict, or obtain a copy of your personal information, and to object to or withdraw consent for certain processing. Requests may be subject to identity verification and legal limitations. Institution-managed student records may need to be requested through the relevant institution administrator.</p>
    ),
  },
  {
    title: '7. Children and Student Information',
    content: (
      <p>VerifyID is intended for institutions and organizations, not for unsupervised use by children. Institutions are responsible for determining whether they may collect and upload student information, obtaining required notices or consents, and complying with education and privacy laws that apply to them.</p>
    ),
  },
  {
    title: '8. Changes to This Policy',
    content: (
      <p>We may update this Privacy Policy from time to time. The “Last updated” date will change when revisions are published. Material changes may also be communicated through the service or by email where appropriate.</p>
    ),
  },
  {
    title: '9. Contact Us',
    content: (
      <p>If you have questions about this Privacy Policy or want to exercise a privacy right, contact us at <a className="text-primary underline" href="mailto:alphabros05@gmail.com">alphabros05@gmail.com</a>.</p>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <Layout>
      <article className="container max-w-4xl py-12 sm:py-16">
        <header className="mb-10 border-b border-border pb-8">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-primary">VerifyID</p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-muted-foreground">Last updated: September 8, 2026</p>
          <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground">
            This Privacy Policy explains how VerifyID collects, uses, stores, and protects information when you use our identity verification platform.
          </p>
        </header>

        <div className="space-y-9 text-[15px] leading-7 text-muted-foreground">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="mb-3 font-display text-xl font-semibold text-foreground">{section.title}</h2>
              <div className="space-y-3">{section.content}</div>
            </section>
          ))}
        </div>
      </article>
    </Layout>
  );
}
