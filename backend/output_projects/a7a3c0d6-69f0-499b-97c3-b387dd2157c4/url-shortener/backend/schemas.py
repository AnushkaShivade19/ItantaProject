from marshmallow import Schema, fields, validates, ValidationError
from marshmallow.validate import URL

class CreateLinkSchema(Schema):
    long_url = fields.Str(required=True, validate=URL())
    alias = fields.Str(required=True)

    @validates('long_url')
    def validate_long_url(self, value):
        if not value.startswith('http://') and not value.startswith('https://'):
            raise ValidationError('Invalid URL')

    @validates('alias')
    def validate_alias(self, value):
        if len(value) < 1:
            raise ValidationError('Alias must not be empty')

class LinkSchema(Schema):
    id = fields.Str(required=True)
    alias = fields.Str(required=True)
    short_url = fields.Str(required=True, validate=URL())

class LinkStatsSchema(Schema):
    id = fields.Str(required=True)
    long_url = fields.Str(required=True, validate=URL())
    hit_count = fields.Int(required=True)
    created_at = fields.Str(required=True)