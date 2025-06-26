export interface Topic {
  id: string;
  name: string;
  shortDescription: string;
  color: string;
  position: [number, number, number];
}

export const topics: Topic[] = [
  {
    id: 'ai',
    name: 'AI & Transhumanism',
    shortDescription: 'From self-replicating AI to brain-computer interfaces.',
    color: '#007bff',
    position: [2.5, 0.5, 0],
  },
  {
    id: 'synthetic-bio',
    name: 'Synthetic Biology',
    shortDescription: 'Gene editing, biohacking, and new life forms.',
    color: '#28a745',
    position: [-1.5, 1.5, -1],
  },
  {
    id: 'longevity',
    name: 'Longevity Science',
    shortDescription: 'The race to reverse aging and extend healthy life.',
    color: '#ffc107',
    position: [0, -1.8, 1.5],
  },
  {
    id: 'neurotech',
    name: 'Neurotechnology',
    shortDescription: 'Brain-machine interfaces and cognitive enhancement.',
    color: '#dc3545',
    position: [1.5, 1.0, -2],
  },
  {
    id: 'digital-twins',
    name: 'Digital Twins & Personalized Medicine',
    shortDescription: 'Virtual models for health and optimization.',
    color: '#17a2b8',
    position: [-2, -0.5, 0.5],
  },
  {
    id: 'ethics',
    name: 'Ethics & Society',
    shortDescription: 'The moral frontiers of radical human augmentation.',
    color: '#6f42c1',
    position: [0.5, -0.8, -2.2],
  },
];
