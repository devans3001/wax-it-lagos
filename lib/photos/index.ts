import { BATH } from "./bath";
import { BATH_DEPTH } from "./bath-depth";
import { BATH_VIDEO } from "./hero-video";
import { JOURNEY_ARRIVE } from "./journey-arrive";
import { JOURNEY_PREP } from "./journey-prep";
import { JOURNEY_TREATMENT } from "./journey-treatment";
import { JOURNEY_GLOW } from "./journey-glow";
import { LAB_WAX } from "./lab-wax";
import { LAB_SCRUB } from "./lab-scrub";
import { LAB_HAMMAM } from "./lab-hammam";
import { LAB_MASSAGE } from "./lab-massage";
import { IG2_GRANULES } from "./ig2-granules";
import { IG2_WAXPOT } from "./ig2-waxpot";
import { IG2_FACEWAX } from "./ig2-facewax";
import { IG2_RITUAL } from "./ig2-ritual";
import { IG_WAX } from "./ig-wax";
import { IG_HAMMAM } from "./ig-hammam";
import { IG_MASSAGE } from "./ig-massage";
import { IG_BACK } from "./ig-back";
import { IG_LYMPH } from "./ig-lymph";
import { IG_REFLEX } from "./ig-reflex";
import { IG_THERAPIST } from "./ig-therapist";
import { IG_ROOM } from "./ig-room";
import { SKIN_BEFORE } from "./skin-before";
import { SKIN_AFTER } from "./skin-after";

export { BATH, BATH_DEPTH, BATH_VIDEO };
export { IG_WAX, IG_HAMMAM, IG_MASSAGE, IG_BACK, IG_LYMPH, IG_REFLEX, IG_THERAPIST, IG_ROOM };
export { IG2_GRANULES, IG2_WAXPOT, IG2_FACEWAX, IG2_RITUAL, LAB_WAX };

/** The before/after pair is skin now: before the visit vs after Wax It. */
export const COMPARE_BEFORE = SKIN_BEFORE;
export const COMPARE_AFTER = SKIN_AFTER;

/** Journey stages in order: Arrive, Prep, Wax, Glow. */
export const JOURNEY_IMGS: string[] = [JOURNEY_ARRIVE, JOURNEY_PREP, IG2_WAXPOT, JOURNEY_GLOW];

/** Lab treatments by mode id — all four are the spa's real Instagram
    photos (the scrub was found in their older posts, Oct 23, 2026). */
export const LAB_IMGS: Record<string, string> = {
  wax: IG_WAX,
  scrub: IG2_GRANULES,
  hammam: IG_HAMMAM,
  massage: IG_MASSAGE,
};
