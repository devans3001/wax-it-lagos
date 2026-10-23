import { BATH } from "./bath";
import { BATH_DEPTH } from "./bath-depth";
import { JOURNEY_ARRIVE } from "./journey-arrive";
import { JOURNEY_PREP } from "./journey-prep";
import { JOURNEY_TREATMENT } from "./journey-treatment";
import { JOURNEY_GLOW } from "./journey-glow";
import { LAB_WAX } from "./lab-wax";
import { LAB_SCRUB } from "./lab-scrub";
import { LAB_HAMMAM } from "./lab-hammam";
import { LAB_MASSAGE } from "./lab-massage";
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

export { BATH, BATH_DEPTH };
export { IG_WAX, IG_HAMMAM, IG_MASSAGE, IG_BACK, IG_LYMPH, IG_REFLEX, IG_THERAPIST, IG_ROOM };

/** The before/after pair is skin now: before the visit vs after Wax It. */
export const COMPARE_BEFORE = SKIN_BEFORE;
export const COMPARE_AFTER = SKIN_AFTER;

/** Journey stages in order: Arrive, Prep, Wax, Glow. */
export const JOURNEY_IMGS: string[] = [JOURNEY_ARRIVE, JOURNEY_PREP, JOURNEY_TREATMENT, JOURNEY_GLOW];

/** Lab treatments by mode id. Their real Instagram photos wherever their
    page has one; scrub keeps the AI photograph — no scrub shot exists on
    their page (checked Oct 23, 2026). */
export const LAB_IMGS: Record<string, string> = {
  wax: IG_WAX,
  scrub: LAB_SCRUB,
  hammam: IG_HAMMAM,
  massage: IG_MASSAGE,
};
