from django.db.models import Sum, F
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Produit, Commande, LigneCommande
from .serializers import ProduitSerializer, CommandeSerializer, LigneCommandeSerializer

from uuid import uuid4
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAdminUser




# --- Produits ---


class ProduitListCreate(generics.ListCreateAPIView):
    """
    GET: liste des produits actifs
    POST (admin): crée un produit
    """
    serializer_class = ProduitSerializer

    def get_queryset(self):
        # on montre les actifs en front; les admins peuvent voir tout en admin
        qs = Produit.objects.all()
        if self.request.method == 'GET' and not self.request.user.is_staff:
            qs = qs.filter(actif=True)
        return qs.order_by('nom')

    def get_permissions(self):
        return [permissions.IsAdminUser()] if self.request.method == 'POST' else [permissions.AllowAny()]


class ProduitDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Produit.objects.all()
    serializer_class = ProduitSerializer

    def get_permissions(self):
        # lecture publique, écriture réservée admin
        if self.request.method in ['PUT','PATCH','DELETE']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

# --- Commandes ---


class CommandeCreate(generics.CreateAPIView):
    """
    POST (auth): crée une commande brouillon appartenant à l'utilisateur
    """
    serializer_class = CommandeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, statut='brouillon', total=0)


class LigneCreate(generics.CreateAPIView):
    """
    POST (auth): ajoute une ligne à une commande
    body: { produit: <id>, quantite: <int> }
    """
    serializer_class = LigneCommandeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        commande_id = self.kwargs['pk']
        produit = serializer.validated_data['produit']
        quantite = serializer.validated_data['quantite']

        # on fige le prix courant du produit
        ligne = serializer.save(commande_id=commande_id, prix_unitaire=produit.prix)

        # recalcul du total
        total = LigneCommande.objects.filter(commande_id=commande_id).aggregate(
            s=Sum(F('prix_unitaire') * F('quantite'))
        )['s'] or 0
        Commande.objects.filter(id=commande_id).update(total=total)


class ConfirmerCommande(APIView):
    """
    POST (auth): confirme la commande -> contrôle stock, décrémentation, statut=confirmee
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            commande = Commande.objects.prefetch_related('lignes__produit').get(pk=pk, user=request.user)
        except Commande.DoesNotExist:
            return Response({'detail': 'Commande introuvable.'}, status=404)

        if commande.statut == 'confirmee':
            return Response({'detail': 'Déjà confirmée.'})

        # contrôle de stock
        for l in commande.lignes.all():
            if l.quantite > l.produit.stock:
                return Response({'code': 'STOCK_INSUFFISANT', 'produit': l.produit.nom}, status=409)

        # décrémentation de stock
        for l in commande.lignes.all():
            p = l.produit
            p.stock = max(0, p.stock - l.quantite)
            p.save(update_fields=['stock'])

        commande.statut = 'confirmee'
        commande.date_confirmation = timezone.now()
        commande.save(update_fields=['statut', 'date_confirmation'])

        return Response(CommandeSerializer(commande).data)


@api_view(["POST"])
@permission_classes([IsAdminUser])          # upload réservé à l’admin
@parser_classes([MultiPartParser, FormParser])
def upload_image(request):
    """
    Champ attendu: 'file'
    Sauvegarde sous MEDIA_ROOT/uploads/ et renvoie { "url": "http://.../media/uploads/xxx.png" }
    """
    f = request.FILES.get("file")
    if not f:
        return Response({"detail": "No file"}, status=status.HTTP_400_BAD_REQUEST)

    ext = (f.name.rsplit(".", 1)[-1] or "bin").lower() if "." in f.name else "bin"
    filename = f"{uuid4().hex}.{ext}"
    path = default_storage.save(f"products/{filename}", ContentFile(f.read()))
    url = request.build_absolute_uri(settings.MEDIA_URL + path.replace("\\", "/"))
    return Response({"url": url}, status=status.HTTP_201_CREATED)
