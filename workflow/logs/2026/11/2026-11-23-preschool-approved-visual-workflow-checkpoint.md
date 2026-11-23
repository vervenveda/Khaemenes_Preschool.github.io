# 2026-11-23 · Preschool approved visual workflow checkpoint

- Repository: `vervenveda/Khaemenes_Preschool.github.io`
- Date/timezone: 2026-11-23 · America/New_York
- Type: upgrade / repair / decision / follow-up
- Branch and inspected commit: `main` at `257a222f98369b992655b619bf7e60581fc79440`
- Preservation branch: `checkpoint/preschool-approved-2026-11-23` (points to the exact code checkpoint above)
- State: **APPROVED DESIGN BASELINE / source-verified**. NOT a formal GitHub branch-protection rule and NOT a complete live-browser certification.
- Page: https://vervenveda.com/Khaemenes_Preschool.github.io/

## Approved change control / visual lock

The owner approved the current Preschool landing page and requested a freeze on unrequested visual changes. Treat this snapshot as the baseline: **do not change colors, layouts, font styling, navigation, or curriculum unless explicitly requested**. Before edits, compare with the checkpoint and preserve all unrelated markup, scripts, working links, learner progress, and curriculum. Make a minimal scoped change, log its commit, check regressions, and offer a rollback to the preservation branch. Do not mistake a GitHub commit or CSS-source check for a browser interaction/visual PASS.

The preservation branch is a recoverable snapshot, **not an immutable lock**. Formal branch protection / ruleset enforcement would require a separate authorized repository-settings change.

## Source-of-truth styles and palette

The following are literal CSS variables from `assets/creche-home-fresh-v1.css`. The separately loaded `assets/preschool-playful-theme.css` defines some of the *same variable names differently*, and late scoped overrides may win in the cascade. **Never blindly replace or merge the two palettes.** Inspect the computed style when adjusting a specific element.

| Token | Landing-page stylesheet | Intended reference |
| --- | --- | --- |
| `--prek-charcoal` | `#243038` | Dark text and controls |
| `--prek-cream` | `#fffbea` | Cream text (theme later also uses `#ffffff`) |
| `--prek-paper` | `#fffef8` | Paper surfaces |
| `--prek-sun` | `#ffe45e` | Yellow |
| `--prek-sky` | `#67cfff` | Light blue |
| `--prek-aqua` | `#62e4f5` | Cyan |
| `--prek-mint` | `#77e6b6` | Mint |
| `--prek-green` | `#a6e85c` | Green (theme overrides token with `#24c98b`) |
| `--prek-pink` | `#ff88c8` | Pink (theme overrides token with `#ff4fa3`) |
| `--prek-watermelon` | `#ff7a8a` | Watermelon pink |
| `--prek-orange` | `#ffb347` | Orange (theme overrides token with `#ff8f3d`) |
| `--prek-lavender` | `#b89cff` | Purple/lavender |
| `--prek-radius` | `7px` | Rounded corners |

**Approved visual intent:** bright child-friendly palette, distinct colored cards, white or light-cream lettering on purple, watermelon, and orange surfaces; preserve green backgrounds when asked to alter *only* green text; black lettering on specifically requested light-blue learning cards; white letters with black outline on the watermelon My Learning Profile *title*, with no black background plate. My Learning Profile *accordion tab* is blue, distinct from the watermelon hero.

**Typography as recorded in the current source:** child-facing main page content received 24px minimum rules (some lower-level or separate component rules may differ); related card controls/buttons were assigned 24px in their scoped CSS; hero typography includes 33px Academy eyebrow and 66px-or-larger preschool hero/title values in specific rules. The canonical lower-left class-tools toolbar is intentionally exempt from the 24px child-content requirement: its **12 tool labels are 10px** within a widened **300px** four-column panel; its Tools toggle remains **16px**. `assets/preschool-playful-theme.css` uses Marker Felt / Chalkboard SE / Comic Sans title fallbacks and Comic Sans / Chalkboard SE body fallbacks. Some stylesheets include older overrides; test final computed sizes before claiming universal compliance.

## Itemized upgrades and repairs completed in this recovery session

| # | Item | Code / implementation evidence | State |
| --- | --- | --- | --- |
| 01 | Recovered the owner's intact 2026-11-23 #237 visual checkpoint (black card outlines) after unsuccessful broader restores. | `61296928`, restoration `ced047ef` | committed |
| 02 | Advanced the recovery one change at a time; restored Five Days adventure entrypoint/catalog and Graduation Garden colors. | `df068c3`, `e350e96` | committed |
| 03 | Rebuilt the My Learning Profile into a balanced 2×2 functional-card area; removed three redundant school-directory/category cards. | `c02ca0c`, `fc6ac12` | committed |
| 04 | Preserved the owner's green backgrounds and changed green tab/profile-card text to readable cream only. | `b999c1d` | committed |
| 05 | White, black-outlined My Learning Profile heading on watermelon; removed Wise Owl's three nonfunctional learner/mentor/day placeholders. | `1043658` | committed |
| 06 | Four Family & Parent Controls actions aligned in an equal-sized 2×2 grid; removed surplus family-status placeholders. | `08e7be3` | committed |
| 07 | Favorite Crèche Adventures card reorganized, with a working Manage Adventures control and registration explanation. | `fc6ac12` | committed |
| 08 | Donation/Support Crèche interior card recolored sky blue and donation action red/watermelon at bottom. | `08e7be3` | committed |
| 09 | Blue My Learning Profile accordion tab distinguished from the watermelon inner hero; white/cream lettering improved on colorful top navigation. | `523fb54` | committed |
| 10 | Page-wide white lettering rules for purple, watermelon and orange action buttons without changing their fills. | `383cd47` | committed |
| 11 | My Crèche Home accordion hidden rather than deleted (underlying daily tools remain); child entry scroll rerouted to weekly learning. | `055b3a8` | committed |
| 12 | Balloon orbit icon linked to Preschool Tools accordion. | `198a850` | committed |
| 13 | Removed redundant hero shortcuts Rooms, New Adventures, Adventures, Little Organizer; preserved their underlying sections. | `52579d0` | committed |
| 14 | Replaced second-row hero actions with working links to Pinned Apps, Reading Time, Explore & Play, and official Academy Parent Portal. | `c7eb388` | committed |
| 15 | Retired the separate lower-left local dock; used the gateway's canonical **idempotent**, directory-backed `vnv-class-tools-toolbar.js?v=1.6.1` and 12 page-specific tools. Preserved Preschool external-navigation safety guard. | `e4bc10f`, `311b827` | source-verified |
| 16 | Adjusted canonical class-tool buttons for label fitting: 4 columns; 300px panel; 10px labels; no mid-word splitting. | `a655c71`, `f959ae5` | source-verified; visual browser retest recommended |
| 17 | Reading Time card changed to light blue, with coral/watermelon contrast button at bottom; Reading Time launch binding preserved. | `4d92e046` | committed |
| 18 | Explore & Play title white on existing green hero; category cards place “open shelf” on its own line. | `49a09b9`, `4d92e046` | committed |
| 19 | Preschool Tools: Adventure Stars and light-blue Words & Stories use dark text; subject card “N adventures” counts on a separate unbroken line. | `ad39cfd`, `f3a5051` | committed |
| 20 | Preschool Tools buttons: distinct colored Favorites, Calm, Surprise Me, See Every Adventure, Graduation Garden. Working IDs and handlers retained. | `f3a5051` | committed |
| 21 | Removed the legacy second language dropdown beneath the official translator; kept the canonical `preschool-language-loader.js` and language switch. | `257a222f` | source-verified |
| 22 | Preserved original learning activities, curriculum, parent/student destinations, main accordion stack, header, ticker and translator integrations except for explicitly authorized changes. | `index.html` and referenced assets | source review only |

## Evidence and audit findings

| ID | Affected paths | Observed evidence | Priority | Status |
| --- | --- | --- | --- | --- |
| VIS-01 | `index.html` | Current head is `257a222f98369b992655b619bf7e60581fc79440` | High | source-verified |
| VIS-02 | `assets/creche-home-fresh-v1.css`, `assets/preschool-playful-theme.css` | Palette variables and component overrides inspected. Overlapping variable definitions require caution. | High | source-verified |
| UI-03 | `assets/preschool-local-toolbar.js`, `index.html` | Canonical class-tools configuration installed; old dock retired; external exit notice retained. | High | source-verified; click-through test pending |
| I18N-04 | `index.html`, `assets/preschool-language-loader.js` | Legacy dropdown code removed; official loader remains. | High | source-verified; live-language test pending |

## Tests

| Command or scenario | Environment | Result | Evidence |
| --- | --- | --- | --- |
| GitHub branch and source inspection | GitHub connector | PASS | Inspected `main` SHA and CSS variables |
| Protected recoverable baseline branch | GitHub connector | PASS | `checkpoint/preschool-approved-2026-11-23` points to `257a222f` |
| Actual live visual screenshot across viewports | Browser | NOT RUN in this workflow checkpoint | Prior owner screenshots informed design feedback; no automated browser certification |
| Full button navigation/translation click-through | Browser | NOT RUN | Confirm with user / future QA session |
| Curriculum mastery/assessment tests | Automated suite | NOT RUN (out of scope) | No curriculum or learner-record files changed by this log |

## Open items

- [ ] Confirm final visual appearance at normal desktop zoom, tablet and mobile.
- [ ] Test every Preschool class-tool action and page-anchor/parent portal navigation in a browser.
- [ ] Verify only one official language selector remains and test language switching.
- [ ] Review CSS cascade specificity/duplicate declarations before any future cleanup; do not purge without explicit approval.
- [ ] If a **hard enforcement lock** is needed, configure GitHub branch protection or a ruleset separately with explicit owner approval.

## Safety and closure

This log documents the baseline and **does not lock GitHub's main branch against writes**. Preserve original grades, assessment history, authority boundaries, private learner data, keys, credentials, and the 80% mastery rule; none are included in this log. No source, design, or curriculum files are intentionally modified by the workflow-journal update.
