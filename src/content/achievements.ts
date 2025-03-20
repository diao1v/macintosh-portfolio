import type { Project } from './projects';

const ICON_WIDTH = 'w_300';

const blackMythWukong: Project = {
  title: 'BLACK MYTH: WUKONG',
  pages: [
    {
      pageNumber: 0,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${ICON_WIDTH}/v1742463867/macintosh-portfolio/achieve-bmw1_tgyk5l.jpg`,
      makeImageSpin: true,
    },
  ],
  oneLiner: 'BLACK MYTH: WUKONG',
  subContent: [
    'BLACK MYTH: WUKONG: Final Fulfillment (81 of 81)',
    'Achievement Date: 16 Nov, 2024 @ 3:03am',
  ],
};

const lakeTaupoCycleChallenge: Project = {
  title: 'Lake Taupo Cycle Challenge',
  pages: [
    {
      pageNumber: 0,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${ICON_WIDTH}/v1742463867/macintosh-portfolio/achieve-ltc1_rprvnq.png`,
      makeImageSpin: true,
    },
  ],
  oneLiner: 'Lake Taupo Cycle Challenge',
  subContent: [
    'Lake Taupo Cycle Challenge: 160km in 7:30:17',
    'Achievement Date: 30 Nov, 2024 @ 13:56:09',
  ],
};

const awsSaa: Project = {
  title: 'AWS Solutions Architect Associate',
  pages: [
    {
      pageNumber: 0,
      type: 'photo',
      details: `https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,${ICON_WIDTH}/v1742463867/macintosh-portfolio/achieve-saa1_nav8sy.png`,
      makeImageSpin: true,
    },
  ],
  oneLiner: 'AWS Solutions Architect Associate',
  subContent: [
    'AWS Solutions Architect Associate: Certified',
    'Achievement Date: 27 Aug, 2024',
  ],
};

export const achievements = {
  'black-myth-wukong': blackMythWukong,
  'lake-taupo-cycle-changellenge:': lakeTaupoCycleChallenge,
  'aws-saa': awsSaa,
};
