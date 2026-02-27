def compute_confidence(aggregated_issues: list) -> float:
    """Compute a weighted confidence score based on issue sources.

    Score ranges:
    - verified (static + AI confirmed): 0.85–0.95
    - inferred (AI-only):               0.70–0.84
    - verified (static-only):           0.80–0.90

    Returns a single float in the range [0.60, 0.95].
    """
    if not aggregated_issues:
        return 0.75

    total_weight = 0.0
    total_score = 0.0

    for issue in aggregated_issues:
        source = issue.get("source", "inferred")
        has_explanation = bool(issue.get("explanation"))

        if source == "verified" and has_explanation:
            # Static + AI confirmed
            score = 0.90
            weight = 2.0
        elif source == "verified":
            # Static-only
            score = 0.85
            weight = 1.5
        else:
            # AI-only / inferred
            score = 0.75
            weight = 1.0

        total_score += score * weight
        total_weight += weight

    if total_weight == 0:
        return 0.75

    raw = total_score / total_weight
    # Clamp to [0.60, 0.95]
    return round(max(0.60, min(0.95, raw)), 4)
