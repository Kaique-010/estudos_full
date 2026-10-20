
from django.contrib import admin
from django.http import JsonResponse
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)
from django.urls import path, include


def health(request):
    return JsonResponse({'status': 'ok', 'service': 'django'})


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health', health),
    path('api/', include('cliente.urls')),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
    
]
