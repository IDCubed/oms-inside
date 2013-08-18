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
This module contains transforms that can be used with the API Transformer
feature. A transform receives an object as its first argument and a dictionary
of attributes as its second argument. The transform can then use the attributes
to alter the object or to remove it entirely from the dataset by returning
None.
'''
from haversine import haversine

from modules.perguntus_backend.models import Answer

def hide_distant(answer, attrs):
    '''
    Removes answers that are beyond a certain range

    This function removes the answer if it is beyond a certain distance from
    the location of the most recent answer.

    :param answer: answer with location data
    :type answer: Answer

    :param attrs: dict of attributes containing 'lat_range' and 'lon_range'
    :type attrs: dict

    :returns: answer from first argument or None, based on proximity
    :rtype: Answer or None
    '''
    latest_answer = Answer.get_latest()
    if latest_answer is None:
        return
    a = (latest_answer.latitude, latest_answer.longitude)
    b = (answer.latitude, answer.longitude)
    if haversine(a, b) < attrs['range']:
        return answer
