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
      addressCountry: "CH",
    },
    sameAs: [site.linkedin, site.github],
    worksFor: [
      { "@type": "Organization", name: "Apxora" },
      { "@type": "Organization", name: "AlphaMeld GmbH" },
      { "@type": "Organization", name: "Artixio" },
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
}: BlogPostingProps) {
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
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
