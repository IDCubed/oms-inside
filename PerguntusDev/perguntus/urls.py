from django.conf.urls.defaults import *
from django.conf.urls import patterns, include, url
from django.contrib import admin
from tastypie.api import Api
from modules.perguntus_backend.api import QuestionResource, AnswerResource, UserDetailsResource
from modules.state_generator.api import PerguntusStateResource
from django.views.generic import TemplateView
from modules.perguntus_backend.views import CheckQuestionsView, SendQuestionView


# Uncomment the next two lines to enable the admin:
admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(QuestionResource())
v1_api.register(AnswerResource())
v1_api.register(UserDetailsResource())
v1_api.register(PerguntusStateResource())

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'perguntus.views.home', name='home'),
    # url(r'^perguntus/', include('perguntus.foo.urls')),
    url(r'^api/', include(v1_api.urls)),
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^admin/', include(admin.site.urls)),
    
    url(r'^$', TemplateView.as_view(template_name='dashboard.html')name="dashboard"),
    url(r'^edit.*', TemplateView.as_view(template_name='edit.html'),name="edit"),
    url(r'^sharing.*', TemplateView.as_view(template_name='share.html'),name="share"),
    url(r'^settings.*', TemplateView.as_view(template_name='settings.html'),name="settings"),
    url(r'^console/$', TemplateView.as_view(template_name='console.html'),name="console"),
    url(r'^questionform.*', TemplateView.as_view(template_name='questionform.html'),name="questionform"),
    url(r'^mobile.*', TemplateView.as_view(template_name='mobile.html'),name="mobile"),
    
    url(r'^send/$', SendQuestionView.as_view(), name='send'),
    url(r'^check/$', CheckQuestionsView.as_view(), name='check_questions'),
)
