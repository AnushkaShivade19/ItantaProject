import logging

db = None  # placeholder for the actual database connection

logger = logging.getLogger(__name__)


def get_hit_count(alias):
    try:
        return db.get_hit_count(alias)
    except ValueError as e:
        logger.error(f'Error getting hit count for alias {alias}: {e}')
        raise
    except Exception as e:
        logger.error(f'Error getting hit count for alias {alias}: {e}')
        raise