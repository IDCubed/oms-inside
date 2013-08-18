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
This module contains models that represent the state used in the API
Transformer feature.
'''

from django.db import models

class PerguntusState(models.Model):
    '''
    Model representing the sharing state used by the API Transformer feature
    in the Perguntus TAB.

    The active field turns this state on or off, and the sharing_level field
    determines the allowable sharing distance from the location of the most
    recent Answer.
    '''
    active = models.BooleanField()
    sharing_level = models.PositiveIntegerField()

    class Meta:
        ordering = ['-id']

    @classmethod
    def get_latest(cls):
        '''
        This class method returns the most recent model object, by id.

        :param cls: class object
        :type cls: type

        :returns: the most recent model object, by id, or None if none exist
        :rtype: PerguntusState or None
        '''
        latest_query = cls.objects.all().order_by('-id')
        try:
            return latest_query[0]
        except IndexError:
            return None
