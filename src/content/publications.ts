export type Publication = {
  citation: string;
  venue: string;
  year: number;
  url?: string;
  pmid?: string;
  doi?: string;
};

export type Patent = {
  title: string;
  number: string;
  office: string;
  url?: string;
};

export const publications: Publication[] = [
  {
    citation:
      "DeAngelis, M., Wilkinson, E., Anant, M., Sharma, S., Vijayadamodar, G., Upmanyu, S., Ganjoo, A., Alesci, S., Kant, A., & Nandabalan, K. (2022). AI-based deconvolution of the gut-brain axis (GBA) and its therapeutic implications.",
    venue: "Gastroenterology, 162(7-S), 760",
    year: 2022,
  },
  {
    citation:
      "Rastelli, L., Gupta, S., Dahiya, A., Jagga, Z., Nandabalan, K., & Upmanyu, S. (2017). The synergy between BXCL701, a DPP inhibitor, and immune checkpoint inhibitors discovered using AI and Big Data analytics.",
    venue: "AACR; Cancer Res, 77(13 Suppl), Washington, DC",
    year: 2017,
    url: "https://aacrjournals.org/cancerres/article/77/13_Supplement/2629/618162",
  },
  {
    citation:
      "Sheetal, K., Upmanyu, S., Sharma, H., & Nandabalan, K. (2015). Targeting immune checkpoints: using a big data approach for their identification, prioritization and application.",
    venue: "AACR 106th Annual Meeting, Philadelphia, PA",
    year: 2015,
  },
  {
    citation:
      "Tiwari, P., Saini, S., Upmanyu, S., Benjamin, B., Tandon, R., Saini, K. S., & Sahdev, S. (2010). Enhanced expression of recombinant proteins utilizing a modified baculovirus expression vector.",
    venue: "Molecular Biotechnology, 46, 80-89",
    year: 2010,
    pmid: "20424933",
    doi: "10.1007/s12033-010-9284-3",
    url: "https://pubmed.ncbi.nlm.nih.gov/20424933/",
  },
  {
    citation:
      "Tiwari, P., Saini, S., Upmanyu, S., Saini, K. S., & Sahdev, S. (2009). Enhanced expression of kinases and cyp-450 enzymes through a modified Baculovirus expression vector for oncology research.",
    venue: "Poster, International Symposium on Cancer Chemoprevention, JNU, New Delhi",
    year: 2009,
  },
];

export const patents: Patent[] = [
  {
    title:
      "Novel Immunomodulatory Therapeutic Strategies Targeting Tumors in Cancer",
    number: "US20180134771",
    office: "United States Patent and Trademark Office",
    url: "https://patents.google.com/patent/US20180134771A1",
  },
  {
    title: "Immunomodulation Therapies for Cancer",
    number: "US20190008918",
    office: "United States Patent and Trademark Office",
    url: "https://patents.google.com/patent/US20190008918A1",
  },
];
