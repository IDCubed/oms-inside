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

import os
import sys
import pytz
from datetime import datetime, timedelta

from constance import config
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives

from modules.perguntus_backend.models import Question, Answer, UserDetails


def check_questions(self):
	print >>sys.stderr, 'Working on checking questions'
	all_questions = Question.objects.all()
	for question in all_questions:
		send_time = question.send_time
		last_sent = question.last_sent
		now_time = datetime.time(datetime.now())
		try:
			timezone_info = pytz.timezone(question.time_zone)
		except:
			#use default timezone if timezone not found for some reason
			timezone_info = pytz.timezone('EST')
			
		now_datetime = datetime.now(tz=timezone_info)
		
		print >>sys.stderr, 'checking now time: %s, and send_time: %s'%(now_time, send_time)
		#check if we need to send the message
		if now_time > send_time:
			#check if this is the first time this message is sent
			print >>sys.stderr, 'checking last_sent: %s, and now_datetime: %s'%(last_sent, now_datetime)
			if last_sent is None or last_sent < now_datetime:
				print >>sys.stderr, 'sending email'
				question.last_sent = now_datetime + timedelta(hours=24)
				question.save()
				MessageSubect = 'Please answer: %s' % (question.text)
				if self.request is not None:
					hostname = self.request.get_host()
				else:
					hostname = os.environ.get('HOSTNAME')
				from_email, to = 'noreply@%s'%hostname, config.EMAIL_RECIPIENT
				
				text_content = 'To answer your question click on the following link\r\nClick on this link: http://%s/%s/mobile/%s to answer: %s'%(hostname, config.PERGUNTUS_FRONTEND, question.id, question.text)
				html_content = 'To answer your question click on the following link<br /><a href="http://%s/%s/mobile/%s">%s</a>'%(hostname, config.PERGUNTUS_FRONTEND, question.id, question.text)
				
				msg = EmailMultiAlternatives(MessageSubect, text_content, from_email, [to])
				msg.attach_alternative(html_content, "text/html")
				msg.send()
