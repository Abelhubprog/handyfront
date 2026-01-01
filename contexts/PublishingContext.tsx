import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ArticleStatus = 'draft' | 'scheduled' | 'published';

export interface Block {
  id: string;
  type: 'richText' | 'image' | 'quote' | 'cta';
  content: any;
}

export interface Article {
  id: string;
  domainId: string;
  title: string;
  slug: string;
  status: ArticleStatus;
  author: string;
  publishedAt?: string;
  blocks: Block[];
  seo: {
    title: string;
    description: string;
  };
}

export interface Domain {
  id: string;
  name: string;
  hostname: string;
  icon: string;
}

interface PublishingContextType {
  domains: Domain[];
  currentDomain: Domain;
  articles: Article[];
  setDomain: (domainId: string) => void;
  getArticlesByDomain: (domainId: string) => Article[];
  saveArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
}

const PublishingContext = createContext<PublishingContextType | undefined>(undefined);

const INITIAL_DOMAINS: Domain[] = [
  { id: 'd1', name: 'HandyWriterz Main', hostname: 'handywriterz.com', icon: 'H' },
  { id: 'd2', name: 'HandyNursing', hostname: 'nursing.handywriterz.com', icon: 'N' },
  { id: 'd3', name: 'HandyLaw', hostname: 'law.handywriterz.com', icon: 'L' },
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: 'a1',
    domainId: 'd1',
    title: 'How to structure a PhD dissertation efficiently',
    slug: 'structure-phd-dissertation',
    status: 'published',
    author: 'Dr. Sarah Jenkins',
    publishedAt: '2023-10-15',
    seo: { title: 'PhD Dissertation Structure Guide', description: 'Learn the macro structure of a dissertation.' },
    blocks: [
      { id: 'b1', type: 'richText', content: 'The blank page is the enemy of the academic...' },
      { id: 'b2', type: 'quote', content: { text: "Research is formalized curiosity.", author: "Zora Neale Hurston" } }
    ]
  },
  {
    id: 'a2',
    domainId: 'd2',
    title: '5 Tips for Nursing Reflection Essays',
    slug: 'nursing-reflection-tips',
    status: 'draft',
    author: 'Nurse Mike',
    seo: { title: 'Nursing Reflection Tips', description: 'Write better reflection papers with these tips.' },
    blocks: []
  }
];

export const PublishingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [domains] = useState<Domain[]>(INITIAL_DOMAINS);
  const [currentDomain, setCurrentDomain] = useState<Domain>(INITIAL_DOMAINS[0]);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);

  const setDomain = (domainId: string) => {
    const domain = domains.find(d => d.id === domainId);
    if (domain) setCurrentDomain(domain);
  };

  const getArticlesByDomain = (domainId: string) => {
    return articles.filter(a => a.domainId === domainId);
  };

  const saveArticle = (article: Article) => {
    setArticles(prev => {
      const exists = prev.find(a => a.id === article.id);
      if (exists) {
        return prev.map(a => a.id === article.id ? article : a);
      }
      return [article, ...prev];
    });
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  return (
    <PublishingContext.Provider value={{ 
      domains, 
      currentDomain, 
      articles, 
      setDomain, 
      getArticlesByDomain, 
      saveArticle, 
      deleteArticle 
    }}>
      {children}
    </PublishingContext.Provider>
  );
};

export const usePublishing = () => {
  const context = useContext(PublishingContext);
  if (context === undefined) {
    throw new Error('usePublishing must be used within a PublishingProvider');
  }
  return context;
};