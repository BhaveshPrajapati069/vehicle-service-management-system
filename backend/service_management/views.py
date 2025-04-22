from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from django.utils.timezone import now
from .models import Component, Vehicle, Issue, Service, Payment
from .serializers import *

class ComponentViewSet(viewsets.ModelViewSet):
    queryset = Component.objects.all()
    serializer_class = ComponentSerializer

class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer

class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    
    def perform_create(self, serializer):
        service = serializer.validated_data['service']
        total_price = service.get_total_cost()
        serializer.save(total_price=total_price)

@api_view(['GET'])
def revenue_summary(request):
    today = now().date()
    current_month = today.month
    current_year = today.year

    daily_payments = Payment.objects.filter(paid_on__date=today)
    monthly_payments = Payment.objects.filter(paid_on__year=current_year, paid_on__month=current_month)
    yearly_payments = Payment.objects.filter(paid_on__year=current_year)

    daily_total = daily_payments.aggregate(total=Sum('total_price'))['total'] or 0
    monthly_total = monthly_payments.aggregate(total=Sum('total_price'))['total'] or 0
    yearly_total = yearly_payments.aggregate(total=Sum('total_price'))['total'] or 0

    print(f"🧾 Daily: {daily_payments.count()} payments")
    print(f"🧾 Monthly: {monthly_payments.count()} payments")
    print(f"🧾 Yearly: {yearly_payments.count()} payments")

    return Response({
        "daily": daily_total,
        "monthly": monthly_total,
        "yearly": yearly_total
    })