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

from constance import config
from django.conf import settings

from oic_validation import test

class AccessTokenTestCase(test.OicAccessTokenTestCaseMixin):
    """
    Test case to validate the access token
    """
    access_token = config.ACCESS_TOKEN
    tokenscope_endpoint = config.TOKENSCOPE_ENDPOINT

class GpsDemoTestCase(test.EndpointTestCaseMixin):
    """
    Test case for the GPSDemo application
    """

    def test_pds_location_endpoint(self):
        """
        Test the location endpoint at the PDS

        :param self: instance
        :type self: GpsDemoTestCase

        :returns: -
        :rtype: None
        """
        endpoint = settings.PDS_LOCATION_ENDPOINT
        access_token = config.ACCESS_TOKEN
        self.assertValidGetOicJsonEndpoint(endpoint, access_token)

    def test_resource_server_location_endpoint(self):
        """
        Test the location endpoint at the Resource Server

        :param self: instance
        :type self: GpsDemoTestCase

        :returns: -
        :rtype: None
        """
        endpoint = settings.RESOURCE_SERVER_LOCATION_ENDPOINT
        access_token = config.ACCESS_TOKEN
        self.assertValidGetOicJsonEndpoint(endpoint, access_token)

    def test_client_location_endpoint(self):
        """
        Test the client location endpoint

        :param self: instance
        :type self: GpsDemoTestCase

        :returns: -
        :rtype: None
        """
        endpoint = settings.CLIENT_LOCATION_ENDPOINT
        access_token = config.ACCESS_TOKEN
        self.assertValidGetOicJsonEndpoint(endpoint, access_token)

    def test_proximity_endpoint(self):
        """
        Test the proximity endpoint

        :param self: instance
        :type self: GpsDemoTestCase

        :returns: -
        :rtype: None
        """
        endpoint = settings.PROXIMITY_ENDPOINT
        access_token = config.ACCESS_TOKEN
        self.assertValidGetOicJsonEndpoint(endpoint, access_token)

    def test_config_endpoint(self):
        """
        Test the Funf Journal configuration

        :param self: instance
        :type self: GpsDemoTestCase

        :returns: -
        :rtype: None
        """
        endpoint = settings.CONFIG_ENDPOINT
        access_token = config.ACCESS_TOKEN
        self.assertValidGetOicJsonEndpoint(endpoint, access_token)
