import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { preCourseWriting, preCourseWritingArticle } from "@/data/assignments/preCourseWriting";
import { week2, week2Meta } from "@/data/weeks/week2";
import { week1, week1Meta } from "@/data/weeks/week1";
import { getSkillById } from "@/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CheckCircle2, Clock, FileText, ExternalLink, ArrowLeft, BookOpen, ScrollText, Quote, AlertTriangle, ShieldAlert, PenLine, Upload, Info, ChevronDown, ChevronRight } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { PreCourseAssistant } from "@/components/assignments/PreCourseAssistant";

const PreCourseWritingPage = () => {
  const location = useLocation();
  const { profile } = useAuth();
  const assignment = preCourseWriting;
  
  // Collapsible section states
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [citationOpen, setCitationOpen] = useState(false);
  const [formatOpen, setFormatOpen] = useState(false);
  const [articleOpen, setArticleOpen] = useState(false);
  const [skillsOpen, setSkillsOpen] = useState(false);
  
  // Determine if user came from week 1 or week 2
  const isFromWeek1 = location.pathname.includes("/week/1/");
  const week = isFromWeek1 ? week1 : week2;
  const meta = isFromWeek1 ? week1Meta : week2Meta;
  const backLink = isFromWeek1 ? "/week/1" : "/week/2";

  // Check if user is a teacher for showing teacher-only resources
  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin';

  const skillsAssessed = assignment.skillsAssessed
    ?.map((sid) => getSkillById(sid))
    .filter((s): s is NonNullable<typeof s> => s !== undefined) || [];

  const typeColors: Record<string, string> = {
    "take-home": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    "in-class": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    "online": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="hero-shell">
        <div className="hero-glow-orb" aria-hidden="true" />
        <div className="hero-inner">
          <div className="space-y-3">
            <Link 
              to={backLink}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to {week.title}
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <span className="week-pill">UCLC1008</span>
              <Badge className={typeColors[assignment.type] || "bg-muted"}>
                {assignment.type}
              </Badge>
              <span className="hero-badge font-semibold">{assignment.weight}</span>
              <span className="hero-badge">University English I (2025-26, S2)</span>
            </div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Pre-course Writing
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              This pre-course writing consists of two tasks. Task 1 is summary writing, while Task 2 is about argumentation.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild>
                <a 
                  href="https://buelearning.hkbu.edu.hk/course/view.php?id=123111" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Submit on Moodle
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Due Date & Submission Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-3 py-4">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Due Date</p>
              <p className="font-semibold">23 Jan 2026 (Fri), 6:00 PM</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-xs text-muted-foreground">Late Policy</p>
              <p className="font-semibold text-amber-600">No late submission allowed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant */}
      <PreCourseAssistant />

      {/* Instructions Section - Collapsible */}
      <Collapsible open={instructionsOpen} onOpenChange={setInstructionsOpen}>
        <Card className="card-elevated">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Instructions
                </span>
                {instructionsOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4 pt-0">
              <ol className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
                  <span>This pre-course writing consists of two tasks. <strong>Task 1</strong> is summary writing, while <strong>Task 2</strong> is about argumentation.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
                  <span>In <strong>Task 1</strong>, write a summary of <strong>no more than 300 words</strong> on the excerpt of an academic journal article placed in the appendix. Do <strong>NOT</strong> directly copy sentences from the excerpt – you need to write them in your own words. Do <strong>NOT</strong> include your own views in the summary.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
                  <div className="space-y-2">
                    <span>In <strong>Task 2</strong>, write an essay of <strong>no more than 300 words</strong> on the following topic and show your position. You need to include your own views and knowledge in the essay, while citing examples or ideas from the journal article in the appendix is optional. However, do <strong>NOT</strong> search for additional online or offline sources (e.g., websites, magazines).</span>
                    <blockquote className="border-l-4 border-primary pl-4 mt-2 italic text-foreground bg-primary/5 py-2 rounded-r">
                      "Is it advisable for schools to adopt facial recognition technologies on campus? Why or why not?"
                    </blockquote>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-xs font-bold text-destructive">4</span>
                  <span className="text-destructive">If AI detection tools indicate that your writing consists of AI-generated text, or you have directly copied a significant portion of the source text, you will be awarded <strong>zero marks</strong> for this assignment.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">5</span>
                  <div className="space-y-2">
                    <span>Use <strong>APA in-text citations (7th edition)</strong> to acknowledge ideas from the article in your summary and essay.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">6</span>
                  <div className="space-y-1">
                    <span>Write in paragraph form and adopt the following general structure for your summary and essay:</span>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      <li>Introduction (including background and a thesis statement)</li>
                      <li>Body paragraph(s) (including a topic sentence for each body paragraph)</li>
                      <li>Conclusion</li>
                    </ul>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">7</span>
                  <span>Type your summary (Task 1) and essay (Task 2) in the <strong>same Word file</strong>. Your completed work should be submitted to <strong>Moodle (Individual Section)</strong> by <strong>23 Jan 2026 (Fri), 6pm</strong>. Submissions made before the deadline will be awarded 2.5% (out of 15%) from 'Class Participation'. <strong>No late submission is allowed.</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">8</span>
                  <span>Please re-submit your work to Moodle if you have changed your section as the submission in the previous section will be erased by the system automatically.</span>
                </li>
              </ol>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Citation Examples - Collapsible */}
      <Collapsible open={citationOpen} onOpenChange={setCitationOpen}>
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-amber-500/10 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <Quote className="h-4 w-4 text-amber-600" />
                  APA Citation Examples (7th Edition)
                </span>
                {citationOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-3 pt-0">
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded-lg bg-background/80">
                  <p className="font-medium text-foreground mb-1">Author-prominent style:</p>
                  <p className="text-muted-foreground">[author's surname] + [a reporting verb]</p>
                  <p className="text-foreground italic mt-1">E.g., "Andrejevic and Selwyn (2020) report that facial recognition technologies are widely adopted in schools."</p>
                </div>
                <div className="p-3 rounded-lg bg-background/80">
                  <p className="font-medium text-foreground mb-1">Signal-phrase style:</p>
                  <p className="text-foreground italic">E.g., "According to Andrejevic and Selwyn (2020), facial recognition technologies are widely adopted in schools."</p>
                  <p className="text-foreground italic mt-1">E.g., "According to some researchers, facial recognition technologies are widely adopted in schools (Andrejevic & Selwyn, 2020)."</p>
                </div>
                <div className="p-3 rounded-lg bg-background/80">
                  <p className="font-medium text-foreground mb-1">Information-prominent style:</p>
                  <p className="text-muted-foreground">[cite the author's name after the information or at the end of the sentence]</p>
                  <p className="text-foreground italic mt-1">E.g., "Facial recognition technologies are widely adopted in schools (Andrejevic & Selwyn, 2020)."</p>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Format Requirements - Collapsible */}
      <Collapsible open={formatOpen} onOpenChange={setFormatOpen}>
        <Card className="card-elevated">
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
              <CardTitle className="flex items-center justify-between text-base">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Format Requirements
                </span>
                {formatOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Word document (.doc or .docx)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>12-point Times New Roman</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Double line spacing</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/50">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>1-inch (2.5cm) margins</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-muted/50 sm:col-span-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Indicate total number of words at the end of your work</span>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Separator />

      {/* Appendix - Source Article - Collapsible */}
      <Collapsible open={articleOpen} onOpenChange={setArticleOpen}>
        <Card className="border-primary/20">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <ScrollText className="h-5 w-5 text-primary" />
                  Appendix – Source Article
                </span>
                {articleOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span>Andrejevic & Selwyn (2020) - Facial recognition technology in schools</span>
                {!articleOpen && <Badge variant="outline" className="text-xs">Click to read</Badge>}
              </CardDescription>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div className="rounded-lg bg-muted/50 p-4 border border-border">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Source</p>
                <p className="text-sm text-foreground">
                  Mark Andrejevic & Neil Selwyn (2020) Facial recognition technology in schools: critical questions and concerns, 
                  <em> Learning, Media and Technology</em>, 45:2, 115-128, DOI: 10.1080/17439884.2020.1686014
                </p>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-sm leading-relaxed text-muted-foreground">
                <h3 className="text-base font-semibold text-foreground">Facial recognition technologies in education</h3>
                <p>
                  Against this contentious background, then, we need to consider how these technologies are being applied to the specific context of education. While rarely foregrounded in debates about facial recognition in society, the school sector is one of the public settings where this technology is beginning to be taken up and implemented at scale. This is perhaps not surprising given, on the one hand, the role played by the classroom in the development of monitoring and disciplinary practices and, on the other, the increasing normalisation of surveillance in the name of protecting and securing young people.
                </p>
                <p>
                  One prominent educational application of facial recognition technology is campus security. This form of facial recognition is most prevalent in the US, where school shooting incidents have prompted school authorities to annually spend $2.7 billion on-campus security products and services (Doffman, 2018). Facial recognition systems have now been sold to thousands of US schools, with vendors "pitching the technology as an all-seeing shield against school shootings" (Harwell, 2018, n.p). As well as purporting to identify unauthorised intruders, systems have been developed to make use of video object classification trained to detect gun-shaped objects, alongside more subtle forms of 'anomaly detection' such as students arriving at school in different-than-usual clothes, bags and other apparel (Harwell, 2018). These systems promise to give school authorities an ability to initially determine who is permitted onto a school campus, and then support the tracking of identified individuals around the school site. As the marketing for the SAFR school system reasons, the capacity to know where students and staff are means that 'schools can stay focused and better analyse potential threats' (SAFR, 2019).
                </p>
                <p>
                  Another application of facial recognition in schools is attendance monitoring – promising to put an end to the inevitable gaps and omissions that arise when human teachers are tasked with repeatedly conducting roll-calls of large student groups (Puthea et al., 2017). This application of facial recognition is proving popular in countries such as the UK and Australia where school shootings and unauthorised campus incursions are rare. For example, the Australian 'Loop-Learn' facial recognition roll-call system has been marketed amidst estimates of saving up to 2.5 hours of teacher time per week. Elsewhere, automated registration systems are also considered an effective means of overcoming problems of 'fake attendance' and 'proxies' – especially in countries such as India where fraudulent attendance is commonplace (Wagh et al., 2015).
                </p>
                <p>
                  Beyond campus-based security and tracking physical bodies, facial recognition is also being used in a number of 'virtual learning' contexts. For example, facial recognition systems are now being developed as a means of ensuring the integrity of various aspects of online courses. This includes controlling access to online educational content (Montgomery & Marais, 2014), as well as using webcam-based facial recognition to authenticate online learners (i.e., confirming that the people engaging in online learning activities are actually who they claim to be) (Valera et al., 2015). Similarly, there is a growing interest in using facial recognition technology for so-called e-assessment security – i.e., verifying the identity of students taking computer-based tests and examinations, and confirming their continued presence during the whole examination period (Apampa et al., 2010; Hernández et al., 2008).
                </p>
                <p>
                  Finally, there is a growing interest in facial detection techniques as an indicator of student 'engagement' and learning. For example, research and development in this area have reported that detecting brief 'facial actions' can prove an accurate indicator of students' (non)engagement with online learning environments – highlighting episodes of boredom, confusion, delight, flow, frustration, and surprise (Dewan et al., 2019). Particularly insightful facial actions with regards to learning are reckoned to include brow-raising, eyelid tightening, and mouth dimpling (e.g., Grafsgaard et al., 2013). Elsewhere, it is claimed that 'facial microexpression states' (facial states lasting less than half a second) correlate strongly with conceptual learning, and 'could perhaps give us a glimpse into what learners [a]re thinking' (Liaw et al., 2014). All told, there is growing interest in the face as a 'continuous and non-intrusive way of…understand[ing] certain facets of the learner's current state of mind' (Dewan et al., 2019). Indeed, much of this work originates in the area of 'emotion learning analytics' that has long sought to use facial detection to elicit signs of learning in higher education. Here, learning scientists have focused on the use of facial detection of 'academic emotions' that convey achievement (contentment, anxiety, and frustration), engagement with the learning content, social emotions, and 'epistemic' emotions arising from cognitive processing. It is argued that detecting these emotions from facial expressions can highlight problems with knowledge, stimulation, anxiety and/or frustration (see D'Mello, 2017).
                </p>
                <p>
                  These largely experimental developments have led some educationalists to enthusiastically anticipate facial learning detection being deployed on a mass scale. As Timms (2016, p. 712) reasons, it might soon be possible to gain a 'real-time' sense of which groups of students are in a 'productive state' and other instances 'where the overall activity is not productive'. The promise of customisation that characterises the development of automated learning systems encourages their incorporation into student learning interfaces, so that these can recognise and respond to individual students in real-time, monitoring their achievements as well as their affective states. As these systems augment and eventually displace teacher-centred forms of instruction, they will need to be able to 'recognise' and respond to individual students. Automated systems underwrite the promise of customisation that has long characterised the online economy, offering to reconfigure it in the form of individualised tutoring, but without the expense of human teachers.
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Separator />

      {/* Skills Assessed - Collapsible */}
      {skillsAssessed.length > 0 && (
        <Collapsible open={skillsOpen} onOpenChange={setSkillsOpen}>
          <Card className="card-elevated">
            <CollapsibleTrigger asChild>
              <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Skills Assessed
                  </span>
                  {skillsOpen ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </CardTitle>
                <CardDescription>
                  The skills this assignment evaluates
                </CardDescription>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {skillsAssessed.map((skill) => {
                    const categoryColors: Record<string, string> = {
                      reading: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                      writing: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                      "critical-thinking": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
                      "ai-literacy": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                      speaking: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                    };
                    return (
                      <Badge 
                        key={skill.id} 
                        variant="outline" 
                        className={`${categoryColors[skill.category] || ""} text-xs`}
                        title={skill.description}
                      >
                        {skill.name}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Footer */}
      <p className="text-xs text-center text-muted-foreground">
        UCLC1008 UE1 (2025-26, S2) | Pre-course Writing © 2026 Language Centre-HKBU
      </p>
    </div>
  );
};

export default PreCourseWritingPage;
