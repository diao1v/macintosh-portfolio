export const resume = `
# Yiwei Diao

## Personal Details
- Auckland, New Zealand
- tuicaodanad@gmail.com

> Daily life enthusiast and fullstack developer passionate about creating stuffs (Webapp, Woodwork, Photos, LEGO, PC, etc.).

---

## Professional Experience

### Web Developer
*Spark, Auckland, New Zealand*  
**Feb 2023 - Present**

- Modernized the MySpark billing portal with Next.js and GraphQL, delivering a streamlined and user-friendly bill management experience for all Spark users.
- Led the Universal Login Application (ULA) integration for MySpark Business, enhancing security with MFA and achieving DIA compliance.
- Maintained and enhanced ULA for Spark, Skinny, and XtraMail, ensuring consistent and reliable cross-brand login experiences.
- Designed REST APIs for MySpark Business notification systems and ULA integration, including new endpoints and updates to existing services.
- Expanded the Spark Design System by creating reusable React components with Storybook, enhancing UI consistency across projects.
- Upgraded the legacy MySpark Business portal with Web Components, enhancing usability while maintaining security protocols.
- Integrated Adobe Analytics into key user journeys to enable actionable insights and improve feature adoption.

---

### Full Stack Developer
*Spark Sport, Auckland, New Zealand*  
**Jul 2022 - Feb 2023**

- Solved a long-standing problem in the streaming platform using scientific methodology. Create own platform to reproduce the issue and narrow down the potential causes.
- Developed features with React, Redux and TypeScript for web streaming app.
- Maintained and developed features, monitor and handle error for Chromecast receiver app.
- Involved in new home page development with Next.js and TypeScript. Performance and SEO improvement.
- Involved in the improvement of the streaming experience (CMAF migration, DVR window shifting, etc.).
- Involved in API design using serverless functions (AWS Lambda).
- Actively involved in agile development practices, reporting and tracking the sprint progress.

---

### Full Stack Developer
*MediaWorks, Auckland, New Zealand*  
**Oct 2021 - Jun 2022**

- Developed radio website enhancements by creating Adobe Experience Manager components with Java and JavaScript. 
- Built and deployed over 10 radio station widgets (voting, countdowns) using HTML, CSS, JavaScript, and Node.js. 
- Authored REST APIs for web services, improving integration and performance.
- Created and deployed two internal tools with React, TypeScript, and Node.js to automate website widget creation, reducing BAU time by 90%.

---

### Research Technician
*University of Auckland, New Zealand*  
**Feb 2018 - Oct 2021**

- Academic literature research
- Conduct and assist with a wide range of experiments using fungi and pathogenic bacteria at PC2
- Carry out liquid chromatography-mass spectrometry (LC–MS) analysis for active fungi culture
- Develop pipelines for data analysis and data visualisation
- Developed new analytical procedures and authored Standard Operating Procedures for new systems

---

### Molecular Scientist
*Pace Analytical Energy Services LLC, Pittsburgh, PA, USA*  
**Apr 2015 - Nov 2017**

- Carried out and managed laboratory testing plans and procedures, and maintained accurate logbooks of all procedures
- Operated, maintained, calibrated and debugged laboratory equipment and software systems
- Independent responsible for lab equipment and supply purchasing
- Ensured the laboratory was effectively sanitised and correct level of stock maintained

---

### Research Assistant
*University of Oklahoma, USA*  
**Aug 2011 - Oct 2014**

- Participated in the full lifecycle of data collection, experimental design, analysis and reporting
- Prepared and wrote research papers
- Provided training to new laboratory staff

---

## Education

### Postgraduate Certificate in Information Technology
*University of Auckland, New Zealand*  
**2021** | GPA 9/9

### Master of Science in Microbiology
*University of Oklahoma, USA*  
**2014** | GPA 8.48/9

### Bachelor of Engineering in Light Industry Biotechnology
*Sichuan University, China*  
**2011**

---

## Certifications

### AWS Certified Solutions Architect - Associate
Issued Aug 2024 · Expires Aug 2027


![MyPhoto](https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_150/v1743731940/macintosh-portfolio/B6F3C5AB-8607-4DF7-AE63-C2CE97020DD1_jznefq.jpg) 
`;

export const aboutMe = `\`\`\`java
public class AboutMe {
        static Person i = new Person("Yiwei");
        static List<Skill> currentSkills = Arrays.asList(
                Java, HTML, CSS, JavaScript, Node.js,            
                TypeScript, React.js, Next.js, styled-components, 
                Tailwind CSS, GraphQL, Jest, Playwright, PostgreSQL, 
                MongoDB, REST APIs, Aws, Azure
        );
        
        public static void main(String args[]) {
                LifelongThread lifelong = new LifelongThread();
                lifelong.start();
                
                SkillThread currentThread1 = new SkillThread(targetLevel);
                currentThread1.start();
        }
        
        class LifelongThread extends Thread {	
                public void run() {
                while(i.isAlive()) {
                        int currentAchievement = i.getAchieved();
                        int currentExpectation = i.getExpected();
                        if(currentAchievement >= currentExpectation) {
                                int newExpectation = currentExpectation + currentExpectation * 0.618;
                                i.setExpected(newExpectation);
                        } else {
                                int currenAnxiety = i.getAnxiety();
                                int newAnxiety = currenAnxiety + currenAnxiety * 0.618;
                                i.setAnxiety(newAnxiety);
                        }
                        }
                }
        }

        class SkillThread extends Thread {
                public void run() {
                        while(!(i.getCurrentLevel() instanceof Expert)) {
                                Skill newSkill = Learn.getNextSkill();
                                Learn.learn(newSkill);
                                try {					
                                        Learn.applySkillInProject(newSkill);
                                } catch (PracticeFailException e) {
                                        System.out.print("Caught PracticeFailException: " + e.getMessage());
                                        System.out.print("Need to continue learning");
                                        Learn.learn(newSkill);
                                        Learn.applySkillInProject(newSkill);
                                }
                                currentSkills.add(newSkill);
                        }		
                }
        }
}
\`\`\``;
