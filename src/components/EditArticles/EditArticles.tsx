import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EditArticles.scss';
import { Article } from '../../models/articles';
import { Outlet, useNavigate } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../myStore';
import { useFormik } from 'formik';
import {ArticleFormValues}from '../../models/articles'
import { setMessage } from '../../redux/messageSlice';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';


const UditArticle: React.FC = () => {
  
const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id; 

const dispatch = useDispatch();

 const [initialArticleData, setInitialArticleData] = useState<Article | null>(null);

  const ArticleFromStore = useSelector((state: RootState) => state.articles.selectedArticle);
 const navigate = useNavigate();
  useEffect(() => {
    if (!ArticleFromStore?.id) return;

    axios.get(`http://localhost:3001/articles/${ArticleFromStore.id}`)
      .then(res => setInitialArticleData(res.data))
      .catch(err => console.error('שגיאה בטעינת המשתמש:', err));
  }, [ArticleFromStore?.id]);

  const defaultArticle: Article ={
  title:'',
  subtitle:'',
  content:'',
  category:'',
  image:'',
  authorName:'',
  datePublished:'',
  id:'',
    views: 0 ,

  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialArticleData || defaultArticle,
    // validationSchema,
    onSubmit: async (values) => {
      try {
        const updatedArticles:Article = {
          ...values,
      // authorId: userId||'',
      authorName: user?.name||'',
      datePublished: new Date().toISOString(), // תאריך אוטומטי
      id:initialArticleData?.id||'',
        };

        await axios.put(`http://localhost:3001/articles/${updatedArticles?.id}`, updatedArticles);
        dispatch(setMessage({ text: 'הפרטים עודכנו בהצלחה!', type: 'success' }));

        setInitialArticleData(updatedArticles);
        navigate('/')
      } catch (err) {
        console.error('שגיאה בעדכון:', err);
        dispatch(setMessage({ text: 'אירעה שגיאה בעדכון', type: 'error' }));

      }
    }
  });

const handleCancel = () => {
  if (initialArticleData) {
    formik.setValues({
      title: initialArticleData.title,
      subtitle: initialArticleData.subtitle,
      content: initialArticleData.content,
      category: initialArticleData.category,
      image: initialArticleData.image,
      authorName: initialArticleData.authorName,
      id: initialArticleData.id,
      datePublished: initialArticleData.datePublished,
      views: initialArticleData.views
    });
  }
};



  return (
     <div className="udit-article">
      <div className="udit-article-container">
        {/* <h2>הפרטים שלי</h2> */}
        <form onSubmit={formik.handleSubmit}>
          <input
            id="title"
            name="title"
            type="text"
  
            placeholder="Enter title Address"
            onChange={formik.handleChange}
            value={formik.values.title}
          />
          {formik.errors.title && <div className="error">{formik.errors.title}</div>}

          <input
            id="subtitle"
            name="subtitle"
            type="text"
            placeholder="Enter subtitle"
            onChange={formik.handleChange}
            value={formik.values.subtitle}
          />
          {formik.errors.subtitle && <div className="error">{formik.errors.subtitle}</div>}

          <input
            id="content"
            name="content"
            type="text"
            placeholder="Enter content"
            onChange={formik.handleChange}
            value={formik.values.content}
          />
          {formik.errors.content && <div className="error">{formik.errors.content}</div>}

            <input
              id="category"
              name="category"
              // type={showPassword ? "text" : "password"}
              placeholder="Enter category"
              onChange={formik.handleChange}
              value={formik.values.category}
            />
 
          {formik.errors.category && <div className="error">{formik.errors.category}</div>}
 <input
              id="image"
              name="image"
              // type={showPassword ? "text" : "password"}
              placeholder="Enter image"
              onChange={formik.handleChange}
              value={formik.values.image}
            />
 
          {formik.errors.image && <div className="error">{formik.errors.image}</div>}
          <div className="form-buttons">
            {/* <button type="submit" className="submit-button">שמור</button> */}
            {/* <button type="button" className="cancel-button" onClick={handleCancel}>ביטול שינויים</button> */}
           <Tooltip title="שמור">
             <IconButton type="submit" color="primary">
               <SaveIcon />
             </IconButton>
           </Tooltip>
         
           <Tooltip title="ביטול שינויים">
             <IconButton type="button" color="error" onClick={handleCancel}>
               <CancelIcon />
             </IconButton>
           </Tooltip>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UditArticle;
