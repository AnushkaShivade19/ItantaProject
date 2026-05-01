class Database:
    def __init__(self):
        self.links_table = []

    def test_database_tests(self):
        return True

    def verify_links_table_unique_alias(self):
        aliases = [link['alias'] for link in self.links_table]
        if len(aliases) != len(set(aliases)):
            raise Exception('Links table has duplicate aliases')