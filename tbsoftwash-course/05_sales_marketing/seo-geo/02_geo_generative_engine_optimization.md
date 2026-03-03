# GEO (Generative Engine Optimization) — Notes + Sources

## Definition
**Generative Engine Optimization (GEO)** is the practice of shaping web content and technical signals to maximize:

- **visibility** in AI-powered answer engines,
- **citation/attribution** when answers are generated,
- **trustworthiness** (low hallucination risk, high verification).

GEO overlaps with SEO, but the optimization target shifts from:

- ranking a page for a query → to
- being a **preferred source** when an AI composes an answer.

## Why GEO matters
AI answer engines increasingly:

- summarize instead of sending clicks,
- cite a small set of sources (winner-take-most),
- use retrieval pipelines that reward **clean structure**, **extractable facts**, and **verifiable claims**.

For a local service business, GEO matters because high-intent queries are often asked conversationally:

- “How do I clean roof algae safely?”
- “What’s the difference between soft wash and pressure wash?”
- “Who’s the best roof cleaner near me?”

If your site provides clear, quotable, verifiable blocks, you’re more likely to be selected as a reference.

## How citation-capable AI engines typically work (practical model)
Implementations vary, but most citation-capable systems resemble:

1. **Candidate retrieval** (search index, embeddings, knowledge graph, curated sources)
2. **Passage selection** (which chunks best answer the query)
3. **Synthesis** (LLM writes the response)
4. **Attribution/citations** (links attached when available/allowed)

GEO aims to win steps (1) and (2), and be safe for step (4).

## Core GEO principles
### 1) Semantic clarity (write for extraction)
- Put direct answers near the top (TL;DR blocks)
- Use consistent definitions (“soft washing” vs “pressure washing”)
- Use **tables**, **bullets**, **FAQs**, explicit units/assumptions
- Reduce ambiguous references (name entities clearly)

### 2) Evidence & verification hooks
- Cite standards / manufacturer guidance where relevant
- Include step-by-step process + safety constraints
- Add “what we do / what we don’t do” boundaries

### 3) Entity trust (especially for local businesses)
- Clear identity: business name, service area, contact info
- Licensing/insurance statements (truthful)
- Reputation signals: reviews, third-party mentions
- Author/reviewer bios for technical content

### 4) Structured data (machine-readable)
- `LocalBusiness`
- `Service`
- `FAQPage`
- Optionally `Review` (only if compliant) and `ImageObject` for proof media

Structured data won’t guarantee citations, but it improves machine comprehension.

### 5) “Quotable blocks” that engines like
LLMs tend to cite:

- definitions
- checklists
- step-by-step procedures
- safety warnings
- pricing drivers (factors, not exact quotes)

So design pages that contain those blocks.

## GEO tactics for Tampa Bay Soft Wash
High leverage page types:

- **Service hub pages** (roof, house wash, pavers, gutters):
  - what it is, who it’s for, expected outcomes, time, risks, pricing drivers
  - proof gallery + mini case studies

- **FAQ pages** targeting assistant-style questions

- **Comparison pages**:
  - soft wash vs pressure wash
  - DIY vs professional roof cleaning
  - sodium hypochlorite safety disclaimers (accurate, not fear-mongering)

- **Credential / trust pages**:
  - insurance, process transparency, safety procedures

## Measurement (imperfect but workable)
- Track brand search lift (Search Console)
- Track referrals from AI surfaces where visible (often limited)
- Controlled prompt testing (“cite sources”) for your core topics

---

# Sources

## Google / first-party
1. Google Search Central — Creating helpful, reliable, people-first content
   - https://developers.google.com/search/docs/fundamentals/creating-helpful-content

2. Google Search Quality Rater Guidelines (PDF) — E‑E‑A‑T concepts
   - https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf

3. Google Search Central — Structured data intro
   - https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

## Schema.org (structured data vocabulary)
4. Schema.org — LocalBusiness
   - https://schema.org/LocalBusiness

5. Schema.org — Service
   - https://schema.org/Service

6. Schema.org — FAQPage
   - https://schema.org/FAQPage

## General retrieval grounding context
7. OpenAI Platform documentation (general grounding/retrieval concepts; implementation varies by product)
   - https://platform.openai.com/docs/

## SEO metric proxy context (useful caution)
8. Moz — Domain Authority (third-party proxy metric)
   - https://moz.com/learn/seo/domain-authority
