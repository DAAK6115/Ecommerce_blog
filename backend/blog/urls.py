from django.urls import path
from .views import upload_image, ArticleListCreate, ArticleDetail, CommentListCreate

urlpatterns = [
    path('', ArticleListCreate.as_view(), name='article-list-create'),
    path('<int:pk>/', ArticleDetail.as_view(), name='article-detail'),
    path('<int:pk>/commentaires/', CommentListCreate.as_view(), name='comment-list-create'),
    path('upload-image/', upload_image, name='blog-upload-image'),
]
