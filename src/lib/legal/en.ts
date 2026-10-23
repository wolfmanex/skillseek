import type { LegalTexts } from "./types";

export const en: LegalTexts = {
  privacy: {
    title: "Privacy Policy",
    intro: [
      "This policy explains what personal data Skillseek collects, why, who we share it with and what rights you have. Skillseek is a service for construction businesses and professionals, run by {company}.",
    ],
    sections: [
      {
        heading: "1. Who is responsible for your data",
        body: [
          "The controller of your personal data is {company} (registry code {regCode}), {address}. You can reach us about anything in this policy at {email}.",
        ],
      },
      {
        heading: "2. What data we collect",
        body: [
          "We collect what you give us and a small amount of technical data needed to run the service:",
          {
            list: [
              "Account data: email address, a hashed password (we never store the password itself), your role (main contractor, subcontractor or specialist), language and sign-up date.",
              "Profile data: your name or contact person, company name and registry code, description, phone number, website, country and service countries, trades, certificates, portfolio links, photos, years of experience, hourly rate and availability.",
              "Activity data: job postings you publish, applications and invitations, messages you exchange with other users, and reviews you write or receive.",
              "Sign-in data: session identifiers and one-time sign-in links. We store only a hash of each sign-in link, and it expires after 20 minutes.",
              "Waitlist data: if you join the waitlist before launch, your email address, name, role, region and trades, and if you give them, your company name, registry code, phone number, a message to us and the link that brought you to us.",
              "Technical data: IP address, browser type and request logs, which our hosting provider records to keep the service secure and working.",
            ],
          },
          "We do not use advertising or analytics trackers.",
        ],
      },
      {
        heading: "3. Why we use your data and on what legal basis",
        body: [
          {
            list: [
              "To create and run your account, show your profile, match postings with suitable professionals, deliver messages and send you sign-in and notification emails. Legal basis: performance of our contract with you (GDPR Article 6(1)(b)).",
              "To keep Skillseek secure, prevent fraud and abuse, and check that companies are real, for example against the Estonian e-Business Register and the Register of Economic Activities (MTR). Legal basis: our legitimate interest in a safe and trustworthy marketplace (Article 6(1)(f)).",
              "To contact you about the Skillseek beta if you join the waitlist. Legal basis: your consent (Article 6(1)(a)), which you can withdraw at any time by writing to {email}.",
              "To meet legal obligations, such as accounting rules if we start charging fees, or lawful requests from authorities. Legal basis: legal obligation (Article 6(1)(c)).",
            ],
          },
          "Skillseek suggests matches using fixed rules based on trades, countries, role and availability. These suggestions do not produce legal effects for you, and you always decide whom to contact or hire.",
        ],
      },
      {
        heading: "4. What other users and the public can see",
        body: [
          "Skillseek is a marketplace, so parts of your data are visible by design:",
          {
            list: [
              "Your profile (except your phone number), your trades, photos and the reviews you receive are visible to anyone, including visitors who are not signed in, and may be indexed by search engines.",
              "Your phone number is shown only to signed-in users.",
              "Job postings are visible to anyone.",
              "Messages are visible only to the people in the conversation.",
            ],
          },
          "Only add to your profile what you are comfortable making public.",
        ],
      },
      {
        heading: "5. Companies we invite from public registers",
        body: [
          "To help Estonian construction companies get started, we import information about them from the open data of the Estonian e-Business Register before they sign up: company name, registry code, legal form, status, address, the email address, phone number and website the company published in the register, and its activity codes. We do not import sole proprietors (FIE), board members or shareholders.",
          "These records are not shown publicly. We use them only to send the company a one-off invitation to claim a Skillseek profile prefilled with this information. Legal basis: our legitimate interest in building a useful marketplace (Article 6(1)(f)).",
          "Imported records are refreshed from the register on each import and kept until the company is invited, opts out or asks us to delete them. If the company has not claimed its profile within 12 months of the invitation, we delete its contact details and address and keep only its name and registry code, so that it is never invited again. Every invitation has an opt-out link that does the same straight away. You can also object or ask for deletion by writing to {email}.",
          "Contains data from the Estonian e-Business Register (RIK), CC BY 4.0.",
        ],
      },
      {
        heading: "6. Service providers (subprocessors)",
        body: [
          "We use the following providers to run Skillseek. They process data only on our instructions and under data processing agreements.",
          {
            table: {
              head: ["Provider", "Purpose", "Where data is stored"],
              rows: [
                ["Vercel Inc. (USA)", "Hosting of the web application, request logs", "Application servers in Frankfurt, Germany; content delivered through Vercel's global network"],
                ["Neon (USA)", "Database with all account, profile and activity data", "Frankfurt, Germany (AWS eu-central-1)"],
                ["Resend (USA)", "Sending sign-in, notification and waitlist emails", "United States"],
                ["Cloudflare, Inc. (USA)", "Storage of profile and work photos (Cloudflare R2)", "European Union (EU jurisdiction bucket); photos delivered through Cloudflare's global network"],
              ],
            },
          },
          "Some of these providers are based in the United States or may access data from outside the European Economic Area. Where that happens, transfers are protected by the EU–US Data Privacy Framework and/or the European Commission's Standard Contractual Clauses.",
        ],
      },
      {
        heading: "7. How long we keep your data",
        body: [
          {
            list: [
              "Account, profile and activity data: for as long as your account exists. When you delete your account, we delete your profile, photos, postings, applications, messages and the reviews you wrote or received.",
              "Waitlist entries: until the beta invitations are done, or until you ask us to delete them.",
              "Sessions: up to 30 days, or until you log out.",
              "Sign-in links: they expire after 20 minutes and are deleted with your account.",
              "Server and email logs: kept by our hosting and email providers (Vercel and Resend) for their standard retention periods, which are short, normally no more than 30 days.",
              "Database backups: deleted data may remain in backups for up to 30 days before it is overwritten.",
              "Data we must keep by law, such as accounting records, is kept for the period the law requires.",
            ],
          },
        ],
      },
      {
        heading: "8. Cookies",
        body: [
          "Skillseek uses only two cookies, both needed for the site to work, so we do not ask for consent:",
          {
            list: [
              "ss_session keeps you signed in. It lasts up to 30 days.",
              "locale remembers the language you chose. It lasts one year.",
            ],
          },
        ],
      },
      {
        heading: "9. Your rights",
        body: [
          "Under the GDPR you have the right to:",
          {
            list: [
              "access your personal data and get a copy of it;",
              "correct inaccurate data (most of it you can edit yourself in your profile);",
              "have your data deleted;",
              "restrict or object to processing based on our legitimate interests;",
              "receive the data you gave us in a machine-readable format (data portability).",
            ],
          },
          "To use any of these rights, including deleting your account or exporting your data, email {email}. Where your account page offers the option, you can also do it yourself there. We answer within one month.",
          "You also have the right to complain to the Estonian Data Protection Inspectorate (Andmekaitse Inspektsioon, www.aki.ee) or to the data protection authority in your own EU country.",
        ],
      },
      {
        heading: "10. Security",
        body: [
          "We use encrypted connections (HTTPS), store passwords only as bcrypt hashes, keep sign-in links short-lived and store data with providers in the EU wherever we can. No system is perfectly secure, so please use a strong password and keep your email account safe.",
        ],
      },
      {
        heading: "11. Age",
        body: ["Skillseek is meant for people aged 18 or over who act for a business or in their profession. We do not knowingly collect data from children."],
      },
      {
        heading: "12. Changes to this policy",
        body: [
          "We will update this policy when the service or the law changes. If a change is significant, we will tell you by email or in the app before it takes effect. The date at the top shows when the policy was last updated.",
        ],
      },
    ],
  },

  terms: {
    title: "Terms of Service",
    intro: [
      "These terms apply when you use Skillseek, a marketplace that connects main contractors, subcontractors and skilled specialists in construction. Please read them before creating an account. By creating an account, you accept these terms.",
    ],
    sections: [
      {
        heading: "1. Who we are",
        body: [
          "Skillseek is owned and operated by {company} (registry code {regCode}), {address} (\"we\", \"us\"). You can contact us at {email}.",
        ],
      },
      {
        heading: "2. Who can use Skillseek",
        body: [
          "Skillseek is a business-to-business service. You may use it only if you are at least 18 years old and act for a company or in your trade or profession, for example as a sole proprietor (FIE) or a self-employed specialist. If you register on behalf of a company, you confirm that you are authorised to act for it.",
        ],
      },
      {
        heading: "3. Your account",
        body: [
          "Give accurate information and keep it up to date. Keep your password and sign-in emails to yourself; you are responsible for what happens in your account. Tell us straight away at {email} if you think someone else has accessed it. One person or company should have only one account per role.",
        ],
      },
      {
        heading: "4. What Skillseek does and does not do",
        body: [
          "Skillseek helps you find, contact and review other construction businesses and professionals. We are not a party to any agreement you make with another user. In particular:",
          {
            list: [
              "We are not an employer, staffing agency or main contractor, and we do not supervise any work.",
              "We do not guarantee the quality, safety, legality or timeliness of any work, or that any user will pay or perform.",
              "A \"verified\" badge only means we checked that the company exists in a public register. It is not a recommendation or a check of skills, licences, insurance or financial standing.",
              "Match suggestions are generated automatically and may be incomplete.",
            ],
          },
          "Before you hire or agree to work, make your own checks and put the terms in a written contract with the other party.",
        ],
      },
      {
        heading: "5. Your responsibilities",
        body: [
          "You are responsible for complying with the law in your work, including:",
          {
            list: [
              "holding the registrations, qualifications and certificates your work requires, such as registration in the Register of Economic Activities (MTR) where needed;",
              "employment, tax, occupational safety and building rules;",
              "the accuracy of everything you publish, including postings, prices and certificates.",
            ],
          },
        ],
      },
      {
        heading: "6. Your content",
        body: [
          "You keep ownership of the content you add, such as your profile, photos, postings, messages and reviews. You give us a non-exclusive, free, worldwide licence to host, display and share that content within Skillseek, and to show public parts of it (such as profiles and postings) on the open web, for as long as it remains on the service. You confirm that you have the right to publish it, and that photos do not show people who have not agreed to it.",
        ],
      },
      {
        heading: "7. Reviews",
        body: [
          "Reviews must be honest, based on real work done through Skillseek, and must not contain insults, personal data of others or confidential information. We may remove reviews that break these terms, but we do not edit their content.",
        ],
      },
      {
        heading: "8. What you must not do",
        body: [
          {
            list: [
              "publish false, misleading or illegal content, or impersonate someone else;",
              "send spam, or use Skillseek data for unrelated marketing;",
              "harass, discriminate against or threaten other users;",
              "offer undeclared work or anything that breaks labour or tax law;",
              "scrape, copy in bulk, or interfere with the service or its security;",
              "use Skillseek to avoid fees we charge, once fees apply.",
            ],
          },
        ],
      },
      {
        heading: "9. Fees",
        body: [
          "Skillseek is currently free during its beta. If we introduce fees, we will tell you at least 30 days in advance, and you will not be charged for anything you have not agreed to.",
        ],
      },
      {
        heading: "10. Suspension and ending your account",
        body: [
          "You can stop using Skillseek and delete your account at any time. We may remove content, or suspend or close an account, if it breaks these terms or the law, or puts other users at risk. Where reasonable, we will tell you why and give you a chance to respond.",
        ],
      },
      {
        heading: "11. Availability and changes",
        body: [
          "Skillseek is in beta. We work to keep it running, but it may sometimes be unavailable, and we may change, add or remove features.",
        ],
      },
      {
        heading: "12. Liability",
        body: [
          "We provide Skillseek \"as is\". We are not liable for the acts or omissions of other users, for agreements between users, or for indirect losses such as lost profit or lost contracts. Our total liability to you is limited to the greater of 100 euros or the fees you paid us in the 12 months before the claim. These limits do not apply where the law does not allow them, including for damage caused intentionally or through gross negligence.",
        ],
      },
      {
        heading: "13. Changes to these terms",
        body: [
          "We may update these terms. We will tell you about significant changes by email or in the app at least 14 days before they take effect. If you keep using Skillseek after that, the new terms apply. If you do not agree, you can delete your account.",
        ],
      },
      {
        heading: "14. Law and disputes",
        body: [
          "These terms are governed by the laws of the Republic of Estonia. We will try to resolve any dispute with you amicably first. Disputes that cannot be resolved are settled in Harju County Court (Harju Maakohus), unless mandatory law gives you the right to go to another court.",
        ],
      },
      {
        heading: "15. Contact",
        body: ["Questions about these terms: {email}. How we handle personal data is described in our Privacy Policy."],
      },
    ],
  },
};
