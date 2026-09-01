const constants = {
  ANALYZE_RESUME_PROMPT: `First, determine if this document is actually a resume. Look for:
- Professional experience, work history, or employment information
- Education background, degrees, or academic information  
- Skills, qualifications, or professional competencies
- Contact information and personal details

If this is NOT a resume (e.g., invoice, receipt, contract, article, manual, etc.), respond with:
{
  "error": "This document does not appear to be a resume. Please upload a proper resume containing professional experience, education, and skills sections."
}

If this IS a resume, analyze it thoroughly and provide comprehensive feedback in this JSON format:
{
  "overallScore": "X/10",
  "strengths": [
    "strength 1", 
    "strength 2", 
    "strength 3"
  ],
  "improvements": [
    "improvement 1", 
    "improvement 2", 
    "improvement 3"
  ],
  "keywords": [
    "keyword 1", 
    "keyword 2", 
    "keyword 3"
  ],
  "summary": "Brief overall assessment",
  "performanceMetrics": {
    "formatting": X,
    "contentQuality": X,
    "keywordUsage": X,
    "atsCompatibility": X,
    "quantifiableAchievements": X
  },
  "actionItems": [
    "specific actionable item 1",
    "specific actionable item 2", 
    "specific actionable item 3"
  ],
  "proTips": [
    "professional tip 1",
    "professional tip 2",
    "professional tip 3"
  ],
  "atsChecklist": [
    "ats requirement 1",
    "ats requirement 2", 
    "ats requirement 3"
  ]
}

For performanceMetrics, rate each area 1-10 based on:

- formatting: Layout, structure, visual appeal, consistency, readability. Look for clean sections, proper spacing, consistent fonts, professional appearance
- contentQuality: Relevance, achievements, impact, clarity, completeness. Assess if content is relevant to target roles, achievements are well-described, and information is complete
- keywordUsage: Industry terms, ATS optimization, skill keywords, job relevance. Check for industry-specific terminology, technical skills, software names, methodologies, and relevant keywords
- atsCompatibility: ATS-friendly formatting, scannable structure, proper headings. Evaluate if resume uses standard section headers (Experience, Education, Skills), avoids graphics/images, has clean formatting, and is easily parseable by ATS systems
- quantifiableAchievements: Use of numbers, percentages, metrics in accomplishments. Look for specific numbers, percentages, dollar amounts, timeframes, team sizes, project scopes, and measurable results

For atsCompatibility specifically, be very strict and look for:
- Standard section headings (Experience, Education, Skills, Summary, etc.)
- Clean, simple formatting without graphics, images, or complex layouts
- Proper use of keywords relevant to the industry/role
- Quantified achievements with specific numbers and metrics
- Action verbs at the beginning of bullet points
- Consistent formatting throughout the document
- Contact information clearly visible
- No tables, charts, or complex formatting that might confuse ATS systems

For atsChecklist, provide specific requirements and improvements to ensure the resume passes ATS systems successfully.

For actionItems, provide specific, actionable steps the user can take immediately to improve their resume.

For proTips, give professional advice that would help them in their job search and resume optimization.

Document text:
{{DOCUMENT_TEXT}}`,
};

export const METRIC_CONFIG = [
  {
    key: "formatting",
    label: "Formatting",
    defaultValue: 7,
    colorClass: "from-emerald-400 to-emerald-500",
    shadowClass: "group-hover/item:shadow-emerald-500/30",
    icon: "🎨",
  },
  {
    key: "contentQuality",
    label: "Content Quality",
    defaultValue: 6,
    colorClass: "from-blue-400 to-blue-500",
    shadowClass: "group-hover/item:shadow-blue-500/30",
    icon: "📝",
  },
  {
    key: "atsCompatibility",
    label: "ATS Compatibility",
    defaultValue: 6,
    colorClass: "from-violet-400 to-violet-500",
    shadowClass: "group-hover/item:shadow-violet-500/30",
    icon: "🤖",
  },
  {
    key: "keywordUsage",
    label: "Keyword Usage",
    defaultValue: 5,
    colorClass: "from-purple-400 to-purple-500",
    shadowClass: "group-hover/item:shadow-purple-500/30",
    icon: "🔍",
  },
  {
    key: "quantifiableAchievements",
    label: "Quantified Results",
    defaultValue: 4,
    colorClass: "from-orange-400 to-orange-500",
    shadowClass: "group-hover/item:shadow-orange-500/30",
    icon: "📊",
  },
];

export const buildPresenceChecklist = (text) => {
  const hay = (text || "").toLowerCase();
  return [
    {
      label: "Standard Section Headings",
      present:
        /experience|education|skills|summary|objective|work history|professional experience|employment/.test(
          hay
        ),
    },
    {
      label: "Contact Information",
      present: /email|phone|linkedin|github|portfolio|@|\.com|\.net|\.org/.test(
        hay
      ),
    },
    {
      label: "Keywords & Skills",
      present:
        /skills|technologies|tech skills|competencies|programming|software|tools|javascript|python|java|react|node|sql|html|css|aws|docker|kubernetes|agile|scrum|git|api|database|framework|library|language|technology|stack/.test(
          hay
        ),
    },
    {
      label: "Quantified Achievements",
      present:
        /\d+%|\d+ percent|\d+ people|\d+ team|\d+ project|\d+ year|\d+ month|\d+ dollar|\$\d+|\d+ users|\d+ customers|\d+ revenue|\d+ growth|\d+ improvement|\d+ reduction|\d+ increase|\d+ decrease/.test(
          hay
        ),
    },
    {
      label: "Action Verbs",
      present:
        /developed|created|implemented|managed|led|designed|built|improved|increased|decreased|achieved|delivered|launched|optimized|streamlined|enhanced|established|coordinated|facilitated|orchestrated|spearheaded|pioneered|architected|engineered|deployed|maintained|supported|troubleshot|resolved|analyzed|researched|evaluated|assessed|planned|organized|executed|completed|finished|accomplished|generated|produced|created|developed|built|constructed|assembled|fabricated|manufactured|produced|yielded|resulted|caused|brought|about|led|to|contributed|to|helped|assisted|aided|supported|enabled|empowered|facilitated|promoted|encouraged|fostered|nurtured|cultivated|developed|grew|expanded|scaled|increased|boosted|enhanced|improved|upgraded|refined|polished|perfected|optimized|streamlined|simplified|clarified|organized|structured|arranged|systematized|standardized|formalized|institutionalized|established|founded|created|initiated|started|began|commenced|launched|introduced|unveiled|revealed|disclosed|announced|declared|proclaimed|stated|expressed|communicated|conveyed|transmitted|delivered|presented|demonstrated|exhibited|displayed|showcased|highlighted|emphasized|stressed|underscored|accentuated|featured|spotlighted|focused|centered|concentrated|targeted|aimed|directed|guided|steered|navigated|piloted|drove|propelled|pushed|advanced|progressed|moved|forward|accelerated|expedited|hastened|rushed|hurried|sped|up|quickened|fastened|accelerated|boosted|enhanced|amplified|magnified|multiplied|doubled|tripled|quadrupled|quintupled|sextupled|septupled|octupled|nonupled|decupled/.test(
          hay
        ),
    },
    {
      label: "Professional Experience",
      present:
        /experience|employment|work history|professional experience|job|position|role|career|occupation|employment|work|job|position|role|title|responsibilities|duties|tasks|projects|initiatives|achievements|accomplishments|contributions|impact|results|outcomes|deliverables|outputs|work|employment|job|position|role|title|company|organization|employer|client|customer|stakeholder|team|department|division|unit|group|section|branch|office|location|site|facility|premises|workplace|workstation|desk|office|cubicle|workspace|environment|setting|context|situation|circumstance|condition|state|status|level|grade|rank|tier|category|class|type|kind|sort|variety|form|style|manner|way|method|approach|technique|strategy|tactic|procedure|process|system|framework|model|paradigm|theory|concept|idea|notion|thought|belief|opinion|view|perspective|standpoint|position|stance|attitude|mindset|outlook|approach|methodology|philosophy|principle|value|standard|criterion|benchmark|measure|metric|indicator|signal|sign|mark|token|symbol|emblem|badge|insignia|logo|brand|label|tag|stamp|seal|signature|autograph|mark|trace|track|trail|path|route|way|road|street|avenue|boulevard|highway|freeway|expressway|turnpike|parkway|drive|lane|alley|path|trail|track|route|way|road|street|avenue|boulevard|highway|freeway|expressway|turnpike|parkway|drive|lane|alley/.test(
          hay
        ),
    },
    {
      label: "Education Section",
      present:
        /education|bachelor|master|phd|university|degree|college|school|academic|academy|institute|institution|faculty|department|program|course|curriculum|syllabus|textbook|lecture|seminar|workshop|tutorial|training|certification|certificate|diploma|transcript|gpa|grade|score|mark|result|outcome|achievement|accomplishment|success|performance|progress|development|growth|improvement|enhancement|advancement|promotion|elevation|upgrade|boost|lift|raise|increase|improvement|enhancement|betterment|refinement|polishing|perfection|optimization|streamlining|simplification|clarification|organization|structuring|arrangement|systematization|standardization|formalization|institutionalization|establishment|foundation|creation|initiation|start|beginning|commencement|launch|introduction|unveiling|revelation|disclosure|announcement|declaration|proclamation|statement|expression|communication|conveyance|transmission|delivery|presentation|demonstration|exhibition|display|showcase|highlighting|emphasis|stress|underscoring|accentuation|featuring|spotlighting|focusing|centering|concentration|targeting|aiming|directing|guiding|steering|navigating|piloting|driving|propelling|pushing|advancing|progressing|moving|forward|accelerating|expediting|hastening|rushing|hurrying|speeding|up|quickening|fastening|accelerating|boosting|enhancing|amplifying|magnifying|multiplying|doubling|tripling|quadrupling|quintupling|sextupling|septupling|octupling|nonupling|decupling/.test(
          hay
        ),
    },
  ];
};

export default constants;