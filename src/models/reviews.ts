export {};
export interface ReviewsFormValues {
articleId:number;
userId:number;
comment:string;
date:string;
name:string;
}
// export interface ReviewFormInput {
//   name: string;
//   comment: string;
// }



export interface ReviewFormInput {
  name: string;
  comment: string;
  userId?: string;
  articleId?: string;
  datePublished?: string;
}

export interface Review extends ReviewFormInput {
  id: string; // שנוסף על ידי json-server
}
