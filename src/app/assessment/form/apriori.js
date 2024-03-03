const Scenario = {
  Scenario1: 1,
  Scenario2: 2,
  Scenario3: 3,
};

export default function assessUserAssessment(assessments) {
  const domainQuestions = {
    I: [0, 1],
    II: [2],
    III: [3, 4],
    IV: [5, 6, 7],
    V: [8, 9],
    VI: [10],
    VII: [11, 12],
    VIII: [13],
    IX: [14],
    X: [15, 16],
    XI: [17],
    XII: [18, 19],
    XIII: [20, 21, 22],
  };

  // Scenario 1
  const scenario1Domains = ['I', 'II', 'III', 'IV', 'V', 'VIII', 'X', 'XIII'];
  const scenario1Triggered = scenario1Domains.some((domain) =>
    domainQuestions[domain].slice(-2).every((question) => assessments[question] >= 2)
  );

  if (scenario1Triggered) {
    return { triggered: true, scenario: Scenario.Scenario1 };
  }

  // Scenario 2
  const scenario2Domains = ['VI', 'VII', 'IX', 'XI', 'XII'];
  const scenario2Triggered = scenario2Domains.some((domain) =>
    domainQuestions[domain].some((question) => assessments[question] >= 1)
  );

  if (scenario2Triggered) {
    return { triggered: true, scenario: Scenario.Scenario2 };
  }

  // Scenario 3
  const scenario3Triggered = Object.values(domainQuestions).every((questions) =>
    questions.every((question) => assessments[question] >= 3)
  );

  if (scenario3Triggered) {
    return { triggered: true, scenario: Scenario.Scenario3 };
  }

  return { triggered: false, scenario: 0 };
}
