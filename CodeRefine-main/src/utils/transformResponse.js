export function transformResponse(apiResponse) {
  const { static_issues = [], ai_suggestions = [], optimized_code = "", confidence_score = 0, explanation = "" } = apiResponse;

  const allIssues = [...static_issues, ...ai_suggestions];

  const bugs = [];
  const performance = [];
  const security = [];
  const bestPractices = [];

  for (const issue of allIssues) {
    const category = (issue.type || issue.category || "").toLowerCase();
    const mapped = {
      severity: issue.severity || "medium",
      line: issue.line || 0,
      message: issue.message || "",
      suggestion: issue.suggestion || "",
    };

    if (category === "performance") {
      performance.push(mapped);
    } else if (category === "security") {
      security.push(mapped);
    } else if (["best_practice", "style", "cleanup"].includes(category)) {
      bestPractices.push(mapped);
    } else {
      bugs.push(mapped);
    }
  }

  return {
    bugs,
    performance,
    security,
    bestPractices,
    optimizedCode: optimized_code,
    confidence: confidence_score,
    explanation,
  };
}
