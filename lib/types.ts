export interface SearchParams {
  q?: string
  category?: string
  tag?: string
}

export interface Post {
  id: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  date: string
  readingTime: string
  tags: string[]
  author: {
    name: string
    avatar: string
  }
}
