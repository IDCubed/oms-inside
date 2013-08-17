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
This module contains the view handlers for the Proximity sandbox
"""
import json

import requests
from constance import config
from django.conf import settings
from django.http import HttpResponse, HttpResponseNotAllowed

from modules.oic_validation.decorators import validate_access_token
from modules.prox_sandbox.models import ClientLocation

JSON_MEDIA_TYPE = 'application/json'

@validate_access_token
def proximity(request):
    """Determines whether the current location is close to a preset location

    This view function determines whether the user's current location (as
    reported by the PDS via the Resource Server) is close to a predetermined
    location, stored locally. If any of the information required to make this
    determination cannot be obtained, a negative answer is returned.

    :param request: HTTP request
    :type request: HttpRequest

    :returns: HTTP response with a proximity determination
    :rtype: HttpResponse
    """
    if request.method == 'GET':
        headers = {'Authorization': 'Bearer ' + config.ACCESS_TOKEN}
        r = requests.get(settings.LOCATION_ENDPOINT, headers=headers)
        if r.status_code / 100 != 2:
            return HttpResponse(json.dumps({'are_proximate': False}),
                                content_type=JSON_MEDIA_TYPE)
        rdata = json.loads(r.text)
        try:
            lat = rdata['objects'][0]['latitude']
            lon = rdata['objects'][0]['longitude']
        except IndexError:
            return HttpResponse(json.dumps({'are_proximate': False}),
                                content_type=JSON_MEDIA_TYPE)

        client_location = ClientLocation.get_latest()
        if client_location is None:
            return HttpResponse(json.dumps({'are_proximate': False}),
                                content_type=JSON_MEDIA_TYPE)

        proximate = False
        lat_range = client_location.latitude_range or config.LATITUDE_RANGE
        lon_range = client_location.longitude_range or config.LONGITUDE_RANGE
        if (-lat_range < lat - client_location.latitude < lat_range and
            -lon_range < lon - client_location.longitude < lon_range):
            proximate = True
        return HttpResponse(json.dumps({'are_proximate': proximate}),
                            content_type=JSON_MEDIA_TYPE)

    return HttpResponseNotAllowed(permitted_methods=['GET'])
