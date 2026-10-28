# SeaLink premium redesign — asset provenance

All photographs are served locally, converted to WebP with metadata stripped, and cropped by responsive layouts. They are editorial imagery, not SeaLink facilities, partners, employees or verified companies. No affiliation or endorsement by NOAA, Openscapes, the depicted participants or photographers is implied. The harbour/coastal photographs are kept at their original resolution and used as small editorial panels; they are not upscaled into full-width backgrounds. The full-width photographs are 1900 and 2200 pixels wide.

## Photography

- `maritime-hero.webp`: open water. Source: [Start Bootstrap Landing Page, bg-masthead.jpg](https://github.com/StartBootstrap/startbootstrap-landing-page/blob/247a46a2503c91d1157179eab297953438ec498b/src/assets/img/bg-masthead.jpg). Published under the repository's [MIT license](https://github.com/StartBootstrap/startbootstrap-landing-page/blob/247a46a2503c91d1157179eab297953438ec498b/LICENSE), copyright Start Bootstrap LLC. The source does not separately identify a photographer. Converted to WebP, no enlargement.
- `working-waterfront.webp`: harbour boats, photo by **Alicia Miller**, credited in the [Openscapes NOAA NEFSC workshop article](https://github.com/nmfs-openscapes/nmfs-openscapes.github.io/blob/3e4650f48fc808a1483d14edc642638cc53a410f/blog/2020-03-06-workshop-noaa-nefsc/index.qmd). [Original photograph](https://github.com/nmfs-openscapes/nmfs-openscapes.github.io/blob/3e4650f48fc808a1483d14edc642638cc53a410f/blog/2020-03-06-workshop-noaa-nefsc/northeast_aliciamiller_square.jpg). CC BY 4.0 per source repository license. Converted to WebP and displayed with a responsive crop. Not presented as a European SeaLink partner port.
- `coastal-detail.webp`: coastal waves. **Openscapes contributors**, individual photographer not separately named in the source article (authors Julie Lowndes and Erin Robinson). [Source](https://github.com/nmfs-openscapes/nmfs-openscapes.github.io/blob/3e4650f48fc808a1483d14edc642638cc53a410f/blog/2022-03-21-news-march-2022/ocean-square.jpg). CC BY 4.0 per source repository license. Converted to WebP and cropped for the editorial panel.
- `working-together.webp`: fisheries science workshop. **Openscapes contributors**, article by Julie Lowndes; photographer not separately identified. [Source](https://github.com/nmfs-openscapes/nmfs-openscapes.github.io/blob/3e4650f48fc808a1483d14edc642638cc53a410f/blog/2020-03-06-workshop-noaa-nefsc/nefsc_workshop_breakout.jpg). CC BY 4.0 per source repository license. Resized from 3851 to 2200 pixels, converted to WebP; dark overlay and responsive crop applied. Depicts an actual science workshop, not SeaLink staff or commercial participants.

Openscapes [source license](https://github.com/nmfs-openscapes/nmfs-openscapes.github.io/blob/3e4650f48fc808a1483d14edc642638cc53a410f/LICENSE): [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). Retain attribution and indicate modifications when reusing these photos. License notices are included under `public/images/`. Public credit links are available at `/credits`.

Unsplash/Pexels image endpoints returned HTTP 403 in this execution environment. Those images were not used. Alternative assets were downloaded through native Git from the source repositories above, not through image proxies. The briefly proposed domain additions were reverted; no runtime external-photo permission is required.

## Typography

- **Manrope**, variable weight 200–800, Latin subset. Fontsource package `@fontsource-variable/manrope` 5.3.0. SIL Open Font License 1.1, license retained in `public/fonts/Manrope-LICENSE.txt`.
- **Instrument Serif**, italic 400, Latin subset. Fontsource package `@fontsource/instrument-serif` 5.3.0. SIL Open Font License 1.1, license retained in `public/fonts/InstrumentSerif-LICENSE.txt`.

Fonts are locally served WOFF2 with `font-display: swap`. No Google Fonts runtime request is used. The serif is an editorial accent only; operational screens use Manrope.

## Workspace 2.2 visual treatment

The existing licensed photographs remain unchanged. New blue/orange overlay treatments are implemented in workspace.css; no new industrial factory, port-container or cold-chain photographs were added. Dedicated industrial replacement imagery remains a source-content follow-up rather than an unlicensed substitution.
