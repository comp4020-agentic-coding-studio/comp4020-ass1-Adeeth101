// The 28-node human lineage, LUCA to you. See docs/DESIGN.md §7 for the cut
// rationale and docs/PLAN.md for the finalized table this was built from.
//
// Ages are in Ma (millions of years before present) throughout, including
// the youngest nodes, for a single consistent unit across the whole array —
// e.g. Homo sapiens is 0.3, not "300 ka". `age` is a defensible point
// estimate within `ageRange`; where the literature disagrees substantially,
// that disagreement is recorded in `note`, not smoothed away. Every date
// and every "stillWithYou" claim was checked against TimeTree, a named
// primary paper, or a cited secondary source in `source` — none of it is
// from memory, per the science-accuracy rule in this repo's CLAUDE.md.
//
// Two content corrections came out of that verification, not just date
// fixes:
// - Simiiformes' "gained three-colour vision" claim didn't hold up (tarsiers
//   likely already carried much of the same gene toolkit) — reframed as a
//   cousins-aren't-primitive moment instead of a trait-gain moment.
// - Homo sapiens' branch timing was wrong: Neanderthals and Denisovans had
//   already been a separate lineage for roughly a quarter of a million years
//   by the time anatomically modern humans appear, so they don't "leave
//   here". The honest and more interesting fact is the later interbreeding
//   event, used as this node's stillWithYou instead.

export interface LineageNode {
  id: string;
  name: string;
  age: number;
  ageRange: [number, number];
  branch: string;
  branchExamples: string[];
  gained: string;
  stillWithYou?: string;
  source: string;
  note?: string;
}

export const LINEAGE: LineageNode[] = [
  {
    id: "luca",
    name: "LUCA — the last universal common ancestor",
    age: 4200,
    ageRange: [4090, 4330],
    branch: "",
    branchExamples: [],
    gained: "the code itself — DNA, the genetic code, ribosomal protein synthesis",
    source:
      "Moody et al. 2024, Nature Ecology & Evolution, \"The nature of the last universal common ancestor and its impact on the early Earth system\" — https://www.nature.com/articles/s41559-024-02461-1",
    note: "One of the most contested dates in the whole tree — some studies put LUCA as old as 4.3–4.5 Ga. Treat ~4.2 Ga as a working estimate, not a settled figure.",
  },
  {
    id: "eukaryote",
    name: "The first eukaryote",
    age: 1900,
    ageRange: [1600, 2300],
    branch: "bacteria (all of them)",
    branchExamples: ["all bacteria"],
    gained: "mitochondria — a captured bacterium, still running inside every one of your cells",
    stillWithYou:
      "your mitochondria still carry their own separate DNA — the last trace of the bacterium they used to be",
    source:
      "Eukaryogenesis timing synthesized from Nature 2025 Asgard-archaea study (https://www.nature.com/articles/s41586-025-08955-7) and multiple LECA-dating studies spanning ~1.1–2.3 Ga",
    note: "One of the most actively disputed dates in eukaryote biology, and which archaeal lineage is the exact sister group is still argued. The \"archaeon that swallowed a bacterium\" framing is settled; the precise timing and exact sister lineage are not.",
  },
  {
    id: "amorphea",
    name: "Amorphea",
    age: 1600,
    ageRange: [1400, 1700],
    branch: "plants, algae",
    branchExamples: ["land plants", "algae"],
    gained: "",
    source:
      "Multigene molecular-clock studies placing this in the Mesoproterozoic — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10883732/",
  },
  {
    id: "opisthokonta",
    name: "Opisthokonta",
    age: 1100,
    ageRange: [1000, 1600],
    branch: "amoebae",
    branchExamples: ["Amoebozoa"],
    gained: "a rear-mounted flagellum — the same layout your sperm's tail still uses",
    source:
      "PLOS Biology 2024, genome-scale phylogenomics — https://journals.plos.org/plosbiology/article?id=10.1371%2Fjournal.pbio.3002794 (~1.1 Ga, 95% CI 979–1188 Ma)",
  },
  {
    id: "holozoa",
    name: "Holozoa",
    age: 1050,
    ageRange: [950, 1767],
    branch: "fungi",
    branchExamples: ["fungi"],
    gained: "",
    source:
      "PLOS Biology 2024 gives ~1.0 Ga (https://journals.plos.org/plosbiology/article?id=10.1371%2Fjournal.pbio.3002794); a fossil/HGT-calibrated Nature Ecology & Evolution 2025 estimate gives up to 1.77 Ga (https://www.nature.com/articles/s41559-025-02851-z)",
    note: "A genuine method-dependent discrepancy of several hundred million years — kept as an honest wide range rather than smoothed into a fake-precise number.",
  },
  {
    id: "metazoa",
    name: "The first animal",
    age: 800,
    ageRange: [700, 1240],
    branch: "",
    branchExamples: [],
    gained: "multicellularity",
    source:
      "TimeTree-derived estimate, Blair 2009 chapter — https://timetree.org/public/data/pdf/Blair2009Chap24.pdf",
  },
  {
    id: "eumetazoa",
    name: "Eumetazoa",
    age: 750,
    ageRange: [660, 1240],
    branch: "sponges",
    branchExamples: ["sponges"],
    gained: "tissues and nerves",
    source:
      "TimeTree-derived estimate, Blair 2009 chapter (as above); a ~600 Ma poriferan fossil sets a hard minimum — https://www.science.org/content/article/oldest-known-sponge-pushes-back-date-key-split-animal-evolution",
  },
  {
    id: "bilateria",
    name: "Bilateria — a front and a back",
    age: 650,
    ageRange: [596, 688],
    branch: "jellyfish, corals",
    branchExamples: ["jellyfish", "corals"],
    gained: "bilateral symmetry — a front end and a back end",
    source:
      "dos Reis et al., Current Biology — https://www.sciencedirect.com/science/article/pii/S096098221501177X",
    note: "Highly dependent on tree topology — whether Placozoa or Cnidaria is treated as the outgroup shifts this figure substantially; older studies range up to 1.3 Ga.",
  },
  {
    id: "deuterostomia",
    name: "Deuterostomia",
    age: 580,
    ageRange: [558, 650],
    branch: "insects, molluscs, worms",
    branchExamples: ["insects", "molluscs", "earthworms"],
    gained: "a gut built back-to-front — your mouth and anus swap developmental roles compared to theirs",
    source: "Science Advances 2024 — https://www.science.org/doi/10.1126/sciadv.adp7161",
  },
  {
    id: "chordata",
    name: "Chordata",
    age: 570,
    ageRange: [535, 590],
    branch: "starfish, urchins",
    branchExamples: ["starfish", "sea urchins"],
    gained: "a notochord and dorsal nerve cord — the rod that became your spine",
    source:
      "TimeTree-derived estimate, Blair 2009 chapter; Ambulacraria topology per Wikipedia — https://en.wikipedia.org/wiki/Ambulacraria",
  },
  {
    id: "vertebrata",
    name: "The first vertebrate",
    age: 550,
    ageRange: [535, 590],
    branch: "lancelets",
    branchExamples: ["lancelets (amphioxus)"],
    gained: "a skull and a spine",
    stillWithYou:
      "your recurrent laryngeal nerve still detours down into your chest and back up to your throat — a fish-with-no-neck's wiring, dragged out of a straight line as vertebrate necks got longer",
    source:
      "Age: PMC2034537, lancelet mitogenome study — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2034537/. Recurrent laryngeal nerve: standard vertebrate anatomy, e.g. https://en.wikipedia.org/wiki/Recurrent_laryngeal_nerve",
    note: "The age is the weakest-sourced figure in this dataset — the cited paper is incidental to a question about within-lancelet divergence, not a dedicated vertebrate/cephalochordate dating study. Worth a stronger date source before shipping if time allows; the anatomical fact itself is uncontested.",
  },
  {
    id: "gnathostomata",
    name: "Gnathostomata — the first jaws",
    age: 460,
    ageRange: [450, 525],
    branch: "lampreys, hagfish",
    branchExamples: ["lampreys", "hagfish"],
    gained: "jaws",
    source:
      "Hedges 2009 TimeTree chapter — https://timetree.org/public/data/pdf/Hedges2009Chap39.pdf; Science Advances",
  },
  {
    id: "osteichthyes",
    name: "Bony fish",
    age: 430,
    ageRange: [410, 447],
    branch: "sharks, rays",
    branchExamples: ["sharks", "rays"],
    gained: "bone instead of cartilage",
    source:
      "PLOS ONE — https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0066400 (410–447 Ma, 95% CI)",
  },
  {
    id: "sarcopterygii",
    name: "Lobe-finned fish",
    age: 420,
    ageRange: [409, 450],
    branch: "ray-finned fish (99% of fish alive today)",
    branchExamples: ["ray-finned fish"],
    gained: "bones in the fin — one, then two, then many. The money-shot sequence begins here.",
    stillWithYou:
      "your humerus, radius and ulna are the same bones, in the same order, as a lobe-finned fish's fin",
    source:
      "PMC3682800, multi-locus bony-fish study — https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3682800/ (~427 Ma); Shubin, Daeschler & Jenkins 2006, Nature 440:764-771 — https://www.nature.com/articles/nature04637 (Tiktaalik fin-bone homology)",
    note: "This split and Osteichthyes' (node 13) happened close together in real time — the overlap in dates is the fossil record, not an error.",
  },
  {
    id: "tetrapoda",
    name: "The first tetrapod",
    age: 365,
    ageRange: [365, 390],
    branch: "lungfish, coelacanth",
    branchExamples: ["lungfish", "coelacanth"],
    gained: "digits. The money-shot sequence lands here.",
    stillWithYou: "count your fingers — that number was set here",
    source:
      "Nature 2025 amniote-trackway paper pushes this older than traditionally thought — https://www.nature.com/articles/s41586-025-08884-5; PMC3338709 phylogenomic estimate",
    note: "This stretch of the line compresses a genuinely contested, still-being-revised span, not a single clean instant.",
  },
  {
    id: "amniota",
    name: "Amniota",
    age: 330,
    ageRange: [320, 350],
    branch: "amphibians",
    branchExamples: ["frogs", "salamanders"],
    gained: "the egg that leaves water",
    source:
      "TimeTree Hedges 2009 chapter; Nature 2025 trackway paper (as above)",
  },
  {
    id: "synapsida",
    name: "Synapsida",
    age: 318,
    ageRange: [306, 332],
    branch: "all reptiles and birds",
    branchExamples: ["snakes", "crocodiles", "birds"],
    gained: "one hole behind your eye socket",
    stillWithYou: "put your fingers on your temple — that's it",
    source:
      "TimeTree, well-calibrated molecular estimate — https://timetree.org/public/data/pdf/Hedges2009Chap39.pdf",
  },
  {
    id: "mammaliaformes",
    name: "The first mammal",
    age: 225,
    ageRange: [205, 230],
    branch: "",
    branchExamples: [],
    gained:
      "milk, and a jaw hinge that has begun its migration into the middle ear — but not yet fur: the oldest preserved fur is about 60 million years younger than this",
    stillWithYou: "you hear with bones that used to be your ancestor's jaw hinge",
    source:
      "Jaw-to-ear transition: eLife 2020, \"Transient role of the middle ear as a lower jaw support across mammals\" — https://elifesciences.org/articles/57860, and Nature 2024, \"Fossils document evolutionary changes of jaw joint to mammalian middle ear\" — https://www.nature.com/articles/s41586-024-07235-0. Earliest preserved mammaliaform fur: Castorocauda (~164 Ma, Ji et al. 2006) and Megaconus (~165 Ma, Zhou et al. 2013, Nature) — https://news.uchicago.edu/story/fossil-indicates-hairy-squirrel-sized-creature-was-not-quite-mammal",
    note: "Corrected in the science-accuracy audit (docs/IMAGE-PROMPTS.md §05, items 1–3). The draft claimed fur here; the earliest preserved mammaliaform fur is ~60 Myr younger, so fur at 225 Ma is inference from much later relatives, not a fact about this animal. It also stated the jaw-to-ear transfer as finished, when at the Morganucodon grade the postdentary bones still sit in a trough on the dentary and the ancestral jaw joint is still present alongside the new one. The old source cited Adelobasileus, which is a partial skull with no postcrania and sits outside Mammaliaformes — it cannot anchor either trait.",
  },
  {
    id: "eutheria",
    name: "Eutheria — the line that leads to the placenta",
    age: 160,
    ageRange: [157, 210],
    branch:
      "marsupials — kangaroos, koalas; the platypus and echidna's line had already left, ~166–200 million years ago",
    branchExamples: ["kangaroos", "koalas"],
    gained:
      "the branch that leads to the placenta, not the placenta itself — Juramaia's close relative Eomaia still carries epipubic bones, which mean a narrow birth canal and tiny, barely-developed young",
    source:
      "Luo et al. 2011, Nature, \"A Jurassic eutherian mammal and divergence of marsupials and placentals\" — https://www.nature.com/articles/nature10291 (the fossil that dates this split, and a eutherian rather than a crown placental); crown Placentalia is much younger — dos Reis et al. 2012 — https://royalsocietypublishing.org/doi/full/10.1098/rspb.2012.0683 and Álvarez-Carretero et al. 2022, Nature — https://www.nature.com/articles/s41586-021-04341-1 (83.3–77.6 Ma); monotreme/therian split ~166–200 Ma, reviewed in Alcheringa 2022 — https://www.tandfonline.com/doi/full/10.1080/03115518.2022.2025900",
    note: "Renamed from \"Placentalia\" in the science-accuracy audit (docs/IMAGE-PROMPTS.md §05, items 4–6). At 160 Ma, anchored on Juramaia, this is the Eutheria/Metatheria split — the title of the paper it cites says exactly that — not crown Placentalia, whose estimates run 83–78 Ma (Álvarez-Carretero et al. 2022), ~102 Ma (Foley et al. 2023) or 67.3 Ma in the fossil record. The old branch list merged two splits tens of millions of years apart: monotremes leave at the monotreme/therian split, not here. The old \"gained: the placenta; live birth\" was wrong twice over — marsupials have both, so neither separates this branch from the cousins leaving at it, and Eomaia's retained epipubic bones point the other way entirely.",
  },
  {
    id: "boreoeutheria",
    name: "Boreoeutheria",
    age: 93,
    ageRange: [89, 96],
    branch: "everything you picture when you hear \"animal\" — dogs, horses, whales, bats",
    branchExamples: ["dogs", "horses", "whales", "bats"],
    gained: "",
    source:
      "ScienceDirect Boreoeutheria overview; PMC298725, placental mammal diversification",
    note: "Renamed from the draft's \"Euarchontoglires\" — that name was for the wrong branch. This is the Boreoeutheria split (Euarchontoglires vs. Laurasiatheria); Laurasiatheria (dogs, whales, bats, horses) is a sister group, not a lineage branching off from within Euarchontoglires. See docs/DESIGN.md §7.",
  },
  {
    id: "primates",
    name: "The first primate",
    age: 80,
    ageRange: [75, 90],
    branch: "rodents, rabbits",
    branchExamples: ["rodents", "rabbits"],
    gained: "grasping hands; nails, not claws",
    source:
      "Alvarez-Carretero et al. 2022, Science — https://www.science.org/doi/10.1126/science.abl8189 (80.7 Ma, 95% CI 75.0–88.3 Ma)",
  },
  {
    id: "haplorhini",
    name: "Haplorhini",
    age: 70,
    ageRange: [63, 78],
    branch: "lemurs, lorises",
    branchExamples: ["lemurs", "lorises"],
    gained: "",
    stillWithYou:
      "you can't make your own vitamin C. The GULO gene broke around the time of this split, and you still carry the broken copy — lemurs and lorises, who leave here, still make their own",
    source:
      "Frontiers in Bioinformatics 2024 — https://www.frontiersin.org/journals/bioinformatics/articles/10.3389/fbinf.2024.1495417/full (71.3 Ma); GULO pseudogenization: Wikipedia \"L-gulonolactone oxidase\", citing Pollock & Mullin 1987, Am. J. Phys. Anthropol. 73(1):65-70",
    note: "The single best \"receipt\" in the dataset. The GULO loss date is commonly cited as coincident with this split (~60–65 Ma) rather than pinned to one dedicated dating study.",
  },
  {
    id: "simiiformes",
    name: "Simiiformes",
    age: 40,
    ageRange: [35, 55],
    branch: "tarsiers",
    branchExamples: ["tarsiers"],
    gained: "",
    source:
      "Melin et al. 2013 — https://www.sciencedaily.com/releases/2013/03/130327132537.htm",
    note: "The original draft claimed \"gained three-colour vision\" here — that doesn't hold up. Tarsiers, who leave at this split, likely already carried much of the same colour-vision gene toolkit, so full trichromacy is older than (or arose after, at Catarrhini, which was cut per docs/DESIGN.md §7) this exact node. Reframed as a cousins-aren't-primitive moment rather than a trait-gain moment, which fits the page's point of view better anyway.",
  },
  {
    id: "hominoidea",
    name: "Hominoidea — the apes",
    age: 27,
    ageRange: [25, 30],
    branch: "gibbons, orangutans",
    branchExamples: ["gibbons", "orangutans"],
    gained: "no tail",
    stillWithYou: "a single broken piece of DNA — an Alu-element insertion in the TBXT gene — is why you don't have one",
    source: "Xia et al. 2024, Nature — https://www.nature.com/articles/s41586-024-07095-8",
  },
  {
    id: "hominini",
    name: "Hominini",
    age: 7.5,
    ageRange: [7, 11],
    branch: "chimpanzees, bonobos",
    branchExamples: ["chimpanzees", "bonobos"],
    gained: "",
    source:
      "\"Parting ways: Pan-Homo divergence revisited\", Primates (2026) — https://link.springer.com/article/10.1007/s10329-026-01269-w",
    note: "Contested — traditional estimates cluster 6–8 Ma; a fossil-reconciled reanalysis of the full TimeTree database pushes some estimates to ~10–11 Ma.",
  },
  {
    id: "homo",
    name: "Homo",
    age: 2.8,
    ageRange: [2.6, 3.3],
    branch: "",
    branchExamples: [],
    gained:
      "upright, full-time; stone tools; later, with H. erectus, control of fire and long-distance walking",
    source:
      "Genus-origin dating and Lomekwi/Oldowan stone-tool dating, standard paleoanthropological consensus",
    note: "The Australopithecus-to-Homo transition is genuinely unresolved, not just contested in degree — see Royal Society 2015, \"From Australopithecus to Homo: the transition that wasn't\" (https://royalsocietypublishing.org/doi/10.1098/rstb.2015.0248). That's why Australopithecus is folded into this node's lead-up rather than given its own line, per docs/DESIGN.md §7.",
  },
  {
    id: "homo-sapiens",
    name: "Homo sapiens",
    age: 0.3,
    ageRange: [0.3, 0.35],
    branch: "Neanderthals, Denisovans — already long separate by this point",
    branchExamples: ["Neanderthals", "Denisovans"],
    gained: "",
    stillWithYou:
      "most non-African humans carry Neanderthal DNA today — not from a split, but from a re-meeting around 47,000 years ago",
    source:
      "Jebel Irhoud fossil dating for H. sapiens origin; Neanderthal/Denisovan lineage split much earlier (~550–765 ka per multiple genomic studies); interbreeding timing per 2024 studies converging on ~47,000 years ago — https://www.nbcnews.com/science/science-news/neanderthals-ancient-humans-interbreeding-timeline-rcna183955",
    note: "Corrected from the original draft: Neanderthals and Denisovans don't branch off \"here\" — they'd already been separate for roughly a quarter of a million years by the time anatomically modern humans looked like this. The honest and more interesting fact is the later interbreeding event, used here instead.",
  },
  {
    id: "you",
    name: "You",
    age: 0,
    ageRange: [0, 0],
    branch: "",
    branchExamples: [],
    gained: "reading this",
    source: "",
  },
];
