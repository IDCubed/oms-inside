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

from django.db import models


class Question(models.Model):
	'''
	Represents a User Question
	'''
	id = models.AutoField(primary_key=True)
	text = models.TextField()
	label = models.CharField(max_length=50, help_text = 'a qusetion label for easy indetify it (subject)')
	question_choises = (
        ('boolean', 'a yes/no question'),
        ('open', 'an open question'),
        ('numeric', 'numeric question'),
    )
	response_type = models.CharField(max_length=7,
                                      choices=question_choises,
                                      default='boolean')
	send_time = models.TimeField()
	time_zone = models.CharField(max_length=3,
									choices= (('EST','Eastern Timezone'), ('GMT', 'Greenwich Mean Time'),),
									default='EST')
	active = models.BooleanField(default=True)
	last_sent = models.DateTimeField(auto_now_add=True)
	

class Answer(models.Model):
	'''
	Represents a User Answer
	'''
	#question = models.ForeignKey(Question,
    #    related_name='question',
    #    help_text = 'The Question that this is the answer to')
	questionid = models.ForeignKey(Question)
	answer = models.TextField(help_text='The Answer text or value')
	latitude = models.FloatField()
	longitude = models.FloatField()
	answer_date = models.DateTimeField(auto_now_add=True, blank=True)

	@classmethod
	def get_latest(cls):
	    '''
	    Get the latest model object, by id
	    '''
	    latest_query = cls.objects.all().order_by('-id')
	    try:
	        return latest_query[0]
	    except IndexError:
	        return None

class UserDetails(models.Model):
	'''
	Represent the User information (email, number)
	'''
	email = models.CharField(max_length=100, help_text = 'The user email address')
	number = models.CharField(max_length=100, help_text = 'The user phone number')
