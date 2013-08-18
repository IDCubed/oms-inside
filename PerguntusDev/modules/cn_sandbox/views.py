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

"""
This module contains the view handlers and supporting code for the Connector
sandbox.  This includes an endpoint from which Funf Journal downloads its
configuration and another to which it uploads a database file with location
information.
"""
import json
import os
import sqlite3

from constance import config as constance_config
from django.conf import settings
from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import requests

# token validation is currently unused because the access tokens are too long
# and unwieldy to use with Funf Journal
from modules.oic_validation.decorators import validate_access_token

JSON_MEDIA_TYPE = 'application/json'
UPLOAD_DIR = 'databases/'
LOCATION_PROBE = 'edu.mit.media.funf.probe.builtin.SimpleLocationProbe'

CONFIG_FILE = 'funf_config.json.tpl'

#@validate_access_token  # currently unused (see note at object import)
def config(request):
    """Serves the Funf Journal config file

    This view function returns the Funf Journal configuration in JSON format.
    Funf Journal must be manually configured to point to this function's URL
    using the "Link to Server" functionality, at which point it will GET the
    configuration.  The configuration specifies how often Funf Journal should
    update its configuration ("update").

    An example configuration:

    .. code-block:: python

        {
            "name": "example",
            "version": 1,
            "update": {
                "url": "https:\/\/registry.idhypercubed.org\/Connector\/c\/",
                "@schedule": {
                    "interval": 600
                }
            },
            "archive": {
                "@schedule": {
                    "interval": 600
                }
            },
            "upload": {
                "url": "https:\/\/registry.idhypercubed.org\/Connector\/u\/",
                "@schedule": {
                    "interval": 60
                }
            },
            "data": [
                {
                    "@type": "edu.mit.media.funf.probe.builtin.SimpleLocationProbe",
                    "@schedule": {
                        "interval": 60
                    },
                    "maxWaitTime": 30,
                    "goodEnoughAccuracy": 50
                }
            ]
        }

    :param request: HTTP request
    :type request: HttpRequest

    :returns: HTTP response with the Funf Journal configuration
    :rtype: HttpResponse
    """
    context = {'config_url': settings.FUNF_CONFIG_ENDPOINT,
               'upload_url': settings.FUNF_UPLOAD_ENDPOINT}
    return render_to_response(CONFIG_FILE, context,
                              content_type=JSON_MEDIA_TYPE)

@csrf_exempt  # turn off CSRF protection to allow POSTing
#@validate_access_token  # currently unused (see note at object import)
def upload(request):
    """Receives and processes a database file with location information

    This view function receives a SQLite3 database file from Funf Journal, and
    the file is saved locally.  The database contains a table called "data"
    with location information from the Funf Journal location probe.  The
    location information is extracted and forwarded to the Resource Server.

    :param request: HTTP request with the database file
    :type request: HttpRequest

    :returns: HTTP response with the status in JSON format
    :rtype: HttpResponse
    """
    try:
        uploaded_file = request.FILES['uploadedfile']
        file_path = UPLOAD_DIR + uploaded_file.name
        write_file(file_path, uploaded_file)  # store the database file to disk

        query_tpl = "select value from data where name = '{}';"
        con = sqlite3.connect(file_path)
        cur = con.cursor()
        cur.execute(query_tpl.format(LOCATION_PROBE))
        for row in cur:
            dp = json.loads(row[0])
            lat = dp['mLatitude']
            lon = dp['mLongitude']
            acc = dp['mAccuracy']
            alt = dp['mAltitude']
            ts  = dp['timestamp']
            body = {'latitude': lat, 'longitude': lon, 'radius': acc,
                    'altitude': alt, 'timestamp': ts}

            # POST the location information to the Resource Server
            headers = {'Content-Type': JSON_MEDIA_TYPE,
                       'Authorization': 'Bearer ' +
                                        constance_config.ACCESS_TOKEN}
            requests.post(settings.LOCATION_ENDPOINT, data=json.dumps(body),
                          headers=headers)
    except Exception as e:
        print e
    finally:
        return HttpResponse(json.dumps({'status': 'success'}),
                            content_type=JSON_MEDIA_TYPE)

def write_file(filename, fileobj):
    """Copies fileobj to a file at path filename

    This function copies the contents of fileobj to a file at path filename.
    It is used to store the uploaded database file to disk.

    The file is adapted from the "write_file" function in
    https://github.com/IDCubed/OMS-ResourceServer/blob/master/resourceServer/apps/connectors/funf/views.py

    :param filename: path of file to create on disk
    :type filename: str
    :param fileobj: an uploaded file to copy
    :type fileobj: UploadedFile

    :returns: -
    :rtype: None
    """
    if not os.path.exists(UPLOAD_DIR):
        os.mkdir(UPLOAD_DIR)
    with open(filename, 'wb') as output_file:
        while True:
            chunk = fileobj.read(1024)
            if not chunk:
                break
            output_file.write(chunk)
