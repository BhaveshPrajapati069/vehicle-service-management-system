from rest_framework import serializers
from .models import Component, Vehicle, Issue, Service, Payment

class ComponentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Component
        fields = '__all__'

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'

class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    issue_description = serializers.CharField(source='issue.description', read_only=True)
    vehicle_model = serializers.CharField(source='issue.vehicle.model', read_only=True)
    component_name = serializers.CharField(source='component.name', read_only=True)
    total_cost = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = '__all__'  # or list out the fields you want

    def get_total_cost(self, obj):
        return obj.get_total_cost()

class PaymentSerializer(serializers.ModelSerializer):
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())
    total_price = serializers.FloatField(read_only=True)  

    class Meta:
        model = Payment
        fields = '__all__'
