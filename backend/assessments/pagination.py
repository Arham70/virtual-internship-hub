from rest_framework.pagination import PageNumberPagination


class DomainQuestionPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 20
