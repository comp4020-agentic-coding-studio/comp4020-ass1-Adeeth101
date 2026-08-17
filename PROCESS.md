# Process overview

A reading-guide to how the work came together --- a map to your process, not an
essay about it. Markers read this file and follow its citations; they don't
trawl the repo for evidence you didn't point at, so if a moment mattered, cite
it.

This file is the shape; the course site's
[assessment page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#what-you-submit)
is the requirement, and its
[word counts](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#word-counts)
cover every deliverable.

## What I built

“One Unbroken Line” is an interactive, scroll -based explainer of the human journey through ancestry from the hypothetical last universal common ancestor (LUCA) to the user. The design focuses on a single concept, a human lineage, and shows branches of the human lineage leaving, while concentrating on disciple of the scope and not showing or following the branches.

## The moments that mattered

### A sensor for dead custom properties

What happened: The scroll pacing logic set a --weight custom property in main.ts for every row, and none of the rules in styles.css read it. The build had no issues and the feature continued to operate invisibly.

What I did instead: Rather than just wiring up the CSS, I created a custom test harness sensor in main.ts that checks if each setProperty() is read in styles.css.

How I knew it was right: I re-introduced a dead property in the TypeScript file, and watched the test fail with the property name in the error message. A green sensor that has never been seen red is not evidence.

Citation: [`132617d`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Adeeth101/commit/132617d)

### A date is not a node

What happened: The dataset contained a correct molecular clock date (80.7 Ma) that was attached to the wrong node (crown Primates, rather than the origin of Euarchontoglires).

What I did instead: Rather than just correcting the node's data, I added a strict harness rule to CLAUDE.md: "A date is not a node". The rule requires verifying paper scope, node identity, and branch cousins separately before accepting any date.

How I knew it was right: I added an arithmetic check requiring that a divergence cannot be younger than the fossils on both sides of it. This check successfully caught a separate, impossible 40 Ma date for Simiiformes.

Citation: [`4723051`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Adeeth101/commit/4723051)

### Contrast being a constraint

What happened: When #6B6862 was used for the --text-3 token, the contracts failed WCAG AA across the era grounds (measuring 3.14–3.27:1 vs 4.5:1). To address it, I had to increase color contrast for --text-3 and balance it against the different levels of importance within the text.

What I did instead: Rather than trying to pick hex values on my own, I used a script to read styles.css and conducted a 421-point test to check --text-3 for every interpolated era background and active plate surface. I automated the test to stop the build in case the contrast went below 4.5:1.

How I knew it was right: The hex values I used initially passed against the darker backgrounds, but with the 421-point sweep I uncovered a failure case that I missed before. With the automated test I was forced to use #595651 to make the active plate surface (--surface) the contracting element rather than the earth/background.

Citation: [`18c268b`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Adeeth101/commit/18c268b)

## Empirical rejection of log10 scaling in favor of power law

What happened: Cramming events on a logarithmic timeline yielded a 5:1 screen-space ratio for significant epochs. Clustering of recent events resulted in the merging of notable evolutionary landmarks into an indistinguishable stack.

What I did instead: I developed the log10 model (f8619f8) and added it to the timeline (7c4804d). I measured the placement and found a 5:1 ratio to be unacceptable. I replaced it with a normalized power law model (aff066e) after 26 minutes. Instead of manually removing the log10 model, I decided to keep it in DESIGN.md (df9349f) to give a reason for the power law exponent.

How I knew it was right: A power law distribution yielded a 43.7:1 ratio that both scaled recent events of the evolution of mammals and preserved deep geological time. The working log10 model provided an empirical basis to substantiate the final mathematical model.

Citation: f8619f8, 7c4804d, aff066e, df9349f

## Before you ship

`pnpm check:evidence` verifies your citations resolve to real commits, that the
current reflection entry is in `reflections/`, and that your `CLAUDE.md` is
there --- before a marker ever opens the file. It checks that your map is
traceable, not that it is good: the marker judges whether your small,
deliberately chosen set of moments shows real judgement and reflection. A green
check is not a substitute for that curation.

Images are deliberately not checked, because whether one renders is visible the
moment you look. Open this file on GitHub and look at it before you ship.
