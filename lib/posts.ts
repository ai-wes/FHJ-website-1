import type { Post, SearchParams } from "./types"

// Sample posts data
const posts: Post[] = [
  {
    id: "neural-interfaces",
    title: "Neural Interfaces: The Next Frontier of Human-Computer Symbiosis",
    excerpt:
      "How direct brain-computer interfaces are evolving from medical devices to consumer products that could fundamentally change how we interact with technology.",
    content: `
      <p>Neural interfaces represent one of the most exciting frontiers in human-computer interaction. These devices, which create direct communication channels between the brain and external technology, are rapidly evolving from specialized medical tools to potential consumer products.</p>
      
      <h2>The Current State of Neural Interface Technology</h2>
      
      <p>Today's neural interfaces primarily serve medical purposes, helping patients with conditions like paralysis regain functionality. Companies like Neuralink, Synchron, and Paradromics are developing increasingly sophisticated implantable devices that can record from and stimulate thousands of neurons simultaneously.</p>
      
      <p>Recent breakthroughs include:</p>
      
      <ul>
        <li>Minimally invasive surgical techniques that reduce risk and recovery time</li>
        <li>Improved electrode materials that maintain stability in the brain for longer periods</li>
        <li>Advanced signal processing algorithms that extract clearer information from neural activity</li>
        <li>Wireless data transmission that eliminates the need for transcranial wires</li>
      </ul>
      
      <h2>The Path to Consumer Applications</h2>
      
      <p>While medical applications remain the primary focus, several companies are exploring consumer uses for neural interfaces. These range from enhanced gaming experiences to productivity tools that could allow users to control devices with thought alone.</p>
      
      <p>The transition to consumer applications faces significant challenges:</p>
      
      <ul>
        <li>Developing non-invasive or minimally invasive technologies that consumers would accept</li>
        <li>Creating compelling use cases that justify adoption</li>
        <li>Addressing privacy and security concerns around brain data</li>
        <li>Navigating regulatory frameworks not designed for consumer neurotechnology</li>
      </ul>
      
      <h2>Ethical and Societal Implications</h2>
      
      <p>As neural interfaces become more sophisticated and potentially more widespread, they raise profound questions about human identity, cognitive liberty, and social equality.</p>
      
      <p>Key ethical considerations include:</p>
      
      <ul>
        <li>Mental privacy and the right to cognitive liberty</li>
        <li>Potential for surveillance and manipulation</li>
        <li>Access inequality and cognitive enhancement divides</li>
        <li>Changes to our understanding of human agency and responsibility</li>
      </ul>
      
      <h2>The Future of Human-Computer Symbiosis</h2>
      
      <p>Looking forward, neural interfaces may fundamentally transform how humans interact with technology and each other. The concept of "neural lace" described in science fiction could become reality, creating seamless integration between human cognition and artificial systems.</p>
      
      <p>This evolution may lead to new forms of communication, creativity, and problem-solving that are difficult to imagine from our current perspective. As we develop these technologies, thoughtful consideration of their implications will be essential to ensuring they enhance rather than diminish human flourishing.</p>
    `,
    coverImage: "/placeholder.svg?key=sv4hu",
    category: "Technology",
    date: "May 2, 2023",
    readingTime: "8 min read",
    tags: ["Neural Interfaces", "Brain-Computer Interface", "Neurotechnology", "Human Enhancement"],
    author: {
      name: "Dr. Maya Chen",
      avatar: "/diverse-person-portrait.png",
    },
  },
  {
    id: "longevity-revolution",
    title: "The Longevity Revolution: Living Beyond 100",
    excerpt:
      "Recent breakthroughs in aging research suggest that the first person to live to 150 may already be alive. What does this mean for society, economics, and personal identity?",
    content: `
      <p>The science of longevity has advanced dramatically in recent years, with researchers making unprecedented progress in understanding and potentially slowing the aging process. These developments suggest we may be on the cusp of a longevity revolution that could extend human lifespans well beyond current limits.</p>
      
      <h2>The Science of Aging</h2>
      
      <p>Aging research has identified several key hallmarks that drive the aging process, including genomic instability, telomere attrition, epigenetic alterations, and cellular senescence. Interventions targeting these mechanisms have shown promising results in model organisms.</p>
      
      <p>Breakthrough approaches include:</p>
      
      <ul>
        <li>Senolytic drugs that selectively eliminate senescent cells</li>
        <li>NAD+ boosters that improve mitochondrial function</li>
        <li>Partial cellular reprogramming to rejuvenate tissues without cancer risk</li>
        <li>Gene therapy approaches to address specific age-related diseases</li>
      </ul>
      
      <h2>Economic and Social Implications</h2>
      
      <p>Extended lifespans would transform virtually every aspect of human society, from career trajectories to family structures, healthcare systems, and economic models.</p>
      
      <p>Key considerations include:</p>
      
      <ul>
        <li>Retirement and pension systems designed for much shorter lifespans</li>
        <li>Career paths that might span multiple distinct professions</li>
        <li>Family structures encompassing many more generations</li>
        <li>Housing, urban planning, and infrastructure for longer-lived populations</li>
      </ul>
      
      <h2>Philosophical and Identity Questions</h2>
      
      <p>Living significantly longer raises profound questions about human identity, purpose, and the meaning of life. How would our sense of self change if we lived for 150 years? Would we become different people over such extended timeframes?</p>
      
      <p>Philosophical challenges include:</p>
      
      <ul>
        <li>Maintaining purpose and meaning across a much longer lifespan</li>
        <li>Personal identity persistence over extended periods</li>
        <li>Relationships and commitments in the context of greatly extended lives</li>
        <li>The potential for psychological adaptation or stagnation</li>
      </ul>
      
      <h2>The Path Forward</h2>
      
      <p>As longevity science continues to advance, society must grapple with both the opportunities and challenges of potentially much longer lives. This will require interdisciplinary collaboration between scientists, policymakers, ethicists, and the public.</p>
      
      <p>The longevity revolution may be one of the most significant transformations in human history, comparable to the agricultural or industrial revolutions in its impact. How we navigate this transition will shape the human experience for generations to come.</p>
    `,
    coverImage: "/placeholder.svg?key=qws7u",
    category: "Biotechnology",
    date: "April 18, 2023",
    readingTime: "10 min read",
    tags: ["Longevity", "Aging", "Biotechnology", "Future of Medicine"],
    author: {
      name: "Dr. James Harrington",
      avatar: "/diverse-person-portrait.png",
    },
  },
  {
    id: "consciousness-upload",
    title: "Digital Consciousness: The Ethics of Mind Uploading",
    excerpt:
      "As we approach the theoretical possibility of transferring human consciousness to digital substrates, profound philosophical and ethical questions emerge.",
    content: `
      <p>Mind uploading—the hypothetical process of transferring a human consciousness to a digital substrate—has long been a staple of science fiction. However, advances in neuroscience, computing, and artificial intelligence are bringing this concept closer to the realm of scientific possibility, raising profound ethical and philosophical questions.</p>
      
      <h2>The Technical Horizon</h2>
      
      <p>While complete mind uploading remains theoretical, several technological developments are laying groundwork in this direction:</p>
      
      <ul>
        <li>Increasingly detailed brain mapping and connectome projects</li>
        <li>Advanced neural network models that simulate aspects of brain function</li>
        <li>Brain-computer interfaces with growing resolution and capability</li>
        <li>Quantum computing approaches that may eventually handle brain-scale complexity</li>
      </ul>
      
      <p>These technologies are converging toward the possibility of creating digital systems that could potentially replicate human neural patterns with sufficient fidelity to preserve consciousness.</p>
      
      <h2>The Philosophical Conundrum</h2>
      
      <p>Mind uploading raises fundamental questions about the nature of consciousness, personal identity, and what it means to be human:</p>
      
      <ul>
        <li>Would a digital copy of your mind actually be "you," or merely a sophisticated simulation?</li>
        <li>Is consciousness substrate-independent, or inherently tied to biological processes?</li>
        <li>How would we determine if a digital mind is genuinely conscious?</li>
        <li>What happens to identity if multiple copies of a mind exist simultaneously?</li>
      </ul>
      
      <p>These questions challenge our deepest intuitions about selfhood and continuity of identity.</p>
      
      <h2>Ethical Dimensions</h2>
      
      <p>The possibility of digital consciousness creates unprecedented ethical challenges:</p>
      
      <ul>
        <li>Rights and legal status of digital minds</li>
        <li>Potential for exploitation, manipulation, or deletion of digital consciousnesses</li>
        <li>Access inequality and social stratification</li>
        <li>End-of-life decisions and digital immortality</li>
        <li>Psychological impacts on both uploaded minds and biological humans</li>
      </ul>
      
      <p>Our ethical frameworks, developed for biological humans with finite lifespans, may require fundamental reconsideration.</p>
      
      <h2>Societal Implications</h2>
      
      <p>If mind uploading becomes possible, it could transform human civilization:</p>
      
      <ul>
        <li>Economic systems based on scarcity would face challenges from potentially immortal digital minds</li>
        <li>Social structures would need to accommodate radically different forms of existence</li>
        <li>The meaning of death and legacy would fundamentally change</li>
        <li>Human evolution might branch into multiple paths—biological, digital, and hybrid</li>
      </ul>
      
      <h2>The Path Forward</h2>
      
      <p>As we continue to develop technologies that could eventually enable mind uploading, we must simultaneously develop the philosophical, ethical, and legal frameworks to address its implications. This requires interdisciplinary dialogue between neuroscientists, computer scientists, philosophers, ethicists, legal scholars, and the broader public.</p>
      
      <p>The possibility of digital consciousness represents perhaps the most profound transformation humanity has ever contemplated—one that could redefine the very nature of human existence.</p>
    `,
    coverImage: "/placeholder.svg?key=kx2u8",
    category: "Philosophy",
    date: "March 30, 2023",
    readingTime: "12 min read",
    tags: ["Consciousness", "Mind Uploading", "Digital Philosophy", "Transhumanism"],
    author: {
      name: "Dr. Sophia Williams",
      avatar: "/diverse-person-portrait.png",
    },
  },
  {
    id: "synthetic-biology",
    title: "Synthetic Biology: Redesigning Life from the Ground Up",
    excerpt:
      "How scientists are moving beyond editing existing organisms to designing entirely new biological systems with unprecedented capabilities.",
    content: `
      <p>Synthetic biology represents a paradigm shift in our relationship with the living world. Moving beyond merely editing existing organisms, this field aims to design and construct new biological parts, devices, and systems—or to redesign existing natural biological systems for useful purposes.</p>
      
      <h2>From Editing to Engineering</h2>
      
      <p>While genetic engineering has focused on modifying existing organisms, synthetic biology adopts engineering principles to create biological systems with novel functions:</p>
      
      <ul>
        <li>Standardized biological parts (BioBricks) that can be assembled like electronic components</li>
        <li>Computer-aided design of genetic circuits with predictable behaviors</li>
        <li>Minimal genomes that serve as chassis for synthetic systems</li>
        <li>Entirely artificial DNA bases that expand the genetic alphabet</li>
      </ul>
      
      <p>This engineering-driven approach is transforming biology from an observational to a constructive science.</p>
      
      <h2>Current Applications</h2>
      
      <p>Synthetic biology is already yielding practical applications across multiple sectors:</p>
      
      <ul>
        <li>Medicine: Engineered bacteria that detect and treat diseases, synthetic probiotics, and cell therapies</li>
        <li>Materials: Biologically produced alternatives to plastics, building materials, and textiles</li>
        <li>Energy: Microorganisms engineered to produce biofuels and capture carbon</li>
        <li>Agriculture: Crops with enhanced photosynthesis, nitrogen fixation, and stress resistance</li>
        <li>Environmental remediation: Organisms designed to detect and break down pollutants</li>
      </ul>
      
      <h2>The Frontier: Xenobiology and Alternative Biochemistries</h2>
      
      <p>The most radical branch of synthetic biology explores life based on alternative biochemistries:</p>
      
      <ul>
        <li>Expanded genetic alphabets with synthetic nucleotides beyond A, T, G, and C</li>
        <li>Alternative amino acids that create proteins with novel properties</li>
        <li>Organisms with recoded genomes that operate under different genetic rules</li>
        <li>Potential for life forms based on biochemistry fundamentally different from Earth's</li>
      </ul>
      
      <p>These approaches could create biological systems with capabilities impossible in natural organisms.</p>
      
      <h2>Ethical and Safety Considerations</h2>
      
      <p>The power to design life raises significant ethical and safety questions:</p>
      
      <ul>
        <li>Biosafety: Preventing unintended consequences of engineered organisms</li>
        <li>Biosecurity: Protecting against malicious applications</li>
        <li>Environmental impact: Assessing ecological effects of synthetic organisms</li>
        <li>Ownership and access: Addressing patents, open source, and global equity</li>
        <li>Philosophical questions about humanity's relationship with nature</li>
      </ul>
      
      <h2>The Future of Designed Life</h2>
      
      <p>As synthetic biology advances, we may witness a new epoch in Earth's history—one where human design becomes a driving force in biological evolution. This represents both an extraordinary opportunity and a profound responsibility.</p>
      
      <p>The field invites us to reimagine what life can be and what it can do, while challenging us to develop the wisdom to guide these powerful capabilities toward beneficial ends.</p>
    `,
    coverImage: "/placeholder.svg?key=7pup0",
    category: "Biotechnology",
    date: "March 15, 2023",
    readingTime: "9 min read",
    tags: ["Synthetic Biology", "Bioengineering", "Genetic Engineering", "Biotechnology"],
    author: {
      name: "Dr. Alex Rodriguez",
      avatar: "/diverse-person-portrait.png",
    },
  },
  {
    id: "future-of-work",
    title: "The Future of Work: Human-AI Collaboration",
    excerpt:
      "As AI transforms the workplace, we explore how humans and machines will collaborate to create new forms of productivity and creativity.",
    content: `
      <p>The relationship between humans and artificial intelligence in the workplace is evolving rapidly. Rather than simply replacing human workers, the most promising frontier lies in developing effective human-AI collaboration that leverages the unique strengths of both.</p>
      
      <h2>Complementary Intelligence</h2>
      
      <p>Humans and AI systems possess fundamentally different types of intelligence:</p>
      
      <ul>
        <li>Humans excel at contextual understanding, ethical reasoning, creative leaps, and social intelligence</li>
        <li>AI systems excel at pattern recognition, data processing, consistency, and operating without fatigue</li>
      </ul>
      
      <p>The most effective workplace systems will combine these complementary capabilities rather than treating them as competitors.</p>
      
      <h2>Emerging Models of Collaboration</h2>
      
      <p>Several models of human-AI collaboration are emerging across industries:</p>
      
      <ul>
        <li><strong>AI as Amplifier:</strong> Systems that enhance human capabilities, such as diagnostic tools that help doctors identify patterns in medical images</li>
        <li><strong>AI as Advisor:</strong> Systems that provide recommendations while leaving decisions to humans, as in legal research assistants</li>
        <li><strong>AI as Automator:</strong> Systems that handle routine tasks, freeing humans for more complex work</li>
        <li><strong>AI as Creative Partner:</strong> Systems that collaborate with humans in creative fields, suggesting alternatives or variations</li>
      </ul>
      
      <h2>Skill Evolution</h2>
      
      <p>As AI capabilities advance, the skills most valuable for human workers are evolving:</p>
      
      <ul>
        <li>Meta-skills for working with AI: prompt engineering, output evaluation, and system oversight</li>
        <li>Uniquely human capabilities: ethical reasoning, creative problem-solving, and interpersonal skills</li>
        <li>Interdisciplinary thinking that connects technical understanding with domain expertise</li>
        <li>Adaptability and continuous learning as AI capabilities evolve</li>
      </ul>
      
      <h2>Organizational Transformation</h2>
      
      <p>Effective human-AI collaboration requires rethinking organizational structures:</p>
      
      <ul>
        <li>Flatter hierarchies enabled by AI-augmented decision-making</li>
        <li>New roles focused on the human-AI interface</li>
        <li>Distributed work patterns that leverage AI coordination</li>
        <li>Continuous education systems integrated into workflow</li>
      </ul>
      
      <h2>Challenges and Considerations</h2>
      
      <p>The transition to collaborative human-AI workplaces faces several challenges:</p>
      
      <ul>
        <li>Building appropriate trust and avoiding both over-reliance and under-utilization</li>
        <li>Ensuring transparency in AI systems to enable effective collaboration</li>
        <li>Addressing bias and fairness in collaborative systems</li>
        <li>Managing the transition for workers whose roles change significantly</li>
        <li>Developing new management approaches for hybrid human-AI teams</li>
      </ul>
      
      <h2>The Path Forward</h2>
      
      <p>The future of work will likely be defined not by humans competing against machines, but by new forms of collaboration that create capabilities exceeding what either could achieve alone. This will require thoughtful design of both technical systems and organizational structures.</p>
      
      <p>By focusing on complementary intelligence rather than replacement, we can work toward a future where technology enhances human potential rather than diminishing it.</p>
    `,
    coverImage: "/placeholder.svg?key=7wf8h",
    category: "Society",
    date: "February 28, 2023",
    readingTime: "8 min read",
    tags: ["AI", "Future of Work", "Human-AI Collaboration", "Workplace Evolution"],
    author: {
      name: "Dr. Thomas Lee",
      avatar: "/diverse-person-portrait.png",
    },
  },
  {
    id: "climate-engineering",
    title: "Climate Engineering: Humanity's Last Resort?",
    excerpt:
      "As climate change accelerates, we examine the ethical and practical implications of large-scale technological interventions in Earth's systems.",
    content: `
      <p>As the climate crisis intensifies and emissions reductions prove insufficient, climate engineering—deliberate large-scale intervention in Earth's climate systems—is receiving increased attention as a potential response. These approaches raise profound questions about risk, governance, and humanity's relationship with the planet.</p>
      
      <h2>Major Approaches</h2>
      
      <p>Climate engineering broadly falls into two categories:</p>
      
      <ul>
        <li><strong>Solar Radiation Management (SRM):</strong> Techniques to reflect sunlight back to space, reducing warming
          <ul>
            <li>Stratospheric aerosol injection</li>
            <li>Marine cloud brightening</li>
            <li>Surface albedo modification</li>
            <li>Space-based reflectors</li>
          </ul>
        </li>
        <li><strong>Carbon Dioxide Removal (CDR):</strong> Methods to remove CO₂ from the atmosphere
          <ul>
            <li>Direct air capture with carbon storage</li>
            <li>Bioenergy with carbon capture and storage</li>
            <li>Enhanced weathering</li>
            <li>Ocean fertilization</li>
            <li>Afforestation and reforestation</li>
          </ul>
        </li>
      </ul>
      
      <h2>The Promise and Peril</h2>
      
      <p>Climate engineering offers potential benefits but comes with significant risks:</p>
      
      <h3>Potential Benefits:</h3>
      <ul>
        <li>Rapid temperature reduction (for SRM approaches)</li>
        <li>Addressing climate tipping points</li>
        <li>Buying time for emissions reductions and adaptation</li>
        <li>Potentially lower costs than some mitigation approaches</li>
      </ul>
      
      <h3>Significant Risks:</h3>
      <ul>
        <li>Unintended consequences for weather patterns and ecosystems</li>
        <li>Termination shock if SRM is suddenly stopped</li>
        <li>Moral hazard undermining emissions reduction efforts</li>
        <li>Geopolitical tensions over unilateral deployment</li>
        <li>Irreversible changes to Earth systems</li>
      </ul>
      
      <h2>Governance Challenges</h2>
      
      <p>Climate engineering presents unprecedented governance challenges:</p>
      
      <ul>
        <li>No comprehensive international framework exists for regulating these technologies</li>
        <li>Deployment could be relatively inexpensive, enabling unilateral action by nations or even wealthy individuals</li>
        <li>Effects would cross national boundaries, creating complex liability issues</li>
        <li>Scientific uncertainty complicates risk assessment and decision-making</li>
        <li>Intergenerational ethical questions about committing future generations to continued intervention</li>
      </ul>
      
      <h2>The Research Dilemma</h2>
      
      <p>Even research into climate engineering raises ethical questions:</p>
      
      <ul>
        <li>Does research normalize these approaches as inevitable?</li>
        <li>How can research be conducted transparently with appropriate oversight?</li>
        <li>What scale of field experiments is appropriate given uncertainties?</li>
        <li>How should research priorities be determined, and by whom?</li>
      </ul>
      
      <h2>A Thoughtful Path Forward</h2>
      
      <p>Given both the potential necessity and risks of climate engineering, a thoughtful approach might include:</p>
      
      <ul>
        <li>Transparent, international research programs with robust governance</li>
        <li>Development of international frameworks for decision-making before deployment becomes imminent</li>
        <li>Prioritizing approaches with fewer risks and more co-benefits</li>
        <li>Ensuring climate engineering complements rather than replaces emissions reductions</li>
        <li>Inclusive deliberation that considers diverse perspectives and values</li>
      </ul>
      
      <p>Climate engineering represents a profound test of humanity's wisdom and institutions. The decisions we make about these technologies may shape Earth's systems for centuries to come, affecting countless future generations.</p>
    `,
    coverImage: "/futuristic-climate-engineering.png",
    category: "Environment",
    date: "February 10, 2023",
    readingTime: "11 min read",
    tags: ["Climate Engineering", "Geoengineering", "Climate Change", "Environmental Ethics"],
    author: {
      name: "Dr. Elena Patel",
      avatar: "/diverse-person-portrait.png",
    },
  },
]

// Get all unique tags from posts
export function getAllTags(): string[] {
  const tagsSet = new Set<string>()

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagsSet.add(tag)
    })
  })

  return Array.from(tagsSet)
}

// Get all unique categories from posts
export function getAllCategories(): string[] {
  const categoriesSet = new Set<string>()

  posts.forEach((post) => {
    categoriesSet.add(post.category)
  })

  return Array.from(categoriesSet)
}

// Search posts based on query, category, and tag
export function searchPosts({ q, category, tag }: SearchParams): Post[] {
  return posts.filter((post) => {
    // Filter by search query
    if (
      q &&
      !post.title.toLowerCase().includes(q.toLowerCase()) &&
      !post.excerpt.toLowerCase().includes(q.toLowerCase()) &&
      !post.content.toLowerCase().includes(q.toLowerCase())
    ) {
      return false
    }

    // Filter by category
    if (category && post.category !== category) {
      return false
    }

    // Filter by tag
    if (tag && !post.tags.includes(tag)) {
      return false
    }

    return true
  })
}

// Get a post by ID
export function getPostById(id: string): Post | undefined {
  return posts.find((post) => post.id === id)
}

// Get related posts based on tags
export function getRelatedPosts(currentPostId: string, limit = 3): Post[] {
  const currentPost = getPostById(currentPostId)

  if (!currentPost) {
    return []
  }

  // Calculate relevance score based on shared tags and category
  const scoredPosts = posts
    .filter((post) => post.id !== currentPostId)
    .map((post) => {
      let score = 0

      // Score based on shared tags
      currentPost.tags.forEach((tag) => {
        if (post.tags.includes(tag)) {
          score += 1
        }
      })

      // Bonus score for same category
      if (post.category === currentPost.category) {
        score += 2
      }

      return { post, score }
    })
    .sort((a, b) => b.score - a.score)

  // Return the top N most relevant posts
  return scoredPosts.slice(0, limit).map((item) => item.post)
}
