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

from django.template import RequestContext
from django.shortcuts import get_object_or_404
from django.shortcuts import render_to_response

# Create your views here.
def indexpage(request,
                 task_id=None,
                 template_name='gpsui.html',):
    '''
    welcome newly registered user. at present this only really implements a hack
    to get the pkid of the task just spawned, post user registration, to js to 
    query the task API for status. silly. but necessary for the moment.

    '''
    context = RequestContext(request)
    #context['task_id'] = task_id

    return render_to_response(template_name,
                              context_instance=context)