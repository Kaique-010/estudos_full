from rest_framework import viewsets
from rest_framework.exceptions import NotFound

from .serializers import ClienteSerializer
from .pagination import ClientePagination
from .services.cliente_service import ClienteService


class ClienteViewSet(viewsets.ModelViewSet):
    serializer_class = ClienteSerializer
    pagination_class = ClientePagination

    def get_queryset(self):
        params = self.request.query_params

        return ClienteService.listar_todos(
            busca=params.get("busca", "").strip(),
            data_inicio=params.get("data_inicio"),
            data_fim=params.get("data_fim"),
            ordenacao=params.get("ordenacao", "id"),
        )

    def get_object(self):
        try:
            cliente = ClienteService.buscar_por_id(
                id=self.kwargs["pk"],
                ativo=True,
            )
        except Cliente.DoesNotExist:
            raise NotFound({
                "id": "O cliente não existe ou está inativo."
            })

        self.check_object_permissions(self.request, cliente)
        return cliente
