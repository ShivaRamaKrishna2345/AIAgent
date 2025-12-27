export function decide(confidence: number, proposed: string[]) {
  if (confidence >= 0.8 && proposed.length > 0) {
    return {
      requiresHumanReview: false,
      reasoning: "Auto-corrected using high-confidence vendor memory"
    };
  }

  if (proposed.length > 0) {
    return {
      requiresHumanReview: true,
      reasoning: "Suggestions based on learned memory"
    };
  }

  return {
    requiresHumanReview: true,
    reasoning: "Low confidence – requires human review"
  };
}
