// Centralized business pricing logic.
// Any time a fee changes (boss gives you real delivery rates, mixing fee
// goes up, etc.) — this is the ONLY file that needs editing.

export const MIXING_FEE = 2500
export const VIAL_COST = 800

export const DELIVERY_FEES = {
  local: 1500,         // same state as the studio
  national: 3500,       // other Nigerian states
  international: 15000, // outside Nigeria
}

// Returns the right delivery fee for a given zone, or null if invalid
export function getDeliveryFee(zone) {
    return DELIVERY_FEES[zone] ?? null
}

// Only manual_mix and ai_match orders involve actual mixing labor + a vial
// as_is purchases skip both entirely
export function getMixingCosts(purchaseType) {
    const appliesMixing = purchaseType === 'manual_mix' || purchaseType === 'ai_match'
    return {
        mixingFee: appliesMixing ? MIXING_FEE : 0,
        vialCost: appliesMixing ? VIAL_COST : 0,
    }
}