import { site } from "@/content/site";

export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    image: `${site.url}/sanatan-square.jpg`,
    jobTitle: "Co-founder & Head of Data Science",
    description: site.tagline,
    email: `mailto:${site.emails.personal}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Basel",
      addressRegion: "Basel-Stadt",
      addressCountry: "CH",
    },
    sameAs: [site.linkedin, site.github],
    worksFor: [
      {
        "@type": "Organization",
        name: "Apxora GmbH",
        url: "https://apxora.com",
      },
      {
        "@type": "Organization",
        name: "AlphaMeld GmbH",
        url: "https://alphameld.com",
      },
      { "@type": "Organization", name: "Artixio" },
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "University of Rajasthan",
    },
    knowsAbout: [
      "Artificial Intelligence",
      "Machine Learning",
      "Drug Discovery",
      "Clinical Trial Design",
      "Knowledge Graphs",
      "Natural Language Processing",
      "Digital Twins",
      "Regulatory Intelligence",
      "Python",
      "TypeScript",
      "React",
      "Neo4j",
      "PostgreSQL",
      "AWS",
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Patent",
        name: "US20180134771 — Novel Immunomodulatory Therapeutic Strategies Targeting Tumors in Cancer",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Patent",
        name: "US20190008918 — Immunomodulation Therapies for Cancer",
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    description: site.tagline,
    author: { "@type": "Person", name: site.name, url: site.url },
    inLanguage: "en",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: Readonly<{ items: { name: string; href: string }[] }>) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.href}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type BlogPostingProps = {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  tags: string[];
};

export function BlogPostingJsonLd({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  tags,
}: Readonly<BlogPostingProps>) {
  const url = `${site.url}/blog/${slug}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished,
    dateModified,
    keywords: tags.join(", "),
    author: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    publisher: {
      "@type": "Person",
      name: site.name,
      url: site.url,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: "en",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
