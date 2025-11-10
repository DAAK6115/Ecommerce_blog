from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

User = get_user_model()


class ProfileSerializer(serializers.ModelSerializer):
    # email unique côté API (sans toucher au modèle si tu n’as pas de CustomUser)
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    nom = serializers.CharField(source="last_name", required=False, allow_blank=True)
    prenom = serializers.CharField(source="first_name", required=False, allow_blank=True)
    actif = serializers.BooleanField(source="is_active", required=False)
    date_inscription = serializers.DateTimeField(source="date_joined", read_only=True)

    class Meta:
        model = User
        fields = ["nom", "prenom", "email", "actif", "date_inscription"]

    def update(self, instance, validated_data):
        # map champs renommés
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        if "is_active" in validated_data:
            instance.is_active = validated_data["is_active"]
        if "email" in validated_data:
            instance.email = validated_data["email"]
        instance.save()
        return instance


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField(min_length=3, max_length=150)
    password = serializers.CharField(min_length=6, write_only=True)
    nom = serializers.CharField(required=False, allow_blank=True, max_length=150)
    prenom = serializers.CharField(required=False, allow_blank=True, max_length=150)



class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
