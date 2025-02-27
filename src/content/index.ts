interface Content {
  resume: string;
  projects: {
    [key: string]: {
      title: string;
      description: string;
      images: string[];
    };
  };
}

export const content: Content = {
  resume: `
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

- Next.js
- GraphQL BFF

---

### Full Stack Developer
*Spark Sport, Auckland, New Zealand*  
**Jul 2022 - Feb 2023**

- Develop features with ReactJS/Redux/TypeScript for web streaming app
- Maintain and develop features for Chromecast receiver app
- Develop home landing page with Next.js and TypeScript
- Involve in streaming experience improvements (CMAF migration, DVR window shifting, etc.)

---

### Full Stack Developer
*MediaWorks, Auckland, New Zealand*  
**Oct 2021 - Jun 2022**

- Create new components for Adobe Experience Manager for radio website enhancement
- Develop and implement radio stations voting and countdown services widgets with HTML, CSS, JavaScript and Node.js
- Write REST API for web services
- Create and deploy two internal tools to make the end-to-end creation of the website widgets automated. Reduce 90% of the Business-as-usual time

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

`,

  projects: {
    project1: {
      title: 'Project 1',
      description: `
# Project Name
## Overview
This project...
      `,
      images: [
        '/projects/project1/image1.png',
        '/projects/project1/image2.png',
      ],
    },
    // ... other projects
  },
};
