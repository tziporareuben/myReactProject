

import React from 'react';
import './AddArticles.scss';
import { useFormik } from 'formik';
import axios from 'axios';
import {ArticleFormValues}from '../../models/articles'
import { useSelector } from 'react-redux';
import { RootState } from '../../myStore';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../redux/messageSlice';



const AddArticles: React.FC = () => {
const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?.id;  
   const navigate = useNavigate();
 
const dispatch = useDispatch();


  const mySubmit = async (values:ArticleFormValues) => {
    const articleToSend = {
      ...values,
      authorId: userId,
      authorName: user?.name,
      datePublished: new Date().toISOString(), 
       views: 0

    };

    try {
      await axios.post('http://localhost:3001/articles', articleToSend);
      dispatch(setMessage({ text: ' הכתבה נוספה בהצלחה!!', type: 'success' }));

      navigate('/');
    } catch (error) {
      console.error('שגיאה בהוספת כתבה:', error);
            dispatch(setMessage({ text: 'אירעה שגיאה' , type: 'error' }));

    }
  };

  const formik = useFormik<ArticleFormValues>({
    initialValues: {
      title: '',
        subtitle: '', 
      content: '',
      category: 'חדשות',
      image: '',
    },
    onSubmit: mySubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="article-form">
      <h2>הוספת כתבה</h2>

      <div className="form-group">
        <label>שם העורך:</label>
        <p className="readonly">{user?.name}</p>
      </div>

      <div className="form-group">
        <label htmlFor="title">כותרת</label>
        <input
          id="title"
          name="title"
          className="form-control"
          value={formik.values.title}
          onChange={formik.handleChange}
        />
      </div>
<div className="form-group">
  <label htmlFor="subtitle">כותרת משנה</label>
  <input
    id="subtitle"
    name="subtitle"
    className="form-control"
    value={formik.values.subtitle}
    onChange={formik.handleChange}
  />
</div>

      <div className="form-group">
        <label htmlFor="content">תוכן</label>
        <textarea
          id="content"
          name="content"
          className="form-control"
          rows={4}
          value={formik.values.content}
          onChange={formik.handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">קטגוריה</label>
        <select
          id="category"
          name="category"
          className="form-control"
          value={formik.values.category}
          onChange={formik.handleChange}
        >
          <option value="חדשות">חדשות</option>
          <option value="מוזיקה">מוזיקה</option>
          <option value="מתכונים">מתכונים</option>
          <option value="בריאות">בריאות</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="image">קישור לתמונה</label>
        <input
          id="image"
          name="image"
          className="form-control"
          value={formik.values.image}
          onChange={formik.handleChange}
        />
      </div>

      <button type="submit" className="submit-button">הוסף כתבה</button>
    </form>
  );
};

export default AddArticles;



