from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class ClientePagination(PageNumberPagination):
    page_size = 120
    max_page_size = 100
    page_size_query_param = "page_size"
    
    
    def get_paginated_response(self, data):
        return Response({
            "count": self.page.paginator.count,
            "page": self.page.number,
            "page_size": self.page_size,
            "total_pages": self.page.paginator.num_pages,
            "next": (
                self.page.next_page_number
                or None
            ),
            "previous": (
                self.page.previous_page_number
                or None
            ),
            "results": data,
            
        })
        
    @staticmethod
    def _validar_data(valor, campo):
        if not valor:
            return None

        data = parse_date(valor)

        if data is None:
            raise ValidationError({
                campo: "Informe uma data no formato YYYY-MM-DD."
            })

        return data