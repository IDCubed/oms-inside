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
# NONINFRINGEMENT. IN NO EVENT SHALL THE  MASSACHUSETTS INSTITUTE OF
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

import datetime
import json

import pytz
import requests
from dateutil.parser import parse
from constance import config

def is_access_token_valid(request):
    """
    Validate the request's access token with the OpenID Connect server.

    This function looks for the access token first in the query string, then in
    the headers.  Next, it passes the access token to the "tokenscope"
    endpoint.  When it receives the response, it first checks the status code,
    followed by the response format, and followed finally by the token
    expiration date.

    :param request: HTTP request
    :type request: HttpRequest

    :returns: determination as to whether the access token is valid
    :rtype: bool
    """
    access_token = request.GET.get('access_token', None)
    if not access_token:
        auth_header = request.META.get('HTTP_AUTHORIZATION', None)
        if not auth_header:
            return False
        try:
            access_token = auth_header.split()[1]
        except IndexError:
            return False
    r = requests.get(config.TOKENSCOPE_ENDPOINT,
                     headers={'Authorization': 'Bearer ' + access_token})
    if r.status_code / 100 != 2:  # 2xx success
        return False
    try:
        reply = json.loads(r.text)
    except ValueError:
        return False
    if 'expiration' in reply and 'user_id' in reply:
        expires = parse(reply['expiration'])
        now = datetime.datetime.now(pytz.utc)  # "aware" datetime
        if expires > now:
            return True
    return False
