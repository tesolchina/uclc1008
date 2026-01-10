import { Assignment } from "../types";

export type ArticleExcerpt = {
  citation: string;
  fullCitation: string;
  content: string; // Single continuous text, no sub-sections
};

export const preCourseWritingArticle: ArticleExcerpt = {
  citation: "Andrejevic & Selwyn (2020)",
  fullCitation: "Mark Andrejevic & Neil Selwyn (2020) Facial recognition technology in schools: critical questions and concerns, Learning, Media and Technology, 45:2, 115-128, DOI: 10.1080/17439884.2020.1686014",
  content: `Against this contentious background, then, we need to consider how these technologies are being applied to the specific context of education. While rarely foregrounded in debates about facial recognition in society, the school sector is one of the public settings where this technology is beginning to be taken up and implemented at scale. This is perhaps not surprising given, on the one hand, the role played by the classroom in the development of monitoring and disciplinary practices and, on the other, the increasing normalisation of surveillance in the name of protecting and securing young people.

One prominent educational application of facial recognition technology is campus security. This form of facial recognition is most prevalent in the US, where school shooting incidents have prompted school authorities to annually spend $2.7 billion on-campus security products and services (Doffman, 2018). Facial recognition systems have now been sold to thousands of US schools, with vendors "pitching the technology as an all-seeing shield against school shootings" (Harwell, 2018, n.p). As well as purporting to identify unauthorised intruders, systems have been developed to make use of video object classification trained to detect gun-shaped objects, alongside more subtle forms of 'anomaly detection' such as students arriving at school in different-than-usual clothes, bags and other apparel (Harwell, 2018). These systems promise to give school authorities an ability to initially determine who is permitted onto a school campus, and then support the tracking of identified individuals around the school site. As the marketing for the SAFR school system reasons, the capacity to know where students and staff are means that 'schools can stay focused and better analyse potential threats' (SAFR, 2019).

Another application of facial recognition in schools is attendance monitoring – promising to put an end to the inevitable gaps and omissions that arise when human teachers are tasked with repeatedly conducting roll-calls of large student groups (Puthea et al., 2017). This application of facial recognition is proving popular in countries such as the UK and Australia where school shootings and unauthorised campus incursions are rare. For example, the Australian 'Loop-Learn' facial recognition roll-call system has been marketed amidst estimates of saving up to 2.5 hours of teacher time per week. Elsewhere, automated registration systems are also considered an effective means of overcoming problems of 'fake attendance' and 'proxies' – especially in countries such as India where fraudulent attendance is commonplace (Wagh et al., 2015).

Beyond campus-based security and tracking physical bodies, facial recognition is also being used in a number of 'virtual learning' contexts. For example, facial recognition systems are now being developed as a means of ensuring the integrity of various aspects of online courses. This includes controlling access to online educational content (Montgomery & Marais, 2014), as well as using webcam-based facial recognition to authenticate online learners (i.e., confirming that the people engaging in online learning activities are actually who they claim to be) (Valera et al., 2015). Similarly, there is a growing interest in using facial recognition technology for so-called e-assessment security – i.e., verifying the identity of students taking computer-based tests and examinations, and confirming their continued presence during the whole examination period (Apampa et al., 2010; Hernández et al., 2008).

Finally, there is a growing interest in facial detection techniques as an indicator of student 'engagement' and learning. For example, research and development in this area have reported that detecting brief 'facial actions' can prove an accurate indicator of students' (non)engagement with online learning environments – highlighting episodes of boredom, confusion, delight, flow, frustration, and surprise (Dewan et al., 2019). Particularly insightful facial actions with regards to learning are reckoned to include brow-raising, eyelid tightening, and mouth dimpling (e.g., Grafsgaard et al., 2013). Elsewhere, it is claimed that 'facial microexpression states' (facial states lasting less than half a second) correlate strongly with conceptual learning, and 'could perhaps give us a glimpse into what learners [a]re thinking' (Liaw et al., 2014). All told, there is growing interest in the face as a 'continuous and non-intrusive way of…understand[ing] certain facets of the learner's current state of mind' (Dewan et al., 2019). Indeed, much of this work originates in the area of 'emotion learning analytics' that has long sought to use facial detection to elicit signs of learning in higher education. Here, learning scientists have focused on the use of facial detection of 'academic emotions' that convey achievement (contentment, anxiety, and frustration), engagement with the learning content, social emotions, and 'epistemic' emotions arising from cognitive processing. It is argued that detecting these emotions from facial expressions can highlight problems with knowledge, stimulation, anxiety and/or frustration (see D'Mello, 2017).

These largely experimental developments have led some educationalists to enthusiastically anticipate facial learning detection being deployed on a mass scale. As Timms (2016, p. 712) reasons, it might soon be possible to gain a 'real-time' sense of which groups of students are in a 'productive state' and other instances 'where the overall activity is not productive'. The promise of customisation that characterises the development of automated learning systems encourages their incorporation into student learning interfaces, so that these can recognise and respond to individual students in real-time, monitoring their achievements as well as their affective states. As these systems augment and eventually displace teacher-centred forms of instruction, they will need to be able to 'recognise' and respond to individual students. Automated systems underwrite the promise of customisation that has long characterised the online economy, offering to reconfigure it in the form of individualised tutoring, but without the expense of human teachers.`
};

export const preCourseWriting: Assignment = {
  id: "pre-course-writing",
  title: "Pre-course Writing",
  weight: "2.5%",
  dueWeek: 2,
  type: "take-home",
  description:
    "This pre-course writing consists of two tasks: Task 1 (summary writing) and Task 2 (argumentation). Submissions made before the deadline will be awarded 2.5% (out of 15%) from Class Participation. This task is also used as a baseline to help your instructor understand your starting point in key academic writing skills.",
  requirements: [
    "Task 1: Write a summary of no more than 300 words on the excerpt (no copying; no personal views)",
    "Task 2: Write an essay of no more than 300 words on the topic and show your position (no extra sources)",
    "Do NOT search for additional online or offline sources (e.g., websites, magazines)",
    "Use APA in-text citations (7th edition) to acknowledge ideas from the article",
    "Write in paragraph form: Introduction (background + thesis), Body paragraph(s) (topic sentences), Conclusion",
    "Type Task 1 and Task 2 in the same Word file",
    "Format: 12-point Times New Roman, double line spacing, 1-inch (2.5cm) margins",
    "Indicate the total number of words at the end of your work",
    "Submit to Moodle (Individual Section) by 23 Jan 2026 (Fri), 6pm",
    "No late submission is allowed",
  ],
  skillsAssessed: ["summarising", "paraphrasing", "academic-tone"],
  resources: [
    { title: "Access the assignment prompt and submission link on Moodle" },
    { title: "Review Module 2: Summarising, paraphrasing & synthesising skills before completing the task" },
    { 
      title: "UE1 (2526B) Teacher Folder (for instructors only)", 
      url: "https://hkbuhk-my.sharepoint.com/personal/leoyu_hkbu_edu_hk/_layouts/15/onedrive.aspx?id=%2Fpersonal%2Fleoyu%5Fhkbu%5Fedu%5Fhk%2FDocuments%2FUE1%20%282526B%29%20Teacher%20Folder&viewid=b249d280%2D9051%2D41d7%2D8e2e%2D0c502bb6e438" 
    },
  ],
  detailedInfo: {
    exactDueDate: "23 Jan 2026 (Fri), 6:00 PM",
    submissionMethod: "Moodle (Individual Section) via Turnitin",
    format: "Word document (.doc or .docx), 12-point Times New Roman, double-spaced, 1-inch margins",
    wordLimit: "300 words per task (600 words total)",
    gradingCriteria: [
      "Task 1 (Summary): Accuracy of summary, proper paraphrasing, no personal views included",
      "Task 2 (Essay): Clear position statement, logical reasoning, proper structure",
      "APA citation usage where required",
      "Originality (AI-generated text will result in zero marks)",
    ],
    sampleQuestions: [
      "Task 1: Summarise the excerpt about facial recognition technology in schools in no more than 300 words",
      "Task 2: Write an essay (max 300 words) on: 'Is it advisable for schools to adopt facial recognition technologies on campus? Why or why not?'",
    ],
    instructions: [
      "Task 1 (Summary Writing): Write a summary of no more than 300 words on the excerpt. Do NOT directly copy sentences – write them in your own words. Do NOT include your own views.",
      "Task 2 (Argumentation Essay): Write an essay of no more than 300 words showing your position on the topic. Include your own views and knowledge. Citing from the article is optional. Do NOT search for additional sources.",
      "Use APA in-text citations (7th edition) to acknowledge ideas from the article.",
      "Write in paragraph form: Introduction (background and thesis), Body paragraph(s) (with topic sentences), Conclusion.",
      "Format: 12-point Times New Roman, double line spacing, 1-inch (2.5cm) margins. Indicate total word count at the end.",
      "Type both tasks in the same Word file. Submit to Moodle (Individual Section) by 23 Jan 2026 (Fri), 6pm.",
      "Complete the Declaration & Acknowledgement on Moodle before submitting.",
      "Enter your Student ID and name as the Submission Title (e.g., 23123456_CHAN Tai Man).",
    ],
    aiPolicy: [
      "If AI detection tools indicate that your writing consists of AI-generated text, you will be awarded zero marks.",
      "If you directly copy a significant portion of the source text, you will be awarded zero marks.",
      "Submitting the output of generative AI tools as your own work is deemed a violation of the University's academic integrity guidelines.",
      "If flagged, you may be required to submit a detailed record of AI tool usage and/or attend an in-person oral or written defence.",
    ],
    latePolicy: "No late submission is allowed.",
    requiredMaterials: [
      "Appendix excerpt from Andrejevic & Selwyn (2020) 'Facial recognition technology in schools: critical questions and concerns'",
    ],
  },
};
