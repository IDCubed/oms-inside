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

"""
This module contains the view handlers for the Resource Server sandbox
"""
import requests
from django.conf import settings
from django.http import HttpResponse, HttpResponseNotAllowed
from django.views.decorators.csrf import csrf_exempt
from constance import config

from modules.oic_validation.decorators import validate_access_token

JSON_MEDIA_TYPE = 'application/json'

@csrf_exempt # turn off CSRF protection to allow POSTing
@validate_access_token
def home(request):
    """Forwards requests to PDS

    This view function passes through GET and POST requests to the PDS.

    :param request: HTTP request
    :type request: HttpRequest

    :returns: HTTP response from the PDS
    :rtype: HttpResponse
    """
    # Get the full path, which always begins with "/Resource" due to uWSGI
    path = request.get_full_path()
    if path.startswith('/' + settings.INSTANCE_NAME):
        # Remove "/Resource" prefix from the path
        path = path.replace('/' + settings.INSTANCE_NAME, '', 1)
    url = settings.PDS_SERVER_URL + path
    headers = {'Authorization': 'Bearer ' + config.ACCESS_TOKEN}
    if request.method == 'GET':
        r = requests.get(url, headers=headers)
        return HttpResponse(r.text, content_type=r.headers['Content-Type'],
                            status=r.status_code)
    elif request.method == 'POST':
        headers['Content-Type'] = JSON_MEDIA_TYPE
        r = requests.post(url, data=request.body, headers=headers)
        return HttpResponse(status=r.status_code)
    return HttpResponseNotAllowed(permitted_methods=['GET', 'POST'])
