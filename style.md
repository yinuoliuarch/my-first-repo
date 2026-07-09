# Aesthetic Style Guide: 2000s Emocore Blog

## Core Direction

The website feels like a personal emo/MySpace-era blog from the early 2000s, not a modern landing page. The interface should be dense, dramatic, slightly messy, and emotionally performative, while still being readable and functional.

The main reference is a fake browser window with a black-and-hot-pink MySpace profile layout: small navigation links, compact profile panels, glittery visual noise, low-resolution internet energy, and an intentionally personal tone.

## Mood Keywords

- 2000s emocore
- MySpace profile
- scene kid internet
- hot pink and black
- glitter graphics
- dramatic but cute
- handmade blog layout
- low-res web nostalgia
- sad meme humor

## Layout Rules

- Avoid a giant modern hero title.
- Keep the interface compact and screen-based.
- Use a fake browser/window frame to create a nostalgic desktop-web feeling.
- Use a two-column blog layout when space allows:
  - Left column: profile card, avatar, user details, friend/action links.
  - Right column: blog entry area, current meme cat, button interaction.
- On smaller screens, collapse into one column while keeping the dense profile/blog feeling.
- Avoid large empty whitespace. This style should feel intentionally crowded.

## Color System

Primary palette:

| Role | Color | Use |
| --- | --- | --- |
| Black | `#050505` | Main page background and panels |
| Hot pink | `#ff2aa7` | Borders, banners, buttons, highlights |
| Light pink | `#ff66c8` | Gradients, hover glow, secondary accents |
| Dark pink | `#b90068` | Shadows, depth, text effects |
| White | `#ffffff` | Main text and hard contrast |
| Cyan | `#59d7ff` | Fake browser chrome accent |
| Lime | `#c9ff4d` | Hover/highlight color |

The palette should be high-contrast and intentionally loud. Black and hot pink should dominate.

## Typography

- Use system/web-safe fonts to preserve the old-web feeling.
- Main UI text: `Arial, Helvetica, sans-serif`.
- Browser chrome text: `"MS Sans Serif", Arial, sans-serif`.
- Avoid elegant modern typography.
- Text should be small and dense, usually around `11px` to `14px`.
- Use bold text often for profile names, banners, buttons, and captions.
- Use text shadows sparingly to create early-2000s glow effects.

## Visual Texture

The page should feel like it was assembled from web graphics, not designed as a clean product interface.

Use:

- Repeating background patterns.
- Hot-pink borders.
- Fake browser/address bars.
- Inset/outset button borders.
- High-contrast panel blocks.
- Grayscale, contrast-heavy cat images.
- Small navigation links separated by vertical lines.
- Slightly noisy or tiled backgrounds.

Avoid:

- Minimalist white space.
- Smooth SaaS-style cards.
- Large modern gradients.
- Oversized hero typography.
- Corporate polish.

## Image Treatment

Cat images should feel like meme/blog content rather than polished photography.

Recommended treatment:

- `filter: grayscale(1) contrast(1.3) brightness(0.9);`
- Strong white or pink border.
- Caption strip under the image.
- Keep image aspect ratio stable, ideally `4 / 3`.
- Use random or changing images for the generator behavior.

## Interaction Rules

The main interaction is the button:

```text
Get your emo cat
```

Behavior:

- Clicking the button changes the meme cat image.
- The caption should also change.
- The screen should not scroll as the user clicks.
- A small flicker/blink animation is appropriate when the image changes.
- The button should feel like an old web form button, not a modern app button.

## Tone of Copy

Copy should be melodramatic, internet-native, and lightly funny.

Examples:

- `current mood: eyeliner and existential tuna`
- `crying, but responsibly`
- `the calendar is a rumor`
- `graphic design is my coping strategy`
- `track seven knows everything`

Avoid generic marketing copy like:

- `Discover amazing cats`
- `Explore our gallery`
- `A beautiful experience for cat lovers`

## Accessibility Notes

Even though the style is chaotic, the site should still be usable:

- Keep text contrast high.
- Preserve `alt` text for cat images.
- Use real buttons for actions.
- Avoid motion that is too long or aggressive.
- Keep the no-scroll layout from clipping important content on small screens.

## Design Principle

The site should look like a chaotic personal web artifact from 2005, but it should be built with clean modern HTML, CSS, and JavaScript underneath.
