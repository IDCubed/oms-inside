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

import unittest

from mock import Mock

import validation

RESP_OK  = '{"expiration":"2020-01-01T00:00:01+0000","user_id":"id3oicserver"}'
RESP_EXP = '{"expiration":"2010-01-01T00:00:01+0000","user_id":"id3oicserver"}'


class Constance(object):
    """
    dummy django-constance object
    """
    TOKENSCOPE_ENDPOINT = ''

class Request(object):
    """
    dummy request
    """
    def __init__(self, GET=None, META=None):
        self.GET = GET or {}
        self.META = META or {}

class Response(object):
    """
    dummy response from the OIC server
    """
    def __init__(self, status_code=200, text=RESP_OK):
        self.status_code = status_code
        self.text = text

validation.config = Constance()


class TestOpenIdConnectDecorator(unittest.TestCase):

    def test_query_string_token_success(self):
        """
        Query string contains valid access token
        """
        response = Response()
        validation.requests.get = Mock(return_value=response)

        request = Request(GET={'access_token': 'foo'})
        self.assertTrue(validation.is_access_token_valid(request))

    def test_bearer_token_success(self):
        """
        Authorization header contains valid access token
        """
        response = Response()
        validation.requests.get = Mock(return_value=response)

        request = Request(META={'HTTP_AUTHORIZATION': 'Bearer foo'})
        self.assertTrue(validation.is_access_token_valid(request))

    def test_missing_token(self):
        """
        No token in the request
        """
        request = Request()
        self.assertFalse(validation.is_access_token_valid(request))

    def test_missing_query_string_token(self):
        """
        Blank access token in the query string
        """
        request = Request(GET={'access_token': ''})
        self.assertFalse(validation.is_access_token_valid(request))

    def test_missing_bearer_token_1(self):
        """
        Blank Authorization header
        """
        request = Request(META={'HTTP_AUTHORIZATION': ''})
        self.assertFalse(validation.is_access_token_valid(request))

    def test_missing_bearer_token_2(self):
        """
        Blank access token in the Authorization header
        """
        request = Request(META={'HTTP_AUTHORIZATION': 'Bearer'})
        self.assertFalse(validation.is_access_token_valid(request))

    def test_bad_status_code(self):
        """
        OIC server returns a non-2xx status code
        """
        response = Response(status_code=500)
        validation.requests.get = Mock(return_value=response)

        request = Request(GET={'access_token': 'foo'})
        self.assertFalse(validation.is_access_token_valid(request))

    def test_token_expired(self):
        """
        OIC server reports a token expiration date in the past
        """
        response = Response(text=RESP_EXP)
        validation.requests.get = Mock(return_value=response)

        request = Request(GET={'access_token': 'foo'})
        self.assertFalse(validation.is_access_token_valid(request))

    def test_missing_response_field(self):
        """
        OIC server is missing the "expiration" field
        """
        response = Response(text='{"user_id":"id3oicserver"}')
        validation.requests.get = Mock(return_value=response)

        request = Request(GET={'access_token': 'foo'})
        self.assertFalse(validation.is_access_token_valid(request))

    def test_non_json_response(self):
        """
        OIC server returns non-JSON response
        """
        response = Response(text='bar')
        validation.requests.get = Mock(return_value=response)

        request = Request(GET={'access_token': 'foo'})
        self.assertFalse(validation.is_access_token_valid(request))

if __name__ == '__main__':
    unittest.main()
