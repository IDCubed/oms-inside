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
This module contains some simple tests for the Connector sandbox.  These tests
are intended to exercise the two endpoints exposed by the Connector during
operation, one for downloading the configuration, and one for uploading the
database file from Funf Journal.
"""
import json

import requests
from django.conf import settings
from django.utils import unittest

JSON_MEDIA_TYPE = 'application/json'

class ConnectorTestCase(unittest.TestCase):

    def test_config(self):
        """Tests the configuration

        This test method checks that the Funf Journal configuration can be
        downloaded

        :param self: instance
        :type self: ConnectorTestCase

        :returns: -
        :rtype: None
        """
        response = requests.get(settings.CONFIG_ENDPOINT)

        self.assertEqual(response.status_code, 200)
        self.assertIn(JSON_MEDIA_TYPE, response.headers['Content-Type'])

    def test_upload(self):
        """Tests uploading of database files

        This test method checks that database files can be uploaded from Funf
        Journal

        :param self: instance
        :type self: ConnectorTestCase

        :returns: -
        :rtype: None
        """
        response = requests.post(settings.UPLOAD_ENDPOINT)
        try:
            body = json.loads(response.text)
        except ValueError:
            body = None

        self.assertEqual(response.status_code, 200)
        self.assertIn(JSON_MEDIA_TYPE, response.headers['Content-Type'])
        self.assertEqual(body, {'status': 'success'})
