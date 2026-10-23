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
import { SKIN_BEFORE } from "./skin-before";
import { SKIN_AFTER } from "./skin-after";

export { BATH, BATH_DEPTH };

/** The before/after pair is skin now: before the visit vs after Wax It. */
export const COMPARE_BEFORE = SKIN_BEFORE;
export const COMPARE_AFTER = SKIN_AFTER;

/** Journey stages in order: Arrive, Prep, Wax, Glow. */
export const JOURNEY_IMGS: string[] = [JOURNEY_ARRIVE, JOURNEY_PREP, JOURNEY_TREATMENT, JOURNEY_GLOW];

/** Lab treatments by mode id. */
export const LAB_IMGS: Record<string, string> = {
  wax: LAB_WAX,
  scrub: LAB_SCRUB,
  hammam: LAB_HAMMAM,
  massage: LAB_MASSAGE,
};
