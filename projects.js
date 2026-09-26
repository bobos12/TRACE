const projects = [
  {
    name: "Movies Flex",
    description:
      "A modern movie discovery web app that allows users to explore, filter, and sort thousands of high-rated movies using real-time data from TMDB. Built for speed, usability, and a clean browsing experience.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "tmdb api",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    features: [
      "Browse and discover thousands of high-rated movies",
      "Real-time catalogue data from the TMDB API",
      "Filter and sort by rating, genre, and popularity",
      "Fast, responsive browsing across all screen sizes",
    ],
    categories: ["Frontend"],
    image: movie,
    source_code_link: "https://github.com/bobos12/MOVIES-FLEX",
    live_demo_link: "",
  },
  {
    name: "3D Portfolio",
    description:
      "A modern and interactive 3D portfolio website showcasing projects, skills, and experience, built with React, Three.js, and Tailwind CSS.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "three.js", color: "green-text-gradient" },
      { name: "tailwind", color: "pink-text-gradient" },
      { name: "framer motion", color: "purple-text-gradient" },
      { name: "email.js", color: "yellow-text-gradient" },
    ],
    features: [
      "Interactive 3D elements and animations",
      "Responsive design",
      "Modern UI/UX",
      "Contact form",
      "Project showcase",
      "Skills and experience section",
    ],
    categories: ["Frontend", "3D"],
    image: portfolio, // replace with your imported image variable
    source_code_link: "https://github.com/bobos12/portfolio_1",
    live_demo_link: "",
  },
  {
    name: "LamaBooking – Hotel Booking System",
    description:
      "A full-stack web application that allows users to search and book hotels with real-time availability, secure authentication, and user-friendly UI. Admins can manage listings, rooms, and reservations.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "node.js",
        color: "green-text-gradient",
      },
      {
        name: "mongodb",
        color: "orange-text-gradient",
      },
      {
        name: "express",
        color: "pink-text-gradient",
      },
      {
        name: "jwt-auth",
        color: "red-text-gradient",
      },
    ],
    features: [
      "Hotel search with real-time availability",
      "Secure JWT-based authentication",
      "Admin panel for listings, rooms, and reservations",
      "RESTful API built on Node.js and Express",
      "MongoDB data layer with validation",
    ],
    categories: ["Full-Stack"],
    image: booking, // Replace 'booking' with your actual image import name
    source_code_link: "https://github.com/bobos12/booooooooking",
    live_demo_link: "",
  },
  {
    name: "Startify",
    description:
      "A modern, responsive hotel booking interface designed to deliver a seamless user experience. Features dynamic search, interactive listings, and clean UI flows optimized for speed and usability across all devices.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "responsive-ui", color: "green-text-gradient" },
      { name: "modern-design", color: "pink-text-gradient" },
      { name: "component-based", color: "orange-text-gradient" },
      { name: "frontend-architecture", color: "red-text-gradient" },
    ],
    features: [
      "Dynamic hotel search interface",
      "Interactive listings with clean UI flows",
      "Fully responsive across mobile, tablet, and desktop",
      "Component-based frontend architecture",
    ],
    categories: ["Frontend"],
    image: startify,
    source_code_link: "https://github.com/bobos12/STARTIFY",
    live_demo_link: "https://startify-nine.vercel.app/",
  },
  {
    name: "GPT-4 Landing Page",
    description:
      "A high-conversion, responsive landing page showcasing GPT-4 features with modern UI design, smooth animations, and clear call-to-action sections optimized for user engagement and performance.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "responsive-design", color: "green-text-gradient" },
      { name: "ui-ux", color: "pink-text-gradient" },
      { name: "animation", color: "orange-text-gradient" },
      { name: "frontend-performance", color: "red-text-gradient" },
    ],
    features: [
      "High-conversion landing page structure",
      "Smooth scroll and entrance animations",
      "Clear, well-placed call-to-action sections",
      "Optimized for performance and responsiveness",
    ],
    categories: ["Frontend"],
    image: gpt,
    source_code_link: "https://github.com/bobos12/gpt_3",
    live_demo_link: "https://gpt-3-two-theta.vercel.app/",
  },
  {
    name: "Eye Clinic Management System",
    description:
      "A full-stack MERN web application for managing an ophthalmology clinic, including patient records, visit tracking, medical examinations, prescriptions, and secure authentication with role-based access.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "nodejs",
        color: "green-text-gradient",
      },
      {
        name: "mongodb",
        color: "pink-text-gradient",
      },
      {
        name: "express",
        color: "orange-text-gradient",
      },
      { name: "component-based", color: "orange-text-gradient" },
      { name: "frontend-architecture", color: "red-text-gradient" },
    ],
    features: [
      "Patient records and visit tracking",
      "Medical examinations and prescription management",
      "Role-based access control",
      "Secure authentication and backend validation",
      "Full MERN stack architecture",
    ],
    categories: ["Full-Stack"],
    image: clinic, // your project screenshot
    source_code_link: "https://github.com/bobos12/CLINIC-MANGMENT",
    live_demo_link: "",
  },
  {
    name: "ELITE GPT",
    description:
      "ELITE is an advanced AI-powered legal assistant designed to provide quick, accurate, and accessible legal advice. Whether you need help understanding your rights, drafting basic legal documents, or getting guidance on common legal issues, ELITE is here 24/7. With a user-friendly interface and a growing knowledge base covering multiple areas of law, ELITE helps you make informed legal decisions — anytime, anywhere",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "mongodb",
        color: "green-text-gradient",
      },
      {
        name: "hugging-face",
        color: "green-text-gradient",
      },
      {
        name: "scss",
        color: "pink-text-gradient",
      },
    ],
    features: [
      "AI-powered legal assistance available 24/7",
      "Guidance on common legal issues and rights",
      "Help drafting basic legal documents",
      "Knowledge base spanning multiple areas of law",
      "Hugging Face model integration",
    ],
    categories: ["Full-Stack", "AI"],
    image: elitegpt,
    source_code_link: "https://github.com/bobos12/ELITE-GPT",
    live_demo_link: "https://elitegpt.vercel.app/",
    status: "dev",
  },
  {
    name: "Future Earth Energy Systems",
    description:
      "A bilingual (Arabic/English) corporate website for a certified solar energy and energy-storage contractor in Riyadh. Showcases EPC services, megawatt-scale rooftop and ground-mounted installations, and technical partnerships with brands like Huawei and Schneider Electric — built for credibility and lead generation in the renewable energy sector.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "next.js", color: "green-text-gradient" },
      { name: "tailwind", color: "pink-text-gradient" },
      { name: "i18n", color: "orange-text-gradient" },
    ],
    features: [
      "Bilingual Arabic / English interface",
      "Solar and energy-storage solution showcase",
      "Megawatt-scale completed project gallery",
      "Certification and technical partner highlights",
      "Structured for lead generation",
    ],
    categories: ["Client Work", "Frontend"],
    image: futureEarth,
    live_demo_link: "https://future-earth-showcase.vercel.app/ar",
  },
  {
    name: "Car Test – Auto Service Center",
    description:
      "A business website for a European luxury car service center in Riyadh, presenting maintenance, diagnostics, and repair services for 16 premium automotive brands. Clean, high-trust design tailored to an Arabic-speaking automotive audience, with clear calls-to-action for booking service.",
    tags: [
      { name: "html-css-js", color: "blue-text-gradient" },
      { name: "responsive-ui", color: "green-text-gradient" },
      { name: "automotive", color: "red-text-gradient" },
    ],
    features: [
      "Service catalogue for maintenance, diagnostics, and repairs",
      "Coverage across 16 premium European brands",
      "Arabic-first, high-trust visual design",
      "Prominent booking and contact calls-to-action",
    ],
    categories: ["Client Work"],
    image: carTest,
    live_demo_link: "https://www.cartest-auto.com/",
  },
  {
    name: "Fateen – Web Development Landing Page",
    description:
      "A conversion-focused Arabic landing page built for a Saudi digital marketing agency to advertise their website, e-commerce, and landing page development services. Clear service breakdown, trust signals, and prominent calls-to-action designed to turn visitors into qualified leads.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "css", color: "pink-text-gradient" },
      { name: "landing-page", color: "green-text-gradient" },
      { name: "conversion-design", color: "orange-text-gradient" },
    ],
    features: [
      "Conversion-focused Arabic landing page",
      "Clear breakdown of web development services",
      "Trust signals and credential highlights",
      "Prominent WhatsApp and phone calls-to-action",
    ],
    categories: ["Client Work", "Frontend"],
    image: fateen,
    live_demo_link: "https://fateenksa.com/web-development/",
  },
  {
    name: "Najm Al-Ithar Travel",
    description:
      "An Arabic website for a licensed travel agency based in Al-Ahsa, Eastern Province, offering Umrah packages, religious trips to holy sites, and tourism travel inside and outside Saudi Arabia. Built to convert visitors into bookings with direct WhatsApp and phone enquiry flows.",
    tags: [
      { name: "html-css-js", color: "blue-text-gradient" },
      { name: "rtl-arabic", color: "green-text-gradient" },
      { name: "responsive-ui", color: "pink-text-gradient" },
      { name: "travel", color: "orange-text-gradient" },
    ],
    features: [
      "Umrah, religious, and tourism trip packages",
      "Right-to-left Arabic layout and typography",
      "Official Ministry of Commerce and Tourism licensing highlights",
      "Real trip gallery shot by the team and guests",
      "Direct WhatsApp and phone booking calls-to-action",
    ],
    categories: ["Client Work"],
    image: najmAlithar,
    live_demo_link: "https://najmalithar.org/",
  },
  {
    name: "Retal Residence",
    description:
      "A bilingual (English/Arabic) landing page for an ultra-premium residential compound in Al Khobar, Saudi Arabia. Presents seven residence types — apartments, town villas, and executive villas — alongside clubhouse facilities, neighbourhood highlights, and concierge services, all built around scheduling a visit.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "vite", color: "purple-text-gradient" },
      { name: "bilingual-en-ar", color: "green-text-gradient" },
      { name: "real-estate", color: "orange-text-gradient" },
      { name: "luxury-ui", color: "pink-text-gradient" },
    ],
    features: [
      "Seven residence types with floor plans and specifications",
      "50+ premium amenities showcase",
      "Neighbourhood proximity and landmark highlights",
      "English / Arabic language toggle with RTL support",
      "Schedule-a-visit and WhatsApp enquiry flows",
    ],
    categories: ["Client Work", "Frontend"],
    image: retalResidence,
    live_demo_link: "https://retal-residence-landing.vercel.app/",
  },
  {
    name: "Albadar Oud Store",
    description:
      "An Arabic e-commerce store for a Saudi oud and incense retailer, selling premium agarwood, oud oils, musk blends, perfumes, and incense accessories. Built on Salla with a full catalogue, cart, and checkout flow tailored to Gulf shoppers.",
    tags: [
      { name: "salla", color: "green-text-gradient" },
      { name: "e-commerce", color: "blue-text-gradient" },
      { name: "rtl-arabic", color: "pink-text-gradient" },
      { name: "fragrance", color: "orange-text-gradient" },
    ],
    features: [
      "Full product catalogue for oud, oud oils, musk, and incense",
      "Right-to-left Arabic storefront and typography",
      "Category browsing with best-sellers and featured collections",
      "Cart and secure checkout on the Salla platform",
      "Branded storefront design with product galleries",
    ],
    categories: ["Client Work", "Stores"],
    image: albadarOud,
    live_demo_link: "https://albadar-oud.com/",
  },
  {
    name: "Abu Mayar Wild Game Store",
    description:
      "An Arabic e-commerce store for a Saudi specialist in premium wild game meat, offering slaughtering and butchering to order. Built on Salla with free delivery, Tabby and Tamara instalment payments, and a category-driven catalogue.",
    tags: [
      { name: "salla", color: "green-text-gradient" },
      { name: "e-commerce", color: "blue-text-gradient" },
      { name: "rtl-arabic", color: "pink-text-gradient" },
      { name: "bnpl-payments", color: "purple-text-gradient" },
    ],
    features: [
      "Catalogue of premium wild game cuts across multiple categories",
      "Custom slaughtering and cutting requests at checkout",
      "Tabby and Tamara instalment payment options",
      "Free delivery across the Kingdom",
      "Right-to-left Arabic storefront and typography",
    ],
    categories: ["Client Work", "Stores"],
    image: abuMayar,
    live_demo_link: "https://abu-mayar-lilthabayih-sa.com/",
  },
];