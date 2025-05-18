import React from "react";
import {
  Gavel,
  Users,
  Users2,
  Landmark,
  FileText,
  Shield,
  GraduationCap,
  Scale,
  Lock,
  MapPin,
  Download,
  ExternalLink,
} from "lucide-react";

const categories = [
  {
    id: "arrest",
    title: "Know Your Rights During Arrest",
    description:
      "Learn about your constitutional rights when interacting with law enforcement.",
    icon: <Gavel className="h-6 w-6 text-[#1EB53A]" />,
    popular: true,
  },
  {
    id: "protest",
    title: "Protest Rights & Civil Disobedience",
    description:
      "Understand your constitutional rights to assemble, demonstrate, and express dissent.",
    icon: <Users2 className="h-6 w-6 text-[#1EB53A]" />,
    popular: true,
  },
  {
    id: "property",
    title: "Property Rights & Land Ownership",
    description:
      "Understand constitutional protections for property and land rights in Kenya.",
    icon: <Landmark className="h-6 w-6 text-[#1EB53A]" />,
    popular: false,
  },
  {
    id: "services",
    title: "Accessing Government Services",
    description:
      "Know your rights when dealing with government offices and services.",
    icon: <FileText className="h-6 w-6 text-[#1EB53A]" />,
    popular: true,
  },
  {
    id: "workplace",
    title: "Workplace Rights",
    description:
      "Explore your constitutional rights in employment and labor relations.",
    icon: <Users className="h-6 w-6 text-[#1EB53A]" />,
    popular: false,
  },
  {
    id: "healthcare",
    title: "Healthcare Rights",
    description:
      "Learn about your right to healthcare and medical services in Kenya.",
    icon: <Shield className="h-6 w-6 text-[#1EB53A]" />,
    popular: false,
  },
  {
    id: "education",
    title: "Education Rights",
    description: "Understand constitutional provisions for education in Kenya.",
    icon: <GraduationCap className="h-6 w-6 text-[#1EB53A]" />,
    popular: false,
  },
  {
    id: "digital",
    title: "Digital Rights & Privacy",
    description:
      "Protect your digital privacy and understand surveillance laws in Kenya.",
    icon: <Lock className="h-6 w-6 text-[#1EB53A]" />,
    popular: true,
  },
  {
    id: "accountability",
    title: "Holding Officials Accountable",
    description:
      "Learn how to file complaints against government officials who violate rights.",
    icon: <Scale className="h-6 w-6 text-[#1EB53A]" />,
    popular: true,
  },
];

const arrestScenarioSteps = [
  {
    id: "step-1",
    title: "During Arrest",
    content: `
        <h3>Your Rights During Arrest</h3>
        <p>When being arrested, you have the following constitutional rights:</p>
        <ul>
          <li>To be informed promptly, in a language you understand, of the reason for arrest</li>
          <li>To remain silent and not be compelled to make any confession or admission</li>
          <li>To communicate with an advocate and other persons whose assistance is necessary</li>
          <li>Not to be subjected to torture or cruel, inhuman, or degrading treatment</li>
          <li>To document officer identities and badge numbers if possible</li>
          <li>To record the interaction if possible (this is your legal right)</li>
        </ul>
        <p><strong>Important:</strong> If you believe your arrest is politically motivated or related to peaceful protest, clearly state that you are exercising your constitutional rights.</p>
      `,
    provisions: [
      {
        title: "Rights of Arrested Persons",
        article: "Article 49(1)",
        content:
          "An arrested person has the right to be informed promptly, in language that the person understands, of the reason for the arrest, the right to remain silent, and the consequences of not remaining silent.",
      },
      {
        title: "Freedom from Torture",
        article: "Article 29(d)",
        content:
          "Every person has the right to freedom from torture and cruel, inhuman or degrading treatment or punishment.",
      },
      {
        title: "Rights of Arrested Persons",
        article: "Article 49(1)(c)",
        content:
          "An arrested person has the right to communicate with an advocate, and other persons whose assistance is necessary.",
      },
    ],
  },
  {
    id: "step-2",
    title: "Police Custody",
    content: `
        <h3>Your Rights in Police Custody</h3>
        <p>While in police custody, you have the following rights:</p>
        <ul>
          <li>To be held in conditions that respect human dignity</li>
          <li>To be brought before a court within 24 hours</li>
          <li>To be released on bond or bail on reasonable conditions</li>
          <li>To access medical treatment if needed, especially if you've been injured during arrest</li>
          <li>To have family members or advocates know your whereabouts</li>
          <li>To refuse signing any statement without legal representation</li>
        </ul>
        <p><strong>Warning:</strong> Recent reports indicate cases of enforced disappearances during civil unrest. Ensure someone knows where you are at all times.</p>
      `,
    provisions: [
      {
        title: "Rights of Arrested Persons",
        article: "Article 49(1)(f)",
        content:
          "An arrested person has the right to be brought before a court as soon as reasonably possible, but not later than twenty-four hours after being arrested.",
      },
      {
        title: "Rights of Arrested Persons",
        article: "Article 49(1)(h)",
        content:
          "An arrested person has the right to be released on bond or bail, on reasonable conditions, pending a charge or trial, unless there are compelling reasons not to be released.",
      },
      {
        title: "Human Dignity",
        article: "Article 28",
        content:
          "Every person has inherent dignity and the right to have that dignity respected and protected.",
      },
    ],
  },
  {
    id: "step-3",
    title: "Court Appearance",
    content: `
        <h3>Your Rights During Court Appearance</h3>
        <p>When brought before a court, you have the following rights:</p>
        <ul>
          <li>To be informed of the charges against you</li>
          <li>To have legal representation (if you cannot afford one, the State should provide)</li>
          <li>To a fair and public hearing</li>
          <li>To be presumed innocent until proven guilty</li>
          <li>To challenge the lawfulness of your detention (habeas corpus)</li>
          <li>To challenge evidence obtained through rights violations</li>
        </ul>
        <p><strong>Key point:</strong> In cases of political arrests, courts have increasingly recognized constitutional violations.</p>
      `,
    provisions: [
      {
        title: "Fair Hearing",
        article: "Article 50(2)",
        content:
          "Every accused person has the right to a fair trial, which includes the right to be presumed innocent until the contrary is proved.",
      },
      {
        title: "Legal Representation",
        article: "Article 50(2)(g)",
        content:
          "Every accused person has the right to choose, and be represented by, an advocate, and to be informed of this right promptly.",
      },
      {
        title: "Habeas Corpus",
        article: "Article 25(d)",
        content:
          "Despite any other provision in this Constitution, the right to an order of habeas corpus shall not be limited.",
      },
    ],
  },
  {
    id: "step-4",
    title: "Next Steps",
    content: `
        <h3>What to Do If Your Rights Are Violated</h3>
        <p>If your rights have been violated during the arrest process, you can:</p>
        <ul>
          <li>File a complaint with the Independent Policing Oversight Authority (IPOA) - contact: 020-4906000 or <a href="mailto:info@ipoa.go.ke">info@ipoa.go.ke</a></li>
          <li>Seek legal assistance from the Kenya National Commission on Human Rights - hotline: 0800-720-627</li>
          <li>File a constitutional petition in the High Court</li>
          <li>Contact human rights organizations like Amnesty Kenya (020-4283000) or Kenya Human Rights Commission (020-3874998/9)</li>
          <li>Document all details including officer names, times, locations, and witnesses</li>
          <li>Get medical examination to document any injuries</li>
        </ul>
        <p><strong>For emergencies:</strong> Legal Aid Hotline: 0800-720-501 (toll-free) operational 24/7</p>
      `,
    provisions: [
      {
        title: "Enforcement of Rights",
        article: "Article 22",
        content:
          "Every person has the right to institute court proceedings claiming that a right or fundamental freedom in the Bill of Rights has been denied, violated or infringed, or is threatened.",
      },
      {
        title: "Authority of Courts",
        article: "Article 23",
        content:
          "The High Court has jurisdiction to hear and determine applications for redress of a denial, violation or infringement of, or threat to, a right or fundamental freedom in the Bill of Rights.",
      },
    ],
  },
];

const protestScenarioSteps = [
  {
    id: "protest-step-1",
    title: "Before Protesting",
    content: `
        <h3>Your Rights Before Participating in Protests</h3>
        <p>Before joining a protest or demonstration, know that:</p>
        <ul>
          <li>You have the constitutional right to peaceful assembly, demonstration, and petition</li>
          <li>No prior permission is legally required for peaceful assembly</li>
          <li>Protesting is not illegal in Kenya, even if authorities claim otherwise</li>
          <li>You can legally record police during protests as documentation</li>
          <li>Consider notifying authorities in advance (though not legally required)</li>
          <li>Plan exit routes and emergency contacts in case of police crackdowns</li>
        </ul>
        <p><strong>Safety tip:</strong> Share your location with trusted contacts and carry identification.</p>
      `,
    provisions: [
      {
        title: "Freedom of Assembly",
        article: "Article 37",
        content:
          "Every person has the right, peaceably and unarmed, to assemble, to demonstrate, to picket, and to present petitions to public authorities.",
      },
      {
        title: "Freedom of Expression",
        article: "Article 33",
        content:
          "Every person has the right to freedom of expression, which includes freedom to seek, receive or impart information or ideas.",
      },
    ],
  },
  {
    id: "protest-step-2",
    title: "During Protests",
    content: `
        <h3>Your Rights During Protests</h3>
        <p>While participating in a protest, you have the right to:</p>
        <ul>
          <li>Assemble peacefully in public spaces</li>
          <li>Express political opinions without censorship</li>
          <li>Record police actions and brutality (this is your legal protection)</li>
          <li>Refuse illegal orders from police</li>
          <li>Demand officer identification before any interaction</li>
          <li>Leave freely if not under arrest</li>
        </ul>
        <p><strong>Warning:</strong> Police have recently used excessive force, including live ammunition, against peaceful protesters. If tear gas is deployed, remain calm and seek flowing water to rinse your eyes.</p>
      `,
    provisions: [
      {
        title: "Political Rights",
        article: "Article 38",
        content:
          "Every citizen has the right to make political choices, which includes the right to form, or participate in forming, a political party and to participate in the activities of a political party.",
      },
      {
        title: "Freedom from Violence",
        article: "Article 29(c)",
        content:
          "Every person has the right to freedom from any form of violence from either public or private sources.",
      },
    ],
  },
  {
    id: "protest-step-3",
    title: "If Confronted by Police",
    content: `
        <h3>Your Rights If Confronted by Police During Protests</h3>
        <p>If confronted by police during a protest:</p>
        <ul>
          <li>Remain calm and keep your hands visible</li>
          <li>Ask if you're free to leave; if yes, calmly walk away</li>
          <li>If detained, ask for the specific reason for detention</li>
          <li>State clearly: "I am exercising my constitutional right to peaceful assembly"</li>
          <li>Request to speak to a lawyer immediately if arrested</li>
          <li>Note officer names, badge numbers, and patrol car numbers</li>
        </ul>
        <p><strong>Important:</strong> Recent data shows increased police abductions of protest participants. Always ensure someone knows your location.</p>
      `,
    provisions: [
      {
        title: "Freedom from Arbitrary Arrest",
        article: "Article 29(a)",
        content:
          "Every person has the right to freedom and security of the person, which includes the right not to be deprived of freedom arbitrarily or without just cause.",
      },
      {
        title: "Rights Upon Arrest",
        article: "Article 49(1)(a)(b)(c)",
        content:
          "An arrested person has the right to be informed promptly of the reason for arrest, to remain silent, and to communicate with an advocate.",
      },
    ],
  },
  {
    id: "protest-step-4",
    title: "After a Protest",
    content: `
        <h3>Your Rights After Participating in Protests</h3>
        <p>After participating in a protest:</p>
        <ul>
          <li>You cannot be targeted, surveilled, or harassed for peaceful protest participation</li>
          <li>Report any police brutality to independent oversight bodies</li>
          <li>Submit video evidence of police misconduct to human rights organizations</li>
          <li>Seek medical attention if injured and request detailed documentation</li>
          <li>Connect with legal aid if facing charges related to peaceful protest</li>
          <li>Be cautious about what you post on social media about your participation</li>
        </ul>
        <p><strong>Document everything:</strong> The Kenya National Commission on Human Rights is currently collecting evidence of protest-related abuses.</p>
      `,
    provisions: [
      {
        title: "Privacy Rights",
        article: "Article 31",
        content:
          "Every person has the right to privacy, which includes the right not to have their person, home or property searched, or their possessions seized.",
      },
      {
        title: "Access to Justice",
        article: "Article 48",
        content:
          "The State shall ensure access to justice for all persons and, if any fee is required, it shall be reasonable and shall not impede access to justice.",
      },
      {
        title: "Authority of Courts",
        article: "Article 23",
        content:
          "The High Court has jurisdiction to hear and determine applications for redress of a denial, violation or infringement of, or threat to, a right or fundamental freedom in the Bill of Rights.",
      },
    ],
  },
  {
    id: "accountability-step-4",
    title: "International Remedies",
    content: `
        <h3>International Accountability Mechanisms</h3>
        <p>When domestic remedies are exhausted or ineffective, you can seek international redress through:</p>
        <ul>
          <li>African Commission on Human and Peoples' Rights</li>
          <li>African Court on Human and Peoples' Rights</li>
          <li>United Nations Human Rights Committee</li>
          <li>UN Special Rapporteurs on specific rights issues</li>
          <li>International Criminal Court (for crimes against humanity)</li>
          <li>Diplomatic missions and international human rights organizations</li>
        </ul>
        <p><strong>Recent example:</strong> The African Court awarded $1.3 million in reparations to the Ogiek community for rights violations by the Kenyan government.</p>
      `,
    provisions: [
      {
        title: "International Law",
        article: "Article 2(5)",
        content:
          "The general rules of international law shall form part of the law of Kenya.",
      },
      {
        title: "Treaty Obligations",
        article: "Article 2(6)",
        content:
          "Any treaty or convention ratified by Kenya shall form part of the law of Kenya under this Constitution.",
      },
    ],
  },
];

const digitalScenarioSteps = [
  {
    id: "digital-step-1",
    title: "Privacy & Surveillance",
    content: `
        <h3>Your Digital Privacy Rights</h3>
        <p>Regarding digital privacy, you have the constitutional right to:</p>
        <ul>
          <li>Privacy of your communications, including online and mobile communications</li>
          <li>Protection against arbitrary surveillance by state or private entities</li>
          <li>Be informed about collection of your personal data</li>
          <li>Freedom from warrantless searches of your digital devices</li>
          <li>Challenge unlawful surveillance in court</li>
          <li>Data protection under the Data Protection Act of 2019</li>
        </ul>
        <p><strong>Warning:</strong> Recent reports indicate increased surveillance of political activists and protesters.</p>
      `,
    provisions: [
      {
        title: "Privacy Rights",
        article: "Article 31(c)(d)",
        content:
          "Every person has the right to privacy, which includes the right not to have their private communications infringed or the privacy of their communications infringed.",
      },
      {
        title: "Data Protection",
        article: "Data Protection Act, 2019",
        content:
          "Protects personal data and establishes the Office of the Data Commissioner to regulate processing of personal data.",
      },
    ],
  },
  {
    id: "digital-step-2",
    title: "Internet Freedom",
    content: `
        <h3>Your Internet Freedom Rights</h3>
        <p>Regarding internet freedom, you have the right to:</p>
        <ul>
          <li>Access and use the internet without arbitrary restrictions</li>
          <li>Express yourself freely online, subject only to reasonable limitations</li>
          <li>Access information online, including government data</li>
          <li>Privacy of your online activities</li>
          <li>Challenge internet shutdowns as unconstitutional</li>
          <li>Use encryption and security tools to protect your communications</li>
        </ul>
        <p><strong>Court victory:</strong> In 2020, the High Court ruled that internet shutdowns during protests violate constitutional rights.</p>
      `,
    provisions: [
      {
        title: "Freedom of Expression",
        article: "Article 33",
        content:
          "Every person has the right to freedom of expression, which includes freedom to seek, receive or impart information or ideas.",
      },
      {
        title: "Access to Information",
        article: "Article 35",
        content:
          "Every citizen has the right of access to information held by the State and information held by another person and required for the exercise or protection of any right or fundamental freedom.",
      },
    ],
  },
  {
    id: "digital-step-3",
    title: "Online Activism",
    content: `
        <h3>Your Rights as an Online Activist</h3>
        <p>When engaging in online activism, you have the right to:</p>
        <ul>
          <li>Organize protests and civic activities on social media platforms</li>
          <li>Share information about government policies and actions</li>
          <li>Criticize public officials and policies</li>
          <li>Document and share evidence of human rights violations</li>
          <li>Protection from arbitrary arrest for lawful online speech</li>
          <li>Challenge unconstitutional application of cyber laws</li>
        </ul>
        <p><strong>Important:</strong> The Computer Misuse and Cybercrimes Act has been used against activists, but courts have struck down several provisions.</p>
      `,
    provisions: [
      {
        title: "Political Rights",
        article: "Article 38",
        content:
          "Every citizen has the right to make political choices, which includes the right to form, or participate in forming, a political party and to participate in the activities of a political party.",
      },
      {
        title: "Freedom of Association",
        article: "Article 36",
        content:
          "Every person has the right to freedom of association, which includes the right to form, join or participate in the activities of an association of any kind.",
      },
    ],
  },
  {
    id: "digital-step-4",
    title: "Protection Measures",
    content: `
        <h3>Digital Protection Measures</h3>
        <p>To protect your digital rights, consider these legal safeguards:</p>
        <ul>
          <li>Use secure messaging apps with end-to-end encryption</li>
          <li>Be aware that the National Intelligence Service can legally intercept communications with warrants</li>
          <li>Challenge unlawful surveillance through constitutional petitions</li>
          <li>Report privacy violations to the Office of the Data Commissioner</li>
          <li>Document and report digital rights violations to human rights organizations</li>
          <li>Consider VPN usage during periods of potential internet restrictions</li>
        </ul>
        <p><strong>Legal help:</strong> Digital rights organizations like the Kenya ICT Action Network (KICTANet) offer guidance on digital rights protection.</p>
      `,
    provisions: [
      {
        title: "Enforcement of Rights",
        article: "Article 22",
        content:
          "Every person has the right to institute court proceedings claiming that a right or fundamental freedom in the Bill of Rights has been denied, violated or infringed, or is threatened.",
      },
      {
        title: "Limitation of Rights",
        article: "Article 24",
        content:
          "A right or fundamental freedom in the Bill of Rights shall not be limited except by law, and then only to the extent that the limitation is reasonable and justifiable in an open and democratic society.",
      },
    ],
  },
];
const propertyScenarioSteps = [
  {
    id: "property-step-1",
    title: "Land Ownership Rights",
    content: `
        <h3>Your Rights to Land Ownership</h3>
        <p>Regarding land ownership in Kenya, you have the following rights:</p>
        <ul>
          <li>Equal right to own property regardless of gender, ethnicity, or religion</li>
          <li>Protection against arbitrary deprivation of property</li>
          <li>Right to acquire and own land in any part of Kenya</li>
          <li>Right to adequate compensation in case of compulsory acquisition</li>
          <li>Protection of ancestral lands and lands occupied by traditional communities</li>
          <li>Right to inherit land equally (for both men and women)</li>
        </ul>
        <p><strong>Important:</strong> Recent legal reforms have strengthened women's property rights, ensuring equal inheritance regardless of marital status.</p>
      `,
    provisions: [
      {
        title: "Protection of Right to Property",
        article: "Article 40(1)",
        content:
          "Subject to Article 65, every person has the right, either individually or in association with others, to acquire and own property of any description and in any part of Kenya.",
      },
      {
        title: "Protection from Deprivation",
        article: "Article 40(2)(a)",
        content:
          "Parliament shall not enact a law that permits the State or any person to arbitrarily deprive a person of property of any description or of any interest in, or right over, any property of any description.",
      },
      {
        title: "Compensation for Acquisition",
        article: "Article 40(3)(b)",
        content:
          "The State shall pay just compensation in full, to the person whose right or property has been acquired.",
      },
    ],
  },
  {
    id: "property-step-2",
    title: "Eviction Protections",
    content: `
        <h3>Your Rights During Evictions</h3>
        <p>If facing potential eviction, you have these rights:</p>
        <ul>
          <li>Right to dignity and humane treatment during any eviction process</li>
          <li>Right to adequate notice before eviction (minimum 3 months by law)</li>
          <li>Right to court hearing before eviction can be executed</li>
          <li>Protection against evictions during bad weather or at night</li>
          <li>Right to alternative accommodation if eviction will lead to homelessness</li>
          <li>Special protections for vulnerable groups including children, elderly, and persons with disabilities</li>
        </ul>
        <p><strong>Legal precedent:</strong> In Mitu-Bell Welfare Society v Kenya Airports Authority (2021), the Supreme Court affirmed that forced evictions without adequate notice and resettlement plans violate constitutional rights.</p>
      `,
    provisions: [
      {
        title: "Human Dignity",
        article: "Article 28",
        content:
          "Every person has inherent dignity and the right to have that dignity respected and protected.",
      },
      {
        title: "Right to Housing",
        article: "Article 43(1)(b)",
        content:
          "Every person has the right to accessible and adequate housing, and to reasonable standards of sanitation.",
      },
      {
        title: "Protection of Vulnerable Persons",
        article: "Article 21(3)",
        content:
          "All State organs and all public officers have the duty to address the needs of vulnerable groups within society, including women, older members of society, persons with disabilities, children, youth, members of minority or marginalised communities, and members of particular ethnic, religious or cultural communities.",
      },
    ],
  },
  {
    id: "property-step-3",
    title: "Defending Property Rights",
    content: `
        <h3>How to Defend Your Property Rights</h3>
        <p>If your property rights are violated, you can take these actions:</p>
        <ul>
          <li>File a complaint with the National Land Commission - Hotline: 0800-221-050</li>
          <li>Seek court injunctions to stop illegal acquisitions or evictions</li>
          <li>File constitutional petitions in the Environment and Land Court</li>
          <li>Report corruption in land matters to the Ethics and Anti-Corruption Commission (EACC) - Hotline: 0800-722-701</li>
          <li>Access legal aid through Kituo Cha Sheria - Contact: 020-3876290</li>
          <li>Organize community-based monitoring and protection of communal lands</li>
        </ul>
        <p><strong>Recent development:</strong> The digitization of land records through the National Land Information Management System (NLIMS) has reduced fraud and improved transparency.</p>
      `,
    provisions: [
      {
        title: "Access to Justice",
        article: "Article 48",
        content:
          "The State shall ensure access to justice for all persons and, if any fee is required, it shall be reasonable and shall not impede access to justice.",
      },
      {
        title: "National Land Commission",
        article: "Article 67",
        content:
          "The functions of the National Land Commission include to manage public land on behalf of the national and county governments, to recommend a national land policy to the national government, and to initiate investigations into present or historical land injustices.",
      },
      {
        title: "Environment and Land Court",
        article: "Article 162(2)(b)",
        content:
          "Parliament shall establish courts with the status of the High Court to hear and determine disputes relating to the environment and the use and occupation of, and title to, land.",
      },
    ],
  },
  {
    id: "property-step-4",
    title: "Community Land Rights",
    content: `
        <h3>Community Land Rights</h3>
        <p>For community lands, the following rights apply:</p>
        <ul>
          <li>Recognition and protection of ancestral lands and lands traditionally occupied by hunter-gatherer communities</li>
          <li>Equal benefit for all community members regardless of gender</li>
          <li>Protection against arbitrary dispossession of community land</li>
          <li>Right to compensation for use of cultural or intellectual property</li>
          <li>Free, prior, and informed consent before development projects on community land</li>
          <li>Community participation in natural resource management</li>
        </ul>
        <p><strong>Key legislation:</strong> The Community Land Act 2016 provides mechanisms for recognition, protection, and registration of community land rights.</p>
      `,
    provisions: [
      {
        title: "Community Land",
        article: "Article 63(1)",
        content:
          "Community land shall vest in and be held by communities identified on the basis of ethnicity, culture or similar community of interest.",
      },
      {
        title: "Protection of Marginalized Communities",
        article: "Article 56(d)",
        content:
          "The State shall put in place affirmative action programmes designed to ensure that minorities and marginalised groups develop their cultural values, languages and practices.",
      },
      {
        title: "Benefit Sharing",
        article: "Article 69(1)(a)",
        content:
          "The State shall ensure sustainable exploitation, utilisation, management and conservation of the environment and natural resources, and ensure the equitable sharing of the accruing benefits.",
      },
    ],
  },
];

const servicesScenarioSteps = [
  {
    id: "services-step-1",
    title: "Access to Government Services",
    content: `
        <h3>Your Rights to Government Services</h3>
        <p>When accessing government services, you have the right to:</p>
        <ul>
          <li>Efficient, lawful, reasonable, and procedurally fair administrative action</li>
          <li>Written reasons for administrative decisions that affect you</li>
          <li>Service delivery in clear, accessible language</li>
          <li>Access services without paying bribes or "facilitation fees"</li>
          <li>Equal treatment without discrimination based on ethnicity, gender, religion, or other factors</li>
          <li>Access public information held by the government</li>
        </ul>
        <p><strong>Recent development:</strong> The Huduma Centers initiative has centralized government services to improve accessibility and reduce corruption.</p>
      `,
    provisions: [
      {
        title: "Fair Administrative Action",
        article: "Article 47(1)",
        content:
          "Every person has the right to administrative action that is expeditious, efficient, lawful, reasonable and procedurally fair.",
      },
      {
        title: "Right to Information",
        article: "Article 35(1)",
        content:
          "Every citizen has the right of access to information held by the State and information held by another person and required for the exercise or protection of any right or fundamental freedom.",
      },
      {
        title: "Values and Principles of Public Service",
        article: "Article 232(1)(f)",
        content:
          "The values and principles of public service include transparency and provision to the public of timely, accurate information.",
      },
    ],
  },
  {
    id: "services-step-2",
    title: "Citizenship and Documentation",
    content: `
        <h3>Your Rights to Citizenship and Documentation</h3>
        <p>Regarding citizenship and identity documents, you have the right to:</p>
        <ul>
          <li>Obtain birth certificates, national ID cards, and passports without discrimination</li>
          <li>Pass citizenship to your children regardless of gender</li>
          <li>Dual citizenship recognition</li>
          <li>Not be arbitrarily deprived of your citizenship</li>
          <li>Citizenship by birth if either parent is a citizen</li>
          <li>Appeal if denied documentation through administrative or judicial processes</li>
        </ul>
        <p><strong>Important:</strong> Members of border communities and marginalized groups facing documentation challenges can seek assistance from the Kenya National Commission on Human Rights (KNCHR).</p>
      `,
    provisions: [
      {
        title: "Citizenship by Birth",
        article: "Article 14(1)",
        content:
          "A person is a citizen by birth if on the day of the person's birth, whether or not the person is born in Kenya, either the mother or father of the person is a citizen.",
      },
      {
        title: "Right to Documentation",
        article: "Article 12(1)(b)",
        content:
          "Every citizen is entitled to a Kenyan passport and any document of registration or identification issued by the State to citizens.",
      },
      {
        title: "Protection Against Statelessness",
        article: "Article 16",
        content:
          "A citizen by birth does not lose citizenship by acquiring the citizenship of another country.",
      },
    ],
  },
  {
    id: "services-step-3",
    title: "Consumer Rights",
    content: `
        <h3>Your Consumer Rights</h3>
        <p>As a consumer in Kenya, you have the right to:</p>
        <ul>
          <li>Goods and services of reasonable quality</li>
          <li>Information necessary for you to gain full benefit from goods and services</li>
          <li>Protection of your health, safety, and economic interests</li>
          <li>Compensation for loss or injury arising from defects in goods or services</li>
          <li>Fair, honest advertising and clear product labeling</li>
          <li>Form consumer organizations to protect your interests</li>
        </ul>
        <p><strong>Where to report:</strong> File complaints with the Competition Authority of Kenya (020-2779000) or Kenya Bureau of Standards (0800-221-350).</p>
      `,
    provisions: [
      {
        title: "Consumer Rights",
        article: "Article 46(1)",
        content:
          "Consumers have the right to goods and services of reasonable quality; to the information necessary for them to gain full benefit from goods and services; to the protection of their health, safety, and economic interests; and to compensation for loss or injury arising from defects in goods or services.",
      },
      {
        title: "Consumer Organizations",
        article: "Article 46(1)(d)",
        content:
          "Consumers have the right to form, or join in, organizations to protect their interests.",
      },
      {
        title: "Fair Trade Practices",
        article: "Article 46(3)",
        content:
          "This Article applies to goods and services offered by public entities or private persons.",
      },
    ],
  },
  {
    id: "services-step-4",
    title: "Utilities and Essential Services",
    content: `
        <h3>Your Rights to Utilities and Essential Services</h3>
        <p>Regarding utilities and essential services, you have the right to:</p>
        <ul>
          <li>Clean and safe water in adequate quantities</li>
          <li>Reasonable standards of sanitation</li>
          <li>Freedom from arbitrary disconnection of essential services</li>
          <li>Fair and transparent billing for utilities</li>
          <li>Access to affordable energy services</li>
          <li>File complaints with regulatory authorities about service issues</li>
        </ul>
        <p><strong>Recent ruling:</strong> The High Court has determined that water disconnections without adequate notice violate constitutional rights to dignity and clean water.</p>
      `,
    provisions: [
      {
        title: "Right to Water",
        article: "Article 43(1)(d)",
        content:
          "Every person has the right to clean and safe water in adequate quantities.",
      },
      {
        title: "Right to Sanitation",
        article: "Article 43(1)(b)",
        content:
          "Every person has the right to accessible and adequate housing, and to reasonable standards of sanitation.",
      },
      {
        title: "Consumer Protection",
        article: "Article 46(1)(c)",
        content:
          "Consumers have the right to the protection of their health, safety, and economic interests.",
      },
    ],
  },
];

const workplaceScenarioSteps = [
  {
    id: "workplace-step-1",
    title: "Employment Rights",
    content: `
        <h3>Your Basic Employment Rights</h3>
        <p>In the workplace, every Kenyan has the right to:</p>
        <ul>
          <li>Fair remuneration and reasonable working conditions</li>
          <li>Form, join, or participate in trade union activities</li>
          <li>Collective bargaining with employers</li>
          <li>Go on strike when fundamental rights at work are violated</li>
          <li>Equal opportunity in employment without discrimination</li>
          <li>Freedom from forced labor and child labor</li>
        </ul>
        <p><strong>Important:</strong> The Employment Act provides for minimum terms and conditions of employment, including maximum working hours and overtime compensation.</p>
      `,
    provisions: [
      {
        title: "Fair Labour Practices",
        article: "Article 41(1)",
        content: "Every person has the right to fair labour practices.",
      },
      {
        title: "Fair Remuneration",
        article: "Article 41(2)(a)",
        content: "Every worker has the right to fair remuneration.",
      },
      {
        title: "Reasonable Working Conditions",
        article: "Article 41(2)(b)",
        content: "Every worker has the right to reasonable working conditions.",
      },
    ],
  },
  {
    id: "workplace-step-2",
    title: "Workplace Discrimination",
    content: `
        <h3>Protection Against Workplace Discrimination</h3>
        <p>You are protected against discrimination at work based on:</p>
        <ul>
          <li>Gender, race, ethnicity, religion, or tribe</li>
          <li>Pregnancy, marital status, or health status (including HIV status)</li>
          <li>Disability or age</li>
          <li>Language, dress, or cultural practices</li>
          <li>Political opinion or affiliation</li>
          <li>Birth or social origin</li>
        </ul>
        <p><strong>Key case:</strong> In VMK v CUEA [2018], the Employment and Labour Relations Court awarded significant damages for HIV-based workplace discrimination.</p>
      `,
    provisions: [
      {
        title: "Freedom from Discrimination",
        article: "Article 27(4)",
        content:
          "The State shall not discriminate directly or indirectly against any person on any ground, including race, sex, pregnancy, marital status, health status, ethnic or social origin, colour, age, disability, religion, conscience, belief, culture, dress, language or birth.",
      },
      {
        title: "Equal Opportunity",
        article: "Article 27(3)",
        content:
          "Women and men have the right to equal treatment, including the right to equal opportunities in political, economic, cultural and social spheres.",
      },
      {
        title: "Affirmative Action",
        article: "Article 27(6)",
        content:
          "To give full effect to the realisation of the rights guaranteed under this Article, the State shall take legislative and other measures, including affirmative action programmes and policies designed to redress any disadvantage suffered by individuals or groups because of past discrimination.",
      },
    ],
  },
  {
    id: "workplace-step-3",
    title: "Maternity and Paternity Rights",
    content: `
        <h3>Your Maternity and Paternity Rights</h3>
        <p>When it comes to parental rights at work:</p>
        <ul>
          <li>Women are entitled to at least three months of paid maternity leave</li>
          <li>Men are entitled to at least two weeks of paid paternity leave</li>
          <li>Protection against termination due to pregnancy or maternity leave</li>
          <li>Right to return to the same or equivalent position after leave</li>
          <li>Employers must provide reasonable breaks and facilities for nursing mothers</li>
          <li>Protection against discrimination based on family responsibilities</li>
        </ul>
        <p><strong>Recent change:</strong> Some progressive employers now offer extended parental leave beyond the statutory minimum.</p>
      `,
    provisions: [
      {
        title: "Protection of the Family",
        article: "Article 45(3)",
        content:
          "Parties to a marriage are entitled to equal rights at the time of the marriage, during the marriage and at the dissolution of the marriage.",
      },
      {
        title: "Protection from Discrimination",
        article: "Article 27(4)",
        content:
          "The State shall not discriminate directly or indirectly against any person on any ground, including pregnancy.",
      },
      {
        title: "Maternity Leave",
        article: "Employment Act Section 29",
        content:
          "A female employee shall be entitled to three months maternity leave with full pay.",
      },
    ],
  },
  {
    id: "workplace-step-4",
    title: "Workplace Safety",
    content: `
        <h3>Your Right to a Safe Workplace</h3>
        <p>Every worker has the right to:</p>
        <ul>
          <li>Work in an environment that is safe and healthy</li>
          <li>Refuse work that poses an imminent and serious risk to health or safety</li>
          <li>Be provided with necessary protective equipment at no cost</li>
          <li>Receive training on workplace hazards and safety procedures</li>
          <li>Be compensated for work-related injuries or occupational diseases</li>
          <li>Report unsafe conditions without fear of retaliation</li>
        </ul>
        <p><strong>Where to report:</strong> Directorate of Occupational Safety and Health Services (DOSHS) - Hotline: 020-2729800.</p>
      `,
    provisions: [
      {
        title: "Safe Working Environment",
        article: "Article 41(2)(d)",
        content: "Every worker has the right to reasonable working conditions.",
      },
      {
        title: "Right to Dignity",
        article: "Article 28",
        content:
          "Every person has inherent dignity and the right to have that dignity respected and protected.",
      },
      {
        title: "Work Injury Compensation",
        article: "Work Injury Benefits Act",
        content:
          "An employee who is involved in an accident resulting in the employee's disablement or death is entitled to compensation.",
      },
    ],
  },
];

const healthcareScenarioSteps = [
  {
    id: "healthcare-step-1",
    title: "Access to Healthcare",
    content: `
        <h3>Your Right to Healthcare</h3>
        <p>Every person in Kenya has the right to:</p>
        <ul>
          <li>The highest attainable standard of health</li>
          <li>Emergency medical treatment</li>
          <li>Healthcare services without discrimination</li>
          <li>Reproductive healthcare</li>
          <li>Information about healthcare services</li>
          <li>Participate in healthcare policy decisions</li>
        </ul>
        <p><strong>Important note:</strong> Under the Linda Mama program, all pregnant women are entitled to free maternity services at public health facilities.</p>
      `,
    provisions: [
      {
        title: "Right to Health",
        article: "Article 43(1)(a)",
        content:
          "Every person has the right to the highest attainable standard of health, which includes the right to health care services, including reproductive health care.",
      },
      {
        title: "Emergency Treatment",
        article: "Article 43(2)",
        content: "A person shall not be denied emergency medical treatment.",
      },
      {
        title: "Access to Healthcare Services",
        article: "Article 56(e)",
        content:
          "The State shall put in place affirmative action programmes designed to ensure that minorities and marginalised groups have reasonable access to water, health services and infrastructure.",
      },
    ],
  },
  {
    id: "healthcare-step-2",
    title: "Patient Rights",
    content: `
        <h3>Your Rights as a Patient</h3>
        <p>When receiving healthcare, you have the right to:</p>
        <ul>
          <li>Informed consent before any medical procedure</li>
          <li>Privacy and confidentiality of your health information</li>
          <li>Dignified treatment free from any form of cruel treatment</li>
          <li>Access your medical records</li>
          <li>Seek a second medical opinion</li>
          <li>Refuse treatment (except in emergency situations where you cannot communicate)</li>
        </ul>
        <p><strong>Key resource:</strong> The Kenya Medical Practitioners and Dentists Council - Complaints Hotline: 020-2720588.</p>
      `,
    provisions: [
      {
        title: "Right to Dignity",
        article: "Article 28",
        content:
          "Every person has inherent dignity and the right to have that dignity respected and protected.",
      },
      {
        title: "Right to Privacy",
        article: "Article 31(c)(d)",
        content:
          "Every person has the right to privacy, which includes the right not to have information relating to their family or private affairs unnecessarily required or revealed or the privacy of their communications infringed.",
      },
      {
        title: "Freedom from Torture",
        article: "Article 29(d)",
        content:
          "Every person has the right to freedom from torture and cruel, inhuman or degrading treatment or punishment.",
      },
    ],
  },
  {
    id: "healthcare-step-3",
    title: "Reproductive Health Rights",
    content: `
        <h3>Your Reproductive Health Rights</h3>
        <p>Regarding reproductive health, you have the right to:</p>
        <ul>
          <li>Access reproductive health services, including family planning</li>
          <li>Make informed decisions about reproduction free from discrimination, coercion, or violence</li>
          <li>Access maternal healthcare services</li>
          <li>Scientifically accurate information about reproductive health</li>
          <li>Access safe abortion services when permitted by law (risk to life or health of the mother, or in emergency situations)</li>
          <li>Privacy and confidentiality in reproductive health matters</li>
        </ul>
        <p><strong>Important:</strong> The Kenya Demographic Health Survey shows only 58% of women have their family planning needs met, highlighting gaps in service provision.</p>
      `,
    provisions: [
      {
        title: "Reproductive Health Care",
        article: "Article 43(1)(a)",
        content:
          "Every person has the right to the highest attainable standard of health, which includes the right to health care services, including reproductive health care.",
      },
      {
        title: "Equality and Freedom from Discrimination",
        article: "Article 27(3)",
        content:
          "Women and men have the right to equal treatment, including the right to equal opportunities in political, economic, cultural and social spheres.",
      },
      {
        title: "Access to Information",
        article: "Article 35(1)",
        content:
          "Every citizen has the right of access to information held by the State and information held by another person and required for the exercise or protection of any right or fundamental freedom.",
      },
    ],
  },
  {
    id: "healthcare-step-4",
    title: "Mental Health Rights",
    content: `
        <h3>Your Mental Health Rights</h3>
        <p>Regarding mental health, you have the right to:</p>
        <ul>
          <li>Access quality mental health services</li>
          <li>Informed consent for mental health treatment</li>
          <li>Freedom from discrimination based on mental health status</li>
          <li>Least restrictive care in the least restrictive environment</li>
          <li>Confidentiality of mental health information</li>
          <li>Appeal involuntary admission or treatment decisions</li>
        </ul>
        <p><strong>Resource:</strong> Psychological Society of Kenya offers a directory of licensed mental health practitioners - Contact: 0723-446-010.</p>
      `,
    provisions: [
      {
        title: "Right to Health",
        article: "Article 43(1)(a)",
        content:
          "Every person has the right to the highest attainable standard of health, which includes the right to health care services.",
      },
      {
        title: "Protection from Discrimination",
        article: "Article 27(4)",
        content:
          "The State shall not discriminate directly or indirectly against any person on any ground, including health status.",
      },
      {
        title: "Freedom and Security of Person",
        article: "Article 29(a)",
        content:
          "Every person has the right to freedom and security of the person, which includes the right not to be deprived of freedom arbitrarily or without just cause.",
      },
    ],
  },
];

const educationScenarioSteps = [
  {
    id: "education-step-1",
    title: "Right to Education",
    content: `
        <h3>Your Right to Education</h3>
        <p>Every person in Kenya has the right to:</p>
        <ul>
          <li>Free and compulsory basic education</li>
          <li>Access education without discrimination</li>
          <li>Quality education that meets national standards</li>
          <li>Choose a language of instruction where reasonable</li>
          <li>Special provisions for persons with disabilities</li>
          <li>Progressive implementation of free secondary education</li>
        </ul>
        <p><strong>Recent development:</strong> The government has implemented the 100% transition policy ensuring all primary school graduates proceed to secondary education.</p>
      `,
    provisions: [
      {
        title: "Right to Education",
        article: "Article 43(1)(f)",
        content: "Every person has the right to education.",
      },
      {
        title: "Free and Compulsory Basic Education",
        article: "Article 53(1)(b)",
        content:
          "Every child has the right to free and compulsory basic education.",
      },
      {
        title: "Access for Persons with Disabilities",
        article: "Article 54(1)(b)",
        content:
          "A person with any disability is entitled to access educational institutions and facilities for persons with disabilities that are integrated into society to the extent compatible with the interests of the person.",
      },
    ],
  },
  {
    id: "education-step-2",
    title: "Discrimination in Education",
    content: `
        <h3>Protection Against Educational Discrimination</h3>
        <p>You are protected against discrimination in education based on:</p>
        <ul>
          <li>Gender, race, ethnicity, or religion</li>
          <li>Disability or special learning needs</li>
          <li>Pregnancy or parenthood status</li>
          <li>Economic background or social origin</li>
          <li>Language or cultural background</li>
          <li>Health status, including HIV status</li>
        </ul>
        <p><strong>Important case:</strong> In 2019, the High Court ruled against schools expelling pregnant students, affirming their right to continue education.</p>
      `,
    provisions: [
      {
        title: "Equality and Freedom from Discrimination",
        article: "Article 27(4)",
        content:
          "The State shall not discriminate directly or indirectly against any person on any ground, including race, sex, pregnancy, marital status, health status, ethnic or social origin, colour, age, disability, religion, conscience, belief, culture, dress, language or birth.",
      },
      {
        title: "Protection of the Girl Child",
        article: "Article 53(1)(d)",
        content:
          "Every child has the right to be protected from harmful cultural practices, all forms of violence, inhuman treatment and punishment, and hazardous or exploitative labour.",
      },
      {
        title: "Affirmative Action",
        article: "Article 56(b)",
        content:
          "The State shall put in place affirmative action programmes designed to ensure that minorities and marginalised groups are provided special opportunities in educational and economic fields.",
      },
    ],
  },
  {
    id: "education-step-3",
    title: "Student Rights",
    content: `
        <h3>Your Rights as a Student</h3>
        <p>As a student in Kenya, you have the right to:</p>
        <ul>
          <li>A safe, non-violent learning environment</li>
          <li>Freedom from corporal punishment and degrading treatment</li>
          <li>Participate in decision-making about matters affecting you</li>
          <li>Fair and transparent assessment procedures</li>
          <li>Appeal academic decisions through proper channels</li>
          <li>Form and join student associations</li>
        </ul>
        <p><strong>Protection mechanism:</strong> Report violations to Teachers Service Commission (TSC) - Ethics Hotline: 0800-720-502.</p>
      `,
    provisions: [
      {
        title: "Protection from Violence",
        article: "Article 29(c)",
        content:
          "Every person has the right to freedom from any form of violence from either public or private sources.",
      },
      {
        title: "Freedom of Association",
        article: "Article 36",
        content:
          "Every person has the right to freedom of association, which includes the right to form, join or participate in the activities of an association of any kind.",
      },
      {
        title: "Child Protection",
        article: "Article 53(1)(d)",
        content:
          "Every child has the right to be protected from harmful cultural practices, all forms of violence, inhuman treatment and punishment, and hazardous or exploitative labour.",
      },
    ],
  },
  {
    id: "education-step-4",
    title: "Higher Education",
    content: `
        <h3>Your Rights in Higher Education</h3>
        <p>In higher education settings, you have the right to:</p>
        <ul>
          <li>Fair access to university admission based on merit</li>
          <li>Access student loans, bursaries, and scholarships</li>
          <li>Academic freedom and freedom of expression</li>
          <li>Quality assurance and accreditation of your institution</li>
          <li>Non-discriminatory treatment in internships and placements</li>
          <li>Recognition of academic qualifications</li>
        </ul>
        <p><strong>Financial support:</strong> Higher Education Loans Board (HELB) provides loans to needy students - Contact: 0711-052000.</p>
      `,
    provisions: [
      {
        title: "Right to Education",
        article: "Article 43(1)(f)",
        content: "Every person has the right to education.",
      },
      {
        title: "Academic Freedom",
        article: "Universities Act",
        content:
          "Universities shall have the right and responsibility to preserve and promote the traditional principles of academic freedom in the conduct of their internal and external affairs.",
      },
      {
        title: "Access to Education",
        article: "Article 56(b)",
        content:
          "The State shall put in place affirmative action programmes designed to ensure that minorities and marginalised groups are provided special opportunities in educational and economic fields.",
      },
    ],
  },
];

const accountabilityScenarioSteps = [
  {
    id: "accountability-step-1",
    title: "Government Accountability",
    content: `
      <h3>Your Rights to Hold Government Accountable</h3>
      <p>To hold the government accountable, you have the right to:</p>
      <ul>
        <li>Access information held by the State or needed to exercise your rights</li>
        <li>Petition public authorities on any issue</li>
        <li>Fair administrative action that is expeditious, efficient, and lawful</li>
        <li>Written reasons for administrative actions that adversely affect you</li>
        <li>Public participation in governance and policy-making</li>
        <li>Institute court proceedings when your rights are violated</li>
      </ul>
      <p><strong>Key resource:</strong> Commission on Administrative Justice (Ombudsman) - Hotline: 0800-221-349.</p>
    `,
    provisions: [
      {
        title: "Access to Information",
        article: "Article 35(1)",
        content:
          "Every citizen has the right of access to information held by the State and information held by another person and required for the exercise or protection of any right or fundamental freedom.",
      },
      {
        title: "Fair Administrative Action",
        article: "Article 47(1)(2)",
        content:
          "Every person has the right to administrative action that is expeditious, efficient, lawful, reasonable and procedurally fair. If a right or fundamental freedom of a person has been or is likely to be adversely affected by administrative action, the person has the right to be given written reasons for the action.",
      },
      {
        title: "Public Participation",
        article: "Article 10(2)(a)",
        content:
          "The national values and principles of governance include participation of the people.",
      },
    ],
  },
  {
    id: "accountability-step-2",
    title: "Anti-Corruption Measures",
    content: `
      <h3>Your Role in Combating Corruption</h3>
      <p>To combat corruption, you have the right to:</p>
      <ul>
        <li>Report corruption without fear of retaliation</li>
        <li>Access information about public funds and procurement</li>
        <li>Demand transparency in public service delivery</li>
        <li>Protection as a whistleblower under the Whistleblower Protection Act</li>
        <li>Participate in public audit processes through social audits</li>
        <li>Institute proceedings against corrupt officials or entities</li>
      </ul>
      <p><strong>Reporting channels:</strong> Ethics and Anti-Corruption Commission (EACC) - Hotline: 0800-722-701 or SMS to 22414.</p>
    `,
    provisions: [
      {
        title: "Leadership and Integrity",
        article: "Article 73(1)(a)",
        content:
          "Authority assigned to a State officer is a public trust to be exercised in a manner that is consistent with the purposes and objects of this Constitution, demonstrates respect for the people, brings honour to the nation and dignity to the office, and promotes public confidence in the integrity of the office.",
      },
      {
        title: "Prudent Use of Resources",
        article: "Article 201(d)",
        content:
          "Public money shall be used in a prudent and responsible way.",
      },
      {
        title: "Public Procurement",
        article: "Article 227(1)",
        content:
          "When a State organ or any other public entity contracts for goods or services, it shall do so in accordance with a system that is fair, equitable, transparent, competitive and cost-effective.",
      },
    ],
  },
  {
    id: "accountability-step-3",
    title: "Judicial Remedies",
    content: `
      <h3>Your Rights to Judicial Remedies</h3>
      <p>When seeking judicial remedies, you have the right to:</p>
      <ul>
        <li>Access courts and tribunals without unreasonable restrictions</li>
        <li>File constitutional petitions when your rights are violated</li>
        <li>Request judicial review of administrative actions</li>
        <li>Obtain appropriate relief including declarations, injunctions, and compensation</li>
        <li>Access legal aid if you cannot afford representation</li>
        <li>Have your case heard without unreasonable delay</li>
      </ul>
      <p><strong>Important innovation:</strong> The Small Claims Court now handles cases up to KSh. 1 million with simplified procedures.</p>
    `,
    provisions: [
      {
        title: "Access to Justice",
        article: "Article 48",
        content:
          "The State shall ensure access to justice for all persons and, if any fee is required, it shall be reasonable and shall not impede access to justice.",
      },
      {
        title: "Enforcement of Rights",
        article: "Article 22(1)",
        content:
          "Every person has the right to institute court proceedings claiming that a right or fundamental freedom in the Bill of Rights has been denied, violated or infringed, or is threatened.",
      },
      {
        title: "Authority of Courts",
        article: "Article 23(3)",
        content:
          "In any proceedings brought under Article 22, a court may grant appropriate relief, including a declaration of rights, an injunction, a conservatory order, a declaration of invalidity of any law that denies, violates, infringes, or threatens a right or fundamental freedom, an order for compensation, and an order of judicial review.",
      },
    ],
  },
  {
    id: "accountability-step-4",
    title: "International Remedies",
    content: `
      <h3>International Accountability Mechanisms</h3>
      <p>When domestic remedies are exhausted or ineffective, you can seek international redress through:</p>
      <ul>
        <li>African Commission on Human and Peoples' Rights</li>
        <li>African Court on Human and Peoples' Rights</li>
        <li>United Nations Human Rights Committee</li>
        <li>UN Special Rapporteurs on specific rights issues</li>
        <li>International Criminal Court (for crimes against humanity)</li>
        <li>Diplomatic missions and international human rights organizations</li>
      </ul>
      <p><strong>Recent example:</strong> The African Court awarded $1.3 million in reparations to the Ogiek community for rights violations by the Kenyan government.</p>
    `,
    provisions: [
      {
        title: "International Law",
        article: "Article 2(5)",
        content:
          "The general rules of international law shall form part of the law of Kenya.",
      },
      {
        title: "Treaty Obligations",
        article: "Article 2(6)",
        content:
          "Any treaty or convention ratified by Kenya shall form part of the law of Kenya under this Constitution.",
      },
    ],
  },
];

const scenariosData = {
  arrestScenarioSteps,
  protestScenarioSteps,
  propertyScenarioSteps,
  servicesScenarioSteps,
  workplaceScenarioSteps,
  healthcareScenarioSteps,
  educationScenarioSteps,
  digitalScenarioSteps,
  accountabilityScenarioSteps,
  categories,
};

export default scenariosData;
