export type Dump = {
  id: string;
  title: string;
  date: string;
  photos: string;
  people: string;
  image: string;
  live?: boolean;
  host?: boolean;
};

const COVER =
  'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1200&q=85&sat=-100';

export const ACTIVE_DUMPS: Dump[] = [
  {
    id: 'no-sleep',
    title: 'NO SLEEP\nTILL MONDAY',
    date: '24 SEP 2026',
    photos: '186 PHOTOS',
    people: '31 PEOPLE',
    image: COVER,
    live: true,
    host: true,
  },
  {
    id: 'rooftop',
    title: 'ROOFTOP\nSEASON',
    date: '11 JUL 2026',
    photos: '94 PHOTOS',
    people: '18 PEOPLE',
    image:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85&sat=-100',
    live: true,
  },
];

export const ARCHIVED_DUMPS: Dump[] = [
  {
    id: 'nye',
    title: 'NYE.\nNO CONTEXT',
    date: '01 JAN 2026',
    photos: '122 PHOTOS',
    people: '24 PEOPLE',
    image:
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=85&sat=-100',
  },
];
