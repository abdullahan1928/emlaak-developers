export interface Service {
  title: string;
  slug: string;
  description: string;
  fullDescription: string;
  image: string;
  highlight?: string;
  stat?: string;
  features?: string[];
  ctaText?: string;
  ctaLink?: string;
}

export const services: Service[] = [
  {
    title: "Commercial",
    slug: "commercial",
    description: "Strategic commercial property solutions tailored for businesses.",
    fullDescription:
      "We provide commercial real estate solutions for offices, retail, and corporate spaces. Our approach ensures optimal ROI and long-term growth for your business property investments.",
    image: "service1.gif",
    highlight: "High ROI",
    stat: "120+ Deals",
    features: [
      "Office and retail space acquisition",
      "Lease management and optimization",
      "Market analysis & strategic recommendations",
    ],
    ctaText: "Explore Commercial Solutions",
    ctaLink: "/contact",
  },
  {
    title: "Residential",
    slug: "residential",
    description: "Premium living spaces designed for comfort and lifestyle.",
    fullDescription:
      "From apartments to villas, our residential services help clients find homes that suit their lifestyle. We guide every step of the purchase, sale, or rental process with expert advice.",
    image: "service6.gif",
    highlight: "Luxury Living",
    stat: "500+ Homes",
    features: [
      "Apartment and villa listings",
      "Neighborhood insights & amenities",
      "Guided property purchase and rental",
    ],
    ctaText: "Find Your Dream Home",
    ctaLink: "/contact",
  },
  {
    title: "Industrial",
    slug: "industrial",
    description: "Efficient industrial spaces for operations and logistics.",
    fullDescription:
      "Our industrial real estate services cater to warehouses, factories, and logistics hubs. We help businesses find scalable and efficient spaces that support operational growth.",
    image: "service2.gif",
    highlight: "Scalable",
    stat: "80+ Projects",
    features: [
      "Warehouse and factory sourcing",
      "Logistics and supply chain optimization",
      "Site evaluation and compliance support",
    ],
    ctaText: "Explore Industrial Spaces",
    ctaLink: "/contact",
  },
  {
    title: "Agricultural",
    slug: "agricultural",
    description: "Land solutions supporting farming and agribusiness growth.",
    fullDescription:
      "We offer agricultural land solutions tailored for farming, investment, and agribusiness expansion. Our expertise ensures long-term value and sustainable land use.",
    image: "service3.gif",
    highlight: "Long-Term Value",
    stat: "300+ Acres",
    features: [
      "Farmland acquisition and sales",
      "Soil and land evaluation",
      "Agribusiness investment consulting",
    ],
    ctaText: "Explore Agricultural Land",
    ctaLink: "/contact",
  },
  {
    title: "Investment",
    slug: "investment",
    description: "Smart real estate investments designed for wealth growth.",
    fullDescription:
      "Our investment services help clients identify high-yield opportunities in real estate. We provide strategic insights and risk analysis to maximize returns.",
    image: "service7.gif",
    highlight: "Secure Returns",
    stat: "20% Avg ROI",
    features: [
      "Portfolio diversification strategies",
      "ROI analysis and forecasting",
      "Market trend insights",
    ],
    ctaText: "Start Investing",
    ctaLink: "/contact",
  },
  {
    title: "Sale",
    slug: "sale",
    description: "Maximize your property value with expert selling strategies.",
    fullDescription:
      "We help property owners sell quickly and at the best possible price using proven marketing strategies and market insights.",
    image: "service4.gif",
    highlight: "Fast Closures",
    stat: "95% Success",
    features: [
      "Property valuation and pricing strategy",
      "Professional marketing and listings",
      "Negotiation and closing support",
    ],
    ctaText: "Sell Your Property",
    ctaLink: "/contact",
  },
  {
    title: "Purchase",
    slug: "purchase",
    description: "Guided property acquisition with full transparency.",
    fullDescription:
      "Our purchase services ensure buyers make informed decisions with complete transparency, from property selection to final documentation.",
    image: "service5.gif",
    highlight: "Trusted Deals",
    stat: "1000+ Clients",
    features: [
      "Property search and shortlisting",
      "Legal verification and documentation",
      "End-to-end buying assistance",
    ],
    ctaText: "Buy Property",
    ctaLink: "/contact",
  },
  {
    title: "Rent",
    slug: "rent",
    description: "Find the perfect rental property tailored to your needs.",
    fullDescription:
      "We connect tenants with ideal rental properties and help landlords manage listings efficiently, ensuring smooth and reliable rental experiences.",
    image: "service8.gif",
    highlight: "Flexible",
    stat: "200+ Listings",
    features: [
      "Rental property listings",
      "Tenant screening and support",
      "Lease agreement assistance",
    ],
    ctaText: "Browse Rentals",
    ctaLink: "/contact",
  },
];