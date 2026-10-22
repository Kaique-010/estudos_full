from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet

# trailing_slash=False mantém o mesmo contrato dos outros backends
# (GET /api/clientes em vez de /api/clientes/), inclusive no POST.
router = DefaultRouter(trailing_slash=False)
router.register(
    r"clientes",
    ClienteViewSet,
    basename="cliente",
)



urlpatterns = router.urls
