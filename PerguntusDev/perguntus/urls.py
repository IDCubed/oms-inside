from django.conf.urls.defaults import *
from django.conf.urls import patterns, include, url
from django.contrib import admin
from tastypie.api import Api
from modules.perguntus_backend.api import QuestionResource, AnswerResource 


# Uncomment the next two lines to enable the admin:
admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(QuestionResource())
v1_api.register(AnswerResource())


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'perguntus.views.home', name='home'),
    # url(r'^perguntus/', include('perguntus.foo.urls')),
    url(r'^api/', include(v1_api.urls)),
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
