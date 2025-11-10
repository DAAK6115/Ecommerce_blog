from django.urls import path
from .views import (
    upload_image, ProduitListCreate, ProduitDetail,
    CommandeCreate, LigneCreate, ConfirmerCommande
)

urlpatterns = [
    # Produits
    path('', ProduitListCreate.as_view()),
    path('<int:pk>/', ProduitDetail.as_view()),

    # Commandes
    path('commandes/', CommandeCreate.as_view()),
    path('commandes/<int:pk>/lignes/', LigneCreate.as_view()),
    path('commandes/<int:pk>/confirmer/', ConfirmerCommande.as_view()),
    path('upload-image/', upload_image, name='shop-upload-image'),
]
