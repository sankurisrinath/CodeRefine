def aggregate_issues(static_issues: list, ai_issues: list) -> list:
    """Merge static and AI issues, deduplicating by line number, and tag each with a source."""
    aggregated = []

    # Index static issues by line for dedup lookup
    static_by_line: dict[int, dict] = {}
    for issue in static_issues:
        line = issue.get("line", 0)
        static_by_line.setdefault(line, issue)

    # Process static issues first — mark as "verified"
    for issue in static_issues:
        aggregated.append({
            "type": issue.get("type", "general"),
            "line": issue.get("line", 0),
            "severity": issue.get("severity", "MEDIUM"),
            "message": issue.get("message", ""),
            "explanation": "",
            "suggestion": "",
            "source": "verified",
        })

    # Process AI issues
    for ai_issue in ai_issues:
        line = ai_issue.get("line", 0)
        if line in static_by_line:
            # AI confirmed a static finding — enrich it with explanation/suggestion
            for agg in aggregated:
                if agg["line"] == line and agg["source"] == "verified":
                    agg["explanation"] = ai_issue.get("explanation", "")
                    agg["suggestion"] = ai_issue.get("suggestion", "")
                    break
        else:
            # AI-only finding
            aggregated.append({
                "type": ai_issue.get("type", "general"),
                "line": line,
                "severity": ai_issue.get("severity", "MEDIUM"),
                "message": ai_issue.get("message", ""),
                "explanation": ai_issue.get("explanation", ""),
                "suggestion": ai_issue.get("suggestion", ""),
                "source": "inferred",
            })

    return aggregated
