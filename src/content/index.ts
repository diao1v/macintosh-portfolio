interface Content {
  resume: string;
  projects: {
    [key: string]: {
      title: string;
      description: string;
      images: string[];
      oneLiner: string;
      links: {
        github?: string;
        demo?: string;
      };
    };
  };
}

export const content: Content = {
  resume: `# John Doe
Frontend Developer

## Experience
- Senior Frontend Developer at Tech Co (2020-Present)
- Frontend Developer at Startup Inc (2018-2020)

## Skills
- React, TypeScript, JavaScript
- CSS, Tailwind, Styled Components
- Node.js, Express
`,
  projects: {
    macosPortfolio: {
      title: 'Mac OS Portfolio',
      description: `
# Mac OS Portfolio

This project is a recreation of the classic Mac OS interface as a portfolio website.

## Technologies Used
- React
- TypeScript
- Tailwind CSS
- Zustand for state management

## Features
- Classic Mac OS look and feel
- Window management system
- File browser
- Markdown text viewer
- Scrapbook for project showcase
      `,
      images: [
        '/projects/macos-portfolio/screenshot1.png',
        '/projects/macos-portfolio/screenshot2.png',
      ],
      oneLiner: 'A Mac OS portfolio website',
      links: {
        github: 'https://github.com/yourusername/macos-portfolio',
        demo: 'https://macos-portfolio.yourdomain.com',
      },
    },
    // Add more projects here
  },
};
