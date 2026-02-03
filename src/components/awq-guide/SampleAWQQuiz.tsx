import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { 
  FileText, BookOpen, ChevronDown, AlertCircle, CheckCircle,
  XCircle, Lightbulb, GraduationCap
} from "lucide-react";

const ARTICLE_A = {
  title: "Supporting schools to use face recognition systems: a continuance intention perspective of elementary school parents in China",
  authors: "Jon-Chao Hong, Yushun Li, Shuo-Ying Kuo, Xin An",
  year: 2022,
  abstract: `A great deal of attention has been focused on technological innovation, for example, face recognition, which has been used in some countries in various fields. Nonetheless, there has been little attention paid to parents' acceptance of the use of face recognition systems on campus. To address this gap in the literature, this study examined how different degrees of technological innovativeness and dangerous beliefs in the virtual world (DBVW) influence parents' perceived value of using and intention to continue supporting schools' use of face recognition systems. This study adopted snowball sampling to collect data through questionnaires, and received 380 valid responses from parents living in Xuzhou, China. Confirmatory factor analysis and structural equation modelling were used to analyse the data, with results indicating that: (1) DBVW was negatively related to perceived value; (2) technological innovativeness was positively related to perceived value; and (3) perceived value was positively related to continuance intention to use face recognition systems. The results suggest that parents support the use of face recognition systems in elementary schools; thus, such systems can be adopted by other elementary schools in other areas.`,
  discussion: `Although implicit and explicit attitudes are different, they can both affect behaviours, and individuals' attitude can promote the value perception before performing a behaviour (Kaiser et al., 2021). In line with this, the present study explored parents' DBVW and technological innovativeness in the value perception of the use of face-recognition systems, and continuous intention to use such systems as a research framework. The results indicate that the average score of parents' DBVW is 3.865, which is higher than the average level (3.000), indicating that the parents were worried about the disclosure of students' personal privacy, and generally had a cautious attitude towards new technologies (Perry & Sibley, 2010). The average score of parents' technological innovativeness is 3.796, which is higher than the average level (3.000), indicating that the parent respondents tended to accept new technology (Wang & Lee, 2020). The average score of parents' perceived value is 3.919, which is much higher than the neutral level (3.000), indicating that the parents generally recognize the value of face recognition systems (Kim et al., 2007). The average score of CIU is 3.776, which is higher than the neutral level (3.000), indicating that the respondents generally preferred to continue using the face recognition system at the campus entrance. On the whole, although the parent respondents thought that the face recognition system had certain risks, they were willing to try technological innovation and they thought the system was valuable, so they intended to continue using it.`,
  glossary: [
    { term: "Technological innovativeness", definition: "The degree to which an individual is willing to try new technologies." },
    { term: "Dangerous beliefs in the virtual world (DBVW)", definition: "Anxiety that individuals have about potential dangers while using technologies" },
    { term: "Perceived value", definition: "Value that users believe a technology or service has for themselves" },
    { term: "Snowball sampling", definition: "Gathering research participants where existing participants recruit future subjects from their friends" },
    { term: "Confirmatory factor analysis", definition: "A statistical technique used to test if measurements of variables fit a certain expected structure or model" },
    { term: "Structural equation modelling", definition: "A statistical method that models complex relationships among multiple variables" },
    { term: "Continuance intention", definition: "The intention to keep using a particular technology" },
    { term: "Respondents", definition: "People who answer questions in a survey or study" },
  ]
};

const ARTICLE_B = {
  title: "Facial recognition technology in schools: critical questions and concerns",
  authors: "Mark Andrejevic & Neil Selwyn",
  year: 2020,
  abstract: `Facial recognition technology is now being introduced across various aspects of public life. This includes the burgeoning integration of facial recognition and facial detection into compulsory schooling to address issues such as campus security, automated registration and student emotion detection. So far, these technologies have largely been seen as routine additions to school systems with already extensive cultures of monitoring and surveillance. While critical commentators are beginning to question the pedagogical limitations of facially driven learning, this article contends that school-based facial recognition presents a number of other social challenges and concerns that merit specific attention. This includes the likelihood of facial recognition technology altering the nature of schools and schooling along divisive, authoritarian and oppressive lines. Against this background, the article considers whether or not a valid case can ever be made for allowing this form of technology in schools.`,
  discussion: `These questions over diminished notions of pedagogy and consent are important. Yet, at this point, we would like to argue that there are a number of additional issues and concerns that cast further serious doubt upon the implementation of facial recognition technologies in schools. In brief, the following points of contention might be raised:

**The inescapable nature of school-based facial recognition**

Another point of concern is the inescapability of facial monitoring within school contexts. Unlike other forms of personal data (i.e., any piece of data connected to an individual's name), facial data lends itself to constant and permanent surveillance. In short, people are always connected to their faces. Thus, unlike social media posts or interactions with school learning management systems, there is no option for students to self-curate and restrict what data they 'share'. While students might be able to opt-out from facial detection elements of their school's learning systems (for example, the use of eye-tracking or facial thermal imaging for learning analytics), there is no right to decline to participate in 'non-cooperative' facial recognition systems (indeed, any opt-out effectively renders campus facial recognition systems ineffective). While such coercion applies to the use of facial recognition in all public spaces, it is especially acute in schools. For example, most schools enforce dress codes that preclude students' faces being covered by hair, hoods or other obtrusions. This makes it difficult for students to obscure their faces from surveillance cameras. This also raises the inadequacy of any promise of 'informed consent' regarding school facial recognition systems. The systems being deployed in schools for security and attendance purposes rely on complete sweeps of classrooms and corridors in order to operate. This renders 'opt-in' and 'opt-out' approaches counter-productive from the point of view of the system provider. Even if opt-out protocols are in place, the system has to scan a student's face before it can recognise that they have opted out.`,
  glossary: [
    { term: "Burgeoning", definition: "Growing or increasing quickly" },
    { term: "Compulsory", definition: "Required by law or rules" },
    { term: "Surveillance", definition: "Careful watching for security" },
    { term: "Pedagogical", definition: "Teaching methods" },
    { term: "Facially driven", definition: "Controlled by facial features" },
    { term: "Divisive", definition: "Causing disagreement or split" },
    { term: "Authoritarian", definition: "Strict, controlling power" },
    { term: "Consent", definition: "Permission or agreement" },
    { term: "Contention", definition: "Disagreements or arguments" },
    { term: "Inescapability", definition: "Impossible to avoid" },
    { term: "Opt-out", definition: "Choosing not to participate" },
    { term: "Coercion", definition: "Forcing by threat or pressure" },
    { term: "Obtrusions", definition: "Things blocking view" },
    { term: "Informed consent", definition: "Agreement with full knowledge" },
    { term: "Opt-in", definition: "Choosing to participate" },
    { term: "Protocols", definition: "Official rules or procedures" },
  ]
};

const SAMPLE_A = {
  text: `Facial recognition technology (FRT) is increasingly incorporated in schools, aiming to improve functions like security. This summary reports key arguments for and against the adoption of FRT in schools, from the perspectives of parents' perceptions on the technology and privacy concerns about students.

The debate surrounding facial recognition in schools is fundamentally a conflict over its potential benefits brought to schools in the areas of safety versus its potential to infringe upon privacy and normalise surveillance (Andrejevic & Selwyn, 2020; Hong et al., 2022). On one hand, scholars like Hong et al. (2022) point out that, despite awareness of privacy issues, parents still support the continued use of FRT in schools as they prioritise its practical value and innovative features over potential risks. Conversely, others like Andrejevic and Selwyn (2020) caution that the same technology poses serious social and ethical risks by potentially shifting schools toward authoritarian environments. They contend that it creates constant, inescapable surveillance that students cannot avoid, violating students' consent. This makes a loss of privacy seem normal and can lead to pressure and control.

While facial recognition is perceived as worthwhile by certain stakeholders, concerns about surveillance without students' consent highlight its controversial nature in educational settings.`,
  wordCount: 201,
  grade: "A-",
  strengths: [
    "Effective synthesis in topic sentence",
    "Accurate citations",
    "Precise summaries of both excerpts",
    "Rewording in student's own voice"
  ]
};

const SAMPLE_B = {
  text: `Facial recognition technology is used more and more in schools all over the world. It helps with things like school security and checking students in automatically. In China, parents have different opinions about this technology. Some support it, but others worry about its effects. These articles talk about facial recognition in schools and show some of the good and bad sides of it (Hong et al., 2022; Andrejevic & Selwyn, 2020).

Article A says that many parents support facial recognition technology in elementary schools because they think it is useful and trustworthy. According to the research findings, the average score of parents' perceived value is 3.919, which is much higher than the neutral level (3.000). The study shows parents gave high scores for how much value they see in the system and want to keep using it. Even though some parents worry about privacy, they still accept the technology, maybe because they believe it will make schools safer or easier to manage (Hong et al., 2022).

Article B says facial recognition is bad because there is no option for students to self-curate and restrict what data they share. Students don't have freedom to choose to opt out. Maybe students don't care, or it is not a big problem. The technology might just help schools be more organized (Andrejevic & Selwyn).

So, I think that Article A says parents like facial recognition because of its value, but Article B warns about problems and control, showing it is a debated issue (Hong et al., 2022; Andrejevic & Selwyn, 2020).`,
  wordCount: 257,
  grade: "C+",
  weaknesses: [
    "Vague thesis statement",
    "Missing synthesis between articles",
    "Unnecessary details included",
    "Frequent use of informal phrasing",
    "Incorrect citation formatting"
  ]
};

const RUBRIC = [
  { criterion: "Summary Accuracy", weight: "20%", a: "All main ideas; no personal bias; no distortion", b: "Most main ideas; no personal views; minor inaccuracies only", c: "Omits multiple main ideas; may include personal views; some distortion", d: "Significant omissions; misinterprets; may fabricate" },
  { criterion: "Synthesis", weight: "20%", a: "Effectively integrates both excerpts; clear comparison/contrast", b: "Integrates both with minor gaps; basic comparison/contrast", c: "Attempts integration but weak; may focus on one excerpt", d: "Little connection; ideas listed without analysis" },
  { criterion: "Paraphrasing", weight: "20%", a: "Fully own words; no copying; accurate meaning", b: "Mostly own phrasing; meaning generally correct", c: "Relies on source phrasing; may distort", d: "Direct copying; meaning may be lost" },
  { criterion: "Academic Tone & Clarity", weight: "20%", a: "Formal tone; clear thesis; effective topic sentences; relevant conclusion", b: "Thesis present but imprecise; topic sentences clear but may lack development", c: "Informal lapses; thesis vague; weak topic sentences", d: "Missing/incoherent thesis; absent or weak conclusion" },
  { criterion: "In-text Citations", weight: "20%", a: "Correct APA format throughout; balanced citation use", b: "Minor format errors; slightly uneven citation", c: "Multiple format errors; over/under-citation", d: "Major errors; missing citations" },
];

export function SampleAWQQuiz() {
  const [articlesOpen, setArticlesOpen] = useState(false);
  const [samplesOpen, setSamplesOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Sample Academic Writing Quiz (AWQ)
          </CardTitle>
          <CardDescription>UCLC1008 University English I (2025-2026, S1)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <h4 className="font-semibold">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Read the excerpts of TWO academic journal articles (Articles A and B) below.</li>
              <li><strong>Task:</strong> Summarise, paraphrase and synthesise the main claims in <strong>no more than 300 words</strong>. Do NOT include your own views.</li>
              <li>Use <strong>APA in-text citations (7th edition)</strong>. Do NOT cite the abstract.</li>
              <li>Write in paragraph form: Introduction → Body → Conclusion</li>
              <li>No AI tools allowed during the actual test.</li>
            </ol>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg text-sm">
            <h4 className="font-semibold text-blue-800 mb-2">Citation Examples:</h4>
            <ul className="space-y-1 text-blue-700">
              <li><strong>Author-prominent:</strong> Hong et al. (2022) report that...</li>
              <li><strong>Signal-phrase:</strong> According to Andrejevic and Selwyn (2020), ...</li>
              <li><strong>Information-prominent:</strong> FRT is widely adopted (Andrejevic & Selwyn, 2020).</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Articles */}
      <Collapsible open={articlesOpen} onOpenChange={setArticlesOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Article Excerpts
                </CardTitle>
                <ChevronDown className={`h-4 w-4 transition-transform ${articlesOpen ? "rotate-180" : ""}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <Tabs defaultValue="article-a">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="article-a">Article A</TabsTrigger>
                  <TabsTrigger value="article-b">Article B</TabsTrigger>
                </TabsList>
                
                <TabsContent value="article-a" className="space-y-4 mt-4">
                  <div>
                    <h4 className="font-semibold text-sm">{ARTICLE_A.title}</h4>
                    <p className="text-xs text-muted-foreground">{ARTICLE_A.authors} ({ARTICLE_A.year})</p>
                  </div>
                  
                  <div className="bg-amber-50 p-3 rounded text-sm">
                    <h5 className="font-semibold text-amber-800 mb-1">Abstract (Do NOT cite)</h5>
                    <p className="text-amber-900 text-xs">{ARTICLE_A.abstract}</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded text-sm">
                    <h5 className="font-semibold text-green-800 mb-1">Discussion (Cite this)</h5>
                    <p className="text-green-900 text-xs whitespace-pre-wrap">{ARTICLE_A.discussion}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-sm mb-2">Glossary</h5>
                    <div className="grid gap-1 text-xs">
                      {ARTICLE_A.glossary.map((item, idx) => (
                        <div key={idx} className="bg-muted p-2 rounded">
                          <strong>{item.term}:</strong> {item.definition}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="article-b" className="space-y-4 mt-4">
                  <div>
                    <h4 className="font-semibold text-sm">{ARTICLE_B.title}</h4>
                    <p className="text-xs text-muted-foreground">{ARTICLE_B.authors} ({ARTICLE_B.year})</p>
                  </div>
                  
                  <div className="bg-amber-50 p-3 rounded text-sm">
                    <h5 className="font-semibold text-amber-800 mb-1">Abstract (Do NOT cite)</h5>
                    <p className="text-amber-900 text-xs">{ARTICLE_B.abstract}</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded text-sm">
                    <h5 className="font-semibold text-green-800 mb-1">Discussion (Cite this)</h5>
                    <p className="text-green-900 text-xs whitespace-pre-wrap">{ARTICLE_B.discussion}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-sm mb-2">Glossary</h5>
                    <div className="grid gap-1 text-xs">
                      {ARTICLE_B.glossary.map((item, idx) => (
                        <div key={idx} className="bg-muted p-2 rounded">
                          <strong>{item.term}:</strong> {item.definition}
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Sample Scripts */}
      <Collapsible open={samplesOpen} onOpenChange={setSamplesOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Sample Scripts for Evaluation
                </CardTitle>
                <ChevronDown className={`h-4 w-4 transition-transform ${samplesOpen ? "rotate-180" : ""}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent>
              <Tabs defaultValue="sample-a">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="sample-a" className="text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Student A ({SAMPLE_A.grade})
                  </TabsTrigger>
                  <TabsTrigger value="sample-b" className="text-amber-700">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Student B ({SAMPLE_B.grade})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="sample-a" className="space-y-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-700">{SAMPLE_A.grade}</Badge>
                    <Badge variant="outline">{SAMPLE_A.wordCount} words</Badge>
                  </div>
                  
                  <div className="bg-muted p-4 rounded text-sm whitespace-pre-wrap">
                    {SAMPLE_A.text}
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded">
                    <h5 className="font-semibold text-green-800 text-sm mb-2 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Strengths
                    </h5>
                    <ul className="list-disc list-inside text-xs text-green-700 space-y-1">
                      {SAMPLE_A.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="sample-b" className="space-y-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-100 text-amber-700">{SAMPLE_B.grade}</Badge>
                    <Badge variant="outline">{SAMPLE_B.wordCount} words</Badge>
                  </div>
                  
                  <div className="bg-muted p-4 rounded text-sm whitespace-pre-wrap">
                    {SAMPLE_B.text}
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded">
                    <h5 className="font-semibold text-red-800 text-sm mb-2 flex items-center gap-1">
                      <XCircle className="h-4 w-4" />
                      Areas for Improvement
                    </h5>
                    <ul className="list-disc list-inside text-xs text-red-700 space-y-1">
                      {SAMPLE_B.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Rubric */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Rubric for Academic Writing Quiz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Criterion</TableHead>
                  <TableHead className="w-[50px]">Weight</TableHead>
                  <TableHead className="text-green-700">A/A-</TableHead>
                  <TableHead className="text-blue-700">B+/B/B-</TableHead>
                  <TableHead className="text-amber-700">C+/C/C-</TableHead>
                  <TableHead className="text-red-700">D or below</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RUBRIC.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-medium text-xs">{row.criterion}</TableCell>
                    <TableCell className="text-xs">{row.weight}</TableCell>
                    <TableCell className="text-xs text-green-700">{row.a}</TableCell>
                    <TableCell className="text-xs text-blue-700">{row.b}</TableCell>
                    <TableCell className="text-xs text-amber-700">{row.c}</TableCell>
                    <TableCell className="text-xs text-red-700">{row.d}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
