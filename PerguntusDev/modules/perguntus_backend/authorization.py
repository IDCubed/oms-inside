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

'''
This module contains the Tastypie Authorization class for Perguntus' Answer
endpoint. This class uses the API Transformer feature.
'''
from tastypie.authorization import Authorization

from modules.arbiter import Arbiter
from modules.perguntus_backend.decorators import list_to_boolean

class DSAuthorization(Authorization):
    '''
    Tastypie Authorization class for Perguntus' Answer endpoint. It uses the
    API Transformer feature.
    '''

    arbiter = Arbiter()

    def read_list(self, object_list, bundle):
        return self.arbitrate(object_list)

    @list_to_boolean
    def read_detail(self, object_list, bundle):
        return self.arbitrate(object_list)

    # create_list (not used)

    def create_detail(self, object_list, bundle):
        return True

    def update_list(self, object_list, bundle):
        return self.arbitrate(object_list)

    @list_to_boolean
    def update_detail(self, object_list, bundle):
        return self.arbitrate(object_list)

    def delete_list(self, object_list, bundle):
        return self.arbitrate(object_list)

    @list_to_boolean
    def delete_detail(self, object_list, bundle):
        return self.arbitrate(object_list)

    def arbitrate(self, object_list):
        '''
        This method activates the Arbiter, passing in the objects, rules, and
        state.

        :param self: instance
        :type self: DSAuthorization
        :param object_list: objects to transform
        :type object_list: QuerySet

        :returns: transformed objects
        :rtype: list
        '''
        rules = self.resource_meta.rules
        state = self.resource_meta.state.get_latest()
        return self.arbiter.arbitrate(object_list, rules, state)
