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
import unittest

from dateutil.parser import parse
import pytz
import requests

JSON_MEDIA_TYPE = 'application/json'

class OicAccessTokenTestCaseMixin(unittest.TestCase):
    """
    Mixin class to verify that an access token is valid

    This mixin checks the access token at the tokenscope endpoint, making sure
    to verify that it hasn't expired.

    This class requires that the inheriting class provide the class variables
    ``tokenscope_endpoint`` (a URL string) and ``access_token`` (a string).
    """

    def test_oic_token(self):
        """
        Check that the scope is valid and the OIC server is working properly

        :param self: instance
        :type self: OicAccessTokenTestCaseMixin

        :returns: -
        :rtype: None
        """
        headers = {'Authorization': 'Bearer ' + self.access_token}
        r = requests.get(self.tokenscope_endpoint, headers=headers)
        self.assertEqual(r.status_code, 200)
        try:
            reply = json.loads(r.text)
        except ValueError:
            self.fail('OIC server response is not valid JSON.')
        self.assertIn('expiration', reply)
        self.assertIn('user_id', reply)
        expires = parse(reply['expiration'])
        now = datetime.datetime.now(pytz.utc)  # "aware" datetime
        self.assertGreater(expires, now)

class OicEndpointTestCaseMixin(unittest.TestCase):
    """
    Mixin class to verify the behavior of an OIC-protected endpoint

    This mixin checks the that the endpoint is properly protected by OpenID
    Connect, focusing primarily on invalid authorizations.

    This class requires that the inheriting class provide the class variable
    ``endpoint`` (a URL string).
    """

    def test_oic_endpoint_no_authorization_header(self):
        """
        Test the case when the Authorization header isn't supplied

        :param self: instance
        :type self: OicEndpointTestCaseMixin

        :returns: -
        :rtype: None
        """
        r = requests.get(self.endpoint)
        self.assertEqual(r.status_code, 401)

    def test_oic_endpoint_no_access_token(self):
        """
        Test the case when no access token is supplied

        :param self: instance
        :type self: OicEndpointTestCaseMixin

        :returns: -
        :rtype: None
        """
        headers = {'Authorization': 'Bearer'}
        r = requests.get(self.endpoint, headers=headers)
        self.assertEqual(r.status_code, 401)

    def test_oic_endpoint_bad_access_token(self):
        """
        Test the case when a bad access token is supplied

        :param self: instance
        :type self: OicEndpointTestCaseMixin

        :returns: -
        :rtype: None
        """
        headers = {'Authorization': 'Bearer foo'}
        r = requests.get(self.endpoint, headers=headers)
        self.assertEqual(r.status_code, 401)

class EndpointTestCaseMixin(unittest.TestCase):
    """
    Mixin class for verifying OIC-protected endpoints

    This mixin is used for checking OIC-protected endpoints. It currently
    provides a single assertion method.
    """

    def assertValidGetOicJsonEndpoint(self, endpoint, access_token):
        """
        Assertion method for use in unit tests. It uses HTTP GET to check
        OIC-protected endpoints that respond with JSON.

        :param self: instance
        :type self: EndpointTestCaseMixin

        :returns: -
        :rtype: None
        """
        headers = {'Authorization': 'Bearer ' + access_token}
        r = requests.get(endpoint, headers=headers)
        sc = r.status_code
        ct = r.headers['Content-Type']
        if sc != 200:
            msg = 'Bad status code (%s) in response for %s' % (sc, endpoint)
            raise AssertionError(msg)
        if JSON_MEDIA_TYPE not in ct:
            msg = 'Non-JSON (%s) response for %s' % (ct, endpoint)
            raise AssertionError(msg)
        try:
            json.loads(r.text)
        except ValueError:
            msg = 'Invalid JSON in response for %s' % endpoint
            raise AssertionError(msg)
