from rest_framework import serializers


class CountrySerializer(serializers.Serializer):
    id = serializers.IntegerField()
    country_name = serializers.CharField(max_length=255)


class CitySerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    lat = serializers.FloatField()
    lng = serializers.FloatField()


class GraphSerializer(serializers.Serializer):
    graph = serializers.JSONField()
