export const generateDeterministicMindmap = (careerProfile: string, bookInfo: string) => {
  const books = bookInfo.split('\n').filter(line => line.includes(':'));
  
  const lines = [
    "### Career Mindmap: Strategic Hospitality Path",
    "",
    "**1. Current Journey:**",
    `You are currently positioned as: ${careerProfile}.`,
    "",
    "**2. Recommended Next Moves:**",
    "- Focus on mastering operational efficiency in your current role.",
    "- Seek mentorship from senior leaders in your organization.",
    "- Leverage the insights from your available library:",
    ...books.slice(0, 3).map(b => `- ${b.split(':')[0].trim()}`),
    "",
    "**3. Alejandro's Hand-Picked Note:**",
    "To stand out to quality owners, focus on results-oriented leadership and proactive problem-solving. Your dedication is your greatest asset."
  ];
  return lines.join('\n');
};
