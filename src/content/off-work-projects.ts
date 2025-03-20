import { DEFAULT_IMAGE_WIDTH, DEFAULT_IMAGE_HEIGHT } from '@/constants';

import type { Project } from './projects';

const skyWatcherStartAdventureAdapter: Project = {
  title: '3D printed Adapter',
  pages: [
    {
      pageNumber: 0,
      type: 'description',
      details: `# SkyWatcher Start Adventure 3D printed Adapter
      
- **Purpose**: Solves a common pain point in astrophotography by keeping the polar illuminator in place during observation, preventing misalignment.  
- **Design**: Streamlines polar alignment, improving accuracy and workflow for capturing long-exposure night sky images.  
- **Impact**: Sold around **100 units**.  
- **Innovation**: Combines 3D printing and design to create a simple yet effective solution for stargazers.  
      `,
    },
    {
      pageNumber: 1,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_WIDTH}/v1742007049/macintosh-portfolio/adapter-1_z2gbo5.png`,
    },
    {
      pageNumber: 2,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_WIDTH}/v1742007048/macintosh-portfolio/adapte-2_ztac4r.png`,
    },
    {
      pageNumber: 3,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_WIDTH}/v1742007049/macintosh-portfolio/adapter-3_qobfn3.jpg`,
    },
  ],
  oneLiner: '3D printed adapter for SkyWatcher Start Adventure',
  subContent: [
    'Page 1: The 3d printed adapter.',
    'Page 2: The adapter on the SkyWatcher Start Adventure.',
    'Page 3: Photo of M31 - Andromeda Galaxy',
  ],
};

const woodworks: Project = {
  title: 'Woodworks',
  pages: [
    {
      pageNumber: 0,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_WIDTH}/v1742008713/macintosh-portfolio/woodwork-1_wdcxn7.jpg`,
    },
    {
      pageNumber: 1,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_HEIGHT}/v1742008713/macintosh-portfolio/woodwork-2_gipydq.jpg`,
    },
    {
      pageNumber: 2,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_HEIGHT}/v1742008713/macintosh-portfolio/woodwork-3_ukcijc.jpg`,
    },
    {
      pageNumber: 3,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_HEIGHT}/v1742008712/macintosh-portfolio/woodwork-4_ogiwwz.jpg`,
    },
    {
      pageNumber: 4,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_HEIGHT}/v1742008712/macintosh-portfolio/woodwork-5_oldtre.jpg`,
    },
    {
      pageNumber: 5,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_HEIGHT}/v1742018427/macintosh-portfolio/woodwork-6_midt2m.jpg`,
    },
  ],
  oneLiner: 'Woodworks',
  subContent: [
    'Page 1: Big Dining Table',
    'Page 2: Customized Tech Cabinet with Rattan Weave',
    'Page 3: Customized Shoe Rack + Bench + Coat Hanger',
    'Page 4 and 5: Frames + Decorative Lighting',
    "Page 6: The famous Whistler's Mother - Mr.Bean version",
  ],
};

const legoHplcFragmentCollector: Project = {
  title: 'Lego HPLC Fragment Collector',
  pages: [
    {
      pageNumber: 0,
      type: 'description',
      details: `# Lego HPLC Fragment Collector
- Implemented the concept of using Lego Mindstorms to create an affordable HPLC (High-Performance Liquid Chromatography) fraction collector.  
- Provides a cost-effective alternative to traditional fraction collectors, making them more accessible for smaller labs and educational purposes.  
- Designed and built the frame using woodworking skills for a sturdy and customizable structure.  
- Implemented a low-code platform to develop the collection logic, automating the fraction collection process.  
- Capable of accurately collecting fractions into a well plate.  
- Demonstrates an innovative approach to accessible lab automation by combining hardware prototyping with software automation.  
      `,
    },
    {
      pageNumber: 1,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${DEFAULT_IMAGE_WIDTH}/v1742011209/macintosh-portfolio/Lego-1_jkkyvg.jpg`,
    },
    {
      pageNumber: 2,
      type: 'video',
      details: `https://www.youtube.com/embed/y1GQ3aLV3M4?si=7ah9HKEEDvCMxG7X`,
    },
    {
      pageNumber: 3,
      type: 'video',
      details: `https://www.youtube.com/embed/9etXPa5y8S4?si=_yrT1BJ5ZiPrxpA7`,
    },
  ],
  oneLiner: 'Lego HPLC Fragment Collector',
  subContent: [
    'Page 2: Lego HPLC Fragment Collector Photo',
    'Page 3 and 4: Lego HPLC Fragment Collector Demo Video',
  ],
};

export const offWorkProjects = {
  'skywatcher-start-adventure-adapter': skyWatcherStartAdventureAdapter,
  woodworks: woodworks,
  'lego-hplc-fragment-collector': legoHplcFragmentCollector,
};
