import { LibraryEntry } from '../types/panels';

export const LIBRARIES: LibraryEntry[] = [
  {
    id: 'flowchart-basics',
    name: 'Flowchart Basics',
    description: 'Core shapes for rapid process mapping.',
    license: 'MIT',
    sourceType: 'builtin',
    itemCount: 42,
    enabled: true,
    attributionUrl: 'https://excalidraw.com/libraries',
  },
  {
    id: 'sticky-notes',
    name: 'Stickies & Callouts',
    description: 'Colorful sticky notes and callouts for ideation.',
    license: 'MIT',
    sourceType: 'builtin',
    itemCount: 28,
    enabled: true,
    attributionUrl: 'https://excalidraw.com/libraries',
  },
  {
    id: 'simple-uml',
    name: 'Simple UML',
    description: 'Lightweight UML components for diagrams.',
    license: 'MIT',
    sourceType: 'builtin',
    itemCount: 35,
    enabled: false,
    attributionUrl: 'https://excalidraw.com/libraries',
  },
  {
    id: 'generic-icons',
    name: 'Generic Icons',
    description: 'Utility icons for quick annotations and flows.',
    license: 'MIT',
    sourceType: 'builtin',
    itemCount: 56,
    enabled: false,
    attributionUrl: 'https://excalidraw.com/libraries',
  },
];

export const toggleLibrary = (libraries: LibraryEntry[], id: string): LibraryEntry[] =>
  libraries.map((library) =>
    library.id === id ? { ...library, enabled: !library.enabled } : library
  );
