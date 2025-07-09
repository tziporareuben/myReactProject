// ✨ הוספת טיפוס לשדות של הטופס
export interface ArticleFormValues {
  title: string;
  subtitle: string; 
  content: string;
  category: string;
  image: string;
}


export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image: string;
  category: string;
  authorName: string;
  datePublished: string;
  views:number
}

export interface Articles {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  datePublished: string;
  authorName: string;
}