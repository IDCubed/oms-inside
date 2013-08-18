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
This module contains the Arbiter, a class which drives the API Transformer
feature.
'''

class Arbiter(object):
    '''
    The Arbiter drives the API Transformer feature.

    It contains a single method that accepts the list of objects to act on,
    the rules by which to act, and state to inform the rules.

    This class should be instantiated as an attribute of a Tastypie
    Authorization class.
    '''

    def arbitrate(self, object_list, rules, state):
        '''
        This method arbitrates the API transformation on object_list using
        the rules and state.

        The method iterates over object_list, applying all the rules before
        proceeding to the next object. For each rule, all of its functions are
        applied in order. If during this process the object is filtered out
        completely, the processing skips immediately to the next object.

        :param self: instance
        :type self: Arbiter
        :param object_list: objects to transform
        :type object_list: QuerySet
        :param rules: rules that govern the transformation process
        :type rules: list
        :param state: the state that is fed into the rules
        :type state: (varies)

        :returns: transformed objects
        :rtype: list
        '''
        new_object_list = []
        for obj in object_list:
            for rule in rules:
                r = rule()
                funcs, attrs = r.evaluate(state)
                for func in funcs:
                    obj = func(obj, attrs)
                    if obj is None:
                        break
                if obj is None:
                    break
            if obj is not None:
                new_object_list.append(obj)
        return new_object_list
