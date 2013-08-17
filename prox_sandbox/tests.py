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

import os.path
import unittest

from constance import config
from django.conf import settings

from modules.oic_validation import test

class AccessTokenTestCase(test.OicAccessTokenTestCaseMixin):
    """
    Test case to validate the access token
    """
    access_token = config.ACCESS_TOKEN
    tokenscope_endpoint = config.TOKENSCOPE_ENDPOINT

class ClientLocationEndpointTestCase(test.OicEndpointTestCaseMixin):
    """
    Test case to check the OIC-protected client location endpoint
    """
    endpoint = settings.CLIENT_LOCATION_ENDPOINT

class ProximityEndpointTestCase(test.OicEndpointTestCaseMixin):
    """
    Test case to check the OIC-protected proximity endpoint
    """
    endpoint = settings.PROXIMITY_ENDPOINT

class ProximityTestCase(unittest.TestCase):
    """
    Test case for the Proximity sandbox application
    """

    def test_database(self):
        """
        Check that the database file exists

        :param self: instance
        :type self: ProximityTestCase

        :returns: -
        :rtype: None
        """
        self.assertTrue(os.path.exists(settings.DB_NAME))
