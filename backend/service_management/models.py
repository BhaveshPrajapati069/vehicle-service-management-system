from django.db import models

class Component(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    is_repairable = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name 
    
class Vehicle(models.Model):
    vin = models.CharField(max_length=100, unique=True)
    owner_name = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.model} ({self.vin})"

class Issue(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    description = models.TextField()
    reported_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.description

class Service(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE)
    component = models.ForeignKey(Component, on_delete=models.SET_NULL, null=True, blank=True)
    use_new = models.BooleanField(default=False)
    labor_cost = models.FloatField()
    service_date = models.DateTimeField(auto_now_add=True)

    def get_total_cost(self):
        if self.use_new and self.component:
            return self.labor_cost + self.component.price
        return self.labor_cost

    def __str__(self):
        return f"Service for {self.issue} on {self.service_date.strftime('%Y-%m-%d')}"

class Payment(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    total_price = models.FloatField()
    paid_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment of Rs. {self.total_price} on {self.paid_on.strftime('%Y-%m-%d')}"
