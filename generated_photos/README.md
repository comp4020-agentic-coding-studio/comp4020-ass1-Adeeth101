# Generated stills — originals

The unmodified output of the image generator, kept exactly as it arrived:
original filenames, original JPEG bytes, nothing overwritten. `images/plates/`
holds the converted WebP the site actually serves; this folder is the source
those were derived from, and the record of what was generated versus what was
chosen.

Nothing here is imported by the build. These files do not ship in `dist/`.

## What each file is

The generator's filenames are descriptive but inconsistent — some name the
species, some describe the pose — so each was matched to a node by reading it
against that node's prompt in `docs/IMAGE-PROMPTS.md`, which describes exactly
what the animal should look like. Six could not be settled from the filename
and were assigned by opening the image and checking it against the prompt's
load-bearing anatomy.

| File | Node id | How it was matched |
| --- | --- | --- |
| `Pikaia_gracilens_museum_specimen…` | `chordata` | names the anchor; flattened body, chevron myomeres, paired head tentacles, no eyes |
| `Ancient_jawless_fish_swimming` | `vertebrata` | has eyes, a defined head and a gill row — the things Chordata must not have |
| `Armoured_jawed_fish_swimming` | `gnathostomata` | plated head shield, toothed jaws, head flattened top to bottom |
| `Guiyu_oneiros_swimming_in_water` | `osteichthyes` | names the anchor; carries the spine at the leading edge of the dorsal and paired fins |
| `Early_bony_fish_swimming` | `sarcopterygii` | assigned by elimination — see the caveat below |
| `Tetrapod_specimen_illustration_s…` | `tetrapoda` | four limbs, webbed feet with more digits than expected, fin-rayed paddle tail |
| `Lizard-like_vertebrate_walking_o…` | `amniota` | small scaled lizard-shaped animal with claws; the scale cover is the *Captorhinus* integument |
| `Reptile_walking_on_land` | `synapsida` | monitor-lizard proportions and one large opening behind the eye — the node's diagnostic trait |
| `Morganucodon_animal_foraging_on_…` | `mammaliaformes` | names the anchor; flat-footed foraging pose |
| `Small_mammal_climbing_on_branch` | `eutheria` | shrew-shaped climber gripping a branch with all four feet |
| `Primate_clinging_to_vertical_stem` | `haplorhini` | the upright cling to a *vertical* stem is unique to this prompt across all 27 |
| `Early_ape_walking_on_branch` | `hominoidea` | tailless ape, arms and legs of similar length, quadrupedal along a branch |
| `Seated_prehistoric_ape_rests` | `hominini` | the seated legs-folded pose, written so the picture makes no claim about how it moved |
| `Early_Homo_sapiens_portrait_pain…` | `homo-sapiens` | head-and-shoulders three-quarter portrait |
| `Microorganism_cell_containing_nu…` | `eukaryote` | a nucleus *and* one bean-shaped organelle — the mitochondrion is what separates this node from LUCA |
| `Microorganism_cell_floating` | `luca` | no nucleus, no compartment, evenly granular, no lobes and no flagellum |

Sixteen files, sixteen different nodes. The three lookalike pairs — two fish,
two cells, two lizard-shaped animals — each split across two nodes rather than
being duplicates of one.

## Caveats carried forward

**`sarcopterygii` fits its prompt poorly.** The image has fleshy lobed paired
fins, which is the one trait that node's watch-note exists to prevent: it is
not documented at this node, only in taxa some 50 Myr younger. It also lacks
the humped snout, the high nostrils and the pectoral spine the prompt asks for.
It is on the page by a deliberate decision to ship it rather than regenerate,
not because it passed checking. If a regeneration ever happens, this is the
first node to redo.

**Three more are weaker than their assignment suggests.** `mammaliaformes`
renders the cheek as exposed bone against flesh — the model flayed the face to
show the double jaw joint the prompt asked for. `homo-sapiens` has a braincase
that reads too modern and rounded, which undercuts the one thing that plate
exists to show: a modern face on a long, low braincase. `haplorhini` reads as a
small monkey rather than a 20–30 gram animal with small eye sockets.

## How the WebP were made

The backdrop in these JPEGs is not black. It measures 6–8 on a full-range
read, and **34% of every image's pixels sit in the 1–11 band** — the entire
backdrop plus the compression ringing around the subject. `mix-blend-mode:
screen` only cancels exact black, so shipping these unmodified would have put a
visibly lifted rectangle over the era gradient on every plate.

Near-black below 12 is therefore crushed to exact black before encoding, which
drops that band to under 1.3% — what remains is confined to the subject's own
edge, where a slight lift reads as a soft edge rather than a rectangle. The
crush cannot damage the subjects: everything below 12 is already effectively
transparent once screened, and these are mid-to-light paintings by design.

    ffmpeg -i <original> \
      -vf "scale=<w>:<w>:flags=lanczos,lutrgb=r='if(lt(val,12),0,val)':g=…:b=…" \
      -c:v libwebp -quality 82 -compression_level 6 -preset picture \
      images/plates/<node id>-<w>.webp
