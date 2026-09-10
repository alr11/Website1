/**
 * ============================================================================
 * EDIT EVERYTHING HERE.
 * ============================================================================
 * Every piece of business copy on the site — name, phone numbers, services,
 * prices, testimonials, service area — lives in this file. Components read
 * from it; nothing is hardcoded in the pages.
 *
 * The site currently ships with a complete set of worked EXAMPLE values so it
 * reads as a finished business rather than a wireframe. Everything marked
 * `EXAMPLE` is safe to publish but is not real — swap it before going live:
 *
 *   business.licenceNumber   your Swindon Borough Council licence
 *   contact.phone / .href    your real 01793 number (see the note below)
 *   contact.whatsapp / .href your real mobile
 *   contact.email            once the domain is registered
 *   social.*                 your Google Business Profile rating and link
 *   about.founder / .story   your name and your version of the story
 *   testimonials             real, attributable reviews only
 *   pricing.*                your actual rates
 *
 * PHONE NUMBERS: the numbers below come from Ofcom's ranges reserved for
 * drama and documentation (01632 960xxx and 07700 900xxx). They are
 * guaranteed never to be allocated to a real subscriber, so the demo site
 * cannot ring a stranger. Ofcom reserves no range inside the 01793 Swindon
 * code, which is why the example landline is not an 01793 number.
 */

export const siteConfig = {
  /* ---------------------------------------------------------------- business */
  business: {
    name: "JF Taxi Service",
    /** Short form used in tight spaces (mobile header, footer mark). */
    shortName: "JF Taxi",
    /** One line under the hero heading. Keep it under ~90 characters. */
    tagline: "Swindon's pre-booked private hire service",
    valueProp:
      "Fixed-price airport transfers and local journeys across Wiltshire, in a spotless, fully-licensed car — booked in advance, on time, every time.",
    /** Used in <meta name="description"> and social cards. */
    metaDescription:
      "JF Taxi Service — licensed private hire and fixed-price airport transfers from Swindon, Wiltshire. Pre-book Heathrow, Gatwick, Bristol and local journeys.",
    /** Legal / licensing line shown in the footer and About page. */
    licensing: "Licensed private hire operator — Swindon Borough Council", // EXAMPLE
    licenceNumber: "PHO/2019/0847", // EXAMPLE
    established: "2019", // EXAMPLE
  },

  /* ----------------------------------------------------------------- contact */
  contact: {
    /** Human-readable phone, shown in the UI. */
    phone: "01632 960 123", // EXAMPLE — Ofcom reserved fictitious range
    /** E.164 form used in tel: links. Must have no spaces. */
    phoneHref: "+441632960123", // EXAMPLE
    whatsapp: "07700 900 123", // EXAMPLE — Ofcom reserved fictitious range
    /** International form, digits only, for the wa.me link. */
    whatsappHref: "447700900123", // EXAMPLE
    email: "bookings@jftaxiservice.co.uk", // EXAMPLE — domain not yet registered
    baseTown: "Swindon",
    county: "Wiltshire",
    /** Shown wherever an address-ish line is needed. */
    locality: "Swindon, Wiltshire",
    hours: "Pre-book any hour, 7 days a week",
  },

  /* ------------------------------------------------------------ social proof */
  social: {
    rating: 4.9, // EXAMPLE
    reviewCount: 187, // EXAMPLE
    /** Paste your Google Business Profile "write a review" short link here. */
    reviewsUrl: "https://g.page/r/YOUR-PLACE-ID/review", // EXAMPLE
    ratingSource: "Google reviews",
  },

  /* ---------------------------------------------------------------- services */
  services: [
    {
      slug: "airport-transfers",
      name: "Airport Transfers",
      /** One line for the home-page card. */
      summary:
        "Fixed-price runs to Heathrow, Gatwick, Bristol and every major UK airport, with flight-time tracking.",
      /** Longer copy for the Services page. */
      description:
        "Pre-booked, fixed-price airport transfers from Swindon and the surrounding Wiltshire villages. We confirm your pick-up the night before, watch the flight number you give us so a delay does not cost you your car, and allow generous time for the M4 at peak hours. Return legs can be booked at the same time and are held until your flight lands.",
      /** Bullet points on the Services page. */
      points: [
        "Fixed quote confirmed in writing before you travel",
        "Flight tracking on the number you give us",
        "Meet-and-greet at arrivals available on request",
        "Room for luggage — 2 large cases plus cabin bags",
      ],
      icon: "plane",
    },
    {
      slug: "local-taxi",
      name: "Local Taxi",
      summary:
        "Pre-booked journeys around Swindon, Wootton Bassett, Highworth and the surrounding villages.",
      description:
        "Everyday journeys across Swindon and Wiltshire — the station, a hospital appointment, the school run, a night out. All journeys are pre-booked rather than hailed, so you know who is collecting you and what it will cost before you step out of the door.",
      points: [
        "Pre-booked, so no waiting on a rank",
        "The same familiar driver wherever possible",
        "Regular and recurring bookings welcome",
        "Card or bank transfer — no cash needed",
      ],
      icon: "map-pin",
    },
    {
      slug: "corporate-travel",
      name: "Corporate Travel",
      summary:
        "Discreet, punctual business travel with account billing and a single point of contact.",
      description:
        "Account travel for businesses in and around Swindon: client collections, station runs, inter-site journeys and roadshows. One contact, one monthly invoice, and a driver who understands that arriving five minutes early is the job.",
      points: [
        "Monthly account billing on agreed terms",
        "Named contact for every booking",
        "Client collections handled discreetly",
        "Vehicle presented valeted for every job",
      ],
      icon: "briefcase",
    },
    {
      slug: "pre-booked-journeys",
      name: "Pre-Booked Journeys",
      summary:
        "Long-distance, event and early-hours travel, planned and priced in advance.",
      description:
        "Weddings, race days, hospital transfers, long-distance moves and the 4am starts nobody else wants to cover. Tell us the plan and we will price it properly, hold the slot, and be outside before you need us.",
      points: [
        "Early-morning and late-night slots covered",
        "Long-distance journeys priced per mile, not per meter",
        "Wait-and-return available for appointments",
        "Multi-stop routes planned in advance",
      ],
      icon: "clock",
    },
  ],

  /* -------------------------------------------------------------- trust bar */
  trustBadges: [
    { label: "Fully licensed", detail: "Private hire operator & driver licences held" },
    { label: "Fully insured", detail: "Public and hire-and-reward insurance in place" },
    { label: "DBS checked", detail: "Enhanced background check on file" },
    { label: "Fixed prices", detail: "Quoted up front — no meter surprises" },
  ],

  /* ------------------------------------------------------------------ fleet */
  fleet: {
    heading: "The car",
    vehicle: "Volkswagen Caddy",
    /** Shown as a short spec strip under the fleet photo. */
    specs: [
      { label: "Passengers", value: "Up to 4" },
      { label: "Luggage", value: "2 large + 2 cabin" },
      { label: "Finish", value: "Gloss black, tinted rear" },
      { label: "Valeted", value: "Before every job" },
    ],
    description:
      "One car, kept properly. A gloss-black Volkswagen Caddy on black alloys with tinted rear glass — valeted before every job, climate controlled, with genuine room for luggage and a boot that swallows a full airport run.",
  },

  /* ----------------------------------------------------------- price engine */
  /**
   * FRONT-END ESTIMATOR ONLY. These figures drive the /pricing calculator,
   * which runs entirely in the browser. There is no pricing API and no
   * payment processing anywhere in this project.
   *
   * EXAMPLE rates. They are internally consistent and roughly plausible for
   * Swindon, but they are invented — replace the lot with your real prices.
   */
  pricing: {
    currency: "£",
    /** Charged on every job regardless of distance. */
    bookingFee: 3,
    /** Named routes with a genuinely fixed price (airport work). */
    fixedRoutes: [
      { id: "heathrow", label: "London Heathrow (LHR)", price: 110 },
      { id: "gatwick", label: "London Gatwick (LGW)", price: 165 },
      { id: "bristol", label: "Bristol (BRS)", price: 95 },
      { id: "birmingham", label: "Birmingham (BHX)", price: 155 },
      { id: "stansted", label: "London Stansted (STN)", price: 215 },
      { id: "luton", label: "London Luton (LTN)", price: 180 },
      { id: "southampton", label: "Southampton (SOU)", price: 130 },
    ],
    /** Common local destinations, priced per journey. */
    localRoutes: [
      { id: "swindon-central", label: "Swindon town centre", price: 8 },
      { id: "swindon-station", label: "Swindon railway station", price: 9 },
      { id: "great-western-hospital", label: "Great Western Hospital", price: 12 },
      { id: "royal-wootton-bassett", label: "Royal Wootton Bassett", price: 18 },
      { id: "highworth", label: "Highworth", price: 16 },
      { id: "marlborough", label: "Marlborough", price: 38 },
      { id: "cirencester", label: "Cirencester", price: 34 },
      { id: "chippenham", label: "Chippenham", price: 35 },
    ],
    /** Fallback when the destination is not on either list above. */
    perMile: 2.2,
    minimumFare: 8,
    /** Multiplier applied to the whole estimate, by vehicle. */
    vehicleTypes: [
      {
        id: "saloon",
        label: "Standard (up to 4)",
        detail: "Volkswagen Caddy — 4 passengers, 2 large cases",
        multiplier: 1,
      },
      {
        id: "estate",
        label: "Extra luggage (up to 4)",
        detail: "Same car, luggage-first layout — 4 passengers, 4 large cases",
        multiplier: 1.15,
      },
      {
        id: "executive",
        label: "Executive (up to 3)",
        detail: "Partner vehicle, subject to availability",
        multiplier: 1.45,
      },
    ],
    /** Surcharges the estimator can apply, as a fraction of the base fare. */
    surcharges: {
      /** 22:00–05:59 pick-ups. */
      night: { label: "Late-night / early-morning (22:00–06:00)", rate: 0.2 },
      /** Saturday and Sunday pick-ups. */
      weekend: { label: "Weekend", rate: 0.1 },
    },
    /** Return trips get the outbound fare again, less this discount. */
    returnDiscount: 0.1,
    /** Shown under every quote. */
    disclaimer:
      "Estimates are indicative only and generated in your browser from our standard rates. Your final fixed price is confirmed by us in writing before you travel.",
  },

  /* ----------------------------------------------------------- service area */
  serviceArea: {
    heading: "Where we cover",
    description:
      "Based in Swindon and covering the whole of Wiltshire, with long-distance and airport work nationwide.",
    towns: [
      "Swindon",
      "Royal Wootton Bassett",
      "Highworth",
      "Wroughton",
      "Marlborough",
      "Chippenham",
      "Cirencester",
      "Faringdon",
      "Devizes",
      "Calne",
    ],
  },

  /* ------------------------------------------------------------- about copy */
  about: {
    heading: "One driver, one car, done properly",
    /** Paragraphs of the founder story. EXAMPLE — rewrite in your own words. */
    story: [
      "JF Taxi Service started with a simple frustration: booking a car for an early flight and having no idea, right up until the moment it did or did not arrive, whether anyone was actually coming.",
      "So the model here is deliberately small. One licensed driver, one immaculately kept car, and a diary that is never overbooked. Every journey is agreed in advance at a fixed price, confirmed the night before, and driven by the person you spoke to.",
      "It means we cannot take every job. It also means that when we say we will be outside at ten past four in the morning, we are outside at ten past four in the morning.",
    ],
    founder: {
      name: "James Fielding", // EXAMPLE
      role: "Owner & licensed driver", // EXAMPLE
    },
  },

  /* ----------------------------------------------------------- testimonials */
  /**
   * EXAMPLE reviews — written for the demo, not said by anyone. Publishing
   * invented reviews as genuine would breach the CMA's rules on fake
   * consumer reviews, so replace these with real, attributable ones before
   * the site goes live.
   */
  testimonials: [
    {
      quote:
        "Booked a 4am run to Heathrow and half expected to be standing on the drive with my case. He was there at ten to, boot open, car spotless. Faultless.",
      author: "Sarah M.",
      context: "Heathrow transfer",
    },
    {
      quote:
        "We use JF for client collections now. The price is agreed before, the invoice comes monthly, and nobody has ever been left waiting at the station.",
      author: "Daniel O.",
      context: "Corporate account",
    },
    {
      quote:
        "Flight came in two hours late and I had already resigned myself to a train. Got a message saying he had tracked it and was still coming. Genuinely above and beyond.",
      author: "Priya K.",
      context: "Gatwick return",
    },
  ],

  /* ------------------------------------------------------------ navigation */
  nav: [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],

  /* ---------------------------------------------------------------- imagery */
  /**
   * Drop the real photographs into /public/images using exactly these
   * filenames and the site picks them up with no code changes. See
   * public/images/README.md for the list and suggested sizes.
   */
  images: {
    logo: "/images/TODO-logo.svg",
    hero: "/images/TODO-hero-night-road.svg",
    fleet: "/images/TODO-caddy-vw-front-three-quarter.svg",
    fleetAlt: "/images/TODO-caddy-vw-rear.svg",
    about: "/images/TODO-driver-portrait.svg",
    map: "/images/TODO-service-area-map.svg",
  },
} as const;

export type SiteConfig = typeof siteConfig;
export type Service = (typeof siteConfig.services)[number];
export type VehicleType = (typeof siteConfig.pricing.vehicleTypes)[number];
