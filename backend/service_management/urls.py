from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.response import Response
from rest_framework.reverse import reverse
from .views import *

router = DefaultRouter()
router.register(r'components', ComponentViewSet)
router.register(r'vehicles', VehicleViewSet)
router.register(r'issues', IssueViewSet)
router.register(r'services', ServiceViewSet)
router.register(r'payments', PaymentViewSet)

@api_view(['GET'])
def custom_api_root(request, format=None):
    return Response({
        'components': reverse('component-list', request=request, format=format),
        'vehicles': reverse('vehicle-list', request=request, format=format),
        'issues': reverse('issue-list', request=request, format=format),
        'services': reverse('service-list', request=request, format=format),
        'payments': reverse('payment-list', request=request, format=format),
        'revenue': reverse('revenue-summary', request=request, format=format),
    })


urlpatterns = [
    path('', custom_api_root),
    path('', include(router.urls)),
    path('revenue/', revenue_summary, name='revenue-summary'),
]
