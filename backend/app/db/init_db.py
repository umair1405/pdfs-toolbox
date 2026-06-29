"""
Dev convenience only. In staging/production, use Alembic migrations
(see backend/alembic.ini and Section 2 commands) instead of calling this.
"""
from app.db.base import Base
from app.db.session import engine

# Import every model so it registers on Base.metadata before create_all runs.
from app.models import user, file, conversion_job  # noqa: F401


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("Tables created.")
