
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.scss';
import { Article } from '../../models/articles';
import { Outlet, useNavigate } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../myStore';
import { addToFavorite, removeFromFavorite } from '../../redux/Favoriteslice';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { setSelectedArticle } from '../../redux/articleslice';
import Delete from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import SearchBar from '../../components/SearchBar/SearchBar';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import  {setFavorites } from '../../redux/Favoriteslice';
import AdBanner from '../AdBanner/AdBanner'

const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorite.items);
  const [searchTerm, setSearchTerm] = useState('');
  const [latestArticle, setLatestArticle] = useState<Article | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);




  const fetchArticles = (title: string = '') => {
    axios.get('http://localhost:3001/articles', {
      params: { title_like: title }
    })
      .then(res => setArticles(res.data))
      .catch(err => console.error('שגיאה בטעינת כתבות:', err));
  };

  useEffect(() => {
    axios
      .get('http://localhost:3001/articles?_sort=datePublished&_order=desc&_limit=1')
      .then(res => setLatestArticle(res.data[0]))
      .catch(err => console.error('שגיאה בשליפת כתבה אחרונה:', err));
  }, []);

  useEffect(() => {
    fetchArticles(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    axios.get('http://localhost:3001/articles')
      .then(res => setArticles(res.data))
      .catch(err => console.error('שגיאה בטעינת כתבות:', err));
  }, []);

  const handleSearch = (value: string) => setSearchTerm(value);
  const handleLoadMore = () => setVisibleCount(prev => prev + 10);
const handleUditArticle = (article: Article) => {
  dispatch(setSelectedArticle(article));
  navigate(`/udit/articles/${article.id}`);
};
 const handleDeleteArticle = async (id: string) => {
  try {
    const reviewsRes = await axios.get(`http://localhost:3001/reviews?articleId=${id}`);
    const reviews = reviewsRes.data;

    await Promise.all(
      reviews.map(async (review: any) => {
        try {
          if (!review.id) return;
          const reviewId = String(review.id).trim();
          console.log('מוחקת review:', reviewId);
          await axios.delete(`http://localhost:3001/reviews/${reviewId}`);
        } catch (err) {
          console.error('שגיאה במחיקת תגובה:', review.id, err);
        }
      })
    );

    // מחיקת הכתבה עצמה
    await axios.delete(`http://localhost:3001/articles/${String(id).trim()}`);

    // עדכון המצב המקומי
    setArticles(prev => prev.filter(article => article.id !== id));

    // אם הכתבה שנמחקה היא הכתבה הראשית – ננקה גם אותה
    if (latestArticle?.id === id) {
      setLatestArticle(null);
    }
  } catch (err) {
    console.error('שגיאה במחיקת כתבה או תגובות:', err);
  }
};



  const goToArticle = (article: Article) => {
    dispatch(setSelectedArticle(article));
    navigate(`/articles/${article.id}`);
  };
  const roleNum = Number(user?.role);

  
const toggleFavorite = (e: React.MouseEvent, article: Article) => {
  e.stopPropagation();
  const isFav = favorites.some(f => f.id === article.id);
  const updatedFavorites = isFav
    ? favorites.filter(f => f.id !== article.id)
    : [...favorites, article];

  dispatch(setFavorites(updatedFavorites));
  localStorage.setItem(`favorites_${user?.id}`, JSON.stringify(updatedFavorites));
};

const filteredArticles = articles
  .filter(article => article.id !== latestArticle?.id || searchTerm !== '' && article.title.includes(searchTerm));
const isFavorite = latestArticle ? favorites.some(f => f.id === latestArticle.id) : false;

  return (
    <div className="homepage">
      <div className="content">
        
        <SearchBar onSearch={handleSearch} />

{latestArticle && searchTerm === '' && (
          
  <div className="featured-article" onClick={() => goToArticle(latestArticle)}>
    <img src={latestArticle.image} alt={latestArticle.title} />
    <div className="featured-content">
      <h2>{latestArticle.title}</h2>
      <p className="meta">
        {latestArticle.authorName} | {new Date(latestArticle.datePublished).toLocaleDateString('he-IL')}
      </p>
      <IconButton
                    className="favorite-btn"
                    onClick={(e) => toggleFavorite(e, latestArticle)}
                    color="error"
                  >
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>

                  {(roleNum === 1 || roleNum === 0) && (
                    <div>
                      <Box sx={{ position: "relative", marginBottom: 2 }}>
                        <IconButton
                          onClick={(e) => {    e.stopPropagation();

                            handleDeleteArticle(latestArticle.id)}}



                          color="error"
                          sx={{
                            position: "absolute",
                            left: 2,
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                     <IconButton 
  color="primary" 
  onClick={(e) => {
    e.stopPropagation(); // מונע את הלחיצה להגיע ל onClick של ההורה
    handleUditArticle(latestArticle);
  }}
>
  <EditIcon />
</IconButton>

                    </div>
                  )}
    </div>
    
  </div>
)}


        <div className="articles-grid">
          {filteredArticles.slice(0, visibleCount).map(article => {
            const isFavorite = favorites.some(f => f.id === article.id);
            return (
              <div key={article.id} className="article-card" onClick={() => goToArticle(article)}>
                <img src={article.image} alt={article.title} />
                <div className="card-body">
                  <h3>{article.title}</h3>
                  <p className="meta">{article.authorName} | {new Date(article.datePublished).toLocaleDateString('he-IL')}</p>
                  <IconButton
                    className="favorite-btn"
                    onClick={(e) => toggleFavorite(e, article)}
                    color="error"
                  >
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>

                  {(roleNum === 1 || roleNum === 0) && (
                    <div>
                      <Box sx={{ position: "relative", marginBottom: 2 }}>
                        <IconButton
                          // onClick={() => handleDeleteArticle(article.id)}
                            onClick={(e) => {
    e.stopPropagation();
    handleDeleteArticle(article.id);
  }}
                          color="error"
                          sx={{
                            position: "absolute",
                            left: 2,
                            top: "50%",
                            transform: "translateY(-50%)",
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                      <IconButton 
  color="primary" 
  onClick={(e) => {
    e.stopPropagation(); // מונע את הלחיצה להגיע ל onClick של ההורה
    handleUditArticle(article);
  }}
>
  <EditIcon />
</IconButton>

                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {visibleCount < articles.length && (
          <button className="load-more" onClick={handleLoadMore}>טען עוד</button>
        )}
         <div className="ad-sidebar">
        <AdBanner />
      </div>
      </div>
    </div>
  );
};

export default HomePage;
