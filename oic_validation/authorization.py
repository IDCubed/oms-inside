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

from tastypie.authorization import Authorization
from tastypie.exceptions import Unauthorized

from validation import is_access_token_valid

class OpenIdConnectAuthorization(Authorization):
    """
    Tastypie Authorization class for validating OpenID Connect access tokens

    This is a thin wrapper around
    ``oic_validation.validation.is_access_token_valid``.
    This class supports both the ``is_authorized`` interface, which was used
    in versions <=0.9.11 as well as the ``*_list`` and ``*_detail`` interface,
    which is in use since 0.9.12 . The create_list method has been omitted
    here since it is not used by Tastypie.
    """
    def is_authorized(self, request, object=None):
        """
        Returns ``True`` if the access token is valid and ``False`` otherwise.
        """
        return is_access_token_valid(request)

    def read_list(self, object_list, bundle):
        """
        Returns a list of all the objects a user is allowed to read.
        """
        if is_access_token_valid(bundle.request):
            return object_list
        raise Unauthorized

    def read_detail(self, object_list, bundle):
        """
        Returns either ``True`` if the user is allowed to read the object in
        question or throw ``Unauthorized`` if they are not.
        """
        if is_access_token_valid(bundle.request):
            return True
        raise Unauthorized

    def create_detail(self, object_list, bundle):
        """
        Returns either ``True`` if the user is allowed to create the object in
        question or throw ``Unauthorized`` if they are not.
        """
        if is_access_token_valid(bundle.request):
            return True
        raise Unauthorized

    def update_list(self, object_list, bundle):
        """
        Returns a list of all the objects a user is allowed to update.
        """
        if is_access_token_valid(bundle.request):
            return object_list
        raise Unauthorized

    def update_detail(self, object_list, bundle):
        """
        Returns either ``True`` if the user is allowed to update the object in
        question or throw ``Unauthorized`` if they are not.
        """
        if is_access_token_valid(bundle.request):
            return True
        raise Unauthorized

    def delete_list(self, object_list, bundle):
        """
        Returns a list of all the objects a user is allowed to delete.
        """
        if is_access_token_valid(bundle.request):
            return object_list
        raise Unauthorized

    def delete_detail(self, object_list, bundle):
        """
        Returns either ``True`` if the user is allowed to delete the object in
        question or throw ``Unauthorized`` if they are not.
        """
        if is_access_token_valid(bundle.request):
            return True
        raise Unauthorized
