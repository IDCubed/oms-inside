# Copyright (C) 2013 the Institute for Institutional Innovation by Data
# Driven Design Inc.
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE MASSACHUSETTS INSTITUTE OF
# TECHNOLOGY AND THE INSTITUTE FOR INSTITUTIONAL INNOVATION BY DATA
# DRIVEN DESIGN INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
# ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
# USE OR OTHER DEALINGS IN THE SOFTWARE.
#
# Except as contained in this notice, the names of the Institute for
# Institutional Innovation by Data Driven Design Inc. shall not be used in
# advertising or otherwise to promote the sale, use or other dealings
# in this Software without prior written authorization from the
# Institute for Institutional Innovation by Data Driven Design Inc.

'''
Django Admin settings for the perguntus_backend OMS module
'''
from django.contrib import admin

from modules.perguntus_backend.models import Question, Answer, UserDetails

class QuestionAdmin(admin.ModelAdmin):
    '''
    ModelAdmin for the QuestionAdmin model
    '''
    list_display = ['id', 'text', 'label', 'response_type', 'send_time',
                    'time_zone', 'active', 'last_sent']

class AnswerAdmin(admin.ModelAdmin):
    '''
    ModelAdmin for the AnswerAdmin model
    '''
    list_display = ['id', 'questionid', 'answer', 'latitude', 'longitude',
                    'answer_date']

class UserDetailsAdmin(admin.ModelAdmin):
    '''
    ModelAdmin for the UserDetailsAdmin model
    '''
    list_display = ['email', 'number']

admin.site.register(Question, QuestionAdmin)
admin.site.register(Answer, AnswerAdmin)
admin.site.register(UserDetails, UserDetailsAdmin)
