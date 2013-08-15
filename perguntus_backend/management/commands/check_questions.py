from django.core.management.base import BaseCommand, CommandError
from modules.perguntus_backend.models import Question, Answer, UserDetails
from modules.perguntus_backend.check_questions import check_questions

class Command(BaseCommand):
    args = '<poll_id poll_id ...>'
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        self.stdout.write('starting to run on questions')
        check_questions(self)
        self.stdout.write('finished running on questions')
