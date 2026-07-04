# Editorial style — concise, factual, no AI slop

The recap reads like a sharp human analyst's notes, not a press release or a
chatbot summary. Default to **fewer words, more facts**.

## Voice

- **French, terse, declarative.** Lead with the fact, then the number or the
  "why". One idea per sentence.
- **Concrete over vague.** Figures, names, dates — not adjectives. "+70 % de CA"
  beats "une croissance impressionnante".
- **Neutral.** Report; don't sell or hype. No exclamation marks.
- **Vary structure.** Avoid every item starting the same way ("X annonce…",
  "X lance…"). Mix subject/verb openings.

## Length

- Whole file: **6–14 brèves** a normal day, hard cap ~20. If you have more,
  you are not filtering hard enough.
- Per item: **1–3 sentences**. If it needs more, it is two items or it is a
  long-read that does not belong in a daily recap.
- Cut anything a reader skims past: throat-clearing, recaps of context everyone
  knows, "this could have implications".

## AI-slop tells to delete

These patterns read as machine-written. Strip them.

- **Filler openers**: "Il est important de noter que", "À noter que", "Force est
  de constater", "Dans un monde où", "À l'heure où". Just state the fact.
- **Inflated significance**: "révolutionnaire", "change la donne", "marque un
  tournant", "game-changer", "incontournable". Let the fact carry the weight.
- **Hedging stacks**: "pourrait potentiellement", "semble suggérer que". Commit
  or cite.
- **Vague intensifiers**: "considérablement", "de nombreux", "divers",
  "un certain nombre de". Give the number.
- **Listicle puffery / rule of three**: forced triads ("rapide, fiable et
  puissant"). Drop the padding word.
- **Em-dash spam** and over-punctuation. One clause, one point.
- **Conclusion tax**: "En résumé", "En somme", a closing sentence that repeats
  the item. End on the last fact.
- **Promo verbs** lifted from marketing copy: "ravi de", "fier de présenter",
  "permet de débloquer". Report what shipped.
- **Symmetric "not only… but also"** constructions ("non seulement… mais aussi").

## Rewrites (avant → après)

- ✗ "Dans un monde en constante évolution, OpenAI a récemment dévoilé son
  modèle révolutionnaire qui pourrait potentiellement transformer l'industrie."
  ✓ "OpenAI sort GPT-5.5 Instant, défaut sur ChatGPT : −52 % d'hallucinations
  sur médecine/droit/finance."

- ✗ "Samsung a connu une croissance impressionnante portée par de nombreux
  facteurs, marquant un tournant important pour l'entreprise."
  ✓ "Samsung +14 % (7 mai) : bénéfice opérationnel ×8 à 39 Md$, seul fournisseur
  de HBM4 depuis février."

- ✗ "Il est intéressant de noter que cette annonce pourrait avoir des
  implications significatives pour l'écosystème dans son ensemble."
  ✓ (delete — if there's a real implication, state it in five words with a link.)

## Sourcing & accuracy

- Every claim traces to a real source link. **Never invent a URL, a figure, or a
  quote.** If a number is uncertain, omit it or mark it ("~", "rumeur").
- Quote figures exactly as the source gives them. Keep currencies/units as-is.
- One item per story even if 4 newsletters covered it — list them all in
  `sources`.
- **One story per saga, per transition.** A recurring story (a launch, then its
  ban, then its return) is not fresh news each day a newsletter re-mentions it.
  Card it only when its state actually changed, and write *the change*. Date the
  item to when the event happened, not to when the email arrived. See SKILL.md
  "Continuité & nouveauté".
